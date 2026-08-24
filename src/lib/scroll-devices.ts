/**
 * Shared scroll-device primitives — the one engine every page-type build in
 * this pass consumes, so no page reaches for its own bespoke scroll code.
 *
 * These are BBI's own React/GSAP translation of the device vocabulary in the
 * scrollcraft skill's references/devices.md (pin, pan/rail, reveal, kinetic
 * type, tilt, magnet). Nothing here is the skill's actual engine file —
 * that engine drives standalone `data-sc-*` HTML and needs its own asset
 * pipeline, which this project deliberately isn't using (see PENDING.md
 * 2026-08-23). This file exists so the same *devices*, at the same taste
 * floor, are available as ordinary hooks inside TanStack Start components,
 * built on the gsap + ScrollTrigger stack this repo already loads via
 * `loadGsap()` — no new dependency.
 *
 * Every hook:
 * - no-ops (or falls back to a static, still-usable layout) under
 *   `prefers-reduced-motion` — never just "zero", per taste.md's
 *   "fewer and gentler, not zero".
 * - animates transform/opacity only, clip-path for wipes — never
 *   width/height/top/left, never `transition: all`.
 * - is safe to call during SSR: all DOM/gsap work happens inside
 *   `useEffect`, so the server-rendered markup is always the real,
 *   readable content — a scroll device is progressive enhancement on top
 *   of it, never a requirement for it to be there.
 */
import { useEffect, useRef, type RefObject } from "react";

import { loadGsap, prefersReducedMotion } from "./motion";

async function loadScrollTrigger() {
  const gsap = await loadGsap(true);
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  return { gsap, ScrollTrigger };
}

/* ------------------------------------------------------------------ *
 * pin — the frame holds, content advances (devices.md §2)
 * ------------------------------------------------------------------ */

/**
 * Pins `stageRef` for `spanVh` viewport-heights while `--sc-p` (0→1) is
 * written onto it every frame, for cue windows and `calc()`-driven CSS.
 * Falls back to ordinary document flow (no pin, `--sc-p` fixed at 0) under
 * reduced motion — the content still reads top to bottom, it just doesn't
 * hold.
 *
 * Minimum useful `spanVh` is ~1.2 (devices.md): below that, progress jumps
 * 0→1 between two scroll notches and every cue inside the act snaps
 * instead of running. A beat that wants less than a screen of travel
 * should not be pinned — use `useRevealOnEntry` instead.
 */
export function usePinProgress(
  stageRef: RefObject<HTMLElement | null>,
  { spanVh = 2, onUpdate }: { spanVh?: number; onUpdate?: (p: number) => void } = {},
) {
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.setProperty("--sc-p", "0");
      return;
    }
    let trigger: import("gsap/ScrollTrigger").ScrollTrigger | undefined;
    let cancelled = false;
    loadScrollTrigger().then(({ ScrollTrigger }) => {
      if (cancelled) return;
      trigger = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: `+=${Math.max(spanVh, 1.2) * 100}%`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: (self: InstanceType<typeof ScrollTrigger>) => {
          el.style.setProperty("--sc-p", self.progress.toFixed(4));
          onUpdate?.(self.progress);
        },
      });
    });
    return () => {
      cancelled = true;
      trigger?.kill();
      el.style.removeProperty("--sc-p");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageRef, spanVh]);
}

/* ------------------------------------------------------------------ *
 * pan / rail — vertical scroll, lateral travel (devices.md §3)
 * ------------------------------------------------------------------ */

/**
 * Drives horizontal travel on `railRef` from vertical scroll, but only for
 * the actual measured overflow — devices.md's own hard-won lesson is that
 * a rail narrower than its viewport travels **zero** and silently becomes a
 * pinned stage holding one motionless screen, so this measures
 * `scrollWidth - clientWidth` itself rather than trusting a caller's guess.
 *
 * Under reduced motion the container becomes a native
 * `overflow-x: auto` scroll region instead — the rail's transform is
 * navigation, not decoration, so it cannot simply be turned off; the items
 * still have to be reachable.
 */
export function useRail(
  wrapRef: RefObject<HTMLElement | null>,
  railRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const wrap = wrapRef.current;
    const rail = railRef.current;
    if (!wrap || !rail) return;

    if (prefersReducedMotion()) {
      wrap.style.overflowX = "auto";
      wrap.style.scrollSnapType = "x proximity";
      rail.style.transform = "";
      return;
    }

    let trigger: import("gsap/ScrollTrigger").ScrollTrigger | undefined;
    let cancelled = false;
    loadScrollTrigger().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const overflow = rail.scrollWidth - wrap.clientWidth;
      if (overflow <= 0) return; // nothing to travel — leave it static, don't fake a pin
      const span = Math.max(overflow / window.innerHeight + 1, 1.5) * 100;
      trigger = ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: `+=${span}%`,
        pin: true,
        pinSpacing: true,
        onUpdate: (self: InstanceType<typeof ScrollTrigger>) => {
          gsap.set(rail, { x: -overflow * self.progress });
        },
      });
    });
    return () => {
      cancelled = true;
      trigger?.kill();
    };
  }, [wrapRef, railRef]);
}

/* ------------------------------------------------------------------ *
 * flow + in — reveal on entry, fires once (devices.md §8)
 * ------------------------------------------------------------------ */

/**
 * IntersectionObserver reveal-on-entry, staggered across `itemSelector`
 * children. Fires once — content that re-hides on scrolling back up is a
 * defect, not an effect, per devices.md. This is the same mechanism the
 * existing `<Reveal>` component uses; this hook exists for the cases that
 * need to stagger a live list of children (e.g. gallery/catalog cards)
 * rather than wrap one static block.
 */
export function useStaggerReveal(
  containerRef: RefObject<HTMLElement | null>,
  itemSelector: string,
  { staggerMs = 55 }: { staggerMs?: number } = {},
) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(itemSelector));
    if (items.length === 0) return;

    if (prefersReducedMotion()) {
      items.forEach((item) => item.classList.add("sc-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const item = entry.target as HTMLElement;
          const index = items.indexOf(item);
          item.style.transitionDelay = `${Math.max(0, index) * staggerMs}ms`;
          item.classList.add("sc-in");
          io.unobserve(item);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    items.forEach((item) => io.observe(item));
    return () => io.disconnect();
  }, [containerRef, itemSelector, staggerMs]);
}

/* ------------------------------------------------------------------ *
 * pointer devices — tilt / magnet (devices.md §9)
 * ------------------------------------------------------------------ */

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/** 3D tilt toward the pointer, 5–9deg. Desktop-fine-pointer only, never on touch. */
export function useTilt(ref: RefObject<HTMLElement | null>, degrees = 6) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia(FINE_POINTER).matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${(-py * degrees).toFixed(2)}deg) rotateY(${(px * degrees).toFixed(2)}deg)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [ref, degrees]);
}

/**
 * Element drifts toward the pointer, strength 0.2–0.35. Primary CTA only —
 * "a page of magnetic elements is unusable" (devices.md §9).
 */
export function useMagnet(ref: RefObject<HTMLElement | null>, strength = 0.28) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia(FINE_POINTER).matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [ref, strength]);
}

/* ------------------------------------------------------------------ *
 * kinetic type — lines assemble from a masked edge (devices.md §5)
 * ------------------------------------------------------------------ */

/**
 * Splits `ref`'s text into per-line spans, each inside an
 * `overflow:hidden` mask so the line slides up from a clean edge instead
 * of merely fading — and the mask reserves room for descenders, which a
 * naive line-box clip does not (devices.md's most common breakage). Waits
 * on `document.fonts.ready`, since line splitting measures real line boxes.
 *
 * At most one kinetic headline per act/section — two competing is noise.
 */
export function useKineticLines(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const original = el.innerHTML;
    const text = el.textContent ?? "";

    if (prefersReducedMotion() || !text.trim()) return;

    let cancelled = false;
    const split = () => {
      if (cancelled) return;
      // Measure line breaks by cloning into a hidden probe at the element's
      // own width, then re-flow the words into <span> lines at those breaks.
      const words = text.split(/\s+/).filter(Boolean);
      const probe = el.cloneNode(false) as HTMLElement;
      probe.style.visibility = "hidden";
      probe.style.position = "absolute";
      probe.style.height = "auto";
      probe.style.width = `${el.clientWidth}px`;
      document.body.appendChild(probe);

      const lines: string[] = [];
      let current = "";
      let lastTop: number | null = null;
      for (const word of words) {
        probe.textContent = current ? `${current} ${word}` : word;
        const top = probe.getBoundingClientRect().top;
        if (lastTop !== null && top !== lastTop && current) {
          lines.push(current);
          current = word;
        } else {
          current = current ? `${current} ${word}` : word;
        }
        lastTop = probe.getBoundingClientRect().top;
      }
      if (current) lines.push(current);
      probe.remove();

      el.innerHTML = lines
        .map(
          (line) =>
            `<span class="sc-kinetic-mask"><span class="sc-kinetic-line">${line}</span></span>`,
        )
        .join("<br/>");

      loadGsap(true).then((gsap) => {
        if (cancelled) return;
        const lineEls = el.querySelectorAll<HTMLElement>(".sc-kinetic-line");
        gsap.set(lineEls, { yPercent: 110, opacity: 0 });
        gsap.to(lineEls, {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(split);
    } else {
      split();
    }
    return () => {
      cancelled = true;
      el.innerHTML = original;
    };
  }, [ref]);
}

/* ------------------------------------------------------------------ *
 * reveal — a clip-path wipe, a change of state (devices.md §4)
 * ------------------------------------------------------------------ */

export type RevealDirection = "up" | "down" | "left" | "right" | "iris";

const CLIP_FROM: Record<RevealDirection, string> = {
  up: "inset(100% 0 0 0)",
  down: "inset(0 0 100% 0)",
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
  iris: "circle(0% at 50% 50%)",
};
const CLIP_TO: Record<RevealDirection, string> = {
  up: "inset(0 0 0 0)",
  down: "inset(0 0 0 0)",
  left: "inset(0 0 0 0)",
  right: "inset(0 0 0 0)",
  iris: "circle(75% at 50% 50%)",
};

/**
 * Clip-path wipe on scroll-into-view. Apply to a wrapper around the media,
 * never directly to tight-set type (`clip-path` is relative to the border
 * box, not the ink — devices.md's warning). `iris` reads loudest; reach for
 * it once per page at most.
 */
export function useRevealWipe(
  ref: RefObject<HTMLElement | null>,
  direction: RevealDirection = "up",
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.clipPath = "";
      el.style.opacity = "1";
      return;
    }
    el.style.clipPath = CLIP_FROM[direction];
    let cancelled = false;
    loadGsap(true).then((gsap) => {
      if (cancelled) return;
      gsap.to(el, {
        clipPath: CLIP_TO[direction],
        duration: 0.9,
        ease: "power3.inOut",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    });
    return () => {
      cancelled = true;
    };
  }, [ref, direction]);
}

/** Convenience: a ref + the reveal wipe wired up in one call. */
export function useReveal<T extends HTMLElement>(direction: RevealDirection = "up") {
  const ref = useRef<T | null>(null);
  useRevealWipe(ref, direction);
  return ref;
}
