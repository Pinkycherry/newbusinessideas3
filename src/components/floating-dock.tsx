import { useEffect, useId, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { ArrowUp, Compass } from "lucide-react";

import "./floating-dock.css";

type Anchor = { id: string; label: string };

/** Sections opt in with data-anchor and data-anchor-label. */
export function FloatingDock() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
    setActive("");
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-anchor]"));
    setAnchors(
      nodes.map((node) => ({
        id: node.dataset["anchor"] ?? "",
        label: node.dataset["anchorLabel"] ?? node.dataset["anchor"] ?? "",
      })),
    );
    let frame = 0;
    let scrollable = 0;
    let measureNeeded = true;
    let wasScrolled: boolean | undefined;

    const update = () => {
      frame = 0;
      if (document.hidden) return;
      // Only size changes invalidate the page-height measurement. Scroll
      // events read the cached extent and the current offset, without layout.
      if (measureNeeded) {
        scrollable = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        measureNeeded = false;
      }
      const nextScrolled = scrollable > 0 && window.scrollY / scrollable > 0.15;
      if (nextScrolled !== wasScrolled) {
        wasScrolled = nextScrolled;
        setScrolled(nextScrolled);
      }
    };
    const schedule = () => {
      if (!document.hidden && !frame) frame = requestAnimationFrame(update);
    };
    const resize = () => {
      measureNeeded = true;
      schedule();
    };
    const intersection = new IntersectionObserver(
      (entries) => {
        if (document.hidden) return;
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.getAttribute("data-anchor") ?? "");
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    const observer = new ResizeObserver(resize);
    const observe = () => {
      observer.observe(document.documentElement);
      observer.observe(document.body);
      nodes.forEach((node) => intersection.observe(node));
    };
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        observer.disconnect();
        intersection.disconnect();
      } else {
        observe();
        resize();
      }
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    visibility();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButton.current?.focus({ preventScroll: true });
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);

  const go = (id: string) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({
      behavior: reduce ? "instant" : "smooth",
      block: "start",
    });
    setOpen(false);
    menuButton.current?.focus({ preventScroll: true });
  };

  return (
    <div className="bbi-overlay bbi-dock fixed bottom-5 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-7 sm:right-6">
      {anchors.length > 0 && (
        <nav
          id={menuId}
          data-open={open}
          inert={!open}
          aria-hidden={!open}
          aria-label="Page sections"
          className="bbi-dock-nav glass-nav w-56 rounded-2xl p-2"
        >
          {anchors.map((anchor, index) => (
            <button
              key={anchor.id}
              type="button"
              onClick={() => go(anchor.id)}
              aria-current={active === anchor.id ? "location" : undefined}
              style={{ transitionDelay: open ? `${Math.min(index, 8) * 30}ms` : "0ms" }}
              className={`bbi-dock-link block w-full truncate rounded-xl px-3 py-2 text-left text-xs font-semibold ${
                active === anchor.id
                  ? "bg-primary/25 text-foreground"
                  : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
              }`}
            >
              {anchor.label}
            </button>
          ))}
        </nav>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          data-visible={scrolled}
          disabled={!scrolled}
          aria-hidden={!scrolled}
          // Preserve the immediate jump; existing ScrollTriggers can conflict
          // with a native smooth back-to-top animation.
          onClick={() => window.scrollTo(0, 0)}
          aria-label="Back to top"
          // Shared unlayered glass rules otherwise override rounded-full.
          style={{ borderRadius: "9999px" }}
          className="bbi-dock-control bbi-dock-top glass-btn bbi-dock-btn grid h-11 w-11 place-items-center rounded-full"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
        {anchors.length > 0 && (
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label="Jump to a section"
            style={{ borderRadius: "9999px" }}
            className="bbi-dock-control glass-btn bbi-dock-btn grid h-11 w-11 place-items-center rounded-full"
          >
            <span data-open={open} className="bbi-dock-compass grid place-items-center">
              <Compass className="h-4 w-4" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
