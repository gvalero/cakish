import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { assetPath } from "@/lib/asset-path";
import { siteContent } from "@/lib/site-data";

export const metadata = {
  title: "Our Story",
  description: "The story behind Cakish — a modern, refined pavlova handcrafted in Wicklow, Ireland. Made for birthdays, communions, and meaningful celebrations.",
  alternates: { canonical: "/story" },
};

export default function StoryPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-6 pb-20 pt-12 md:px-10 md:pb-28 md:pt-16">
        <div className="mx-auto max-w-5xl space-y-16 md:space-y-20">

          {/* ── Hero section ── */}
          <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--soft-gold)]">
                Our Story
              </p>
              <h1 className="font-serif text-4xl leading-tight text-[color:var(--deep-charcoal)] md:text-5xl">
                A modern pavlova, interpreted with a softer kind of luxury.
              </h1>
              <p className="text-base leading-7 text-[color:var(--body-copy)]">
                Cakish does not aim to recreate tradition exactly. Instead, it
                offers a refined, contemporary interpretation: lighter in mood,
                more sculptural in presentation, and styled for the kinds of
                celebrations that feel intimate and memorable.
              </p>
            </div>

            {/* Image — mobile: full-width above text (order-first in DOM), desktop: right column */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm lg:aspect-[3/4]">
              <Image
                src={assetPath("/images/gallery-four.jpeg")}
                alt="Cakish modern pavlova styled on a beautiful table with white roses and warm lighting."
                fill
                className="object-cover"
                priority
              />
            </div>
          </section>

          <hr className="cakish-rule" />

          {/* ── Three pillars ── */}
          <section className="grid gap-10 md:grid-cols-3">
            {siteContent.storyPillars.map((pillar) => (
              <article key={pillar.title} className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--soft-gold)]">
                  {pillar.title}
                </p>
                <h2 className="font-serif text-2xl leading-tight text-[color:var(--deep-charcoal)]">
                  {pillar.heading}
                </h2>
                <p className="text-sm leading-6 text-[color:var(--body-copy)]">
                  {pillar.copy}
                </p>
              </article>
            ))}
          </section>

          <hr className="cakish-rule" />

          {/* ── Collection ── */}
          <section className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--soft-gold)]">
                How Collection Works
              </p>
              <h2 className="font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)]">
                Collection-first, with care built in.
              </h2>
              <p className="text-base leading-7 text-[color:var(--body-copy)]">
                {siteContent.collectionModel}
              </p>
            </div>
            <div className="space-y-3">
              {siteContent.collectionHighlights.map((item) => (
                <div
                  key={item.title}
                  className="border border-[color:var(--line)] bg-white p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
                    {item.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-[color:var(--muted-copy)]">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <hr className="cakish-rule" />

          {/* ── CTA ── */}
          <section className="py-8 text-center">
            <div className="mx-auto max-w-lg space-y-5">
              <h2 className="font-serif text-4xl leading-tight text-[color:var(--deep-charcoal)]">
                Ready to place your order?
              </h2>
              <p className="text-base leading-7 text-[color:var(--body-copy)]">
                Each pavlova is made fresh to order. Select your size, choose your finish, and reserve your date.
              </p>
              <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center">
                <Link href="/order" className="cakish-button">
                  Start Your Order
                </Link>
                <Link href="/" className="cakish-button-secondary">
                  Back to Home
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>
      <SiteFooter />
    </>
  );
}
