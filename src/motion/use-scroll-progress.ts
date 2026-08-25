/**
 * Scroll-progress primitive.
 *
 * Publishes `--sc-p` (0 -> 1) on a section as it travels through the viewport,
 * driven by ScrollTrigger with `scrub` — a continuous playhead, not a one-shot
 * entry trigger. Everything downstream can then read the progress in CSS via
 * calc(), so a section can be choreographed without a single React render.
 *
 * Modes:
 *  - "unpinned" (default): 0 when the section's top reaches the bottom of the
 *    viewport, 1 when its bottom leaves the top. Nothing is pinned, the page
 *    keeps its natural length.
 *  - "pinned": the section holds the viewport for `spanVh` screen-heights and
 *    scroll becomes the playhead. Minimum useful span is 1.2 — below that the
 *    progress jumps between scroll notches and every cue snaps instead of
 *    running, so the value is clamped.
 *
 * Under reduced motion nothing is pinned and `--sc-p` is parked at a settled
 * value (default 1), so any calc()-driven layout resolves to its end state and
 * the content simply reads top to bottom.
 */
import { useEffect, useRef, type RefObject } from "react";

import { loadGsap, prefersReducedMotion } from "./gsap";

export type ScrollProgressOptions = {
  mode?: "pinned" | "unpinned";
  /** Pinned mode only: how many viewport-heights the section holds. Min 1.2. */
  spanVh?: number;
  /** Scrub smoothing in seconds, or true for hard-linked. Default 0.6. */
  scrub?: number | boolean;
  /** Value parked on the element under reduced motion. Default 1. */
  reducedValue?: number;
  /** Optional per-frame callback. Prefer CSS; use this only for canvas/WebGL. */
  onProgress?: (p: number) => void;
};

export function useScrollProgress<T extends HTMLElement = HTMLElement>(
  options: ScrollProgressOptions = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { mode = "unpinned", spanVh = 2, scrub = 0.6, reducedValue = 1, onProgress } = options;
  const cbRef = useRef(onProgress);
  cbRef.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.style.setProperty("--sc-p", String(reducedValue));
      return;
    }

    el.style.setProperty("--sc-p", "0");
    let cancelled = false;
    let trigger: { kill: (revert?: boolean) => void } | undefined;

    loadGsap().then(({ ScrollTrigger }) => {
      if (cancelled || !ref.current) return;
      const pinned = mode === "pinned";
      trigger = ScrollTrigger.create({
        trigger: el,
        start: pinned ? "top top" : "top bottom",
        end: pinned ? `+=${Math.max(spanVh, 1.2) * 100}%` : "bottom top",
        pin: pinned,
        pinSpacing: pinned,
        anticipatePin: pinned ? 1 : 0,
        scrub,
        onUpdate: (self) => {
          el.style.setProperty("--sc-p", self.progress.toFixed(4));
          cbRef.current?.(self.progress);
        },
      });
    });

    return () => {
      cancelled = true;
      trigger?.kill();
      el.style.removeProperty("--sc-p");
    };
  }, [mode, spanVh, scrub, reducedValue]);

  return ref;
}

/**
 * Page-level scroll progress: publishes `--page-p` (0 -> 1) on :root for the
 * whole document. Useful for a reading-progress bar without a scroll listener
 * of its own.
 */
export function usePageScrollProgress() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    if (prefersReducedMotion()) {
      root.style.setProperty("--page-p", "0");
      return;
    }
    let raf = 0;
    let queued = false;
    const write = () => {
      raf = 0;
      queued = false;
      const max = root.scrollHeight - window.innerHeight;
      root.style.setProperty("--page-p", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(write);
    };
    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.style.removeProperty("--page-p");
    };
  }, []);
}
