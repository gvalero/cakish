import Image from "next/image";
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
      <main className="flex-1 px-6 pb-16 pt-10 md:px-10 md:pb-22 md:pt-16">
        <div className="mx-auto max-w-7xl space-y-12">
          <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="space-y-5">
              <span className="section-label">Story</span>
              <h1 className="font-serif text-5xl leading-[0.95] tracking-[-0.03em] text-[color:var(--deep-charcoal)] md:text-6xl">
                A modern pavlova, interpreted with a softer kind of luxury.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-[color:var(--body-copy)]">
                Cakish does not aim to recreate tradition exactly. Instead, it
                offers a refined, contemporary interpretation: lighter in mood,
                more sculptural in presentation, and styled for the kinds of
                celebrations that feel intimate and memorable.
              </p>
            </div>

            <div className="relative min-h-[30rem] overflow-hidden rounded-[2.5rem] border border-[color:var(--line)] bg-white/70 p-4 shadow-[0_24px_60px_rgba(53,45,34,0.08)]">
              <div className="relative h-full min-h-[27rem] overflow-hidden rounded-[2rem]">
                <Image
                  src={assetPath("/images/gallery-two.jpeg")}
                  alt="Cakish modern pavlova displayed on a celebration table."
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-3">
            {siteContent.storyPillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-[2rem] border border-[color:var(--line)] bg-white/75 p-7 shadow-[0_18px_45px_rgba(53,45,34,0.05)]"
              >
                <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
                  {pillar.title}
                </p>
                <p className="mt-3 font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)]">
                  {pillar.heading}
                </p>
                <p className="mt-4 text-base leading-7 text-[color:var(--body-copy)]">
                  {pillar.copy}
                </p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 rounded-[2.5rem] border border-[color:var(--line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(243,239,233,0.95))] p-8 shadow-[0_24px_70px_rgba(53,45,34,0.07)] md:grid-cols-2 md:p-12">
            <div>
              <span className="section-label">How Collection Works</span>
              <h2 className="font-serif text-4xl text-[color:var(--deep-charcoal)]">
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
                    className="rounded-[1.6rem] border border-[color:var(--line)] bg-white/80 p-5"
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
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
