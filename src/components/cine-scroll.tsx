/**
 * Cinematic scroll director.
 *
 * One IntersectionObserver for the whole page: any element carrying a
 * [data-cine] attribute gets the .cine-in class exactly once when it enters,
 * with an optional per-element stagger via [data-cine-delay] (ms). The actual
 * motion grammar lives in CSS (see the CINEMATIC LAYER in styles.css), so this
 * costs one observer and zero per-frame JS.
 *
 * Nothing here reverses on scroll-up: content that re-hides is a defect.
 */
import { useEffect } from "react";

export function CineScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || seen.has(e.target)) continue;
          seen.add(e.target);
          const delay = Number((e.target as HTMLElement).dataset.cineDelay ?? 0);
          window.setTimeout(() => e.target.classList.add("cine-in"), delay);
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    const attach = () => {
      document.querySelectorAll("[data-cine]:not(.cine-in)").forEach((el) => io.observe(el));
    };
    attach();

    // Sections mounted later (suspense boundaries, mutations) join in.
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
