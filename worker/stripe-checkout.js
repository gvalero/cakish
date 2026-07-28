import { handleAdmin } from "./admin.js";
import {
  deliverPendingNotifications,
  persistWebhookOrder,
  verifyStripeSignature,
} from "./order-management.js";

const PRODUCTS = {
  "strawberry-pavlova": {
    name: "Strawberry Pavlova",
    sizes: {
      small: { price: 4800, label: "Small (6″, serves 5–6)" },
      medium: { price: 7200, label: "Medium (9″, serves 8–12)" },
      large: { price: 11200, label: "Large (12″, serves 13–18)" },
    },
    hasFinishOptions: true,
  },
  "heart-pavlova": {
    name: "Heart Pavlova",
    sizes: {
      standard: { price: 7800, label: "Standard (9″, serves 8–10)" },
    },
    hasFinishOptions: false,
  },
  "mixed-berries-pavlova": {
    name: "Mixed Berries Pavlova",
    sizes: {
      small: { price: 5200, label: "Small (6″, serves 5–7)" },
      medium: { price: 7600, label: "Medium (9″, serves 8–12)" },
      large: { price: 11800, label: "Large (12″, serves 13–18)" },
    },
    hasFinishOptions: false,
  },
  "raspberry-pavlova": {
    name: "Raspberry Pavlova",
    sizes: {
      small: { price: 5000, label: "Small (6″, serves 5–7)" },
      medium: { price: 7400, label: "Medium (9″, serves 8–12)" },
      large: { price: 11600, label: "Large (12″, serves 13–18)" },
    },
    hasFinishOptions: false,
  },
};

const FILLINGS = {
  "dulce-de-leche": { surcharge: 300, label: "Dulce de Leche" },
  nutella: { surcharge: 0, label: "Nutella" },
};

const FINISHES = {
  floral: { surcharge: 1800, label: "Floral Finish" },
  "patisserie-sliced": { surcharge: 0, label: "Patisserie Sliced" },
};

const TOPPER_PRICE_CENTS = 500;
const DEFAULT_STOREFRONT_URL = "https://cakish.ie";
const DEFAULT_ALLOWED_STOREFRONT_ORIGINS = [
  "https://cakish.ie",
  "https://www.cakish.ie",
];

function corsHeaders(origin) {
  const headers = {
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    Vary: "Origin",
  };
  if (origin) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function publicJson(data, status, origin) {
  return Response.json(data, { status, headers: corsHeaders(origin) });
}

function privateJson(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function parseHttpsOrigin(value) {
  if (typeof value !== "string" || !value) return null;
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      url.origin !== value.replace(/\/$/, "")
    ) return null;
    return url.origin;
  } catch {
    return null;
  }
}

function storefrontConfiguration(env) {
  const canonicalValue = env.STOREFRONT_URL === undefined
    ? DEFAULT_STOREFRONT_URL
    : env.STOREFRONT_URL;
  const canonicalOrigin = parseHttpsOrigin(canonicalValue);
  const allowedValues = env.ALLOWED_STOREFRONT_ORIGINS === undefined
    ? DEFAULT_ALLOWED_STOREFRONT_ORIGINS
    : String(env.ALLOWED_STOREFRONT_ORIGINS).split(",").map((value) => value.trim());
  const allowedOrigins = allowedValues.map(parseHttpsOrigin);
  if (!canonicalOrigin || allowedOrigins.length === 0 || allowedOrigins.some((origin) => !origin)) {
    return null;
  }
  return { canonicalOrigin, allowedOrigins: new Set(allowedOrigins) };
}

function calculateOrder(body) {
  const product = PRODUCTS[body.productId];
  if (!product) return { error: "Invalid product" };
  const size = product.sizes[body.sizeId];
  if (!size) return { error: "Invalid size" };
  const filling = FILLINGS[body.fillingId];
  if (!filling) return { error: "Invalid filling" };

  let finishSurcharge = 0;
  let finishLabel = "";
  if (product.hasFinishOptions && body.finishId) {
    const finish = FINISHES[body.finishId];
    if (!finish) return { error: "Invalid finish" };
    finishSurcharge = finish.surcharge;
    finishLabel = finish.label;
  }
  const hasTopper = typeof body.topperMessage === "string" && body.topperMessage.trim().length > 0;
  const topperCost = hasTopper ? TOPPER_PRICE_CENTS : 0;
  const quantity = Math.max(1, Math.floor(Number(body.quantity) || 1));
  if (quantity > 100) return { error: "Invalid quantity" };
  const unitPriceCents = size.price + filling.surcharge + finishSurcharge + topperCost;
  return {
    product,
    size,
    filling,
    finishLabel,
    hasTopper,
    topperMessage: hasTopper ? body.topperMessage.trim() : "",
    quantity,
    unitPriceCents,
    totalCents: unitPriceCents * quantity,
    description: [
      size.label,
      filling.label,
      finishLabel,
      hasTopper ? `Topper: "${body.topperMessage.trim()}"` : "",
    ].filter(Boolean).join(" - "),
  };
}

function buildOrderSummaryText(body, calculation) {
  const euro = (cents) => `EUR ${(cents / 100).toFixed(2)}`;
  return [
    "NEW CAKISH ORDER",
    "",
    `Product: ${calculation.product.name}`,
    `Size: ${calculation.size.label}`,
    `Filling: ${calculation.filling.label}`,
    calculation.finishLabel ? `Finish: ${calculation.finishLabel}` : "",
    calculation.hasTopper ? `Topper: "${calculation.topperMessage}"` : "",
    `Quantity: ${calculation.quantity}`,
    `Total: ${euro(calculation.totalCents)}`,
    "",
    `Customer: ${body.customerName}`,
    `Email: ${body.customerEmail}`,
    `Collection date: ${body.collectionDate}`,
    body.customerNote ? `Note: ${body.customerNote}` : "",
  ].filter((line) => line !== "").join("\n");
}

export async function handleCreateCheckout(request, env, origin) {
  let body;
  try {
    body = await request.json();
  } catch {
    return publicJson({ error: "Invalid JSON" }, 400, origin);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return publicJson({ error: "A JSON object is required" }, 400, origin);
  }
  if (!body.customerName || !body.customerEmail || !body.collectionDate) {
    return publicJson({ error: "Name, email, and collection date are required" }, 400, origin);
  }
  if (
    typeof body.customerName !== "string" ||
    typeof body.customerEmail !== "string" ||
    typeof body.collectionDate !== "string" ||
    !body.customerName.trim() ||
    (body.topperMessage !== undefined && typeof body.topperMessage !== "string") ||
    (body.customerNote !== undefined && typeof body.customerNote !== "string") ||
    !/^\d{4}-\d{2}-\d{2}$/.test(body.collectionDate)
  ) {
    return publicJson({ error: "Invalid customer details" }, 400, origin);
  }
  if (body.customerName.length > 100) {
    return publicJson({ error: "Name too long (max 100 chars)" }, 400, origin);
  }
  if (body.customerEmail.length > 200) return publicJson({ error: "Email too long" }, 400, origin);
  if (body.topperMessage?.length > 100) {
    return publicJson({ error: "Topper message too long (max 100 chars)" }, 400, origin);
  }
  if (body.customerNote?.length > 500) {
    return publicJson({ error: "Note too long (max 500 chars)" }, 400, origin);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.customerEmail)) {
    return publicJson({ error: "Invalid email format" }, 400, origin);
  }
  const calculation = calculateOrder(body);
  if (calculation.error) return publicJson({ error: calculation.error }, 400, origin);

  const siteOrigin = storefrontConfiguration(env)?.canonicalOrigin;
  if (!siteOrigin) return publicJson({ error: "Storefront is not configured" }, 503, origin);
  const parameters = new URLSearchParams();
  parameters.append("mode", "payment");
  parameters.append("customer_email", body.customerEmail);
  parameters.append("payment_intent_data[receipt_email]", body.customerEmail);
  parameters.append("line_items[0][price_data][currency]", "eur");
  parameters.append("line_items[0][price_data][unit_amount]", String(calculation.unitPriceCents));
  parameters.append("line_items[0][price_data][product_data][name]", `Cakish ${calculation.product.name}`);
  parameters.append("line_items[0][price_data][product_data][description]", calculation.description);
  parameters.append("line_items[0][quantity]", String(calculation.quantity));
  parameters.append("success_url", `${siteOrigin}/order/success/?session_id={CHECKOUT_SESSION_ID}`);
  parameters.append("cancel_url", `${siteOrigin}/order/`);
  parameters.append("metadata[product]", calculation.product.name);
  parameters.append("metadata[size]", calculation.size.label);
  parameters.append("metadata[filling]", calculation.filling.label);
  if (calculation.finishLabel) parameters.append("metadata[finish]", calculation.finishLabel);
  if (calculation.hasTopper) parameters.append("metadata[topper]", calculation.topperMessage);
  parameters.append("metadata[quantity]", String(calculation.quantity));
  parameters.append("metadata[customer_name]", body.customerName);
  parameters.append("metadata[collection_date]", body.collectionDate);
  if (body.customerNote) parameters.append("metadata[note]", body.customerNote.slice(0, 500));
  parameters.append("metadata[order_summary]", buildOrderSummaryText(body, calculation).slice(0, 500));

  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: parameters.toString(),
  });
  const session = await stripeResponse.json();
  if (!stripeResponse.ok) {
    console.error(JSON.stringify({ event: "stripe_checkout_failed", status: stripeResponse.status }));
    return publicJson({ error: "Stripe session creation failed" }, 502, origin);
  }
  return publicJson({ url: session.url, sessionId: session.id }, 200, origin);
}

export async function handleSessionStatus(request, env, origin) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) return publicJson({ error: "session_id is required" }, 400, origin);
  const stripeResponse = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    { headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` } },
  );
  const session = await stripeResponse.json();
  if (!stripeResponse.ok) {
    return publicJson({ error: "Failed to retrieve session" }, 502, origin);
  }
  const metadata = session.metadata || {};
  const result = {
    status: session.payment_status,
    customerEmail: session.customer_details?.email || session.customer_email || "",
    product: metadata.product || "",
    size: metadata.size || "",
    filling: metadata.filling || "",
    finish: metadata.finish || "",
    topper: metadata.topper || "",
    quantity: metadata.quantity || "1",
    customerName: metadata.customer_name || "",
    collectionDate: metadata.collection_date || "",
    note: metadata.note || "",
    total: `€${((session.amount_total || 0) / 100).toFixed(2)}`,
  };
  return publicJson(result, 200, origin);
}

export async function handleStripeWebhook(request, env) {
  if (!env.STRIPE_WEBHOOK_SECRET || !env.DB) {
    console.error(JSON.stringify({ event: "stripe_webhook_not_configured" }));
    return privateJson({ error: "Webhook is not configured" }, 503);
  }
  const payload = await request.text();
  if (payload.length > 1_000_000) {
    return privateJson({ error: "Payload too large" }, 413);
  }
  const valid = await verifyStripeSignature(
    payload,
    request.headers.get("Stripe-Signature"),
    env.STRIPE_WEBHOOK_SECRET,
  );
  if (!valid) return privateJson({ error: "Invalid signature" }, 400);

  let event;
  try {
    event = JSON.parse(payload);
  } catch {
    return privateJson({ error: "Invalid payload" }, 400);
  }
  const acceptedTypes = new Set([
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
  ]);
  if (!acceptedTypes.has(event.type)) return privateJson({ received: true, ignored: true });
  if (!event.id || event.data?.object?.object !== "checkout.session") {
    return privateJson({ error: "Invalid event" }, 400);
  }
  if (!["paid", "no_payment_required"].includes(event.data.object.payment_status)) {
    return privateJson({ received: true, ignored: true });
  }

  try {
    const persisted = await persistWebhookOrder(env.DB, event);
    const notifications = await deliverPendingNotifications(env.DB, env, persisted.order.id);
    if (Object.values(notifications).includes("failed")) {
      return privateJson({
        error: "Notification delivery incomplete",
        received: true,
        replay: !persisted.eventInserted,
        notifications,
      }, 500);
    }
    return privateJson({
      received: true,
      replay: !persisted.eventInserted,
      notifications,
    });
  } catch (error) {
    console.error(JSON.stringify({
      event: "stripe_webhook_failed",
      stripeEventId: typeof event.id === "string" ? event.id : null,
      reason: error instanceof Error ? error.message : "unknown",
    }));
    return privateJson({ error: "Webhook processing failed" }, 500);
  }
}

export async function workerFetch(request, env) {
  const url = new URL(request.url);
  const requestOrigin = request.headers.get("Origin");
  const isPublicRoute = url.pathname === "/" || url.pathname === "/session-status";
  let origin = null;

  if (isPublicRoute) {
    const storefront = storefrontConfiguration(env);
    if (!storefront) return privateJson({ error: "Storefront is not configured" }, 503);
    if (requestOrigin && !storefront.allowedOrigins.has(requestOrigin)) {
      return privateJson({ error: "Origin is not allowed" }, 403);
    }
    origin = requestOrigin;
  }

  if (request.method === "OPTIONS" && isPublicRoute) {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (request.method === "POST" && url.pathname === "/") {
    return handleCreateCheckout(request, env, origin);
  }
  if (request.method === "GET" && url.pathname === "/session-status") {
    return handleSessionStatus(request, env, origin);
  }
  if (request.method === "POST" && url.pathname === "/webhooks/stripe") {
    return handleStripeWebhook(request, env);
  }
  const adminResponse = await handleAdmin(request, env, url);
  if (adminResponse) return adminResponse;
  return privateJson({ error: "Not found" }, 404);
}

const worker = { fetch: workerFetch };

export default worker;
