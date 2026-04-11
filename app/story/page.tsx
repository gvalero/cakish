import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteContent } from "@/lib/site-data";
import { assetPath } from "@/lib/asset-path";

export const metadata: Metadata = {
  title: "Our Story — Handcrafted Pavlova from Wicklow | Cakish",
  description:
    "Learn about Cakish — a premium home bakery in Wicklow, Ireland, handcrafting modern pavlova desserts for birthdays, communions, and celebrations. Made fresh to order with the finest ingredients.",
  alternates: {
    canonical: "/story/",
  },
  openGraph: {
    title: "Our Story | Cakish — Handcrafted Pavlova from Wicklow",
    description:
      "A premium home bakery in Wicklow, Ireland. Handcrafting modern pavlova for birthdays, communions, and celebrations.",
    url: "/story/",
  },
};

export default function StoryPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="px-6 pb-16 pt-12 md:px-10 md:pb-24 md:pt-20" aria-label="Our story introduction">
          <div className="mx-auto max-w-6xl">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-xs text-[color:var(--muted-copy)]">
                <li><Link href="/" className="hover:text-[color:var(--deep-charcoal)]">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-[color:var(--deep-charcoal)]">Our Story</li>
              </ol>
            </nav>

            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--soft-gold)]">
                  Our Story
                </p>
                <h1 className="font-serif text-4xl leading-tight text-[color:var(--deep-charcoal)] md:text-5xl lg:text-6xl">
                  A modern take on a timeless dessert.
                </h1>
                <p className="max-w-md text-base leading-7 text-[color:var(--body-copy)]">
                  Cakish is a premium home bakery based in Wicklow, Ireland. We handcraft modern pavlova desserts — built on a crisp meringue base, layered with Dulce de Leche or Nutella, finished with hand-piped cream and fresh seasonal fruit. Every pavlova is made fresh to order for birthdays, communions, and meaningful celebrations.
                </p>
                <p className="max-w-md text-base leading-7 text-[color:var(--body-copy)]">
                  What began as a passion for creating beautiful centrepieces for family gatherings has grown into a small, dedicated bakery. We take a limited number of orders each week to ensure every pavlova receives the attention it deserves.
                </p>
              </div>
              <div className="overflow-hidden rounded-sm">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={assetPath("/images/products/strawberry-pavlova-gallery-1.jpg")}
                    alt="A Cakish strawberry pavlova — handcrafted meringue with fresh strawberries, made in Wicklow, Ireland."
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="cakish-rule" />

        {/* ── Pillars ── */}
        <section className="px-6 py-16 md:px-10 md:py-24" aria-labelledby="pillars-heading">
          <div className="mx-auto max-w-6xl">
            <h2 id="pillars-heading" className="sr-only">What makes Cakish different</h2>
            <div className="grid gap-12 md:grid-cols-3">
              {siteContent.storyPillars.map((pillar) => (
                <article key={pillar.title}>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--soft-gold)]">
                    {pillar.title}
                  </p>
                  <h3 className="mt-3 font-serif text-2xl leading-tight text-[color:var(--deep-charcoal)]">
                    {pillar.heading}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--body-copy)]">
                    {pillar.copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <hr className="cakish-rule" />

        {/* ── Our Process ── */}
        <section className="px-6 py-16 md:px-10 md:py-24" aria-labelledby="process-heading">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-xl space-y-3">
              <h2 id="process-heading" className="font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)] md:text-4xl">
                How we make your pavlova.
              </h2>
              <p className="text-base leading-7 text-[color:var(--body-copy)]">
                Every Cakish pavlova is handcrafted with care, from the meringue base to the final fruit arrangement.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { step: "01", title: "The Meringue", description: "We bake a crisp meringue shell with a soft, marshmallow-like centre — the foundation of every Cakish pavlova." },
                { step: "02", title: "The Filling", description: "Your choice of Dulce de Leche or Nutella is spread generously over the meringue, creating a rich, indulgent layer." },
                { step: "03", title: "The Cream", description: "Freshly whipped cream is hand-piped in elegant patterns around the filling, adding lightness and texture." },
                { step: "04", title: "The Fruit", description: "Fresh seasonal fruit is carefully arranged on top — from our signature strawberry floral pattern to mixed berries and raspberries." },
              ].map((item) => (
                <div key={item.step}>
                  <p className="font-serif text-3xl text-[color:var(--soft-gold)]">{item.step}</p>
                  <h3 className="mt-2 font-serif text-xl text-[color:var(--deep-charcoal)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted-copy)]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="cakish-rule" />

        {/* ── Collection ── */}
        <section className="px-6 py-16 md:px-10 md:py-24" aria-labelledby="story-collection-heading">
          <div className="mx-auto max-w-6xl">
            <h2 id="story-collection-heading" className="mb-10 font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)] md:text-4xl">
              Collection from Wicklow
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {siteContent.collectionHighlights.map((item) => (
                <article key={item.title} className="border border-[color:var(--line)] bg-white p-6">
                  <h3 className="font-serif text-lg text-[color:var(--deep-charcoal)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted-copy)]">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <hr className="cakish-rule" />

        {/* ── CTA ── */}
        <section className="px-6 py-20 text-center md:px-10 md:py-28">
          <div className="mx-auto max-w-lg space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--soft-gold)]">
              Ready to order?
            </p>
            <h2 className="font-serif text-4xl leading-tight text-[color:var(--deep-charcoal)] md:text-5xl">
              Reserve your centrepiece.
            </h2>
            <p className="text-base leading-7 text-[color:var(--body-copy)]">
              Choose from four handcrafted pavlova varieties — Strawberry, Heart, Mixed Berries, or Raspberry. Collection from Wicklow.
            </p>
            <Link href="/order/" className="cakish-button inline-flex">
              Start Your Order
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
