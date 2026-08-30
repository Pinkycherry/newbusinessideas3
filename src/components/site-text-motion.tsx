import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Sitewide entry reveal.
 *
 * Adds `.revealed` to headings as they enter the viewport. It does NOT touch
 * the DOM structure: an earlier version split headings into per-word spans in
 * an effect, which raced React's lazy route hydration, threw a hydration
 * mismatch and got the whole tree regenerated. Word-level waves are now
 * rendered by React in `<WaveText>`; this only flips a class, which React
 * neither owns nor diffs.
 */
const SEL = "h1, h2, h3, [data-wave]";

export function SiteTextMotion() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const status = useRouterState({ select: (s) => s.status });

  useEffect(() => {
    if (status !== "idle") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll(SEL).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname, status]);

  return null;
}
