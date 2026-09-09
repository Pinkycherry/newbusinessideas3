import { useMotionValue, useMotionTemplate, motion } from "framer-motion";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * CardSpotlight — Aceternity UI, ported to this stack.
 *
 * A plate that lights where the pointer is. The wash is brand ink at low
 * strength over paper, so it reads as the card noticing you rather than as a
 * glow. Touch and keyboard users get the plain plate, which is the whole card.
 */
export default function CardSpotlight({
  children,
  className,
  radius = 380,
}: {
  children: React.ReactNode;
  className?: string;
  radius?: number;
}) {
  const x = useMotionValue(-radius);
  const y = useMotionValue(-radius);
  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, color-mix(in oklab, var(--primary) 14%, transparent), transparent 72%)`;

  return (
    <div
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left);
        y.set(event.clientY - rect.top);
      }}
      onMouseLeave={() => {
        x.set(-radius);
        y.set(-radius);
      }}
      className={cn(
        "group relative overflow-hidden rounded-md border border-border bg-card transition-colors duration-300 hover:border-primary/50",
        className,
      )}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
