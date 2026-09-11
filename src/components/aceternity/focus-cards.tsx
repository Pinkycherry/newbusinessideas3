import { Link } from "@tanstack/react-router";
import { memo, useState } from "react";

import { cn, hideImgIfBroken } from "@/lib/utils";

export type FocusCard = {
  title: string;
  meta?: string;
  src?: string;
  alt?: string;
  to: string;
  params: Record<string, string>;
};

/**
 * FocusCards — Aceternity UI, ported to this stack.
 *
 * Hovering one card pulls it forward and lets every sibling fall back — the
 * grid answers a reader's attention instead of animating on its own. Cards are
 * real links, so the whole grid is keyboard-reachable and focus does exactly
 * what hover does.
 */
const Card = memo(function Card({
  card,
  index,
  focused,
  setFocused,
}: {
  card: FocusCard;
  index: number;
  focused: number | null;
  setFocused: (value: number | null) => void;
}) {
  const dimmed = focused !== null && focused !== index;

  return (
    <Link
      to={card.to}
      params={card.params}
      onMouseEnter={() => setFocused(index)}
      onMouseLeave={() => setFocused(null)}
      onFocus={() => setFocused(index)}
      onBlur={() => setFocused(null)}
      className={cn(
        "group relative block h-56 w-full overflow-hidden rounded-md border border-border bg-card transition-all duration-300 ease-out sm:h-64",
        dimmed && "scale-[0.985] opacity-60 blur-[1px]",
      )}
    >
      {card.src ? (
        <img
          src={card.src}
          alt={card.alt ?? ""}
          loading="lazy"
          ref={hideImgIfBroken}
          onError={(event) => hideImgIfBroken(event.currentTarget)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : null}
      {/* The scrim is the HOUSING, stated outright, not `--foreground`.
          `from-foreground/85` with `text-background` was correct in the light
          theme it was written for — dark scrim, light label. Both tokens
          inverted in the instrument scope, so it became a LIGHT scrim carrying
          DARK text over a mid-tone photograph: measured at 1.11:1 on /browse,
          across all 28 cards. Explicit values cannot flip under it again. */}
      {card.src ? (
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ins-void)] via-[var(--ins-void)]/55 to-transparent" />
      ) : (
        <span aria-hidden className="absolute inset-0 bg-card" />
      )}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5">
        <span className="text-lg font-semibold leading-snug text-[var(--ins-bright)]">
          {card.title}
        </span>
        {card.meta ? (
          <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--ins-dim)]">
            {card.meta}
          </span>
        ) : null}
      </div>
    </Link>
  );
});

export default function FocusCards({
  cards,
  className,
}: {
  cards: FocusCard[];
  className?: string;
}) {
  const [focused, setFocused] = useState<number | null>(null);

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          focused={focused}
          setFocused={setFocused}
        />
      ))}
    </div>
  );
}
