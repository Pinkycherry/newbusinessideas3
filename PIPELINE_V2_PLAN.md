# Idea Pipeline v2 — rich SEO + human tone (columns, migration, existing-rows plan)

Status: **workflow written, migration NOT run yet.** Nothing touched in Supabase or the sheet until you say go.
Files: `n8n-idea-pipeline-v2.json` (import into n8n), this plan.

## What changed vs your current workflow

- **Removed the old "VC Managing Partner" pipeline** (the one that forced `$49/mo SaaS` templated tone). Kept and upgraded only your good "honest operator" pipeline.
- **Same credentials, same sheet, same table** — nothing re-authed:
  - Google Sheets cred `bmcUgKzJNC8kvUCj`, doc `1Jx4-kCmcKXl2eOsivEBWnlSmkkGOql49_x54ssKqDZ8`, tab `Updated SuperBase1` (gid 1572637316).
  - Gemini cred `lgFdMUWoybo6ngbt` ("Current"), model `models/gemini-3.6-flash`.
  - Supabase cred `B7VX9z6RAJCh89LB`, table `ideas`.
- **Master prompt rewritten** for brand integrity: proud-Indian-engineer human voice, honesty over hype, zero emojis, no real brand names, no template words, sector-truth (no SaaS default), full SEO fields, and a **fixed government-link whitelist** (Gemini picks from real URLs, never invents them).
- **13 new content/SEO fields** now generated + written to both the sheet and Supabase.

## The new columns (append at the END — never reorder the existing 21)

| Column | Type (Supabase) | What it holds |
|---|---|---|
| `seo_title` | text | 50–60 char SEO title |
| `meta_description` | text | 140–160 char meta description |
| `market_opportunity` | text | demand signal + why now |
| `target_customer` | text | exact person who pays |
| `how_you_make_money` | text | pricing/money in sector terms |
| `startup_cost` | text | realistic money + gear to start |
| `income_potential` | text | honest income range + ceiling |
| `competition_edge` | text | what the obvious version gets wrong |
| `getting_started_steps` | jsonb | ordered first-steps array |
| `tools_needed` | jsonb | required tools/gear array |
| `time_to_first_customer` | text | realistic timeline |
| `faq_json` | jsonb | array of {q, a} |
| `external_links` | jsonb | array of {label, url} — govt only |
| `internal_link_anchors` | jsonb | array of topic phrases (site resolves to real internal links) |

`slug` already exists in Supabase (it's just missing from the sheet — the header row below adds it).

## Supabase migration — how existing 280 rows are treated (your main worry)

- We add every new column as **nullable**. Postgres immediately fills all 280 existing rows with **NULL** — automatic, instant, zero data loss, zero downtime, zero errors.
- The n8n Supabase node only writes the columns it maps, so **existing rows are never touched** by future runs unless you re-process them.
- The idea page renders each new section **only when it has data** → the 280 old ideas keep their current look, new ideas get the rich look. Nothing breaks either way.
- Backfilling the old 280 with rich content later is optional and additive — same pipeline, just flip their `status` back to `pending`.

**Exact migration (safe, additive, run when you say go):**

```sql
alter table public.ideas
  add column if not exists seo_title            text,
  add column if not exists meta_description      text,
  add column if not exists market_opportunity    text,
  add column if not exists target_customer       text,
  add column if not exists how_you_make_money     text,
  add column if not exists startup_cost          text,
  add column if not exists income_potential      text,
  add column if not exists competition_edge      text,
  add column if not exists getting_started_steps jsonb,
  add column if not exists tools_needed          jsonb,
  add column if not exists time_to_first_customer text,
  add column if not exists faq_json              jsonb,
  add column if not exists external_links        jsonb,
  add column if not exists internal_link_anchors jsonb;
```

## Sheet — do you add columns, or me?

- It's just appending headers at the **end** of the `Updated SuperBase1` tab — you can do it, or paste this exact header block after your existing `tier` column (tab-separated, in this order):

```
slug	seo_title	meta_description	market_opportunity	target_customer	how_you_make_money	startup_cost	income_potential	competition_edge	getting_started_steps	tools_needed	time_to_first_customer	faq_json	external_links	internal_link_anchors
```

- Existing rows just get empty cells for the new columns = same as NULL. No existing data is lost.
- The workflow's "Update Row in Sheet" node already knows these columns and will fill them on each run.

## Order to roll this out (safe sequence)

1. **Run the Supabase migration** (SQL above) — additive, 280 rows safe.
2. **Add the new headers** to the sheet (block above).
3. **Import `n8n-idea-pipeline-v2.json`** into n8n; delete/disable the old workflow.
4. **Test on 1–2 pending rows** → check tone + all fields fill + govt links are from the whitelist.
5. **Idea page render** (separate site step): add the new sections to `idea.$slug.tsx`, each conditional on its field — old ideas unaffected. This is the only step that touches site code, and it's additive/conditional.

## Still needs you / notes

- Gemini key rotation isn't in this file (your shared workflow didn't have it). Say the word and I'll add a 2-key rotation + cooldown.
- `internal_link_anchors` are phrases, not URLs, on purpose — the site turns them into real internal links so nothing is ever a broken/hallucinated link.
- I did **not** run the migration or edit the sheet — waiting for your go.
