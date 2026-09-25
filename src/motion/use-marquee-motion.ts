import { useEffect, useRef } from "react";

import { onVisible } from "./engine";

/** Keep CSS track motion, without advancing offscreen or in background tabs. */
export function useMarqueeMotion() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = ref.current;
    const tracks = Array.from(host?.querySelectorAll<HTMLElement>("[data-marquee-track]") ?? []);
    if (!host || !tracks.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      const paused = !visible || document.hidden || reduced.matches;
      // Remove the inline value when active so hover/focus CSS still pauses.
      for (const track of tracks) {
        if (paused) track.style.animationPlayState = "paused";
        else track.style.removeProperty("animation-play-state");
        track.style.willChange = paused ? "auto" : "transform";
      }
    };
    const stopVisible = onVisible(host, (value) => {
      visible = value;
      sync();
    });
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    sync();
    return () => {
      stopVisible();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  return ref;
}
