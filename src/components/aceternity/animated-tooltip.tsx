import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type TooltipPerson = { id: number | string; name: string; designation: string };

/**
 * AnimatedTooltip — Aceternity UI, ported to this stack.
 *
 * A row of monogram stamps; the card above one tilts with the pointer's
 * position across it. The upstream component wants photographs — this site has
 * no portraits of its own, so a stamp cut from the person's initials stands in
 * rather than a stock face.
 */
export default function AnimatedTooltip({
  items,
  className,
}: {
  items: TooltipPerson[];
  className?: string;
}) {
  const [hovered, setHovered] = useState<string | number | null>(null);
  const x = useMotionValue(0);
  const spring = useSpring(x, { stiffness: 100, damping: 12 });
  const rotate = useTransform(spring, [-100, 100], [-14, 14]);
  const translateX = useTransform(spring, [-100, 100], [-30, 30]);

  return (
    <div className={cn("flex flex-wrap items-center", className)}>
      {items.map((item) => {
        const initials = item.name
          .split(" ")
          .map((part) => part.charAt(0))
          .join("")
          .slice(0, 2)
          .toUpperCase();

        return (
          <div
            key={item.id}
            className="group relative -mr-3"
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            onMouseMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              x.set(event.clientX - rect.left - rect.width / 2);
            }}
          >
            <AnimatePresence>
              {hovered === item.id ? (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.94 }}
                  style={{ rotate, translateX }}
                  className="absolute -top-16 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center whitespace-nowrap rounded-md border border-border bg-card px-4 py-2 shadow-sm"
                >
                  <span className="text-sm font-semibold">{item.name}</span>
                  <span className="text-[11px] text-muted-foreground">{item.designation}</span>
                </motion.div>
              ) : null}
            </AnimatePresence>
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-xs font-semibold tracking-widest text-primary transition-transform duration-300 group-hover:z-20 group-hover:scale-105">
              {initials}
            </span>
          </div>
        );
      })}
    </div>
  );
}
