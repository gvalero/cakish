import Link from "next/link";
import { siteContent } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer
      className="border-t border-[color:var(--line)] bg-[color:var(--soft-cream)] px-6 py-12 md:px-10"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1fr_auto_auto]">
          {/* Brand column */}
          <div className="space-y-3">
            <p className="font-serif text-xl text-[color:var(--deep-charcoal)]">Cakish</p>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
              Handcrafted Pavlova · Wicklow, Ireland
            </p>
            <p className="max-w-xs text-sm leading-6 text-[color:var(--muted-copy)]">
              {siteContent.footerCopy}
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
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col items-center gap-3 border-t border-[color:var(--line)] pt-6 text-xs text-[color:var(--muted-copy)] md:flex-row md:justify-between">
          <p>&copy; {new Date().getFullYear()} Cakish. Handcrafted in Wicklow, Ireland.</p>
          <p className="uppercase tracking-[0.16em]">Collection only &middot; Wicklow, Ireland</p>
        </div>
      </div>
    </footer>
  );
}
