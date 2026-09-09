import { motion } from "framer-motion";
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
  size = 24,
  revealSize = 320,
}: {
  children: ReactNode;
  revealText: ReactNode;
  className?: string;
  size?: number;
  revealSize?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [hovered, setHovered] = useState(false);
  const [enabled, setEnabled] = useState(false);

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

  const r = hovered ? revealSize : size;

  if (!enabled) {
    // The honest fallback: show the thing the mask would have revealed.
    return (
      <div className={cn("relative flex items-center justify-center", className)}>{revealText}</div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
      }}
      onMouseLeave={() => setPos(null)}
      className={cn("relative", className)}
    >
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{
          maskPosition: pos ? `${pos.x - r / 2}px ${pos.y - r / 2}px` : "0px 0px",
          maskSize: `${r}px`,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 40 }}
        className="absolute inset-0 flex items-center justify-center bg-[var(--ins-signal,theme(colors.primary))] text-[var(--ins-void,#07070f)] [mask-image:radial-gradient(circle,black_50%,transparent_51%)] [mask-repeat:no-repeat]"
      >
        {/* An opaque plate so the layer below cannot bleed through the fill. */}
        <div className="absolute inset-0 bg-[var(--ins-signal,theme(colors.primary))]" />
        <div className="relative z-10 px-6 text-center">{revealText}</div>
      </motion.div>
      <div className="flex items-center justify-center px-6 text-center">{children}</div>
    </motion.div>
  );
}
