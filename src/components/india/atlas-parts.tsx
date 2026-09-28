import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import type { HeroVariant, IndiaSource } from "@/lib/india-shared";

export function AtlasRoot({ children }: { children: ReactNode }) {
  return (
    <div className="india-atlas ia">
      <div className="ia-wrap">{children}</div>
    </div>
  );
}

export function Masthead({
  crumbs,
}: {
  crumbs: { label: string; to?: string; params?: Record<string, string> }[];
}) {
  return (
    <div className="ia-masthead">
      <nav aria-label="Breadcrumb" className="ia-crumbs">
        {crumbs.map((c, i) => (
          <span key={c.label} className="ia-crumbs">
            {i > 0 && <span aria-hidden="true">/</span>}
            {c.to ? (
              <Link to={c.to} params={c.params as never}>
                {c.label}
              </Link>
            ) : (
              <span aria-current="page">{c.label}</span>
            )}
          </span>
        ))}
      </nav>
      <span className="ia-edition">India edition</span>
    </div>
  );
}

/** Shown whenever the data is the draft fixture set, never real research. */
export function DraftNotice({ source }: { source: IndiaSource }) {
  if (source !== "fixture") return null;
  return (
    <p className="ia-draft">
      <strong>Draft preview.</strong> These are concept sketches for a section that is still being
      built. They are not researched or verified business ideas, and budgets and time are not
      estimated yet.
    </p>
  );
}

export function Pager({
  page,
  pageCount,
  prev,
  next,
}: {
  page: number;
  pageCount: number;
  prev: ReactNode;
  next: ReactNode;
}) {
  if (pageCount <= 1) return null;
  return (
    <nav className="ia-pager" aria-label="Pages">
      <span>{page > 1 ? prev : null}</span>
      <span>
        Page {page} of {pageCount}
      </span>
      <span>{page < pageCount ? next : null}</span>
    </nav>
  );
}

/**
 * Four reusable hero compositions, one per kind of set. Same palette, a few
 * strokes each: CSS/SVG only, zero image bytes. Decorative, so aria-hidden.
 */
export function HeroPlate({ variant, count }: { variant: HeroVariant; count: number }) {
  return (
    <div className="ia-plate" aria-hidden="true">
      <svg viewBox="0 0 400 260" role="presentation" focusable="false">
        <rect width="400" height="260" fill="#270a0a" />
        {variant === "ledger" && <Ledger />}
        {variant === "wiring" && <Wiring />}
        {variant === "console" && <Console />}
        {variant === "route" && <Route />}
      </svg>
      <p className="ia-plate-count">
        <small>In this set</small>
        {String(count).padStart(2, "0")}
      </p>
    </div>
  );
}

const stroke = { stroke: "#8e5647", strokeWidth: 1.5, fill: "none" } as const;

function Ledger() {
  return (
    <g>
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1="150" x2="370" y1={40 + i * 22} y2={40 + i * 22} {...stroke} />
      ))}
      <line x1="300" x2="300" y1="28" y2="232" stroke="#ca0808" strokeWidth="2" />
      <text x="318" y="70" fill="#f3c3ad" fontSize="34" fontFamily="Poppins, sans-serif">
        ₹
      </text>
      <rect x="170" y="120" width="110" height="10" fill="#6b3f35" />
      <rect x="170" y="164" width="80" height="10" fill="#6b3f35" />
    </g>
  );
}

function Wiring() {
  const nodes = [
    [170, 60],
    [260, 50],
    [350, 90],
    [210, 140],
    [320, 170],
    [250, 220],
  ];
  return (
    <g>
      <path
        d="M170 60 L260 50 L350 90 L320 170 L250 220 L210 140 Z M260 50 L210 140 M350 90 L210 140"
        {...stroke}
      />
      {nodes.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i === 3 ? 10 : 6}
          fill={i === 3 ? "#ca0808" : "#3d100d"}
          stroke="#f3c3ad"
          strokeWidth="1.5"
        />
      ))}
    </g>
  );
}

function Console() {
  return (
    <g>
      <rect x="150" y="70" width="230" height="130" rx="10" {...stroke} />
      <path d="M200 120 h16 v-16 h14 v16 h16 v14 h-16 v16 h-14 v-16 h-16 Z" fill="#6b3f35" />
      <circle cx="320" cy="118" r="11" fill="#ca0808" />
      <circle cx="345" cy="145" r="11" fill="#3d100d" stroke="#f3c3ad" strokeWidth="1.5" />
      <line x1="255" x2="285" y1="175" y2="175" stroke="#8e5647" strokeWidth="4" />
    </g>
  );
}

function Route() {
  return (
    <g>
      {Array.from({ length: 6 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={150 + i * 44}
          x2={150 + i * 44}
          y1="30"
          y2="230"
          {...stroke}
          strokeOpacity="0.5"
        />
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <line
          key={`h${i}`}
          x1="150"
          x2="370"
          y1={40 + i * 46}
          y2={40 + i * 46}
          {...stroke}
          strokeOpacity="0.5"
        />
      ))}
      <path
        d="M172 212 L172 132 L238 132 L238 86 L326 86 L326 52"
        fill="none"
        stroke="#ca0808"
        strokeWidth="3"
      />
      <circle cx="172" cy="212" r="7" fill="#f3c3ad" />
      <circle cx="326" cy="52" r="7" fill="#ca0808" />
    </g>
  );
}
