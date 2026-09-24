/**
 * The cinema trial's icon family: eighteen original marks drawn for business
 * research, not a stock set.
 *
 * One grammar for all of them: a 24px box, a 1.6 stroke, round caps and
 * joins, drawn in `currentColor`, and exactly one detail per mark in the
 * accent (`.ci-accent`, the red rail color set in styles.css). Every icon is
 * decorative: the text beside it carries the meaning, so each svg is
 * aria-hidden and focusable="false".
 */

export type CinemaIconName =
  | "opportunity"
  | "customer"
  | "revenue"
  | "edge"
  | "cost"
  | "income"
  | "launch"
  | "tools"
  | "timeline"
  | "demand"
  | "risk"
  | "verdict"
  | "strength"
  | "calculator"
  | "guide"
  | "glossary"
  | "journal"
  | "arrow";

type Mark = { base: string; accent: string };

const MARKS: Record<CinemaIconName, Mark> = {
  // An aperture opening: the rim, three blades, and the light at its centre.
  opportunity: {
    base: "M12 4a8 8 0 1 1 0 16a8 8 0 0 1 0-16M12 4l2.6 7M20 12.6l-7.4.6M7.2 18.4l3-6.6",
    accent: "M12 10.4a1.6 1.6 0 1 1 0 3.2a1.6 1.6 0 0 1 0-3.2",
  },
  // A focused audience: two rings and four sighting ticks.
  customer: {
    base: "M12 4.5a7.5 7.5 0 1 1 0 15a7.5 7.5 0 0 1 0-15M12 8.2a3.8 3.8 0 1 1 0 7.6a3.8 3.8 0 0 1 0-7.6M12 1.8v2.2M12 20v2.2M1.8 12H4M20 12h2.2",
    accent: "M12 11a1 1 0 1 1 0 2a1 1 0 0 1 0-2",
  },
  // Money flowing down into a ledger.
  revenue: {
    base: "M5.5 11h13a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-6A1.5 1.5 0 0 1 5.5 11M8 15h8M8 17.5h4.5",
    accent: "M12 2.5v6M9.2 5.9l2.8 2.8l2.8-2.8",
  },
  // A shield with one route through it that no one else takes.
  edge: {
    base: "M12 3l7 2.8v5.4c0 4.3-2.9 7.6-7 9.6c-4.1-2-7-5.3-7-9.6V5.8z",
    accent: "M8.6 14l2.4-2.6l2 1.6l2.6-3.6",
  },
  // Three slabs of stock, the first one bought.
  cost: {
    base: "M4 12.2l8 4l8-4M4 16.2l8 4l8-4",
    accent: "M12 4l8 4l-8 4l-8-4z",
  },
  // A ledger with output leaving it.
  income: {
    base: "M5.5 3.5h9A1.5 1.5 0 0 1 16 5v5M16 19v0.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 19.5V5a1.5 1.5 0 0 1 1.5-1.5M7.5 8.5h5M7.5 12h4",
    accent: "M11 15.5h10M18 12.5l3 3l-3 3",
  },
  // A staged ascent, with the next stage marked.
  launch: {
    base: "M3 20.5h5v-5h5v-5h5V6",
    accent: "M15.5 3.5H21V9",
  },
  // A modular kit: four bays, one loaded.
  tools: {
    base: "M4.5 3.5h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1M14.5 3.5h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1M4.5 13.5h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1",
    accent:
      "M14.5 13.5h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1M13.5 17h7",
  },
  // A dial with its first quarter completed.
  timeline: {
    base: "M20 12a8 8 0 1 1-8-8M12 8v4l2.6 2.6",
    accent: "M12 4a8 8 0 0 1 8 8",
  },
  // A measured signal: four readings, the last one high.
  demand: {
    base: "M3 20.5h18M5.5 17v-3M9.5 17v-6M13.5 17V8.5",
    accent: "M17.5 17V4.5",
  },
  // A path interrupted by a cut.
  risk: {
    base: "M2.5 15.5h5.5l2-3M14 11.5l2 4h5.5",
    accent: "M13.8 5.5l-3.6 13",
  },
  // A seal with tails, and the decision inside it.
  verdict: {
    base: "M12 3a6.8 6.8 0 1 1 0 13.6A6.8 6.8 0 0 1 12 3M8.6 15.6L7.5 21.5l4.5-2l4.5 2l-1.1-5.9",
    accent: "M9.2 9.9l2 2l3.8-4",
  },
  // Rising strength: two chevrons, the leading one lit.
  strength: {
    base: "M5.5 19.5l6.5-6.5l6.5 6.5",
    accent: "M5.5 12l6.5-6.5l6.5 6.5",
  },
  // A keyed instrument with its readout lit.
  calculator: {
    base: "M6.5 3h11A1.5 1.5 0 0 1 19 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-15A1.5 1.5 0 0 1 6.5 3M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 15.5h.01M12 15.5h.01M15.5 15.5v2",
    accent: "M8.5 6.5h7",
  },
  // A route marked through an open guide.
  guide: {
    base: "M12 6.5C10.3 5.2 7.9 4.5 4 4.5v13c3.9 0 6.3.7 8 2c1.7-1.3 4.1-2 8-2v-13c-3.9 0-6.3.7-8 2zM12 6.5v13",
    accent: "M15 10.5l2.5-1.5",
  },
  // A register of terms with one entry indexed.
  glossary: {
    base: "M4 5.5h16M9 12h11M9 18.5h11",
    accent: "M4 12h2M4 18.5h2",
  },
  // A page set in columns, the lead story marked.
  journal: {
    base: "M5.5 3.5h13A1.5 1.5 0 0 1 20 5v14a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19V5a1.5 1.5 0 0 1 1.5-1.5M7.5 12h3.5M7.5 15.5h3.5M14 12h2.5M14 15.5h2.5",
    accent: "M7.5 7.5h9",
  },
  arrow: {
    base: "M4.5 12h14",
    accent: "M13.5 6.5l5.5 5.5l-5.5 5.5",
  },
};

export function CinemaIcon({
  name,
  className = "",
  size = 24,
}: {
  name: CinemaIconName;
  className?: string;
  size?: number;
}) {
  const mark = MARKS[name];
  return (
    <svg
      className={`ci ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={mark.base} />
      <path className="ci-accent" d={mark.accent} pathLength={1} />
    </svg>
  );
}
