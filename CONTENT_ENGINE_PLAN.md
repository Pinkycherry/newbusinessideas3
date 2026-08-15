# Content Engine — division of labor, SEO standard, and safe edit plan

Status: **plan only, no edits yet.** This touches the core (workflow, SEO, idea-page structure, data layer), so it is planned against `BUTTERFLY_EFFECT.md` first. Existing 280 ideas and the sheet are protected throughout.

## Who writes which column

**Claude Code + Coworkers write (24 columns) — the SEO-critical + research-backed layer:**
`idea_id, category_id, category_name, category_slug, subcategory_id, subcategory_name, subcategory_slug, focus_keyword, additional_keyword_1, additional_keyword_2, business_description, collection_id, status, title, summary, tags, slug, seo_title, meta_description, income_potential, getting_started_steps, tools_needed, external_links, internal_link_anchors`

**Gemini (n8n, free-key rotation) writes (the rest) — the narrative body layer:**
`market_opportunity, target_customer, how_you_make_money, startup_cost, competition_edge, time_to_first_customer, faq_json, pros_json, cons_json, verdict, trend_score, tier`

Rationale: Claude owns everything that decides search ranking + anything needing **real researched data** (it has live web search); Gemini cheaply expands the qualitative prose from Claude's ground-truth fields.

## The one risk in this split (needs your call)

- "No guessing, no random numbers, no fabrication" — but **Gemini cannot research; it will invent numbers.** Two money fields are currently on Gemini's side: `startup_cost` and `how_you_make_money`.
- **Recommendation:** move `startup_cost` + `how_you_make_money` to **Claude** too (so every hard number is researched, not guessed). Gemini then writes only non-numeric narrative (`target_customer, competition_edge, time_to_first_customer, faq_json, pros_json, cons_json, verdict`) + `trend_score`/`tier`.
- Your choice: keep the split as-is (Gemini reasons ranges, not researched) OR move the 2 money fields to Claude (all numbers researched). I recommend the latter.

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
