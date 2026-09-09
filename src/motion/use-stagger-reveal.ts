/**
 * Stagger reveal — reveals the children of a container in sequence as the
 * container crosses the viewport, in BOTH directions and on every pass.
 *
 * This used to run once and never reverse, on the reasoning that content
 * which re-hides on the way back up is a defect. The founder overruled that
 * directly: a reveal that fires once per page load is invisible to anyone who
 * scrolls the way people actually scroll, up and down through a page, and the
 * site read as static because of it. It now restarts on every entry from
 * either direction and reverses on every exit.
 *
 * Takes a child selector, so it retrofits onto markup that already exists: a
 * grid of cards, a footer column of links, the rows of a pricing table. No
 * wrapper components, no markup changes.
 *
 * Transform + opacity only. Under reduced motion the children are marked
 * revealed immediately with no tween.
 */
import { useEffect, useRef, type RefObject } from "react";

import { loadGsap, prefersReducedMotion } from "./gsap";

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

const AXIS: Record<StaggerRevealDirection, (d: number) => gsap.TweenVars> = {
  up: (d) => ({ y: d }),
  down: (d) => ({ y: -d }),
  left: (d) => ({ x: d }),
  right: (d) => ({ x: -d }),
  none: () => ({}),
};

export function useStaggerReveal<T extends HTMLElement = HTMLElement>(
  options: StaggerRevealOptions = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const {
    selector,
    distance = 18,
    direction = "up",
    stagger = 0.06,
    duration = 0.55,
    delay = 0,
    start = "top 85%",
    scaleFrom = 1,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = selector
      ? Array.from(el.querySelectorAll<HTMLElement>(selector))
      : (Array.from(el.children) as HTMLElement[]);
    if (items.length === 0) return;

    if (prefersReducedMotion()) {
      // `reduce` means reduce, not eliminate. The setting exists for people
      // who get motion sickness from large or parallax movement; a short
      // opacity fade is not that, and it is explicitly the fallback the WCAG
      // guidance suggests.
      //
      // The previous behaviour marked everything revealed instantly, so a
      // visitor with the setting on saw a site with no motion whatsoever.
      // Android's battery saver turns that setting on by itself, as does
      // Windows' "Animation effects: off" - which is a large share of the
      // India-first audience this is built for.
      items.forEach((i, idx) => {
        i.style.opacity = "0";
        i.style.transition = `opacity 260ms ease ${Math.min(idx * 30, 240)}ms`;
        i.setAttribute("data-revealed", "");
      });
      // Next frame, so the transition has a start value to animate from.
      requestAnimationFrame(() => {
        items.forEach((i) => {
          i.style.opacity = "1";
        });
      });
      return;
    }

    // Hide with plain inline styles first, so the starting state is correct
    // even while the gsap chunk is still downloading.
    items.forEach((i) => {
      i.style.opacity = "0";
      i.style.willChange = "transform, opacity";
    });

    let cancelled = false;
    let tween: gsap.core.Tween | null = null;

    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      tween = gsap.fromTo(
        items,
        { opacity: 0, scale: scaleFrom, ...AXIS[direction](distance) },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          delay,
          stagger,
          ease: "power3.out",
          clearProps: "willChange",
          onComplete: () => items.forEach((i) => i.setAttribute("data-revealed", "")),
          // [onEnter, onLeave, onEnterBack, onLeaveBack]. Restart whenever
          // the container comes into view from either direction, reverse
          // whenever it leaves in either direction — so the motion is there
          // on the second pass and the twentieth, not just the first.
          scrollTrigger: { trigger: el, start, toggleActions: "restart reverse restart reverse" },
        },
      );
    });

    return () => {
      cancelled = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
      items.forEach((i) => {
        i.style.removeProperty("opacity");
        i.style.removeProperty("will-change");
      });
    };
  }, [selector, distance, direction, stagger, duration, delay, start, scaleFrom]);

  return ref;
}
