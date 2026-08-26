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

/** 3D card rotate + scale hover animation (tactical feedback) */
export async function create3DCardAnimation(
  element: HTMLElement | null,
  options?: { duration?: number; rotation?: number; scale?: number },
) {
  if (!element || prefersReducedMotion()) return;
  const gsap = await loadGsap();
  const { duration = 0.3, rotation = 8, scale = 1.02 } = options || {};

  element.addEventListener("mouseenter", () => {
    gsap.to(element, {
      rotationY: rotation,
      rotationX: -rotation / 2,
      scale,
      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
      duration,
      ease: "power2.out",
      overwrite: "auto",
    });
  });

  element.addEventListener("mouseleave", () => {
    gsap.to(element, {
      rotationY: 0,
      rotationX: 0,
      scale: 1,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      duration,
      ease: "power2.out",
      overwrite: "auto",
    });
  });
}

/** Parallax scroll effect (cinematic depth) */
export async function createParallaxScroll(
  element: HTMLElement | null,
  options?: { multiplier?: number; triggerElement?: HTMLElement },
) {
  if (!element || prefersReducedMotion()) return;
  const gsap = await loadGsap(true);
  const { multiplier = 0.5, triggerElement } = options || {};

  const trigger = triggerElement || element.parentElement;
  if (!trigger) return;

  gsap.to(element, {
    scrollTrigger: {
      trigger,
      start: "top center",
      end: "bottom center",
      scrub: 0.6,
      onUpdate: (self: { getVelocity: () => number }) => {
        const progress = self.getVelocity() / -300;
        gsap.to(element, {
          y: progress * 100 * multiplier,
          overwrite: "auto",
        });
      },
    },
  });
}

/** Hero stagger reveal (cinematic entry) */
export async function createHeroStagger(
  elements: HTMLElement[],
  options?: { staggerDelay?: number; duration?: number },
) {
  if (!elements.length || prefersReducedMotion()) return;
  const gsap = await loadGsap();
  const { staggerDelay = 0.15, duration = 0.8 } = options || {};

  elements.forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration,
      ease: "power3.out",
      delay: elements.indexOf(el) * staggerDelay,
    });
  });
}

/** Morphing page transition (fluid navigation) */
export async function createPageTransition(
  triggerElement: HTMLElement | null,
  onComplete?: () => void,
) {
  if (!triggerElement || prefersReducedMotion()) return;
  const gsap = await loadGsap();

  const tl = gsap.timeline();
  tl.to(triggerElement, {
    opacity: 0,
    y: 20,
    duration: 0.4,
    ease: "power2.in",
  }).call(() => {
    if (onComplete) onComplete();
  });

  return tl;
}
