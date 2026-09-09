import { useEffect } from "react";

/**
 * Two-way scroll reveal, for phones.
 *
 * A one-way reveal plays once and is never seen again — on a 17,000px page
 * that is one moment of motion for a reader who is going to travel the whole
 * thing twice. This one animates in BOTH directions and remembers which way
 * the reader was going, so a section entering from below rises into place and
 * the same section, met again on the way back up, drops into place instead.
 *
 * Deliberately mobile-only. On a pointer device the page already answers to
 * hover, and a desktop reader does not scroll a page back and forth the way a
 * thumb does.
 *
 * It cannot fail closed: the hidden state hangs off `data-reveal="out"`, which
 * only this hook sets. Server-rendered markup, a browser with scripting off,
 * and `prefers-reduced-motion` all show every section in place. One observer
 * and one passive scroll listener for the whole page — the listener does two
 * assignments and no layout read.
 */
export function useTwoWayReveal(selector = "main section") {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (!window.matchMedia("(max-width: 1023px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (targets.length === 0) return;

    let lastY = window.scrollY;
    let direction: "down" | "up" = "down";
    const onScroll = () => {
      const y = window.scrollY;
      if (y !== lastY) direction = y > lastY ? "down" : "up";
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          el.dataset["revealFrom"] = direction;
          el.dataset["reveal"] = entry.isIntersecting ? "in" : "out";
        }
      },
      // Trimmed at both edges so a section commits to a state well before it
      // reaches the middle of the screen, rather than flickering at the fold.
      { rootMargin: "-6% 0px -6% 0px", threshold: 0 },
    );

    for (const el of targets) {
      el.dataset["reveal"] = "out";
      el.dataset["revealFrom"] = "down";
      io.observe(el);
    }

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      for (const el of targets) {
        delete el.dataset["reveal"];
        delete el.dataset["revealFrom"];
      }
    };
  }, [selector]);
}
