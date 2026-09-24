/**
 * The plain site system's stagger reveal (2026-09-24 rollout), used by
 * useStaggerReveal on every page but the homepage.
 *
 *  - Once only. Nothing re-hides or replays when the reader scrolls back up.
 *  - Only children that start below the fold are hidden, so the first view
 *    never flashes empty.
 *  - One IntersectionObserver per container and a composited Web Animation
 *    per child (opacity + transform only). No GSAP, no scroll listener.
 *  - Under reduced motion nothing is hidden and nothing moves.
 *
 * Returns the effect cleanup.
 */
import { prefersReducedMotion } from "./gsap";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET: Record<Direction, (d: number) => string> = {
  up: (d) => `translate3d(0, ${d}px, 0)`,
  down: (d) => `translate3d(0, ${-d}px, 0)`,
  left: (d) => `translate3d(${d}px, 0, 0)`,
  right: (d) => `translate3d(${-d}px, 0, 0)`,
  none: () => "none",
};

export function calmStaggerReveal(
  el: HTMLElement,
  {
    selector,
    distance = 10,
    direction = "up",
    stagger = 0.05,
  }: { selector?: string | undefined; distance?: number; direction?: Direction; stagger?: number },
): (() => void) | undefined {
  if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") return undefined;

  const all = selector
    ? Array.from(el.querySelectorAll<HTMLElement>(selector))
    : (Array.from(el.children) as HTMLElement[]);
  const fold = window.innerHeight;
  const items = all.filter((i) => i.getBoundingClientRect().top > fold);
  if (items.length === 0) return undefined;

  const from = OFFSET[direction](Math.min(distance, 12));
  const step = Math.min(stagger, 0.06) * 1000;
  items.forEach((i) => (i.style.opacity = "0"));

  const io = new IntersectionObserver(
    (entries) => {
      let n = 0;
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const i = e.target as HTMLElement;
        io.unobserve(i);
        i.style.removeProperty("opacity");
        i.animate(
          [
            { opacity: 0, transform: from },
            { opacity: 1, transform: "none" },
          ],
          {
            duration: 360,
            delay: Math.min(n++ * step, 240),
            easing: "cubic-bezier(.2,.7,.2,1)",
            fill: "backwards",
          },
        );
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  items.forEach((i) => io.observe(i));

  return () => {
    io.disconnect();
    items.forEach((i) => i.style.removeProperty("opacity"));
  };
}
