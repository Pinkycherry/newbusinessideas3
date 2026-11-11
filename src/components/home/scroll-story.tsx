import { Children, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Link } from "@tanstack/react-router";
import { createPortal } from "react-dom";
import { MAP_CITIES, MAP_H, MAP_STATES, MAP_W, type MapState } from "@/data/india-map";
import "./scroll-story.css";

/**
 * Home page scroll story (founder, 10 Nov 2026). Layout and motion only; every word and number comes
 * from content that was already on the page.
 *  - HeroStreams: thin light lines flowing into the hero.
 *  - IndiaJourney: the India map stays on screen while the page scrolls; it zooms into the leading
 *    states one by one, then back out. Tapping any state zooms to it.
 *  - FaqTunnel: the FAQ questions fly towards the reader before the answers.
 *  - OrbitMenu: a round button that fills as the page scrolls and opens the section links; it also
 *    holds the "Pause motion" switch.
 * Phones first: no scroll hijacking, only position:sticky plus transform and opacity. Without script,
 * with reduced motion, or with motion paused, everything falls back to the plain static layout
 * (the "ss-on" class on <html> is what turns the tall scroll stages on).
 */

const fmt = (n: number) => n.toLocaleString("en-IN");
export const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const KEY = "bbi-motion";
export const isOn = () => typeof document !== "undefined" && document.documentElement.classList.contains("ss-on");

/** Progress (0 to 1) of a tall wrapper as it scrolls past its sticky stage. One rAF per scroll burst. */
export function useStickyProgress(ref: RefObject<HTMLElement | null>, cb: (p: number) => void) {
  const fn = useRef(cb);
  fn.current = cb;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0, near = false;
    const run = () => {
      raf = 0;
      if (!isOn()) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      fn.current(span > 0 ? clamp(-r.top / span) : 0);
    };
    const ask = () => { if (near && !raf) raf = requestAnimationFrame(run); };
    const io = new IntersectionObserver((e) => { near = e.some((x) => x.isIntersecting); ask(); }, { rootMargin: "200px 0px" });
    io.observe(el);
    window.addEventListener("scroll", ask, { passive: true });
    window.addEventListener("resize", ask);
    return () => { io.disconnect(); window.removeEventListener("scroll", ask); window.removeEventListener("resize", ask); if (raf) cancelAnimationFrame(raf); };
  }, [ref]);
}

/* ------------------------------------------------------------------ Hero */

export function HeroStreams() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    let raf = 0, seen = true, w = 0, h = 0, last = 0;
    const N = window.innerWidth < 640 ? 22 : 44;
    const lines = Array.from({ length: N }, (_, i) => ({ y: (Math.floor(i / 2) * 2 + 1) / N, bend: Math.random() * 0.5 - 0.25, sp: 0.05 + Math.random() * 0.09, off: Math.random(), red: i % 3 !== 0, right: i % 2 === 1 }));
    const size = () => {
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = Math.round(w * d); cv.height = Math.round(h * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    const pt = (l: (typeof lines)[number], t: number, fx: number, fy: number) => {
      const y0 = l.y * h, x0 = l.right ? w + 20 : -20, cx = l.right ? w - (w - fx) * 0.45 : fx * 0.45, cy = y0 + l.bend * h, u = 1 - t;
      return [u * u * x0 + 2 * u * t * cx + t * t * fx, u * u * y0 + 2 * u * t * cy + t * t * fy] as const;
    };
    const draw = (now: number) => {
      raf = 0;
      // Lines come in from both edges and meet in the middle (as on the reference), not only from the left.
      const fx = w * 0.5, fy = h * 0.46;
      ctx.clearRect(0, 0, w, h);
      for (const l of lines) {
        ctx.beginPath();
        const x0 = l.right ? w + 20 : -20, cx = l.right ? w - (w - fx) * 0.45 : fx * 0.45;
        ctx.moveTo(x0, l.y * h);
        ctx.quadraticCurveTo(cx, l.y * h + l.bend * h, fx, fy);
        ctx.strokeStyle = l.red ? "rgba(224,27,31,.2)" : "rgba(255,255,255,.1)";
        ctx.lineWidth = 0.7;
        ctx.stroke();
        const t = (l.off + (now / 1000) * l.sp) % 1;
        const [x, y] = pt(l, t, fx, fy);
        const [x2, y2] = pt(l, Math.max(0, t - 0.05), fx, fy);
        const g = ctx.createLinearGradient(x2, y2, x, y);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(1, l.red ? "rgba(255,90,80,.9)" : "rgba(255,255,255,.75)");
        ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x, y);
        ctx.strokeStyle = g; ctx.lineWidth = 1.3; ctx.stroke();
      }
    };
    const loop = (now: number) => {
      if (!seen || document.hidden || !isOn()) { raf = 0; return; }
      if (now - last > 32) { last = now; draw(now); }
      raf = requestAnimationFrame(loop);
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(loop); };
    size(); draw(0);
    const io = new IntersectionObserver((e) => { seen = e.some((x) => x.isIntersecting); wake(); });
    io.observe(cv);
    const onResize = () => { size(); draw(performance.now()); };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", wake);
    window.addEventListener("ss-motion", wake);
    wake();
    return () => { io.disconnect(); window.removeEventListener("resize", onResize); document.removeEventListener("visibilitychange", wake); window.removeEventListener("ss-motion", wake); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} aria-hidden className="ss-streams" />;
}

/* ------------------------------------------------------------ Count up */

export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    const end = Number(value.replace(/[^\d]/g, ""));
    if (!el || !end || !/^[\d,]+$/.test(value)) return;
    const io = new IntersectionObserver((e) => {
      if (!e.some((x) => x.isIntersecting)) return;
      io.disconnect();
      if (!isOn()) return;
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = clamp((now - t0) / 1400);
        el.textContent = fmt(Math.round(end * ease(t)));
        if (t < 1) requestAnimationFrame(tick); else el.textContent = value;
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref} className="tabular-nums">{value}</span>;
}

/* --------------------------------------------------------- India journey */

const MAXT = Math.max(...MAP_STATES.map((s) => s.total));
const TOTAL = MAP_STATES.reduce((a, s) => a + s.total, 0);
const RANKED = [...MAP_STATES].sort((a, b) => b.total - a.total);
const shade = (n: number) => {
  const t = Math.sqrt(n / MAXT);
  return `rgb(${Math.round(70 + 170 * t)},${Math.round(8 + 22 * t)},${Math.round(12 + 18 * t)})`;
};
const FULL = [0, 0, MAP_W, MAP_H];
const boxFor = (s: MapState | null) => {
  if (!s) return FULL;
  const [x0 = 0, y0 = 0, x1 = MAP_W, y1 = MAP_H] = s.box;
  const ratio = MAP_W / MAP_H;
  let w = Math.max((x1 - x0) * 1.9, 150), h = Math.max((y1 - y0) * 1.9, 150 / ratio);
  if (w / h > ratio) h = w / ratio; else w = h * ratio;
  return [(x0 + x1) / 2 - w / 2, (y0 + y1) / 2 - h / 2, w, h];
};

export function IndiaJourney() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const view = useRef(FULL);
  const stops = useMemo<(MapState | null)[]>(() => [null, ...RANKED.slice(0, 6), null], []);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<MapState | null>(null);
  const focus = picked ?? stops[step] ?? null;
  const finale = !picked && step === stops.length - 1;

  useStickyProgress(wrapRef, (p) => {
    const next = Math.min(stops.length - 1, Math.floor(p * stops.length));
    setStep((cur) => { if (cur !== next) setPicked(null); return next; });
  });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const from = view.current, to = boxFor(focus);
    if (!isOn()) { view.current = to; svg.setAttribute("viewBox", to.join(" ")); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = ease(clamp((now - t0) / 750));
      const v = from.map((a, i) => a + ((to[i] ?? a) - a) * t);
      view.current = v;
      svg.setAttribute("viewBox", v.map((n) => n.toFixed(1)).join(" "));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [focus]);

  const delhi = MAP_CITIES.find((c) => c.name === "Delhi");
  const rank = focus ? RANKED.indexOf(focus) + 1 : 0;

  return (
    <div ref={wrapRef} className="ss-india" style={{ ["--stops" as string]: String(stops.length) }}>
      <div className="ss-india-stage">
        <figure className="ss-india-map">
          <svg ref={svgRef} viewBox={FULL.join(" ")} role="img" aria-label="Map of India shaded by the number of women-led startups in each state" preserveAspectRatio="xMidYMid meet">
            {MAP_STATES.map((s) => (
              <path
                key={s.id}
                d={s.d}
                fill={focus === s ? "#ff3b30" : shade(s.total)}
                stroke={focus === s ? "#fff" : "#1a0a0a"}
                strokeWidth={focus === s ? 1.4 : 0.8}
                vectorEffect="non-scaling-stroke"
                className={"ss-state" + (focus && focus !== s ? " is-dim" : "")}
                onClick={() => setPicked((cur) => (cur === s ? null : s))}
              >
                <title>{`${s.name}: ${fmt(s.total)}`}</title>
              </path>
            ))}
            {finale && delhi ? (
              <g className="ss-arcs" aria-hidden>
                {MAP_CITIES.filter((c) => c !== delhi).map((c, i) => (
                  <path key={c.name} pathLength={1} d={`M${c.x},${c.y} Q${(c.x + delhi.x) / 2},${Math.min(c.y, delhi.y) - 70} ${delhi.x},${delhi.y}`} style={{ animationDelay: `${i * 90}ms` }} />
                ))}
                {MAP_CITIES.map((c) => <circle key={c.name} cx={c.x} cy={c.y} r={3.2} />)}
              </g>
            ) : null}
          </svg>
        </figure>

        <div className="ss-india-card g-tile" aria-live="polite">
          {focus ? (
            <div key={focus.id} className="ss-swap">
              <p className="ss-eyebrow">No. {rank} of {MAP_STATES.length}</p>
              <p className="ss-big">{focus.name}</p>
              <p className="ss-num"><CountKey n={focus.total} /></p>
              <p className="ss-sub">startups with at least one woman director or partner</p>
              <p className="ss-sub"><b>{fmt(focus.y2025)}</b> of them were recognised in 2025 alone.</p>
            </div>
          ) : (
            <div key="all" className="ss-swap">
              <p className="ss-eyebrow">All of India</p>
              <p className="ss-num"><CountKey n={TOTAL} /></p>
              <p className="ss-sub">startups with at least one woman director or partner, out of 2,12,283 recognised by DPIIT</p>
            </div>
          )}
          <div className="ss-dots">
            {stops.map((s, i) => (
              <span key={i} className={i === step && !picked ? "is-on" : ""} title={s ? s.name : "All of India"} />
            ))}
            {picked ? <button type="button" className="ss-reset" onClick={() => setPicked(null)}>All of India</button> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Rolls to a new number each time it changes. */
function CountKey({ n }: { n: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !isOn()) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = clamp((now - t0) / 700);
      el.textContent = fmt(Math.round(n * ease(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [n]);
  return <span ref={ref} className="tabular-nums">{fmt(n)}</span>;
}

/* ------------------------------------------------------------ FAQ tunnel */

export function FaqTunnel({ questions, target }: { questions: string[]; target: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const rings = useRef<(HTMLSpanElement | null)[]>([]);
  const n = questions.length;

  useStickyProgress(wrapRef, (p) => {
    cards.current.forEach((el, i) => {
      if (!el) return;
      const t = p * (n + 0.6) - i; // below 0: far away; 0 to 1: passing the reader; above 1: gone
      const far = clamp(1 + t / 3);
      const s = t < 0 ? 0.25 + 0.3 * far : 0.55 + 0.75 * clamp(t);
      const o = t < 0 ? 0.12 + 0.4 * far : t < 0.7 ? 1 : clamp(1 - (t - 0.7) / 0.3);
      const side = (i % 2 ? 1 : -1) * (t < 0 ? 14 * (1 - far) + 6 : 6 * (1 - clamp(t * 2)));
      el.style.transform = `translate(-50%,-50%) translateX(${side.toFixed(1)}vw) scale(${s.toFixed(3)})`;
      el.style.opacity = o.toFixed(3);
      el.style.zIndex = String(t >= 0 && t <= 1 ? 50 : 20 - Math.abs(Math.round(t)));
      el.style.pointerEvents = o > 0.6 ? "auto" : "none";
    });
    rings.current.forEach((el, k) => {
      if (!el) return;
      const t = (k / rings.current.length + p * 2.4) % 1;
      el.style.transform = `translate(-50%,-50%) scale(${(0.15 + t * 1.5).toFixed(3)})`;
      el.style.opacity = (t < 0.15 ? t / 0.15 : 1 - t).toFixed(3);
    });
  });

  const open = (i: number) => {
    const list = document.querySelectorAll<HTMLDetailsElement>(`${target} details`);
    const d = list[i];
    if (!d) return;
    d.open = true;
    d.scrollIntoView({ behavior: isOn() ? "smooth" : "auto", block: "center" });
  };

  return (
    <div ref={wrapRef} className="ss-tunnel" aria-hidden style={{ ["--n" as string]: String(n) }}>
      <div className="ss-tunnel-stage">
        {[0, 1, 2, 3, 4].map((k) => <span key={k} ref={(el) => { rings.current[k] = el; }} className="ss-ring" />)}
        <span className="ss-beam" />
        {questions.map((q, i) => (
          <div key={q} ref={(el) => { cards.current[i] = el; }} className="ss-q" onClick={() => open(i)}>
            <span className="ss-q-n">{String(i + 1).padStart(2, "0")}</span>
            {q}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Card reel */

/**
 * A row of cards that stays on screen and travels sideways while the page scrolls (rev = left to right).
 * Cards turn towards the reader as they pass the middle, which lifts the centre card. Without motion the
 * same list is a plain swipeable row.
 */
export function CardReel({ head, children, rev = false }: { head: ReactNode; children: ReactNode; rev?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const geo = useRef<{ max: number; vw: number; sw: number; mids: number[] }>({ max: 0, vw: 0, sw: 0, mids: [] });
  useEffect(() => {
    const measure = () => {
      const tr = trackRef.current;
      if (!tr) return;
      const vw = window.innerWidth;
      geo.current = { vw, sw: tr.offsetWidth, max: Math.max(0, tr.offsetWidth - vw), mids: Array.from(tr.children).map((c) => (c as HTMLElement).offsetLeft + (c as HTMLElement).offsetWidth / 2) };
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("ss-motion", measure);
    const tr = trackRef.current;
    const reset = () => { if (isOn() || !tr) return; tr.style.transform = ""; Array.from(tr.children).forEach((c) => { (c as HTMLElement).style.transform = ""; (c as HTMLElement).style.opacity = ""; }); };
    window.addEventListener("ss-motion", reset);
    return () => { window.removeEventListener("resize", measure); window.removeEventListener("ss-motion", measure); window.removeEventListener("ss-motion", reset); };
  }, []);
  useStickyProgress(wrapRef, (p) => {
    const tr = trackRef.current;
    if (!tr) return;
    if (!geo.current.mids.length || geo.current.vw !== window.innerWidth || geo.current.sw !== tr.offsetWidth) {
      geo.current = { vw: window.innerWidth, sw: tr.offsetWidth, max: Math.max(0, tr.offsetWidth - window.innerWidth), mids: Array.from(tr.children).map((c) => (c as HTMLElement).offsetLeft + (c as HTMLElement).offsetWidth / 2) };
    }
    const { max, vw, mids } = geo.current;
    const x = -(rev ? 1 - p : p) * max;
    tr.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    const kids = tr.children;
    for (let i = 0; i < kids.length; i++) {
      const d = clamp(((mids[i] ?? 0) + x - vw / 2) / (vw * 0.6), -1, 1), a = Math.abs(d);
      const el = kids[i] as HTMLElement;
      el.style.transform = `perspective(1000px) rotateY(${(-d * 24).toFixed(2)}deg) translateY(${(a * 22).toFixed(1)}px) scale(${(1.04 - a * 0.14).toFixed(3)})`;
      el.style.opacity = (1 - a * 0.45).toFixed(3);
      el.style.zIndex = String(10 - Math.round(a * 10));
      el.classList.toggle("is-mid", a < 0.3);
    }
  });
  return (
    <div ref={wrapRef} className="ss-reel" style={{ ["--len" as string]: String(Children.count(children)) }}>
      <div className="ss-reel-stage">
        {head}
        <ul ref={trackRef} className="ss-reel-track">{children}</ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Orbit menu */

/** Headings, cards, panels and pictures that rise into place as the reader scrolls, on any page. */
const CARD_SEL = '.ember main :is(h2, .g-tile, details, article, figure, [class*="rounded-2xl"], [class*="rounded-3xl"], a[href^="/idea/"][class*="rounded"], a[href^="/category/"][class*="rounded"])';

export type OrbitLink = { label: string; href: string };

export function OrbitMenu({ links, raised = false }: { links: OrbitLink[]; raised?: boolean }) {
  const ring = useRef<SVGCircleElement>(null);
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    let stored: string | null = null;
    try { stored = localStorage.getItem(KEY); } catch { /* private window */ }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const off = stored === "off" || (reduce && stored !== "on");
    setPaused(off);
    root.classList.toggle("ss-on", !off);
    root.classList.toggle("ss-off", off);
    root.classList.add("has-orbit");
    // Cards rise into place as they scroll in (every page). Only cards that are below the screen when the
    // page opens are held back, so anything added later is never left hidden.
    let rise: IntersectionObserver | null = null;
    const riseTimer = window.setTimeout(() => {
      if (off || !("IntersectionObserver" in window)) return;
      rise = new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("ss-rise-in");
        rise?.unobserve(e.target);
      }), { rootMargin: "0px 0px -6% 0px" });
      let k = 0;
      const vh = window.innerHeight;
      Array.from(document.querySelectorAll<HTMLElement>(CARD_SEL)).slice(0, 500).forEach((el) => {
        if (el.closest(".cn,.ss-reel,.ss-india,.ss-tunnel,.g-marquee,.e-mq,.mm-header,.v2-footer,[data-loop-copy]") || el.parentElement?.closest(".ss-rise")) return;
        const r = el.getBoundingClientRect();
        if (r.top < vh || r.height > vh * 1.4 || r.height < 24) return;
        const pos = getComputedStyle(el).position;
        if (pos === "fixed" || pos === "sticky") return;
        // Headings come in from the left; everything else alternates left and right.
        el.style.setProperty("--dx", el.tagName === "H2" ? "-30px" : k % 2 ? "22px" : "-22px");
        el.style.setProperty("--k", String(k++ % 3));
        el.classList.add("ss-rise");
        rise?.observe(el);
      });
    }, 400);
    let raf = 0;
    const run = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? clamp(window.scrollY / max) : 0;
      if (ring.current) ring.current.style.strokeDashoffset = String(1 - p);
      setShown(window.scrollY > 320);
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(run); };
    window.addEventListener("scroll", ask, { passive: true });
    run();
    return () => {
      window.removeEventListener("scroll", ask);
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(riseTimer);
      rise?.disconnect();
      document.querySelectorAll(".ss-rise").forEach((el) => el.classList.remove("ss-rise", "ss-rise-in"));
      root.classList.remove("ss-on", "ss-off", "has-orbit");
    };
  }, []);

  const toTop = () => { setOpen(false); window.scrollTo({ top: 0, behavior: isOn() ? "smooth" : "auto" }); };
  const toggleMotion = () => {
    const next = !paused;
    setPaused(next);
    document.documentElement.classList.toggle("ss-on", !next);
    document.documentElement.classList.toggle("ss-off", next);
    try { localStorage.setItem(KEY, next ? "off" : "on"); } catch { /* private window */ }
    window.dispatchEvent(new Event("ss-motion"));
    window.dispatchEvent(new Event("scroll"));
  };

  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => setHost(document.body), []);
  // Table of contents (founder, 11 Nov 2026): the round button lists THIS page's own sections, read from
  // its headings each time it opens, plus Back to top. No site menu here: that is the header's job.
  const [toc, setToc] = useState<{ t: string; el: HTMLElement; on: boolean }[]>([]);
  const scan = () => {
    const hs = Array.from(document.querySelectorAll<HTMLElement>("main h2")).filter((h) => h.offsetParent !== null && (h.textContent ?? "").trim().length > 2 && !h.closest("[aria-hidden=true],[data-loop-copy],details,.mm-header,.cn-fly"));
    const y = window.innerHeight * 0.45;
    let cur = -1;
    hs.forEach((h, i) => { if (h.getBoundingClientRect().top < y) cur = i; });
    setToc(hs.slice(0, 40).map((h, i) => ({ t: (h.textContent ?? "").trim().replace(/\s+/g, " "), el: h, on: i === cur })));
  };
  const [start, setStart] = useState(0);
  const toggle = () => {
    if (!open) {
      scan();
      const hs = document.querySelectorAll("main h2").length;
      void hs;
    }
    setOpen(!open);
  };
  // Open on the part of the list that holds the section being read.
  useEffect(() => {
    if (!open) return;
    const cur = toc.findIndex((x) => x.on);
    const size = window.matchMedia("(min-width: 1024px)").matches ? 7 : 5;
    setStart(Math.max(0, Math.min(Math.max(0, toc.length - size), cur - Math.floor(size / 2))));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, toc.length]);
  useEffect(() => {
    if (!open) return;
    const out = (e: Event) => { if (!(e.target as HTMLElement).closest?.(".ss-orbit")) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", out);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", out); document.removeEventListener("keydown", esc); };
  }, [open]);
  const go = (el: HTMLElement) => {
    setOpen(false);
    const top = el.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({ top, behavior: isOn() ? "smooth" : "auto" });
  };
  void links;
  const showMenu = () => {
    setOpen(false);
    document.querySelector(".mm-header")?.classList.remove("is-away");
    (document.querySelector(".mm-header button, .mm-header a") as HTMLElement | null)?.focus({ preventScroll: true });
  };
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const m = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  if (!host) return null;

  // The fan (as on the reference): each section of THIS page is a pill on a curve beside the button, joined
  // to it by a dotted line. At most seven sections, picked evenly, so the fan always fits the screen.
  // Founder, 12 Nov 2026: the fan look, organised. The fan shows the page's sections IN ORDER, a few at a time
  // around the one being read (marked red); the arrows at each end move through the rest. No numbers, no
  // skipped sections. Menu, Back to top and Pause motion sit closest to the button.
  const WIN = wide ? 7 : 5;
  const maxStart = Math.max(0, toc.length - WIN);
  const from = Math.min(start, maxStart);
  const win = toc.slice(from, from + WIN);
  type Item = { key: string; node: ReactNode; small?: boolean; on?: boolean };
  const arrow = (dir: -1 | 1) => (
    <button type="button" className="ss-fan-more" aria-label={dir < 0 ? "Earlier sections" : "Later sections"} onClick={() => setStart(Math.max(0, Math.min(maxStart, from + dir * (WIN - 1))))}>
      <svg viewBox="0 0 24 24" aria-hidden><path d={dir < 0 ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} /></svg>
    </button>
  );
  const items: Item[] = [
    ...(from > 0 ? [{ key: "up", small: true, node: arrow(-1) }] : []),
    ...win.map((x, k) => ({ key: "s" + (from + k), on: x.on, node: <button type="button" title={x.t} onClick={() => go(x.el)}>{x.t}</button> })),
    ...(from < maxStart ? [{ key: "down", small: true, node: arrow(1) }] : []),
    { key: "menu", small: true, node: <button type="button" className="ss-fan-menu" onClick={showMenu}>Menu</button> },
    { key: "top", small: true, node: <button type="button" onClick={toTop}>Back to top</button> },
    { key: "motion", small: true, node: <button type="button" onClick={toggleMotion} aria-pressed={paused}>{paused ? "Play motion" : "Pause motion"}</button> },
  ];
  const n = items.length;
  const vh = typeof window === "undefined" ? 800 : window.innerHeight;
  const gap = wide ? Math.min(50, (vh - 120) / Math.max(1, n)) : Math.min(46, (vh - 92 - 30 - 84) / Math.max(1, n));
  const place = (i: number) => {
    if (wide) {
      const u = n > 1 ? (i / (n - 1)) * 2 - 1 : 0; // -1 top, 1 bottom
      return { x: -(58 + 64 * Math.cos((u * Math.PI) / 2)), y: (i - (n - 1) / 2) * gap };
    }
    const k = n - 1 - i; // first section highest, last item nearest the button
    const u = n > 1 ? k / (n - 1) : 0;
    return { x: -(8 + 40 * Math.sin(u * Math.PI)), y: -(58 + k * gap) };
  };

  // On the body, so no page section or the footer can sit above it.
  return createPortal(
    <>
      <span aria-hidden className="ss-vignette" />
      <div className={"ss-orbit" + (open ? " is-open" : "") + (shown ? " is-shown" : "") + (raised ? " is-raised" : "")}>
        <ul className="ss-fan" aria-hidden={!open}>
          {items.map((it, i) => {
            const { x, y } = place(i);
            const len = Math.hypot(x, y), ang = (Math.atan2(y, x) * 180) / Math.PI;
            return (
              <li key={it.key} className={(it.small ? "is-small" : "") + (it.on ? " is-on" : "")} style={{ ["--x" as string]: `${x.toFixed(1)}px`, ["--y" as string]: `${y.toFixed(1)}px`, ["--i" as string]: String(i) }}>
                <span aria-hidden className="ss-fan-line" style={{ width: `${Math.max(0, len - 34).toFixed(1)}px`, transform: `rotate(${(ang + 180).toFixed(2)}deg)` }} />
                {it.node}
              </li>
            );
          })}
        </ul>
        <button type="button" className="ss-orbit-btn" aria-expanded={open} aria-label="On this page" onClick={toggle}>
          <svg viewBox="0 0 60 60" aria-hidden>
            <circle cx="30" cy="30" r="27" className="ss-orbit-track" />
            <circle ref={ring} cx="30" cy="30" r="27" pathLength={1} className="ss-orbit-fill" />
          </svg>
          <span className="ss-orbit-mark">b<b>b</b></span>
        </button>
      </div>
    </>,
    host,
  );
}
