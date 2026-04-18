import Image from "next/image";
import { assetPath } from "@/lib/asset-path";

/**
 * InstagramGrid — 6-tile placeholder built from existing product photography.
 *
 * PLACEHOLDER: owner to wire up a live Instagram feed (or manually curate tiles)
 * post-launch. For now this is a static grid that looks like an IG wall and links
 * to @cakish.ie.
 */

const TILES = [
  { src: "/images/products/strawberry-pavlova-gallery-1.jpg", alt: "A Cakish strawberry pavlova seen from above, with a floral strawberry arrangement." },
  { src: "/images/products/strawberry-pavlova-gallery-2.jpg", alt: "Close-up detail of a Cakish pavlova's strawberry floral pattern." },
  { src: "/images/products/strawberry-pavlova-gallery-3.jpg", alt: "A Cakish pavlova styled for a birthday celebration." },
  { src: "/images/products/generated-heart-pavlova.jpg", alt: "A Cakish heart-shaped pavlova with fresh strawberries." },
  { src: "/images/products/generated-mixed-berries-medium.jpg", alt: "A Cakish mixed berries pavlova with strawberries, blueberries, raspberries, and blackberries." },
  { src: "/images/products/generated-raspberry-medium.jpg", alt: "A Cakish raspberry pavlova with whole raspberries arranged in a dome." },
];

export function InstagramGrid({ compact = false }: { compact?: boolean }) {
  const cols = compact ? "grid-cols-3" : "grid-cols-3 md:grid-cols-6";
  const maxW = compact ? "max-w-md" : "max-w-6xl";

  return (
    <div className={`mx-auto ${maxW} px-6 md:px-10`}>
      {!compact && (
        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="cakish-eyebrow">Follow Along</p>
            <h2 className="mt-3 font-serif text-2xl leading-tight text-[color:var(--deep-charcoal)] md:text-3xl">
              @cakish.ie
            </h2>
          </div>
          <a
            href="https://www.instagram.com/cakish.ie/"
            target="_blank"
            rel="noopener noreferrer"
            className="cakish-link"
          >
            See more on Instagram
          </a>
        </div>
      )}

      <a
        href="https://www.instagram.com/cakish.ie/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Cakish on Instagram"
        className={`grid ${cols} gap-1.5`}
      >
        {TILES.map((tile, i) => (
          <div
            key={i}
            className="group relative aspect-square overflow-hidden bg-[color:var(--soft-cream)]"
          >
            <Image
              src={assetPath(tile.src)}
              alt={tile.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 33vw, 16vw"
            />
            <div className="absolute inset-0 bg-[color:var(--deep-charcoal)]/0 transition-colors duration-300 group-hover:bg-[color:var(--deep-charcoal)]/12" />
          </div>
        ))}
      </a>

      {compact && (
        <p className="mt-3 text-center text-[0.68rem] uppercase tracking-[0.2em] text-[color:var(--muted-copy)]">
          @cakish.ie · Placeholder tiles
        </p>
      )}
    </div>
  );
}
