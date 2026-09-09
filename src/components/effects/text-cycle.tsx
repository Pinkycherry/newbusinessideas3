import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * One line that swaps through a set of phrases.
 *
 * Adapted from Kokonut UI's text-loading component (MIT), with the travelling
 * gradient dropped: on paper it read as a shimmer over ink rather than as
 * type. What is left is the vertical swap, which is the part that carries the
 * meaning — each phrase arrives from below and leaves upward.
 *
 * Under reduced motion the first phrase is shown and held.
 */
export default function TextCycle({
  phrases,
  intervalMs = 2200,
  className,
}: {
  phrases: string[];
  intervalMs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (phrases.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % phrases.length), intervalMs);
    return () => clearInterval(id);
  }, [phrases.length, intervalMs]);

  return (
    <span className={cn("relative inline-flex overflow-hidden align-bottom", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: "0.9em", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-0.9em", opacity: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="block whitespace-nowrap"
        >
          {phrases[index] ?? phrases[0]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
