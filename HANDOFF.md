# HANDOFF — bbusiness.online (shared between Pinky 1 and Pinky 2)

Read this first. Update and commit it to main before you stop. Times are IST.

## Current state (6 Nov 2026, ~22:30 IST, Pinky 2)

- Live commit: 4599f6c on main (check https://bbusiness.online/version.json).
- Data: 4,200 ideas, 42 live categories, 420 subcategories. Under Google AdSense review.
- New glass layout live on: home, idea pages, /topics, /browse, validate form. Other pages still use older layouts.
- Indexing rule (founder): individual idea pages and individual calculator pages are noindex. Everything else in the submitted sitemaps stays indexed. Never noindex a page because of its layout.
- Sitemaps (already submitted by the founder): https://bbusiness.online/sitemap-index.xml with pages, categories (504), blog (23), india (empty).
- Cloudflare: free Workers plan, rate limit is being hit. Founder moves to the paid plan in 3 to 4 days. Keep live checks to a minimum.

## Done (newest first)

- 6 Nov ~22:00 — /sitemap set to noindex, follow and removed from sitemap-pages.xml (founder's order on 6 Nov, because the page layout is broken). Commit 4599f6c. NOTE: founder said later the same evening "don't noindex for layout". Question 1 below asks whether to undo it. Check: https://bbusiness.online/sitemap
- 6 Nov ~21:00 — Audit of 15 page types at 360px and 1366px (results below).
- 6 Nov ~15:30 — Glass system site-wide, idea page rebuilt mobile-first, /topics hub, browse cards, 301s for /market-research, /frameworks-comparison, /lists/coaching-business-ideas. Check: https://bbusiness.online/idea/pg-student-tiffin-plan https://bbusiness.online/topics https://bbusiness.online/browse
- 6 Nov ~13:30 — 3D India startup map on the home page (PIB data, 17 Mar 2026). Check: https://bbusiness.online/
- 6 Nov earlier — home redesign, free site (no pricing, no sign-up), brand fix, AdSense data swap with 301s.

## Audit findings (6 Nov, Pinky 2)

1. Footer lists 100 categories from src/data/taxonomy.ts; about 58 of them return 404 (no ideas yet), e.g. https://bbusiness.online/category/photography-business-ideas . These broken links are on every page.
2. https://bbusiness.online/startup-guides links to /glossary, which is 404 (the page is /founder-glossary).
3. 60 live, indexable pages are in no sitemap (25 India answer pages, /topics, /lists, /startup-idea-validation, tool pages). List: outputs file bbusiness-sitemaps-and-indexing.md from 6 Nov.
4. Fonts: topic pages and /lists use Outfit (purchased template); the rest use Geist and Inter.
5. https://bbusiness.online/business-idea-pivot-or-stop is "noindex, nofollow" but every idea page links to it.
6. No horizontal page scroll on any checked page at 360px or 1366px. No dead "#" buttons found.
7. Repeated quick requests get a short blocked page (Cloudflare limit) instead of the real page.

## Next steps

- Wait for the founder's answers to the audit questions; act only on answered ones.
- Sitemap page redesign (glass layout).
- Content protection (AI bots blocked, Googlebot allowed) — pending, planned.
- Remaining old-layout pages to the glass system.
- Topic pages: 25 built of 147; wait for the founder before building more.

## Founder's standing instructions

- Commit straight to main. No side branches, no local-only commits.
- Report with bbusiness.online links only, never repo links.
- No prices, no sign-up, no dollar or pound signs, no BusinessIdea.io brand, no fake numbers or testimonials.
- Idea and calculator pages noindex; hubs, categories, subcategories, topic pages indexed. Never noindex for layout reasons. Don't make indexing decisions without the founder.
- Change only what he asks; never touch content when fixing layout.
- Purge the Cloudflare cache after each deploy (dashboard, Caching, Configuration, Purge Everything).

## Problems and fixes

- Git push from the cloud session is refused (403). Commits go through the GitHub web upload page in Chrome.
- Cloudflare 1102 "Worker exceeded resource limits" on uncached pages under bursts: paid Workers plan is the fix.
- Edge cache holds pages up to 1 hour after a deploy: purge the cache.

## How to undo a change

- Undo one commit: on GitHub, open the commit and revert it, or re-upload the previous version of the file to main.
- Fast rollback: Cloudflare dashboard, Workers and Pages, pinkycherry-newbusinessideas3, Deployments, pick an older deployment, Rollback.
- Full backup of the site before the new layout: branch backup-live-before-new-layout.
- Undo the /sitemap noindex: in src/routes/sitemap.tsx remove the robots meta line, and add "/sitemap" back to STATIC_PAGES in src/routes/sitemap-pages[.]xml.ts.
