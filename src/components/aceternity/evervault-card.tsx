import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Deterministic on the server, re-randomised on the client after mount, so
 * the character field never causes a hydration mismatch. */
const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function noise(length: number, seed: number) {
  let value = seed;
  let out = "";
  for (let i = 0; i < length; i++) {
    value = (value * 1664525 + 1013904223) % 4294967296;
    out += CHARS[value % CHARS.length];
  }
  return out;
}

/**
 * EvervaultCard — Aceternity UI, ported to this stack.
 *
 * The pointer carries a small window through a field of characters: wherever
 * it goes the noise is lit in brand ink, everywhere else it stays dark. The
 * card's real content sits above it and is never obscured.
 *
 * Touch and keyboard users get the card with no field, which is the whole
 * card — the effect is decoration, and it is switched off for anyone who asks
 * for reduced motion.
 */
export default function EvervaultCard({
  children,
  className,
  seed = 7,
}: {
  children: ReactNode;
  className?: string;
  /** Keeps two cards on one page from generating identical noise. */
  seed?: number;
}) {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const [field, setField] = useState(() => noise(2600, seed));
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

  const mask = useMotionTemplate`radial-gradient(180px at ${x}px ${y}px, black 20%, transparent 78%)`;

  return (
    <div
      onMouseMove={(event) => {
        if (!enabled) return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left);
        y.set(event.clientY - rect.top);
        setField(noise(2600, Math.round(event.clientX + event.clientY + seed)));
      }}
      onMouseLeave={() => {
        x.set(-400);
        y.set(-400);
      }}
      className={cn(
        "group/ev relative overflow-hidden border border-border bg-card transition-colors duration-300 hover:border-primary/50",
        className,
      )}
    >
      {enabled ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 select-none break-all p-2 font-mono text-[0.6rem] leading-[1.05] text-primary/70 opacity-0 transition-opacity duration-300 group-hover/ev:opacity-100"
          style={{ maskImage: mask, WebkitMaskImage: mask }}
        >
          {field}
        </motion.div>
      ) : null}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
