import Link from "next/link";
import { siteContent } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--line)] px-6 py-10 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-3">
          <p className="font-serif text-3xl text-[color:var(--deep-charcoal)]">
            Cakish
          </p>
          <p className="max-w-xl text-sm leading-6 text-[color:var(--muted-copy)]">
            {siteContent.footerCopy}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm uppercase tracking-[0.18em] text-[color:var(--muted-copy)]">
          <Link href="/">Home</Link>
          <Link href="/order">Order</Link>
          <Link href="/story">Story</Link>
        </div>
      </div>
    </footer>
  );
}
