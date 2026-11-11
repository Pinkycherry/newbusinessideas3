import { useEffect, useRef, useState, type ReactNode } from "react";
import { clamp, isOn, useStickyProgress } from "./scroll-story";

/**
 * Scroll film (founder, 11 Nov 2026): still photographs of the same place from closer and closer camera
 * positions. The stage stays on screen while the page scrolls; each frame zooms in and dissolves into
 * the next, so it reads as one camera move. Text slides and cut-out people sit on top, one step at a
 * time. Numbers in the bubbles are the founder's own keyword research and are drawn here, never baked
 * into an image. With motion paused (html.ss-off) it is a plain picture with the text under it.
 */
export type FilmPerson = { src: string; w: number; h: number; at: number[]; group?: number; label?: string; n?: number; who?: string; line?: string };

export function Film({ id, frames, slides, people = [], note, alt, solo }: { id: string; frames: string[]; slides: ReactNode[]; people?: FilmPerson[]; note?: string; alt: string; solo?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const imgs = useRef<(HTMLImageElement | null)[]>([]);
  const bar = useRef<HTMLSpanElement>(null);
  const [step, setStep] = useState(0);
  const n = frames.length;
  useStickyProgress(wrap, (p) => {
    imgs.current.forEach((el, i) => {
      if (!el) return;
      const t = p * n - i; // 0 to 1 while this frame is the scene
      // Only the frame on screen and its neighbours are touched; the rest stay parked (smoother on phones).
      if (i > 0 && (t < -0.4 || t > 2.4)) { if (el.style.visibility !== "hidden") el.style.visibility = "hidden"; return; }
      el.style.visibility = "visible";
      el.style.opacity = i === 0 ? "1" : clamp((t + 0.3) / 0.3).toFixed(3);
      el.style.transform = `scale(${(1 + 0.24 * clamp(t + 0.3, 0, 1.3)).toFixed(4)})`;
    });
    if (bar.current) bar.current.style.transform = `scaleY(${p.toFixed(3)})`;
    setStep(Math.min(n - 1, Math.floor(p * n * 0.999)));
  });
  return (
    <div ref={wrap} id={id} className="cn fm" style={{ ["--n" as string]: String(n) }} data-step={step}>
      <div className="fm-stage">
        <div className="fm-frames" role="img" aria-label={alt}>
          {frames.map((src, i) => <img key={src} ref={(el) => { imgs.current[i] = el; }} src={src} alt="" width={1672} height={941} decoding="async" loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : "auto"} style={i ? { opacity: 0 } : undefined} />)}
        </div>
        <span aria-hidden className="fm-shade" />
        {people.length ? (
          <ul className={"fm-people" + (solo ? " fm-solo" : "")} aria-label={note}>
            {people.map((p, i) => (
              <li key={p.src} className={(p.at.includes(step) ? "is-on" : "") + (p.group ? " g" + p.group : "")} style={{ ["--i" as string]: String(i), ["--k" as string]: String(i % 3) }}>
                {p.label ? <Bubble label={p.label} n={p.n ?? 0} on={p.at.includes(step)} who={p.who} line={p.line} /> : null}
                <img src={p.src} alt="" width={p.w} height={p.h} loading="lazy" decoding="async" />
              </li>
            ))}
          </ul>
        ) : null}
        {slides.map((s, i) => <div key={i} className={"fm-slide fm-slide-" + i + (i === step ? " is-on" : "")}>{s}</div>)}
        {note ? <p className={"fm-note" + (people.some((p) => p.label && p.at.includes(step)) ? " is-on" : "")}>{note}</p> : null}
        <span aria-hidden className="fm-bar"><span ref={bar} /></span>
      </div>
    </div>
  );
}

function Bubble({ label, n, on, who, line }: { label: string; n: number; on: boolean; who?: string | undefined; line?: string | undefined }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = (v: number) => Math.round(v).toLocaleString("en-IN");
    if (!on || !isOn()) { el.textContent = fmt(n); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => { const t = clamp((now - t0) / 1100); el.textContent = fmt(n * (0.4 + 0.6 * (1 - Math.pow(1 - t, 3)))); if (t < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, n]);
  return (
    <span className="fm-bub">
      {who ? <em className="fm-who">{who}</em> : null}
      <small>Looking for</small>
      <span>{label}</span>
      <b ref={ref}>{n.toLocaleString("en-IN")}</b>
      <small className="fm-per">searches a month</small>
      {line ? <q className="fm-line">{line}</q> : null}
      <i aria-hidden /><i aria-hidden />
    </span>
  );
}
