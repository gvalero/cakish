/**
 * Cloudflare Worker — Stripe Checkout Session creator
 *
 * Accepts a POST with { size, finish, quantity } from the Cakish site,
 * calculates the correct price server-side, and creates a Stripe
 * Checkout Session. Returns the session URL for redirect.
 *
 * Environment variables (set via wrangler secret):
 *   STRIPE_SECRET_KEY  — sk_test_... or sk_live_...
 */

const PRICING = {
  sizes: {
    '6"':  { basePrice: 4800, label: '6″ Pavlova' },
    '8"':  { basePrice: 6800, label: '8″ Pavlova' },
    '12"': { basePrice: 11200, label: '12″ Pavlova' },
  },
  finishes: {
    'strawberry-floral-finish':  { surcharge: 1800, label: 'Strawberry Floral Finish' },
    'patisserie-sliced-finish':  { surcharge: 0,    label: 'Patisserie Sliced Finish' },
  },
};

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '*';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return Response.json(
        { error: 'Method not allowed' },
        { status: 405, headers: corsHeaders(origin) }
      );
    }

    try {
      const { size, finish, quantity } = await request.json();

      // Validate inputs
      const sizeConfig = PRICING.sizes[size];
      const finishConfig = PRICING.finishes[finish];
      if (!sizeConfig || !finishConfig) {
        return Response.json(
          { error: 'Invalid size or finish selection' },
          { status: 400, headers: corsHeaders(origin) }
        );
      }

      const qty = Math.max(1, Math.floor(Number(quantity) || 1));
      const unitPriceCents = sizeConfig.basePrice + finishConfig.surcharge;
      const description = `${sizeConfig.label} — ${finishConfig.label}`;

      // Create Stripe Checkout Session via REST API (no SDK needed)
      const params = new URLSearchParams();
      params.append('mode', 'payment');
      params.append('line_items[0][price_data][currency]', 'eur');
      params.append('line_items[0][price_data][unit_amount]', String(unitPriceCents));
      params.append('line_items[0][price_data][product_data][name]', 'The Cakish Modern Pavlova');
      params.append('line_items[0][price_data][product_data][description]', description);
      params.append('line_items[0][quantity]', String(qty));
      params.append('success_url', request.headers.get('Origin') + '/test-payment?status=success');
      params.append('cancel_url', request.headers.get('Origin') + '/test-payment?status=cancelled');

      const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const session = await stripeResponse.json();

      if (!stripeResponse.ok) {
        console.error('Stripe error:', JSON.stringify(session));
        return Response.json(
          { error: session.error?.message || 'Stripe session creation failed' },
          { status: 500, headers: corsHeaders(origin) }
        );
      }

      return Response.json(
        { url: session.url, sessionId: session.id },
        { status: 200, headers: corsHeaders(origin) }
      );
    } catch (err) {
      console.error('Worker error:', err);
      return Response.json(
        { error: 'Internal server error' },
        { status: 500, headers: corsHeaders(origin) }
      );
    }
  },
};
