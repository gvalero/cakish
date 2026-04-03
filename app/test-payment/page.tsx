"use client";

import { useState } from "react";

const SIZES = [
  { key: '6"', label: '6″', price: 48 },
  { key: '8"', label: '8″', price: 68 },
  { key: '12"', label: '12″', price: 112 },
];

const FINISHES = [
  { key: "strawberry-floral-finish", label: "Strawberry Floral", surcharge: 18 },
  { key: "patisserie-sliced-finish", label: "Patisserie Sliced", surcharge: 0 },
];

// Point this at your deployed Cloudflare Worker URL
const WORKER_URL =
  process.env.NEXT_PUBLIC_STRIPE_WORKER_URL ||
  "http://localhost:8787";

export default function TestPaymentPage() {
  const [size, setSize] = useState(SIZES[1].key);
  const [finish, setFinish] = useState(FINISHES[0].key);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sizeObj = SIZES.find((s) => s.key === size)!;
  const finishObj = FINISHES.find((f) => f.key === finish)!;
  const unitPrice = sizeObj.price + finishObj.surcharge;
  const total = unitPrice * quantity;

  // Check for return status from Stripe
  const params = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : null;
  const status = params?.get("status");

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size, finish, quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      // Redirect to Stripe hosted checkout
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (status === "success") {
    return (
      <div style={{ padding: 40, fontFamily: "sans-serif" }}>
        <h1 style={{ color: "green" }}>✅ Payment successful!</h1>
        <p>The Stripe integration is working. This was a test transaction.</p>
        <a href="/test-payment">← Try another</a>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div style={{ padding: 40, fontFamily: "sans-serif" }}>
        <h1 style={{ color: "orange" }}>⚠️ Payment cancelled</h1>
        <p>You cancelled the checkout. No charge was made.</p>
        <a href="/test-payment">← Try again</a>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 500 }}>
      <h1>Stripe Payment Test</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Minimal test page — no design, just verifying the Stripe connection.
      </p>

      {/* Size */}
      <fieldset style={{ marginBottom: 16, border: "none", padding: 0 }}>
        <legend><strong>Size</strong></legend>
        {SIZES.map((s) => (
          <label key={s.key} style={{ display: "block", margin: "4px 0", cursor: "pointer" }}>
            <input
              type="radio"
              name="size"
              value={s.key}
              checked={size === s.key}
              onChange={() => setSize(s.key)}
            />{" "}
            {s.label} — €{s.price}
          </label>
        ))}
      </fieldset>

      {/* Finish */}
      <fieldset style={{ marginBottom: 16, border: "none", padding: 0 }}>
        <legend><strong>Finish</strong></legend>
        {FINISHES.map((f) => (
          <label key={f.key} style={{ display: "block", margin: "4px 0", cursor: "pointer" }}>
            <input
              type="radio"
              name="finish"
              value={f.key}
              checked={finish === f.key}
              onChange={() => setFinish(f.key)}
            />{" "}
            {f.label} {f.surcharge > 0 ? `(+€${f.surcharge})` : "(included)"}
          </label>
        ))}
      </fieldset>

      {/* Quantity */}
      <div style={{ marginBottom: 16 }}>
        <strong>Quantity: </strong>
        <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
        <span style={{ margin: "0 12px", fontSize: 18 }}>{quantity}</span>
        <button onClick={() => setQuantity((q) => q + 1)}>+</button>
      </div>

      {/* Total */}
      <div style={{
        padding: 16,
        background: "#f5f5f5",
        borderRadius: 8,
        marginBottom: 24,
        fontSize: 18,
      }}>
        <strong>Total: €{total}</strong>
        <br />
        <span style={{ fontSize: 13, color: "#888" }}>
          {sizeObj.label} {finishObj.label} × {quantity}
        </span>
      </div>

      {/* Pay button */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          padding: "12px 32px",
          fontSize: 16,
          background: loading ? "#999" : "#635bff",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: loading ? "not-allowed" : "pointer",
          width: "100%",
        }}
      >
        {loading ? "Redirecting to Stripe..." : `Pay €${total} with Stripe`}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 12 }}>{error}</p>
      )}

      <p style={{ marginTop: 24, fontSize: 12, color: "#aaa" }}>
        Using Stripe test mode. No real charges will be made.
        <br />
        Test card: 4242 4242 4242 4242, any future expiry, any CVC.
      </p>
    </div>
  );
}
