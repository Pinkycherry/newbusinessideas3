/**
 * Shared GSAP entry point for the animation layer.
 *
 * gsap (plus ScrollTrigger) is dynamically imported here, not statically —
 * so it lands in its own chunk instead of the initial route bundle. Every
 * component that wants motion calls `loadGsap()` inside a `useEffect`
 * (never during render) and skips entirely when `prefersReducedMotion()` is
 * true, so a reduced-motion visitor never even pays for the download.
 */
import type { gsap as GsapType } from "gsap";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

let gsapPromise: Promise<typeof GsapType> | null = null;
let scrollTriggerRegistered = false;

/** Lazily imports gsap (and, on request, ScrollTrigger) into its own chunk. */
export async function loadGsap(withScrollTrigger = false): Promise<typeof GsapType> {
  if (!gsapPromise) {
    gsapPromise = import("gsap").then((m) => m.gsap);
  }
  const gsap = await gsapPromise;
  if (withScrollTrigger && !scrollTriggerRegistered) {
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);
    scrollTriggerRegistered = true;
  }
  return gsap;
}
