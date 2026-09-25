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

import { prefersReducedMotion } from "./gsap";
import { isLegacyMotionPage } from "./legacy-page";

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
    // Plain site system: figures print at their real value and stay there;
    // the count-up runs on the homepage only.
    if (!isLegacyMotionPage()) return;
    const el = ref.current;
    if (!el) return;
    if (!Number.isFinite(value)) return;

    const render = (n: number) => (formatRef.current ? formatRef.current(n) : n.toFixed(decimals));

    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      el.textContent = render(value);
      return;
    }

    // Fail OPEN: paint the REAL figure first. The count-up is an
    // enhancement, and if its ScrollTrigger never fires — which is exactly
    // what was happening, leaving the page reading "0+ researched blueprints"
    // — the reader still sees the true number rather than a zero.
    el.textContent = render(value);

    let raf = 0;
    let started = false;
    let startedAt = 0;
    const milliseconds = Math.max(0, duration * 1000);
    const finish = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      el.textContent = render(value);
    };
    const frame = (now: number) => {
      if (document.hidden) {
        finish();
        return;
      }
      if (!startedAt) startedAt = now;
      const progress = milliseconds ? Math.min(1, (now - startedAt) / milliseconds) : 1;
      el.textContent = render(from + (value - from) * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) raf = requestAnimationFrame(frame);
      else finish();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((entry) => entry.isIntersecting)) return;
        started = true;
        observer.disconnect();
        raf = requestAnimationFrame(frame);
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
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
