import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { siteContent } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--line)] px-4 py-10 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-3 text-center md:text-left">
          <BrandLogo className="mx-auto h-24 w-24 object-contain md:mx-0 md:h-32 md:w-32" />
          <p className="mx-auto max-w-xl text-sm leading-6 text-[color:var(--muted-copy)] md:mx-0">
            {siteContent.footerCopy}
          </p>
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-copy)]">
            Each pavlova is made fresh to order. We take a limited number of orders each week to ensure every piece receives full attention.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-1 text-sm text-[color:var(--muted-copy)] md:justify-start">
            <a
              href="mailto:hello@cakish.ie"
              className="uppercase tracking-[0.14em] transition hover:text-[color:var(--deep-charcoal)]"
            >
              hello@cakish.ie
            </a>
            <a
              href="https://instagram.com/cakish.ie"
              target="_blank"
              rel="noopener noreferrer"
              className="uppercase tracking-[0.14em] transition hover:text-[color:var(--deep-charcoal)]"
            >
              @cakish.ie
            </a>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm uppercase tracking-[0.18em] text-[color:var(--muted-copy)] md:justify-end">
          <Link href="/" className="transition hover:text-[color:var(--deep-charcoal)]">Home</Link>
          <Link href="/order" className="transition hover:text-[color:var(--deep-charcoal)]">Order</Link>
          <Link href="/story" className="transition hover:text-[color:var(--deep-charcoal)]">Story</Link>
        </div>
      </div>
    </footer>
  );
}
