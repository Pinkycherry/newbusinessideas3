import { useCallback, useRef } from "react";

import { loadGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Spring hover/press feedback for pill-shaped buttons — subtle scale +
 * glow lift on hover, spring-back squash on press. One source of truth for
 * button motion (CSS no longer owns `transform` on .glass-btn/.glass-pill,
 * see styles.css) so hover and press never fight a competing transition.
 * gsap loads lazily on first interaction (see lib/motion.ts) so it never
 * sits in the initial page bundle.
 *
 * Usage: <button ref={usePillInteraction().ref}>...
 */
export function usePillInteraction<T extends HTMLElement = HTMLButtonElement>() {
  const elRef = useRef<T | null>(null);

  const setRef = useCallback((el: T | null) => {
    elRef.current = el;
  }, []);

  const onMouseEnter = useCallback(() => {
    const el = elRef.current;
    if (!el || prefersReducedMotion()) return;
    loadGsap().then((gsap) =>
      gsap.to(el, { scale: 1.045, y: -2, duration: 0.35, ease: "power3.out" }),
    );
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = elRef.current;
    if (!el || prefersReducedMotion()) return;
    loadGsap().then((gsap) =>
      gsap.to(el, { scale: 1, y: 0, duration: 0.4, ease: "elastic.out(1, 0.55)" }),
    );
  }, []);

  const onPointerDown = useCallback(() => {
    const el = elRef.current;
    if (!el || prefersReducedMotion()) return;
    loadGsap().then((gsap) => gsap.to(el, { scale: 0.96, duration: 0.15, ease: "power2.out" }));
  }, []);

  const onPointerUp = useCallback(() => {
    const el = elRef.current;
    if (!el || prefersReducedMotion()) return;
    loadGsap().then((gsap) =>
      gsap.to(el, { scale: 1.045, duration: 0.5, ease: "elastic.out(1, 0.45)" }),
    );
  }, []);

  return { ref: setRef, onMouseEnter, onMouseLeave, onPointerDown, onPointerUp };
}
