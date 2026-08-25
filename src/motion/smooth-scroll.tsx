import { useEffect } from "react";

import { loadGsap, prefersReducedMotion, hasFinePointer } from "./gsap";

/**
 * Inertial smooth scrolling.
 *
 * This is the single biggest difference in *feel* between this site and the
 * reference sites it is being measured against, and until now there was none
 * of it: no smooth-scroll library, and not even a `scroll-behavior` rule
 * anywhere in the codebase. Scrolling landed instantly on the exact pixel the
 * wheel asked for, which is why the page reads as a document rather than as a
 * designed surface.
 *
 * Three details matter more than the library choice:
 *
 * 1. **One ticker, not two.** Lenis runs with `autoRaf: false` and is driven
 *    from GSAP's own ticker instead of its own `requestAnimationFrame`. Two
 *    independent rAF loops resolve in an undefined order, which shows up as a
 *    one-frame lag between the scroll position and every ScrollTrigger-driven
 *    animation on the page — pinned sections visibly trailing the scroll.
 *
 * 2. **ScrollTrigger has to be told.** It reads `window.scrollY`, which Lenis
 *    is now animating, so `ScrollTrigger.update` is subscribed to Lenis's
 *    scroll event. Without this every trigger fires at the wrong position.
 *
 * 3. **It turns itself off where it is wrong.** Reduced motion disables it
 *    entirely. So does touch: mobile browsers hand scrolling to the compositor
 *    and hide the URL bar during it, and a JS scroll hijack gives up both — it
 *    feels worse on a phone, not better, and this site has had real
 *    low-end-device performance complaints already.
 *
 * Renders nothing.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    // Native momentum scrolling on touch is better than anything we can
    // simulate, and cheaper. Desktop pointers are the case worth improving.
    if (!hasFinePointer()) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([
        import("lenis"),
        loadGsap(),
      ]);
      if (cancelled) return;

      const lenis = new Lenis({
        // Time to settle. Long enough to read as weight, short enough that the
        // page still goes where it was asked.
        duration: 1.05,
        // Exponential ease-out: fast off the wheel, long slow settle.
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        // Anything less than 1 makes the wheel feel like it is fighting you.
        wheelMultiplier: 1,
        // Never hijack touch, even if this somehow runs on a hybrid device.
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
      });

      const onScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onScroll);

      // GSAP's ticker drives Lenis, so there is exactly one rAF loop on the
      // page and the order within a frame is defined. GSAP's `time` is in
      // seconds; Lenis wants milliseconds.
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      // GSAP smooths its own delta by default, which fights an easing curve
      // that is already smoothing.
      gsap.ticker.lagSmoothing(0);

      // Anchor links and the back-to-top control still have to work.
      const onAnchorClick = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]');
        const href = anchor?.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -96 });
      };
      document.addEventListener("click", onAnchorClick);

      cleanup = () => {
        document.removeEventListener("click", onAnchorClick);
        lenis.off("scroll", onScroll);
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
