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
    <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[rgba(250,250,248,0.96)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10 md:py-5">
        {/* Logo + wordmark */}
        <Link href="/" className="group inline-flex items-center gap-2.5">
          <BrandLogo
            priority
            className="h-10 w-10 object-contain md:h-12 md:w-12"
          />
          <div>
            <p className="font-serif text-xl leading-none tracking-[-0.02em] text-[color:var(--deep-charcoal)] md:text-2xl">
              Cakish
            </p>
            <p className="mt-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--soft-gold)]">
              Handcrafted Pavlova
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="flex items-center gap-6 md:gap-8" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
                  active
                    ? "text-[color:var(--deep-charcoal)]"
                    : "text-[color:var(--muted-copy)] hover:text-[color:var(--deep-charcoal)]"
                }`}
              >
                {item.label}
                {active && (
                  <span className="mt-0.5 block h-px w-full bg-[color:var(--soft-gold)]" />
                )}
              </Link>
            );
          })}
          <Link
            href="/order/"
            className="cakish-button hidden !min-h-0 !px-5 !py-2.5 !text-[0.68rem] md:inline-flex"
            aria-label="Order a pavlova"
          >
            Order Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
