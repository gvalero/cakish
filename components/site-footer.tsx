import Link from "next/link";
import { siteContent } from "@/lib/site-data";
import { InstagramGrid } from "@/components/instagram-grid";

export function SiteFooter() {
  return (
    <footer
      className="border-t border-[color:var(--line)] bg-[color:var(--soft-cream)] pt-16 pb-10"
      aria-label="Site footer"
    >
      {/* Mini Instagram strip */}
      <div className="mb-14">
        <InstagramGrid compact />
      </div>

      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand column */}
          <div className="space-y-4">
            <p className="font-serif text-2xl text-[color:var(--deep-charcoal)]">Cakish</p>
            <p className="cakish-eyebrow">
              Handcrafted Pavlova · Wicklow, Ireland
            </p>
            <p className="max-w-xs text-sm leading-7 text-[color:var(--muted-copy)]">
              {siteContent.footerCopy}
            </p>
            <p className="max-w-xs pt-2 text-[0.7rem] leading-6 text-[color:var(--muted-copy)]/80">
              Made from scratch in a small Wicklow kitchen. Allergens on request.
              Please let us know about dietary needs when you order.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation" className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--deep-charcoal)]">
              Navigate
            </p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  className="inline-flex min-h-[44px] items-center text-sm text-[color:var(--muted-copy)] transition hover:text-[color:var(--deep-charcoal)]"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/order/"
                  className="inline-flex min-h-[44px] items-center text-sm text-[color:var(--muted-copy)] transition hover:text-[color:var(--deep-charcoal)]"
                >
                  Order
                </Link>
              </li>
              <li>
                <Link
                  href="/story/"
                  className="inline-flex min-h-[44px] items-center text-sm text-[color:var(--muted-copy)] transition hover:text-[color:var(--deep-charcoal)]"
                >
                  Our Story
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--deep-charcoal)]">
              Get in Touch
            </p>
            <ul className="space-y-1">
              <li>
                <a
                  href={`mailto:${siteContent.email}`}
                  className="inline-flex min-h-[44px] items-center text-sm text-[color:var(--muted-copy)] transition hover:text-[color:var(--deep-charcoal)]"
                >
                  {siteContent.email}
                </a>
              </li>
              <li>
                <a
                  href={siteContent.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center text-sm text-[color:var(--muted-copy)] transition hover:text-[color:var(--deep-charcoal)]"
                >
                  @cakish.ie
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/353834462295?text=Hi%2C%20I%27d%20like%20to%20order%20a%20Cakish%20pavlova"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center text-sm text-[color:var(--muted-copy)] transition hover:text-[color:var(--deep-charcoal)]"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--deep-charcoal)]">
              Stay in Touch
            </p>
            <p className="text-sm leading-6 text-[color:var(--muted-copy)]">
              Occasional notes about new flavours, limited drops, and when the order
              book opens.
            </p>
            <form
              action="https://formspree.io/f/placeholder"
              method="POST"
              className="flex flex-col gap-2"
              aria-label="Newsletter signup"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                name="email"
                required
                placeholder="you@email.ie"
                className="border border-[color:var(--line)] bg-[color:var(--ivory)] px-3 py-2.5 text-sm text-[color:var(--deep-charcoal)] placeholder:text-[color:var(--muted-copy)]/60 focus:border-[color:var(--berry-deep)] focus:outline-none"
              />
              <button
                type="submit"
                className="cakish-cta-secondary !min-h-0 !px-4 !py-2.5 !text-[0.66rem]"
              >
                Subscribe
              </button>
            </form>
            <p className="text-[0.66rem] leading-5 text-[color:var(--muted-copy)]/75">
              We never share your address. Unsubscribe in one click.
            </p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 flex flex-col items-center gap-3 border-t border-[color:var(--line)] pt-6 text-xs text-[color:var(--muted-copy)] md:flex-row md:justify-between">
          <p>&copy; {new Date().getFullYear()} Cakish. Handcrafted in Wicklow, Ireland.</p>
          <p className="uppercase tracking-[0.16em]">Collection only · Wicklow, Ireland</p>
        </div>
      </div>
    </footer>
  );
}
