/**
 * Cloudflare Worker — Cakish Stripe Checkout & Order Notifications
 *
 * Endpoints:
 *   POST /              — Create Stripe Checkout Session
 *   GET  /session-status — Retrieve session details + trigger notifications
 *
 * Environment variables (set via wrangler secret):
 *   STRIPE_SECRET_KEY   — sk_test_... or sk_live_...
 *   NOTIFY_EMAIL        — baker notification email (hello@cakish.ie)
 *   WHATSAPP_PHONE      — baker WhatsApp number for click-to-chat links
 */

// ── Complete product catalog (must match site-data.ts) ──

const PRODUCTS = {
  "strawberry-pavlova": {
    name: "Strawberry Pavlova",
    sizes: {
      small:    { price: 4800, label: "Small (6″, serves 5–6)" },
      medium:   { price: 7200, label: "Medium (9″, serves 8–12)" },
      large:    { price: 11200, label: "Large (12″, serves 13–18)" },
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
      small:    { price: 5200, label: "Small (6″, serves 5–7)" },
      medium:   { price: 7600, label: "Medium (9″, serves 8–12)" },
      large:    { price: 11800, label: "Large (12″, serves 13–18)" },
    },
    hasFinishOptions: false,
  },
  "raspberry-pavlova": {
    name: "Raspberry Pavlova",
    sizes: {
      small:    { price: 5000, label: "Small (6″, serves 5–7)" },
      medium:   { price: 7400, label: "Medium (9″, serves 8–12)" },
      large:    { price: 11600, label: "Large (12″, serves 13–18)" },
    },
    hasFinishOptions: false,
  },
};

const FILLINGS = {
  "dulce-de-leche": { surcharge: 300, label: "Dulce de Leche" },
  "nutella":        { surcharge: 0,   label: "Nutella" },
};

const FINISHES = {
  "floral":            { surcharge: 1800, label: "Floral Finish" },
  "patisserie-sliced": { surcharge: 0,    label: "Patisserie Sliced" },
};

const TOPPER_PRICE_CENTS = 500;

// ── Helpers ──

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(data, status, origin) {
  return Response.json(data, { status, headers: corsHeaders(origin) });
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

  const hasTopper = body.topperMessage && body.topperMessage.trim().length > 0;
  const topperCost = hasTopper ? TOPPER_PRICE_CENTS : 0;
  const qty = Math.max(1, Math.floor(Number(body.quantity) || 1));

  const unitPriceCents = size.price + filling.surcharge + finishSurcharge + topperCost;
  const totalCents = unitPriceCents * qty;

  const description = [
    size.label,
    filling.label,
    finishLabel,
    hasTopper ? `Topper: "${body.topperMessage.trim()}"` : "",
  ].filter(Boolean).join(" · ");

  return {
    product,
    size,
    filling,
    finishLabel,
    hasTopper,
    topperMessage: hasTopper ? body.topperMessage.trim() : "",
    qty,
    unitPriceCents,
    totalCents,
    description,
  };
}

function buildOrderSummaryText(body, calc) {
  const euro = (cents) => `€${(cents / 100).toFixed(2)}`;
  const lines = [
    `🍰 NEW CAKISH ORDER`,
    ``,
    `Product: ${calc.product.name}`,
    `Size: ${calc.size.label}`,
    `Filling: ${calc.filling.label}${calc.filling.surcharge > 0 ? ` (+${euro(calc.filling.surcharge)})` : ""}`,
  ];
  if (calc.finishLabel) {
    lines.push(`Finish: ${calc.finishLabel}${FINISHES[body.finishId]?.surcharge > 0 ? ` (+${euro(FINISHES[body.finishId].surcharge)})` : ""}`);
  }
  if (calc.hasTopper) {
    lines.push(`Topper: "${calc.topperMessage}" (+${euro(TOPPER_PRICE_CENTS)})`);
  }
  lines.push(`Quantity: ${calc.qty}`);
  lines.push(`Total: ${euro(calc.totalCents)}`);
  lines.push(``);
  lines.push(`👤 CUSTOMER`);
  lines.push(`Name: ${body.customerName}`);
  lines.push(`Email: ${body.customerEmail}`);
  lines.push(`Collection date: ${body.collectionDate}`);
  if (body.customerNote) {
    lines.push(`Note: ${body.customerNote}`);
  }
  return lines.join("\n");
}

// ── Route: Create Checkout Session ──

async function handleCreateCheckout(request, env, origin) {
  const body = await request.json();

  // Validate customer info
  if (!body.customerName || !body.customerEmail || !body.collectionDate) {
    return jsonResponse({ error: "Name, email, and collection date are required" }, 400, origin);
  }
  // Input length limits (prevent metadata overflow and abuse)
  if (body.customerName.length > 100) return jsonResponse({ error: "Name too long (max 100 chars)" }, 400, origin);
  if (body.customerEmail.length > 200) return jsonResponse({ error: "Email too long" }, 400, origin);
  if (body.topperMessage && body.topperMessage.length > 100) return jsonResponse({ error: "Topper message too long (max 100 chars)" }, 400, origin);
  if (body.customerNote && body.customerNote.length > 500) return jsonResponse({ error: "Note too long (max 500 chars)" }, 400, origin);
  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.customerEmail)) {
    return jsonResponse({ error: "Invalid email format" }, 400, origin);
  }

  const calc = calculateOrder(body);
  if (calc.error) return jsonResponse({ error: calc.error }, 400, origin);

  const orderSummary = buildOrderSummaryText(body, calc);

  // Build Stripe Checkout params
  const siteOrigin = request.headers.get("Origin") || "https://cakish.pages.dev";
  const params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("customer_email", body.customerEmail);
  params.append("line_items[0][price_data][currency]", "eur");
  params.append("line_items[0][price_data][unit_amount]", String(calc.unitPriceCents));
  params.append("line_items[0][price_data][product_data][name]", `Cakish ${calc.product.name}`);
  params.append("line_items[0][price_data][product_data][description]", calc.description);
  params.append("line_items[0][quantity]", String(calc.qty));
  params.append("success_url", `${siteOrigin}/order/success/?session_id={CHECKOUT_SESSION_ID}`);
  params.append("cancel_url", `${siteOrigin}/order/`);

  // Store full order details in metadata (Stripe limit: 500 chars per value, 50 keys)
  params.append("metadata[product]", calc.product.name);
  params.append("metadata[size]", calc.size.label);
  params.append("metadata[filling]", calc.filling.label);
  if (calc.finishLabel) params.append("metadata[finish]", calc.finishLabel);
  if (calc.hasTopper) params.append("metadata[topper]", calc.topperMessage);
  params.append("metadata[quantity]", String(calc.qty));
  params.append("metadata[customer_name]", body.customerName);
  params.append("metadata[collection_date]", body.collectionDate);
  if (body.customerNote) params.append("metadata[note]", body.customerNote.slice(0, 500));
  params.append("metadata[order_summary]", orderSummary.slice(0, 500));

  const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const session = await stripeRes.json();

  if (!stripeRes.ok) {
    console.error("Stripe error:", JSON.stringify(session));
    return jsonResponse(
      { error: session.error?.message || "Stripe session creation failed" },
      500, origin,
    );
  }

  return jsonResponse({ url: session.url, sessionId: session.id }, 200, origin);
}

// ── Route: Get Session Status + Send Notifications ──

async function handleSessionStatus(request, env, origin) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    return jsonResponse({ error: "session_id is required" }, 400, origin);
  }

  // Retrieve session from Stripe
  const stripeRes = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    {
      headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
    },
  );

  const session = await stripeRes.json();
  if (!stripeRes.ok) {
    return jsonResponse({ error: "Failed to retrieve session" }, 500, origin);
  }

  const meta = session.metadata || {};
  const euro = (cents) => `€${(cents / 100).toFixed(2)}`;

  const result = {
    status: session.payment_status, // "paid", "unpaid", "no_payment_required"
    customerEmail: session.customer_email,
    product: meta.product || "",
    size: meta.size || "",
    filling: meta.filling || "",
    finish: meta.finish || "",
    topper: meta.topper || "",
    quantity: meta.quantity || "1",
    customerName: meta.customer_name || "",
    collectionDate: meta.collection_date || "",
    note: meta.note || "",
    total: euro(session.amount_total || 0),
  };

  // Send notifications only if paid and not already notified.
  // Mark-then-send: reduces duplicates on concurrent requests (best-effort without a DB lock).
  if (session.payment_status === "paid" && !meta.notified) {
    // Mark as notified FIRST to minimise race window
    try {
      const markParams = new URLSearchParams();
      markParams.append("metadata[notified]", "true");
      await fetch(
        `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: markParams.toString(),
        },
      );
    } catch (e) {
      console.error("Failed to mark notified:", e);
    }

    // Build notification text
    const orderText = meta.order_summary || `Order: ${meta.product} ${meta.size}`;

    // Send email notification to baker
    const bakerEmail = env.NOTIFY_EMAIL || "hello@cakish.ie";
    const whatsappPhone = env.WHATSAPP_PHONE || "353834462295";
    const whatsappLink = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
      `Hi ${meta.customer_name || "there"}! Thanks for your Cakish order. I'll confirm your collection details for ${meta.collection_date || "your chosen date"} shortly. 🍰`
    )}`;

    try {
      await sendEmail(env, {
        to: bakerEmail,
        subject: `🍰 New Cakish Order — ${meta.product} for ${meta.customer_name}`,
        text: [
          orderText,
          "",
          "───────────────────",
          "",
          `📱 Quick-reply to customer via WhatsApp:`,
          whatsappLink,
          "",
          `📧 Customer email: ${session.customer_email}`,
          "",
          `💳 Stripe session: ${sessionId}`,
          `💰 Amount: ${euro(session.amount_total || 0)}`,
        ].join("\n"),
      });
    } catch (e) {
      console.error("Baker email failed:", e);
    }

    // Send confirmation email to customer
    try {
      await sendEmail(env, {
        to: session.customer_email,
        subject: `Your Cakish Order Confirmation 🍰`,
        text: [
          `Hi ${meta.customer_name || "there"}!`,
          "",
          `Thank you for your order! Here's your summary:`,
          "",
          `Product: ${meta.product}`,
          `Size: ${meta.size}`,
          `Filling: ${meta.filling}`,
          meta.finish ? `Finish: ${meta.finish}` : "",
          meta.topper ? `Topper: "${meta.topper}"` : "",
          `Quantity: ${meta.quantity}`,
          `Total: ${euro(session.amount_total || 0)}`,
          "",
          `Collection date: ${meta.collection_date}`,
          `Collection is from our Wicklow location — we'll share the exact address when we confirm your order.`,
          "",
          `We'll be in touch shortly to confirm everything.`,
          "",
          `If you have any questions, reply to this email or message us on WhatsApp.`,
          "",
          `Thank you for choosing Cakish! 🍓`,
          `— The Cakish Team`,
        ].filter(Boolean).join("\n"),
      });
    } catch (e) {
      console.error("Customer email failed:", e);
    }
  }

  return jsonResponse(result, 200, origin);
}

// ── Email via MailChannels (free on Cloudflare Workers) ──

async function sendEmail(env, { to, subject, text }) {
  const res = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: {
        email: env.NOTIFY_EMAIL || "hello@cakish.ie",
        name: "Cakish",
      },
      subject,
      content: [{ type: "text/plain", value: text }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`MailChannels error (${res.status}):`, body);
  }
}

// ── Main Router ──

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "*";
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // POST / — Create checkout session
    if (request.method === "POST" && (url.pathname === "/" || url.pathname === "")) {
      return handleCreateCheckout(request, env, origin);
    }

    // GET /session-status — Retrieve session + trigger notifications
    if (request.method === "GET" && url.pathname === "/session-status") {
      return handleSessionStatus(request, env, origin);
    }

    return jsonResponse({ error: "Not found" }, 404, origin);
  },
};
