import { useEffect } from "react";

/** Scroll reveal and 3D pointer tilt for every page in the shared frame. Content stays visible without JS. */
export function useGlassMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    const fine = window.matchMedia("(pointer: fine)").matches;
    const onMove = (ev: PointerEvent) => {
      if (reduce || !fine) return;
      const el = (ev.target as HTMLElement).closest<HTMLElement>("[data-tilt]");
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width, py = (ev.clientY - r.top) / r.height;
      el.style.transition = "transform .08s linear";
      el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 14}deg) rotateY(${(px - 0.5) * 16}deg) translateY(-4px)`;
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
    };
    const onOut = (ev: PointerEvent) => {
      const el = (ev.target as HTMLElement).closest<HTMLElement>("[data-tilt]");
      if (!el || (ev.relatedTarget instanceof Node && el.contains(ev.relatedTarget))) return;
      el.style.transition = "transform .5s cubic-bezier(.2,.7,.2,1)";
      el.style.transform = "";
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerout", onOut);
    return () => { io?.disconnect(); root.classList.remove("rv-on"); document.removeEventListener("pointermove", onMove); document.removeEventListener("pointerout", onOut); };
  }, []);
}
