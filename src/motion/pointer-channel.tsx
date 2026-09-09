/**
 * Pointer channel — the root of the whole motion system.
 *
 * Publishes, on one shared requestAnimationFrame loop, four CSS custom
 * properties on :root:
 *
 *   --ptr-x    cursor X, normalized 0 -> 1 across the viewport
 *   --ptr-y    cursor Y, normalized 0 -> 1 across the viewport
 *   --ptr-v    cursor speed, normalized 0 -> 1 (smoothed)
 *   --scroll-v scroll speed, normalized 0 -> 1 (smoothed, direction-agnostic)
 *
 * Values are written straight to the DOM via style.setProperty, never through
 * React state, so this component renders exactly once and causes zero
 * re-renders for the rest of the session. Anything on the page can then react
 * to the cursor in pure CSS with no per-component JavaScript.
 *
 * Disables itself (and stops its rAF loop) when the pointer is coarse (touch)
 * or the visitor prefers reduced motion. In that state the variables are left
 * at their neutral resting values so dependent CSS still resolves.
 */
import { useEffect, type ReactNode } from "react";

import { hasFinePointer, prefersReducedMotion } from "./gsap";

/** Peak speeds used to normalize velocity into 0 -> 1. */
const PTR_V_MAX = 1800; // px per second
const SCROLL_V_MAX = 2400; // px per second
/** Exponential smoothing factor per frame for both velocity channels. */
const SMOOTH = 0.12;

export type PointerChannelOptions = {
  /** Multiplier applied to the published cursor velocity. Default 1. */
  pointerVelocityScale?: number;
  /** Multiplier applied to the published scroll velocity. Default 1. */
  scrollVelocityScale?: number;
};

function setNeutral(root: HTMLElement) {
  root.style.setProperty("--ptr-x", "0.5");
  root.style.setProperty("--ptr-y", "0.5");
  root.style.setProperty("--ptr-v", "0");
  root.style.setProperty("--scroll-v", "0");
}

/**
 * Starts the channel imperatively. Returns a teardown function.
 * Exposed separately from the provider so non-React entry points (or a test)
 * can drive it too.
 */
export function startPointerChannel(options: PointerChannelOptions = {}): () => void {
  if (typeof window === "undefined") return () => {};
  const root = document.documentElement;
  setNeutral(root);

  // Reduced motion opts out of everything — nothing is published, the neutral
  // values above stand, and no listeners are attached.
  if (prefersReducedMotion()) return () => {};

  // Touch devices have no cursor, so --ptr-x/y/v stay at their neutral values
  // and the pointermove listener is never attached. Scroll velocity is just as
  // meaningful on a phone as on a desktop, so --scroll-v keeps running.
  const pointerEnabled = hasFinePointer();

  const pScale = options.pointerVelocityScale ?? 1;
  const sScale = options.scrollVelocityScale ?? 1;

  let targetX = 0.5;
  let targetY = 0.5;
  let lastClientX = window.innerWidth / 2;
  let lastClientY = window.innerHeight / 2;
  let rawPtrV = 0;
  let ptrV = 0;
  let rawScrollV = 0;
  let scrollV = 0;
  let lastScrollY = window.scrollY;
  let lastT = performance.now();
  let raf = 0;
  let moved = false;
  let scrolled = false;

  const onPointerMove = (e: PointerEvent) => {
    targetX = e.clientX / window.innerWidth;
    targetY = e.clientY / window.innerHeight;
    const dx = e.clientX - lastClientX;
    const dy = e.clientY - lastClientY;
    lastClientX = e.clientX;
    lastClientY = e.clientY;
    rawPtrV = Math.hypot(dx, dy);
    moved = true;
  };

  const onScroll = () => {
    scrolled = true;
  };

  const frame = (now: number) => {
    const dt = Math.max((now - lastT) / 1000, 1 / 240);
    lastT = now;

    if (pointerEnabled) {
      // Pointer position: written every frame, cheap and exact.
      root.style.setProperty("--ptr-x", targetX.toFixed(4));
      root.style.setProperty("--ptr-y", targetY.toFixed(4));

      // Pointer velocity, px/s -> 0..1, exponentially smoothed then decayed.
      const ptrTarget = moved ? Math.min((rawPtrV / dt / PTR_V_MAX) * pScale, 1) : 0;
      ptrV += (ptrTarget - ptrV) * SMOOTH;
      if (ptrV < 0.001) ptrV = 0;
      root.style.setProperty("--ptr-v", ptrV.toFixed(4));
      rawPtrV = 0;
      moved = false;
    }

    // Scroll velocity, direction-agnostic, same normalization.
    if (scrolled) {
      const y = window.scrollY;
      rawScrollV = Math.abs(y - lastScrollY);
      lastScrollY = y;
      scrolled = false;
    } else {
      rawScrollV = 0;
    }
    const scrollTarget = Math.min((rawScrollV / dt / SCROLL_V_MAX) * sScale, 1);
    scrollV += (scrollTarget - scrollV) * SMOOTH;
    if (scrollV < 0.001) scrollV = 0;
    root.style.setProperty("--scroll-v", scrollV.toFixed(4));

    raf = requestAnimationFrame(frame);
  };

  if (pointerEnabled) window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    if (pointerEnabled) window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("scroll", onScroll);
    setNeutral(root);
  };
}

/**
 * Mount once, as high in the tree as possible (root route layout). Renders its
 * children untouched and adds no DOM of its own.
 */
export function PointerChannelProvider({
  children,
  ...options
}: PointerChannelOptions & { children?: ReactNode }) {
  const { pointerVelocityScale, scrollVelocityScale } = options;
  useEffect(
    () =>
      // Built conditionally rather than spread wholesale: the repo runs
      // `exactOptionalPropertyTypes`, so an explicit `undefined` is not the
      // same as an absent optional property.
      startPointerChannel({
        ...(pointerVelocityScale === undefined ? {} : { pointerVelocityScale }),
        ...(scrollVelocityScale === undefined ? {} : { scrollVelocityScale }),
      }),
    [pointerVelocityScale, scrollVelocityScale],
  );
  return <>{children}</>;
}
