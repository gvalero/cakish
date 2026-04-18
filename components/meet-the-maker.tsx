import Image from "next/image";
import Link from "next/link";
import { assetPath } from "@/lib/asset-path";

/**
 * MeetTheMaker — trust block used on / and /story.
 *
 * NOTE: Uses a cropped existing process shot as a stand-in for the maker's portrait.
 * Owner to replace `/images/maker-portrait.jpg` with a real photograph before launch.
 * Variant "compact" = homepage teaser, "full" = story-page long-form.
 */
export function MeetTheMaker({ variant = "compact" }: { variant?: "compact" | "full" }) {
  if (variant === "full") {
    return (
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="order-2 lg:order-1 space-y-6">
            <p className="cakish-eyebrow-berry">Meet the Maker</p>
            <p className="cakish-pullquote">
              &ldquo;Every meringue is piped by hand, one at a time.&rdquo;
            </p>
            <div className="space-y-4 text-[1.02rem] leading-8 text-[color:var(--body-copy)]">
              <p>
                Cakish started in a small Wicklow kitchen, piping pavlovas for family
                birthdays and the occasional wedding. A few friends asked for one.
                Then a few more. Then strangers.
              </p>
              <p>
                The model is deliberately small. A limited number of orders each week,
                each one handcrafted from a single meringue base, a single bowl of
                cream, a single arrangement of fruit chosen that morning.
              </p>
              <p>
                Every pavlova leaves the kitchen with a note about its ingredients
                and a name on the box.
              </p>
            </div>
            <p className="italic font-serif text-[color:var(--muted-copy)]">
              — Cakish, Wicklow
            </p>
          </div>

          <div className="order-1 lg:order-2 relative aspect-[4/5] overflow-hidden">
            {/* PLACEHOLDER: owner to replace with real portrait photo */}
            <Image
              src={assetPath("/images/story-meringue-piping.jpg")}
              alt="The Cakish kitchen — piping a fresh meringue base by hand in Wicklow, Ireland."
              fill
              className="object-cover"
            />
            <span className="absolute left-3 bottom-3 rounded-sm bg-[color:var(--ivory)]/90 px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-copy)]">
              Placeholder portrait
            </span>
          </div>
        </div>
      </div>
    );
  }

  // compact (homepage teaser)
  return (
    <div className="mx-auto max-w-6xl px-6 md:px-10">
      <div className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:items-center">
        <div className="relative aspect-[4/5] overflow-hidden md:order-1">
          {/* PLACEHOLDER portrait — owner to replace */}
          <Image
            src={assetPath("/images/story-meringue-piping.jpg")}
            alt="The Cakish kitchen — piping a fresh meringue base by hand in Wicklow, Ireland."
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
          <span className="absolute left-3 bottom-3 rounded-sm bg-[color:var(--ivory)]/90 px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-copy)]">
            Placeholder portrait
          </span>
        </div>

        <div className="space-y-5 md:order-2">
          <p className="cakish-eyebrow-berry">Meet the Maker</p>
          <p className="cakish-pullquote">
            Hi, I&rsquo;m the baker behind <em>Cakish</em>.
          </p>
          <p className="text-[1.02rem] leading-8 text-[color:var(--body-copy)] max-w-lg">
            A small Wicklow home bakery — one meringue, one bowl of cream, one
            arrangement of fruit at a time. A limited number of orders each week, made
            from scratch for your occasion.
          </p>
          <div className="flex flex-wrap items-center gap-5 pt-2">
            <Link href="/story/" className="cakish-link">
              Read the full story
            </Link>
            <a
              href="https://www.instagram.com/cakish.ie/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-copy)] transition-colors hover:text-[color:var(--deep-charcoal)]"
            >
              @cakish.ie →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
