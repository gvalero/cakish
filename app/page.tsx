import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { products, siteContent } from "@/lib/site-data";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">

        {/* ── Hero ── */}
        <section
          className="px-6 pb-16 pt-12 md:px-10 md:pb-24 md:pt-20"
          aria-label="Introduction"
        >
          <div className="mx-auto max-w-6xl">
            {/* Mobile: image first */}
            <div className="mb-8 overflow-hidden rounded-sm md:hidden">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/images/products/strawberry-pavlova-hero.jpg"
                  alt="Cakish Strawberry Pavlova — handcrafted meringue topped with fresh strawberries arranged in a floral pattern, made in Wicklow, Ireland."
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
                    {siteContent.tagline}
                  </p>
                  <h1 className="font-serif text-5xl leading-[1.05] tracking-[-0.02em] text-[color:var(--deep-charcoal)] md:text-6xl lg:text-7xl">
                    Handcrafted Pavlova<br />for Every Occasion
                  </h1>
                  <p className="max-w-md text-lg leading-8 text-[color:var(--body-copy)]">
                    {siteContent.heroSubtitle}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/order/" className="cakish-button">
                    Order Now
                  </Link>
                  <Link href="/story/" className="cakish-button-secondary">
                    Our Story
                  </Link>
                </div>

                <div className="border-t border-[color:var(--line)] pt-6">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-copy)]">
                    Four handcrafted varieties
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {products.map((p) => (
                      <span
                        key={p.id}
                        className="rounded-full border border-[color:var(--line)] bg-white px-4 py-2 text-xs font-medium text-[color:var(--deep-charcoal)]"
                      >
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop hero image */}
              <div className="hidden overflow-hidden rounded-sm lg:block">
                <div className="relative aspect-[4/5]">
                  <Image
                    src="/images/products/strawberry-pavlova-hero.jpg"
                    alt="Cakish Strawberry Pavlova — handcrafted meringue topped with fresh strawberries arranged in a floral pattern, made in Wicklow, Ireland."
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

        {/* ── Product Grid ── */}
        <section
          className="px-6 py-16 md:px-10 md:py-24"
          aria-labelledby="menu-heading"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--soft-gold)]">
                Our Menu
              </p>
              <h2
                id="menu-heading"
                className="font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)] md:text-4xl"
              >
                Choose your pavlova.
              </h2>
              <p className="text-base leading-7 text-[color:var(--body-copy)]">
                Every Cakish pavlova is built on a crisp meringue base, layered with your choice of Dulce de Leche or Nutella, and finished with hand-piped cream and fresh seasonal fruit. Select the one that suits your occasion.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <article key={product.id} className="group">
                  <Link href={`/order/?product=${product.slug}`} className="block">
                    <div className="relative mb-4 aspect-square overflow-hidden rounded-sm bg-[color:var(--soft-cream)]">
                      <Image
                        src={product.image}
                        alt={`${product.name} — ${product.description.slice(0, 80)}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-serif text-xl text-[color:var(--deep-charcoal)]">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--soft-gold)]">
                      {product.tagline}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--muted-copy)]">
                      {product.sizes.length > 1
                        ? `${product.sizes.length} sizes · Serves ${product.sizes[0].serves} to ${product.sizes[product.sizes.length - 1].serves}`
                        : `${product.sizes[0].diameter} · Serves ${product.sizes[0].serves}`}
                    </p>
                    <p className="mt-2 text-xs font-medium text-[color:var(--deep-charcoal)]">
                      {product.sizes[0].price > 0
                        ? `From EUR ${Math.min(...product.sizes.map((s) => s.price))}`
                        : "Price coming soon"}
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <hr className="cakish-rule" />

        {/* ── How It Works ── */}
        <section
          className="px-6 py-16 md:px-10 md:py-24"
          aria-labelledby="how-heading"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2
                id="how-heading"
                className="font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)] md:text-4xl"
              >
                How ordering works
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-[color:var(--body-copy)]">
                Three simple steps to reserve your handcrafted pavlova.
              </p>
            </div>

            <div className="grid gap-10 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Choose your pavlova",
                  copy: "Pick from our four varieties, select your size, filling (Dulce de Leche or Nutella), and add a custom topper message if you like.",
                },
                {
                  step: "02",
                  title: "Send your enquiry",
                  copy: "Copy your order summary and send it to us via email or WhatsApp. We will confirm availability and your collection date.",
                },
                {
                  step: "03",
                  title: "Collect from Wicklow",
                  copy: "Pick up your freshly made pavlova from our home location in Wicklow. The exact address is shared after confirmation.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center md:text-left">
                  <p className="font-serif text-4xl text-[color:var(--soft-gold)]">
                    {item.step}
                  </p>
                  <h3 className="mt-3 font-serif text-xl text-[color:var(--deep-charcoal)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted-copy)]">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="cakish-rule" />

        {/* ── Gallery ── */}
        <section
          className="px-6 py-16 md:px-10 md:py-24"
          aria-labelledby="gallery-heading"
        >
          <div className="mx-auto max-w-6xl">
            <h2
              id="gallery-heading"
              className="mb-10 font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)] md:text-4xl"
            >
              From our kitchen.
            </h2>

            <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm md:aspect-auto md:min-h-[520px]">
                <Image
                  src="/images/products/pavlova-sizes-showcase.jpg"
                  alt="Three Cakish strawberry pavlovas in different sizes, viewed from above, showing the beautiful strawberry floral arrangement."
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid gap-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                  <Image
                    src="/images/products/strawberry-pavlova-detail.jpg"
                    alt="Close-up detail of a Cakish pavlova showing the intricate strawberry floral pattern and layers of cream and meringue."
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                  <Image
                    src="/images/products/pavlova-lifestyle.jpg"
                    alt="A Cakish pavlova being presented, showing the full layered construction with meringue, filling, cream, and strawberries."
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="cakish-rule" />

        {/* ── Occasions ── */}
        <section
          className="px-6 py-16 md:px-10 md:py-24"
          aria-labelledby="occasions-heading"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--soft-gold)]">
                Perfect For
              </p>
              <h2
                id="occasions-heading"
                className="font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)] md:text-4xl"
              >
                Made for occasions people remember.
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {siteContent.occasions.map((occasion) => (
                <article key={occasion.title}>
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-sm">
                    <Image
                      src={occasion.image}
                      alt={`Cakish pavlova for ${occasion.title.toLowerCase()} — ${occasion.description}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-serif text-xl text-[color:var(--deep-charcoal)]">
                    {occasion.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted-copy)]">
                    {occasion.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <hr className="cakish-rule" />

        {/* ── FAQ ── */}
        <section
          className="px-6 py-16 md:px-10 md:py-24"
          aria-labelledby="faq-heading"
        >
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--soft-gold)]">
                Questions & Answers
              </p>
              <h2
                id="faq-heading"
                className="mt-3 font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)] md:text-4xl"
              >
                Frequently asked questions
              </h2>
            </div>

            <div className="space-y-0 divide-y divide-[color:var(--line)]">
              {siteContent.faq.map((item, i) => (
                <details key={i} className="group py-6">
                  <summary className="flex cursor-pointer items-center justify-between text-left">
                    <h3 className="pr-4 font-serif text-lg text-[color:var(--deep-charcoal)]">
                      {item.question}
                    </h3>
                    <span className="flex-shrink-0 text-xl text-[color:var(--soft-gold)] transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--body-copy)]">
                    {item.answer}
                  </p>
                </details>
              ))}
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
              We take a limited number of orders each week to ensure every pavlova receives full attention. Order now and collect from Wicklow.
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
