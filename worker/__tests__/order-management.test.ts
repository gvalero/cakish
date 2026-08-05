import { afterEach, describe, expect, it, vi } from "vitest";
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from "jose";
import { authenticateAdmin, requireCsrf, validateRetryBody } from "../admin.js";
import {
  deliverPendingNotifications,
  validateOrderUpdate,
  verifyStripeSignature,
} from "../order-management.js";
import { workerFetch } from "../stripe-checkout.js";

const encoder = new TextEncoder();

async function stripeHeader(payload: string, secret: string, timestamp: number) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${payload}`)),
  );
  const signature = Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `t=${timestamp},v1=${signature}`;
}

function checkoutEvent(id = "evt_1") {
  return {
    id,
    type: "checkout.session.completed",
    data: {
      object: {
        object: "checkout.session",
        id: "cs_test_1",
        payment_status: "paid",
        amount_total: 7500,
        currency: "eur",
        created: 1_700_000_000,
        customer_email: "customer@example.com",
        metadata: {
          customer_name: "Test Customer",
          collection_date: "2026-08-01",
          product: "Strawberry Pavlova",
          size: "Medium",
          filling: "Nutella",
          quantity: "1",
          note: "Ring the bell",
        },
      },
    },
  };
}

class FakeStatement {
  arguments: unknown[] = [];

  constructor(private database: FakeD1, private sql: string) {}

  bind(...values: unknown[]) {
    this.arguments = values;
    return this;
  }

  async first() {
    if (this.sql.includes("stripe_session_id = ?")) {
      return this.database.orders.find((order) => order.stripe_session_id === this.arguments[0]) || null;
    }
    if (this.sql.includes("WHERE id = ?")) {
      return this.database.orders.find((order) => order.id === this.arguments[0]) || null;
    }
    return null;
  }

  async all() {
    const limit = Number(this.arguments.at(-1));
    return { results: this.database.orders.slice().reverse().slice(0, limit) };
  }

  async run() {
    if (this.sql.includes("INSERT INTO orders")) {
      const existing = this.database.orders.find((order) => order.stripe_session_id === this.arguments[0]);
      if (existing) {
        existing.payment_status = this.arguments[13];
        existing.amount_total = this.arguments[11];
        existing.currency = this.arguments[12];
        existing.updated_at = this.arguments[18];
      } else {
        this.database.orders.push({
          id: this.database.orders.length + 1,
          stripe_session_id: this.arguments[0],
          customer_name: this.arguments[1],
          customer_email: this.arguments[2],
          collection_date: this.arguments[3],
          product: this.arguments[4],
          size: this.arguments[5],
          filling: this.arguments[6],
          finish: this.arguments[7],
          topper: this.arguments[8],
          quantity: this.arguments[9],
          customer_note: this.arguments[10],
          amount_total: this.arguments[11],
          currency: this.arguments[12],
          payment_status: this.arguments[13],
          baker_notification_status: this.arguments[14],
          customer_notification_status: this.arguments[15],
          stripe_created_at: this.arguments[16],
          fulfillment_status: "new",
          internal_notes: "",
          baker_notification_attempts: 0,
          customer_notification_attempts: 0,
          created_at: this.arguments[17],
          updated_at: this.arguments[18],
        });
      }
      return { meta: { changes: 1 } };
    }
    if (this.sql.includes("INSERT OR IGNORE INTO stripe_events")) {
      const eventId = String(this.arguments[0]);
      if (this.database.events.has(eventId)) return { meta: { changes: 0 } };
      this.database.events.add(eventId);
      return { meta: { changes: 1 } };
    }
    const recipient = this.sql.includes("baker_notification_status")
      ? "baker"
      : this.sql.includes("customer_notification_status")
        ? "customer"
        : null;
    if (recipient) {
      const orderId = Number(this.arguments[2]);
      const order = this.database.orders.find((candidate) => candidate.id === orderId);
      if (!order) return { meta: { changes: 0 } };
      const statusKey = `${recipient}_notification_status`;
      const attemptsKey = `${recipient}_notification_attempts`;
      if (this.sql.includes("IN ('pending', 'failed')") && this.sql.includes("= 'sending'")) {
        const cutoff = String(this.arguments[3]);
        const lastAttemptKey = `${recipient}_notification_last_attempt_at`;
        const reclaimable = ["pending", "failed"].includes(String(order[statusKey])) ||
          (order[statusKey] === "sending" &&
            (!order[lastAttemptKey] || String(order[lastAttemptKey]) < cutoff));
        if (!reclaimable) return { meta: { changes: 0 } };
        order[statusKey] = "sending";
        order[attemptsKey] += 1;
        order[lastAttemptKey] = this.arguments[0];
        return { meta: { changes: 1 } };
      }
      if (this.sql.includes("= 'sent'")) {
        if (
          order[statusKey] !== "sending" ||
          order[`${recipient}_notification_last_attempt_at`] !== this.arguments[3]
        ) return { meta: { changes: 0 } };
        order[statusKey] = "sent";
        order[`${recipient}_notification_sent_at`] = this.arguments[0];
        return { meta: { changes: 1 } };
      }
      if (this.sql.includes("= 'failed'")) {
        if (
          order[statusKey] !== "sending" ||
          order[`${recipient}_notification_last_attempt_at`] !== this.arguments[3]
        ) return { meta: { changes: 0 } };
        order[statusKey] = "failed";
        order[`${recipient}_notification_error`] = this.arguments[0];
        return { meta: { changes: 1 } };
      }
    }
    return { meta: { changes: 0 } };
  }
}

class FakeD1 {
  orders: Record<string, unknown>[] = [];
  events = new Set<string>();

  prepare(sql: string) {
    return new FakeStatement(this, sql);
  }

  async batch(statements: FakeStatement[]) {
    return Promise.all(statements.map((statement) => statement.run()));
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Stripe signature verification", () => {
  it("accepts a valid signature and rejects invalid and stale signatures", async () => {
    const now = 1_800_000_000;
    const payload = '{"id":"evt_1"}';
    expect(await verifyStripeSignature(
      payload,
      await stripeHeader(payload, "whsec_test", now),
      "whsec_test",
      now,
    )).toBe(true);
    expect(await verifyStripeSignature(payload, `t=${now},v1=${"0".repeat(64)}`, "whsec_test", now))
      .toBe(false);
    expect(await verifyStripeSignature(
      payload,
      await stripeHeader(payload, "whsec_test", now - 301),
      "whsec_test",
      now,
    )).toBe(false);
  });
});

describe("webhook order handling", () => {
  it("persists honest disabled states in Stripe-only mode without Resend calls or replay retries", async () => {
    const database = new FakeD1();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const payload = JSON.stringify(checkoutEvent());
    const timestamp = Math.floor(Date.now() / 1000);
    const stripeHeaderValue = await stripeHeader(payload, "whsec_test", timestamp);
    const request = () => new Request("https://worker.test/webhooks/stripe", {
      method: "POST",
      headers: { "Stripe-Signature": stripeHeaderValue },
      body: payload,
    });
    const environment = {
      DB: database,
      STRIPE_WEBHOOK_SECRET: "whsec_test",
      CUSTOM_EMAILS_ENABLED: "false",
    };

    const first = await workerFetch(request(), environment);
    expect(first.status).toBe(200);
    expect(await first.json()).toMatchObject({
      received: true,
      replay: false,
      notifications: { baker: "disabled", customer: "disabled" },
    });
    expect(database.orders).toHaveLength(1);
    expect(database.orders[0].baker_notification_status).toBe("disabled");
    expect(database.orders[0].customer_notification_status).toBe("disabled");
    expect(database.orders[0].baker_notification_attempts).toBe(0);
    expect(database.orders[0].customer_notification_attempts).toBe(0);
    expect(fetchMock).not.toHaveBeenCalled();

    const replay = await workerFetch(request(), environment);
    expect(replay.status).toBe(200);
    expect(await replay.json()).toMatchObject({
      received: true,
      replay: true,
      notifications: { baker: "disabled", customer: "disabled" },
    });
    expect(database.orders).toHaveLength(1);
    expect(fetchMock).not.toHaveBeenCalled();

    const enabledReplay = await workerFetch(request(), {
      ...environment,
      CUSTOM_EMAILS_ENABLED: "true",
      RESEND_API_KEY: "re_test",
      RESEND_FROM: "Cakish <orders@example.com>",
      NOTIFY_EMAIL: "baker@example.com",
    });
    expect(await enabledReplay.json()).toMatchObject({
      received: true,
      replay: true,
      notifications: { baker: "unchanged", customer: "unchanged" },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("persists a paid order, sends notifications, and treats replay as idempotent", async () => {
    const database = new FakeD1();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 200 })));
    const payload = JSON.stringify(checkoutEvent());
    const timestamp = Math.floor(Date.now() / 1000);
    const request = () => new Request("https://worker.test/webhooks/stripe", {
      method: "POST",
      headers: { "Stripe-Signature": stripeHeaderValue },
      body: payload,
    });
    const stripeHeaderValue = await stripeHeader(payload, "whsec_test", timestamp);
    const environment = {
      DB: database,
      STRIPE_WEBHOOK_SECRET: "whsec_test",
      CUSTOM_EMAILS_ENABLED: "true",
      RESEND_API_KEY: "re_test",
      RESEND_FROM: "Cakish <orders@example.com>",
      NOTIFY_EMAIL: "baker@example.com",
    };

    const first = await workerFetch(request(), environment);
    expect(first.status).toBe(200);
    expect(database.orders).toHaveLength(1);
    expect(database.orders[0].baker_notification_status).toBe("sent");
    expect(database.orders[0].customer_notification_status).toBe("sent");
    expect(fetch).toHaveBeenCalledTimes(2);

    const replay = await workerFetch(request(), environment);
    expect(await replay.json()).toMatchObject({ received: true, replay: true });
    expect(database.orders).toHaveLength(1);
    expect(database.events.size).toBe(1);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("records notification failures independently and retries only failed delivery", async () => {
    const database = new FakeD1();
    database.orders.push({
      id: 1,
      customer_name: "Customer",
      customer_email: "customer@example.com",
      collection_date: "2026-08-01",
      product: "Pavlova",
      size: "Medium",
      filling: "Nutella",
      finish: "",
      topper: "",
      quantity: 1,
      customer_note: "",
      amount_total: 7500,
      currency: "eur",
      stripe_session_id: "cs_1",
      baker_notification_status: "pending",
      baker_notification_attempts: 0,
      customer_notification_status: "pending",
      customer_notification_attempts: 0,
    });
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response("provider detail", { status: 500 }))
      .mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const environment = {
      CUSTOM_EMAILS_ENABLED: "true",
      RESEND_API_KEY: "re_test",
      RESEND_FROM: "Cakish <orders@example.com>",
      NOTIFY_EMAIL: "baker@example.com",
    };

    expect(await deliverPendingNotifications(database, environment, 1)).toEqual({
      baker: "failed",
      customer: "sent",
    });
    expect(database.orders[0].baker_notification_error).toBe("Resend request failed with status 500");
    expect(await deliverPendingNotifications(database, environment, 1)).toEqual({
      baker: "sent",
      customer: "unchanged",
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("reclaims only stale sending claims and never retries sent notifications", async () => {
    const database = new FakeD1();
    database.orders.push({
      id: 1,
      customer_name: "Customer",
      customer_email: "customer@example.com",
      collection_date: "2026-08-01",
      product: "Pavlova",
      size: "Medium",
      filling: "Nutella",
      finish: "",
      topper: "",
      quantity: 1,
      customer_note: "",
      amount_total: 7500,
      currency: "eur",
      stripe_session_id: "cs_lease",
      baker_notification_status: "sending",
      baker_notification_attempts: 1,
      baker_notification_last_attempt_at: "2026-07-28T16:55:00.000Z",
      customer_notification_status: "sent",
      customer_notification_attempts: 1,
      customer_notification_last_attempt_at: "2026-07-28T16:00:00.000Z",
    });
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const environment = {
      CUSTOM_EMAILS_ENABLED: "true",
      RESEND_API_KEY: "re_test",
      RESEND_FROM: "Cakish <orders@example.com>",
      NOTIFY_EMAIL: "baker@example.com",
    };

    expect(await deliverPendingNotifications(database, environment, 1, {
      now: new Date("2026-07-28T17:00:00.000Z"),
    })).toEqual({ baker: "unchanged", customer: "unchanged" });
    expect(fetchMock).not.toHaveBeenCalled();

    expect(await deliverPendingNotifications(database, environment, 1, {
      now: new Date("2026-07-28T17:11:00.000Z"),
    })).toEqual({ baker: "sent", customer: "unchanged" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(database.orders[0].baker_notification_attempts).toBe(2);
  });
});

describe("admin security and validation", () => {
  it("denies a spoofed Access email header and allows bearer identities", async () => {
    const request = new Request("https://worker.test/admin/api/orders");
    expect(await authenticateAdmin(request, {})).toMatchObject({ allowed: false, configured: false });
    expect(await authenticateAdmin(
      new Request(request, { headers: { Authorization: "Bearer correct" } }),
      { ADMIN_API_SECRET: "correct" },
    )).toMatchObject({ allowed: true, mode: "bearer" });
    expect(await authenticateAdmin(
      new Request(request, { headers: { "Cf-Access-Authenticated-User-Email": "admin@example.com" } }),
      {
        ACCESS_TEAM_DOMAIN: "cakish.cloudflareaccess.com",
        ACCESS_AUD: "access-app-audience",
        ADMIN_ALLOWED_EMAILS: "admin@example.com",
      },
    )).toMatchObject({ allowed: false });

    const denied = await workerFetch(request, {});
    expect(denied.status).toBe(503);
    const allowed = await workerFetch(
      new Request(request, { headers: { Authorization: "Bearer correct" } }),
      { ADMIN_API_SECRET: "correct", DB: new FakeD1() },
    );
    expect(allowed.status).toBe(200);
  });

  it("accepts only a valid Access JWT with the exact issuer, audience, and allowed claim email", async () => {
    const { publicKey, privateKey } = await generateKeyPair("RS256");
    const jwk = await exportJWK(publicKey);
    const keySet = createLocalJWKSet({ keys: [{ ...jwk, kid: "test-key", alg: "RS256" }] });
    const now = Math.floor(Date.now() / 1000);
    const sign = (claims: {
      issuer?: string;
      audience?: string | string[];
      email?: string;
      expiration?: number;
      notBefore?: number;
    }) =>
      new SignJWT({ email: claims.email ?? "admin@example.com" })
        .setProtectedHeader({ alg: "RS256", kid: "test-key" })
        .setIssuer(claims.issuer ?? "https://cakish.cloudflareaccess.com")
        .setAudience(claims.audience ?? "access-app-audience")
        .setIssuedAt(now)
        .setNotBefore(claims.notBefore ?? now - 10)
        .setExpirationTime(claims.expiration ?? now + 300)
        .sign(privateKey);
    const environment = {
      ACCESS_TEAM_DOMAIN: "cakish.cloudflareaccess.com",
      ACCESS_AUD: "access-app-audience",
      ADMIN_ALLOWED_EMAILS: "admin@example.com",
    };
    const authenticate = (token: string) => authenticateAdmin(new Request(
      "https://worker.test/admin",
      {
        headers: {
          "Cf-Access-Jwt-Assertion": token,
          "Cf-Access-Authenticated-User-Email": "spoofed@example.com",
        },
      },
    ), environment, keySet);

    expect(await authenticate(await sign({}))).toMatchObject({
      allowed: true,
      mode: "access",
      identity: "admin@example.com",
    });
    expect(await authenticate(await sign({ issuer: "https://evil.example" })))
      .toMatchObject({ allowed: false });
    expect(await authenticate(await sign({ audience: "another-app" })))
      .toMatchObject({ allowed: false });
    expect(await authenticate(await sign({
      audience: ["access-app-audience", "another-app"],
    }))).toMatchObject({ allowed: false });
    expect(await authenticate(await sign({ email: "other@example.com" })))
      .toMatchObject({ allowed: false });
    expect(await authenticate(await sign({ expiration: now - 1 })))
      .toMatchObject({ allowed: false });
    expect(await authenticate(await sign({ notBefore: now + 60 })))
      .toMatchObject({ allowed: false });
    const validToken = await sign({});
    const [header, payload, signature] = validToken.split(".");
    const invalidSignature = `${signature[0] === "A" ? "B" : "A"}${signature.slice(1)}`;
    expect(await authenticate(`${header}.${payload}.${invalidSignature}`))
      .toMatchObject({ allowed: false });
    expect(await authenticateAdmin(
      new Request("https://worker.test/admin", {
        headers: { "Cf-Access-Jwt-Assertion": validToken },
      }),
      { ...environment, ACCESS_TEAM_DOMAIN: "https://cakish.cloudflareaccess.com" },
      keySet,
    )).toMatchObject({ allowed: false });
  });

  it("accepts only supported status values, fields, notes, and retry recipients", () => {
    expect(validateOrderUpdate({ fulfillmentStatus: "ready", internalNotes: "On shelf" }))
      .toEqual({ fulfillmentStatus: "ready", internalNotes: "On shelf" });
    expect(() => validateOrderUpdate({ fulfillmentStatus: "refunded" })).toThrow(/Invalid/);
    expect(() => validateOrderUpdate({ internalNotes: "x".repeat(2001) })).toThrow(/2000/);
    expect(() => validateOrderUpdate({ customerEmail: "changed@example.com" })).toThrow(/Unsupported/);
    expect(validateRetryBody({ recipients: ["baker"] })).toEqual(["baker"]);
    expect(() => validateRetryBody({ recipients: ["attacker"] })).toThrow(/Invalid/);
    const mutation = new Request("https://worker.test/admin/api/orders/1", {
      method: "PATCH",
      headers: { "X-CSRF-Token": "expected" },
    });
    expect(requireCsrf(mutation, { mode: "cookie", csrf: "expected" })).toBe(true);
    expect(requireCsrf(mutation, { mode: "cookie", csrf: "different" })).toBe(false);
    expect(requireCsrf(mutation, { mode: "bearer", csrf: null })).toBe(true);
  });
});

describe("storefront origin policy", () => {
  const environment = {
    STRIPE_SECRET_KEY: "sk_test",
    STOREFRONT_URL: "https://cakish.ie",
    ALLOWED_STOREFRONT_ORIGINS: "https://cakish.ie,https://www.cakish.ie",
  };

  it("uses the canonical storefront for redirects and allows configured browser origins", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      id: "cs_1",
      url: "https://checkout.stripe.test/session",
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await workerFetch(new Request("https://worker.test/", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://www.cakish.ie" },
      body: JSON.stringify({
        productId: "heart-pavlova",
        sizeId: "standard",
        fillingId: "nutella",
        quantity: 1,
        customerName: "Customer",
        customerEmail: "customer@example.com",
        collectionDate: "2026-08-01",
      }),
    }), environment);
    expect(response.status).toBe(200);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("https://www.cakish.ie");
    const stripeBody = new URLSearchParams(String(fetchMock.mock.calls[0][1]?.body));
    expect(stripeBody.get("success_url"))
      .toBe("https://cakish.ie/order/success/?session_id={CHECKOUT_SESSION_ID}");
    expect(stripeBody.get("cancel_url")).toBe("https://cakish.ie/order/");
  });

  it("rejects disallowed origins for requests and preflights without CORS disclosure", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    for (const request of [
      new Request("https://worker.test/session-status?session_id=cs_1", {
        headers: { Origin: "https://evil.example" },
      }),
      new Request("https://worker.test/", {
        method: "OPTIONS",
        headers: { Origin: "https://evil.example" },
      }),
    ]) {
      const response = await workerFetch(request, environment);
      expect(response.status).toBe(403);
      expect(response.headers.has("Access-Control-Allow-Origin")).toBe(false);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("permits origin-less non-browser status requests without adding CORS headers", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      id: "cs_1",
      payment_status: "paid",
      amount_total: 7500,
      currency: "eur",
      customer_email: "customer@example.com",
      metadata: { product: "Pavlova" },
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await workerFetch(
      new Request("https://worker.test/session-status?session_id=cs_1"),
      environment,
    );
    expect(response.status).toBe(200);
    expect(response.headers.has("Access-Control-Allow-Origin")).toBe(false);
  });
});
