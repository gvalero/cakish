import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/order", label: "Order" },
  { href: "/story", label: "Story" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[rgba(248,246,242,0.82)] px-6 backdrop-blur-xl md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="group inline-flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--line)] bg-white/80 font-serif text-2xl text-[color:var(--soft-gold)] shadow-[0_10px_24px_rgba(53,45,34,0.06)]">
            C
          </span>
          <div>
            <p className="font-serif text-3xl leading-none tracking-[-0.03em] text-[color:var(--deep-charcoal)]">
              Cakish
            </p>
            <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--soft-gold)]">
              Modern Pavlova Atelier
            </p>
          </div>
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
