# Content Engine — division of labor, SEO standard, and safe edit plan

Status: **plan only, no edits yet.** This touches the core (workflow, SEO, idea-page structure, data layer), so it is planned against `BUTTERFLY_EFFECT.md` first. Existing 280 ideas and the sheet are protected throughout.

## Who writes which column (corrected: Claude = research/SEO only, Gemini = all writing)

Principle: **Claude researches and validates; Gemini writes the story from Claude's validated data.** Keeps Claude tokens low, offloads the expensive prose to free Gemini, and Gemini can never fabricate because it only phrases researched facts.

**Claude Code + Coworkers own (8 fields — short or data, low-token):**
- `title`, `slug`, `seo_title`, `meta_description`, `tags` — the search identity (precision-critical, cheap to write)
- `external_links` — 2–4 **real, verified** authoritative links per idea → across 1000s of ideas = 1000s–5000s distinct real links (the scaling backlink pool, not a fixed 12)
- `internal_link_anchors`
- `research_facts` **(NEW jsonb column)** — the validated numbers, stats, benchmark ranges, and source URLs Claude researches per idea

(`focus_keyword` + `additional_keyword_1/2` + the category/subcategory fields come from the Stage-1 seeds.)

**Gemini (n8n, free-key rotation) writes (16 fields — all narrative, strictly from `research_facts`):**
`summary, market_opportunity, target_customer, how_you_make_money, startup_cost, income_potential, competition_edge, getting_started_steps, tools_needed, time_to_first_customer, faq_json, pros_json, cons_json, verdict, trend_score, tier`

## The anti-fabrication mechanism (`research_facts`)

- Claude puts **real numbers + stats + source URLs** into `research_facts`.
- Gemini's prompt becomes: **"Write every section ONLY from research_facts. Never invent a number. Weave in the external links naturally."**
- So Gemini does the heavy writing but **cannot fabricate** — every figure traces to Claude's research. No content field needs to move to Claude; only the *data* does.

## Cost math (why this split)

- Claude writing full 500-word ideas ≈ **4,500 tokens/idea** (paid).
- This split: Claude does research + short SEO fields only ≈ **1,500–2,000 tokens/idea**; the 500-word prose → **Gemini, free.**
- ≈ **60–65% fewer Claude tokens/idea**, bulk writing at **$0**. Coworkers parallelize the research across categories to speed wall-clock.

## New column to add (additive, safe)

- `research_facts jsonb` — same additive/nullable migration pattern as the other new columns; existing 280 rows get NULL, nothing breaks.

## How Claude hits "100% top-notch SEO" per page (the quality standard)

For every idea Claude writes, it will:
- **Focus + additional keywords:** placed naturally in `title`, `seo_title`, `meta_description`, first line of `summary`, and one section — target ~1–1.5% density, **never stuffed**.
- **seo_title:** 50–60 chars, focus keyword front-loaded, no year.
- **meta_description:** 140–160 chars, focus keyword once, click-worthy, honest.
- **slug:** strong 3–5 words, no stuffing, no category/subcategory repetition (rule already set).
- **External links:** **real, verified** authoritative URLs (govt/institution/top-authority) relevant to that exact idea — Claude fetches to confirm each resolves; no fabricated links.
- **Internal links:** anchor phrases resolved to real library pages at render (never broken).
- **Researched data:** `income_potential` (and money fields if moved to Claude) grounded in live web research — real ranges, cited sources noted; **no invented figures.**
- **No templated sameness:** each idea's fields vary in shape; deduped title/slug across the batch.

## Every part we must edit — with blast radius (butterfly map)

| Part | What changes | Blast radius | Safety rule |
|---|---|---|---|
| Google Sheet | add all new headers, fixed order | Low / isolated | Append at end; existing rows keep empty cells (= NULL) |
| Seed+SEO engine (me + Coworkers) | new capability, generates the 24 columns as TSV | Isolated | New output only; nothing existing touched |
| n8n workflow (Gemini) | Gemini now fills ONLY its subset + passes Claude's fields through unchanged | Isolated (one file) | Rework prompt+parser+mappings; never overwrite Claude columns |
| Idea page `idea.$slug.tsx` | render new sections, SEO `<head>` (seo_title/meta), canonical, internal/external links | **HIGH** — every idea renders here | Additive + conditional; base render never breaks; verify old 280 after |
| `ideas-shared.ts` / `ideas.functions.ts` | add new fields to type + mapping | **HIGH** — data contract | Additive fields only; never change existing shapes |
| Supabase `ideas` | columns already added (14) | Done / safe | Nullable; 280 rows already safe |
| Existing 280 ideas | none | Critical to protect | New fields NULL → sections simply don't render for them |

## Safe build sequence

1. **Confirm the money-fields decision** (above) → finalizes column ownership.
2. **Sheet headers** added (you paste, or grant me access).
3. **n8n workflow rework** — Gemini writes only its subset, reads Claude's fields as ground truth, passes them through untouched. (Isolated file; re-import.)
4. **Seed+SEO engine** — I + Coworkers generate a first batch (e.g. 25 ideas) with full research + SEO → TSV for the sheet.
5. **Site render step** — wire new sections + SEO head + links into the idea page (HIGH blast radius: additive/conditional, then verify homepage/category/old-idea pages are unchanged).
6. **Run Gemini** on the batch → full ideas land in Supabase → verify one live on the preview.
7. Repeat batches; schedule for autopilot.

## Throughput reality (so expectations are right)

- Claude doing **real per-idea web research + SEO** is high-quality but **not instant**: ~a few web lookups + ~250–300 words per idea. Realistic batch = **~25 ideas per round**; Coworkers run categories in parallel to speed wall-clock (they share this session's budget, so they speed time, not total cost).
- This is **ongoing batched** work, not a one-shot 10,000. That's the price of "researched, no fabrication."

## Decisions needed from you

1. **Money fields:** move `startup_cost` + `how_you_make_money` to Claude (all numbers researched) — yes/no? (I recommend yes.)
2. **Sheet handoff:** I output TSV for you to paste, OR you grant Google Sheet write access for true hands-off?
3. **First batch:** which categories + how many ideas in round 1 (e.g. CAT-001, 25 ideas)?
