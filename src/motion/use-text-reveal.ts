/**
 * Text reveal — line-by-line masked reveal using GSAP SplitText.
 *
 * Uses `mask: "lines"` so each line slides up from a clean edge with room for
 * descenders (a naive line-box clip cuts the tails off "g" and "y"),
 * `autoSplit: true` so lines re-split correctly when the container resizes or
 * a webfont finishes loading, and `aria: "auto"` so screen readers still get
 * one continuous, unbroken string.
 *
 * At most one kinetic headline per section. Two competing is noise.
 *
 * Under reduced motion the element is left exactly as authored — no split, no
 * tween, no risk of a half-revealed line if something goes wrong.
 */
import { useEffect, useRef, type RefObject } from "react";

import { loadGsap, prefersReducedMotion } from "./gsap";

export type TextRevealOptions = {
  /** "lines" (default) or "words" for shorter, punchier labels. */
  type?: "lines" | "words";
  /** Seconds between lines/words. Default 0.08. */
  stagger?: number;
  /** Seconds per line/word. Default 0.7. */
  duration?: number;
  delay?: number;
  /** ScrollTrigger start. Default "top 85%". */
  start?: string;
};

export function useTextReveal<T extends HTMLElement = HTMLElement>(
  options: TextRevealOptions = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { type = "lines", stagger = 0.08, duration = 0.7, delay = 0, start = "top 85%" } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (!el.textContent?.trim()) return;

    let cancelled = false;
    let split: InstanceType<import("gsap/SplitText").SplitText> | null = null;

    loadGsap().then(({ gsap, SplitText }) => {
      if (cancelled || !ref.current) return;
      split = SplitText.create(el, {
        type,
        mask: type,
        autoSplit: true,
        aria: "auto",
        onSplit(self) {
          const targets = type === "lines" ? self.lines : self.words;
          return gsap.fromTo(
            targets,
            { yPercent: 108, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration,
              delay,
              stagger,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start, once: true },
            },
          );
        },
      });
    });

    return () => {
      cancelled = true;
      split?.revert();
    };
  }, [type, stagger, duration, delay, start]);

  return ref;
}
