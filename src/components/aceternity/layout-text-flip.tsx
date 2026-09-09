import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * LayoutTextFlip — Aceternity UI, ported to this stack.
 *
 * A static phrase followed by a plate whose width animates to fit whichever
 * word is showing. Under `prefers-reduced-motion` the first word is printed
 * and never replaced, so the sentence still reads.
 */
export default function LayoutTextFlip({
  text,
  words,
  duration = 2400,
  className,
  wordClassName,
}: {
  text: string;
  words: string[];
  duration?: number;
  className?: string;
  wordClassName?: string;
}) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAnimate(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!animate || words.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % words.length),
      duration,
    );
    return () => window.clearInterval(timer);
  }, [animate, duration, words.length]);

  const word = words[index] ?? words[0] ?? "";

  return (
    <span className={cn("inline-flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
      <span>{text}</span>
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className={cn(
          "relative inline-flex items-center overflow-hidden rounded-md border border-border bg-card px-3 py-0.5",
          wordClassName,
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={word}
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.3 }}
            className="whitespace-nowrap"
          >
            {word}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </span>
  );
}
