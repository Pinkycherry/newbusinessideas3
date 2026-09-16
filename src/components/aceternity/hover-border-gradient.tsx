import { Slot } from "@radix-ui/react-slot";
import { motion } from "framer-motion";
import * as React from "react";

import { cn } from "@/lib/utils";

const SWEEP: Record<"TOP" | "RIGHT" | "BOTTOM" | "LEFT", string> = {
  TOP: "radial-gradient(40% 90% at 50% 0%, var(--primary) 0%, transparent 100%)",
  RIGHT: "radial-gradient(40% 90% at 100% 50%, var(--primary) 0%, transparent 100%)",
  BOTTOM: "radial-gradient(40% 90% at 50% 100%, var(--primary) 0%, transparent 100%)",
  LEFT: "radial-gradient(40% 90% at 0% 50%, var(--primary) 0%, transparent 100%)",
};
const ORDER = ["TOP", "RIGHT", "BOTTOM", "LEFT"] as const;

/**
 * HoverBorderGradient — Aceternity UI, ported to this stack.
 *
 * The site's primary action. A band of brand ink travels the border, one edge
 * at a time, and resolves into a solid rule while the pointer rests on it. The
 * face stays paper so the label never fights its own frame.
 *
 * Pass `asChild` to hand the treatment to a router <Link> instead of a button.
 */
export default function HoverBorderGradient({
  children,
  className,
  containerClassName,
  asChild = false,
  duration = 1.1,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  containerClassName?: string;
  asChild?: boolean;
  duration?: number;
}) {
  const [hovered, setHovered] = React.useState(false);
  const faceRef = React.useRef<HTMLButtonElement | null>(null);

  // `color` is set imperatively AS IMPORTANT. A plain inline style was not
  // enough: the plate inverted to white on hover while the label stayed at
  // --ins-read, i.e. white on white, because some author rule carrying
  // !important still beat the inline declaration. An inline !important beats
  // every author rule there is, which ends the argument rather than winning
  // another round of it.
  React.useEffect(() => {
    const node = faceRef.current;
    if (!node) return;
    node.style.setProperty(
      "color",
      hovered ? "var(--ins-void, var(--primary-foreground))" : "var(--ins-read, var(--foreground))",
      "important",
    );
  }, [hovered]);
  const [edge, setEdge] = React.useState<(typeof ORDER)[number]>("TOP");
  const Comp = asChild ? Slot : "button";

  React.useEffect(() => {
    if (hovered) return;
    const timer = window.setInterval(() => {
      setEdge((current) => {
        const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
        return next ?? "TOP";
      });
    }, duration * 1000);
    return () => window.clearInterval(timer);
  }, [duration, hovered]);

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn("relative inline-flex overflow-hidden rounded-md p-px", containerClassName)}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        initial={{ background: SWEEP.TOP }}
        animate={{
          background: hovered
            ? "radial-gradient(120% 120% at 50% 50%, var(--primary) 0%, var(--primary) 100%)"
            : SWEEP[edge],
        }}
        transition={{ duration, ease: "linear" }}
      />
      <Comp
        className={cn(
          // `ins-action` is the hook. Arbitrary `hover:` utilities were not
          // reliably winning here (three different attempts, all measured with
          // :hover confirmed matching and the colour unchanged), so the whole
          // rest/hover pair is stated once in @layer utilities against this
          // class instead of guessed at per call site.
          "ins-action relative z-10 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-colors duration-300 focus-visible:outline-none",
          className,
        )}
        ref={faceRef}
        style={{
          backgroundColor: hovered
            ? "var(--ins-signal, var(--primary))"
            : "var(--ins-face, var(--card))",
        }}
        // NOT `style`: an inline colour cannot be overridden by the hover
        // utility above, which is what pinned the label at --ins-read while
        // the plate filled white. The rest colour is a class now, so hover
        // wins normally.

        {...rest}
      >
        {children}
      </Comp>
    </span>
  );
}
