import { useEffect, useRef } from "react";

import { prefersReducedMotion, pointerMotionEnabled, suspendPointerChannel } from "@/motion";

/**
 * The cinema trial's only motion controller. One effect, three jobs:
 *
 * 1. Page scope. Flags <html> so the portal-rendered and root-level rules
 *    (smooth anchor scrolling, the body backdrop) apply only while a trial
 *    page is mounted, and removes the flags when the reader leaves. It also
 *    suspends the root pointer channel, which otherwise restyles the whole
 *    document on every pointer frame.
 *
 * 2. Reveals. Server markup is final and visible. After hydration, blocks
 *    still BELOW the fold are armed (hidden) and one IntersectionObserver
 *    reveals each exactly once, then stops watching it. Anything already on
 *    screen is never hidden, so nothing blinks, and with JavaScript off or
 *    reduced motion requested nothing is ever hidden at all. CSS owns every
 *    transition, so each element has a single owner for its transform.
 *
 * 3. Hero depth. One pointer listener on the hero, fine pointers only,
 *    coalesced to one write per frame, moving only the decorative
 *    `[data-depth]` layer. The reading surface never moves.
 *
 * There is no scroll listener: the reading rail and the mission rail are CSS
 * scroll timelines, which run off the main thread where supported and sit in
 * their finished state where not.
 */
export function useCinemaStage<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const html = document.documentElement;
    html.dataset["cm"] = "idea";
    const releaseChannel = suspendPointerChannel();
    const reduced = prefersReducedMotion();
    const cleanups: Array<() => void> = [];

    if (!reduced && typeof IntersectionObserver !== "undefined") {
      const fold = window.innerHeight * 0.92;
      // The shell's resource hub sits outside this component's subtree, so the
      // scope is the whole trial page, not just the article.
      const scope = root.closest<HTMLElement>(".cm-page") ?? root;
      const blocks = Array.from(scope.querySelectorAll<HTMLElement>("[data-reveal]"));
      const armed = blocks.filter((el) => el.getBoundingClientRect().top > fold);
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            el.classList.remove("is-armed");
            el.classList.add("is-in");
            io.unobserve(el);
          }
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
      );
      for (const el of armed) {
        el.classList.add("is-armed");
        io.observe(el);
      }
      cleanups.push(() => {
        io.disconnect();
        for (const el of armed) el.classList.remove("is-armed", "is-in");
      });
    }

    const hero = root.querySelector<HTMLElement>("[data-depth-scene]");
    const layer = hero?.querySelector<HTMLElement>("[data-depth]");
    if (hero && layer && !reduced && pointerMotionEnabled()) {
      let raf = 0;
      let nx = 0;
      let ny = 0;
      const write = () => {
        raf = 0;
        // At most 2.5deg of tilt and 5px of travel.
        layer.style.transform = `translate3d(${(nx * 5).toFixed(2)}px, ${(ny * 5).toFixed(2)}px, 0) rotateX(${(-ny * 2.5).toFixed(2)}deg) rotateY(${(nx * 2.5).toFixed(2)}deg)`;
      };
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const r = hero.getBoundingClientRect();
        nx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
        ny = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
        if (!raf) raf = requestAnimationFrame(write);
      };
      const onLeave = () => {
        nx = 0;
        ny = 0;
        if (!raf) raf = requestAnimationFrame(write);
      };
      hero.addEventListener("pointermove", onMove, { passive: true });
      hero.addEventListener("pointerleave", onLeave, { passive: true });
      cleanups.push(() => {
        cancelAnimationFrame(raf);
        hero.removeEventListener("pointermove", onMove);
        hero.removeEventListener("pointerleave", onLeave);
        layer.style.removeProperty("transform");
      });
    }

    return () => {
      for (const fn of cleanups) fn();
      releaseChannel();
      delete html.dataset["cm"];
    };
  }, []);

  return ref;
}
