import { motion, useAnimate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * TextGenerateEffect — Aceternity UI, ported to this stack.
 *
 * A paragraph resolves out of blur one word at a time when it first comes
 * into view, and only then. It replaces the site's old blanket
 * fade-and-slide-up reveals: one device, used where the words are the point.
 */
export default function TextGenerateEffect({
  words,
  className,
  stagger = 0.055,
}: {
  words: string;
  className?: string;
  stagger?: number;
}) {
  const [scope, animate] = useAnimate();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(hostRef, { once: true, amount: 0.25 });
  const tokens = words.split(" ");

  useEffect(() => {
    if (!inView) return;
    void animate(
      "span",
      { opacity: 1, filter: "blur(0px)" },
      { duration: 0.5, delay: (index: number) => index * stagger },
    );
  }, [animate, inView, stagger]);

  return (
    <div ref={hostRef} className={cn(className)}>
      <motion.span ref={scope}>
        {tokens.map((token, index) => (
          <span key={`${token}-${index}`} className="opacity-0" style={{ filter: "blur(8px)" }}>
            {token}
            {index < tokens.length - 1 ? " " : ""}
          </span>
        ))}
      </motion.span>
    </div>
  );
}
