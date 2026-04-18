import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MeetTheMaker } from "@/components/meet-the-maker";
import { Testimonials } from "@/components/testimonials";
import { Reveal } from "@/components/reveal";
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

// Pair each pillar with a process image for alternating editorial layout
const pillarImages = [
  "/images/story-meringue-piping.jpg",
  "/images/story-layering.jpg",
  "/images/story-finishing-touch.jpg",
];

export default function StoryPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* ── Full-width hero ── */}
        <section className="relative" aria-label="Our story introduction">
          <div className="relative h-[55vh] min-h-[420px]">
            <Image
              src={assetPath("/images/products/pavlova-lifestyle.jpg")}
              alt="A Cakish pavlova on a styled table — hand-piped cream and fresh strawberries."
              fill
              className="cakish-kenburns object-cover"
              priority
              sizes="100vw"
            />
            <div className="cakish-hero-band-overlay" />
            <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-12 md:px-10 md:pb-16">
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-[color:var(--muted-copy)]">
                  <li><Link href="/" className="hover:text-[color:var(--deep-charcoal)]">Home</Link></li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-[color:var(--deep-charcoal)]">Our Story</li>
                </ol>
              </nav>
              <p className="cakish-eyebrow-berry">Our Story</p>
              <h1 className="mt-3 max-w-3xl font-serif text-[2.6rem] leading-[1.05] tracking-[-0.02em] text-[color:var(--deep-charcoal)] md:text-[4.5rem]">
                A modern take on a
                <em className="font-serif italic text-[color:var(--berry-deep)]"> timeless</em> dessert.
              </h1>
            </div>
          </div>
        </section>

        {/* ── Intro ── */}
        <section className="cakish-section-editorial">
          <div className="mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-[0.7fr_1.3fr] md:px-10">
            <div>
              <p className="cakish-pullquote">
                Every pavlova leaves the kitchen with a name on the box.
              </p>
            </div>
            <div className="space-y-5 text-[1.02rem] leading-8 text-[color:var(--body-copy)]">
              <p>
                Cakish is a small home bakery based in Wicklow, Ireland. We handcraft
                modern pavlovas — built on a crisp meringue base, layered with
                Dulce de Leche or Nutella, finished with hand‑piped cream and fresh
                seasonal fruit.
              </p>
              <p>
                What began as a passion for creating beautiful centrepieces for
                family gatherings has grown into a small, dedicated bakery. We take
                a limited number of orders each week to ensure every pavlova
                receives full attention.
              </p>
            </div>
          </div>
        </section>

        {/* ── Paired Pillars — alternating ── */}
        <section className="cakish-section-cream cakish-section-editorial" aria-labelledby="pillars-heading">
          <h2 id="pillars-heading" className="sr-only">What makes Cakish different</h2>
          <div className="mx-auto max-w-6xl space-y-16 px-6 md:space-y-24 md:px-10">
            {siteContent.storyPillars.map((pillar, i) => {
              const reversed = i % 2 === 1;
              return (
                <Reveal key={pillar.title}>
                  <article
                    className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                      reversed ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={assetPath(pillarImages[i])}
                        alt={`Cakish process — ${pillar.heading.toLowerCase()}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                    <div className="space-y-5">
                      <p className="cakish-eyebrow-berry">{pillar.title}</p>
                      <h3 className="font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)] md:text-4xl">
                        {pillar.heading}
                      </h3>
                      <p className="text-[1.02rem] leading-8 text-[color:var(--body-copy)]">
                        {pillar.copy}
                      </p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ── Meet the Maker — long-form ── */}
        <section className="cakish-section-editorial">
          <MeetTheMaker variant="full" />
        </section>

        {/* ── Process (4 steps) ── */}
        <section className="cakish-section-cream cakish-section-editorial" aria-labelledby="process-heading">
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <div className="mb-14 max-w-xl">
              <p className="cakish-eyebrow-berry">The Process</p>
              <h2 id="process-heading" className="mt-3 font-serif text-4xl leading-tight text-[color:var(--deep-charcoal)] md:text-5xl">
                How we make your pavlova.
              </h2>
              <p className="mt-4 text-base leading-7 text-[color:var(--body-copy)]">
                From meringue base to the final fruit arrangement — every step is
                done by hand in our Wicklow kitchen.
              </p>
            </div>

            <Reveal>
              <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { step: "01", title: "The Meringue", description: "Crisp meringue shell with a soft, marshmallow-like centre — the foundation of every pavlova." },
                  { step: "02", title: "The Filling", description: "Your choice of Dulce de Leche or Nutella, spread generously to create a rich, indulgent layer." },
                  { step: "03", title: "The Cream", description: "Freshly whipped cream, hand-piped in elegant patterns around the filling." },
                  { step: "04", title: "The Fruit", description: "Fresh seasonal fruit — our signature strawberry floral, mixed berries, or raspberries." },
                ].map((item) => (
                  <div key={item.step} className="border-t border-[color:var(--line)] pt-5">
                    <p className="cakish-numeric font-serif text-3xl text-[color:var(--berry-deep)]">{item.step}</p>
                    <h3 className="mt-3 font-serif text-xl text-[color:var(--deep-charcoal)]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--muted-copy)]">{item.description}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Single testimonial ── */}
        <section className="cakish-section-editorial">
          <Testimonials variant="single" />
        </section>

        {/* ── Closing CTA — reversed charcoal ── */}
        <section className="cakish-section-dark cakish-section-editorial">
          <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
            <p className="cakish-eyebrow text-[color:var(--soft-gold)]">Ready to order?</p>
            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
              Reserve your
              <em className="font-serif italic text-[color:var(--soft-gold)]"> centrepiece.</em>
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-base leading-8 text-[color:var(--ivory)]/80">
              Four handcrafted varieties, made fresh to order. Collection in Wicklow.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/order/" className="cakish-cta-primary">
                Start Your Order
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
