# The idea pipeline

One document for the n8n workflow that writes ideas into Supabase: where it
lives, how to move it, the prompt it runs, and what is broken in it right now.
It replaces `N8N_ACCOUNT_MIGRATION.md` and `GEMINI_MASTER_PROMPT.md` (both
merged below, unchanged) and three planning docs written before the pipeline
existed (`N8N_PIPELINE_PLAN.md`, `PIPELINE_V2_PLAN.md`, `CONTENT_ENGINE_PLAN.md`),
which are in git history.

**Never create a second workflow — edit the existing one.** Importing a JSON
file creates a new workflow; that is how a second one gets made by accident.

---

## OPEN — something strips every digit from what the pipeline writes (found 2026-09-22)

Every generated field on every idea arrived in Supabase with **all digits,
`$`, `₹`, `%`, `:` and `+` removed**. Measured across all 589 rows: one
`summary` in 589 had a digit, `startup_cost` had none, and not one
`business_description` had a colon. It left sentences like *"an upfront
hardware investment of ,,"* (₹5,00,000 with only the Indian-grouping commas
surviving), *"selling sponsorships to BB brands"* (B2B), and *"The hint bring a
printed checklist"*.

What is known:

- **It is not in `n8n-idea-pipeline-v3.json`.** Every Code and Set node in that
  export was read; none of them do this.
- **It is not in Supabase.** The only trigger on `ideas` sets `updated_at`.
  `updated_ideas` (409 rows) is equally stripped, so the text was already
  damaged before it reached the database.
- **It treats fields differently.** The FAQ answers kept their `$` and `:`
  (*"average about $, a month"*, *"by complexity: foundation letters"*) while
  the plain text fields lost both. Whatever does this runs per field, not once
  over the whole row.
- So it lives in the **live** n8n workflow (edited since the export) or in the
  **Google Sheet** the pipeline writes through. The n8n MCP connector could not
  connect on 2026-09-22 to check.

**Why it probably exists.** The prompt below says every number must come from
`research_facts`. On 2026-09-22 only 11 of 589 rows had `research_facts` — so
for the other 578 the model had no sourced figures and wrote its own. Deleting
every digit is a crude way to enforce "zero fabricated numbers". It hid the
fabrication and broke the sentences, and it also deleted the *real*, cited
figures on the 11 rows that had them.

**The fix, in order:**

1. Download the live workflow (n8n → ⋯ → Download) and find the node or sheet
   formula that removes `[0-9$₹%:+]`. Delete it, in the existing workflow.
2. Replace it with a real guard in `Quality Guard`: reject a row whose narrative
   contains a figure that is not in that row's `research_facts`. A rejected row
   goes to retry with an instruction to describe it qualitatively — which is
   what the prompt already asks for.
3. Apply `public.ideas_narrative_fixes_20260922` to the sheet too, or a re-sync
   will overwrite the repaired rows with the stripped text still in the sheet.

**What was repaired on 2026-09-22.** 766 fixes across 322 ideas, every one
logged in `public.ideas_narrative_fixes_20260922` (old text, new text, applied
flag). Backup of every narrative field before the repair:
`public.ideas_narrative_backup_20260922`. Rules used:

- A figure with no source was rewritten **without** a number ("a flat monthly
  fee", "a short demo"), never guessed back in.
- A figure that **is** in that row's `research_facts` was restored exactly
  (IDEA-00283, IDEA-00400–00409).
- Terms that only look numeric were restored exactly: B2B, D2C, 3D,
  one-on-one, nine-to-five, and every stripped colon.
- Sentences that matched a damage pattern but were fine ("a per-tray fee",
  "twelve-volt DC motor") were left alone and recorded in
  `public.ideas_narrative_ok_20260922`.

Limit: a sentence that lost only a colon and nothing else cannot be detected
mechanically, except in the two fixed forms repaired above ("The hint:",
"Note:"). A few run-on sentences of that kind may remain.

---

## Moving the workflow between n8n accounts (2026-09-10)


The old n8n instance (`pinkypinky1212.app.n8n.cloud`) ran out of free plan. Its
workflow has been exported to **`n8n-idea-pipeline-v3.json`** in this repo so
nothing is lost. That file is the rescue copy — import it into the new account.

The old `n8n-idea-pipeline-v2.json` has been deleted. It was nine nodes; the
live workflow had grown to twenty-eight, and its gate logic was different and
wrong (see "What was stale" below). Importing it would have quietly reintroduced
a bug. It is still in git history if it is ever needed.

### Import steps

1. In the new account: **Workflows → Import from File →
   `n8n-idea-pipeline-v3.json`**.
2. Re-create the three credentials. The workflow references them by name, but
   credential IDs are per-account, so every node using one will show a
   "credential not found" warning until you re-select it:

   | Credential type | Name in the export | Used by |
   |---|---|---|
   | Google Sheets OAuth2 | `Google Sheets account` | Read Pending Rows, Update Row in Sheet, Read Blog Queue, Mark Blog Row Done |
   | Google Gemini (PaLM) API | `Google Gemini(PaLM) Api account` | Google Gemini Chat Model |
   | Supabase API | `Supabase account` | Sync to Supabase, Read Completed Ideas, Write FAQ Pool, Write Blog Post |

3. Open each of those nodes once and pick the new credential from the dropdown.
4. The sheet and the Supabase project are unchanged — same document ID, same
   tab (`Updated SuperBase1`, gid `1572637316`), same `ideas` table. Nothing to
   re-point.

### Known placeholder, still unfixed

`Read Blog Queue` has `documentId: "REPLACE_WITH_YOUR_SHEET_ID"` and
`sheetName: "Blog Queue"`. That was never filled in on the old account either,
so the blog branch (`Blog - Run`) has never worked. It needs a real sheet ID
before that trigger will do anything. The idea branch and the FAQ branch are
unaffected.

### The three triggers

The workflow holds three independent branches, each with its own manual trigger:

- **`When clicking "Test workflow"`** — the idea pipeline (sheet → writer → sheet + Supabase)
- **`FAQ Pool - Run`** — builds the per-category FAQ pool from completed ideas
- **`Blog - Run`** — the blog branch, blocked on the placeholder above

### What is actually blocking the idea pipeline

Importing this will not by itself make the pipeline produce ideas. The blocker
is in the data, not the workflow:

- The sheet holds **116 pending rows** (`IDEA-00284` → `IDEA-00399`, sheet rows
  285–400).
- **All 116 have an empty `research_facts` cell.** Confirmed by running the
  workflow with its writes disabled: the `Has research_facts?` gate evaluated
  116 rows and returned **true 0 times, false 116 times**.
- Those rows also have empty `title`, `slug`, `seo_title`, `meta_description`,
  `tags`, `external_links` and `internal_link_anchors`. Only the seed columns
  are filled (category, subcategory, keywords, `business_description`).

So the Stage 1 research pass has never been run for these rows. The gate is
doing its job — it is the only thing stopping 116 rows with a blank title and a
blank slug from being inserted into Supabase. **Fix the input, not the gate.**

For contrast, the seven rows that do have `research_facts` (`IDEA-00603`–
`IDEA-00608`, plus `IDEA-00283`) all completed normally. The pipeline works; it
is starved.

### What changed in the export

One addition, nothing removed:

- **`Run Summary`** (Code node) is now wired to the `Loop Over Items` **"done"**
  output, which was previously connected to nothing. That empty branch is why a
  starved run looked identical to a working one — the loop and the IF would
  flash once per row, nothing downstream would light up, and the execution would
  report success having written nothing. The new node reports
  `total_rows_read`, `rows_with_research_facts` and
  `rows_skipped_missing_research_facts`, and adds an explicit warning when every
  row was skipped.

### What was stale in `n8n-idea-pipeline-v2.json`

Recorded here because the difference mattered:

- 9 nodes vs 28 live — the whole FAQ-pool branch and blog branch were missing.
- Its gate was `research_facts` **contains the string `"facts"`**. The live gate
  is `length > 50`. The old check would wrongly reject research written in the
  `IDEA-00283` shape, whose keys are `startup_cost` / `market_size` /
  `voice_angle` with no `facts` key at all.
- It had no `Quality Guard` node.

### Data shapes — no mismatch, existing or future

Nine Supabase columns are `jsonb` but hold a JSON *string* rather than a JSON
array, because the parser does `JSON.stringify(...)` and the Supabase node
writes that string straight into a `jsonb` column:

| Column | Rows storing a string | Rows storing a real array |
|---|---|---|
| `tags`, `pros_json`, `cons_json` | 290 | 0 |
| `getting_started_steps`, `tools_needed`, `faq_json`, `external_links`, `internal_link_anchors` | 8 | 0 |
| `research_facts` | 7 | 0 |

This is cosmetic, not breaking. `toStringList` and `toObjectList` in
`src/lib/ideas-shared.ts` unwrap up to three levels, so a double-encoded string
and a real array both render correctly. If the parser is ever changed to write
real arrays, old and new rows will still both work — the helpers accept either.
No backfill is required, and none has been run.

---

## The writer prompt (the 'Basic LLM Chain' node)


v3 — Gemini writes ONLY the narrative fields, strictly from `research_facts`. Claude owns title/slug/SEO/links.

```
=You are a senior business writer and an honest founder-mentor. A researcher has ALREADY chosen this micro-niche, written its final title, slug, SEO fields and keywords, attached real reference links, and gathered VALIDATED FACTS with real numbers and sources. Your only job: write the NARRATIVE sections of the idea page — the story and the practical detail — using ONLY those validated facts. You never invent a number, never contradict the research, and never rewrite the title, slug, keywords, or links (those are final and not yours to touch).

=== GROUND TRUTH (never contradict) ===
Category: {{ $json.category_name }} > {{ $json.subcategory_name }}
Focus keyword: {{ $json.focus_keyword }} | also: {{ $json.additional_keyword_1 }}, {{ $json.additional_keyword_2 }}
Final idea title: {{ $json.title }}
Seed brief (the real business model): {{ $json.business_description }}
VALIDATED RESEARCH FACTS — your ONLY source for any number, cost, income, market size, percentage, or hard claim:
{{ $json.research_facts }}
Reference links already attached to this page (you MAY reflect their facts in prose; do NOT output them, do NOT invent new ones):
{{ $json.external_links }}

=== ABSOLUTE RULES ===
1. NUMBERS ONLY FROM research_facts. Every figure — startup cost, income, market size, percentage, timeline — must trace to the research facts above. If a number is not in the facts, describe it qualitatively or say it varies; NEVER fabricate one.
2. STAY ON THIS BUSINESS. Consistent with the title, keywords, and seed brief. Do not drift to a similar-sounding different business.
3. HUMAN, HONEST, SPECIFIC VOICE. Warm founder-mentor real-talk, dry humour where it fits. Honesty over hype — it is fine to say a business is hard or slow. Confidence from specificity, not superlatives.
4. MICRO-NICHE DEPTH + USP. Explain the specific angle and what makes it different from the obvious saturated version. Never generic, never what a one-line AI answer would already say.
5. GLOBAL / UNIVERSAL. Works anywhere. NO YEAR anywhere. NO real brand/company names (refer generically: "a popular booking platform", "standard payment processing"). NO emojis.
6. NO TEMPLATE VOICE. Banned words: game changer, revolutionize, revolutionary, in today's fast-paced world, unlock, seamless, robust, cutting-edge, disrupt, disruptive, leverage (verb), synergy, holistic, ecosystem (unless ecological), empower, elevate, next-generation, paradigm, dive in, look no further. Vary every opening; no two ideas share a structure.
7. Weave the focus + additional keywords in naturally, never stuffed (each once or twice at most).
8. VARIATION — NO TWO IDEAS MAY READ ALIKE. The research_facts may include a "voice_angle" (the emotional stance for THIS idea) and an "open_with" hint (how to start). If present, follow them exactly. If absent, silently pick a DISTINCT combination for this idea — openings: {a blunt number, a customer's specific frustration, a small real scene, a myth to bust, a direct challenge to the reader, a contrarian claim}; structures: {problem then angle then proof, a day in the operator's life, who-wins vs who-loses, the-math-first, the-story-first}. Never fall back on the same opening or structure you would default to. Uniqueness comes from the specific facts and this idea's real details — lean on them, not on a house template.
9. OUTPUT ONLY a raw JSON object with EXACTLY the fields below — nothing else. Do NOT output title, slug, seo_title, meta_description, tags, external_links, or internal_link_anchors (those are already final and owned by the researcher). No markdown fences, no commentary.

=== REQUIRED JSON OUTPUT (narrative fields only; each specific to THIS idea) ===
{
  "summary": "5-7 sentence real-talk overview: what this micro-niche actually is, its USP, who exactly it is for and what they're sick of, how it works day to day. Real personality, varied rhythm.",
  "market_opportunity": "3-4 sentences: why this under-served niche has genuine demand now — grounded in the research facts, not hype.",
  "target_customer": "3-4 sentences: the exact person who pays, what they do instead today, and the frustration that makes them hire you.",
  "how_you_make_money": "3-4 sentences in this sector's real terms: pricing model, realistic numbers FROM THE FACTS, what one sale looks like, repeat/margin. No SaaS tiers unless it is software.",
  "startup_cost": "2-3 sentences: realistic money and gear to start, numbers from the facts. If near-zero, say why.",
  "income_potential": "2-3 sentences: realistic early vs traction income and the ceiling, numbers from the facts. No fantasy figures.",
  "competition_edge": "3-4 sentences: the USP spelled out — what the obvious version gets wrong and the structural edge that wins here.",
  "getting_started_steps": ["5-7 concrete ordered first steps, each a short actionable sentence specific to this idea"],
  "tools_needed": ["4-6 concrete tools/gear/resources actually required, generic (no brand names)"],
  "time_to_first_customer": "1-2 sentences: realistic honest timeline to the first paying customer.",
  "faq_json": [
    {"q":"A real beginner question about this micro-niche","a":"Honest, specific 2-3 sentence answer using the facts"},
    {"q":"A money/legal/risk question","a":"Honest, specific answer"},
    {"q":"A scaling/time question","a":"Honest, specific answer"}
  ],
  "pros_json": ["Specific real advantage of this exact micro-niche","A second, different-angle advantage","A third tied to timing or a structural edge"],
  "cons_json": ["A real sector-accurate obstacle","A second from a different risk category (operational/financial/regulatory/trust)","A third honest limit on scale or speed"],
  "verdict": "Direct honest 2-3 sentence read: who this genuinely fits and who should skip it.",
  "trend_score": 78,
  "tier": "free"
}

SCORING: trend_score = honest integer 55-98 based on the demand signal in the research facts (spread the range, don't cluster near 90). tier = "premium" only if trend_score >= 88, else "free".

Silent check before output: is EVERY number traceable to research_facts, is this a specific micro-niche in a genuine human voice with no year/brand/emoji/template words, and did you output ONLY the narrative fields? If not, fix it before returning.
```
