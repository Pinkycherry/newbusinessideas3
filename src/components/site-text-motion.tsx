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
 *
 *  4. The 1800ms fallback that forces `.revealed` on was a one-shot timer:
 *     once it fired for an element, that element left the fallback system
 *     for good. On /idea/$slug a SECOND, later hydration race (this route's
 *     code-split chunk can hydrate well after this component's initial scan
 *     — confirmed live, independent of the ShareLinks mismatch fixed
 *     alongside this) was still wiping `.revealed` off elements whose
 *     fallback timer had already fired and been discarded, so nothing was
 *     left to bring them back.
 *
 *     `.revealed` is now self-healing: this component records what it last
 *     WANTED each element's class to be (`desired`), updated every time the
 *     observer or the fallback timer legitimately flips it, in either
 *     direction — scrolling something out of view is still a real, wanted
 *     removal, not damage). An `attributes` MutationObserver watches every
 *     element this component has ever touched, and only when the DOM's
 *     actual state stops matching what was last wanted does it get restored,
 *     on the same animation frame. That distinction is what keeps the
 *     two-way replay from point 1 intact while still catching a foreign
 *     re-render clobbering the class — now, or five hydration races from now.
 */
const SEL = "h1, h2, h3, [data-wave], [data-reveal]";

export function SiteTextMotion() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const status = useRouterState({ select: (s) => s.status });

  useEffect(() => {
    if (status !== "idle") return;
    // The homepage runs the void's own motion grammar and owns every reveal on
    // it. Letting the sitewide wave also grab its h1/h2/h3 is what put two
    // entrance animations on the same headings.
    if (pathname === "/") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.classList.add("bbi-motion");

    const seen = new WeakSet<Element>();
    const fallbackTimers = new Set<ReturnType<typeof setTimeout>>();
    // What this component last WANTED each tracked element's `.revealed`
    // state to be. Updated every time the observer or the fallback timer
    // legitimately changes the class, in either direction. The self-heal
    // watcher below only acts when the DOM disagrees with this.
    const desired = new WeakMap<Element, boolean>();
    let healPending = 0;
    const healQueue = new Set<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // A section taller than the viewport can never reach a 15% ratio,
          // so it would never reveal at all. Anything that tall counts as
          // revealed the moment it intersects.
          const tall = e.boundingClientRect.height > window.innerHeight * 0.8;
          const on = e.isIntersecting && (tall || e.intersectionRatio >= 0.15);
          desired.set(e.target, on);
          e.target.classList.toggle("revealed", on);
        }
      },
      { threshold: [0, 0.15], rootMargin: "0px 0px -5% 0px" },
    );

    // Belt and braces: `.revealed` is a raw classList mutation, outside
    // React's own model of the DOM. If anything downstream ever re-renders
    // one of these elements before the observer has fired again — a
    // hydration mismatch elsewhere on the page forcing React to reconcile
    // the subtree is the one that actually happened, confirmed live on
    // /idea/$slug — React writes its own JSX-computed className back over
    // the DOM's, silently erasing `.revealed`. Give the real observer a fair
    // window, then force it — and once forced, record it as wanted so the
    // self-heal watcher below covers it too.
    const scan = () => {
      document.querySelectorAll(SEL).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
        const t = setTimeout(() => {
          fallbackTimers.delete(t);
          if (desired.get(el) === undefined) {
            desired.set(el, true);
            el.classList.add("revealed");
          }
        }, 1800);
        fallbackTimers.add(t);
      });
    };
    scan();

    // Cards arrive from React Query after this effect has already run. Batch
    // rescans into one animation frame so a burst of inserts costs one pass.
    // The same observer also watches `class` on every element this component
    // tracks — see point 4 above for why a re-render can strip `.revealed`
    // well after the fallback window has already closed.
    let pending = 0;
    const mo = new MutationObserver((mutations) => {
      let structural = false;
      for (const m of mutations) {
        if (m.type === "attributes") {
          const target = m.target;
          if (target instanceof Element) {
            const want = desired.get(target);
            if (want !== undefined && want !== target.classList.contains("revealed")) {
              healQueue.add(target);
            }
          }
          continue;
        }
        structural = true;
      }
      if (healQueue.size && !healPending) {
        healPending = requestAnimationFrame(() => {
          healPending = 0;
          healQueue.forEach((el) => {
            const want = desired.get(el);
            if (want !== undefined) el.classList.toggle("revealed", want);
          });
          healQueue.clear();
        });
      }
      if (!structural) return;
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        scan();
      });
    });
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      if (pending) cancelAnimationFrame(pending);
      if (healPending) cancelAnimationFrame(healPending);
      fallbackTimers.forEach((t) => clearTimeout(t));
      fallbackTimers.clear();
      healQueue.clear();
      mo.disconnect();
      io.disconnect();
      root.classList.remove("bbi-motion");
    };
  }, [pathname, status]);

  return null;
}
