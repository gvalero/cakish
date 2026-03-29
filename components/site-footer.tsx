import Link from "next/link";
import { siteContent } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--line)] px-6 py-10 md:px-10">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Brand line */}
        <div className="flex flex-col gap-1 text-center md:text-left">
          <p className="font-serif text-lg text-[color:var(--deep-charcoal)]">Cakish</p>
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
            Modern Pavlova · Handcrafted in Dublin
          </p>
        </div>

        {/* Footer copy */}
        <p className="mx-auto max-w-md text-center text-sm leading-6 text-[color:var(--muted-copy)] md:mx-0 md:text-left">
          {siteContent.footerCopy}
        </p>

        {/* Bottom row */}
        <div className="flex flex-col items-center gap-4 border-t border-[color:var(--line)] pt-6 text-xs uppercase tracking-[0.16em] text-[color:var(--muted-copy)] md:flex-row md:justify-between">
          <div className="flex gap-6">
            <a href="mailto:hello@cakish.ie" className="transition hover:text-[color:var(--deep-charcoal)]">
              hello@cakish.ie
            </a>
            <a
              href="https://instagram.com/cakish.ie"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-[color:var(--deep-charcoal)]"
            >
              @cakish.ie
            </a>
          </div>
          <nav className="flex gap-6">
            <Link href="/" className="transition hover:text-[color:var(--deep-charcoal)]">Home</Link>
            <Link href="/order" className="transition hover:text-[color:var(--deep-charcoal)]">Order</Link>
            <Link href="/story" className="transition hover:text-[color:var(--deep-charcoal)]">Story</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
