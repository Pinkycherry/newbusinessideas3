import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

import { prefersReducedMotion, suspendPointerChannel } from "@/motion";

/**
 * The plain site system's only motion controller, mounted once by SiteShell.
 *
 * 1. Page scope. Sets `data-cm` on <html> so root-level rules (smooth anchor
 *    scrolling, the body backdrop switch-off) apply while the shell is up,
 *    and suspends the root pointer channel, which restyles the whole
 *    document on every pointer frame and which only the homepage reads.
 *
 * 2. Reveals. Server markup is final and visible. After hydration, blocks
 *    marked `data-reveal` that are still BELOW the fold are armed (hidden)
 *    and one IntersectionObserver reveals each exactly once, then stops
 *    watching it. Anything already on screen is never hidden, and with
 *    JavaScript off or reduced motion requested nothing is hidden at all.
 *    CSS owns every transition. Re-run on each route change, because two
 *    pages of the same template share one mounted shell.
 *
 * No scroll listener, no pointer listener, no animation frame loop.
 * `enabled` is false on the homepage, which keeps its original motion.
 */
export function useSiteStage(enabled = true) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    html.dataset["cm"] = "site";
    const release = suspendPointerChannel();
    return () => {
      release();
      delete html.dataset["cm"];
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    const fold = window.innerHeight * 0.92;
    const blocks = Array.from(document.querySelectorAll<HTMLElement>(".cm-page [data-reveal]"));
    const armed = blocks.filter((el) => el.getBoundingClientRect().top > fold);
    if (armed.length === 0) return;
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
    return () => {
      io.disconnect();
      for (const el of armed) el.classList.remove("is-armed", "is-in");
    };
  }, [pathname, enabled]);
}
