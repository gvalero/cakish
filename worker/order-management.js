export const FULFILLMENT_STATUSES = [
  "new",
  "confirmed",
  "baking",
  "ready",
  "collected",
  "cancelled",
];

const SIGNATURE_TOLERANCE_SECONDS = 300;
export const NOTIFICATION_CLAIM_LEASE_SECONDS = 15 * 60;
const encoder = new TextEncoder();

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(left, right) {
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  let difference = leftBytes.length ^ rightBytes.length;
  const length = Math.max(leftBytes.length, rightBytes.length);
  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index % leftBytes.length] || 0) ^
      (rightBytes[index % rightBytes.length] || 0);
  }
  return difference === 0;
}

export async function verifyStripeSignature(
  payload,
  signatureHeader,
  secret,
  nowSeconds = Math.floor(Date.now() / 1000),
) {
  if (!secret || !signatureHeader) return false;

  let timestamp;
  const signatures = [];
  for (const component of signatureHeader.split(",")) {
    const [key, value] = component.trim().split("=", 2);
    if (key === "t") timestamp = Number(value);
    if (key === "v1" && /^[a-f0-9]{64}$/i.test(value || "")) signatures.push(value.toLowerCase());
  }
  if (!Number.isInteger(timestamp) || Math.abs(nowSeconds - timestamp) > SIGNATURE_TOLERANCE_SECONDS) {
    return false;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${payload}`));
  const expected = bytesToHex(new Uint8Array(digest));
  return signatures.some((signature) => constantTimeEqual(expected, signature));
}

function cleanString(value, maximum, required = false) {
  const result = typeof value === "string" ? value.trim() : "";
  if ((required && !result) || result.length > maximum) {
    throw new Error("Invalid Stripe order metadata");
  }
  return result;
}

export function orderFromStripeSession(session, now = new Date()) {
  const metadata = session.metadata || {};
  const quantity = Number.parseInt(metadata.quantity || "1", 10);
  const paymentStatus = session.payment_status;
  if (!["paid", "no_payment_required"].includes(paymentStatus)) {
    throw new Error("Checkout Session is not paid");
  }
  if (!session.id || !Number.isSafeInteger(session.amount_total) || session.amount_total < 0) {
    throw new Error("Invalid Checkout Session");
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
    throw new Error("Invalid Stripe order quantity");
  }

  const createdAt = now.toISOString();
  const collectionDate = cleanString(metadata.collection_date, 10, true);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(collectionDate)) {
    throw new Error("Invalid Stripe collection date");
  }

  return {
    stripeSessionId: session.id,
    customerName: cleanString(metadata.customer_name, 100, true),
    customerEmail: cleanString(
      session.customer_details?.email || session.customer_email,
      200,
      true,
    ).toLowerCase(),
    collectionDate,
    product: cleanString(metadata.product, 200, true),
    size: cleanString(metadata.size, 200),
    filling: cleanString(metadata.filling, 200),
    finish: cleanString(metadata.finish, 200),
    topper: cleanString(metadata.topper, 100),
    quantity,
    customerNote: cleanString(metadata.note, 500),
    amountTotal: session.amount_total,
    currency: cleanString(session.currency, 3, true).toLowerCase(),
    paymentStatus,
    stripeCreatedAt: Number.isSafeInteger(session.created)
      ? new Date(session.created * 1000).toISOString()
      : null,
    now: createdAt,
  };
}

export async function persistWebhookOrder(db, event, now = new Date()) {
  const order = orderFromStripeSession(event.data.object, now);
  const upsert = db.prepare(`
    INSERT INTO orders (
      stripe_session_id, customer_name, customer_email, collection_date, product,
      size, filling, finish, topper, quantity, customer_note, amount_total, currency,
      payment_status, stripe_created_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(stripe_session_id) DO UPDATE SET
      payment_status = excluded.payment_status,
      amount_total = excluded.amount_total,
      currency = excluded.currency,
      updated_at = excluded.updated_at
  `).bind(
    order.stripeSessionId,
    order.customerName,
    order.customerEmail,
    order.collectionDate,
    order.product,
    order.size,
    order.filling,
    order.finish,
    order.topper,
    order.quantity,
    order.customerNote,
    order.amountTotal,
    order.currency,
    order.paymentStatus,
    order.stripeCreatedAt,
    order.now,
    order.now,
  );
  const insertEvent = db.prepare(`
    INSERT OR IGNORE INTO stripe_events (
      stripe_event_id, stripe_event_type, stripe_session_id, received_at
    ) VALUES (?, ?, ?, ?)
  `).bind(event.id, event.type, order.stripeSessionId, order.now);
  const results = await db.batch([upsert, insertEvent]);
  const eventInserted = Number(results[1]?.meta?.changes || 0) === 1;
  const stored = await getOrderBySessionId(db, order.stripeSessionId);
  if (!stored) throw new Error("Persisted order could not be loaded");
  return { order: stored, eventInserted };
}

export async function getOrderBySessionId(db, sessionId) {
  return db.prepare("SELECT * FROM orders WHERE stripe_session_id = ?")
    .bind(sessionId)
    .first();
}

export async function getOrderById(db, id) {
  return db.prepare("SELECT * FROM orders WHERE id = ?").bind(id).first();
}

export async function listOrders(db, { limit, cursor }) {
  const pageSize = Math.min(Math.max(Number(limit) || 25, 1), 100);
  let statement;
  if (cursor) {
    const decoded = decodeCursor(cursor);
    statement = db.prepare(`
      SELECT * FROM orders
      WHERE created_at < ? OR (created_at = ? AND id < ?)
      ORDER BY created_at DESC, id DESC LIMIT ?
    `).bind(decoded.createdAt, decoded.createdAt, decoded.id, pageSize + 1);
  } else {
    statement = db.prepare(
      "SELECT * FROM orders ORDER BY created_at DESC, id DESC LIMIT ?",
    ).bind(pageSize + 1);
  }
  const result = await statement.all();
  const rows = result.results || [];
  const hasMore = rows.length > pageSize;
  const orders = rows.slice(0, pageSize);
  const last = orders.at(-1);
  return {
    orders,
    nextCursor: hasMore && last ? encodeCursor(last.created_at, last.id) : null,
  };
}

function encodeCursor(createdAt, id) {
  return btoa(JSON.stringify([createdAt, id]))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function decodeCursor(cursor) {
  try {
    const normalized = cursor.replaceAll("-", "+").replaceAll("_", "/");
    const [createdAt, id] = JSON.parse(atob(normalized));
    if (typeof createdAt !== "string" || !Number.isSafeInteger(id)) throw new Error();
    return { createdAt, id };
  } catch {
    throw new RangeError("Invalid cursor");
  }
}

export function validateOrderUpdate(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new RangeError("A JSON object is required");
  }
  const allowedKeys = new Set(["fulfillmentStatus", "internalNotes"]);
  if (Object.keys(body).some((key) => !allowedKeys.has(key))) {
    throw new RangeError("Unsupported field");
  }
  const result = {};
  if ("fulfillmentStatus" in body) {
    if (!FULFILLMENT_STATUSES.includes(body.fulfillmentStatus)) {
      throw new RangeError("Invalid fulfillment status");
    }
    result.fulfillmentStatus = body.fulfillmentStatus;
  }
  if ("internalNotes" in body) {
    if (typeof body.internalNotes !== "string" || body.internalNotes.length > 2000) {
      throw new RangeError("Internal notes must be at most 2000 characters");
    }
    result.internalNotes = body.internalNotes.trim();
  }
  if (Object.keys(result).length === 0) throw new RangeError("No fields to update");
  return result;
}

export async function updateOrder(db, id, update, now = new Date()) {
  const current = await getOrderById(db, id);
  if (!current) return null;
  const status = update.fulfillmentStatus ?? current.fulfillment_status;
  const notes = update.internalNotes ?? current.internal_notes;
  await db.prepare(`
    UPDATE orders
    SET fulfillment_status = ?, internal_notes = ?, updated_at = ?
    WHERE id = ?
  `).bind(status, notes, now.toISOString(), id).run();
  return getOrderById(db, id);
}

function safeNotificationError(error) {
  if (error instanceof Error && /^Resend request failed with status \d{3}$/.test(error.message)) {
    return error.message;
  }
  if (error instanceof Error && error.message === "Email service is not configured") {
    return error.message;
  }
  return "Email delivery failed";
}

export async function sendEmail(env, { to, subject, text, idempotencyKey }) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM) {
    throw new Error("Email service is not configured");
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    body: JSON.stringify({ from: env.RESEND_FROM, to: [to], subject, text }),
  });
  if (!response.ok) {
    throw new Error(`Resend request failed with status ${response.status}`);
  }
}

function notificationMessage(order, recipient, env) {
  const amount = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: order.currency.toUpperCase(),
  }).format(order.amount_total / 100);
  const summary = [
    `Product: ${order.product}`,
    `Size: ${order.size}`,
    `Filling: ${order.filling}`,
    order.finish ? `Finish: ${order.finish}` : "",
    order.topper ? `Topper: ${order.topper}` : "",
    `Quantity: ${order.quantity}`,
    `Total: ${amount}`,
    `Collection date: ${order.collection_date}`,
  ].filter(Boolean);
  if (recipient === "baker") {
    return {
      to: env.NOTIFY_EMAIL,
      subject: `New Cakish order - ${order.product} for ${order.customer_name}`,
      text: [
        "A paid Cakish order has been received.",
        "",
        ...summary,
        `Customer: ${order.customer_name}`,
        `Email: ${order.customer_email}`,
        order.customer_note ? `Customer note: ${order.customer_note}` : "",
        `Stripe session: ${order.stripe_session_id}`,
      ].filter(Boolean).join("\n"),
      idempotencyKey: `cakish-order-${order.id}-baker`,
    };
  }
  return {
    to: order.customer_email,
    subject: "Your Cakish order confirmation",
    text: [
      `Hi ${order.customer_name},`,
      "",
      "Thank you for your paid order.",
      "",
      ...summary,
      "",
      "We will contact you to confirm collection details.",
      "",
      "The Cakish Team",
    ].join("\n"),
    idempotencyKey: `cakish-order-${order.id}-customer`,
  };
}

export async function deliverPendingNotifications(db, env, orderId, options = {}) {
  const recipients = options.recipients || ["baker", "customer"];
  const executionTime = options.now instanceof Date ? options.now : new Date();
  const claimTime = executionTime.toISOString();
  const staleBefore = new Date(
    executionTime.getTime() - (NOTIFICATION_CLAIM_LEASE_SECONDS * 1000),
  ).toISOString();
  const outcomes = {};
  for (const recipient of recipients) {
    if (!["baker", "customer"].includes(recipient)) continue;
    const statusColumn = `${recipient}_notification_status`;
    const attemptsColumn = `${recipient}_notification_attempts`;
    const lastAttemptColumn = `${recipient}_notification_last_attempt_at`;
    const sentColumn = `${recipient}_notification_sent_at`;
    const errorColumn = `${recipient}_notification_error`;
    const claimed = await db.prepare(`
      UPDATE orders
      SET ${statusColumn} = 'sending',
          ${attemptsColumn} = ${attemptsColumn} + 1,
          ${lastAttemptColumn} = ?,
          ${errorColumn} = NULL,
          updated_at = ?
      WHERE id = ? AND (
        ${statusColumn} IN ('pending', 'failed')
        OR (
          ${statusColumn} = 'sending'
          AND (${lastAttemptColumn} IS NULL OR ${lastAttemptColumn} < ?)
        )
      )
    `).bind(claimTime, claimTime, orderId, staleBefore).run();
    if (Number(claimed.meta?.changes || 0) !== 1) {
      outcomes[recipient] = "unchanged";
      continue;
    }

    const order = await getOrderById(db, orderId);
    try {
      const message = notificationMessage(order, recipient, env);
      if (!message.to) throw new Error("Email service is not configured");
      await sendEmail(env, message);
      await db.prepare(`
        UPDATE orders
        SET ${statusColumn} = 'sent', ${sentColumn} = ?, ${errorColumn} = NULL, updated_at = ?
        WHERE id = ? AND ${statusColumn} = 'sending' AND ${lastAttemptColumn} = ?
      `).bind(claimTime, claimTime, orderId, claimTime).run();
      outcomes[recipient] = "sent";
    } catch (error) {
      const safeError = safeNotificationError(error);
      await db.prepare(`
        UPDATE orders
        SET ${statusColumn} = 'failed', ${errorColumn} = ?, updated_at = ?
        WHERE id = ? AND ${statusColumn} = 'sending' AND ${lastAttemptColumn} = ?
      `).bind(safeError, claimTime, orderId, claimTime).run();
      console.error(JSON.stringify({
        event: "notification_failed",
        orderId,
        recipient,
        reason: safeError,
      }));
      outcomes[recipient] = "failed";
    }
  }
  return outcomes;
}
