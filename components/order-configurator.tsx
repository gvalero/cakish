"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import Image from "next/image";
import {
  products,
  fillingOptions,
  finishOptions,
  siteContent,
  type Product,
  type FillingId,
  type FinishId,
} from "@/lib/site-data";
import { assetPath } from "@/lib/asset-path";

export function OrderConfigurator() {
  // ── State ──
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);
  const [selectedSizeId, setSelectedSizeId] = useState(products[0].sizes[0].id);
  const [selectedFilling, setSelectedFilling] = useState<FillingId>("nutella");
  const [selectedFinish, setSelectedFinish] = useState<FinishId>("patisserie-sliced");
  const [topperMessage, setTopperMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── Customer info state ──
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Read ?product= from URL on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("product");
    if (slug) {
      const found = products.find((p) => p.slug === slug);
      if (found) {
        setSelectedProductId(found.id);
        setSelectedSizeId(found.sizes[0].id);
      }
    }
  }, []);

  const product: Product = useMemo(
    () => products.find((p) => p.id === selectedProductId) ?? products[0],
    [selectedProductId],
  );

  const selectedSize = useMemo(
    () => product.sizes.find((s) => s.id === selectedSizeId) ?? product.sizes[0],
    [product, selectedSizeId],
  );

  const selectedFillingOption = useMemo(
    () => fillingOptions.find((f) => f.id === selectedFilling) ?? fillingOptions[0],
    [selectedFilling],
  );

  const selectedFinishOption = useMemo(
    () => finishOptions.find((f) => f.id === selectedFinish) ?? finishOptions[0],
    [selectedFinish],
  );

  const showFinishOptions = useMemo(() => {
    return product.hasFinishOptions;
  }, [product]);

  // When product changes, reset size to first available
  const handleProductChange = useCallback((id: string) => {
    setSelectedProductId(id);
    const p = products.find((pr) => pr.id === id);
    if (p) setSelectedSizeId(p.sizes[0].id);
    setQuantity(1);
    setTopperMessage("");
  }, []);

  const priceDisplay = useMemo(() => {
    if (selectedSize.price > 0) {
      const base = selectedSize.price;
      const fillingSurcharge = selectedFillingOption.surcharge;
      const finishSurcharge = showFinishOptions ? selectedFinishOption.surcharge : 0;
      const topperCost = topperMessage.trim() ? product.topperPrice : 0;
      const unit = base + fillingSurcharge + finishSurcharge + topperCost;
      const total = unit * quantity;
      return { base, fillingSurcharge, finishSurcharge, topperCost, unit, total, hasPrice: true };
    }
    return { base: 0, fillingSurcharge: 0, finishSurcharge: 0, topperCost: 0, unit: 0, total: 0, hasPrice: false };
  }, [selectedSize, quantity, topperMessage, product.topperPrice, selectedFillingOption, selectedFinishOption, showFinishOptions]);

  const inquirySummary = useMemo(() => {
    const lines = [
      "Hi Cakish! I'd like to order a pavlova.",
      "",
      `Product: ${product.name}`,
      `Size: ${selectedSize.label} (${selectedSize.diameter}) — serves ${selectedSize.serves}`,
      `Filling: ${selectedFillingOption.label}${selectedFillingOption.surcharge > 0 ? ` (+EUR ${selectedFillingOption.surcharge})` : " (included)"}`,
    ];
    if (showFinishOptions) {
      lines.push(`Finish: ${selectedFinishOption.label}${selectedFinishOption.surcharge > 0 ? ` (+EUR ${selectedFinishOption.surcharge})` : " (included)"}`);
    }
    if (topperMessage.trim()) {
      lines.push(`Custom topper message: "${topperMessage.trim()}" (+EUR ${product.topperPrice})`);
    }
    lines.push(`Quantity: ${quantity}`);
    if (priceDisplay.hasPrice) {
      lines.push(`Estimated total: EUR ${priceDisplay.total.toFixed(2)}`);
    }
    lines.push("");
    lines.push("Please let me know your availability and collection details. Thank you!");
    return lines.join("\n");
  }, [product, selectedSize, selectedFillingOption, selectedFinishOption, showFinishOptions, topperMessage, quantity, priceDisplay]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inquirySummary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: select from a temporary textarea
      const ta = document.createElement("textarea");
      ta.value = inquirySummary;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Cakish Order — ${product.name} (${selectedSize.label})`);
    const body = encodeURIComponent(inquirySummary);
    window.open(`mailto:${siteContent.email}?subject=${subject}&body=${body}`);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(inquirySummary);
    window.open(`https://wa.me/353834462295?text=${text}`);
  };

  // Close drawer on Escape key
  useEffect(() => {
    if (!drawerOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setDrawerOpen(false); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [drawerOpen]);

  // ── Checkout handler ──
  const isCheckoutReady = customerName.trim().length > 0
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
    && collectionDate.length > 0;

  const handleCheckout = async () => {
    if (!isCheckoutReady) return;
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const workerUrl = process.env.NEXT_PUBLIC_STRIPE_WORKER_URL || "https://cakish-stripe-checkout.valerogian.workers.dev";
      const res = await fetch(workerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductId,
          sizeId: selectedSizeId,
          fillingId: selectedFilling,
          finishId: showFinishOptions ? selectedFinish : undefined,
          topperMessage: topperMessage.trim() || undefined,
          quantity,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          collectionDate,
          customerNote: customerNote.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (err: unknown) {
      setCheckoutError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setCheckoutLoading(false);
    }
  };

  // Step counter
  let stepCount = 1;
  const nextStep = () => stepCount++;

  return (
    <>
    <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start">

      {/* ── Left: Options ── */}
      <div className="space-y-10">

        {/* Step 1: Choose Product */}
        <fieldset>
          <legend className="mb-5">
            <StepLabel step={nextStep()} label="Choose your pavlova" />
          </legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {products.map((p) => {
              const active = p.id === selectedProductId;
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => handleProductChange(p.id)}
                  className={`overflow-hidden rounded-sm border text-left transition ${
                    active
                      ? "border-[color:var(--deep-charcoal)] ring-1 ring-[color:var(--deep-charcoal)]"
                      : "border-[color:var(--line)] hover:border-[color:var(--deep-charcoal)]"
                  }`}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={assetPath(p.image)}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className={`text-sm font-medium leading-tight ${active ? "text-[color:var(--deep-charcoal)]" : "text-[color:var(--body-copy)]"}`}>
                      {p.name}
                    </p>
                    <p className="mt-0.5 text-xs text-[color:var(--muted-copy)]">
                      {p.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </fieldset>

        <hr className="cakish-rule" />

        {/* Step 2: Select Size */}
        <fieldset>
          <legend className="mb-5">
            <StepLabel step={nextStep()} label="Select your size" />
          </legend>
          <div className={`grid gap-3 ${product.sizes.length === 1 ? "grid-cols-1 max-w-xs" : "grid-cols-1 sm:grid-cols-3"}`}>
            {product.sizes.map((size) => {
              const active = size.id === selectedSizeId;
              return (
                <button
                  key={size.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedSizeId(size.id)}
                  className={`rounded-sm border p-4 text-left transition ${
                    active
                      ? "border-[color:var(--deep-charcoal)] bg-[color:var(--deep-charcoal)] text-[color:var(--ivory)]"
                      : "border-[color:var(--line)] bg-white hover:border-[color:var(--deep-charcoal)]"
                  }`}
                >
                  <p className={`font-serif text-2xl ${active ? "text-[color:var(--ivory)]" : "text-[color:var(--deep-charcoal)]"}`}>
                    {size.label}
                  </p>
                  <p className={`mt-1 text-xs ${active ? "text-white/70" : "text-[color:var(--muted-copy)]"}`}>
                    {size.diameter}
                  </p>
                  <p className={`mt-0.5 text-xs ${active ? "text-white/70" : "text-[color:var(--muted-copy)]"}`}>
                    Serves {size.serves}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--soft-gold)]">
                    {size.price > 0 ? `EUR ${size.price}` : "Price on enquiry"}
                  </p>
                </button>
              );
            })}
          </div>
        </fieldset>

        <hr className="cakish-rule" />

        {/* Step 3: Choose Filling */}
        <fieldset>
          <legend className="mb-5">
            <StepLabel step={nextStep()} label="Choose your filling" />
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {fillingOptions.map((filling) => {
              const active = filling.id === selectedFilling;
              return (
                <button
                  key={filling.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedFilling(filling.id)}
                  className={`rounded-sm border p-4 text-left transition ${
                    active
                      ? "border-[color:var(--deep-charcoal)] bg-[color:var(--deep-charcoal)] text-[color:var(--ivory)]"
                      : "border-[color:var(--line)] bg-white hover:border-[color:var(--deep-charcoal)]"
                  }`}
                >
                  <p className={`font-serif text-xl leading-tight ${active ? "text-[color:var(--ivory)]" : "text-[color:var(--deep-charcoal)]"}`}>
                    {filling.label}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--soft-gold)]">
                    {filling.surcharge > 0 ? `+EUR ${filling.surcharge}` : "Included"}
                  </p>
                  <p className={`mt-1.5 text-xs ${active ? "text-white/70" : "text-[color:var(--muted-copy)]"}`}>
                    {filling.description}
                  </p>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Step 4: Finish (Strawberry Pavlova only) */}
        {showFinishOptions && (
          <>
            <hr className="cakish-rule" />
            <fieldset>
              <legend className="mb-5">
                <StepLabel step={nextStep()} label="Choose your finish" />
                <p className="mt-1 text-xs text-[color:var(--muted-copy)]">
                  Available for Strawberry Pavlova
                </p>
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {finishOptions.map((finish) => {
                  const active = finish.id === selectedFinish;
                  return (
                    <button
                      key={finish.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedFinish(finish.id)}
                      className={`rounded-sm border p-4 text-left transition ${
                        active
                          ? "border-[color:var(--deep-charcoal)] bg-[color:var(--deep-charcoal)] text-[color:var(--ivory)]"
                          : "border-[color:var(--line)] bg-white hover:border-[color:var(--deep-charcoal)]"
                      }`}
                    >
                      <p className={`font-serif text-xl leading-tight ${active ? "text-[color:var(--ivory)]" : "text-[color:var(--deep-charcoal)]"}`}>
                        {finish.label}
                      </p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--soft-gold)]">
                        {finish.surcharge > 0 ? `+EUR ${finish.surcharge}` : "Included"}
                      </p>
                      <p className={`mt-2 text-xs leading-5 ${active ? "text-white/70" : "text-[color:var(--muted-copy)]"}`}>
                        {finish.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </>
        )}

        <hr className="cakish-rule" />

        {/* Step: Custom Topper */}
        {product.hasTopper && (
          <fieldset>
            <legend className="mb-5">
              <StepLabel step={nextStep()} label="Custom topper message" />
              <p className="mt-1 text-xs text-[color:var(--muted-copy)]">
                Optional — add a personal message to your pavlova (+EUR {product.topperPrice})
              </p>
            </legend>
            <input
              type="text"
              value={topperMessage}
              onChange={(e) => setTopperMessage(e.target.value)}
              placeholder='e.g. "Happy Birthday Sarah!" or "Congratulations!"'
              maxLength={50}
              className="w-full max-w-md rounded-sm border border-[color:var(--line)] bg-white px-4 py-3 text-sm text-[color:var(--body-copy)] outline-none transition focus:border-[color:var(--deep-charcoal)]"
              aria-label="Custom topper message"
            />
            <p className="mt-2 text-xs text-[color:var(--muted-copy)]">
              {topperMessage.length}/50 characters
            </p>
          </fieldset>
        )}

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
              &minus;
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
      <aside
        className="border border-[color:var(--line)] bg-white p-6 lg:sticky lg:top-24"
        aria-label="Order summary"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
          Your Order Summary
        </p>
        <h2 className="mt-2 font-serif text-2xl text-[color:var(--deep-charcoal)]">
          {product.name}
        </h2>
        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[color:var(--muted-copy)]">
          {selectedSize.label} ({selectedSize.diameter}) &middot; Serves {selectedSize.serves}
        </p>

        <div className="mt-6 space-y-3 border-t border-[color:var(--line)] pt-5 text-sm text-[color:var(--body-copy)]">
          <div className="flex justify-between">
            <span>Size base</span>
            <span>EUR {selectedSize.price}</span>
          </div>
          <div className="flex justify-between">
            <span>{selectedFillingOption.label}</span>
            <span>{selectedFillingOption.surcharge > 0 ? `+EUR ${selectedFillingOption.surcharge}` : "Included"}</span>
          </div>
          {showFinishOptions && (
            <div className="flex justify-between">
              <span>{selectedFinishOption.label}</span>
              <span>{selectedFinishOption.surcharge > 0 ? `+EUR ${selectedFinishOption.surcharge}` : "Included"}</span>
            </div>
          )}
          {topperMessage.trim() && (
            <div className="flex justify-between gap-4">
              <span className="flex-shrink-0">Topper (+EUR {product.topperPrice})</span>
              <span className="truncate text-right font-medium">&ldquo;{topperMessage.trim()}&rdquo;</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Quantity</span>
            <span className="font-medium">{quantity}</span>
          </div>
          <div className="flex justify-between border-t border-[color:var(--line)] pt-3 font-semibold text-[color:var(--deep-charcoal)]">
            <span>Estimated total</span>
            <span>
              {priceDisplay.hasPrice ? `EUR ${priceDisplay.total.toFixed(2)}` : "Price on enquiry"}
            </span>
          </div>
        </div>

        {/* ── Primary CTA: Proceed to Checkout ── */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            className="cakish-button w-full"
            onClick={() => setDrawerOpen(true)}
          >
            Proceed to Checkout
          </button>

          {/* Secondary: WhatsApp / Email / Copy */}
          <p className="pt-2 text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--muted-copy)]">
            Or enquire directly
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-[color:var(--line)] bg-white px-3 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--muted-copy)] transition hover:border-[#25D366] hover:text-[#25D366]"
              aria-label="Send order via WhatsApp"
            >
              <WhatsAppIcon />
              WhatsApp
            </button>
            <button
              type="button"
              onClick={handleEmail}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-[color:var(--line)] bg-white px-3 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--muted-copy)] transition hover:border-[color:var(--deep-charcoal)] hover:text-[color:var(--deep-charcoal)]"
              aria-label="Send order via email"
            >
              Email
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-[color:var(--line)] bg-white px-3 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--muted-copy)] transition hover:border-[color:var(--deep-charcoal)] hover:text-[color:var(--deep-charcoal)]"
              aria-label="Copy order summary to clipboard"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          {copied && (
            <p className="rounded-sm bg-[color:var(--soft-cream)] px-3 py-2 text-xs leading-5 text-[color:var(--muted-copy)]">
              Paste this into any message app, email, or social DM to send your order.
            </p>
          )}
        </div>

        {/* Collection note */}
        <div className="mt-6 rounded-sm border border-[color:var(--line)] bg-[color:var(--soft-cream)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--soft-gold)]">
            Collection only
          </p>
          <p className="mt-1.5 text-xs leading-5 text-[color:var(--muted-copy)]">
            {siteContent.collectionModel}
          </p>
        </div>
      </aside>
    </div>

    {/* ── Checkout overlay / drawer ── */}
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
              onClick={() => { setDrawerOpen(false); setCheckoutError(null); }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-[color:var(--line)] bg-white text-xl"
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          <div className="mt-8 space-y-4">
            <div className="border border-[color:var(--line)] bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-serif text-xl text-[color:var(--deep-charcoal)]">
                    {product.name}
                  </p>
                  <p className="mt-1 text-xs text-[color:var(--muted-copy)]">
                    {selectedSize.label} &middot; {selectedFillingOption.label}
                    {showFinishOptions && ` · ${selectedFinishOption.label}`}
                    {topperMessage.trim() && ` · Topper`}
                  </p>
                  <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-[color:var(--muted-copy)]">
                    Qty {quantity}
                  </p>
                </div>
                <p className="font-serif text-xl text-[color:var(--deep-charcoal)]">
                  EUR {priceDisplay.total.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="space-y-4 border border-[color:var(--line)] bg-white p-4">
              <label className="block space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-copy)]">
                Full name *
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="mt-1 block w-full border border-[color:var(--line)] bg-[color:var(--ivory)] px-3 py-2.5 text-sm text-[color:var(--body-copy)] outline-none transition focus:border-[color:var(--deep-charcoal)]"
                />
              </label>
              <label className="block space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-copy)]">
                Email address *
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="mt-1 block w-full border border-[color:var(--line)] bg-[color:var(--ivory)] px-3 py-2.5 text-sm text-[color:var(--body-copy)] outline-none transition focus:border-[color:var(--deep-charcoal)]"
                />
              </label>
              <label className="block space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-copy)]">
                Preferred collection date *
                <input
                  type="date"
                  value={collectionDate}
                  onChange={(e) => setCollectionDate(e.target.value)}
                  min={new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0]}
                  required
                  className="mt-1 block w-full border border-[color:var(--line)] bg-[color:var(--ivory)] px-3 py-2.5 text-sm text-[color:var(--body-copy)] outline-none transition focus:border-[color:var(--deep-charcoal)]"
                />
                <span className="mt-1 block text-[0.6rem] font-normal normal-case tracking-normal text-[color:var(--muted-copy)]">
                  Please allow at least 48 hours for preparation
                </span>
              </label>
              <label className="block space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-copy)]">
                Note (optional)
                <textarea
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="Any special requests or dietary notes..."
                  rows={2}
                  maxLength={300}
                  className="mt-1 block w-full resize-none border border-[color:var(--line)] bg-[color:var(--ivory)] px-3 py-2.5 text-sm text-[color:var(--body-copy)] outline-none transition focus:border-[color:var(--deep-charcoal)]"
                />
              </label>
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
              className="cakish-button w-full disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleCheckout}
              disabled={!isCheckoutReady || checkoutLoading}
            >
              {checkoutLoading ? "Redirecting to Stripe…" : `Pay €${priceDisplay.total.toFixed(2)} Securely`}
            </button>
            {!isCheckoutReady && (
              <p className="text-center text-xs text-[color:var(--muted-copy)]">
                Fill in your name, email, and collection date to continue
              </p>
            )}
            {checkoutError && (
              <p className="rounded-sm bg-red-50 px-3 py-2 text-xs text-red-600">
                {checkoutError}
              </p>
            )}
            <p className="text-center text-xs leading-5 text-[color:var(--muted-copy)]">
              Secure payment via Stripe. You&apos;ll receive a confirmation email after payment.
            </p>
          </div>
        </aside>
      </div>
    )}
    </>
  );
}

/* ── Helper components ── */

function StepLabel({ step, label }: { step: number; label: string }) {
  return (
    <span className="font-serif text-2xl text-[color:var(--deep-charcoal)]">
      <span className="mr-2 text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
        Step {step}
      </span>
      {label}
    </span>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
