import { MAP_H, MAP_STATES, MAP_W } from "@/data/india-map";

/**
 * India infographic (founder, 9 Nov 2026): replaces the 3D WebGL map, which was slow and broke on
 * phones. A flat map drawn once as plain SVG (no script, no animation loop), each state shaded by its
 * number, plus the ranked list. Same official numbers as before: PIB release 2241313 (17 Mar 2026),
 * DPIIT-recognised startups with at least one woman director or partner, as on 31 Jan 2026.
 * Motion is CSS only: the bars grow and the states fade in when the section scrolls into view.
 */
const TOTAL = MAP_STATES.reduce((a, s) => a + s.total, 0);
const T2025 = MAP_STATES.reduce((a, s) => a + s.y2025, 0);
const MAX = Math.max(...MAP_STATES.map((s) => s.total));
const fmt = (n: number) => n.toLocaleString("en-IN");
const TOP = [...MAP_STATES].sort((a, b) => b.total - a.total).slice(0, 10);
/** Darker red for fewer startups, bright red for more (square root keeps small states visible). */
const shade = (n: number) => {
  const t = Math.sqrt(n / MAX);
  return `rgb(${Math.round(70 + 170 * t)},${Math.round(8 + 22 * t)},${Math.round(12 + 18 * t)})`;
};

export function IndiaInfographic({ hideMap = false }: { hideMap?: boolean } = {}) {
  return (
    <div className={"e-india grid items-center gap-6 " + (hideMap ? "mx-auto max-w-2xl" : "lg:grid-cols-[1.1fr_0.9fr]")}>
      {hideMap ? null : <figure className="e-india-map relative mx-auto w-full max-w-[560px]">
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} role="img" aria-label="Map of India shaded by the number of women-led startups in each state" className="h-auto w-full">
          {MAP_STATES.map((s, i) => (
            <path key={s.id} d={s.d} fill={shade(s.total)} stroke="#1a0a0a" strokeWidth={0.8} style={{ ["--i" as string]: String(i % 12) }}>
              <title>{`${s.name}: ${fmt(s.total)}`}</title>
            </path>
          ))}
          {TOP.slice(0, 5).map((s) => (
            <g key={s.id + "-l"} className="e-india-pin">
              <circle cx={s.cx} cy={s.cy} r={4.5} fill="#fff" />
              <text x={s.cx + 8} y={s.cy + 4} fontSize="15" fontWeight="700" fill="#fff" stroke="#000" strokeWidth={3} paintOrder="stroke">{fmt(s.total)}</text>
            </g>
          ))}
        </svg>
        <figcaption className="mt-2 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <span>Fewer</span><span aria-hidden className="h-2 w-28 rounded-full" style={{ background: `linear-gradient(90deg,${shade(40)},${shade(MAX)})` }} /><span>More</span>
        </figcaption>
      </figure>}

      <div className="g-tile p-5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4643ba]">All of India</p>
        <p className="mt-2 font-display text-4xl font-bold tracking-tight text-slate-900">{fmt(TOTAL)}</p>
        <p className="text-xs text-slate-500">startups with at least one woman director or partner, out of 2,12,283 recognised by DPIIT</p>
        <p className="mt-2 text-sm text-slate-600"><span className="font-semibold text-slate-900">{fmt(T2025)}</span> of them were recognised in 2025 alone.</p>
        <ul className="mt-5 space-y-2">
          {TOP.map((s, i) => (
            <li key={s.id}>
              <span className="flex justify-between text-xs"><span className="font-medium text-slate-700">{i + 1}. {s.name}</span><span className="font-semibold text-slate-900">{fmt(s.total)}</span></span>
              <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[#4643ba]/10"><span className="e-india-bar block h-full rounded-full bg-gradient-to-r from-[#8f86ff] to-[#4643ba]" style={{ width: `${(s.total / MAX) * 100}%`, ["--i" as string]: String(i) }} /></span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
          Data for 2025 and January 2026. The full 2026 numbers are released at the end of the year, around December.
          Source: <a href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2241313" target="_blank" rel="noopener noreferrer" className="underline">PIB, Ministry of Commerce and Industry, 17 Mar 2026</a> (data as on 31 Jan 2026). Jammu and Kashmir includes Ladakh. Boundaries: <a href="https://github.com/datameet/maps" target="_blank" rel="noopener noreferrer" className="underline">DataMeet</a>, CC BY 4.0.
        </p>
      </div>
    </div>
  );
}
