import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type MovingItem = {
  label: string;
  to: string;
  params: Record<string, string>;
};

/**
 * InfiniteMovingCards — Aceternity UI, ported to this stack.
 *
 * The row duplicates its own children once and scrolls exactly half its width,
 * so the loop is seamless no matter how many items it is given. It pauses on
 * hover and on keyboard focus, and stands completely still for readers who ask
 * for reduced motion.
 */
export default function InfiniteMovingCards({
  items,
  direction = "left",
  speed = 70,
  className,
}: {
  items: MovingItem[];
  direction?: "left" | "right";
  /** Seconds for one full pass. Lower is faster. */
  speed?: number;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // A row whose items do not fill the viewport leaves a visible blank stretch
  // at one end: translating -50% of a track narrower than the screen exposes
  // the gap behind it. Repeat the set until one half is comfortably wider than
  // any viewport, THEN duplicate that for the seamless loop.
  const perHalf = Math.max(1, Math.ceil(18 / Math.max(items.length, 1)));
  const half = Array.from({ length: perHalf }, () => items).flat();
  const doubled = [...half, ...half];

  return (
    <div
      ref={hostRef}
      className={cn(
        "ac-marquee group relative overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <ul
        className={cn("flex w-max gap-3 py-1", !still && "ac-marquee-track")}
        style={
          still
            ? undefined
            : {
                animationDuration: `${speed}s`,
                animationDirection: direction === "right" ? "reverse" : "normal",
              }
        }
      >
        {doubled.map((item, index) => (
          <li key={`${item.label}-${index}`} className="shrink-0">
            <Link
              to={item.to}
              params={item.params}
              aria-hidden={index >= items.length ? true : undefined}
              tabIndex={index >= items.length ? -1 : undefined}
              className="block whitespace-nowrap rounded-full border border-border bg-card px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:border-primary focus-visible:text-primary"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
