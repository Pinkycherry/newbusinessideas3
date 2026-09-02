/**
 * Public surface of the motion system.
 *
 * Every primitive here retrofits onto markup that already exists — none of
 * them require a wrapper element or a particular DOM shape. They publish CSS
 * custom properties and let `motion.css` (or a page's own CSS) decide what
 * those values mean visually, so the same hook can drive a card lift on one
 * page and a parallax on another without changing the hook.
 *
 * Variables published, for reference when writing CSS against them:
 *
 *   :root   --ptr-x --ptr-y   cursor position, 0..1 across the viewport
 *           --ptr-v           cursor speed, 0..1, smoothed
 *           --scroll-v        scroll speed, 0..1, smoothed, runs on touch too
 *           --page-p          whole-document scroll progress, 0..1
 *           --route-pending   1 while the router is navigating, else 0
 *
 *   element --el-ptr-x --el-ptr-y   cursor position relative to the element, -1..1
 *           --el-ptr-d              distance from its centre, 0 at centre, 1 at corner
 *           --el-ptr-in             1 while the cursor is inside it, else 0
 *           --sc-p                  the element's own scroll progress, 0..1
 */

export { loadGsap, prefersReducedMotion, hasFinePointer, pointerMotionEnabled } from "./gsap";
export type { GsapBundle } from "./gsap";

export { PointerChannelProvider, startPointerChannel } from "./pointer-channel";
export type { PointerChannelOptions } from "./pointer-channel";

export { PageTransition } from "./page-transition";

export { useElementPointer, useElementPointerGroup } from "./use-element-pointer";
export type { ElementPointerOptions } from "./use-element-pointer";

export { useScrollProgress, usePageScrollProgress } from "./use-scroll-progress";
export type { ScrollProgressOptions } from "./use-scroll-progress";

export { useStaggerReveal } from "./use-stagger-reveal";
export type { StaggerRevealOptions, StaggerRevealDirection } from "./use-stagger-reveal";

export { useTextReveal } from "./use-text-reveal";
export type { TextRevealOptions } from "./use-text-reveal";

export { useOdometer, Odometer } from "./use-odometer";
export type { OdometerOptions } from "./use-odometer";

export { useMagnet } from "./use-magnet";
export type { MagnetOptions } from "./use-magnet";

export { useTilt } from "./use-tilt";
export type { TiltOptions } from "./use-tilt";

export { useWipe } from "./use-wipe";
export type { WipeOptions, WipeDirection } from "./use-wipe";
