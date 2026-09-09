import { animate, motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * MaskContainer (SVG mask effect) — Aceternity UI, ported to this stack.
 *
 * The pointer carries a hole through the top layer, revealing the layer
 * beneath. The hole grows while the pointer is inside.
 *
 * Both layers hold REAL copy, so nothing here depends on the effect running:
 * with no pointer, no JavaScript, or reduced motion, the revealed text is
 * simply shown and the mask never engages. That matters because the text
 * underneath is the section's actual content, not a flourish.
 */
export default function MaskContainer({
  children,
  revealText,
  className,
  size = 28,
  revealSize = 340,
}: {
  children: ReactNode;
  revealText: ReactNode;
  className?: string;
  size?: number;
  revealSize?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [enabled, setEnabled] = useState(false);

  // Motion values, not state. The first version called setState on every
  // pointer frame, which re-rendered the whole section on each mouse move —
  // that is the lag, and it is also why the hole lagged behind the cursor.
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const r = useMotionValue(size);
  const maskImage = useMotionTemplate`radial-gradient(circle ${r}px at ${x}px ${y}px, transparent 0, transparent 98%, black 100%)`;

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(fine.matches && !still.matches);
    sync();
    fine.addEventListener("change", sync);
    still.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      still.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const controls = animate(r, hovered ? revealSize : size, {
      type: "spring",
      stiffness: 220,
      damping: 32,
    });
    return () => controls.stop();
  }, [hovered, r, revealSize, size]);

  if (!enabled) {
    // The honest fallback: show the thing the mask would have revealed.
    return (
      <div className={cn("relative flex items-center justify-center", className)}>{revealText}</div>
    );
  }

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        x.set(-9999);
        y.set(-9999);
      }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left);
        y.set(event.clientY - rect.top);
      }}
      className={cn("relative overflow-hidden", className)}
    >
      {/* The revealed layer sits underneath and is always painted. */}
      <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-[var(--ins-bright)]">
        {revealText}
      </div>
      {/* The cover is punched through by the mask, so the hole shows the layer
          below rather than the cover being drawn inside a circle. */}
      <motion.div
        style={{ maskImage, WebkitMaskImage: maskImage }}
        className="absolute inset-0 flex items-center justify-center bg-[var(--ins-void)] px-6 text-center text-[var(--ins-dim)]"
      >
        {children}
      </motion.div>
      {/* Keeps the block its natural height without a magic min-height. */}
      <div className="invisible px-6 text-center">{revealText}</div>
    </div>
  );
}
