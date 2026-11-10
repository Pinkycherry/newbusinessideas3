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
        el.style.transform = on ? `perspective(1100px) rotateY(${(-d * 26).toFixed(2)}deg) translateY(${(a * 18).toFixed(1)}px) scale(${(1.03 - a * 0.13).toFixed(3)})` : "";
        el.style.opacity = on ? (1 - a * 0.5).toFixed(3) : "";
        el.style.zIndex = String(10 - Math.round(a * 10));
      });
      const max = tr.scrollWidth - tr.clientWidth;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? clamp(tr.scrollLeft / max).toFixed(3) : 0})`;
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const to = (i: number) => {
      const list = kids(), el = list[(i + list.length) % list.length];
      if (el) tr.scrollTo({ left: el.offsetLeft + el.offsetWidth / 2 - tr.clientWidth / 2, behavior: isOn() ? "smooth" : "auto" });
    };
    (box as HTMLDivElement & { go?: (d: number) => void }).go = (d) => to(mid() + d);
    // Drifts one card to the left every few seconds; stops while the reader touches, points at or tabs into it.
    const timer = window.setInterval(() => { if (seen && !hold.current && !document.hidden && isOn()) to(mid() + 1); }, 3200);
    const stop = () => { hold.current = true; window.clearTimeout(resume); };
    const start = () => { window.clearTimeout(resume); resume = window.setTimeout(() => { hold.current = false; }, 5000); };
    const io = new IntersectionObserver((e) => { seen = e.some((x) => x.isIntersecting); }, { threshold: 0.35 });
    io.observe(tr);
    tr.addEventListener("scroll", ask, { passive: true });
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
      window.clearTimeout(first); window.clearInterval(timer); window.clearTimeout(resume); io.disconnect();
      tr.removeEventListener("scroll", ask); window.removeEventListener("resize", ask); window.removeEventListener("ss-motion", ask);
      box.removeEventListener("pointerdown", stop); box.removeEventListener("pointerup", start); box.removeEventListener("pointercancel", start);
      box.removeEventListener("mouseenter", stop); box.removeEventListener("mouseleave", start); box.removeEventListener("focusin", stop); box.removeEventListener("focusout", start);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n]);

  const go = (d: number) => (wrap.current as (HTMLDivElement & { go?: (d: number) => void }) | null)?.go?.(d);
  const skip = () => {
    const next = wrap.current?.closest("section")?.nextElementSibling as HTMLElement | null;
    if (next) window.scrollTo({ top: next.getBoundingClientRect().top + window.scrollY - 70, behavior: isOn() ? "smooth" : "auto" });
  };
  return (
    <div ref={wrap} className="cn cn-car">
      {head}
      <ul ref={track} className="cn-car-track" aria-label={label} tabIndex={0}>{children}</ul>
      <div className="cn-car-ctl">
        <button type="button" className="cn-round" aria-label="Previous" onClick={() => go(-1)}><svg viewBox="0 0 24 24" aria-hidden><path d="M15 5l-7 7 7 7" /></svg></button>
        <span className="cn-car-bar" aria-hidden><span ref={bar} /></span>
        <button type="button" className="cn-round" aria-label="Next" onClick={() => go(1)}><svg viewBox="0 0 24 24" aria-hidden><path d="M9 5l7 7-7 7" /></svg></button>
        <button type="button" className="cn-skip" onClick={skip}>Skip <svg viewBox="0 0 24 24" aria-hidden><path d="M6 9l6 6 6-6" /></svg></button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Tunnel */

/** Items fly towards the reader one by one through a light frame. Plain stacked list without motion. */
export function Tunnel({ head, children, tone = "" }: { head?: ReactNode; children: ReactNode; tone?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const rings = useRef<(HTMLSpanElement | null)[]>([]);
  const list = Children.toArray(children);
  const n = list.length;

  useStickyProgress(wrapRef, (p) => {
    items.current.forEach((el, i) => {
      if (!el) return;
      const t = p * (n + 0.35) - i; // below 0: far away; 0 to 1: passing the reader; above 1: gone
      const far = clamp(1 + t / 3);
      const s = t < 0 ? 0.22 + 0.33 * far : 0.55 + 0.6 * clamp(t * 1.6) + 0.5 * clamp((t - 0.75) / 0.25);
      const o = t < 0 ? 0.04 + 0.3 * far : t < 0.75 ? 1 : clamp(1 - (t - 0.75) / 0.25);
      const side = (i % 2 ? 1 : -1) * (t < 0 ? 16 * (1 - far) + 7 : 7 * (1 - clamp(t * 2.2)));
      el.style.transform = `translate(-50%,-50%) translateX(${side.toFixed(1)}vw) scale(${s.toFixed(3)})`;
      el.style.opacity = o.toFixed(3);
      el.style.zIndex = String(t >= 0 && t <= 1 ? 50 : 20 - Math.abs(Math.round(t)));
      el.style.pointerEvents = t >= 0 && o > 0.6 ? "auto" : "none";
      el.classList.toggle("is-now", t >= 0 && t < 0.75);
    });
    rings.current.forEach((el, k) => {
      if (!el) return;
      const t = (k / rings.current.length + p * 2.6) % 1;
      el.style.transform = `translate(-50%,-50%) scale(${(0.12 + t * 1.6).toFixed(3)})`;
      el.style.opacity = (t < 0.15 ? t / 0.15 : 1 - t).toFixed(3);
    });
  });

  return (
    <div ref={wrapRef} className={"cn cn-tunnel " + tone} style={{ ["--n" as string]: String(n) }}>
      <div className="cn-tunnel-stage">
        {head ? <div className="cn-tunnel-head">{head}</div> : null}
        <div className="cn-tunnel-space">
          {[0, 1, 2, 3, 4].map((k) => <span key={k} aria-hidden ref={(el) => { rings.current[k] = el; }} className="cn-ring" />)}
          <span aria-hidden className="cn-beam" />
          {list.map((c, i) => <div key={i} ref={(el) => { items.current[i] = el; }} className="cn-fly">{c}</div>)}
        </div>
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
