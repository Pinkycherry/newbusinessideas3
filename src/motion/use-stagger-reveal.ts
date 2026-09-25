/** Once-only composited reveals. No GSAP download, replay, or scroll listener. */
import { useEffect, useRef, type RefObject } from "react";

import { calmStaggerReveal } from "./calm-reveal";
export type StaggerRevealDirection = "up" | "down" | "left" | "right" | "none";

export type StaggerRevealOptions = {
  /** CSS selector for the children to reveal. Default: direct children. */
  selector?: string;
  /** Travel distance in px. Default 18. Keep it small — this is a taste floor. */
  distance?: number;
  direction?: StaggerRevealDirection;
  /** Seconds between children. Default 0.06. */
  stagger?: number;
  /** Seconds per child. Default 0.55. */
  duration?: number;
  /** Seconds before the first child. Default 0. */
  delay?: number;
  /** ScrollTrigger start. Default "top 85%". */
  start?: string;
  /** Starting scale, e.g. 0.98 for a faint zoom. Default 1 (no scale). */
  scaleFrom?: number;
};

export function useStaggerReveal<T extends HTMLElement = HTMLElement>(
  options: StaggerRevealOptions = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { selector, distance = 18, direction = "up", stagger = 0.06 } = options;

  useEffect(() => {
    return ref.current
      ? calmStaggerReveal(ref.current, { selector, distance, direction, stagger })
      : undefined;
  }, [selector, distance, direction, stagger]);

  return ref;
}
