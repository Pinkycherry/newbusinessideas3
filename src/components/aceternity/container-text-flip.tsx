import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * ContainerTextFlip — Aceternity UI, ported to this stack.
 *
 * A filled plate whose width animates to fit whichever word is showing. Used
 * once per page at most: it is the loudest type device in the set.
 */
export default function ContainerTextFlip({
  words,
  interval = 2800,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
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
      interval,
    );
    return () => window.clearInterval(timer);
  }, [animate, interval, words.length]);

  const word = words[index] ?? words[0] ?? "";

  return (
    <motion.span
      layout
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className={cn(
        "inline-flex items-center rounded-md bg-primary px-3 py-1 align-middle text-primary-foreground",
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={word}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28 }}
          className="whitespace-nowrap"
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
