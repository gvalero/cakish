/**
 * Testimonials — 3 placeholder testimonials shown on home and story pages.
 *
 * PLACEHOLDER CONTENT: owner to replace with real captured testimonials before
 * launch (see marketing-audit.md "Trust & Reassurance" section).
 */

const PLACEHOLDER_TESTIMONIALS = [
  {
    quote:
      "Honestly the most beautiful dessert we've had at a family event. People kept asking who made it.",
    attrib: "Aoife",
    context: "Wicklow · communion",
  },
  {
    quote:
      "Turned up on the day looking like a magazine cover. And tasted even better. My daughter wouldn't stop talking about it.",
    attrib: "Sinéad",
    context: "Dublin · birthday",
  },
  {
    quote:
      "We've already ordered a second one. Fresh, not too sweet, and so Irish-summer.",
    attrib: "Mark & Rachel",
    context: "Bray · anniversary",
  },
];

export function Testimonials({ variant = "grid" }: { variant?: "grid" | "single" }) {
  const items = PLACEHOLDER_TESTIMONIALS;

  if (variant === "single") {
    const item = items[0];
    return (
      <figure className="mx-auto max-w-3xl space-y-5 px-6 text-center md:px-10">
        <span
          aria-hidden="true"
          className="block font-serif text-6xl leading-none text-[color:var(--berry-deep)]"
        >
          &ldquo;
        </span>
        <blockquote className="font-serif text-2xl italic leading-[1.4] text-[color:var(--deep-charcoal)] md:text-3xl">
          {item.quote}
        </blockquote>
        <figcaption className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-copy)]">
          {item.attrib} · {item.context}
        </figcaption>
      </figure>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 md:px-10">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="cakish-eyebrow-berry">From Our Kitchens</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-[color:var(--deep-charcoal)] md:text-4xl">
            What our customers say.
          </h2>
        </div>
        <span className="hidden text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-copy)] md:block">
          Placeholder testimonials · replaced at launch
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, i) => (
          <figure
            key={i}
            className="group flex flex-col justify-between gap-6 border border-[color:var(--line)] bg-[color:var(--ivory)] p-7 transition-colors hover:bg-[color:var(--soft-cream)]"
          >
            <span
              aria-hidden="true"
              className="-mt-2 block font-serif text-5xl leading-none text-[color:var(--berry-deep)]"
            >
              &ldquo;
            </span>
            <blockquote className="font-serif text-[1.05rem] italic leading-[1.55] text-[color:var(--deep-charcoal)]">
              {item.quote}
            </blockquote>
            <figcaption className="border-t border-[color:var(--line)] pt-4 text-xs uppercase tracking-[0.2em] text-[color:var(--muted-copy)]">
              <span className="text-[color:var(--deep-charcoal)]">{item.attrib}</span>
              <span className="mx-2">·</span>
              {item.context}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
