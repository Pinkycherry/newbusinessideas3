import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * FlipWords — Aceternity UI, ported to this stack.
 *
 * One slot in a headline cycles through a set of words, each word leaving
 * letter by letter and the next arriving as a whole. It is the only motion the
 * hero carries, so the sentence around it stays perfectly still.
 *
 * The rotation pauses under `prefers-reduced-motion`: the first word is simply
 * printed and never replaced.
 */
export default function FlipWords({
  words,
  duration = 2600,
  className,
}: {
  words: string[];
  duration?: number;
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

  const advance = useCallback(() => {
    setIndex((current) => (current + 1) % Math.max(words.length, 1));
  }, [words.length]);

  useEffect(() => {
    if (!animate || words.length < 2) return;
    const timer = window.setInterval(advance, duration);
    return () => window.clearInterval(timer);
  }, [advance, animate, duration, words.length]);

  const word = words[index] ?? words[0] ?? "";

  if (!animate) {
    return <span className={cn("inline-block", className)}>{word}</span>;
  }

  return (
    <span className="relative inline-block align-baseline">
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          initial={{ opacity: 0, y: "-100%", filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: "60%", filter: "blur(6px)", position: "absolute" }}
          transition={{ type: "spring", stiffness: 110, damping: 16 }}
          className={cn("inline-block whitespace-nowrap", className)}
        >
          {word.split(" ").map((chunk, chunkIndex) => (
            <motion.span
              key={`${word}-${chunkIndex}`}
              initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: chunkIndex * 0.09, duration: 0.32 }}
              className="inline-block"
            >
              {chunk}
              {chunkIndex < word.split(" ").length - 1 ? " " : null}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
