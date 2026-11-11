import { Children, useRef, type ReactNode } from "react";
import { useStickyProgress } from "@/components/home/scroll-story";
import "./deck.css";

/**
 * Card rows and the team section, rebuilt (11 Nov 2026) after the Carousel / Tunnel / Stack versions broke
 * on the live site (cards off-centre, an empty stage between cards, text of one card showing through another).
 *
 * Two rules both components follow, so those failures cannot come back:
 *  1. The stage is never empty. At every scroll position one card is fully on screen; the next one rises
 *     over it. Nothing fades to nothing between cards.
 *  2. Cards are solid, the same size, and centred by the layout (CSS grid), not by transform offsets.
 *     Scripts only add movement on top. No rotation anywhere.
 *
 * Deck  — layered card stack (pattern: "Layered Card Stack Animation (Sticky)"): the next card comes up from
 *         below, growing towards the reader, and lands on the pile; the cards under it step back and darken.
 * Depth — real 3D zoom (pattern: "3D spatial scroll zoom"): CSS perspective with every person placed at their
 *         own distance (translateZ); scrolling moves the camera forward, so each one arrives small and soft,
 *         becomes sharp and full size in the middle, then passes the reader.
 *
 * Both are driven by scroll position through position:sticky, so they work on phones and in every browser.
 * Without script, with reduced motion or with motion paused they are a plain swipe row / grid.
 */

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const smooth = (t: number) => t * t * (3 - 2 * t);
const isOn = () => typeof document !== "undefined" && document.documentElement.classList.contains("ss-on");
/** Turns steady scrolling into "hold, then move": each item rests for `hold` of its step before the next. */
const stepped = (f: number, hold: number) => {
  const i = Math.floor(f), frac = f - i;
  return i + smooth(clamp((frac - hold) / (1 - hold)));
};

/* -------------------------------------------------------------------- Deck */

export function Deck({ head, children, skip, step = 18, size = "tall" }: { head?: ReactNode; children: ReactNode; skip?: string; step?: number; size?: "tall" | "idea" | "post" }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const bar = useRef<HTMLSpanElement>(null);
  const list = Children.toArray(children);
  const n = list.length;

  // Fan (founder's pick, option B): the front card leans to 11 o'clock, the next one waits behind it at
  // 1 o'clock. On each step the front card is dealt away to the left, the waiting card swings to the front
  // and a new one slides in behind. Cards pivot from the bottom edge, like a hand of cards.
  useStickyProgress(wrapRef, (p) => {
    const f = stepped(p * (n - 1), 0.5);
    const now = Math.round(f);
    const stageH = wrapRef.current ? Math.min(window.innerHeight, wrapRef.current.offsetHeight) : window.innerHeight;
    const lean = window.innerWidth < 700 ? 0.8 : 1; // a little less tilt on narrow screens so corners stay on screen
    cards.current.forEach((el, i) => {
      if (!el) return;
      const d = f - i; // -2..-1 sliding in behind; -1..0 swinging to the front; 0..1 dealt away
      if (d <= -2 || d >= 1) {
        if (el.style.visibility !== "hidden") el.style.visibility = "hidden";
        el.classList.remove("is-now");
        return;
      }
      let rot: number, x: number, y: number, s: number, dim: number, o = 1;
      if (d <= -1) {
        const e = easeOut(d + 2);
        rot = 9; x = 34 + (1 - e) * 60; y = 6 + (1 - e) * stageH * 0.5; s = 0.94; dim = 0.5; o = e;
      } else if (d <= 0) {
        const e = smooth(d + 1);
        rot = 9 - 15 * e; x = 34 * (1 - e); y = 6 * (1 - e); s = 0.94 + 0.06 * e; dim = 0.5 * (1 - e);
      } else {
        const e = smooth(d);
        rot = -6 - 16 * e; x = -e * 140; y = -e * 30; s = 1 - 0.06 * e; dim = 0; o = 1 - e;
      }
      el.style.visibility = "visible";
      el.style.zIndex = String(200 - i);
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translate3d(${(x * lean).toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${(rot * lean).toFixed(2)}deg) scale(${s.toFixed(4)})`;
      el.style.setProperty("--dim", dim.toFixed(3));
      el.style.pointerEvents = i === now ? "auto" : "none";
      el.classList.toggle("is-now", i === now);
    });
    if (bar.current) bar.current.style.transform = `scaleX(${clamp(p).toFixed(4)})`;
  });

  const jump = () => {
    const el = wrapRef.current;
    if (!el) return;
    const y = el.getBoundingClientRect().bottom + window.scrollY - window.innerHeight * 0.55;
    window.scrollTo({ top: Math.max(0, y), behavior: isOn() ? "smooth" : "auto" });
  };

  return (
    <div ref={wrapRef} data-keep-colour="" className={"dk dk-" + size} style={{ ["--n" as string]: String(n), ["--step" as string]: `${step}svh` }}>
      <div className="dk-stage">
        {head ? <div className="dk-head">{head}</div> : null}
        <div className="dk-space">
          {list.map((c, i) => (
            <div key={i} ref={(el) => { cards.current[i] = el; }} className={"dk-card" + (i === 0 ? " is-now" : "")}>{c}</div>
          ))}
        </div>
        <div className="dk-foot">
          <span aria-hidden className="dk-bar"><span ref={bar} /></span>
          {skip ? <button type="button" className="dk-skip" onClick={jump}>{skip} <svg viewBox="0 0 24 24" aria-hidden><path d="M12 5v14M5 12l7 7 7-7" /></svg></button> : null}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- Depth */

const GAP = 1100; // distance between two people along the camera's path, in px

export function Depth({ head, children, step = 62 }: { head?: ReactNode; children: ReactNode; step?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const list = Children.toArray(children);
  const n = list.length;
  /** Each one stands a little to one side, so the camera drifts left and right as it moves in. */
  const side = (i: number) => (i % 2 ? 1 : -1) * (i === n - 1 ? 0 : 1);

  const coarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  useStickyProgress(wrapRef, (p) => {
    const f = stepped(p * (n - 1), 0.4);
    const cam = f * GAP;
    const i0 = Math.min(n - 1, Math.floor(f)), i1 = Math.min(n - 1, i0 + 1), t = f - i0;
    const off = Math.min(window.innerWidth * 0.16, 220);
    const camX = (side(i0) + (side(i1) - side(i0)) * t) * off;
    if (world.current) world.current.style.transform = `translate3d(${(-camX).toFixed(1)}px,0,${cam.toFixed(1)}px)`;
    const now = Math.round(f);
    items.current.forEach((el, i) => {
      if (!el) return;
      const dist = cam - i * GAP; // negative: still ahead of the reader; positive: passing the reader
      const o = dist <= 0 ? clamp(1 + dist / (GAP * 1.7)) : clamp(1 - dist / (GAP * 0.3));
      const hidden = o <= 0.01;
      if (hidden) { if (el.style.visibility !== "hidden") el.style.visibility = "hidden"; el.classList.remove("is-now"); return; }
      const blur = dist < 0 ? Math.min(9, (-dist / GAP) * 7) : Math.min(6, (dist / GAP) * 14);
      el.style.visibility = "visible";
      el.style.opacity = o.toFixed(3);
      // Blur is costly on phones: there the distance is told by size and fade alone.
      el.style.filter = !coarse && blur > 0.25 ? `blur(${blur.toFixed(1)}px)` : "none";
      el.style.transform = `translate(-50%,-50%) translate3d(${(side(i) * off).toFixed(1)}px,0,${(-i * GAP).toFixed(0)}px)`;
      el.style.pointerEvents = i === now ? "auto" : "none";
      el.classList.toggle("is-now", i === now && Math.abs(dist) < GAP * 0.22);
    });
  });

  return (
    <div ref={wrapRef} data-keep-colour="" className="dp" style={{ ["--n" as string]: String(n), ["--step" as string]: `${step}svh` }}>
      <div className="dp-stage">
        {head ? <div className="dp-head">{head}</div> : null}
        <div className="dp-space">
          <span aria-hidden className="dp-floor" />
          <div ref={world} className="dp-world">
            {list.map((c, i) => (
              <div key={i} ref={(el) => { items.current[i] = el; }} className={"dp-item" + (i === 0 ? " is-now" : "")}>{c}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
