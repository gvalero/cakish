import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MeetTheMaker } from "@/components/meet-the-maker";
import { Testimonials } from "@/components/testimonials";
import { InstagramGrid } from "@/components/instagram-grid";
import { Reveal } from "@/components/reveal";
import { products, siteContent } from "@/lib/site-data";
import { assetPath } from "@/lib/asset-path";

export default function Home() {
  const featured = products[0]; // strawberry — anchor product
  const supporting = products.slice(1);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* ── Hero — asymmetric editorial ── */}
        <section
          className="relative px-6 pb-20 pt-14 md:px-10 md:pb-28 md:pt-24"
          aria-label="Introduction"
        >
          <div className="mx-auto max-w-6xl">
            {/* Mobile: image first */}
            <div className="mb-10 overflow-hidden lg:hidden">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={assetPath("/images/products/hero-pavlova-new.jpg")}
                  alt="Cakish Strawberry Pavlova — handcrafted meringue topped with fresh strawberries arranged in a floral pattern, made in Wicklow, Ireland."
                  fill
                  className="cakish-kenburns object-cover"
                  priority
                />
              </div>
            </div>

            {/* Desktop: asymmetric grid */}
            <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
              <div className="space-y-10">
                <div className="space-y-6">
                  <p className="cakish-eyebrow-berry">{siteContent.tagline}</p>
                  <h1 className="font-serif text-[2.6rem] leading-[1.02] tracking-[-0.025em] text-[color:var(--deep-charcoal)] md:text-6xl lg:text-[5rem]">
                    Handcrafted pavlova,
                    <br />
                    <em className="font-serif italic text-[color:var(--berry-deep)]">
                      made one at a time.
                    </em>
                  </h1>
                  <p className="max-w-md text-lg leading-8 text-[color:var(--body-copy)]">
                    {siteContent.heroSubtitle}
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link href="/order/" className="cakish-cta-primary">
                    Order Now
                  </Link>
                  <Link href="/story/" className="cakish-cta-secondary">
                    Meet the Maker
                  </Link>
                  <a
                    href="https://www.instagram.com/cakish.ie/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cakish-link hidden md:inline-flex"
                  >
                    See on Instagram
                  </a>
                </div>

                <div className="border-t border-[color:var(--line)] pt-6">
                  <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-copy)]">
                    Four handcrafted varieties
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {products.map((p) => (
                      <Link
                        key={p.id}
                        href={`/order/?product=${p.slug}`}
                        className="border border-[color:var(--line)] bg-[color:var(--ivory)] px-4 py-2 text-xs font-medium text-[color:var(--deep-charcoal)] transition-colors hover:border-[color:var(--berry-deep)] hover:text-[color:var(--berry-deep)]"
                      >
                        {p.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop hero image */}
              <div className="hidden overflow-hidden lg:block">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={assetPath("/images/products/hero-pavlova-new.jpg")}
                    alt="Cakish Strawberry Pavlova — handcrafted meringue topped with fresh strawberries arranged in a floral pattern, made in Wicklow, Ireland."
                    fill
                    className="cakish-kenburns object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pullquote strip ── */}
        <section className="cakish-section-cream cakish-section-tight">
          <div className="mx-auto max-w-4xl px-6 text-center md:px-10">
            <p className="cakish-pullquote">
              &ldquo;A pavlova should feel like a centrepiece, not a dessert.&rdquo;
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.22em] text-[color:var(--muted-copy)]">
              — The Cakish Kitchen
            </p>
          </div>
        </section>

        {/* ── Menu — asymmetric (featured + 3 supporting) ── */}
        <section className="cakish-section-editorial" aria-labelledby="menu-heading">
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <div className="mb-14 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <div className="max-w-xl space-y-4">
                <p className="cakish-eyebrow-berry">Our Menu</p>
                <h2
                  id="menu-heading"
                  className="font-serif text-4xl leading-tight text-[color:var(--deep-charcoal)] md:text-5xl"
                >
                  Choose your pavlova.
                </h2>
                <p className="text-base leading-7 text-[color:var(--body-copy)]">
                  Every Cakish pavlova is built on a crisp meringue base, layered
                  with your choice of Dulce de Leche or Nutella, and finished with
                  hand‑piped cream and fresh seasonal fruit.
                </p>
              </div>
              <Link href="/order/" className="cakish-link self-end">
                Start your order
              </Link>
            </div>

            <Reveal>
              <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
                {/* Featured product (strawberry) */}
                <article className="group">
                  <Link href={`/order/?product=${featured.slug}`} className="block">
                    <div className="relative mb-5 aspect-[4/3] overflow-hidden bg-[color:var(--soft-cream)]">
                      <Image
                        src={assetPath(featured.image)}
                        alt={`${featured.name} — ${featured.description.slice(0, 80)}`}
                        fill
                        className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.035]"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                      <span className="absolute left-4 top-4 bg-[color:var(--berry-deep)] px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--ivory)]">
                        Signature
                      </span>
                    </div>
                    <div className="flex items-end justify-between gap-6">
                      <div>
                        <h3 className="font-serif text-3xl text-[color:var(--deep-charcoal)]">
                          {featured.name}
                        </h3>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--berry-deep)]">
                          {featured.tagline}
                        </p>
                        <p className="mt-3 max-w-md text-sm leading-6 text-[color:var(--muted-copy)]">
                          {featured.description}
                        </p>
                      </div>
                      <p className="cakish-numeric whitespace-nowrap text-base font-medium text-[color:var(--deep-charcoal)]">
                        {featured.sizes[0].price > 0
                          ? `From €${Math.min(...featured.sizes.map((s) => s.price))}`
                          : "Coming soon"}
                      </p>
                    </div>
                  </Link>
                </article>

                {/* Supporting products stacked */}
                <div className="grid gap-6">
                  {supporting.map((product) => (
                    <article key={product.id} className="group">
                      <Link
                        href={`/order/?product=${product.slug}`}
                        className="grid grid-cols-[1fr_1.3fr] items-center gap-5"
                      >
                        <div className="relative aspect-square overflow-hidden bg-[color:var(--soft-cream)]">
                          <Image
                            src={assetPath(product.image)}
                            alt={`${product.name} — ${product.description.slice(0, 60)}`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                            sizes="(max-width: 1024px) 50vw, 20vw"
                          />
                        </div>
                        <div>
                          <h3 className="font-serif text-xl text-[color:var(--deep-charcoal)] transition-colors group-hover:text-[color:var(--berry-deep)]">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--soft-gold)]">
                            {product.tagline}
                          </p>
                          <p className="mt-2 cakish-numeric text-xs text-[color:var(--muted-copy)]">
                            {product.sizes[0].price > 0
                              ? `From €${Math.min(...product.sizes.map((s) => s.price))}`
                              : "Coming soon"}
                          </p>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Meet the Maker — compact teaser ── */}
        <section className="cakish-section-cream cakish-section-editorial">
          <MeetTheMaker variant="compact" />
        </section>

        {/* ── How It Works — Stripe-first ── */}
        <section className="cakish-section-editorial" aria-labelledby="how-heading">
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <div className="mb-14 max-w-xl">
              <p className="cakish-eyebrow-berry">How it works</p>
              <h2
                id="how-heading"
                className="mt-3 font-serif text-4xl leading-tight text-[color:var(--deep-charcoal)] md:text-5xl"
              >
                Three steps, one beautiful centrepiece.
              </h2>
            </div>

            <Reveal>
              <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
                {[
                  {
                    step: "01",
                    title: "Design your pavlova",
                    copy: "Pick a variety, size, and filling. Add a hand‑piped topper message if it's for a special occasion. Your total is calculated as you go.",
                  },
                  {
                    step: "02",
                    title: "Secure your order",
                    copy: "Reserve your date with Stripe — card payment is instant and fully secure. You'll get an email confirmation straight away. Prefer WhatsApp? That's still an option.",
                  },
                  {
                    step: "03",
                    title: "Collect in Wicklow",
                    copy: "Freshly made on your chosen day. The exact collection address is shared with your confirmation, along with storage and serving tips.",
                  },
                ].map((item) => (
                  <li key={item.step} className="border-t border-[color:var(--line)] pt-6">
                    <p className="cakish-numeric font-serif text-3xl text-[color:var(--berry-deep)]">
                      {item.step}
                    </p>
                    <h3 className="mt-3 font-serif text-xl text-[color:var(--deep-charcoal)]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--muted-copy)]">
                      {item.copy}
                    </p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="cakish-section-cream cakish-section-editorial">
          <Testimonials />
        </section>

        {/* ── Gallery ── */}
        <section
          className="cakish-section-editorial"
          aria-labelledby="gallery-heading"
        >
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <div className="mb-10 flex items-end justify-between gap-6">
              <h2
                id="gallery-heading"
                className="font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)] md:text-4xl"
              >
                From our kitchen.
              </h2>
              <Link href="/story/" className="cakish-link">
                Inside the bakery
              </Link>
            </div>

            <div className="grid gap-3 md:grid-cols-[1.4fr_1fr]">
              <div className="relative aspect-[3/4] overflow-hidden md:aspect-auto md:min-h-[540px]">
                <Image
                  src={assetPath("/images/products/pavlova-sizes-showcase.jpg")}
                  alt="Three Cakish strawberry pavlovas in different sizes, viewed from above, showing the beautiful strawberry floral arrangement."
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid gap-3">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={assetPath("/images/products/strawberry-pavlova-detail.jpg")}
                    alt="Close-up detail of a Cakish pavlova showing the intricate strawberry floral pattern and layers of cream and meringue."
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={assetPath("/images/products/pavlova-lifestyle.jpg")}
                    alt="A Cakish pavlova being presented, showing the full layered construction with meringue, filling, cream, and strawberries."
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Occasions ── */}
        <section
          className="cakish-section-cream cakish-section-editorial"
          aria-labelledby="occasions-heading"
        >
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <div className="mb-12 max-w-xl space-y-3">
              <p className="cakish-eyebrow-berry">Perfect For</p>
              <h2
                id="occasions-heading"
                className="font-serif text-4xl leading-tight text-[color:var(--deep-charcoal)] md:text-5xl"
              >
                Made for occasions people remember.
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {siteContent.occasions.map((occasion) => (
                <article key={occasion.title} className="group">
                  <div className="relative mb-5 aspect-square overflow-hidden">
                    <Image
                      src={assetPath(occasion.image)}
                      alt={`Cakish pavlova for ${occasion.title.toLowerCase()} — ${occasion.description}`}
                      fill
                      className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
                    />
                  </div>
                  <h3 className="font-serif text-2xl text-[color:var(--deep-charcoal)]">
                    {occasion.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--muted-copy)]">
                    {occasion.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Instagram strip ── */}
        <section className="cakish-section-editorial">
          <InstagramGrid />
        </section>

        {/* ── FAQ ── */}
        <section className="cakish-section-editorial" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-3xl px-6 md:px-10">
            <div className="mb-12 text-center">
              <p className="cakish-eyebrow-berry">Questions & Answers</p>
              <h2
                id="faq-heading"
                className="mt-3 font-serif text-4xl leading-tight text-[color:var(--deep-charcoal)] md:text-5xl"
              >
                Things people ask us.
              </h2>
            </div>

            <div className="divide-y divide-[color:var(--line)]">
              {siteContent.faq.map((item, i) => (
                <details key={i} className="group py-6">
                  <summary className="flex cursor-pointer items-center justify-between text-left">
                    <h3 className="pr-4 font-serif text-lg text-[color:var(--deep-charcoal)]">
                      {item.question}
                    </h3>
                    <span className="flex-shrink-0 text-2xl leading-none text-[color:var(--berry-deep)] transition-transform duration-300 group-open:rotate-45">
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

        {/* ── Closing CTA — reversed charcoal ── */}
        <section className="cakish-section-dark cakish-section-editorial">
          <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
            <p className="cakish-eyebrow text-[color:var(--soft-gold)]">
              Made fresh to order
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
              Reserve your
              <br />
              <em className="font-serif italic text-[color:var(--soft-gold)]">
                centrepiece.
              </em>
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-base leading-8 text-[color:var(--ivory)]/80">
              A limited number of orders each week, so every pavlova gets full
              attention. Order now and collect in Wicklow.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/order/" className="cakish-cta-primary">
                Start Your Order
              </Link>
              <Link href="/story/" className="cakish-cta-secondary-inverse">
                Read Our Story
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
