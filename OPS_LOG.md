# OPS_LOG

Changes made **outside this repo**, newest first. Git history records code;
this records everything git cannot see: the Cloudflare dashboard, DNS,
Supabase data, n8n, Google Search Console, domain settings.

One line per change: `- YYYY-MM-DD · where · what · who`. Add yours at the top,
in the same session you made the change. `scripts/session-brief.mjs` prints the
latest eight lines at the start of every session.

- 2026-09-24 · Supabase · All research and tone agents stopped at the founder's request (permission prompts + cost). Saved state: 172 of the 180 new ideas filled, 8 still empty (IDEA-00476–00478, 00580–00584). Tone rewrite of the old 409: 202 rows done (a row is done when its `verdict` differs from `ideas_backup_20260923`), 207 not started. Rewritten rows have no dashes; 17 untouched old rows still do. Numbers were kept as-is in rewrites. · Claude
- 2026-09-24 · Supabase · Wrote trial `internal_link_anchors` content for IDEA-00330 only (3 entries, new `{sentence, anchor, slug, position}` shape — see PENDING #34). Backed up all 409 non-null `internal_link_anchors` values first to `public.internal_link_anchors_backup_20260924`. No other row touched; founder paused further writes to this column pending review of the trial page. · Claude (Cowork)
- 2026-09-24 · Supabase · Fixed PENDING #31: 11 ideas (IDEA-00283, IDEA-00400–00409) had `research_facts` stored as a double-encoded JSON string instead of a native array — `jsonb_typeof` returned `string`. Backed up the 11 original values to `public.research_facts_backup_20260924` first, then unwrapped each into a real jsonb array (`jsonb_build_array` around the parsed inner object), preserving every existing key and value exactly — no content was rewritten or reinterpreted. Confirmed all 11 now read `array`; the other 398 string-typed rows are the `""` empty-facts placeholder (founder in progress, untouched). · Claude (Cowork)
- 2026-09-24 · Supabase · Fixed PENDING #13a's category-FAQ gap: 6 categories had zero rows in `category_faqs` (Part Time, Online, Village, Business Ideas for Women, Agriculture & Farming, Small Town — corrected from "4" in the prior PENDING note). Wrote 6 FAQs per category (36 total), matching the question/answer tone and length of the other 15 categories' existing FAQs. Every category now has exactly 6 active FAQs. · Claude (Cowork)
- 2026-09-24 · Supabase · Investigated PENDING #32 (`updated_ideas` table): corrected scope from "10 rows" to 409 rows (IDEA-00001–00608). 399 rows share an idea_id with a live `ideas` row but carry a completely different title/copy — looks like an abandoned alternate title-and-copy pass, never adopted. Its 10 rows beyond the current max (IDEA-00599–00608) reuse the exact slugs of live IDEA-00400–00409, so merging as new rows would create duplicate-slug pages. No data changed — this needs the founder's call (archive, selective merge, or drop), not a guess. · Claude (Cowork)
- 2026-09-24 · Supabase · Investigated PENDING #33 (IDEA-00565 missing digits): not the digit-stripper bug (#1). The writer correctly declined to state an unsourced startup-cost/income total ("we found no sourced total…") per the zero-fabricated-numbers rule — `research_facts` has two real sourced prices (₹450, ₹250 for cable joints) but not enough sourced data to build a legitimate full-kit total or income figure. Left as-is; adding digits here would mean fabricating a number the pipeline correctly avoided. Row removed from PENDING as "working as intended," not a bug. · Claude (Cowork)
- 2026-09-23 · Supabase · Checkpoint: 80 of the 139 empty ideas (IDEA-00451 onward) filled by five parallel research agents, 59 left. Checked clean at this point: no em/en dashes, no government links, all JSON fields valid arrays. Session hit its usage limit mid-run once already; agents resume from their last saved batch, so no completed row is redone. · Claude
- 2026-09-23 · Supabase · Backups consolidated at the founder's request: new full copy `public.ideas_backup_20260923` (all 589 rows, all columns, taken before the research agents wrote). Dropped the partial backups `ideas_seo_title_backup_20260920`, `ideas_meta_desc_backup_20260921`, `ideas_pros_backup_20260921`, `ideas_cons_backup_20260921`, `ideas_title_backup_20260921`, `ideas_narrative_backup_20260922`, `ideas_narrative_ok_20260922`, `ideas_detail_backup_20260923`. Kept the fix log `ideas_narrative_fixes_20260922` (PENDING #2 needs it). · Claude
- 2026-09-23 · Supabase · IDEA-00410 to IDEA-00589 (the 180 ideas imported 2026-09-22) arrived with nine premium columns NULL: target_customer, how_you_make_money, startup_cost, income_potential, competition_edge, time_to_first_customer, getting_started_steps, tools_needed, faq_json. Cowork filled IDEA-00410 to 00450; Claude Code research agents are filling IDEA-00451 to 00589 (from 16:40 UTC), writing sourced facts and links straight to Supabase in batches of five. · Claude + Founder
- 2026-09-23 · Google Search Console · Founder removed and re-added the bbusiness.online property. Search still shows the old Lovable favicon: Google's favicon cache, not the site (the site serves the Bro-B mark). Fix is time plus one "Request indexing" on the homepage. · Founder
- 2026-09-23 · Cloudflare SSL/TLS · "Always Use HTTPS" switched ON for bbusiness.online. · Claude (Cowork)
- 2026-09-23 · Cloudflare Rules · Single Redirect "www to apex, http and https": `http*://www.bbusiness.online/*` → `https://bbusiness.online/${2}`, 301, query string kept. Verified: http apex, http www, https www each reach the https apex in one 301. · Claude (Cowork)
- 2026-09-23 · Cloudflare DNS · Added proxied `A www 192.0.2.1` (placeholder; it only exists so the redirect rule can fire). · Claude (Cowork)
- 2026-09-23 · Supabase · `research_facts` being filled by the founder: 52 of 589 rows had facts on this date. · Founder
- 2026-09-22 · Supabase · Digit-stripping repair on all 589 ideas; every change (old → new) kept in `public.ideas_narrative_fixes_20260922`. Backup tables from the 20–22 Sept rewrites are listed in PENDING #24. · Claude
- 2026-09-18 · Cloudflare · bbusiness.online brought up: Worker `pinkycherry-newbusinessideas3` building from `main`, apex attached as Custom Domain, six runtime Secrets, Hostinger `A`/`CNAME` deleted. Full record: `LAUNCH_RUNBOOK.md` §15.

## Current Cloudflare setup (read from the dashboard 2026-09-23)

- Worker `pinkycherry-newbusinessideas3`, repo `Pinkycherry/newbusinessideas3`,
  production branch `main`. Build command: none. Deploy command:
  `npx wrangler deploy`.
- `/version.json` on the live site returns the commit Cloudflare built. If it
  differs from `main`, a build is running or failed: Workers & Pages →
  `pinkycherry-newbusinessideas3` → Deployments.
- Old Worker `bbi-with-chatgpt` still exists in the account (last deployed
  2026-09-21). It is not the live site.
