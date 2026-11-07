# HANDOFF — bbusiness.online (shared between Pinky 1 and Pinky 2)

Read this first. Update and commit it to main before you stop. Times are IST.

## Current state (7 Nov 2026, Pinky 2)

- Live commit: 927eb2a on main (check https://bbusiness.online/version.json).
- Data: 4,200 ideas, 42 live categories, 420 subcategories. Under Google AdSense review.
- Glass layout on every page: the glass skin in src/components/home/glass.css (section "Site-wide glass skin") restyles older buttons, cards, link rows and tab bars; purchased pages get the same CSS (src/bought/serve.ts, topic-page.ts).
- Indexing rule (founder): individual idea pages and individual calculator pages are noindex. Everything else in the submitted sitemaps stays indexed. Never noindex a page because of its layout.
- Sitemaps (submitted by the founder, all Success except india): https://bbusiness.online/sitemap-index.xml with pages (101), categories (504), blog (23). sitemap-india.xml is out of the index while empty.
- Cloudflare: free Workers plan, rate limit is being hit. Founder moves to the paid plan in 3 to 4 days. Keep live checks to a minimum.

## Done (newest first)

- 7 Nov — Content protection: src/lib/ai-bots.ts lists AI crawlers and site downloaders; robots.txt disallows them (plus Google-Extended and Applebot-Extended); src/server.ts answers them with 403 (robots.txt stays readable). Googlebot, AdsBot, Mediapartners-Google (AdSense) and Bingbot allowed. tdm-reservation meta; printing turned off and images not draggable (glass.css); copies over 200 characters carry the source link (use-glass-motion.ts). Limit: screenshots and a person copying by hand cannot be stopped on any website.
- 7 Nov — Seller brand gone: /open-source and /tools/alternate (purchased snapshots with the seller name, seller tool ads, 181 and 62 dead links) 301 to /tools; removed from sitemap-pages.xml (99 URLs); internal links updated. Check all sitemap pages: no seller brand left.

- 7 Nov — Quick Comparison table on category/subcategory pages: labels overlapped the first column on phones (min-width is ignored on table cells). Fixed widths inside the cells, solid sticky label column (src/routes/lists.$slug.tsx Comparison).

- 7 Nov — Icons batches 16-20 added (freelance, handmade, home-based, home kitchen food, home textile): 200 icons in public/icons/sub, 198 shown. PENDING redo in ChatGPT (files kept, hidden in src/config/subcategory-icons.ts): batch 9 cell 2 daily-current-affairs-batch (text inside), batch 9 cell 8 state-service-exam-coaching (State Emblem of India, restricted use).

- 7 Nov — Subcategory icons: 150 fire-red glass icons (batches 1-15 from the founder's ChatGPT sheets in BRAND-NEW-COPY src/Icons) cut out with transparent background into public/icons/sub/<subcategory-slug>.webp; list in src/config/subcategory-icons.ts. Shown above the title on each subcategory page and beside each focused list on category pages. Check: https://bbusiness.online/category/beauty-business-ideas/bridal-makeup-artist-business-ideas https://bbusiness.online/category/beauty-business-ideas

- 7 Nov — Home speed: 3D map no longer redraws on every scroll frame (scroll tilt removed), no shadow map, no environment map, lighter materials, starts in idle time; flat SVG map shows if WebGL fails or is lost. Looping animations pause off screen (use-glass-motion.ts, .is-off); sections below the screen use content-visibility:auto (glass.css). Local test: long frames while scrolling past the map went from ~850 ms each to none. Check: https://bbusiness.online/#india-map

- 7 Nov — /case-studies (purchased snapshot: seller brand, sign-up offer, dollar figures, dead ./pages links) replaced by our own page https://bbusiness.online/researched-case-studies (glass layout). Same 12 pivot cases (problem, pivot, what would have failed, solution), 5-step loop, 6 patterns, 6 famous failures, FAQ; seller quotes, seller metrics and seller brand left out (they would read as fake testimonials under our brand). Every link goes to our pages. /case-studies 301 to the new page; sitemap-pages.xml updated; internal links updated.

- 7 Nov — Copy button removed from the AI picker on every page (src/components/founder-workspace/provider-prompt-actions.tsx; long prompts are shortened to fit the link). Footer: full category names ("Online Business Ideas", not "Online"), glass style, 3 columns on desktop; purchased pages got the same footer (src/bought/menu-panels.json footer regenerated from Footer, it still listed 100 categories with dead links). Check: https://bbusiness.online/about (footer) https://bbusiness.online/how-to-validate-a-business-idea-in-india

- 7 Nov — Founder's parts 2 and 3: thin 3D buttons (2.5rem high), tilt and image hover zoom removed everywhere, spacing fix so text lines never touch (heading line-height, gaps between stacked text), glass skin site-wide including the purchased pages (/lists, the 25 topic pages, /case-studies, /failed-startups/india). Content untouched, no indexing change. Check: https://bbusiness.online/category/beauty-business-ideas https://bbusiness.online/how-to-validate-a-business-idea-in-india https://bbusiness.online/calculator/startup-cost
  - Undo: delete the "Site-wide glass skin" section at the end of glass.css and the bbi-glass style lines in serve.ts and topic-page.ts.

- 7 Nov — sitemap-india.xml (empty) taken out of the sitemap index; Search Console showed "1 error" for it. Commit 927eb2a, cache purged. Index now lists pages, categories, blog. Founder removes the india sitemap entry in Search Console. Add it back when India sets publish. Check: https://bbusiness.online/sitemap-index.xml

- 7 Nov ~00:15 — Founder's answers to the audit, commit 4a37bc6, cache purged, checked live:
  - Q1 C: /sitemap redesigned in the glass layout and indexable again, back in sitemap-pages.xml. https://bbusiness.online/sitemap
  - Q2 A: footer shows only the 42 live categories (src/config/live-categories.ts). Add a slug there when a new category goes live.
  - Q3 A: sitemap-pages.xml now has 101 URLs (was 41): the 25 India answer pages, /topics, /lists, validation, tool and guide hub pages. https://bbusiness.online/sitemap-pages.xml
  - Q4 A: /glossary 301 to /founder-glossary, guides page link fixed; /business-idea-pivot-or-stop is indexable. https://bbusiness.online/glossary
  - Q5: bought-template fonts site-wide, Outfit for headings and Inter for text, self-hosted (src/styles.css @font-face). Founder will review brand fonts later.
  - Also fixed: scroll reveal kept very long pages blank on phones (threshold 0 in use-glass-motion.ts).

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

- Founder resubmits https://bbusiness.online/sitemap-index.xml in Search Console (pages sitemap grew to 101).
- Content protection (AI bots blocked, Googlebot allowed) — pending, planned.
- Remaining old-layout pages to the glass system.
- Topic pages: 25 built of 147; wait for the founder before building more.

## Founder's standing instructions

- Commit straight to main. No side branches, no local-only commits.
- Report with bbusiness.online links only, never repo links.
- No prices, no sign-up, no dollar or pound signs, no BusinessIdea.io brand, no fake numbers or testimonials.
- Idea and calculator pages noindex; hubs, categories, subcategories, topic pages indexed. Never noindex for layout reasons. Don't make indexing decisions without the founder.
- Change only what he asks; never touch content when fixing layout.
- Never show the template seller's brand (IdeaProof or any other) on any page. Locked rule (founder, 7 Nov).
- Screenshots only when strictly needed; open Cloudflare only when needed (cache purge). Locked rule (founder, 7 Nov).
- Footer categories always show the full name ending in "Business Ideas". If Footer in frame.tsx changes, regenerate the footer in src/bought/menu-panels.json.
- Purge the Cloudflare cache after each deploy (dashboard, Caching, Configuration, Purge Everything).

## Problems and fixes

- Git push from the cloud session is refused (403). Commits go through the GitHub web upload page in Chrome.
- Cloudflare 1102 "Worker exceeded resource limits" on uncached pages under bursts: paid Workers plan is the fix.
- Edge cache holds pages up to 1 hour after a deploy: purge the cache.

## How to undo a change

- Undo one commit: on GitHub, open the commit and revert it, or re-upload the previous version of the file to main.
- Fast rollback: Cloudflare dashboard, Workers and Pages, pinkycherry-newbusinessideas3, Deployments, pick an older deployment, Rollback.
- Full backup of the site before the new layout: branch backup-live-before-new-layout.
- Fonts: revert the two --font-display / --font-sans lines in src/styles.css @theme and the FONT_PRELOADS list in src/routes/__root.tsx.
- Footer: remove the LIVE_CATEGORY_SLUGS filter in src/components/v2/frame.tsx.
