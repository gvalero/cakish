import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { assetPath } from "@/lib/asset-path";
import { siteContent } from "@/lib/site-data";

export const metadata = {
  title: "Story | Cakish.ie",
  description: "The story behind Cakish and its modern take on pavlova.",
};

export default function StoryPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-4 pb-14 pt-8 md:px-10 md:pb-22 md:pt-16">
        <div className="mx-auto max-w-7xl space-y-10 md:space-y-12">
          <section className="grid gap-8 md:gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="space-y-5">
              <span className="section-label">Story</span>
              <h1 className="font-serif text-4xl leading-[0.95] tracking-[-0.03em] text-[color:var(--deep-charcoal)] md:text-6xl">
                A modern pavlova, interpreted with a softer kind of luxury.
              </h1>
              <p className="max-w-xl text-base leading-7 text-[color:var(--body-copy)] md:text-lg md:leading-8">
                Cakish does not aim to recreate tradition exactly. Instead, it
                offers a refined, contemporary interpretation: lighter in mood,
                more sculptural in presentation, and styled for the kinds of
                celebrations that feel intimate and memorable.
              </p>
            </div>

            <div className="relative min-h-[22rem] overflow-hidden rounded-[2rem] border border-[color:var(--line)] bg-white/70 p-3 shadow-[0_24px_60px_rgba(53,45,34,0.08)] md:min-h-[30rem] md:rounded-[2.5rem] md:p-4">
              <div className="relative h-full min-h-[18rem] overflow-hidden rounded-[1.6rem] md:min-h-[27rem] md:rounded-[2rem]">
                <Image
                  src={assetPath("/images/gallery-four.jpeg")}
                  alt="Cakish modern pavlova styled on a beautiful table with white roses and warm lighting."
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:gap-5 md:grid-cols-3">
            {siteContent.storyPillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-[1.7rem] border border-[color:var(--line)] bg-white/75 p-5 shadow-[0_18px_45px_rgba(53,45,34,0.05)] md:rounded-[2rem] md:p-7"
              >
                <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
                  {pillar.title}
                </p>
                <p className="mt-3 font-serif text-2xl leading-tight text-[color:var(--deep-charcoal)] md:text-3xl">
                  {pillar.heading}
                </p>
                <p className="mt-4 text-sm leading-6 text-[color:var(--body-copy)] md:text-base md:leading-7">
                  {pillar.copy}
                </p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 rounded-[2rem] border border-[color:var(--line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(243,239,233,0.95))] p-6 shadow-[0_24px_70px_rgba(53,45,34,0.07)] md:grid-cols-2 md:rounded-[2.5rem] md:p-12">
            <div>
              <span className="section-label">How Collection Works</span>
              <h2 className="font-serif text-3xl text-[color:var(--deep-charcoal)] md:text-4xl">
                Collection-first, with care built in.
              </h2>
            </div>
            <div className="space-y-5">
              <p className="text-base leading-7 text-[color:var(--body-copy)]">
                {siteContent.collectionModel}
              </p>
              <div className="grid gap-4">
                {siteContent.collectionHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[1.4rem] border border-[color:var(--line)] bg-white/80 p-4 md:rounded-[1.6rem] md:p-5"
                  >
                    <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--muted-copy)]">
                      {item.copy}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Story CTA — Start Your Order */}
          <section className="rounded-[2rem] border border-[color:var(--line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(243,239,233,0.95))] p-8 text-center shadow-[0_24px_70px_rgba(53,45,34,0.07)] md:rounded-[2.5rem] md:p-14">
            <div className="mx-auto max-w-2xl space-y-5">
              <div className="mx-auto h-px w-12 bg-[color:var(--soft-gold)]" />
              <h2 className="font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)] md:text-5xl">
                Ready to place your order?
              </h2>
              <p className="text-base leading-7 text-[color:var(--body-copy)] md:text-lg md:leading-8">
                Each pavlova is made fresh to order. Select your size, choose your finish, and reserve your date.
              </p>
              <div className="flex flex-col items-center gap-4 pt-2 sm:flex-row sm:justify-center">
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
