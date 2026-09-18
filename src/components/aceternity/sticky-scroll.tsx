import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type StickyItem = { title: string; description: ReactNode };

/**
 * StickyScroll — Aceternity UI, ported to this stack.
 *
 * The right-hand plate's contents change to match whichever entry the reader
 * is level with. Below the large breakpoint it collapses to a plain stacked
 * list, which is the honest mobile form of a two-column pin.
 *
 * The plate is deliberately NOT `position: sticky` here. On /idea/$slug this
 * renders inside the masthead's `.cx-scene` (motion.css), which sets
 * `perspective` on an ancestor several levels up — and per the same
 * containing-block rule already documented on `idea.$slug.tsx`'s masthead
 * article and sidebar (a `transform`/`perspective` on ANY ancestor of a
 * `position: sticky` element breaks its stickiness), that ancestor is what
 * broke this plate: live, it rendered pinned to whatever position it first
 * computed, disconnected from the column beside it, with the space still
 * reserved for its would-be pin duration reading as a large dead gap.
 * Removing `cx-layer` from the article fixed the OTHER sticky elements on
 * that route but never reached this one, nested deeper inside it. Rather
 * than fight the same ancestor from further down — the fix that actually
 * worked elsewhere on this route was moving off native `position: sticky`
 * entirely (see `ComputedVerdictPanel`'s GSAP `pinType: "transform"` pin in
 * `idea.$slug.tsx`) — the plate now sits in normal flow (`self-start` so it
 * doesn't stretch to the left column's height) and its content still swaps
 * to track scroll position. It no longer stays pinned in the viewport while
 * the reader scrolls past it, which is a real loss versus the original
 * design; restoring that properly means porting this to the same GSAP pin
 * ComputedVerdictPanel uses, which needs a live render to tune (the pin
 * duration has to match this component's actual rendered height, and
 * guessing that number blind risks recreating the exact dead-space bug this
 * change removes). Correct-and-plain beats broken-and-fancy today.
 */
export default function StickyScroll({
  items,
  className,
}: {
  items: StickyItem[];
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: hostRef,
    offset: ["start center", "end center"],
  });
  const progress = useTransform(scrollYProgress, (value) => value);

  useEffect(() => {
    return progress.on("change", (value) => {
      const index = Math.min(items.length - 1, Math.max(0, Math.floor(value * items.length)));
      setActive(index);
    });
  }, [items.length, progress]);

  const current = items[active] ?? items[0];

  // An idea whose research fields are all empty passes an empty array here.
  // Without this the component still rendered its frame — a tall, blank plate
  // reading "00 OF 00" with a screen of dead space above and below it.
  if (items.length === 0) return null;

  return (
    <div ref={hostRef} className={cn("relative lg:grid lg:grid-cols-2 lg:gap-12", className)}>
      <div className="space-y-10 lg:space-y-16">
        {items.map((item, index) => (
          <div key={item.title}>
            <h3
              className={cn(
                "text-xl font-semibold tracking-tight transition-colors duration-300 sm:text-2xl",
                index === active ? "text-foreground" : "lg:text-muted-foreground",
              )}
            >
              {item.title}
            </h3>
            <div
              className={cn(
                "mt-3 max-w-xl text-base leading-relaxed text-muted-foreground transition-opacity duration-300",
                index === active ? "opacity-100" : "lg:opacity-55",
              )}
            >
              {item.description}
            </div>
          </div>
        ))}
      </div>
      <div className="hidden lg:block lg:self-start">
        <div className="flex h-56 items-center justify-center overflow-hidden rounded-md border border-border bg-card p-8">
          {/* This plate used to also print "01 of 03". That was a string I
              wrote, and no word on this site is mine to add — the position is
              already carried by the rule below, which needs no caption. */}
          <motion.div
            key={current?.title ?? "sticky"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full text-center"
          >
            <span className="block text-xl font-semibold leading-tight tracking-tight text-primary sm:text-2xl">
              {current?.title}
            </span>
            <span aria-hidden className="mx-auto mt-5 flex w-24 gap-1">
              {items.map((item, index) => (
                <span
                  key={item.title}
                  className={`h-px flex-1 transition-colors duration-300 ${
                    index === active ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
