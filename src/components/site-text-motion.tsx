import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Sitewide entry reveal.
 *
 * Adds and removes `.revealed` as elements cross the viewport. Three things
 * were wrong with the previous version, and all three were visible:
 *
 *  1. It called `io.unobserve()` on first entry, so every reveal fired
 *     exactly once for the life of the page. Scrolling back up and down again
 *     showed nothing. Elements are now toggled in BOTH directions and stay
 *     observed, so the motion is there on every pass.
 *  2. It only ever saw the elements that existed at the moment the effect
 *     ran. Cards come from React Query and arrive later, so on most pages the
 *     card grid was never observed at all -- which is why cards were static
 *     everywhere while headings animated. A MutationObserver now picks up
 *     anything added afterwards.
 *  3. The hidden state was unconditional CSS. If hydration failed or the
 *     bundle never arrived, every heading on the site stayed at `opacity: 0`
 *     permanently. The hidden state is now gated behind `html.bbi-motion`,
 *     which only this component sets -- so no JS means everything is simply
 *     visible, which is the correct failure mode.
 *
 * It does NOT touch DOM structure. An earlier version split headings into
 * per-word spans in an effect, which raced React's lazy route hydration and
 * got the whole tree regenerated. Word-level waves are rendered by React in
 * `<WaveText>`; this only flips a class, which React neither owns nor diffs.
 */
const SEL = "h1, h2, h3, [data-wave], [data-reveal]";

export function SiteTextMotion() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const status = useRouterState({ select: (s) => s.status });

  useEffect(() => {
    if (status !== "idle") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.classList.add("bbi-motion");

    const seen = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // A section taller than the viewport can never reach a 15% ratio,
          // so it would never reveal at all. Anything that tall counts as
          // revealed the moment it intersects.
          const tall = e.boundingClientRect.height > window.innerHeight * 0.8;
          const on = e.isIntersecting && (tall || e.intersectionRatio >= 0.15);
          e.target.classList.toggle("revealed", on);
        }
      },
      { threshold: [0, 0.15], rootMargin: "0px 0px -5% 0px" },
    );

    const scan = () => {
      document.querySelectorAll(SEL).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };
    scan();

    // Cards arrive from React Query after this effect has already run. Batch
    // rescans into one animation frame so a burst of inserts costs one pass.
    let pending = 0;
    const mo = new MutationObserver(() => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (pending) cancelAnimationFrame(pending);
      mo.disconnect();
      io.disconnect();
      root.classList.remove("bbi-motion");
    };
  }, [pathname, status]);

  return null;
}
