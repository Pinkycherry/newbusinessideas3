import { useEffect } from "react";

/** Scroll reveal (fade up) for every page in the shared frame. Content stays visible without JS. */
export function useGlassMotion() {
  useEffect(() => {
    const root = document.documentElement;
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      root.classList.add("rv-on");
      // Site-wide (7 Nov 2026): every section after the first fades up as it enters, like /calculator.
      document.querySelectorAll<HTMLElement>("main section").forEach((sec, i) => {
        if (i === 0 || sec.hasAttribute("data-reveal") || sec.closest("[data-reveal]") || sec.getBoundingClientRect().top < window.innerHeight) return;
        sec.setAttribute("data-reveal", "");
      });
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
    // Site-wide auto slide (7 Nov 2026): any sideways card row (scroll-snap) moves on its own, one card
    // at a time, loops back to the start, pauses while the reader touches it or it is off screen.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    let rowsSeen: IntersectionObserver | null = null;
    const visible = new WeakSet<Element>();
    const wired = new WeakSet<Element>();
    const wireRows = () => {
      if (reduce || !("IntersectionObserver" in window)) return;
      rowsSeen ??= new IntersectionObserver((entries) => entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target))), { threshold: 0.4 });
      document.querySelectorAll<HTMLElement>("main ul, main ol, main div, footer ul").forEach((row) => {
        if (wired.has(row)) return;
        const cs = getComputedStyle(row);
        if (!((cs.overflowX === "auto" || cs.overflowX === "scroll") && cs.scrollSnapType.startsWith("x") && row.scrollWidth > row.clientWidth + 24)) return;
        wired.add(row);
        rowsSeen!.observe(row);
        let held = 0;
        const hold = () => { held = Date.now(); };
        row.addEventListener("pointerdown", hold, { passive: true });
        row.addEventListener("touchstart", hold, { passive: true });
        row.addEventListener("wheel", hold, { passive: true });
        timers.push(window.setInterval(() => {
          if (!visible.has(row) || Date.now() - held < 6000 || row.scrollWidth <= row.clientWidth + 24) return;
          const first = row.firstElementChild as HTMLElement | null;
          const step = first ? first.getBoundingClientRect().width + (parseFloat(getComputedStyle(row).columnGap) || 12) : row.clientWidth * 0.8;
          const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 8;
          row.scrollTo({ left: atEnd ? 0 : row.scrollLeft + step, behavior: "smooth" });
        }, 3200));
      });
    };
    wireRows();
    timers.push(window.setTimeout(wireRows, 2500), window.setTimeout(wireRows, 6000));
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
    return () => { io?.disconnect(); anim?.disconnect(); rowsSeen?.disconnect(); timers.forEach((t) => { window.clearInterval(t); window.clearTimeout(t); }); root.classList.remove("rv-on"); document.removeEventListener("copy", onCopy); document.removeEventListener("contextmenu", onMenu); };
  }, []);
}
