/**
 * The shared engine.
 *
 * Every cinematic primitive in this folder runs on exactly three shared
 * resources, created lazily and torn down when the last subscriber leaves:
 *
 *   1. one requestAnimationFrame loop
 *   2. one IntersectionObserver
 *   3. one passive scroll/resize listener
 *
 * This is the difference between a homepage that holds 60fps with hundreds
 * of animated elements and one that does not. A per-card rAF or a per-card
 * observer is the single most common reason a scroll-driven site drops
 * frames on a mid-range Android, and the cost is invisible at 14 cards and
 * fatal at 10,000.
 *
 * Nothing here reads or writes layout-triggering properties. Callbacks are
 * expected to write transforms, opacity or CSS custom properties only.
 */

type FrameCallback = (dt: number, now: number) => void;

const frameSubs = new Set<FrameCallback>();
let rafId = 0;
let lastTime = 0;

function tick(now: number) {
  const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016;
  lastTime = now;
  for (const cb of frameSubs) cb(dt, now);
  rafId = frameSubs.size ? requestAnimationFrame(tick) : 0;
}

/** Subscribe to the one shared rAF. Returns an unsubscribe function. */
export function onFrame(cb: FrameCallback): () => void {
  frameSubs.add(cb);
  if (!rafId && typeof requestAnimationFrame === "function") {
    lastTime = 0;
    rafId = requestAnimationFrame(tick);
  }
  return () => {
    frameSubs.delete(cb);
    if (!frameSubs.size && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };
}

type VisibilityCallback = (visible: boolean, entry: IntersectionObserverEntry) => void;

const visSubs = new Map<Element, VisibilityCallback>();
let visObserver: IntersectionObserver | null = null;

/**
 * Shared visibility gate. Scroll-driven work must be skipped entirely while
 * an element is off screen — with 10,000 rows in the library that is the
 * overwhelming majority of them at any moment.
 */
export function onVisible(el: Element, cb: VisibilityCallback): () => void {
  if (typeof IntersectionObserver === "undefined") {
    cb(true, undefined as unknown as IntersectionObserverEntry);
    return () => {};
  }
  if (!visObserver) {
    visObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const sub = visSubs.get(entry.target);
          if (sub) sub(entry.isIntersecting, entry);
        }
      },
      { rootMargin: "15% 0px 15% 0px", threshold: 0 },
    );
  }
  visSubs.set(el, cb);
  visObserver.observe(el);
  return () => {
    visSubs.delete(el);
    visObserver?.unobserve(el);
    if (!visSubs.size) {
      visObserver?.disconnect();
      visObserver = null;
    }
  };
}

type ScrollCallback = () => void;

const scrollSubs = new Set<ScrollCallback>();
let scrollBound = false;
let scrollQueued = false;

function flushScroll() {
  scrollQueued = false;
  for (const cb of scrollSubs) cb();
}

function onScrollEvent() {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(flushScroll);
}

/** Subscribe to one passive scroll + resize listener, coalesced to a frame. */
export function onScroll(cb: ScrollCallback): () => void {
  scrollSubs.add(cb);
  if (!scrollBound && typeof window !== "undefined") {
    window.addEventListener("scroll", onScrollEvent, { passive: true });
    window.addEventListener("resize", onScrollEvent, { passive: true });
    scrollBound = true;
  }
  cb();
  return () => {
    scrollSubs.delete(cb);
    if (!scrollSubs.size && scrollBound) {
      window.removeEventListener("scroll", onScrollEvent);
      window.removeEventListener("resize", onScrollEvent);
      scrollBound = false;
    }
  };
}

/** Critically-damped-ish approach, frame-rate independent. */
export function approach(current: number, target: number, dt: number, halfLife = 0.09): number {
  const t = 1 - Math.pow(2, -dt / halfLife);
  return current + (target - current) * t;
}

export function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}
