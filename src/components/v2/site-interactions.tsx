import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/** Seller fade-up entrance, progressively enhanced so content never waits on JS. */
export function SiteInteractions() {
  const pathname = useRouterState({ select: state => state.location.pathname });
  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('seller-scroll-reveal');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
    const observe = () => {
      document.querySelectorAll('main section:not(.sr-only), main article > header, main > header').forEach(section => {
        if (seen.has(section)) return;
        seen.add(section);
        observer.observe(section);
      });
    };
    observe();
    const mutations = new MutationObserver(observe);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); mutations.disconnect(); };
  }, [pathname]);
  return null;
}
