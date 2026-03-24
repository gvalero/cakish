import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/order", label: "Order" },
  { href: "/story", label: "Story" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[rgba(248,246,242,0.82)] px-6 backdrop-blur-xl md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="group inline-flex items-center">
          <BrandLogo
            priority
            className="h-20 w-20 rounded-full object-cover shadow-[0_14px_32px_rgba(53,45,34,0.08)] transition duration-200 group-hover:translate-y-[-1px] md:h-24 md:w-24"
          />
        </Link>

        <nav className="flex flex-wrap items-center gap-2 md:gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-transparent px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-copy)] transition hover:border-[color:var(--line)] hover:bg-white/75 hover:text-[color:var(--deep-charcoal)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
