import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { siteContent } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--line)] px-4 py-10 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 text-center md:grid-cols-[1fr_auto] md:items-end md:text-left">
        <div className="space-y-3">
          <BrandLogo className="mx-auto h-20 w-20 rounded-full object-cover shadow-[0_18px_40px_rgba(53,45,34,0.06)] md:mx-0 md:h-24 md:w-24" />
          <p className="mx-auto max-w-xl text-sm leading-6 text-[color:var(--muted-copy)] md:mx-0">
            {siteContent.footerCopy}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm uppercase tracking-[0.18em] text-[color:var(--muted-copy)] md:justify-end">
          <Link href="/">Home</Link>
          <Link href="/order">Order</Link>
          <Link href="/story">Story</Link>
        </div>
      </div>
    </footer>
  );
}
