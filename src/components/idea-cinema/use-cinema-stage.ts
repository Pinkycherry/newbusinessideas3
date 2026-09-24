import { useRef } from "react";

/**
 * The idea page's motion used to live here. Since the 2026-09-24 site-wide
 * rollout the shell owns it for every page (components/site-stage.ts: the
 * `data-cm` flag and the one-time reveals), and the hero depth tilt is gone.
 * Kept so the idea page's ref wiring is unchanged.
 */
export function useCinemaStage<T extends HTMLElement>() {
  return useRef<T | null>(null);
}
