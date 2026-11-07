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
    // Speed (7 Nov 2026): looping animations run only while on screen.
    let anim: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      anim = new IntersectionObserver((entries) => {
        entries.forEach((e) => e.target.classList.toggle("is-off", !e.isIntersecting));
      }, { rootMargin: "100px 0px" });
      const looping = new Set<Element>(document.querySelectorAll(".g-marquee, .g-hub, .g-shine, .bbi-float-lg"));
      document.querySelectorAll(".g-flow").forEach((f) => { const svg = f.closest("svg"); if (svg) looping.add(svg); });
      looping.forEach((el) => anim!.observe(el));
    }
    // Slideshow loop copies stay clickable but out of the keyboard order.
    document.querySelectorAll<HTMLElement>("[data-loop-copy] a, [data-loop-copy] button").forEach((el) => { el.tabIndex = -1; });
    // Content protection (7 Nov 2026): long copies carry the source link; images have no save menu.
    const onCopy = (ev: ClipboardEvent) => {
      const text = window.getSelection()?.toString() ?? "";
      if (text.length < 200 || !ev.clipboardData) return;
      ev.clipboardData.setData("text/plain", `${text.slice(0, 600)}…\n\nRead the full page at ${location.href} (bbusiness.online). Copying the content is not allowed.`);
      ev.preventDefault();
    };
    const onMenu = (ev: MouseEvent) => { if ((ev.target as HTMLElement | null)?.closest("img")) ev.preventDefault(); };
    document.addEventListener("copy", onCopy);
    document.addEventListener("contextmenu", onMenu);
    return () => { io?.disconnect(); anim?.disconnect(); root.classList.remove("rv-on"); document.removeEventListener("copy", onCopy); document.removeEventListener("contextmenu", onMenu); };
  }, []);
}
