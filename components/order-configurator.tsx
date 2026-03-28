"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { productConfig, siteContent } from "@/lib/site-data";
import { assetPath } from "@/lib/asset-path";

type SizeKey = keyof typeof productConfig.sizes;
type FinishKey = keyof typeof productConfig.finishes;

// Image map: size + finish → image path
const productImages: Record<SizeKey, Record<FinishKey, string>> = {
  '6"': {
    "strawberry-floral-finish": "/images/order_size_6inch.jpg",
    "patisserie-sliced-finish": "/images/order_finish_chopped.jpg",
  },
  '8"': {
    "strawberry-floral-finish": "/images/order_finish_floral.jpg",
    "patisserie-sliced-finish": "/images/order_size_8inch.jpg",
  },
  '12"': {
    "strawberry-floral-finish": "/images/order_size_12inch.jpg",
    "patisserie-sliced-finish": "/images/order_finish_chopped.jpg",
  },
};

const finishLabels: Record<FinishKey, string> = {
  "strawberry-floral-finish": "Strawberry Floral Finish",
  "patisserie-sliced-finish": "Patisserie Sliced Finish",
};

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

  const currentImage = productImages[selectedSize][selectedFinish];

  const pricing = useMemo(() => {
    const unitPrice = size.basePrice + finish.surcharge;
    const total = unitPrice * quantity;

    return {
      unitPrice,
      total,
      finishSurcharge: finish.surcharge,
    };
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
      {/* ── Dynamic Product Image Panel ── */}
      {/* Mobile: full-width image above configurator */}
      <div className="lg:hidden w-full overflow-hidden rounded-[2rem] border border-[color:var(--line)] shadow-[0_24px_70px_rgba(53,45,34,0.10)]">
        <div className="relative w-full" style={{ paddingBottom: "75%" }}>
          <Image
            key={currentImage}
            src={assetPath(currentImage)}
            alt={`${selectedSize} Cakish Modern Pavlova with ${finishLabels[selectedFinish]}`}
            fill
            className="object-cover transition-opacity duration-500"
            sizes="100vw"
            priority
          />
          {/* Overlay label */}
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/40 to-transparent p-4 md:p-5">
            <div>
              <p className="font-serif text-xl text-white drop-shadow md:text-2xl">
                {selectedSize} · {finish.label}
              </p>
              <p className="text-sm uppercase tracking-[0.18em] text-white/80 drop-shadow">
                EUR {pricing.unitPrice} per pavlova
              </p>
            </div>
            <span className="rounded-full border border-white/40 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
              Live Preview
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Configurator Grid ── */}
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.05fr_0.95fr]">

        {/* Left: Dynamic Image Panel — desktop only */}
        <div className="hidden lg:flex flex-col overflow-hidden rounded-[2rem] border border-[color:var(--line)] shadow-[0_24px_70px_rgba(53,45,34,0.10)] md:rounded-[2.6rem]">
          <div className="relative flex-1 min-h-[480px]">
            <Image
              key={currentImage}
              src={assetPath(currentImage)}
              alt={`${selectedSize} Cakish Modern Pavlova with ${finishLabels[selectedFinish]}`}
              fill
              className="object-cover transition-opacity duration-500"
              sizes="(min-width: 1024px) 30vw, 100vw"
              priority
            />
            {/* Overlay label */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/40 to-transparent p-5">
              <div>
                <p className="font-serif text-xl text-white drop-shadow">
                  {selectedSize} · {finish.label}
                </p>
                <p className="text-sm uppercase tracking-[0.18em] text-white/80 drop-shadow">
                  EUR {pricing.unitPrice} per pavlova
                </p>
              </div>
              <span className="rounded-full border border-white/40 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                Live Preview
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Configurator */}
        <div className="space-y-6 rounded-[2rem] border border-[color:var(--line)] bg-white/75 p-5 shadow-[0_24px_70px_rgba(53,45,34,0.08)] md:rounded-[2.6rem] md:p-8">
          <div className="space-y-3">
            <span className="section-label">Configurator</span>
            <h2 className="font-serif text-3xl text-[color:var(--deep-charcoal)] md:text-5xl">
              Design your order.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-[color:var(--body-copy)]">
              Select your size, choose your presentation finish, and review the
              live total before opening the checkout preview.
            </p>
          </div>

          {/* Size selection */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
              <h3 className="font-serif text-2xl text-[color:var(--deep-charcoal)] md:text-3xl">
                Select your size
              </h3>
              <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted-copy)]">
                Base pricing
              </p>
            </div>
            <div className="grid gap-3 grid-cols-3">
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
                    className={`rounded-[1.6rem] border p-4 text-left transition md:rounded-[2rem] md:p-5 ${
                      active
                        ? "border-[color:var(--soft-gold)] bg-[rgba(198,167,105,0.12)] shadow-[0_18px_40px_rgba(198,167,105,0.16)]"
                        : "border-[color:var(--line)] bg-[rgba(255,255,255,0.72)] hover:border-[color:var(--soft-gold)]/50"
                    }`}
                  >
                    <p className="font-serif text-2xl text-[color:var(--deep-charcoal)] md:text-3xl">
                      {key}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--soft-gold)] md:text-sm md:tracking-[0.2em]">
                      EUR {option.basePrice}
                    </p>
                    <p className="mt-2 hidden text-sm leading-6 text-[color:var(--muted-copy)] md:block">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Finish selection */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
              <h3 className="font-serif text-2xl text-[color:var(--deep-charcoal)] md:text-3xl">
                Choose your finish
              </h3>
              <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted-copy)]">
                Premium enhancement
              </p>
            </div>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
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
                    className={`rounded-[1.6rem] border p-4 text-left transition md:rounded-[2rem] md:p-5 ${
                      active
                        ? "border-[color:var(--soft-gold)] bg-[rgba(216,167,167,0.12)] shadow-[0_18px_40px_rgba(216,167,167,0.14)]"
                        : "border-[color:var(--line)] bg-[rgba(255,255,255,0.72)] hover:border-[color:var(--muted-rose)]/60"
                    }`}
                  >
                    <p className="font-serif text-xl leading-tight text-[color:var(--deep-charcoal)] md:text-2xl">
                      {option.label}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--soft-gold)] md:text-sm md:tracking-[0.2em]">
                      {option.surcharge > 0 ? `+EUR ${option.surcharge}` : "Included"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--muted-copy)]">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div className="grid gap-4 rounded-[1.6rem] border border-[color:var(--line)] bg-[rgba(255,255,255,0.75)] p-4 md:grid-cols-[auto_1fr] md:items-center md:rounded-[2rem] md:p-5">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-[color:var(--soft-gold)]">
                Quantity
              </p>
              <p className="mt-2 font-serif text-2xl text-[color:var(--deep-charcoal)] md:text-3xl">
                {quantity}
              </p>
            </div>
            <div className="flex items-center gap-3 justify-self-start md:justify-self-end">
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--line)] bg-white text-2xl"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--line)] bg-white text-2xl"
                onClick={() => setQuantity((value) => value + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <aside className="space-y-5 rounded-[2rem] border border-[color:var(--line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.86),rgba(243,239,233,0.94))] p-5 shadow-[0_24px_70px_rgba(53,45,34,0.08)] md:rounded-[2.6rem] md:p-8">
          <div className="space-y-3">
            <span className="section-label">Order Summary</span>
            <h2 className="font-serif text-3xl text-[color:var(--deep-charcoal)] md:text-4xl">
              A polished preview of your order.
            </h2>
          </div>

          <div className="space-y-4 rounded-[1.6rem] border border-[color:var(--line)] bg-white/80 p-4 md:rounded-[2rem] md:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-serif text-2xl text-[color:var(--deep-charcoal)] md:text-3xl">
                  {siteContent.productName}
                </p>
                <p className="mt-1 text-sm uppercase tracking-[0.18em] text-[color:var(--soft-gold)]">
                  {selectedSize} · {finish.label}
                </p>
              </div>
              <p className="font-serif text-2xl text-[color:var(--deep-charcoal)] md:text-3xl">
                EUR {pricing.unitPrice}
              </p>
            </div>

            <div className="space-y-3 text-sm text-[color:var(--body-copy)]">
              <div className="flex justify-between gap-4">
                <span>Size base</span>
                <span>EUR {size.basePrice}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>{finish.label}</span>
                <span>
                  {pricing.finishSurcharge > 0
                    ? `+EUR ${pricing.finishSurcharge}`
                    : "Included"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Quantity</span>
                <span>{quantity}</span>
              </div>
              <div className="flex justify-between gap-4 border-t border-[color:var(--line)] pt-3 font-semibold text-[color:var(--deep-charcoal)]">
                <span>Estimated total</span>
                <span>EUR {pricing.total}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="button"
              className="cakish-button w-full"
              onClick={() => setDrawerOpen(true)}
            >
              Proceed to Secure Checkout
            </button>
            <button
              type="button"
              className="cakish-button-secondary w-full"
              onClick={handleCopy}
            >
              {copied ? "Inquiry Copied" : "Enquire For Your Date"}
            </button>
            <p className="text-sm leading-6 text-[color:var(--muted-copy)]">
              {copied
                ? "Your order summary has been copied. You can now send it through your preferred enquiry channel."
                : "Use the enquiry button to copy a ready-to-send order summary for WhatsApp, Instagram, or email."}
            </p>
          </div>
        </aside>
      </section>

      {/* Checkout overlay */}
      {drawerOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-end"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer */}
          <aside
            className="relative z-[60] flex w-full max-w-xl flex-col overflow-y-auto border-l border-[color:var(--line)] bg-[linear-gradient(180deg,#fbfaf8_0%,#f4ede4_100%)] p-4 shadow-[-24px_0_60px_rgba(53,45,34,0.18)] md:p-8"
            style={{ height: "100dvh" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-label">Checkout Preview</p>
                <h2 className="mt-4 font-serif text-3xl text-[color:var(--deep-charcoal)] md:text-4xl">
                  Secure checkout, styled for what comes next.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  setSoonOpen(false);
                }}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--line)] bg-white/80 text-xl"
                aria-label="Close checkout preview"
              >
                ×
              </button>
            </div>
            <div className="mt-6 space-y-4 md:mt-8 md:space-y-5">
              <div className="rounded-[1.6rem] border border-[color:var(--line)] bg-white/80 p-4 md:rounded-[2rem] md:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-2xl text-[color:var(--deep-charcoal)] md:text-3xl">
                      {selectedSize}
                    </p>
                    <p className="mt-1 text-sm uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
                      {finish.label}
                    </p>
                  </div>
                  <p className="font-serif text-2xl text-[color:var(--deep-charcoal)] md:text-3xl">
                    EUR {pricing.total}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 rounded-[1.6rem] border border-[color:var(--line)] bg-white/80 p-4 md:rounded-[2rem] md:p-5">
                {["Full name", "Email address", "Preferred collection date"].map(
                  (field) => (
                    <label key={field} className="space-y-2 text-sm font-medium">
                      <span className="uppercase tracking-[0.18em] text-[color:var(--muted-copy)]">
                        {field}
                      </span>
                      <input
                        aria-label={field}
                        readOnly
                        placeholder={field}
                        className="w-full rounded-[1.2rem] border border-[color:var(--line)] bg-[rgba(248,246,242,0.95)] px-4 py-3 text-base text-[color:var(--body-copy)] outline-none"
                      />
                    </label>
                  ),
                )}
              </div>
              <div className="rounded-[1.6rem] border border-[color:var(--line)] bg-white/80 p-4 text-sm leading-6 text-[color:var(--body-copy)] md:rounded-[2rem] md:p-5">
                <p className="font-semibold uppercase tracking-[0.18em] text-[color:var(--soft-gold)]">
                  Fulfilment
                </p>
                <p className="mt-2">{siteContent.collectionModel}</p>
              </div>
            </div>
            <div className="mt-8 space-y-4 pb-4 md:mt-auto md:pt-8">
              <button
                type="button"
                className="cakish-button w-full"
                onClick={() => setSoonOpen(true)}
              >
                Pay Securely Online
              </button>
              <p className="text-sm leading-6 text-[color:var(--muted-copy)]">
                This button is already positioned where direct payments will be
                connected later through your chosen provider.
              </p>
            </div>
            {soonOpen ? (
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="payments-soon-title"
                className="absolute inset-3 grid place-items-center rounded-[2rem] border border-white/40 bg-[rgba(248,246,242,0.9)] p-5 text-center shadow-[0_18px_50px_rgba(53,45,34,0.14)] backdrop-blur-md md:inset-6 md:rounded-[2.4rem] md:p-8"
              >
                <div className="max-w-sm space-y-4">
                  <p className="section-label">Soon</p>
                  <h3
                    id="payments-soon-title"
                    className="font-serif text-4xl text-[color:var(--deep-charcoal)] md:text-5xl"
                  >
                    Payments are coming soon.
                  </h3>
                  <p className="text-base leading-7 text-[color:var(--body-copy)]">
                    Direct online payment will be connected in a future release.
                    For now, use the enquiry option to reserve your date and confirm
                    your order details.
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
            ) : null}
          </aside>
        </div>
      ) : null}
    </>
  );
}
