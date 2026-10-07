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
| 1 | **Digit stripper: not seen in the newest rows — confirm the source before closing** (on hold: the founder said on 2026-10-07 to skip this for now; do not raise it until he reopens it) | Measured 2026-10-02: the 90 ideas created 2026-10-01 (IDEA-00650 onward) all contain digits (0 of 90 without) and 35 carry `$`, `₹` or `%`. The 2026-09-13 batch was stripped (117 of 119 without digits); the 2026-09-22 batch was repaired. So the stripper did not hit the 2026-10-01 batch. Not yet known whether it was removed from the n8n workflow or that batch was written another way. Detail: `PIPELINE.md`. | **You**: say which route wrote the 2026-10-01 batch. Then Claude closes or keeps this row. |
| 2 | **Copy the 2026-09-22 repair into the Google Sheet** | The sheet still holds the stripped text. If the pipeline re-syncs an old row, it overwrites the repair. Every fix is in `public.ideas_narrative_fixes_20260922` (old → new). Do after #1. | Claude, with approval |
| 5 | **Glossary claims verified data it does not have** | `data/glossary.json` says `"data_level": "ACTUAL"` for all 159 terms. Measured 2026-10-02: 0 terms carry a source URL, and 107 of 159 `example_in_practice` lines contain a dollar or other figure with no source. Needs a sourcing pass (an authoritative link per term, examples marked illustrative or stripped of figures), or the label changed. | **You** choose: sourcing pass by a researcher/coworker, or Claude relabels and strips unsourced figures |
| 32 | **`updated_ideas` table is far bigger than recorded — 409 rows, not 10, and its 599–608 tail duplicates live slugs** | Corrected 2026-09-24: this table spans IDEA-00001 to IDEA-00608 (409 rows), not just IDEA-00599–00608. 399 of its rows share an `idea_id` with a live `ideas` row but carry a completely different title and copy (e.g. IDEA-00001 here is "NightShift Hood Log"; live is "Micro SaaS Business Idea for Trades Stuck Doing Unpaid Paperwork") — looks like a full alternate/earlier title-and-copy pass that was never adopted. Its 10 "new" rows (IDEA-00599–00608) reuse the exact slugs of live IDEA-00400–00409, so merging them as new rows would create duplicate-slug pages. Not touched — merging or dropping 409 rows of someone's earlier work needs your call, not a guess. | **You** decide: keep as an archived draft, merge selectively, or drop the table; Claude executes once decided |
| 13b | **India Idea Atlas: round 2 built, waiting on four keys to deploy** | Plan: `BBI_EXPANSION.md`. Live: `/india/ideas` pages (draft fixtures, noindex), schema 001 + 002 in Supabase. Built and tested: four n8n workflows in `n8n/india/` (Planner, Worker, Publisher with an AI reviewer instead of a human, Error handler), prompts, validator, deploy script. Not yet run inside n8n. To deploy with no work in n8n: `node n8n/india/deploy.mjs` needs `N8N_URL`, `N8N_API_KEY`, `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (see `n8n/india/README.md`). | **You**: give the four values. Claude: deploy and watch the pilot |

## P1 — visible on the site, or blocks AdSense

| # | What | Why it matters | Owner |
|---|---|---|---|
| 6 | **Old "Keep exploring" block on 16 routes** | `ExploreRail` (three generic cards) still renders directly above the new resource block ("The founder's toolkit"). Counted 2026-10-02: 16 route files mount it, and 11 of 14 live pages sampled showed it. Remove the mounts, then delete the component. | Claude |
| 7 | **Google still shows the old site-builder icon** | Checked 2026-09-27: Google's favicon cache (`google.com/s2/favicons?domain=bbusiness.online`) still returns the old heart icon; the site serves Bro-B. On 2026-09-27 the icon links moved to never-fetched URLs (`/images/brob-favicon-192.png`, `/images/brob-favicon-48.png`, both multiples of 48) so Google has to fetch fresh. Delete this row once that URL returns the Bro-B mark. | **You**: after the deploy, Search Console → URL Inspection → `https://bbusiness.online/` → Request indexing |
| 8 | **No `ads.txt`, no AdSense publisher ID** | Hard requirement for AdSense. | **You** supply the publisher ID |
| 10 | **`sameAs` is empty** | Organization schema lists no social profiles. Deliberately empty — inventing them is worse. | **You** supply the real profile URLs |
| 12 | **Look at the 2026-09-22 changes on the live site** | Nothing from that day was seen rendered from a session. Worth a look: one idea page, `/founders`, `/calculator/break-even`, a category page, a blog post, the homepage, and the footer's Built With strip (now credits Cloudflare, not Vercel). | **You** |
| 36 | **"One more thing, from us to you" internal-link section: shipped site-wide, then pulled the same day for a bad pairing** | Shipped to all idea pages 2026-09-24, then pulled (commit `dd8f8e5`) after it recommended "Part Time Obituary Writing Business for Families With No Words Left" in the cheerful "no tension yaar" voice on the trial page itself. Root cause: `pickFriendTalkLinks()` drew from `related`/`trending`, both `ORDER BY random()` at the DB level with zero topical/tone filtering and no dedup against the curated `InternalLink` slots or the Keep Exploring rail — the opposite of the founder's original "not just any random linking" instruction. Currently off (renders nothing, function unused but left in place in `idea.$slug.tsx`). Rebuild needs: match by shared category/tags/keywords (like `pickContextualLinks` already does, not `ORDER BY random()`), a sensitive-topic exclusion list (funeral/obituary/religious content at minimum), and cross-dedup against the other two link systems on the page. The 3 OLDER curated `InternalLink` slots reading `ideas.internal_link_anchors` are unaffected by this, still only populated for IDEA-00330. Saffron/yellow-hover styling on those and the fixed `html.light .bbi-instrument a:hover{!important}` bug (commit `c5660d6`) both stay. | **You** decide: rebuild the friend-talk section properly, or drop it; separately decide whether to resume writing curated `internal_link_anchors` content for the rest of the library |
| 37 | **Site-wide crimson glass refinement 2026-09-24 (homepage excluded): waiting on visual review** | Interior surfaces now use the founder’s Poppins / #CA0808 / #120404 / #270A0A references: static corner illumination, shaped glass, readable paragraph groups and semantic idea-section icons. Category-image contrast is corrected, and inactive pointer effects no longer write styles outside Home. Every page except the homepage uses the shared idea-page system (`.cm-page` on SiteShell, styles in `src/components/idea-cinema/cinema.css`, motion owner `src/components/site-stage.ts`); every idea renders through `src/components/idea-cinema/`. The homepage keeps its original design and motion at the founder's request: SiteShell and the shared motion hooks check the path (`src/motion/legacy-page.ts`). The "Browse by type" header menu (and its phone-menu copy) is removed everywhere, homepage included. Rollback ref: branch `rollback/pre-site-rollout-2026-09-24` (= `1ba9b8d`). Tell Claude which sections to revert; each section is its own labelled block in `components/idea-cinema/cinema.css` or its own file. Open, needing your call: the homepage FAQ answer "How are trend scores calculated?" says scores come from "current market demand signals", which contradicts the idea pages' note that it is an internal editorial score; the homepage's "967 founders reviewed us" figure has no source in the repo. Neither was touched, because the homepage is out of scope. | **You** review; Claude reverts named sections |

## P2 — content quality across the library

All of these change Supabase rows, so each needs approval first and a backup
of the column before writing — the same way the 2026-09-22 repair was done.

| # | What | Measured 2026-09-22 | Owner |
|---|---|---|---|
| 13a | **8 new ideas still missing premium sections; tone rewrite of the old 409 half done** | Stopped 2026-09-24 at the founder's request. Still empty: IDEA-00476–00478 and 00580–00584 (FAQ, playbook, cost sections don't show). Tone rewrite: 202 of 409 old ideas done, 207 left; find them with `verdict is not distinct from ideas_backup_20260923.verdict`. If restarted: fewer agents (about 3), cheaper model for the tone pass, and the founder allows `mcp__Supabase__execute_sql`, `WebSearch`, `WebFetch` in /permissions first, otherwise every batch asks for a click. | **You** decide when to restart |
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
