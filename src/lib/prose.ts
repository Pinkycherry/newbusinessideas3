/**
 * SINGLE SOURCE OF TRUTH for turning one unbroken block of research prose
 * into readable paragraphs.
 *
 * Every `summary` in Supabase is stored as a single run of text with no line
 * breaks in it — confirmed across all 409 rows, none of which contains a
 * newline. Rendered straight into a `<p>`, a twenty-four sentence blueprint
 * breakdown is a wall, and on a phone it is the reason people leave.
 *
 * The rule the founder set: a paragraph is at least 5 sentences and at most
 * 8. This file is the only place that rule is implemented, and it runs at
 * render time on text already in the database — nothing here writes to
 * Supabase, and no word is added, removed or reordered. Split only.
 */

const MIN_SENTENCES = 5;
const MAX_SENTENCES = 8;

/**
 * Words that end in a full stop without ending a sentence. Lowercased and
 * without their dots, because that is the shape `shouldMerge` compares.
 *
 * `no` and `co` are in here knowingly: "No." meaning number and "Co." meaning
 * company both appear mid-sentence far more often in this kind of copy than
 * a sentence genuinely ends on them.
 */
const ABBREVIATIONS = new Set([
  "mr",
  "mrs",
  "ms",
  "dr",
  "prof",
  "sr",
  "jr",
  "st",
  "rs",
  "inc",
  "ltd",
  "pvt",
  "co",
  "vs",
  "etc",
  "eg",
  "ie",
  "approx",
  "est",
  "no",
  "fig",
  "dept",
  "govt",
  "univ",
  "al",
  "pp",
]);

/** True when the break after `buffer` is not a real sentence boundary. */
function shouldMerge(buffer: string, next: string): boolean {
  // "…" and "..." are a pause inside a sentence far more often than an end.
  if (/(\.\.\.|…)$/.test(buffer)) return true;
  // A lowercase opener is the single strongest signal that the previous full
  // stop was an abbreviation and not a terminator.
  if (/^[a-z]/.test(next)) return true;
  // "K." — an initial, not an ending.
  if (/\b[A-Z]\.$/.test(buffer)) return true;
  // "1." / "2026." — a list marker or a figure, not an ending.
  if (/\d\.$/.test(buffer)) return true;
  const lastWord = buffer.match(/([A-Za-z.]+)\.$/)?.[1];
  if (lastWord && ABBREVIATIONS.has(lastWord.replace(/\./g, "").toLowerCase())) return true;
  return false;
}

/** The sentences in one run of text, in order, with nothing dropped. */
export function splitSentences(text: string): string[] {
  const pieces = text.trim().split(/(?<=[.!?…])\s+/);
  const sentences: string[] = [];
  let buffer = "";
  for (let i = 0; i < pieces.length; i += 1) {
    buffer = buffer ? `${buffer} ${pieces[i]}` : (pieces[i] as string);
    const next = pieces[i + 1];
    if (next === undefined) break;
    if (shouldMerge(buffer, next)) continue;
    sentences.push(buffer);
    buffer = "";
  }
  if (buffer.trim()) sentences.push(buffer);
  return sentences.map((s) => s.trim()).filter(Boolean);
}

/**
 * How many paragraphs `n` sentences should become.
 *
 * Target is the middle of the band (6.5 sentences), then clamped so no
 * paragraph can exceed the maximum. The maximum wins over the minimum when
 * the two cannot both hold — at 9 sentences, one paragraph would break the
 * ceiling and two leaves a 4-sentence tail, and the shorter tail reads
 * better than a wall.
 */
function paragraphCount(n: number): number {
  if (n <= MAX_SENTENCES) return 1;
  const floorCount = Math.ceil(n / MAX_SENTENCES);
  const ceilCount = Math.floor(n / MIN_SENTENCES);
  const target = Math.round(n / ((MIN_SENTENCES + MAX_SENTENCES) / 2));
  return Math.max(floorCount, Math.min(target, Math.max(floorCount, ceilCount)));
}

/**
 * The sentence count of each paragraph, remainder spread one at a time over
 * the earliest paragraphs.
 *
 * Handing the remainder to the last paragraph instead would strand a tail —
 * 26 sentences across 4 would read 6, 6, 6, 8, and 22 across 3 would read 7,
 * 7, 8. Spreading it forward gives 7, 7, 6, 6 and 8, 7, 7: a rhythm that
 * shortens, which is how a piece of writing is supposed to close.
 */
function sizes(n: number, count: number): number[] {
  const base = Math.floor(n / count);
  const remainder = n % count;
  return Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0));
}

/**
 * One block of prose, split into 5-to-8-sentence paragraphs.
 *
 * Text that already carries its own blank lines is respected: each authored
 * block is split on its own, so a writer's deliberate break is never merged
 * away and never re-broken across itself.
 */
export function toParagraphs(text: string | null | undefined): string[] {
  const source = (text ?? "").trim();
  if (!source) return [];

  const blocks = source.split(/\n\s*\n+/).map((block) => block.replace(/\s+/g, " ").trim());

  return blocks.flatMap((block) => {
    if (!block) return [];
    const sentences = splitSentences(block);
    if (sentences.length === 0) return [block];
    const counts = sizes(sentences.length, paragraphCount(sentences.length));
    const paragraphs: string[] = [];
    let cursor = 0;
    for (const size of counts) {
      paragraphs.push(sentences.slice(cursor, cursor + size).join(" "));
      cursor += size;
    }
    return paragraphs.filter(Boolean);
  });
}
