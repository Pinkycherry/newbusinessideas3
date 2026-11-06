import { useEffect } from "react";

/** Scroll reveal (fade up) for every page in the shared frame. Content stays visible without JS. */
export function useGlassMotion() {
  useEffect(() => {
    const root = document.documentElement;
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      root.classList.add("rv-on");
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
      els.forEach((el) => el.querySelectorAll<HTMLElement>("[data-stagger]").forEach((c, i) => { c.style.transitionDelay = `${Math.min(i, 8) * 80}ms`; }));
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("rv-in"); io?.unobserve(e.target); } });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });
      els.forEach((el) => io!.observe(el));
    }
    return () => { io?.disconnect(); root.classList.remove("rv-on"); };
  }, []);
}
