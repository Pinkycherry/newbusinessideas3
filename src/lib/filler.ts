/**
 * Strips the pipeline's generic filler out of an idea before anything renders it.
 *
 * Measured on 2026-09-21 across the 409 completed rows: seven fields held
 * BYTE-IDENTICAL text on 356 of them. Not similar — the same bytes. That put
 * 2,480 repeated characters on 87% of the library, which is 42.9% of each of
 * those pages, and it is what pulls them into Google's near-duplicate cluster
 * and drags on the 53 pages that are genuinely written.
 *
 * `scripts/content-audit.sql` re-measures all of this against live data.
 *
 * The fix is deliberately at the data layer rather than in the route. Every
 * consumer then receives an empty string or an empty array, and the existing
 * falsy guards in the page already handle that — one change instead of eight,
 * and a second surface that renders an idea cannot forget to apply it.
 *
 * `market_opportunity` is NOT here on purpose: 251 of the 356 are distinct, so
 * it is real writing and removing it would cost the pages content they need.
 *
 * Matching is by opening phrase, not by the whole string. A prefix survives the
 * pipeline making small edits to the tail of the same boilerplate; an exact
 * match would silently stop working the first time it did.
 */

/** Opening phrases of the seven shared prose values. */
const FILLER_PROSE = [
  "Getting started costs very little beyond basic tools",
  "Early on the money comes in small amounts",
  "Pricing in this kind of work is usually a straightforward fee",
  "The common version of this tries to cover everyone",
  "Most people take months rather than weeks to land the first paying customer",
  "The person who pays is already dealing with",
];

/** First entry of the two shared lists. The whole list goes if this matches. */
const FILLER_LIST_HEAD = [
  "Map the exact problem the target person faces each day",
  "Basic communication method for customers",
];

function startsWithAny(text: string, prefixes: readonly string[]): boolean {
  const t = text.trim().toLowerCase();
  return prefixes.some((p) => t.startsWith(p.toLowerCase()));
}

/** The text, or "" when it is the shared filler. */
export function realProse(text: string): string {
  return text && startsWithAny(text, FILLER_PROSE) ? "" : text;
}

/** The list, or [] when its first entry marks it as the shared filler. */
export function realList(items: string[]): string[] {
  const head = items[0];
  return head && startsWithAny(head, FILLER_LIST_HEAD) ? [] : items;
}
