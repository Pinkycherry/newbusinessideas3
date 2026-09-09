import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { cn, hideImgIfBroken } from "@/lib/utils";

export type MovingImageCard = {
  title: string;
  meta?: string;
  /** Absent once the photo library runs out — the card falls back to a
   * typographic plate rather than repeating a picture already on screen. */
  src?: string;
  alt?: string;
  to: string;
  params: Record<string, string>;
};

/**
 * InfiniteMovingCards, image variant — Aceternity UI, ported to this stack.
 *
 * Same track mechanics as the text row: the set is repeated until one half is
 * wider than any viewport, then duplicated, so translating exactly -50% loops
 * without a seam and without a blank stretch at either end. Pauses on hover
 * and on keyboard focus; stands still under `prefers-reduced-motion`.
 */
export default function MovingImageCards({
  cards,
  direction = "left",
  speed = 60,
  className,
}: {
  cards: MovingImageCard[];
  direction?: "left" | "right";
  speed?: number;
  className?: string;
}) {
  const [still, setStill] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const perHalf = Math.max(1, Math.ceil(8 / Math.max(cards.length, 1)));
  const half = Array.from({ length: perHalf }, () => cards).flat();
  const doubled = [...half, ...half];

  return (
    <div
      className={cn(
        "ac-marquee group relative overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]",
        className,
      )}
    >
      <ul
        className={cn("flex w-max gap-4", !still && "ac-marquee-track")}
        style={
          still
            ? undefined
            : {
                animationDuration: `${speed}s`,
                animationDirection: direction === "right" ? "reverse" : "normal",
              }
        }
      >
        {doubled.map((card, index) => (
          <li key={`${card.title}-${index}`} className="shrink-0">
            <Link
              to={card.to}
              params={card.params}
              aria-hidden={index >= half.length ? true : undefined}
              tabIndex={index >= half.length ? -1 : undefined}
              className="group/card relative block h-48 w-[20rem] overflow-hidden border border-border bg-card md:h-56 md:w-[26rem]"
            >
              {card.src ? (
                <>
                  <img
                    src={card.src}
                    alt={card.alt ?? ""}
                    loading="lazy"
                    ref={hideImgIfBroken}
                    onError={(event) => hideImgIfBroken(event.currentTarget)}
                    className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-500 group-hover/card:scale-105 group-hover/card:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--ins-void)] via-[var(--ins-void)]/40 to-transparent" />
                </>
              ) : (
                // No photograph for this slot. A ruled plate rather than the
                // same picture for the twentieth time.
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[var(--ins-face)] transition-colors duration-500 group-hover/card:bg-[var(--ins-face-2)]"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="block text-base font-semibold leading-snug text-[var(--ins-bright)]">
                  {card.title}
                </span>
                {card.meta ? (
                  <span className="ins-num mt-0.5 block text-[0.6875rem] text-[var(--ins-dim)]">
                    {card.meta}
                  </span>
                ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
