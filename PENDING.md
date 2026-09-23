# PENDING

**The only list of open work.** Every item below was checked against the live
database or the code on **2026-09-22** — none is copied forward from an older
doc. When something is done, delete its row; when something new comes up, add
one. The previous running log (97 entries, Aug–Sep 2026) is in git history.

Counts below are snapshots, dated. Before quoting one, re-measure:
`node scripts/session-brief.mjs` prints the common ones live.

Owner: **You** = needs the founder (an account, a decision, a click).
**Claude** = code or data work a session can do, with approval where noted.

## P0 — broken now, or breaks the next deploy

| # | What | Why it matters | Owner |
|---|---|---|---|
| 1 | **Find and remove the digit stripper in the pipeline** | Every new idea still arrives with all digits, `$`, `₹`, `%`, `:` and `+` deleted. The 589 existing rows were repaired on 2026-09-22; the next pipeline run breaks new ones. It is not in the repo's workflow export or in Supabase — it is in the live n8n workflow or the Google Sheet. Full detail and the fix plan: `PIPELINE.md`. | **You**: n8n → ⋯ → Download the live workflow and give Claude the file. Then Claude. |
| 2 | **Copy the 2026-09-22 repair into the Google Sheet** | The sheet still holds the stripped text. If the pipeline re-syncs an old row, it overwrites the repair. Every fix is in `public.ideas_narrative_fixes_20260922` (old → new). Do after #1. | Claude, with approval |
| 4 | **AI vendor names shown on the site** | `src/lib/validate-shared.ts` prints ChatGPT, Claude, Gemini, Grok and Perplexity in the Validate UI — against the rule in `CLAUDE.md`. | **You** decide how Validate should name its destinations; Claude fixes |
| 5 | **Glossary claims verified data it does not have** | `data/glossary.json` says `"data_level": "ACTUAL"` with zero source URLs. Either source it or change the label. | Claude |
| 32 | **`updated_ideas` table is far bigger than recorded — 409 rows, not 10, and its 599–608 tail duplicates live slugs** | Corrected 2026-09-24: this table spans IDEA-00001 to IDEA-00608 (409 rows), not just IDEA-00599–00608. 399 of its rows share an `idea_id` with a live `ideas` row but carry a completely different title and copy (e.g. IDEA-00001 here is "NightShift Hood Log"; live is "Micro SaaS Business Idea for Trades Stuck Doing Unpaid Paperwork") — looks like a full alternate/earlier title-and-copy pass that was never adopted. Its 10 "new" rows (IDEA-00599–00608) reuse the exact slugs of live IDEA-00400–00409, so merging them as new rows would create duplicate-slug pages. Not touched — merging or dropping 409 rows of someone's earlier work needs your call, not a guess. | **You** decide: keep as an archived draft, merge selectively, or drop the table; Claude executes once decided |

## P1 — visible on the site, or blocks AdSense

| # | What | Why it matters | Owner |
|---|---|---|---|
| 6 | **Old "Keep exploring" block on 17 pages** | `ExploreRail` (three generic cards) still renders directly above the new resource block on 17 routes. Remove the mounts, then delete the component. | Claude |
| 7 | **Google still shows the Lovable icon** | The site's favicon has been the Bro-B mark since 2026-09-20 and meets Google's rules (includes 48×48, not blocked by robots). Google is showing its old cached copy. | **You**: Search Console → URL Inspection → `https://bbusiness.online/` → Request indexing |
| 8 | **No `ads.txt`, no AdSense publisher ID** | Hard requirement for AdSense. | **You** supply the publisher ID |
| 10 | **`sameAs` is empty** | Organization schema lists no social profiles. Deliberately empty — inventing them is worse. | **You** supply the real profile URLs |
| 12 | **Look at the 2026-09-22 changes on the live site** | Nothing from that day was seen rendered from a session. Worth a look: one idea page, `/founders`, `/calculator/break-even`, a category page, a blog post, the homepage, and the footer's Built With strip (now credits Cloudflare, not Vercel). | **You** |
| 36 | **"One more thing, from us to you" internal-link section: shipped site-wide, then pulled the same day for a bad pairing** | Shipped to all idea pages 2026-09-24, then pulled (commit `dd8f8e5`) after it recommended "Part Time Obituary Writing Business for Families With No Words Left" in the cheerful "no tension yaar" voice on the trial page itself. Root cause: `pickFriendTalkLinks()` drew from `related`/`trending`, both `ORDER BY random()` at the DB level with zero topical/tone filtering and no dedup against the curated `InternalLink` slots or the Keep Exploring rail — the opposite of the founder's original "not just any random linking" instruction. Currently off (renders nothing, function unused but left in place in `idea.$slug.tsx`). Rebuild needs: match by shared category/tags/keywords (like `pickContextualLinks` already does, not `ORDER BY random()`), a sensitive-topic exclusion list (funeral/obituary/religious content at minimum), and cross-dedup against the other two link systems on the page. The 3 OLDER curated `InternalLink` slots reading `ideas.internal_link_anchors` are unaffected by this, still only populated for IDEA-00330. Saffron/yellow-hover styling on those and the fixed `html.light .bbi-instrument a:hover{!important}` bug (commit `c5660d6`) both stay. | **You** decide: rebuild the friend-talk section properly, or drop it; separately decide whether to resume writing curated `internal_link_anchors` content for the rest of the library |

## P2 — content quality across the library

All of these change Supabase rows, so each needs approval first and a backup
of the column before writing — the same way the 2026-09-22 repair was done.

| # | What | Measured 2026-09-22 | Owner |
|---|---|---|---|
| 13a | **Premium sections missing on the 180 newest ideas** | IDEA-00410 to IDEA-00589 (village, women, agriculture, small town) were imported on 2026-09-22 with nine columns empty, so FAQ, How to start, What you need, Who pays, How the money works, Competition edge, Startup cost and Income potential do not show. Cowork filled 00410 to 00450; five Claude Code research agents are filling 00451 to 00589 in parallel (56 of 139 left as of 2026-09-24 — live count: `faq_json null` in the session brief). Full backup from before the fill: `ideas_backup_20260923`. When the count reaches 0, delete this row. **Category FAQs fixed 2026-09-24**: Part Time, Online, Village, Women, Agriculture & Farming and Small Town each had zero (corrected count — previously recorded as four categories, actually six); all six now have the standard six FAQs, matching format/tone of the other 15 categories. | Claude (in progress — idea rows only) |
| 13 | **Research facts still being added** | 537 of 589 rows had no `research_facts` on 2026-09-23 (578 on 2026-09-22). The founder is adding them — do not touch or re-raise. Missing facts are the root cause of #1: with no sourced numbers, the writer invented them. | **You** (in progress) |
| 14 | **"What it costs to start" is the same paragraph on 356 ideas** | `startup_cost` has only 54 distinct values across 589 rows; 356 read "Getting started costs very little beyond basic tools…" | Claude, with approval |
| 15 | **`target_customer` boilerplate on 356 old rows** | New rows from the pipeline are fine — only the old ones. | Claude, with approval |
| 16 | **398 meta descriptions use one template** | Measured live 2026-09-23: all 589 have a meta description and 588 are unique. 398 follow "How to start a … business. Honest steps, the real work involved, and who it suits best." — unique, but templated. The one exact duplicate is the niche-job-board pair (#20). The founder has reviewed meta: **low priority, do not raise again** unless asked. | **You** decide if ever |
| 17 | **The line under each idea's title reads like an internal brief** | 292 `business_description`s follow the seed format "The customer is… Money is… The hint: …" and show under the H1. | **You** decide the format; Claude rewrites |
| 18 | **398 of 589 ideas cite no sources** | `external_links` empty. | Pipeline |
| 19 | **Internal-link anchors on 11 of 589** | The page already renders them; the field is just empty. | Pipeline |
| 20 | **Two ideas target the same keyword** | IDEA-00010 and IDEA-00350 both use `niche job board business idea`. | **You** pick which one keeps it |

## P3 — housekeeping

| # | What | Owner |
|---|---|---|
| 21 | `src/lib/generated-calculators.ts` has ~620 type errors. The build passes (Vite strips types), but they hide real errors. | Claude |
| 22 | Files nothing imports: `src/components/aceternity/blur-text.tsx`, `molten-metal.tsx`, `public/images/bbi-logo.png` (+ `@2x`), and `explore-rail.tsx` once #6 is done. | Claude |
| 23 | Decide: delete or keep the two switched-off heading animations (`src/motion/use-text-reveal.ts` is a no-op, `src/components/site-text-motion.tsx` is unmounted). | **You** |
| 24 | Drop `ideas_backup_20260923` (full copy of `ideas`, taken 2026-09-23) once the research fill on IDEA-00451 to 00589 has been checked on the site, and the fix log `ideas_narrative_fixes_20260922` after #2. The older partial backups were dropped on 2026-09-23. | Claude, with approval |
| 25 | The blog branch of the pipeline has a placeholder sheet ID (`REPLACE_WITH_YOUR_SHEET_ID`) per `PIPELINE.md`. Check whether it is still unset. | Claude, after #1 |
| 26 | Some images are hotlinked from ethicalfounder.com (same owner). They depend on that site staying up. | Low |
| 34 | `idea_research` table (72 rows) untouched since 2026-09-10 — looks idle/orphaned. Confirm whether the pipeline still writes to it; drop if not. | Claude, with approval |
| 35 | Category IDs are inconsistently zero-padded (3-digit vs 4-digit) across rows. Check whether it affects sorting or URLs before treating as cosmetic. | Claude |

## Decisions waiting on you

| # | Question | Recommendation |
|---|---|---|
| 27 | Move ideas to `/idea/<category>/<slug>`? | **No.** The URLs are indexed; changing them costs redirects and ranking for no real gain. |
| 28 | Title case: "Work from Home" or "Work From Home"? | One word from you and it is applied to every title. |
| 29 | Golden Tree transparency — paused at your request. | Only with a real alpha-channel export of the artwork and a screenshot check. |
| 30 | A full mobile pass, every page on a real phone. | Worth doing before applying for AdSense. |
