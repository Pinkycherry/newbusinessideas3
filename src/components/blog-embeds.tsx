import { Fragment } from "react";

import { ValidateButton } from "@/components/validate-button";
import { CalculatorWidget } from "@/components/calculator-widget";
import { findCalculator } from "@/lib/calculators";

/**
 * The "dynamic blog template" — a post's stored HTML can carry a handful of
 * self-closing marker divs, and this file is what turns those markers into
 * the site's own real, live components instead of a static description of
 * them. This is additive to `sanitizeHtml()` in `blog-shared.ts`, not a
 * change to it: `data-*` attributes and plain `<div>` tags already pass
 * through that sanitizer untouched, so no allow-list change was needed for
 * markers to survive storage and rendering.
 *
 * Marker shapes a post's HTML can contain (see `BLOG_CONTENT_STANDARDS.md`
 * for the authored-content spec coworkers write directly):
 *
 *   <div data-embed="validate" data-idea-slug="SLUG"></div>
 *   <div data-embed="calculator" data-calc-slug="SLUG"></div>
 *   <div data-embed="infographic" data-kind="tiers|comparison" data-json="..."></div>
 *
 * Each must be a genuinely empty, self-closing-shaped div — no nested
 * content — which is what makes splitting the raw HTML string on them with
 * a regex safe rather than a half-built HTML parser.
 */

const EMBED_MARKER =
  /<div\s+data-embed="(validate|calculator|infographic)"((?:\s+data-[a-z-]+="[^"]*")*)\s*>\s*<\/div>/gi;
const ATTR = /\sdata-([a-z-]+)="([^"]*)"/gi;

function parseAttrs(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const match of raw.matchAll(ATTR)) {
    // Both groups are always captured when ATTR matches at all — the
    // pattern has no optional groups.
    out[match[1]!] = decodeHtmlEntities(match[2]!);
  }
  return out;
}

/** The sanitized HTML an attribute value sits in still carries entities
 *  (`&quot;`, `&amp;`, …) rather than raw characters — this is the minimal
 *  decode needed to recover valid JSON or a plain slug out of one. */
function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

type Segment =
  | { kind: "html"; html: string }
  | { kind: "validate"; ideaSlug: string }
  | { kind: "calculator"; calcSlug: string }
  | { kind: "infographic"; infographicKind: string; data: unknown };

function parseSegments(html: string): Segment[] {
  const segments: Segment[] = [];
  let lastIndex = 0;

  for (const match of html.matchAll(EMBED_MARKER)) {
    const index = match.index ?? 0;
    if (index > lastIndex) segments.push({ kind: "html", html: html.slice(lastIndex, index) });

    // Both groups are always captured when EMBED_MARKER matches — neither
    // is optional in the pattern (the second may be an empty string, never
    // undefined).
    const type = match[1]!;
    const attrs = parseAttrs(match[2]!);

    if (type === "validate" && attrs["idea-slug"]) {
      segments.push({ kind: "validate", ideaSlug: attrs["idea-slug"] });
    } else if (type === "calculator" && attrs["calc-slug"]) {
      segments.push({ kind: "calculator", calcSlug: attrs["calc-slug"] });
    } else if (type === "infographic" && attrs["kind"] && attrs["json"]) {
      try {
        segments.push({
          kind: "infographic",
          infographicKind: attrs["kind"],
          data: JSON.parse(attrs["json"]),
        });
      } catch {
        // A malformed data-json on a published post would otherwise take
        // the whole article down. Dropping just this one embed and keeping
        // everything around it is the safer failure.
      }
    }

    lastIndex = index + match[0].length;
  }

  if (lastIndex < html.length) segments.push({ kind: "html", html: html.slice(lastIndex) });
  return segments;
}

/** Renders one already-sanitized HTML chunk of a blog post, swapping any
 *  embed markers it contains for the real, live component. */
export function BlogRichBlock({ html }: { html: string }) {
  const segments = parseSegments(html);
  return (
    <>
      {segments.map((segment, i) => {
        switch (segment.kind) {
          case "html":
            return segment.html.trim() ? (
              <div key={i} dangerouslySetInnerHTML={{ __html: segment.html }} />
            ) : (
              <Fragment key={i} />
            );
          case "validate":
            return <ValidateButton key={i} slug={segment.ideaSlug} />;
          case "calculator": {
            const calculator = findCalculator(segment.calcSlug);
            return calculator ? (
              <div key={i} className="glass mt-6 rounded-3xl px-5 py-7 sm:px-8">
                <p className="t-eyebrow">Try it with your own numbers</p>
                <CalculatorWidget calculator={calculator} />
              </div>
            ) : (
              <Fragment key={i} />
            );
          }
          case "infographic":
            return <Infographic key={i} kind={segment.infographicKind} data={segment.data} />;
        }
      })}
    </>
  );
}

type TierRow = { label: string; value: number; note?: string };
type ComparisonRow = { label: string; cells: string[] };

/**
 * Two pure-presentational infographic shapes, data-driven from the post's
 * own `data-json`, no chart library and no image file. Covers the two
 * things this site's content actually needs to show visually: a ranked tier
 * breakdown (cost bands, investment bands) and a side-by-side comparison.
 */
function Infographic({ kind, data }: { kind: string; data: unknown }) {
  if (kind === "tiers" && isTierData(data)) return <TierInfographic {...data} />;
  if (kind === "comparison" && isComparisonData(data)) return <ComparisonInfographic {...data} />;
  return null;
}

function isTierData(data: unknown): data is { title: string; rows: TierRow[] } {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return typeof d["title"] === "string" && Array.isArray(d["rows"]);
}

function isComparisonData(
  data: unknown,
): data is { title: string; columns: string[]; rows: ComparisonRow[] } {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return typeof d["title"] === "string" && Array.isArray(d["columns"]) && Array.isArray(d["rows"]);
}

function TierInfographic({ title, rows }: { title: string; rows: TierRow[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <figure className="glass mt-6 rounded-3xl px-5 py-7 sm:px-8" aria-label={title}>
      <p className="t-eyebrow">Infographic</p>
      <figcaption className="mt-2 font-display text-lg font-bold tracking-tight">
        {title}
      </figcaption>
      <div className="mt-5 space-y-3">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-semibold text-foreground">{row.label}</span>
              {row.note && <span className="text-muted-foreground">{row.note}</span>}
            </div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-border/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-warm"
                style={{ width: `${Math.max(4, (row.value / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function ComparisonInfographic({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: string[];
  rows: ComparisonRow[];
}) {
  return (
    <figure className="glass mt-6 overflow-x-auto rounded-3xl px-5 py-7 sm:px-8" aria-label={title}>
      <p className="t-eyebrow">Infographic</p>
      <figcaption className="mt-2 font-display text-lg font-bold tracking-tight">
        {title}
      </figcaption>
      <table className="mt-5 w-full min-w-[28rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="py-2 pr-4 font-semibold">{""}</th>
            {columns.map((col) => (
              <th key={col} className="py-2 pr-4 font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border/60 last:border-0">
              <th scope="row" className="py-2.5 pr-4 font-semibold text-foreground">
                {row.label}
              </th>
              {row.cells.map((cell, i) => (
                <td key={i} className="py-2.5 pr-4 text-muted-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
