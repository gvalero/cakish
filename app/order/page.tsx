import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { OrderConfigurator } from "@/components/order-configurator";
import { siteContent } from "@/lib/site-data";
import { assetPath } from "@/lib/asset-path";

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
        {/* ── Editorial hero band ── */}
        <section
          className="relative overflow-hidden"
          aria-label="Order introduction"
        >
          <div className="relative h-[280px] md:h-[380px]">
            <Image
              src={assetPath("/images/products/pavlova-lifestyle.jpg")}
              alt="A handcrafted Cakish pavlova topped with fresh strawberries and cream."
              fill
              className="object-cover"
              priority
            />
            <div className="cakish-hero-band-overlay" />
            <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-10 md:px-10 md:pb-14">
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-[color:var(--muted-copy)]">
                  <li><Link href="/" className="hover:text-[color:var(--deep-charcoal)]">Home</Link></li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-[color:var(--deep-charcoal)]">Order</li>
                </ol>
              </nav>
              <p className="cakish-eyebrow-berry">Build Your Order</p>
              <h1 className="mt-3 max-w-2xl font-serif text-[2.4rem] leading-[1.05] tracking-[-0.02em] text-[color:var(--deep-charcoal)] md:text-6xl">
                Order your
                <em className="font-serif italic text-[color:var(--berry-deep)]"> pavlova</em>.
              </h1>
            </div>
          </div>
        </section>

        <section className="px-6 pt-10 md:px-10 md:pt-14" aria-label="Order intro">
          <div className="mx-auto max-w-3xl">
            <p className="text-base leading-8 text-[color:var(--body-copy)]">
              Choose your variety, size, filling, and optional hand-piped topper.
              Reserve your date instantly with Stripe — or send us an enquiry on
              WhatsApp if you&rsquo;d rather chat first. We&rsquo;ll confirm your
              collection date straight away.
            </p>
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
          className="cakish-section-cream cakish-section-editorial"
          aria-labelledby="collection-heading"
        >
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <div className="mb-10 max-w-xl">
              <p className="cakish-eyebrow-berry">Collection</p>
              <h2
                id="collection-heading"
                className="mt-3 font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)] md:text-4xl"
              >
                How collection works.
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {siteContent.collectionHighlights.map((item) => (
                <article
                  key={item.title}
                  className="border border-[color:var(--line)] bg-[color:var(--ivory)] p-7"
                >
                  <h3 className="font-serif text-lg text-[color:var(--deep-charcoal)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--muted-copy)]">
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
