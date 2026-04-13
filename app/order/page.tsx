import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { OrderConfigurator } from "@/components/order-configurator";
import { siteContent } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Order Pavlova Online — Strawberry, Raspberry, Mixed Berries & Heart | Cakish",
  description:
    "Order handcrafted pavlova from Cakish in Wicklow, Ireland. Choose from Strawberry, Heart, Mixed Berries, or Raspberry Pavlova. Dulce de Leche or Nutella filling. Custom topper messages available. Collection from Wicklow.",
  alternates: {
    canonical: "/order/",
  },
  openGraph: {
    title: "Order Pavlova Online | Cakish — Wicklow, Ireland",
    description:
      "Choose from four handcrafted pavlova varieties. Made fresh to order with Dulce de Leche or Nutella filling. Collection from Wicklow.",
    url: "/order/",
  },
};

export default function OrderPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* ── Heading ── */}
        <section className="px-6 pb-6 pt-12 md:px-10 md:pt-20" aria-label="Order introduction">
          <div className="mx-auto max-w-6xl">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-xs text-[color:var(--muted-copy)]">
                <li><Link href="/" className="hover:text-[color:var(--deep-charcoal)]">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-[color:var(--deep-charcoal)]">Order</li>
              </ol>
            </nav>
            <div className="max-w-xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--soft-gold)]">
                Build Your Order
              </p>
              <h1 className="font-serif text-4xl leading-tight text-[color:var(--deep-charcoal)] md:text-5xl">
                Order your pavlova.
              </h1>
              <p className="text-base leading-7 text-[color:var(--body-copy)]">
                Choose your pavlova variety, size, filling, and optional custom topper. Then send us your enquiry — we will confirm availability and arrange collection from Wicklow.
              </p>
            </div>
          </div>
        </section>

        {/* ── Configurator ── */}
        <section className="px-6 pb-16 pt-8 md:px-10 md:pb-24" aria-label="Order configurator">
          <div className="mx-auto max-w-6xl">
            <OrderConfigurator />
          </div>
        </section>

        <hr className="cakish-rule" />

        {/* ── Collection Details ── */}
        <section
          className="px-6 py-16 md:px-10 md:py-24"
          aria-labelledby="collection-heading"
        >
          <div className="mx-auto max-w-6xl">
            <h2
              id="collection-heading"
              className="mb-10 font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)] md:text-4xl"
            >
              Collection details
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {siteContent.collectionHighlights.map((item) => (
                <article
                  key={item.title}
                  className="border border-[color:var(--line)] bg-white p-6"
                >
                  <h3 className="font-serif text-lg text-[color:var(--deep-charcoal)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted-copy)]">
                    {item.copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
