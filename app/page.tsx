import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { assetPath } from "@/lib/asset-path";
import { productConfig, siteContent } from "@/lib/site-data";

const madeForMoments = [
  {
    heading: "Birthday",
    copy: "Birthday tables that deserve something unforgettable.",
    image: "/images/occasion-birthday.jpeg",
    alt: "Cakish pavlova styled as a birthday centrepiece with candles and rose petals.",
  },
  {
    heading: "Communion",
    copy: "First communions and intimate family celebrations.",
    image: "/images/occasion-communion.jpeg",
    alt: "Cakish pavlova styled for a First Communion with white roses and a cross.",
  },
  {
    heading: "Hosting",
    copy: "Elegant hosting, garden lunches, and meaningful gatherings.",
    image: "/images/occasion-hosting.jpeg",
    alt: "Cakish pavlova as a dinner party centrepiece on a beautifully set table.",
  },
  {
    heading: "Gifting",
    copy: "Thoughtful gifting when flowers alone are not enough.",
    image: "/images/occasion-birthday.jpeg",
    alt: "Cakish pavlova presented as a premium gift.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">

        {/* Hero Section */}
        <section className="border-b border-[color:var(--line)] px-4 pb-14 pt-8 md:px-10 md:pb-24 md:pt-16">
          <div className="mx-auto grid max-w-7xl gap-8 md:gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="space-y-6 md:space-y-8">
              <span className="inline-flex max-w-full rounded-full border border-[color:var(--line)] bg-white/70 px-4 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--soft-gold)] md:text-[0.7rem] md:tracking-[0.32em]">
                Cakish · Quietly Luxurious Celebrations
              </span>
              <div className="space-y-4 md:space-y-6">
                <h1 className="max-w-4xl font-serif text-4xl leading-[0.95] tracking-[-0.03em] text-[color:var(--deep-charcoal)] sm:text-5xl md:text-7xl">
                  The Cakish Modern Pavlova
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[color:var(--body-copy)] md:text-xl md:leading-8">
                  Not a traditional pavlova. A contemporary reinterpretation — built on a crisp meringue base, finished with hand-piped cream and seasonal fruit arranged with editorial precision. Every pavlova is made fresh to order, designed to hold the table.
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

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
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
              <div className="relative overflow-hidden rounded-[2rem] border border-[color:var(--line)] bg-white/70 p-3 shadow-[0_30px_80px_rgba(53,45,34,0.12)] md:rounded-[2.5rem] md:p-4">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
                  <Image
                    src={assetPath("/images/hero-pavlova.jpeg")}
                    alt="The Cakish Modern Pavlova with floral strawberry finish on white marble."
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="relative mt-4 rounded-[1.6rem] border border-white/50 bg-[rgba(248,246,242,0.9)] px-4 py-3 shadow-[0_16px_30px_rgba(53,45,34,0.08)] backdrop-blur md:pointer-events-none md:absolute md:bottom-10 md:left-8 md:mt-0 md:rounded-full md:px-5">
                  <p className="font-serif text-xl text-[color:var(--deep-charcoal)] md:text-2xl">
                    Signature Floral Finish
                  </p>
                  <p className="text-[0.72rem] uppercase tracking-[0.14em] text-[color:var(--soft-gold)] md:text-sm md:tracking-[0.2em]">
                    Premium presentation +EUR {productConfig.finishes["strawberry-floral-finish"].surcharge}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Two Finishes Section */}
        <section className="border-b border-[color:var(--line)] px-4 py-14 md:px-10 md:py-22">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 space-y-3 md:mb-10">
              <span className="section-label">Two Finishes</span>
              <h2 className="font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)] md:text-5xl">
                Choose your presentation.
              </h2>
              <p className="max-w-xl text-base leading-7 text-[color:var(--body-copy)] md:text-lg md:leading-8">
                Every Cakish pavlova is available in two distinct finishes, each with its own character and occasion.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Floral Finish */}
              <div className="overflow-hidden rounded-[2rem] border border-[color:var(--line)] bg-white/70 shadow-[0_24px_60px_rgba(53,45,34,0.08)] md:rounded-[2.5rem]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={assetPath("/images/hero-pavlova.jpeg")}
                    alt="Strawberry Floral Finish — thinly sliced strawberries arranged in a dahlia pattern."
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5 md:p-7">
                  <p className="font-serif text-2xl text-[color:var(--deep-charcoal)] md:text-3xl">
                    Strawberry Floral Finish
                  </p>
                  <p className="mt-1 text-sm uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
                    +EUR {productConfig.finishes["strawberry-floral-finish"].surcharge}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--muted-copy)] md:text-base md:leading-7">
                    Whole strawberries thinly sliced and arranged in a sculpted floral pattern — a signature presentation that turns the pavlova into a centrepiece.
                  </p>
                </div>
              </div>
              {/* Chopped / Patisserie Finish */}
              <div className="overflow-hidden rounded-[2rem] border border-[color:var(--line)] bg-white/70 shadow-[0_24px_60px_rgba(53,45,34,0.08)] md:rounded-[2.5rem]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={assetPath("/images/finish-chopped.jpeg")}
                    alt="Patisserie Sliced Finish — finely chopped strawberries piled generously."
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5 md:p-7">
                  <p className="font-serif text-2xl text-[color:var(--deep-charcoal)] md:text-3xl">
                    Patisserie Sliced Finish
                  </p>
                  <p className="mt-1 text-sm uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
                    Included
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--muted-copy)] md:text-base md:leading-7">
                    Precisely chopped seasonal strawberries layered generously — a polished, contemporary presentation that is effortless to serve.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Made For Section */}
        <section className="border-b border-[color:var(--line)] px-4 py-14 md:px-10 md:py-22">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] md:mb-10">
              <div className="space-y-4">
                <span className="section-label">Made For</span>
                <h2 className="font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)] md:text-5xl">
                  Celebrations with a little more presence.
                </h2>
                <p className="max-w-xl text-base leading-7 text-[color:var(--body-copy)] md:text-lg md:leading-8">
                  Cakish is designed for the kind of occasions people remember in
                  detail: the table, the flowers, the room, the way dessert made
                  everyone pause for a moment.
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {madeForMoments.map((moment) => (
                <article
                  key={moment.heading}
                  className="overflow-hidden rounded-[1.7rem] border border-[color:var(--line)] bg-white/75 shadow-[0_18px_45px_rgba(53,45,34,0.05)] md:rounded-[2rem]"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={assetPath(moment.image)}
                      alt={moment.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5 md:p-6">
                    <p className="font-serif text-2xl leading-tight text-[color:var(--deep-charcoal)] md:text-3xl">
                      {moment.heading}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[color:var(--muted-copy)] md:text-base md:leading-7">
                      {moment.copy}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="border-b border-[color:var(--line)] px-4 py-14 md:px-10 md:py-22">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="section-label">Gallery</span>
                <h2 className="font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)] md:text-5xl">
                  An editorial look at the collection.
                </h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-[color:var(--body-copy)]">
                Every pavlova is styled to feel sculptural, celebratory, and
                beautifully modern from first glance to first slice.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:mt-10 md:gap-5 md:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[22rem] overflow-hidden rounded-[2rem] border border-[color:var(--line)] bg-white/70 p-3 shadow-[0_24px_60px_rgba(53,45,34,0.08)] md:min-h-[34rem] md:rounded-[2.5rem] md:p-4">
                <div className="relative h-full min-h-[18rem] overflow-hidden rounded-[1.6rem] md:min-h-[30rem] md:rounded-[2rem]">
                  <Image
                    src={assetPath("/images/gallery-one.jpeg")}
                    alt="Both Cakish pavlova finishes side by side — floral and chopped — overhead on white marble."
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-1">
                {[
                  {
                    src: "/images/gallery-two.jpeg",
                    alt: "Cross-section of a Cakish pavlova showing the meringue base, Nutella layer, cream, and strawberries.",
                  },
                  {
                    src: "/images/gallery-three.jpeg",
                    alt: "Moody close-up of a Cakish pavlova with dramatic lighting.",
                  },
                  {
                    src: "/images/gallery-four.jpeg",
                    alt: "Wide lifestyle shot of a Cakish pavlova on a styled table.",
                  },
                ].map((image) => (
                  <div
                    key={image.src}
                    className="relative min-h-[12rem] overflow-hidden rounded-[1.6rem] border border-[color:var(--line)] bg-white/70 p-3 shadow-[0_18px_45px_rgba(53,45,34,0.06)] md:min-h-[14rem] md:rounded-[2rem]"
                  >
                    <div className="relative h-full min-h-[10rem] overflow-hidden rounded-[1.2rem] md:min-h-[12rem] md:rounded-[1.5rem]">
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

        {/* Collection / CTA Section */}
        <section className="px-4 py-14 md:px-10 md:py-22">
          <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-[color:var(--line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.86),rgba(243,239,233,0.92))] p-6 shadow-[0_24px_70px_rgba(53,45,34,0.08)] md:grid-cols-[1fr_0.9fr] md:rounded-[2.75rem] md:p-12">
            <div className="space-y-5">
              <span className="section-label">Collection</span>
              <h2 className="font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)] md:text-5xl">
                A beautifully simple ordering rhythm.
              </h2>
              <p className="max-w-xl text-base leading-7 text-[color:var(--body-copy)] md:text-lg md:leading-8">
                Select your size, choose your finish, and reserve your date.
                Payments will be connected directly in a future release, but the
                full path is already designed into the experience.
              </p>
              <p className="max-w-xl text-sm leading-6 text-[color:var(--muted-copy)]">
                Each pavlova is made fresh to order. We take a limited number of orders each week to ensure every piece receives full attention.
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
                  className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/80 p-4 md:rounded-[1.75rem] md:p-5"
                >
                  <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--body-copy)] md:text-base md:leading-7">
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
