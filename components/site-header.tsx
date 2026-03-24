"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/order", label: "Order" },
  { href: "/story", label: "Story" },
];

export function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "/cakish" || pathname === "/cakish/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[rgba(248,246,242,0.82)] px-4 backdrop-blur-xl md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between md:gap-4 md:py-4">
        <Link href="/" className="group inline-flex items-center gap-3 self-center md:self-auto">
          <BrandLogo
            priority
            className="h-20 w-20 object-contain transition duration-200 group-hover:translate-y-[-1px] md:h-28 md:w-28"
          />
          <div className="min-w-0">
            <p className="font-serif text-2xl leading-none tracking-[-0.03em] text-[color:var(--deep-charcoal)] md:text-4xl">
              Cakish
            </p>
            <p className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--soft-gold)] md:text-[0.7rem] md:tracking-[0.28em]">
              Modern Pavlova Atelier
            </p>
          </div>
        </Link>

        <nav className="flex w-full items-center gap-2 overflow-x-auto pb-1 md:flex md:w-auto md:flex-wrap md:justify-end md:overflow-visible md:pb-0 md:gap-3">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full border px-4 py-2 text-center text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition md:text-sm md:tracking-[0.18em] ${
                  active
                    ? "border-[color:var(--soft-gold)] bg-[rgba(198,167,105,0.12)] text-[color:var(--deep-charcoal)] shadow-[0_4px_14px_rgba(198,167,105,0.18)]"
                    : "border-[color:var(--line)] bg-white/80 text-[color:var(--muted-copy)] hover:border-[color:var(--line)] hover:bg-white/75 hover:text-[color:var(--deep-charcoal)] md:border-transparent md:bg-transparent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
