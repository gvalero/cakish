import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { assetPath } from "@/lib/asset-path";
import { productConfig, siteContent } from "@/lib/site-data";

const madeForMoments = [
  "Birthday tables that deserve something unforgettable.",
  "First communions and intimate family celebrations.",
  "Elegant hosting, garden lunches, and meaningful gatherings.",
  "Thoughtful gifting when flowers alone are not enough.",
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-[color:var(--line)] px-6 pb-18 pt-10 md:px-10 md:pb-24 md:pt-16">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="space-y-8">
              <span className="inline-flex rounded-full border border-[color:var(--line)] bg-white/70 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[color:var(--soft-gold)]">
                Cakish · Quietly Luxurious Celebrations
              </span>
              <div className="space-y-6">
                <h1 className="max-w-4xl font-serif text-5xl leading-[0.92] tracking-[-0.03em] text-[color:var(--deep-charcoal)] md:text-7xl">
                  The Cakish Modern Pavlova
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[color:var(--body-copy)] md:text-xl">
                  A refined modern take on pavlova, created for meaningful
                  celebrations. Light, sculptural, and designed to arrive at the
                  table like the centrepiece it is.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {Object.entries(productConfig.sizes).map(([size, option]) => (
                  <div
                    key={size}
                    className="rounded-[2rem] border border-[color:var(--line)] bg-white/70 px-5 py-5 shadow-[0_18px_50px_rgba(53,45,34,0.06)]"
                  >
                    <p className="font-serif text-3xl text-[color:var(--deep-charcoal)]">
                      {size}
                    </p>
                    <p className="mt-1 text-sm uppercase tracking-[0.22em] text-[color:var(--soft-gold)]">
                      from EUR {option.basePrice}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[color:var(--muted-copy)]">
                      {option.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/order" className="cakish-button">
                  Reserve Your Order
                </Link>
                <Link href="/story" className="cakish-button-secondary">
                  Discover The Story
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-x-[12%] -top-5 h-20 rounded-full bg-[radial-gradient(circle,_rgba(216,167,167,0.24),_transparent_70%)] blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-[color:var(--line)] bg-white/70 p-4 shadow-[0_30px_80px_rgba(53,45,34,0.12)]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
                  <Image
                    src={assetPath("/images/hero-pavlova.jpeg")}
                    alt="The Cakish Modern Pavlova decorated with fresh fruit and flowers."
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="pointer-events-none absolute bottom-10 left-8 rounded-full border border-white/50 bg-[rgba(248,246,242,0.86)] px-5 py-3 shadow-[0_16px_30px_rgba(53,45,34,0.08)] backdrop-blur">
                  <p className="font-serif text-2xl text-[color:var(--deep-charcoal)]">
                    Signature Floral Finish
                  </p>
                  <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
                    Premium presentation +EUR {productConfig.finishes["strawberry-floral-finish"].surcharge}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--line)] px-6 py-16 md:px-10 md:py-22">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <span className="section-label">Made For</span>
              <h2 className="font-serif text-4xl leading-tight text-[color:var(--deep-charcoal)] md:text-5xl">
                Celebrations with a little more presence.
              </h2>
              <p className="max-w-xl text-lg leading-8 text-[color:var(--body-copy)]">
                Cakish is designed for the kind of occasions people remember in
                detail: the table, the flowers, the room, the way dessert made
                everyone pause for a moment.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {madeForMoments.map((moment) => (
                <article
                  key={moment}
                  className="rounded-[2rem] border border-[color:var(--line)] bg-white/75 p-6 shadow-[0_18px_45px_rgba(53,45,34,0.05)]"
                >
                  <p className="font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)]">
                    {moment.split(" ")[0]}
                  </p>
                  <p className="mt-3 text-base leading-7 text-[color:var(--muted-copy)]">
                    {moment}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--line)] px-6 py-16 md:px-10 md:py-22">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="section-label">Gallery</span>
                <h2 className="font-serif text-4xl leading-tight text-[color:var(--deep-charcoal)] md:text-5xl">
                  An editorial look at the collection.
                </h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-[color:var(--body-copy)]">
                Every pavlova is styled to feel sculptural, celebratory, and
                beautifully modern from first glance to first slice.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[34rem] overflow-hidden rounded-[2.5rem] border border-[color:var(--line)] bg-white/70 p-4 shadow-[0_24px_60px_rgba(53,45,34,0.08)]">
                <div className="relative h-full min-h-[30rem] overflow-hidden rounded-[2rem]">
                  <Image
                    src={assetPath("/images/gallery-one.jpeg")}
                    alt="Close-up of a decorated modern pavlova."
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-1">
                {[
                  {
                    src: "/images/gallery-two.jpeg",
                    alt: "Cakish pavlova with floral decoration.",
                  },
                  {
                    src: "/images/gallery-three.jpeg",
                    alt: "Modern pavlova on a soft neutral backdrop.",
                  },
                  {
                    src: "/images/gallery-four.jpeg",
                    alt: "Pavlova presentation detail for a celebration table.",
                  },
                ].map((image) => (
                  <div
                    key={image.src}
                    className="relative min-h-[14rem] overflow-hidden rounded-[2rem] border border-[color:var(--line)] bg-white/70 p-3 shadow-[0_18px_45px_rgba(53,45,34,0.06)]"
                  >
                    <div className="relative h-full min-h-[12rem] overflow-hidden rounded-[1.5rem]">
                      <Image
                        src={assetPath(image.src)}
                        alt={image.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:px-10 md:py-22">
          <div className="mx-auto grid max-w-7xl gap-8 rounded-[2.75rem] border border-[color:var(--line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.86),rgba(243,239,233,0.92))] p-8 shadow-[0_24px_70px_rgba(53,45,34,0.08)] md:grid-cols-[1fr_0.9fr] md:p-12">
            <div className="space-y-5">
              <span className="section-label">Collection</span>
              <h2 className="font-serif text-4xl leading-tight text-[color:var(--deep-charcoal)] md:text-5xl">
                A beautifully simple ordering rhythm.
              </h2>
              <p className="max-w-xl text-lg leading-8 text-[color:var(--body-copy)]">
                Select your size, choose your finish, and reserve your date.
                Payments will be connected directly in a future release, but the
                full path is already designed into the experience.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/order" className="cakish-button">
                  Start Your Order
                </Link>
                <Link href="/story" className="cakish-button-secondary">
                  Collection Details
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {siteContent.collectionHighlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.75rem] border border-[color:var(--line)] bg-white/80 p-5"
                >
                  <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
                    {item.title}
                  </p>
                  <p className="mt-2 text-base leading-7 text-[color:var(--body-copy)]">
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
