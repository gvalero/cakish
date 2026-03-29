import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { assetPath } from "@/lib/asset-path";
import { productConfig } from "@/lib/site-data";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="px-6 pb-16 pt-12 md:px-10 md:pb-24 md:pt-20">
          <div className="mx-auto max-w-5xl">

            {/* Mobile: image first */}
            <div className="mb-8 overflow-hidden rounded-sm md:hidden">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={assetPath("/images/hero-pavlova.jpeg")}
                  alt="The Cakish Modern Pavlova on a white cake drum with strawberry floral finish."
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Desktop: side by side */}
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--soft-gold)]">
                    Handcrafted in Dublin
                  </p>
                  <h1 className="font-serif text-5xl leading-[1.0] tracking-[-0.02em] text-[color:var(--deep-charcoal)] md:text-6xl lg:text-7xl">
                    The Cakish<br />Modern Pavlova
                  </h1>
                  <p className="max-w-md text-lg leading-8 text-[color:var(--body-copy)]">
                    A contemporary centrepiece — built on a crisp meringue base, finished with hand-piped cream and seasonal strawberries. Made fresh to order, designed to hold the table.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/order" className="cakish-button">
                    Order Now
                  </Link>
                  <Link href="/story" className="cakish-button-secondary">
                    Our Story
                  </Link>
                </div>

                <div className="border-t border-[color:var(--line)] pt-6">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-copy)]">
                    Available in three sizes
                  </p>
                  <div className="flex gap-6">
                    {Object.entries(productConfig.sizes).map(([size, option]) => (
                      <div key={size}>
                        <p className="font-serif text-2xl text-[color:var(--deep-charcoal)]">{size}</p>
                        <p className="text-xs text-[color:var(--soft-gold)]">from EUR {option.basePrice}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop image */}
              <div className="hidden overflow-hidden rounded-sm lg:block">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={assetPath("/images/hero-pavlova.jpeg")}
                    alt="The Cakish Modern Pavlova on a white cake drum with strawberry floral finish."
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

        {/* ── Two Finishes ── */}
        <section className="px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 max-w-xl space-y-3">
              <h2 className="font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)] md:text-4xl">
                Two ways to finish.
              </h2>
              <p className="text-base leading-7 text-[color:var(--body-copy)]">
                Every Cakish pavlova is available in two distinct presentations. Choose the one that suits your occasion.
              </p>
            </div>

            <div className="grid gap-10 md:grid-cols-2">
              {/* Floral */}
              <div>
                <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-sm">
                  <Image
                    src={assetPath("/images/hero-pavlova.jpeg")}
                    alt="Strawberry Floral Finish — thinly sliced strawberries in a dahlia pattern."
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="font-serif text-2xl text-[color:var(--deep-charcoal)]">
                  Strawberry Floral Finish
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
                  +EUR {productConfig.finishes["strawberry-floral-finish"].surcharge}
                </p>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted-copy)]">
                  Whole strawberries thinly sliced and arranged in a sculpted floral pattern. A signature presentation that turns the pavlova into a centrepiece.
                </p>
              </div>

              {/* Chopped */}
              <div>
                <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-sm">
                  <Image
                    src={assetPath("/images/finish-chopped.jpeg")}
                    alt="Patisserie Sliced Finish — finely chopped strawberries piled generously."
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="font-serif text-2xl text-[color:var(--deep-charcoal)]">
                  Patisserie Sliced Finish
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
                  Included
                </p>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted-copy)]">
                  Precisely sliced seasonal fruit layered in clean geometric lines. A polished, contemporary presentation that is effortless to serve.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="cakish-rule" />

        {/* ── Gallery ── */}
        <section className="px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-10 font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)] md:text-4xl">
              An editorial look.
            </h2>

            {/* Large + two small */}
            <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm md:aspect-auto md:min-h-[520px]">
                <Image
                  src={assetPath("/images/gallery-one.jpeg")}
                  alt="Both Cakish pavlova finishes side by side on white marble."
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid gap-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                  <Image
                    src={assetPath("/images/gallery-two.jpeg")}
                    alt="Close-up of a Cakish pavlova showing the meringue base and layers."
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                  <Image
                    src={assetPath("/images/gallery-four.jpeg")}
                    alt="Cakish pavlova on a beautifully styled table."
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="cakish-rule" />

        {/* ── Closing CTA ── */}
        <section className="px-6 py-20 text-center md:px-10 md:py-28">
          <div className="mx-auto max-w-lg space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--soft-gold)]">
              Made fresh to order
            </p>
            <h2 className="font-serif text-4xl leading-tight text-[color:var(--deep-charcoal)] md:text-5xl">
              Reserve your centrepiece.
            </h2>
            <p className="text-base leading-7 text-[color:var(--body-copy)]">
              We take a limited number of orders each week to ensure every pavlova receives full attention.
            </p>
            <Link href="/order" className="cakish-button inline-flex">
              Start Your Order
            </Link>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
