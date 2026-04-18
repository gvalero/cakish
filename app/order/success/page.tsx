"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface OrderDetails {
  status: string;
  customerEmail: string;
  product: string;
  size: string;
  filling: string;
  finish: string;
  topper: string;
  quantity: string;
  customerName: string;
  collectionDate: string;
  note: string;
  total: string;
}

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setError("No session ID found. If you just completed a payment, check your email for confirmation.");
      setLoading(false);
      return;
    }

    const workerUrl = process.env.NEXT_PUBLIC_STRIPE_WORKER_URL || "https://cakish-stripe-checkout.valerogian.workers.dev";

    fetch(`${workerUrl}/session-status?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setOrder(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Could not verify your payment. Please check your email — if you received a confirmation, your order is secure.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
            Confirming your order
          </p>
          <p className="mt-2 font-serif text-2xl text-[color:var(--deep-charcoal)]">
            One moment…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
          Something went wrong
        </p>
        <h1 className="mt-4 font-serif text-3xl text-[color:var(--deep-charcoal)]">
          We couldn&apos;t verify your order
        </h1>
        <p className="mt-4 text-sm leading-6 text-[color:var(--body-copy)]">{error}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/order/" className="cakish-cta-secondary">
            Back to Order
          </Link>
          <a href="mailto:hello@cakish.ie" className="cakish-cta-primary">
            Contact Us
          </a>
        </div>
      </div>
    );
  }

  if (order?.status !== "paid") {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
          Payment pending
        </p>
        <h1 className="mt-4 font-serif text-3xl text-[color:var(--deep-charcoal)]">
          Your payment is still processing
        </h1>
        <p className="mt-4 text-sm leading-6 text-[color:var(--body-copy)]">
          This can take a few moments. You&apos;ll receive an email at{" "}
          <strong>{order?.customerEmail}</strong> once confirmed.
        </p>
        <Link href="/order/" className="cakish-cta-secondary mt-8 inline-block">
          Back to Order
        </Link>
      </div>
    );
  }

  // Format the collection date nicely
  const collectionDateFormatted = order.collectionDate
    ? new Date(order.collectionDate + "T00:00:00").toLocaleDateString("en-IE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : order.collectionDate;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:py-20">
      {/* Success Header — animated SVG checkmark */}
      <div className="text-center">
        <svg
          className="cakish-check mx-auto"
          viewBox="0 0 60 60"
          width="72"
          height="72"
          aria-hidden="true"
        >
          <circle
            cx="30"
            cy="30"
            r="27"
            fill="none"
            stroke="var(--berry-deep)"
            strokeWidth="2"
            className="cakish-check-circle"
          />
          <path
            d="M18 31 L27 40 L43 22"
            fill="none"
            stroke="var(--berry-deep)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="cakish-check-mark"
          />
        </svg>
        <p className="mt-6 cakish-eyebrow-berry">Order confirmed</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-[color:var(--deep-charcoal)] sm:text-5xl">
          Thank you,
          <em className="font-serif italic text-[color:var(--berry-deep)]"> {order.customerName}</em>.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-8 text-[color:var(--body-copy)]">
          Your pavlova is reserved and payment received. A confirmation email is on
          its way to <strong className="text-[color:var(--deep-charcoal)]">{order.customerEmail}</strong>.
        </p>
      </div>

      {/* Order Summary Card */}
      <div className="mt-12 border border-[color:var(--line)] bg-[color:var(--ivory)]">
        <div className="border-b border-[color:var(--line)] p-6">
          <p className="cakish-eyebrow">Order Summary</p>
        </div>
        <div className="space-y-3 p-6 text-sm text-[color:var(--body-copy)]">
          <div className="flex justify-between">
            <span className="text-[color:var(--muted-copy)]">Product</span>
            <span className="font-medium text-[color:var(--deep-charcoal)]">{order.product}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[color:var(--muted-copy)]">Size</span>
            <span>{order.size}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[color:var(--muted-copy)]">Filling</span>
            <span>{order.filling}</span>
          </div>
          {order.finish && (
            <div className="flex justify-between">
              <span className="text-[color:var(--muted-copy)]">Finish</span>
              <span>{order.finish}</span>
            </div>
          )}
          {order.topper && (
            <div className="flex justify-between">
              <span className="text-[color:var(--muted-copy)]">Topper</span>
              <span className="font-serif italic">&ldquo;{order.topper}&rdquo;</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[color:var(--muted-copy)]">Quantity</span>
            <span>{order.quantity}</span>
          </div>
          <div className="cakish-numeric flex justify-between border-t border-[color:var(--line)] pt-4 font-semibold text-[color:var(--deep-charcoal)]">
            <span>Total paid</span>
            <span>{order.total}</span>
          </div>
        </div>
      </div>

      {/* Collection Info */}
      <div className="mt-6 border border-[color:var(--line)] bg-[color:var(--soft-cream)] p-6">
        <p className="cakish-eyebrow-berry">Collection Details</p>
        <p className="mt-3 text-sm leading-7 text-[color:var(--body-copy)]">
          <strong className="text-[color:var(--deep-charcoal)]">Requested date:</strong> {collectionDateFormatted}
        </p>
        <p className="mt-2 text-sm leading-7 text-[color:var(--body-copy)]">
          Collection is from our Wicklow location. We&rsquo;ll confirm the exact
          address and time via email or WhatsApp shortly.
        </p>
      </div>

      {/* What's Next */}
      <div className="mt-6 border border-[color:var(--line)] bg-[color:var(--ivory)] p-6">
        <p className="cakish-eyebrow">What happens next?</p>
        <ol className="mt-4 space-y-3 text-sm leading-7 text-[color:var(--body-copy)]">
          <li className="flex gap-4">
            <span className="cakish-numeric font-serif text-[color:var(--berry-deep)]">01</span>
            <span>We&rsquo;ll confirm your collection date and share our Wicklow address.</span>
          </li>
          <li className="flex gap-4">
            <span className="cakish-numeric font-serif text-[color:var(--berry-deep)]">02</span>
            <span>Your pavlova will be handcrafted fresh for your date.</span>
          </li>
          <li className="flex gap-4">
            <span className="cakish-numeric font-serif text-[color:var(--berry-deep)]">03</span>
            <span>Collect, serve, and enjoy a centrepiece built just for your occasion.</span>
          </li>
        </ol>
      </div>

      {/* Share / Follow block */}
      <div className="mt-6 border border-[color:var(--line)] bg-[color:var(--ivory)] p-6 text-center">
        <p className="cakish-eyebrow-berry">Share the Moment</p>
        <p className="mt-3 text-sm leading-7 text-[color:var(--muted-copy)]">
          Tag <strong className="text-[color:var(--deep-charcoal)]">@cakish.ie</strong> when
          you serve your pavlova — we love to see them on the table.
        </p>
        <a
          href="https://www.instagram.com/cakish.ie/"
          target="_blank"
          rel="noopener noreferrer"
          className="cakish-link mt-3 inline-flex"
        >
          Follow @cakish.ie
        </a>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="/" className="cakish-cta-secondary">
          Back to Home
        </Link>
        <a
          href={`https://wa.me/353834462295?text=${encodeURIComponent("Hi! I just placed a Cakish order and wanted to confirm my collection details.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="cakish-cta-primary"
        >
          Message Us on WhatsApp
        </a>
      </div>
    </div>
  );
}
