/**
 * Single lazy GSAP entry point for the motion system.
 *
 * gsap, ScrollTrigger and SplitText are imported dynamically so they land in
 * their own chunk instead of the initial route bundle. Every primitive calls
 * `loadGsap()` inside an effect (never during render) and bails out entirely
 * when the visitor prefers reduced motion, so reduced-motion users never even
 * pay for the download.
 */
import type { gsap as GsapType } from "gsap";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True only for a real, hoverable, fine pointer. Touch never qualifies. */
export function hasFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Pointer-driven motion is allowed only with a fine pointer and no RM request. */
export function pointerMotionEnabled(): boolean {
  return hasFinePointer() && !prefersReducedMotion();
}

export type GsapBundle = {
  gsap: typeof GsapType;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  SplitText: typeof import("gsap/SplitText").SplitText;
};

let bundlePromise: Promise<GsapBundle> | null = null;

export async function loadGsap(): Promise<GsapBundle> {
  if (!bundlePromise) {
    bundlePromise = (async () => {
      const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
      ]);
      gsap.registerPlugin(ScrollTrigger, SplitText);
      return { gsap, ScrollTrigger, SplitText };
    })();
  }
  return bundlePromise;
}
