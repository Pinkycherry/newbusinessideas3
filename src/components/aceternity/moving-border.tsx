import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * MovingBorder button — Aceternity UI, ported to this stack.
 *
 * The secondary action. A single point of brand ink runs the perimeter on a
 * long, slow cycle — enough to say the control is live, quiet enough to sit
 * next to body copy. Implemented with a conic gradient rather than an SVG
 * offset-path so it costs one compositor property and stops dead under
 * `prefers-reduced-motion` (see .ac-orbit in styles.css).
 */
export default function MovingBorder({
  children,
  className,
  containerClassName,
  asChild = false,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  containerClassName?: string;
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <span
      className={cn(
        "ac-orbit relative inline-flex overflow-hidden rounded-md p-px",
        containerClassName,
      )}
    >
      <Comp
        className={cn(
          "relative z-10 inline-flex items-center justify-center gap-2 rounded-[calc(var(--radius)-1px)] border border-border bg-card px-5 py-2.5 text-sm font-semibold tracking-tight text-foreground transition-colors duration-300 hover:text-primary focus-visible:outline-none",
          className,
        )}
        {...rest}
      >
        {children}
      </Comp>
    </span>
  );
}
