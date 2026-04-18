"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/order/", label: "Order" },
  { href: "/story/", label: "Our Story" },
];

export function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "/cakish" || pathname === "/cakish/";
    // Strip trailing slash for comparison
    const clean = href.replace(/\/$/, "");
    return pathname.startsWith(clean);
  };

  return (
    <>
      {/* Launch Banner — remove by setting NEXT_PUBLIC_SHOW_BANNER=false */}
      {process.env.NEXT_PUBLIC_SHOW_BANNER !== "false" && (
      <div className="bg-[color:var(--deep-charcoal)] px-4 py-3 text-center">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[color:var(--soft-gold)] sm:text-xs">
          Taking orders from May 1 · Follow&nbsp;
          <a
            href="https://www.instagram.com/cakish.ie/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[color:var(--soft-gold)]/50 underline-offset-4 transition-colors hover:text-[color:var(--ivory)]"
          >
            @cakish.ie
          </a>
          &nbsp;for the opening.
        </p>
        {process.env.NEXT_PUBLIC_IS_DEV === "true" && (
          <p className="mt-1 text-[0.55rem] font-medium uppercase tracking-[0.22em] text-[color:var(--ivory)]/55">
            Preview build · cakish.pages.dev
          </p>
        )}
      </div>
      )}
      <header className="sticky top-0 z-40 overflow-x-hidden border-b border-[color:var(--line)] bg-[rgba(250,250,248,0.96)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 md:px-10 md:py-5">
        {/* Logo + wordmark */}
        <Link href="/" className="group inline-flex flex-shrink-0 items-center gap-2">
          <BrandLogo
            priority
            className="h-8 w-8 object-contain sm:h-10 sm:w-10 md:h-12 md:w-12"
          />
          <div>
            <p className="font-serif text-lg leading-none tracking-[-0.02em] text-[color:var(--deep-charcoal)] sm:text-xl md:text-2xl">
              Cakish
            </p>
            <p className="mt-0.5 hidden text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--soft-gold)] sm:block">
              Handcrafted Pavlova
            </p>
          </div>
        </Link>

        {/* Nav — compact on mobile */}
        <nav className="flex items-center gap-2 sm:gap-4 md:gap-8" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex min-h-[44px] items-center text-[0.65rem] font-semibold uppercase tracking-[0.1em] transition-colors sm:text-xs sm:tracking-[0.18em] ${
                  active
                    ? "text-[color:var(--deep-charcoal)]"
                    : "text-[color:var(--muted-copy)] hover:text-[color:var(--deep-charcoal)]"
                }`}
              >
                <span>
                  {item.label}
                  {active && (
                    <span className="mt-0.5 block h-px w-full bg-[color:var(--berry-deep)]" />
                  )}
                </span>
              </Link>
            );
          })}
          <Link
            href="/order/"
            className="cakish-cta-primary hidden !min-h-0 !px-5 !py-2.5 !text-[0.68rem] md:inline-flex"
            aria-label="Order a pavlova"
          >
            Order Now
          </Link>
        </nav>
      </div>
    </header>
    </>
  );
}
