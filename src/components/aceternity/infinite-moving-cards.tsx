import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { useMarqueeMotion } from "@/motion/use-marquee-motion";
import "./infinite-moving-cards.css";

export type MovingItem = {
  label: string;
  to: string;
  params: Record<string, string>;
};

/**
 * InfiniteMovingCards — Aceternity UI, ported to this stack.
 *
 * Two equal groups include their trailing gap, so -50% lands exactly at the
 * next group's start. Each group repeats the set until it fills the viewport.
 * Only the first set is exposed to keyboard and assistive technology users.
 */
export default function InfiniteMovingCards({
  items,
  direction = "left",
  speed = 70,
  className,
  itemClassName,
}: {
  items: MovingItem[];
  direction?: "left" | "right";
  /** Seconds for one full pass. Lower is faster. */
  speed?: number;
  className?: string;
  itemClassName?: string;
}) {
  const hostRef = useMarqueeMotion();
  const setRef = useRef<HTMLUListElement | null>(null);
  const [repetitions, setRepetitions] = useState(1);

  useEffect(() => {
    const host = hostRef.current;
    const set = setRef.current;
    if (!host || !set || !items.length) return;

    const measure = () => {
      const setWidth = set.getBoundingClientRect().width;
      if (setWidth > 0) {
        setRepetitions(Math.max(1, Math.ceil(host.clientWidth / setWidth)));
      }
    };
    measure();
    // Observe the original set as well as the viewport: loaded fonts, new
    // labels and resizes can all change how many copies fill one group.
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    observer.observe(set);
    return () => observer.disconnect();
  }, [hostRef, items.length]);

  return (
    <div
      ref={hostRef}
      className={cn(
        "ac-marquee ac-pill-marquee group relative overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <div
        data-marquee-track
        className="ac-marquee-track ac-pill-marquee-track flex w-max py-1"
        style={{
          animationPlayState: "paused",
          animationDuration: `${speed}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {[0, 1].map((group) => (
          <div key={group} className="ac-pill-marquee-group" aria-hidden={group === 1 || undefined}>
            {Array.from({ length: repetitions }, (_, copy) => {
              const duplicate = group > 0 || copy > 0;
              return (
                <ul
                  key={copy}
                  ref={!duplicate ? setRef : undefined}
                  className="ac-pill-marquee-set"
                  aria-hidden={duplicate || undefined}
                  data-marquee-copy={duplicate || undefined}
                >
                  {items.map((item, index) => (
                    <li key={`${item.label}-${index}`} className="shrink-0">
                      <Link
                        to={item.to}
                        params={item.params}
                        tabIndex={duplicate ? -1 : undefined}
                        className={cn(
                          "block whitespace-nowrap",
                          itemClassName ??
                            "rounded-full border border-border bg-card px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:border-primary focus-visible:text-primary",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
