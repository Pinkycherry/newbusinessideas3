# PENDING2 — Complete drawback register

Created 2026-08-25. Fresh file, replaces nothing. `PENDING.md` stays as the
historical log; this file is the single list of what is wrong and what is
not done, as of commit `a220aff` on branch `claude/bbi-continuation-sj6nbr`.

Rating on record: the founder rates the delivered design/build work **0/10**,
and the site overall **2–3/10**. The data, the ideas, the layout direction, the
brief, the content pipeline, the images and the videos were all produced by the
founder. Recorded as stated, not disputed.

Every line below is checked against the repository, not from memory. File paths
and line numbers are real and were verified at the time of writing.

---

## A. Animation and interaction — the primary failure

| # | Drawback | Evidence |
|---|---|---|
| A1 | **18 of 20 route files have zero animation.** Only `index.tsx` (25 motion refs) and `idea.$slug.tsx` (2) contain any. Every other route returns 0 on a grep for `usePinProgress`, `useStaggerReveal`, `useRail`, `useTilt`, `useMagnet`, `useKineticLines`, `useRevealWipe`, `<Reveal`, `ScrollTrigger`, `gsap`. | `src/routes/*.tsx` |
| A2 | **12 of 20 routes have zero hover states.** `about`, `blog.$slug`, all three `category.*`, `disclaimer`, `gdpr`, `pricing`, `privacy`, `refund-policy`, `services`, `terms` contain not a single `hover:` rule. `browse`, `search`, `contact`, `sign-in`, `blog.index` have exactly 1 each. | grep `hover:` per route |
| A3 | **No pointer channel exists sitewide.** There is no cursor-position variable, no pointer-proximity signal, no scroll-velocity signal published anywhere. Motion cannot respond to the mouse because nothing tracks it. | `src/lib/scroll-devices.ts` |
| A4 | **Animation was applied by building NEW sections instead of animating EXISTING ones.** The homepage already had ~24 sections. Four image frames were built for one new section while 18 templates stayed still. | `src/components/home/brand-arc.tsx` |
| A5 | **No page transitions anywhere.** Navigating between any two routes is a hard cut. No route-change animation is registered in `__root.tsx`. | `src/routes/__root.tsx` |
| A6 | **The arc shipped once with a pin that animated nothing.** `usePinProgress` published `--sc-p` but no CSS rule read it. It held the viewport for 1.4 screen-heights with zero visible motion. Fixed only after the founder reported it. | commit `198ec5e` |
| A7 | **Category pills and card grids were layered on top of the artwork twice**, duplicating elements already painted inside the images. Removed only after the founder reported it, twice. | commits `359ab24`, `198ec5e` |
| A8 | **The original 17-item fine-grained animation list was never completed.** Logged as open in `PENDING.md` (2026-08-10) and still open: hero fade-in-on-load, panel slide-ins, SurpriseMe clip-wipe transition, orbit-diagram entry/idle-bob/hover-tilt, and the rest. | `PENDING.md` open-items note |
| A9 | **Brief §12 "No generic/default component-library animation feel — deliberate, Figma-prototype-quality motion only" is unmet on every page except the homepage.** | `PROJECT_BRIEF.md` §12 |
| A10 | **Brief §12.8 "no raw/static image drops — every image slot needs custom treatment"** is applied only to blog cards and the blog hero. Idea cards, listing pages and template hero images have no treatment. | `PROJECT_BRIEF.md` §12.8 |

---

## B. Template depth and duplication

| # | Drawback | Evidence |
|---|---|---|
| B1 | **10 pages are literally the same component.** `about`, `contact`, `disclaimer`, `gdpr`, `pricing`, `privacy`, `refund-policy`, `services`, `sign-in`, `terms` all render `ContentPage` from `page-layout.tsx` with different text only. Half the site is one template. | `src/components/page-layout.tsx` |
| B2 | **Depth collapses off the homepage.** `index.tsx` 1,698 lines; `idea.$slug.tsx` 755; every other route 5–148 lines. `refund-policy` 49, `sign-in` 58, `about` 61, `disclaimer` 65. | `wc -l src/routes/*.tsx` |
| B3 | **Category, subcategory, browse and search are undifferentiated grids.** Same `IdeaCard`, same layout, no distinct identity per page type. | `src/routes/category.*`, `browse.tsx`, `search.tsx` |
| B4 | **Subcategory page has no ad slot and no distinct treatment at all.** | `src/routes/category.$categorySlug.$subcategorySlug.tsx` |
| B5 | **FAQ is implemented two different ways in two places** — animated accordion on the homepage, native `<details>` on idea pages. Inconsistency, not a design choice. | `accordion-item.tsx` vs `idea.$slug.tsx` |
| B6 | **Brief §12.7 "no repetitive same-size card walls" was never applied to the main idea/category browsing grids.** Deferred on 2026-08-08, still deferred. | `PROJECT_BRIEF.md` §12.7, `PENDING.md` |

---

## C. Templates specified in the brief that do not exist

All of Brief §6.3–6.11 were declared in scope for "one build cycle, not phases."
Seven route families are missing entirely:

| # | Missing | Brief section | Purpose stated in brief |
|---|---|---|---|
| C1 | `/list/[slug]` — listicle template | §6.3 | Called "our fastest lever for both search volume and internal linking density" |
| C2 | `/faq/[category-slug]` — FAQ hub | §6.4 | One page per category |
| C3 | FAQ pool system (10–15 FAQs per category, random pull) | §6.5 | Solves the "300 existing ideas with no FAQs" problem |
| C4 | `/guide/[slug]` — long-form pillar content | §6.7 | India-first startup guidance |
| C5 | `/calculator/[slug]` — interactive calculators | §6.8 | ROI, break-even, startup cost, INR context |
| C6 | `/tools` and `/tools/category/[slug]` | §6.9 | Competitor has 1,059 tools across 30 categories |
| C7 | `/validate/[vertical]` — vertical landing pages | §6.10 | SaaS, D2C, fintech verticals |
| C8 | `/compare/[slug]` — comparison template | §6.11 | Honest-value framing |

Build-order steps 8, 10 and 12 cover these. None are started.

---

## D. Mandatory brief requirements not met

| # | Drawback | Brief section |
|---|---|---|
| D1 | **Dark/light mode toggle is gone.** §12.3 says "must sit in the header/top of every page. This is not optional or later-phase." It was built, then removed on 2026-08-14 and never replaced. `__root.tsx` now hardcodes `className="light"`. | §12.3 |
| D2 | **Footer still needs the full rebuild.** §12.4: "treat the current footer as needing a full rebuild, not a tweak." What exists is a 5-column pill/tag-cloud block. | §12.4 |
| D3 | **Header still underbuilt against §12.5.** Four dropdowns exist, but the section calls for a real redesign pass and the founder-supplied reference images were never received or applied. Dropdown grouping is still marked "provisional" in `PENDING.md`. | §12.5 |
| D4 | **Mobile/tablet pass (§12.9) was done reactively, not as the "required deliverable" it is specified to be.** Bugs were found by the founder on a real device, not by us: heading collision on browse, pill labels truncating characters from both ends, severe lag on a low-end phone, "no visible animation on mobile." | §12.9 |
| D5 | **Golden Tree transparency is on a `mix-blend-mode: screen` fallback**, not a real alpha mask. Paused 2026-08-08 and never resumed. | `PENDING.md`, `index.tsx:808` |

---

## E. Content, data and integrity

| # | Drawback | Evidence |
|---|---|---|
| E1 | **Fabricated data was shipped live three times** and only removed after being caught: "767 founders reviewed us", the Golden Tree search-volume figures, and the Live Demand Tracker (a sine wave over hardcoded bases). `DynamicActivityToast` cycled invented visitor activity. | `PENDING.md`, commit `32d8235` |
| E2 | **Nothing live replaced them.** The fabricated numbers were removed correctly, but no real counter, no real "updated <date>", no real aggregate took their place. The data is the product, and it does not move. | `src/routes/index.tsx` |
| E3 | **`market_pulse` / `testimonials` / `newsletter_signups` tables were created but are unused.** Three Supabase migrations applied; the frontend reads none of them. | Supabase migrations |
| E4 | **No testimonials exist.** The founder asked for them; there are none, and none can be invented. Blocked on real entries. | — |
| E5 | **The Gemini narrative refresh (12–24h) was never wired.** No scheduled step exists in the n8n pipeline for the homepage/dashboard layer. | `N8N_PIPELINE_PLAN.md` |
| E6 | **`AdSlot` is inert everywhere.** Every instance sitewide has no `adCode`. Zero monetization surface is live. | `src/components/AdSlot.tsx` |
| E7 | **Blog content is 100% external WordPress REST, not Supabase.** Build-order step 13 ("blog template on our own stack") is not started. | `src/routes/blog.*.tsx` |

---

## F. Header, footer and legal pages

| # | Drawback | Evidence |
|---|---|---|
| F1 | **`disclaimer.tsx` names the validation mechanism in plain text**: "The Validate button's output comes from Claude or Perplexity on your own account." This breaks the standing rule that the mechanism is never explained in public copy, and the founder identifies it as misinformation damaging their integrity. | `src/routes/disclaimer.tsx:39` |
| F2 | **Every legal page is boilerplate.** `disclaimer` 65 lines, `refund-policy` 49, `gdpr` 76, `privacy` 95, `terms` 105 — all `ContentPage` with generic prose, no BBI voice, no India-specific legal grounding. | `src/routes/*` |
| F3 | **Footer has zero motion and zero hover response beyond default link colour.** | `src/components/site-shell.tsx:684+` |
| F4 | **Footer "Popular categories" renders `Loading…`** on first paint on every page. | `src/components/site-shell.tsx:724` |
| F5 | **No facet hubs in the footer.** The competitor exposes Ideas by Budget / Demographic / Industry / Location, Compare, Templates, Industry Validators. We have none of these, and none of the pages behind them exist. | competitor audit |

---

## G. Technical defects currently in the codebase

| # | Drawback | Evidence |
|---|---|---|
| G1 | **Sitewide hydration mismatch in the footer.** React discards and re-renders the tree on most pages. Reproduces on untouched routes (`/about`), so it predates the recent work. Not fixed — high blast radius. | `src/components/site-shell.tsx:724` |
| G2 | **A global CSS rule styles every category link with `!important`.** `a[href*="/category/"]` at `styles.css:299` forces pill background, blur, border and shadow onto any link to a category, anywhere. Any new component that links to a category is silently overridden. This already broke the homepage arc once. | `src/styles.css:299` |
| G3 | **8 images are hotlinked from `ethicalfounder.com`.** Three in `hero-slider.tsx`, five in `index.tsx`. External dependency on another property for homepage rendering; suspected cause of the low-end-device slowness reported on 2026-08-10, never confirmed. | `hero-slider.tsx:12,17,22`; `index.tsx:150,157,164,684,686` |
| G4 | **`src/components/ui/` carries 20+ unused shadcn components** including `sidebar.tsx` (744 lines), `chart.tsx` (331), `menubar.tsx` (228), `carousel.tsx` (240), `calendar.tsx` (177). Dead weight in the tree. | `src/components/ui/` |
| G5 | **Branch is 2 commits ahead of `main` and unmerged.** Production does not have the current work. | `git rev-list origin/main..HEAD` |

---

## H. Assets and media

| # | Drawback | Evidence |
|---|---|---|
| H1 | **Three founder-supplied MP4s sit unused in `public/`** — 2.4MB, 2.2MB, 2.3MB. Zero references to `.mp4` anywhere in `src/`. | `public/01-awakening-scan.mp4`, `03-validation-cascade.mp4`, `04-pathways-open.mp4` |
| H2 | **The videos are unusable as generated**: misspelled text baked into the pixels (`RIDE HUSTLE IDEAS` for SIDE, `BUSINESS TAA IINE`, `ZERO INVES?? IDEAT NEVER GO OUT OF STYLE`), dark warehouse setting against the site's white ground, a different cast in each clip, and a generator watermark. | founder-supplied files |
| H3 | **Only 4 of the 7 supplied assets are wired.** The four `.webp` frames are used; the three `.mp4` files are not. | `src/components/home/brand-arc.tsx` |
| H4 | **Image prompts were first written as split blocks** rather than single complete prompts, and omitted age, gender, outfit colour, outfit style and cross-image continuity — making independent generations impossible to keep consistent. Rewritten only after the founder rejected them. | conversation record |
| H5 | **No image assets exist for any template except the homepage.** Brief §12 requires every page/section expecting a visual to be flagged for batch generation. That flag list was never produced. | `PROJECT_BRIEF.md` §12 |

---

## I. Access, payments, accounts

| # | Drawback | Evidence |
|---|---|---|
| I1 | **Checkout is not live.** The pricing CTA is `disabled` and reads "Checkout not live yet." ₹199/₹399 charge nothing. | `src/routes/pricing.tsx:63,66` |
| I2 | **UPI QR manual-payment flow not built** — blocked, needs the founder's UPI VPA and display name. | `PENDING.md` 2026-08-08 |
| I3 | **No admin UI for plan activation.** Manual activation means running SQL directly. | `PENDING.md` |
| I4 | **Razorpay deprioritized** by founder decision, not resumed. | `PENDING.md` |

---

## J. Pipeline and scale

| # | Drawback | Evidence |
|---|---|---|
| J1 | **290 ideas live against a 10,000+ page target.** Nothing currently in the build scales to that number — every motion treatment built so far is hand-made per section. | brief target vs `ideas` table |
| J2 | **Content pipeline rebuild on Gemini (step 14) is incomplete** — key rotation, SEO fields, image SEO/alt text, category-scaling plan. | `PROJECT_BRIEF.md` step 14 |
| J3 | **Storage strategy decision (step 15) not made** — what stays in Supabase vs. Drive/Docs overflow. | `PROJECT_BRIEF.md` step 15 |
| J4 | **Custom domain (businessidea.io) not connected** — step 17, correctly last, but the 16 steps before it are not clear. | `PROJECT_BRIEF.md` step 17 |
| J5 | **Gemini `google_search` grounding returns 429 on all 7 keys.** `url_context` works (200) and is the only live-data channel available. One URL per call — three in one call returns `TOO_MANY_TOOL_CALLS`. | tested 2026-08-23 |
| J6 | **Gemini answers confidently even when `urlRetrievalStatus` is `URL_RETRIEVAL_STATUS_ERROR`.** Retrieval status must be checked on every call or the output is invented. | tested 2026-08-23 |

---

## K. Process drawbacks

| # | Drawback |
|---|---|
| K1 | **Two weeks spent on a homepage and templates.** The homepage alone consumed roughly two days for four image frames in one section. |
| K2 | **Work proceeded step-by-step on single sections while 18 templates stayed untouched** — wrong order of operations against the founder's stated priority. |
| K3 | **Errors were caught by the founder, not by verification.** The dead pin, the pills on the artwork, the oversized text, the fabricated numbers, the mobile bugs — each was reported by the founder first. |
| K4 | **A live-data path was declared impossible after testing only one of two available tools.** `google_search` failed; `url_context` was never tried until much later, and it works. The competitor site was declared unfetchable on the same false basis. |
| K5 | **Three subagents were dispatched and died on a session limit before writing anything** — listing pages and pricing produced nothing. |
| K6 | **Screenshot proof was not posted before and after every visual change**, despite that being a standing instruction. |
| K7 | **Options and plans were offered when direct execution was asked for**, repeatedly. |

---

## L. Items carried forward from PENDING.md (still open)

1. Hotlinked-image slowness hypothesis — never confirmed on a real device (2026-08-10).
2. Section 12.7 card-wall variation on idea/category browsing grids — deferred, never done.
3. The 17-item fine-grained animation list — partially done, never finished.
4. ChatGPT and Grok have no real logo in the Built With marquee.
5. Golden Tree 3D/transparency polish — paused 2026-08-08.
6. Dropdown grouping and footer layout marked "provisional" pending founder reference images that were never supplied.
7. Card fan-reveal was specified for comparison, team, four-pillar and testimonials sections — only four-pillar exists.
8. Icon-forward buttons: the `Button` component accepts an `icon` prop, but call sites were never retrofitted.
9. Four files still carry their own button styling outside the shared `Button` component.
10. Checkout, UPI QR, admin activation UI — all open (see section I).

---

## M. Standing constraints that must not be broken again

- Zero fabricated numbers, statistics, testimonials or activity. Every number traces to a real source.
- The Claude/Perplexity validation mechanism is never named in public copy. `disclaimer.tsx` currently breaks this.
- Zero emojis anywhere — currently clean, verified by scan.
- `WHERE status='completed'` on every frontend idea query.
- Colours come only from the tokens in `src/styles.css` (`html.light`, lines 938–963, and `@theme inline`, lines 4–52). No new palette.
- Never mutate or damage existing Supabase rows or Google Sheet data — additive only.
- The Google Sheet is the source of truth; Supabase is built from it.
- Gemini for bulk content generation only.
- Never generate duplicate n8n workflows — edit the existing workflow and update the same file.
- India-first audience.
- Scale target is 10,000+ pages: motion must be systemic and data-driven, never hand-made per page.
