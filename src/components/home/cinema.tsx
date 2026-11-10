import { Children, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { clamp, isOn, useStickyProgress } from "./scroll-story";
import "./cinema.css";

/**
 * Cinema sections (founder, 11 Nov 2026). Layout and motion only: every word comes from content that
 * was already on the page, and no figure is invented (the small moving pictures use shapes and words,
 * never numbers).
 *  - Carousel: a row that drifts left by itself; the reader can swipe, use the arrows or skip it. The
 *    card in the middle of the screen is always the lit one, on phones too.
 *  - Tunnel: items fly towards the reader through a light frame (team, blog).
 *  - StoryRail: a line with stops; a light travels along it as the page scrolls.
 *  - Quad: four quarters around the brand mark; a quarter opens its links when chosen.
 *  - ProcessBento: four panels, each with a small moving picture.
 *  - OrbitRing: the eight kinds of page circling the centre.
 * Without script, with reduced motion or with motion paused, each falls back to a plain layout.
 */

/* ---------------------------------------------------------------- Carousel */

export function Carousel({ head, children, label }: { head: ReactNode; children: ReactNode; label: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const hold = useRef(false);
  const n = Children.count(children);

  useEffect(() => {
    const tr = track.current, box = wrap.current;
    if (!tr || !box) return;
    let raf = 0, seen = false, resume = 0;
    const kids = () => Array.from(tr.children) as HTMLElement[];
    const mid = () => {
      const c = tr.scrollLeft + tr.clientWidth / 2;
      let best = 0, bd = Infinity;
      kids().forEach((el, i) => { const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - c); if (d < bd) { bd = d; best = i; } });
      return best;
    };
    const paint = () => {
      raf = 0;
      const c = tr.scrollLeft + tr.clientWidth / 2, w = tr.clientWidth, list = kids(), on = isOn();
      const m = mid();
      list.forEach((el, i) => {
        const d = clamp((el.offsetLeft + el.offsetWidth / 2 - c) / (w * 0.7), -1, 1), a = Math.abs(d);
        el.classList.toggle("is-mid", i === m);
        // A card "is in" while any part of it is inside the row's window: it pops up on the way in and drops on the way out, every time.
        const left = el.offsetLeft - tr.scrollLeft, inView = seen && left < w - 24 && left + el.offsetWidth > 24;
        if (inView !== el.classList.contains("is-in")) el.classList.toggle("is-in", inView);
        el.style.transform = on ? `perspective(1100px) rotateY(${(-d * 26).toFixed(2)}deg) translateY(${(a * 18).toFixed(1)}px) scale(${(1.1 - a * 0.22).toFixed(3)})` : "";
        el.style.opacity = on ? (1 - a * 0.5).toFixed(3) : "";
        el.style.zIndex = String(10 - Math.round(a * 10));
      });
      const max = tr.scrollWidth - tr.clientWidth;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? clamp(tr.scrollLeft / max).toFixed(3) : 0})`;
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const to = (i: number) => {
      const list = kids(), el = list[Math.max(0, Math.min(list.length - 1, i))];
      if (el) tr.scrollTo({ left: el.offsetLeft + el.offsetWidth / 2 - tr.clientWidth / 2, behavior: isOn() ? "smooth" : "auto" });
    };
    (box as HTMLDivElement & { go?: (d: number) => void }).go = (d) => to(mid() + d);
    // Cinematic drift: the row glides left by itself, slowly, and turns round at each end. Touching,
    // pointing at or tabbing into the row hands it to the reader (free swipe); it starts again after a pause.
    let drift = 0, dir = 1, pos = -1, lastT = 0;
    const glide = (now: number) => {
      drift = requestAnimationFrame(glide);
      const dt = Math.min(48, now - (lastT || now)); lastT = now;
      if (!seen || hold.current || document.hidden || !isOn()) { pos = -1; return; }
      const max = tr.scrollWidth - tr.clientWidth;
      if (max <= 0) return;
      if (pos < 0) pos = tr.scrollLeft;
      pos += dir * dt * 0.045;
      if (pos >= max) { pos = max; dir = -1; } else if (pos <= 0) { pos = 0; dir = 1; }
      tr.scrollLeft = pos;
    };
    drift = requestAnimationFrame(glide);
    const timer = 0;
    const stop = () => { hold.current = true; window.clearTimeout(resume); };
    const start = () => { window.clearTimeout(resume); resume = window.setTimeout(() => { hold.current = false; }, 2600); };
    let touching = false;
    const io = new IntersectionObserver((e) => { seen = e.some((x) => x.isIntersecting); box.classList.toggle("is-pop", seen); ask(); }, { threshold: 0.12 });
    // Moving the mouse across the row pushes it the other way, so new cards keep arriving under the pointer.
    const onMouse = (e: MouseEvent) => { if (!isOn() || e.buttons) return; tr.scrollLeft += e.movementX * -0.7; pos = -1; };
    tr.addEventListener("mousemove", onMouse);
    tr.addEventListener("touchstart", () => { touching = true; }, { passive: true });
    tr.addEventListener("touchend", () => { touching = false; }, { passive: true });
    tr.addEventListener("touchcancel", () => { touching = false; }, { passive: true });
    io.observe(tr);
    kids().forEach((el, i) => el.style.setProperty("--k", String(i % 7)));
    // The page scroll drives the row too (both ways), so cards keep arriving and popping as the reader scrolls.
    let lastY = window.scrollY;
    const onPage = () => {
      const y = window.scrollY, dy = y - lastY; lastY = y;
      if (!seen || touching || !isOn()) return; // keeps working with the mouse resting on the row
      const max = tr.scrollWidth - tr.clientWidth;
      tr.scrollLeft = clamp(tr.scrollLeft + dy * 0.9, 0, max);
      pos = -1;
    };
    window.addEventListener("scroll", onPage, { passive: true });
    tr.addEventListener("scroll", ask, { passive: true });
    tr.addEventListener("wheel", (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { stop(); start(); } }, { passive: true });
    tr.addEventListener("touchstart", stop, { passive: true });
    tr.addEventListener("touchend", start, { passive: true });
    box.addEventListener("pointerdown", stop);
    box.addEventListener("pointerup", start);
    box.addEventListener("pointercancel", start);
    box.addEventListener("mouseenter", stop);
    box.addEventListener("mouseleave", start);
    box.addEventListener("focusin", stop);
    box.addEventListener("focusout", start);
    window.addEventListener("resize", ask);
    window.addEventListener("ss-motion", ask);
    paint();
    const first = window.setTimeout(ask, 700);
    return () => {
      window.clearTimeout(first); window.clearInterval(timer); cancelAnimationFrame(drift); window.removeEventListener("scroll", onPage); window.clearTimeout(resume); io.disconnect();
      tr.removeEventListener("scroll", ask); window.removeEventListener("resize", ask); window.removeEventListener("ss-motion", ask);
      box.removeEventListener("pointerdown", stop); box.removeEventListener("pointerup", start); box.removeEventListener("pointercancel", start);
      box.removeEventListener("mouseenter", stop); box.removeEventListener("mouseleave", start); box.removeEventListener("focusin", stop); box.removeEventListener("focusout", start);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n]);

  return (
    <div ref={wrap} className="cn cn-car">
      {head}
      <ul ref={track} className="cn-car-track" aria-label={label} tabIndex={0}>{children}</ul>
    </div>
  );
}

/* ------------------------------------------------------------------ Tunnel */

/**
 * Items fly towards the reader one by one through a light frame. Plain stacked list without motion.
 * `step` sets how much page-scroll each item gets (svh); a long row (categories, ideas, blog) wants a
 * short step so the whole thing does not take forever, and gets a Skip link so a reader can jump past
 * it without scrolling through every item by hand.
 */
export function Tunnel({ head, children, tone = "", step = 62, skip }: { head?: ReactNode; children: ReactNode; tone?: string; step?: number; skip?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const rings = useRef<(HTMLSpanElement | null)[]>([]);
  const list = Children.toArray(children);
  const n = list.length;
  const jump = () => {
    const el = wrapRef.current;
    if (!el) return;
    const y = el.getBoundingClientRect().bottom + window.scrollY - window.innerHeight * 0.6;
    window.scrollTo({ top: Math.max(0, y), behavior: isOn() ? "smooth" : "auto" });
  };

  useStickyProgress(wrapRef, (p) => {
    items.current.forEach((el, i) => {
      if (!el) return;
      // 3D spatial scroll zoom: each person starts small, blurred and far off, grows and sharpens as
      // they travel toward the reader, holds centred, then keeps closing in and fading as they pass.
      // Each item owns one equal slice of the scroll, so only one is ever on screen.
      const t = p * n - i;
      const inn = clamp(t / 0.3), out = clamp((t - 0.72) / 0.28);
      const vis = t >= 0 && t < 1;
      const depth = 1 - inn;
      const sc = 0.2 + 0.8 * (1 - Math.pow(depth, 3)) + 0.55 * out * out;
      el.style.transform = `translate(-50%,-50%) scale(${sc.toFixed(3)})`;
      el.style.opacity = vis ? (inn * (1 - out)).toFixed(3) : "0";
      el.style.filter = `blur(${(depth * 9).toFixed(1)}px)`;
      el.style.visibility = vis ? "visible" : "hidden";
      el.style.zIndex = vis ? "50" : "1";
      el.style.pointerEvents = vis && out < 0.5 && inn > 0.6 ? "auto" : "none";
      el.classList.toggle("is-now", vis && inn > 0.5 && out < 0.5);
    });
    rings.current.forEach((el, k) => {
      if (!el) return;
      const t = (k / rings.current.length + p * 2.6) % 1;
      el.style.transform = `translate(-50%,-50%) scale(${(0.12 + t * 1.6).toFixed(3)})`;
      el.style.opacity = (t < 0.15 ? t / 0.15 : 1 - t).toFixed(3);
    });
  });

  return (
    <div ref={wrapRef} className={"cn cn-tunnel " + tone} style={{ ["--n" as string]: String(n), ["--step" as string]: `${step}svh` }}>
      <div className="cn-tunnel-stage">
        {head ? <div className="cn-tunnel-head">{head}</div> : null}
        <div className="cn-tunnel-space">
          {[0, 1, 2, 3, 4].map((k) => <span key={k} aria-hidden ref={(el) => { rings.current[k] = el; }} className="cn-ring" />)}
          <span aria-hidden className="cn-beam" />
          {list.map((c, i) => <div key={i} ref={(el) => { items.current[i] = el; }} className="cn-fly">{c}</div>)}
        </div>
        {skip ? <button type="button" className="cn-tunnel-skip" onClick={jump}>{skip} <svg viewBox="0 0 24 24" aria-hidden><path d="M12 5v14M5 12l7 7 7-7" /></svg></button> : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Stack */

/**
 * Layered card stack (pattern: veebilehed24.ee "Layered Card Stack Animation (Sticky)"). All cards sit
 * pinned in one fanned pile, each one's own card on top of the one behind it; scrolling peels the top
 * card up and away, revealing the next one already waiting beneath. Deliberately layered by design, so
 * nothing is ever two full-size cards fighting for the same spot by accident.
 */
export function Stack({ head, children, skip, step = 18 }: { head?: ReactNode; children: ReactNode; skip?: string; step?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const list = Children.toArray(children);
  const n = list.length;
  const jump = () => {
    const el = wrapRef.current;
    if (!el) return;
    const y = el.getBoundingClientRect().bottom + window.scrollY - window.innerHeight * 0.6;
    window.scrollTo({ top: Math.max(0, y), behavior: isOn() ? "smooth" : "auto" });
  };

  useStickyProgress(wrapRef, (p) => {
    items.current.forEach((el, i) => {
      if (!el) return;
      const start = (i / n) * 0.82;
      const dur = (1 / n) * 1.25;
      const started = p >= start;
      const t = clamp((p - start) / dur);
      // Cards waiting their turn sit well back of the active one: pushed down, shrunk and blurred, so
      // the one reader is reading is never fighting a second card's text for the same patch of screen.
      const depth = Math.min(i, 3);
      const restY = depth * 34;
      const restRot = (i % 2 === 0 ? -1 : 1) * (3 + depth * 2.2);
      const moveY = -t * 340;
      const rot = restRot * (1 - t) + t * 10;
      const sc = (1 - depth * 0.07) * (1 - t * 0.18) + t * depth * 0.07;
      el.style.transform = `translate(-50%,-50%) translateY(${(restY + moveY).toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
      el.style.opacity = started ? (1 - t).toFixed(3) : Math.max(0.16, 0.55 - depth * 0.14).toFixed(3);
      el.style.filter = started ? "none" : `blur(${(depth * 2.1).toFixed(1)}px)`;
      el.style.zIndex = String(n - i + 10);
      el.style.pointerEvents = started && t < 0.4 ? "auto" : "none";
      el.classList.toggle("is-now", started && t < 0.5);
    });
  });

  return (
    <div ref={wrapRef} className="cn cn-stack" style={{ ["--n" as string]: String(n), ["--step" as string]: `${step}svh` }}>
      <div className="cn-stack-stage">
        {head ? <div className="cn-tunnel-head">{head}</div> : null}
        <div className="cn-stack-space">
          {list.map((c, i) => <div key={i} ref={(el) => { items.current[i] = el; }} className="cn-card">{c}</div>)}
        </div>
        {skip ? <button type="button" className="cn-tunnel-skip" onClick={jump}>{skip} <svg viewBox="0 0 24 24" aria-hidden><path d="M12 5v14M5 12l7 7 7-7" /></svg></button> : null}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- StoryRail */

const RAIL = "M70 150 C 210 150, 230 60, 360 60 S 520 150, 640 150 S 800 60, 930 60";
const STOPS: [number, number][] = [[70, 150], [360, 60], [640, 150], [930, 60]];

/** A drawn line with four stops; the light runs along it as the page scrolls and each chapter takes the stage. */
export function StoryRail({ steps }: { steps: { ic: string; t: string; d: string }[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const [at, setAt] = useState(0);
  useStickyProgress(wrapRef, (p) => {
    const el = path.current;
    if (!el) return;
    const q = clamp(p * 1.08);
    el.style.strokeDashoffset = String(1 - q);
    const pt = el.getPointAtLength(el.getTotalLength() * q);
    if (dot.current) { dot.current.style.left = `${pt.x / 10}%`; dot.current.style.top = `${pt.y / 2.1}%`; }
    setAt(Math.min(steps.length - 1, Math.floor(q * steps.length * 0.999)));
  });
  const cur = steps[at] ?? steps[0];
  return (
    <div ref={wrapRef} className="cn cn-rail" style={{ ["--n" as string]: String(steps.length) }}>
      <div className="cn-rail-stage">
        <div className="cn-rail-map">
          <svg viewBox="0 0 1000 210" preserveAspectRatio="none" aria-hidden>
            <path d={RAIL} className="cn-rail-bg" vectorEffect="non-scaling-stroke" />
            <path ref={path} d={RAIL} pathLength={1} className="cn-rail-fg" vectorEffect="non-scaling-stroke" />
          </svg>
          <span ref={dot} aria-hidden className="cn-rail-dot" />
          {steps.map((s, i) => (
            <span key={s.t} className={"cn-rail-stop" + (i <= at ? " is-done" : "") + (i === at ? " is-on" : "")} style={{ left: `${(STOPS[i]?.[0] ?? 0) / 10}%`, top: `${(STOPS[i]?.[1] ?? 0) / 2.1}%` }}>
              <img src={s.ic} alt="" width={64} height={67} loading="lazy" decoding="async" />
            </span>
          ))}
        </div>
        {cur ? (
          <div key={at} className="cn-rail-say">
            <span className="cn-no" aria-hidden>{String(at + 1).padStart(2, "0")}</span>
            <h3 className="cn-rail-t">{cur.t}</h3>
            <p className="cn-rail-d">{cur.d}</p>
          </div>
        ) : null}
        {/* Plain list for readers without motion, and for search engines */}
        <ol className="cn-rail-plain">
          {steps.map((s) => <li key={s.t}><b>{s.t}.</b> {s.d}</li>)}
        </ol>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- Small moving pictures */

export type VizKind = "pin" | "bars" | "list" | "verdict" | "feed" | "scan";

/** Shapes and words only: no figure here is data. */
export function Viz({ kind }: { kind: VizKind }) {
  if (kind === "pin") return (
    <span className="cn-viz cn-viz-pin" aria-hidden>
      {Array.from({ length: 18 }, (_, i) => <i key={i} style={{ left: `${8 + ((i * 37) % 84)}%`, top: `${12 + ((i * 53) % 70)}%`, animationDelay: `${(i % 6) * 0.35}s` }} />)}
      <b><svg viewBox="0 0 24 24"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" /><circle cx="12" cy="10" r="2.6" /></svg></b>
      <em>A named buyer</em>
    </span>
  );
  if (kind === "bars") return (
    <span className="cn-viz cn-viz-bars" aria-hidden>
      {[0, 1, 2, 3, 4, 5].map((i) => <i key={i} style={{ ["--h" as string]: `${28 + ((i * 29) % 60)}%`, animationDelay: `${i * 0.18}s` } as CSSProperties} />)}
      <em>₹ in, ₹ out</em>
    </span>
  );
  if (kind === "list") return (
    <span className="cn-viz cn-viz-list" aria-hidden>
      {["Slow first months", "Thin margins", "Late payments"].map((t, i) => <i key={t} style={{ animationDelay: `${i * 0.5}s` }}><u />{t}</i>)}
    </span>
  );
  if (kind === "verdict") return (
    <span className="cn-viz cn-viz-verdict" aria-hidden>
      <i>Build it</i><i>Test first</i><i>Walk away</i><u />
    </span>
  );
  if (kind === "feed") return (
    <span className="cn-viz cn-viz-feed" aria-hidden>
      <svg viewBox="0 0 300 80" preserveAspectRatio="none"><path pathLength={1} d="M0 50 C 30 20, 50 70, 80 45 S 130 15, 160 40 S 220 70, 250 35 S 285 30, 300 42" /></svg>
      <em>Questions, answered</em>
    </span>
  );
  return (
    <span className="cn-viz cn-viz-scan" aria-hidden>
      {Array.from({ length: 24 }, (_, i) => <i key={i} style={{ left: `${6 + ((i * 41) % 88)}%`, top: `${10 + ((i * 59) % 76)}%`, animationDelay: `${(i % 8) * 0.3}s` }} />)}
      <b />
      <em>Checking your idea</em>
    </span>
  );
}

/* -------------------------------------------------------------------- Quad */

export type QuadItem = { n: string; t: string; viz: VizKind; links: { href: string; label: string }[]; more: [string, string] };

/** Four quarters around the brand mark (as on the reference). Choosing a quarter opens its links. */
export function Quad({ items }: { items: QuadItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className={"cn cn-quad" + (open !== null ? " has-open" : "")}>
      {items.map((q, i) => (
        <div key={q.n} className={"cn-q" + (open === i ? " is-open" : "")}>
          <button type="button" className="cn-q-face" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
            <Viz kind={q.viz} />
            <span className="cn-q-n">{q.n}</span>
            <span className="cn-q-t">{q.t}</span>
            <span className="cn-q-go"><svg viewBox="0 0 24 24" aria-hidden><path d="M9 5l7 7-7 7" /></svg>{open === i ? "Close" : "Tap to explore"}</span>
          </button>
          <div className="cn-q-body" hidden={open !== i}>
            <ul>
              {q.links.map((l, k) => <li key={l.href} style={{ ["--i" as string]: String(k) }}><a href={l.href}><span>{l.label}</span><svg viewBox="0 0 24 24" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg></a></li>)}
            </ul>
            <a href={q.more[0]} className="g-btn-light cn-q-more">{q.more[1]}</a>
          </div>
        </div>
      ))}
      <span className="cn-quad-mark" aria-hidden>
        <svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="27" /></svg>
        <span>b<b>b</b></span>
      </span>
    </div>
  );
}

/* ----------------------------------------------------------- Process bento */

export function ProcessBento({ steps }: { steps: { t: string; d: string; viz: VizKind; tag: string }[] }) {
  return (
    <ol className="cn cn-bento">
      {steps.map((s, i) => (
        <li key={s.t} className="cn-b" style={{ ["--i" as string]: String(i) }}>
          <span className="cn-b-tag">{s.tag}</span>
          <span className="cn-b-no" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
          <div className="cn-b-viz"><Viz kind={s.viz} /></div>
          <h3 className="cn-b-t">{s.t}</h3>
          <p className="cn-b-d">{s.d}</p>
        </li>
      ))}
    </ol>
  );
}

/* -------------------------------------------------------------- Orbit ring */

export function OrbitRing({ items, centre }: { items: { img: string; t: string; d: string; to: string }[]; centre: ReactNode }) {
  const n = items.length;
  return (
    <div className="cn cn-orbit" style={{ ["--n" as string]: String(n) }}>
      <svg className="cn-orbit-lines" viewBox="-50 -50 100 100" aria-hidden>
        <circle r="40" className="cn-orbit-path" vectorEffect="non-scaling-stroke" />
        <circle r="26" className="cn-orbit-path is-in" vectorEffect="non-scaling-stroke" />
        {items.map((_, i) => {
          const a = (i * 2 * Math.PI) / n;
          return <line key={i} x1="0" y1="0" x2={40 * Math.cos(a)} y2={40 * Math.sin(a)} pathLength={1} vectorEffect="non-scaling-stroke" style={{ animationDelay: `${i * 0.4}s` }} />;
        })}
      </svg>
      <ul className="cn-orbit-ring">
        {items.map((it, i) => (
          <li key={it.t} style={{ ["--a" as string]: `${(i * 360) / n}deg` }}>
            <a href={it.to}>
              <img src={it.img} alt="" width={76} height={80} loading="lazy" decoding="async" />
              <b>{it.t}</b>
              <span>{it.d}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="cn-orbit-core">{centre}</div>
    </div>
  );
}

/* ------------------------------------------------------------ Search demand */

export type Demand = { label: string; n: number; to: string };

/**
 * The founder's own keyword research (monthly searches, all India) as one infographic: six rings, each as
 * long as its search is big, drawn when the panel scrolls in. The panel takes the searches in turn: the
 * active ring lights up and the centre shows its words and number. Tapping a row or ring picks it.
 */
export function SearchDemand({ rows, note }: { rows: Demand[]; note: string }) {
  const box = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const [at, setAt] = useState(0);
  const [seen, setSeen] = useState(false);
  const hold = useRef(false);
  const max = Math.max(...rows.map((r) => r.n));
  const fmt = (v: number) => Math.round(v).toLocaleString("en-IN");
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { setSeen(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!seen) return;
    const t = window.setInterval(() => { if (!hold.current && !document.hidden && isOn()) setAt((i) => (i + 1) % rows.length); }, 2800);
    return () => window.clearInterval(t);
  }, [seen, rows.length]);
  const cur = rows[at] ?? rows[0];
  useEffect(() => {
    const el = num.current;
    if (!el || !cur) return;
    if (!seen || !isOn()) { el.textContent = fmt(cur.n); return; }
    let raf = 0;
    const t0 = performance.now(), from = cur.n * 0.55;
    const tick = (now: number) => { const t = clamp((now - t0) / 900); el.textContent = fmt(from + (cur.n - from) * (1 - Math.pow(1 - t, 3))); if (t < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [at, seen]);
  const pick = (i: number) => { hold.current = true; setAt(i); };
  const R0 = 146, STEP = 17;
  return (
    <div ref={box} className={"cn cn-demand" + (seen ? " is-in" : "")}>
      <span className="cn-b-tag">Monthly searches · India</span>
      <div className="cn-dm-dial">
        <svg viewBox="0 0 320 320" role="img" aria-label="Six rings, one for each search; a longer ring means more monthly searches">
          <g className="cn-dm-ticks" aria-hidden>{Array.from({ length: 60 }, (_, k) => <line key={k} x1="160" y1="3" x2="160" y2={k % 5 ? 7 : 11} transform={`rotate(${k * 6} 160 160)`} />)}</g>
          <line className="cn-dm-sweep" x1="160" y1="160" x2="160" y2="10" aria-hidden />
          {rows.map((r, i) => {
            const rad = R0 - i * STEP;
            return (
              <g key={r.label} className={"cn-dm-ring" + (i === at ? " is-on" : "")} onClick={() => pick(i)} style={{ ["--i" as string]: String(i), ["--len" as string]: String(((r.n / max) * 0.94).toFixed(4)) }}>
                <circle cx="160" cy="160" r={rad} className="cn-dm-track" />
                <circle cx="160" cy="160" r={rad} pathLength={1} className="cn-dm-arc" transform="rotate(-90 160 160)" />
              </g>
            );
          })}
        </svg>
        {cur ? (
          <div className="cn-dm-core" aria-live="polite">
            <span key={at} className="cn-dm-q">{cur.label}</span>
            <b><span ref={num}>{fmt(cur.n)}</span></b>
            <small>searches a month</small>
          </div>
        ) : null}
      </div>
      <ol className="cn-dm-list">
        {rows.map((r, i) => (
          <li key={r.label} className={i === at ? "is-on" : ""} style={{ ["--w" as string]: `${Math.round((r.n / max) * 100)}%`, ["--i" as string]: String(i) }}>
            <button type="button" onClick={() => pick(i)} aria-current={i === at ? "true" : undefined}>
              <span className="cn-dm-no" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
              <span className="cn-dm-l">{r.label}</span>
              <span className="cn-dm-n">{fmt(r.n)}</span>
              <span className="cn-d-bar" aria-hidden><u /></span>
            </button>
          </li>
        ))}
      </ol>
      {cur ? <a href={cur.to} className="g-btn cn-dm-go">See ideas for “{cur.label}” <svg viewBox="0 0 24 24" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg></a> : null}
      <p className="cn-d-note">{note}</p>
    </div>
  );
}

/** Types example searches into a search box placeholder, one after another. */
export function useTypedPlaceholder(words: string[]) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !words.length) return;
    const base = el.placeholder;
    let w = 0, c = 0, del = false, t = 0;
    const step = () => {
      if (!isOn() || document.activeElement === el) { el.placeholder = base; t = window.setTimeout(step, 1200); return; }
      const word = words[w % words.length] ?? "";
      c += del ? -1 : 1;
      el.placeholder = word.slice(0, c) + "▍";
      let wait = del ? 40 : 95;
      if (!del && c >= word.length) { del = true; wait = 1300; } else if (del && c <= 0) { del = false; w++; wait = 350; }
      t = window.setTimeout(step, wait);
    };
    t = window.setTimeout(step, 1200);
    return () => { window.clearTimeout(t); el.placeholder = base; };
  }, [words]);
  return ref;
}
