/**
 * Odometer / counter.
 *
 * Counts a REAL number up when it enters view. Two non-negotiables baked in:
 *
 *  1. It never invents a number. It only ever animates toward the exact value
 *     you pass, and it always lands on that value precisely — the final frame
 *     writes the formatted target, not a rounded interpolation.
 *  2. It only starts from 0 or from an explicitly supplied `from` value, and
 *     it prints "0" (formatted) as the resting state before it runs — never a
 *     fabricated "starting point" that implies a figure the data does not have.
 *
 * Handles decimals: pass `decimals` (e.g. 8 for 1.70353809) or a `format`
 * function for full control, including locale grouping.
 *
 * Writes to textContent directly on each tick, so there is no React re-render
 * per frame. Under reduced motion it writes the final formatted value once and
 * exits.
 */
import { useEffect, useRef, type RefObject } from "react";

import { loadGsap, prefersReducedMotion } from "./gsap";

export type OdometerOptions = {
  /** Starting value. Default 0. */
  from?: number;
  /** Fixed decimal places. Ignored when `format` is supplied. Default 0. */
  decimals?: number;
  /** Full control over rendering, e.g. locale grouping or a unit suffix. */
  format?: (value: number) => string;
  /** Seconds. Default 1.4. */
  duration?: number;
  /** ScrollTrigger start. Default "top 88%". */
  start?: string;
};

export function useOdometer<T extends HTMLElement = HTMLElement>(
  value: number,
  options: OdometerOptions = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { from = 0, decimals = 0, format, duration = 1.4, start = "top 88%" } = options;
  const formatRef = useRef(format);
  formatRef.current = format;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!Number.isFinite(value)) return;

    const render = (n: number) => (formatRef.current ? formatRef.current(n) : n.toFixed(decimals));

    if (prefersReducedMotion()) {
      el.textContent = render(value);
      return;
    }

    el.textContent = render(from);

    let cancelled = false;
    let tween: gsap.core.Tween | null = null;

    loadGsap().then(({ gsap }) => {
      if (cancelled || !ref.current) return;
      const counter = { n: from };
      tween = gsap.to(counter, {
        n: value,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          if (ref.current) ref.current.textContent = render(counter.n);
        },
        // Land on the exact figure, never on an interpolated near-miss.
        onComplete: () => {
          if (ref.current) ref.current.textContent = render(value);
        },
        scrollTrigger: { trigger: el, start, once: true },
      });
    });

    return () => {
      cancelled = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [value, from, decimals, duration, start]);

  return ref;
}

/**
 * Drop-in element. Renders the final value in the server HTML, so the number
 * is correct and indexable before any JavaScript runs; the hook then replaces
 * it with the animated run on the client.
 */
export function Odometer({
  value,
  className,
  ...options
}: { value: number; className?: string } & OdometerOptions) {
  const ref = useOdometer<HTMLSpanElement>(value, options);
  const initial = options.format ? options.format(value) : value.toFixed(options.decimals ?? 0);
  return (
    <span ref={ref} className={className}>
      {initial}
    </span>
  );
}
