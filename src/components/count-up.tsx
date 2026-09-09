import { useEffect, useRef } from "react";
import type { gsap as GsapType } from "gsap";

import { loadGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Counts a number up from 0 once, when scrolled into view. Same
 * loadGsap(true) + ScrollTrigger{once:true} pattern as src/components/
 * reveal.tsx, so this is the same engine as every other scroll-triggered
 * animation on the site, not a new one. Writes the formatted value
 * directly to a ref's textContent on each tick (no React state) to avoid
 * a re-render on every animation frame.
 */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = `${value}${suffix}`;
      return;
    }
    el.textContent = `0${suffix}`;

    let cancelled = false;
    let tween: gsap.core.Tween | null = null;

    loadGsap(true).then((gsap: typeof GsapType) => {
      if (cancelled || !ref.current) return;
      const counter = { n: 0 };
      tween = gsap.to(counter, {
        n: value,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => {
          if (ref.current) ref.current.textContent = `${Math.round(counter.n)}${suffix}`;
        },
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          // The count runs again each time the figure comes back into view.
          // A number that animates once and is then frozen for the rest of
          // the session is indistinguishable from static text.
          toggleActions: "restart reverse restart reverse",
        },
      });
    });

    return () => {
      cancelled = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [value, suffix]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
