"use client";

import { useMemo, useState } from "react";
import { productConfig, siteContent } from "@/lib/site-data";

type SizeKey = keyof typeof productConfig.sizes;
type FinishKey = keyof typeof productConfig.finishes;

export function OrderConfigurator() {
  const [selectedSize, setSelectedSize] = useState<SizeKey>('8"');
  const [selectedFinish, setSelectedFinish] =
    useState<FinishKey>("strawberry-floral-finish");
  const [quantity, setQuantity] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [soonOpen, setSoonOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const size = productConfig.sizes[selectedSize];
  const finish = productConfig.finishes[selectedFinish];

  const pricing = useMemo(() => {
    const unitPrice = size.basePrice + finish.surcharge;
    const total = unitPrice * quantity;
    return { unitPrice, total, finishSurcharge: finish.surcharge };
  }, [finish.surcharge, quantity, size.basePrice]);

  const inquirySummary = useMemo(
    () =>
      [
        "Cakish order enquiry",
        `Product: ${siteContent.productName}`,
        `Size: ${selectedSize}`,
        `Finish: ${finish.label}`,
        `Quantity: ${quantity}`,
        `Estimated total: EUR ${pricing.total}`,
        `Collection note: ${siteContent.collectionHighlights[0].copy}`,
      ].join("\n"),
    [finish.label, pricing.total, quantity, selectedSize],
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inquirySummary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">

        {/* ── Left: Options ── */}
        <div className="space-y-10">

          {/* Size */}
          <div>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-serif text-2xl text-[color:var(--deep-charcoal)]">
                Select your size
              </h2>
              <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-copy)]">
                Base price
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(
                Object.entries(productConfig.sizes) as Array<
                  [SizeKey, (typeof productConfig.sizes)[SizeKey]]
                >
              ).map(([key, option]) => {
                const active = key === selectedSize;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedSize(key)}
                    className={`rounded-sm border p-4 text-left transition ${
                      active
                        ? "border-[color:var(--deep-charcoal)] bg-[color:var(--deep-charcoal)] text-[color:var(--ivory)]"
                        : "border-[color:var(--line)] bg-white hover:border-[color:var(--deep-charcoal)]"
                    }`}
                  >
                    <p className={`font-serif text-2xl ${active ? "text-[color:var(--ivory)]" : "text-[color:var(--deep-charcoal)]"}`}>
                      {key}
                    </p>
                    <p className={`mt-1 text-xs font-semibold uppercase tracking-[0.18em] ${active ? "text-[color:var(--soft-gold)]" : "text-[color:var(--soft-gold)]"}`}>
                      EUR {option.basePrice}
                    </p>
                    <p className={`mt-2 hidden text-xs leading-5 md:block ${active ? "text-white/70" : "text-[color:var(--muted-copy)]"}`}>
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="cakish-rule" />

          {/* Finish */}
          <div>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-serif text-2xl text-[color:var(--deep-charcoal)]">
                Choose your finish
              </h2>
              <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-copy)]">
                Presentation
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                Object.entries(productConfig.finishes) as Array<
                  [FinishKey, (typeof productConfig.finishes)[FinishKey]]
                >
              ).map(([key, option]) => {
                const active = key === selectedFinish;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedFinish(key)}
                    className={`rounded-sm border p-4 text-left transition ${
                      active
                        ? "border-[color:var(--deep-charcoal)] bg-[color:var(--deep-charcoal)] text-[color:var(--ivory)]"
                        : "border-[color:var(--line)] bg-white hover:border-[color:var(--deep-charcoal)]"
                    }`}
                  >
                    <p className={`font-serif text-xl leading-tight ${active ? "text-[color:var(--ivory)]" : "text-[color:var(--deep-charcoal)]"}`}>
                      {option.label}
                    </p>
                    <p className={`mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--soft-gold)]`}>
                      {option.surcharge > 0 ? `+EUR ${option.surcharge}` : "Included"}
                    </p>
                    <p className={`mt-2 text-xs leading-5 ${active ? "text-white/70" : "text-[color:var(--muted-copy)]"}`}>
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="cakish-rule" />

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-copy)]">
                Quantity
              </p>
              <p className="mt-1 font-serif text-3xl text-[color:var(--deep-charcoal)]">
                {quantity}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-[color:var(--line)] bg-white text-xl transition hover:border-[color:var(--deep-charcoal)]"
                onClick={() => setQuantity((v) => Math.max(1, v - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-[color:var(--line)] bg-white text-xl transition hover:border-[color:var(--deep-charcoal)]"
                onClick={() => setQuantity((v) => v + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Order Summary ── */}
        <aside className="border border-[color:var(--line)] bg-white p-6 lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
            Order Summary
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[color:var(--deep-charcoal)]">
            {siteContent.productName}
          </h2>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[color:var(--muted-copy)]">
            {selectedSize} · {finish.label}
          </p>

          <div className="mt-6 space-y-3 border-t border-[color:var(--line)] pt-5 text-sm text-[color:var(--body-copy)]">
            <div className="flex justify-between">
              <span>Size base</span>
              <span>EUR {size.basePrice}</span>
            </div>
            <div className="flex justify-between">
              <span>{finish.label}</span>
              <span>{pricing.finishSurcharge > 0 ? `+EUR ${pricing.finishSurcharge}` : "Included"}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity</span>
              <span>{quantity}</span>
            </div>
            <div className="flex justify-between border-t border-[color:var(--line)] pt-3 font-semibold text-[color:var(--deep-charcoal)]">
              <span>Estimated total</span>
              <span>EUR {pricing.total}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              className="cakish-button w-full"
              onClick={() => setDrawerOpen(true)}
            >
              Proceed to Checkout
            </button>
            <button
              type="button"
              className="cakish-button-secondary w-full"
              onClick={handleCopy}
            >
              {copied ? "Copied ✓" : "Enquire by Email / WhatsApp"}
            </button>
            {copied && (
              <p className="text-xs leading-5 text-[color:var(--muted-copy)]">
                Order summary copied. Paste it into your preferred channel.
              </p>
            )}
          </div>

          <div className="mt-6 border-t border-[color:var(--line)] pt-5 text-xs leading-5 text-[color:var(--muted-copy)]">
            <p className="font-semibold uppercase tracking-[0.18em] text-[color:var(--soft-gold)]">
              Collection only
            </p>
            <p className="mt-1">{siteContent.collectionModel}</p>
          </div>
        </aside>
      </div>

      {/* ── Checkout overlay ── */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-end"
        >
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside
            className="relative z-[60] flex w-full max-w-lg flex-col overflow-y-auto border-l border-[color:var(--line)] bg-[color:var(--ivory)] p-6 shadow-[-20px_0_50px_rgba(0,0,0,0.12)] md:p-10"
            style={{ height: "100dvh" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
                  Checkout Preview
                </p>
                <h2 className="mt-2 font-serif text-3xl text-[color:var(--deep-charcoal)]">
                  Your order
                </h2>
              </div>
              <button
                type="button"
                onClick={() => { setDrawerOpen(false); setSoonOpen(false); }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-[color:var(--line)] bg-white text-xl"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-8 space-y-4">
              <div className="border border-[color:var(--line)] bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-xl text-[color:var(--deep-charcoal)]">
                      {selectedSize} · {finish.label}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[color:var(--muted-copy)]">
                      Qty {quantity}
                    </p>
                  </div>
                  <p className="font-serif text-xl text-[color:var(--deep-charcoal)]">
                    EUR {pricing.total}
                  </p>
                </div>
              </div>

              <div className="space-y-4 border border-[color:var(--line)] bg-white p-4">
                {["Full name", "Email address", "Preferred collection date"].map((field) => (
                  <label key={field} className="block space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-copy)]">
                    {field}
                    <input
                      aria-label={field}
                      readOnly
                      placeholder={field}
                      className="mt-1 block w-full border border-[color:var(--line)] bg-[color:var(--ivory)] px-3 py-2.5 text-sm text-[color:var(--body-copy)] outline-none"
                    />
                  </label>
                ))}
              </div>

              <div className="border border-[color:var(--line)] bg-white p-4 text-xs leading-5 text-[color:var(--muted-copy)]">
                <p className="font-semibold uppercase tracking-[0.18em] text-[color:var(--soft-gold)]">
                  Fulfilment
                </p>
                <p className="mt-1">{siteContent.collectionModel}</p>
              </div>
            </div>

            <div className="mt-auto space-y-3 pt-8">
              <button
                type="button"
                className="cakish-button w-full"
                onClick={() => setSoonOpen(true)}
              >
                Pay Securely Online
              </button>
              <p className="text-xs leading-5 text-[color:var(--muted-copy)]">
                Direct payment will be connected in a future release.
              </p>
            </div>

            {soonOpen && (
              <div
                role="dialog"
                aria-modal="true"
                className="absolute inset-4 grid place-items-center border border-[color:var(--line)] bg-[color:var(--ivory)] p-6 text-center shadow-lg"
              >
                <div className="max-w-xs space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
                    Coming Soon
                  </p>
                  <h3 className="font-serif text-3xl text-[color:var(--deep-charcoal)]">
                    Payments coming soon.
                  </h3>
                  <p className="text-sm leading-6 text-[color:var(--body-copy)]">
                    For now, use the enquiry option to reserve your date and confirm your order.
                  </p>
                  <button
                    type="button"
                    className="cakish-button-secondary"
                    onClick={() => setSoonOpen(false)}
                  >
                    Got it
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
