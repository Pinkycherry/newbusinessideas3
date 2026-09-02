/**
 * Wipe — a directional clip-path reveal on scroll-into-view.
 *
 * Apply to a wrapper around media or a panel, never directly to tight-set
 * type: clip-path is relative to the border box, not the ink, so a headline
 * gets sheared at the descenders. `iris` reads loudest — once per page at
 * most.
 *
 * clip-path is compositor-friendly here because nothing else about the box
 * changes. No width/height/top/left, no box-shadow animation.
 */
import { useEffect, useRef, type RefObject } from "react";

import { loadGsap, prefersReducedMotion } from "./gsap";

export type WipeDirection = "up" | "down" | "left" | "right" | "iris";

const FROM: Record<WipeDirection, string> = {
  up: "inset(100% 0 0 0)",
  down: "inset(0 0 100% 0)",
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
  iris: "circle(0% at 50% 50%)",
};
const TO: Record<WipeDirection, string> = {
  up: "inset(0% 0 0 0)",
  down: "inset(0 0 0% 0)",
  left: "inset(0 0% 0 0)",
  right: "inset(0 0 0 0%)",
  iris: "circle(78% at 50% 50%)",
};

export type WipeOptions = {
  direction?: WipeDirection;
  duration?: number;
  delay?: number;
  start?: string;
};

export function useWipe<T extends HTMLElement = HTMLElement>(
  options: WipeOptions = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { direction = "up", duration = 0.9, delay = 0, start = "top 82%" } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.removeProperty("clip-path");
      return;
    }
    el.style.clipPath = FROM[direction];

    let cancelled = false;
    let tween: gsap.core.Tween | null = null;
    loadGsap().then(({ gsap }) => {
      if (cancelled || !ref.current) return;
      tween = gsap.to(el, {
        clipPath: TO[direction],
        duration,
        delay,
        ease: "power3.inOut",
        // No `onComplete` clip-path removal: it stripped the very property
        // the reverse needs to animate back, so a two-way wipe would play
        // once and then have nothing to return to.
        scrollTrigger: { trigger: el, start, toggleActions: "restart reverse restart reverse" },
      });
    });

    return () => {
      cancelled = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
      el.style.removeProperty("clip-path");
    };
  }, [direction, duration, delay, start]);

  return ref;
}
