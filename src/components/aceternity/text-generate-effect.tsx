import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * TextGenerateEffect — Aceternity UI, ported to this stack.
 *
 * An earlier version of this file was deleted mid-redesign because it could
 * strand a paragraph half-visible: it animated `opacity` up from 0 through an
 * imperative `animate()` call, so a reader scrolling fast saw a fragment, and
 * if the observer never fired they saw nothing at all.
 *
 * This one cannot fail closed. Each word is a declarative `motion.span` whose
 * REST state is fully visible; the entrance only plays when the paragraph
 * comes into view, and `prefers-reduced-motion` skips straight to rest. If
 * JavaScript never runs, server-rendered HTML shows the whole paragraph.
 */
export default function TextGenerateEffect({
  words,
  className,
  stagger = 0.045,
}: {
  words: string;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const seen = useInView(ref, { once: true, amount: 0.15 });
  // Fail OPEN. If IntersectionObserver is missing, useInView never turns true
  // and every word would sit at opacity 0 forever — the exact failure that got
  // the first version of this file deleted. No observer means "show it".
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    setSupported(typeof IntersectionObserver !== "undefined");
  }, []);
  const shown = seen || !supported;
  const tokens = words.split(" ");
  // Two things a per-word reveal gets wrong on a long paragraph, both measured
  // on this one (104 words):
  //
  // 1. `filter: blur()` per word puts every word on its own composited layer.
  //    104 of them sat blurred whenever the paragraph was below the fold, and
  //    that alone was a measurable share of the page's paint cost. The reveal
  //    reads the same with opacity and a two-pixel lift, at no such price.
  // 2. A fixed per-word stagger made the last word arrive 4.7 SECONDS after
  //    the first. The whole paragraph now lands inside `WINDOW`, however many
  //    words it holds.
  const WINDOW = 0.9;
  const step = Math.min(stagger, WINDOW / Math.max(tokens.length - 1, 1));

  return (
    <p ref={ref} className={cn(className)}>
      {tokens.map((token, index) => (
        <motion.span
          key={`${token}-${index}`}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 2 }}
          transition={{ duration: 0.42, delay: index * step }}
          className="inline-block whitespace-pre"
        >
          {token}
          {index < tokens.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </p>
  );
}
