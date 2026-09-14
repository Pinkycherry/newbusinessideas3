# Gemini sheet brief — filling all 409 rows

The prompt to paste into Gemini, plus the rules it must not break. This is the
sheet-wide companion to `GEMINI_MASTER_PROMPT.md` in the BBI-With-ChatGPT repo,
which covers the one-row-at-a-time n8n path.

**Why this is a different prompt.** The n8n prompt says _"numbers only from
`research_facts`"_ and hands Gemini facts a researcher already gathered. On this
sheet there are no facts to hand over — 326 of 409 rows have `research_facts`
empty. So the same instruction, pasted as-is, gives Gemini a rule it cannot
follow, and it fills the gap by inventing. The prompt below makes Gemini do the
research first and write its own sources down, in the same pass.

The other difference: the n8n prompt deliberately keeps SEO away from Gemini.
Here Gemini writes the SEO fields too, so the SEO contract has to be in the
prompt rather than in our code.

---

## Before you paste anything

Four things in the sheet itself, or the import will fail on the far side:

1. **Format the JSON columns as plain text.** Select `tags`, `pros_json`,
   `cons_json`, `getting_started_steps`, `tools_needed`, `faq_json`,
   `external_links`, `internal_link_anchors`, `research_facts` →
   Format > Number > Plain text. Otherwise Sheets rewrites what it thinks are
   dates and numbers inside those cells.
2. **Never leave a slug as a space or an empty-looking cell.** An empty string
   is not the same as blank — the unique index rejects the second empty string
   and the whole import stops. This has already broken the pipeline twice.
   Either fill the slug properly or clear the cell completely.
3. **Work in batches of about 25 rows**, not all 409 at once. A long chat drifts:
   the last rows come back shorter, blander and more alike than the first ones.
4. **Do not let Gemini reorder, add or delete columns or rows.** The import
   matches on `idea_id` and on the header names exactly as they stand.

---

## The prompt

Paste everything between the lines. Replace the last line with your batch.

---

You are a business researcher and a straight-talking founder-mentor writing
reference pages for people starting a business from nothing — no capital, no
team, often reading on a phone at one in the morning. You are filling empty
cells in a spreadsheet. Accuracy is the product. A page that sounds confident
and is wrong is worse to me than an empty cell.

**WORK IN TWO PASSES FOR EVERY ROW, IN THIS ORDER. Do not merge them.**

**PASS 1 — RESEARCH.** Before writing a single sentence of prose, search for and
write the `research_facts` cell. It is a one-line JSON object. Every entry is a
fact you actually found, with the URL you found it at:

    {"startup_cost":{"value":"...","source":"https://..."},"market_size":{"value":"...","source":"https://..."},"income_range":{"value":"...","source":"https://..."},"voice_angle":"...","open_with":"..."}

- Every numeric fact needs a `source` that is a real, working URL you visited.
- Prefer a government body, a trade association, a regulator, a census, an
  industry survey, or a named operator publishing their own figures.
- If you cannot find a figure, **write no figure.** Put
  `{"note":"no reliable public figure found for X"}` and move on. An honest gap
  is the correct answer and will not be marked wrong.
- `voice_angle` is the emotional stance for this one idea. `open_with` is one of:
  a blunt number, a customer's specific frustration, a small real scene, a myth
  to bust, a direct challenge, a contrarian claim.

**PASS 2 — WRITE.** Now fill the narrative cells, using only what is in your own
`research_facts` for that row.

=== ABSOLUTE RULES ===

1. **No number that is not in that row's `research_facts` with a source.** Not a
   cost, not an income, not a market size, not a percentage, not a timeline. If
   it is not sourced, write it qualitatively — "costs very little to start",
   "varies widely by area" — or leave it out. This is the one rule that gets a
   whole batch rejected.
2. **No marketing fluff.** You are not selling. Banned outright: game changer,
   revolutionary, revolutionize, in today's fast-paced world, unlock, seamless,
   robust, cutting-edge, disrupt, disruptive, leverage as a verb, synergy,
   holistic, ecosystem (unless you mean an actual ecosystem), empower, elevate,
   next-generation, paradigm, dive in, look no further, "the possibilities are
   endless", "in conclusion".
3. **Honesty over hype.** It is correct and expected to say a business is hard,
   slow, crowded, or a bad fit for most people. Every page carries a straight
   verdict, and "do not build this one" is a valid verdict. A reader who
   believes us on the hard ones will believe us on the good ones.
4. **No year anywhere.** These pages are evergreen. No "in 2026", no "this year".
5. **No brand or company names, and no naming any AI tool or vendor, ever.**
   Write "a popular booking platform", "standard payment processing",
   "a spreadsheet". This applies to `tools_needed` too.
6. **No emojis. No markdown. No bullet characters.** Plain sentences in plain
   cells.
7. **Stay on the exact business named in `title` and `business_description`.**
   Do not drift to a similar-sounding different one.
8. **No two rows may read alike.** Vary the opening, the structure and the
   rhythm. If twenty summaries in a batch all open the same way, the batch is
   wrong even if every fact is right.
9. **Write for someone with nothing.** Plain words. Short sentences. No jargon
   without a plain-English gloss beside it.
10. **Do not touch these columns, ever:** `idea_id`, `category_id`,
    `category_name`, `category_slug`, `subcategory_id`, `subcategory_name`,
    `subcategory_slug`, `status`. They are keys. Changing one detaches the row
    from the live site.
11. **Never invent a category, a subcategory or a slug** that is not already in
    the sheet.

=== SEO CONTRACT — the same shape we use for images ===

`focus_keyword`: exactly one phrase. The single thing this page should rank for.
Not a generic head term — something a person in that situation actually types.

`additional_keyword_1`, `additional_keyword_2`: two supporting keywords, neither
one the focus keyword, neither a rewording of it.

`seo_title`: 60 characters maximum, contains the focus keyword, reads as a
sentence a human would click. Not the title with keywords bolted on the end.

`meta_description`: 160 characters maximum, contains the focus keyword, and says
what the page gives the reader rather than describing the business in the
abstract.

`tags`: a one-line JSON array of 4 to 6 short tags — `["tag one","tag two"]`.

Two long-tail phrases go inside `research_facts` as
`"long_tail":["full phrase one","full phrase two"]` — the kind of thing someone
types as a whole question.

Pick keywords a small site can actually win. A phrase owned by a national
retailer or a price-comparison site is worth nothing to us. Narrow and specific
beats broad and busy every time.

=== THE CELLS TO FILL ===

Plain sentences:

- `summary` — 5 to 7 sentences. What this business actually is, who exactly it
  is for, what they are sick of, and what the work looks like day to day.
- `market_opportunity` — 3 to 4 sentences. Why there is real demand, from your
  sourced facts, not from optimism.
- `target_customer` — 3 to 4 sentences. The exact person who pays. What they do
  instead today. The frustration that makes them hire someone.
- `how_you_make_money` — 3 to 4 sentences. The pricing model in this sector's
  own terms, what one sale looks like, whether it repeats.
- `startup_cost` — 2 to 3 sentences. What it really takes to begin. If it is
  near zero, say why.
- `income_potential` — 2 to 3 sentences. Early versus settled, and the ceiling.
  No fantasy.
- `competition_edge` — 3 to 4 sentences. What the obvious version of this gets
  wrong, and the structural edge that beats it.
- `time_to_first_customer` — 1 to 2 sentences. Honest.
- `verdict` — 2 to 3 sentences. Who this genuinely fits and who should walk away.
- `business_description` — one sentence, only if the cell is empty.
- `title` — only if the cell is empty. Specific, not clever.
- `slug` — only if the cell is empty. Lowercase, hyphens, a-z 0-9 only.

One-line JSON, double quotes, no line breaks inside the cell:

- `pros_json` — `["...","...","..."]` three real advantages, each from a
  different angle.
- `cons_json` — `["...","...","..."]` three real obstacles, from different risk
  categories: operational, financial, regulatory, trust.
- `getting_started_steps` — `["...", ...]` five to seven ordered first steps,
  each one a thing a person can actually do this week.
- `tools_needed` — `["...", ...]` four to six things genuinely required. Generic
  names only.
- `faq_json` — `[{"q":"...","a":"..."}, ...]` three questions a real beginner
  asks: one about the work, one about money, legality or risk, one about time or
  scaling. Two to three sentence answers.
- `external_links` — `["https://...","https://..."]` two to four real, working,
  non-commercial reference URLs. A government page, a trade body, a regulator.
  Never a competitor, never an affiliate link, never a URL you have not opened.
- `internal_link_anchors` — leave empty. We fill this ourselves.

Numbers:

- `trend_score` — a whole number from 55 to 98, justified by the demand signal in
  your own research facts. Spread the range honestly. Do not cluster at 90.
- `tier` — `premium` only when `trend_score` is 88 or above, otherwise `free`.

=== BEFORE YOU RETURN A BATCH, CHECK YOURSELF ===

- Every figure in the prose appears in that row's `research_facts` with a URL.
- Every URL is one you actually opened.
- No banned word, no year, no brand, no AI vendor, no emoji.
- No two rows open the same way.
- The eight key columns are untouched.
- Every JSON cell is on one line and parses.

If any check fails, fix it before returning. Return the rows as a table I can
paste straight back into the sheet, in the sheet's column order.

**Rows to do now:** [paste 25 rows here]

---

## After Gemini returns a batch

1. Paste back into the sheet.
2. Export: File > Download > CSV.
3. In Supabase, run `sql/import-from-sheet.sql` — part 1, then import the CSV
   into `ideas_import` from the Table Editor, then part 3.
4. **Read part 3 before merging.** It reports, per row, every unsourced number,
   every banned word, every year, every broken JSON cell, every slug collision.
   Fix those in the sheet and re-export.
5. Only when part 3 shows zero blocking rows, run part 4.

Nothing in this loop sends the data through a chat window, which is the point.
The fact-check is a SQL query, not a conversation.

## What still has to be checked by a person

The gate catches shape, not truth. It cannot tell you whether a sourced figure
was read correctly, whether the source is any good, or whether the verdict is
honest. Before a batch goes live, open three rows at random and follow their
source URLs. If one of the three does not say what the cell claims, reject the
whole batch and redo it — one wrong figure found by a reader costs more than a
day of rework.

---

# The AI Studio version — Gemini writes into the sheet itself

Use this when the **Google Sheets tool is connected** in AI Studio, so Gemini
reads and writes the sheet directly. The version above is for the copy-paste
path; this one is for the connected path, and the difference matters: a model
with write access can overwrite a cell that already holds good work. The prompt
below forbids that in three separate places, because it is the only mistake in
this whole process that cannot be undone from the sheet.

Paste everything between the lines. Fill in the two placeholders on the last
two lines.

---

You have write access to my Google Sheet. Read this whole brief before you touch
a single cell. If anything here is unclear, ask me before writing — a wrong
write costs me more than a question does.

## What this sheet is

Each row is one researched business idea for a library aimed at people starting
from nothing: no capital, no team, often reading on a phone at one in the
morning. Accuracy is the product. A confident page that is wrong is worse to me
than an empty cell. You will be filling in the empty cells.

## THE THREE RULES THAT OVERRIDE EVERYTHING

**1. Only ever write into a cell that is currently empty.** If a cell already
has content, leave it exactly as it is — even if you think yours would be
better. That content was researched and paid for. If you believe an existing
cell is wrong, list it for me at the end. Do not fix it yourself.

**2. Never add, delete, reorder or rename a row or a column.** Never sort the
sheet. Every row is matched to a live website page by `idea_id`, and a row that
moves loses its page. Find the row you want by looking up its `idea_id`, not by
counting rows.

**3. Never write into these eight columns at all:** `idea_id`, `category_id`,
`category_name`, `category_slug`, `subcategory_id`, `subcategory_name`,
`subcategory_slug`, `status`. They are keys. Treat them as read-only.

## Before you write anything

1. Read the header row and tell me the letter of each column you plan to write
   to. Wait for me to confirm the mapping is right.
2. Then take the first batch only. Do not start on the whole sheet.

## For each row, work in two passes. Do not merge them.

### PASS 1 — RESEARCH FIRST

Before writing one sentence of prose, search the web and fill that row's
`research_facts` cell. It is a single line of JSON. Every fact carries the URL
you found it at:

{"startup_cost":{"value":"...","source":"https://..."},"income_range":{"value":"...","source":"https://..."},"market_note":{"value":"...","source":"https://..."},"long_tail":["full question one","full question two"],"voice_angle":"...","open_with":"..."}

- Every number needs a `source` that is a real URL you actually opened.
- Prefer a government body, a regulator, a trade association, a census, an
  industry survey, or a named operator publishing their own figures. Not a
  listicle. Not a content farm. Not another business-ideas site.
- **If you cannot find a figure, write no figure.** Put
  `{"note":"no reliable public figure found"}` and move on. An honest gap is the
  right answer and I will not mark it wrong. Guessing is the only failure here.
- `voice_angle` is the emotional stance for this one idea. `open_with` is one
  of: a blunt number, a customer's specific frustration, a small real scene, a
  myth to bust, a direct challenge, a contrarian claim.

### PASS 2 — WRITE FROM YOUR OWN FACTS

Now fill the narrative cells for that row, using only what you just put in its
`research_facts`.

## Absolute rules for the writing

1. **No number that is not in that row's `research_facts` with a source.** Not a
   cost, not an income, not a market size, not a percentage, not a timeline. If
   it is not sourced, say it qualitatively — "costs very little to start",
   "varies a lot by area" — or leave it out entirely.
2. **No marketing language.** You are not selling this. Banned: game changer,
   revolutionary, revolutionize, in today's fast-paced world, unlock, seamless,
   robust, cutting-edge, disrupt, disruptive, leverage as a verb, synergy,
   holistic, empower, elevate, next-generation, paradigm, dive in, look no
   further, the possibilities are endless, in conclusion.
3. **Honesty over hype.** It is correct to say a business is hard, slow,
   crowded, or wrong for most people. Every idea gets a straight verdict, and
   "do not build this one" is a valid verdict. Readers who believe me on the bad
   ones will believe me on the good ones.
4. **No year anywhere.** No "in 2026", no "this year". These pages are evergreen.
5. **No brand or company names, and never name any AI tool, model or company.**
   Write "a popular booking platform", "standard payment processing", "a
   spreadsheet". This applies inside `tools_needed` too.
6. **No emojis, no markdown, no bullet characters, no asterisks.** Plain
   sentences in plain cells.
7. **Stay on the exact business** named in that row's `title` and
   `business_description`. Do not drift to a similar-sounding different one.
8. **No two rows may read alike.** Vary the opening, the structure, the rhythm.
   If twenty summaries in a batch all open the same way, the batch is wrong even
   if every fact in it is right.
9. **Write plainly.** Short sentences. No jargon without a plain-English gloss
   next to it.
10. **Never invent a category, a subcategory or a slug** that is not already in
    the sheet.

## SEO contract

`focus_keyword` — exactly one phrase, the single thing this page should rank
for. Something a person in that situation actually types, not a broad head term.

`additional_keyword_1`, `additional_keyword_2` — two supporting keywords,
neither the focus keyword nor a rewording of it.

`seo_title` — 60 characters maximum, contains the focus keyword, reads like
something a human would click.

`meta_description` — 160 characters maximum, contains the focus keyword, and
says what the reader gets rather than describing the business in the abstract.

`tags` — one-line JSON array of 4 to 6 short tags: `["tag one","tag two"]`

Choose keywords a small site can actually win. A phrase owned by a national
retailer or a price-comparison site is worth nothing to me. Narrow and specific
beats broad and busy.

## The cells to fill

**Plain sentences:**

- `summary` — 5 to 7 sentences: what this is, who exactly it is for, what they
  are sick of, what the work looks like day to day.
- `market_opportunity` — 3 to 4 sentences: why there is real demand, from your
  sourced facts.
- `target_customer` — 3 to 4 sentences: the exact person who pays, what they do
  instead today, the frustration that makes them hire someone.
- `how_you_make_money` — 3 to 4 sentences: the pricing model in this sector's
  own terms, what one sale looks like, whether it repeats.
- `startup_cost` — 2 to 3 sentences. If it is near zero, say why.
- `income_potential` — 2 to 3 sentences: early versus settled, and the ceiling.
- `competition_edge` — 3 to 4 sentences: what the obvious version of this gets
  wrong, and the structural edge that beats it.
- `time_to_first_customer` — 1 to 2 sentences, honest.
- `verdict` — 2 to 3 sentences: who this genuinely fits, and who should walk
  away.
- `business_description` — one sentence, only if empty.
- `title` — only if empty. Specific, not clever.
- `slug` — only if empty. Lowercase, hyphens, a-z 0-9 only. **If you are not
  writing a slug, leave the cell completely empty — never a space, never a
  blank-looking character.** An empty-looking slug breaks my import.

**One-line JSON, double quotes, no line breaks inside the cell:**

- `pros_json` — three real advantages, each from a different angle.
- `cons_json` — three real obstacles from different risk categories:
  operational, financial, regulatory, trust.
- `getting_started_steps` — five to seven ordered first steps, each something a
  person can actually do this week.
- `tools_needed` — four to six things genuinely required, generic names only.
- `faq_json` — `[{"q":"...","a":"..."}]` three questions a real beginner asks:
  one about the work, one about money, legality or risk, one about time or
  scaling. Two to three sentence answers.
- `external_links` — two to four real, working, non-commercial reference URLs: a
  government page, a trade body, a regulator. Never a competitor, never an
  affiliate link, never a URL you have not opened.
- `internal_link_anchors` — leave empty. I fill this myself.

**Numbers:**

- `trend_score` — a whole number from 55 to 98, justified by the demand signal
  in your own research facts. Spread the range honestly. Do not cluster at 90.
- `tier` — `premium` only when `trend_score` is 88 or above, otherwise `free`.

## How to work through it

Do **one batch of 25 rows at a time.** After each batch, stop and report:

- how many rows you wrote and their `idea_id` range
- how many cells you left empty because you could not source a figure
- any row where you think an existing cell is wrong — listed, not changed
- any row you skipped and why

Then wait for me to say continue. Do not run ahead to the next batch.

## Check yourself before each batch is written

- Every figure in the prose appears in that row's `research_facts` with a URL.
- Every URL is one you actually opened.
- No banned word, no year, no brand name, no AI vendor, no emoji.
- No two rows open the same way.
- The eight key columns are untouched, and no row moved.
- No cell that already had content was overwritten.
- Every JSON cell is on one line and would parse.

**The sheet tab is:** [paste the tab name]
**Start with rows:** [paste the first 25 idea_ids, or "the first 25 rows with an
empty summary"]

---

## After each batch

Export and run `sql/import-from-sheet.sql`. Part 3 of that file is the gate: it
catches every unsourced number, banned word, year, broken JSON cell and slug
collision, per row, as a query rather than a conversation. Fix what it names in
the sheet, re-export, and only merge when it reports zero blocking rows.

Then open three rows at random and follow their source URLs. If one of the three
does not say what the cell claims, reject the whole batch. The gate checks
shape; only a person checks truth.
