# OPS_LOG

Changes made **outside this repo**, newest first. Git history records code;
this records everything git cannot see: the Cloudflare dashboard, DNS,
Supabase data, n8n, Google Search Console, domain settings.

One line per change: `- YYYY-MM-DD · where · what · who`. Add yours at the top,
in the same session you made the change. `scripts/session-brief.mjs` prints the
latest eight lines at the start of every session.

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
