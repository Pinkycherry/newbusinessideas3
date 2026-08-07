# BusinessIdea.io — Master Project Brief for Claude Code

> **Read this file first, every session.** This is the single source of truth for this project. Do not ask me to re-explain context that is already written here — read this file, then ask only about what genuinely isn't covered.

**Owner / Developer:** Cherrry (solo founder, minimal coding background, learning by building this with Claude Code)
**Domain:** businessidea.io *(confirm exact spelling and DNS before going live — double-check there is no extra letter anywhere in the registered domain)*
**Stack:** Next.js, deployed on Vercel, GitHub-connected, Supabase backend
**Timeline:** Full build target — one month from today
**Market:** India only, for now. All content, tone, pricing, and SEO targeting is India-first. Global expansion is a later-phase decision, not part of this build.

---

## 1. How Claude Code should work with me on this project

- I am a solo, non-technical founder. Explain changes in plain terms when needed, but don't slow down — just build, and tell me what you did.
- When I ask "where is X" (a word, an image, a section, a file), always answer with the exact file path and, if relevant, what to search for inside it (e.g. "open `app/idea/[slug]/page.tsx`, press Ctrl+F, search for `heroImage`"). Never make me hunt.
- I do not want emojis anywhere in the codebase, UI copy, or generated content. None. Not in buttons, not in AI-generated idea text, not in FAQs, nowhere.
- I do not want generic chatbot-style UI patterns (no ChatGPT-style message bubbles, no cheap/generic animation libraries used without intention). Animations should feel deliberate and premium — closer to Figma-prototype quality than default component-library defaults.
- All visual assets (icons, illustrations, SVGs) should be custom, not stock or emoji-style. I will generate these myself using AI image generation and drop them into a shared Drive folder, then hand you the links to wire in. Flag clearly, page by page, where an image/icon slot is expected so I know what to generate.
- We do not copy content, layout text, or structure verbatim from any reference site named in this document. Reference sites below are studied for **information architecture and technical patterns only** — URL structure, template types, schema usage. All copy, design, and voice on businessidea.io is original.
- Work in small, reviewable chunks. Don't attempt the entire roadmap in one pass — confirm one piece is working before moving to the next.

---

## 2. What this product is

BusinessIdea.io is a searchable library of business ideas for the Indian market. Each idea has its own page with a detailed blueprint. The core differentiator (see Section 3) is that idea *validation* is free — we don't charge for AI analysis, we charge a small platform fee for access, curation, and the data layer. The user runs their own validation using their own Claude or Perplexity account, for free, through a one-click handoff from our site.

## 3. Unique selling point (do not dilute this in any copy or messaging)

Every competing "validate your business idea" tool charges $20–$70/month and markets itself as if it has some proprietary validation engine. In reality, they are calling the same public AI APIs (Claude, GPT-4, Gemini) that anyone can access directly. The user paying $20/month usually has no idea their "validation" is just an API call wrapped in a UI.

Our position: **we are transparent about this.** We don't charge for validation — validation is free, because the user runs it themselves on their own AI account. We charge a small platform fee (₹ pricing, India-first) for:
- The curated idea database itself (structured blueprints, not raw AI output)
- Platform access, search, and organization
- The one-click handoff that saves the user from writing their own research prompts

This should come through in copy: honest, India-first, "why pay $20 to validate one idea when you can pay us a small platform fee and validate as many as you want using your own AI subscription."

---

## 4. Reference sites — technical/architecture study only

### 4.1 Our own current build
**Live at:** newbusinessideas3.vercel.app *(pre-launch working domain, will move to businessidea.io)*

Current confirmed structure:
- `/` — home
- `/browse` — master idea listing
- `/category/[slug]` — category template (currently minor/simple)
- `/idea/[slug]` — single idea template (this is the main product surface)
- `/search?q=` — dynamic search (must be set to `noindex,follow`)
- `/blog`, `/pricing`, `/about`, `/contact`, `/terms`, `/privacy`, `/disclaimer`, `/gdpr`, `/refund-policy`, `/sign-in` — static pages

Data source: Supabase, dumped in via an n8n automation pipeline that's already running and has generated 300+ ideas, scaling toward 1,000+ within days and 3,000+ within the month.

### 4.2 Competitor reference #1 — newbusinessideas-style small competitor
Studied for basic pattern recognition early in this project (word "lists" used as their blog/post category slug, ~310 indexed URLs at the time of research, roughly 15–20 repeating page templates). Useful for confirming that a small set of repeating templates, run at scale, is the right approach — not for content or design.

### 4.3 Competitor reference #2 — ideaproof.io (primary structural reference)
This is the most structurally mature competitor and the main one to study for **information architecture only**. Do not copy any wording, layout, or visual design from it.

**Sitemap to check directly:** https://ideaproof.io/sitemap
**Also published:** ideaproof.io makes available a `llms.txt` file (a machine-readable AI-citation manifest) — this is itself a technique worth adopting later (see Section 11).

Their confirmed URL templates and what each is for:

| Pattern | Purpose | Our equivalent |
|---|---|---|
| `/lists/[slug]` | Roundup listicle post (e.g. "50 AI Startup Ideas") — top 10 detailed, rest as cards | New template to build — see Section 6.3 |
| `/questions/[slug]` | Single-question FAQ page, atomic | New template — see Section 6.4 |
| `/guides/[slug]` | Long-form pillar guide | Later-phase, not in first month |
| `/calculators/[slug]` | Interactive tool (ROI, CAC, LTV, valuation, etc.) | Later-phase |
| `/tools/[slug]` and `/tools/category/[slug]` | Curated free-tools directory | Later-phase |
| `/validate-idea/[vertical]` | Industry landing page (SaaS, fintech, healthtech, etc.) | Later-phase, adapt to Indian verticals |
| `/failed-startups`, `/failure/[slug]` | Failure case-study database | Not part of our core concept, skip |
| `/compare`, `/[competitor]-vs-ideaproof` | Comparison pages | Later-phase, low priority |
| `/about`, `/pricing`, `/terms`, `/privacy` | Standard static pages | We already have equivalents |

**Key architectural takeaways to apply (patterns, not content):**
1. A small number of repeating templates (9–10 in their case) scaled to thousands of URLs — validates our template-first approach.
2. Every template type has its own schema.org type (see Section 7) and its own sitemap file, not one flat sitemap.
3. Comparison, question, and list content types exist specifically to catch long-tail search volume that a single "idea" page type can't catch alone.
4. They publish a `llms.txt` — a plain-text file listing their key pages, facts, and citation preferences aimed at being cited correctly by AI assistants and chatbots. Legitimate technique, not something to fabricate false stats in (see Section 11 for the honest version of this for us).

---

## 5. How Google (and any AI crawler) actually tells posts, pages, and categories apart

This was a point of real confusion earlier — writing it here permanently so it's never re-explained.

**The word used in a URL slug has no bearing on classification.** Whether a folder is called `/idea/`, `/list/`, `/entry/`, or anything else is irrelevant to search engines. What actually determines page type:

1. **Schema.org JSON-LD markup** in the page `<head>` — this is the primary, authoritative signal. Idea pages should declare `Article`, category/browse pages should declare `CollectionPage`, static pages should declare `WebPage`.
2. **Sitemap segmentation** — split into `sitemap-ideas.xml`, `sitemap-categories.xml`, `sitemap-pages.xml`, referenced from a `sitemap-index.xml`. Do this before the idea count gets into the thousands.
3. **Breadcrumb schema** (`BreadcrumbList`) — proves hierarchy (Home > Category > Idea).
4. **Internal linking pattern and content shape** — category pages link out to many things and repeat short card layouts; idea pages have one long unique body and are linked into from many places.

**Action:** implement all four of the above. None of them require renaming any existing route.

---

## 6. Templates — full specification

We need **five templates total**. Do not build more than this in the first month.

### 6.1 Idea template (`/idea/[slug]`) — the flagship template, gets the most effort

Top-to-bottom structure:
1. Hero — idea title, category tag, one supporting visual (image slot: flag for me to generate)
2. Main blueprint body — the existing generated content (named buyer, money mechanics, risks, verdict, etc.)
3. Data visualization block — a simple demand/trend indicator, doesn't need to be complex, just needs to look alive (bar, gauge, or similar)
4. **Validate This Idea** button — see Section 8 for exact behavior, this is non-negotiable and confirmed working
5. FAQ section — 5 questions above additional content, 5 below (see Section 6.5 for how these are generated/pulled)
6. Related ideas — 3 cards, same category, pulled randomly with a limit, never hardcoded (see Section 9)
7. Related categories — random subset (e.g. 5), never a full static list of all categories
8. Trending/most-searched carousel — random pull from top ideas, not fixed
9. Closing call-to-action block — validate button repeated, plus any other conversion actions

**Layout variation (to avoid the "AI factory" look):** build 3–4 visual layout variants of this template (hero-left vs hero-banner vs stat-forward, etc., plus 3–4 accent color themes). Each idea's slug/ID runs through a deterministic hash function to pick a variant — same idea always renders the same variant, but the library as a whole looks varied and handcrafted rather than stamped out. This logic lives in code, not in the database — no "layout" column needed.

### 6.2 Category template (`/category/[slug]`) — kept minor, as is

Top 10 ideas shown in detail-ish cards, remainder as simple clickable cards/buttons. One category count (dozens, not thousands) means this template does not need the same variation trick as the idea template.

### 6.3 Listicle template (`/list/[slug]` or similar — pick a slug word freely, it has zero SEO effect per Section 5)

New template. "50 Zero Investment Business Ideas for India" style. Top 10 get 200–300 words each written directly on the page; remaining ideas display as clickable cards linking to their full `/idea/[slug]` page. This is our fastest lever for both search volume and internal linking density.

### 6.4 FAQ hub template (`/faq/[category-slug]` or similar)

One page per category (e.g. "Low Investment Business Ideas — FAQ", "Side Hustle Ideas — FAQ"). Pulls from the same FAQ pool described in 6.5. This is a standalone page in addition to the embedded FAQ section inside idea pages.

### 6.5 FAQ pool system (solves "we have 300 existing ideas with no FAQs" problem)

Do **not** attempt to write bespoke FAQs for each of the 300+ existing ideas — not necessary and too slow.

Instead: generate roughly 10–15 FAQs per category in bulk (one-time job via the n8n + Claude API pipeline), giving a pool of ~150+ FAQs total across ~12 categories. Every idea page, at render time, pulls a random 5–10 FAQs from its own category's pool (`ORDER BY random() LIMIT n` at the Supabase query level). This:
- Covers all 300 existing ideas instantly with zero manual work
- Covers all future ideas automatically (they inherit their category's pool)
- Satisfies the "page should feel alive on refresh" requirement below, since the visible FAQ set changes each time

Later phase (not month one): idea-specific FAQs generated per-idea through the ongoing n8n pipeline for new content going forward.

### 6.6 Static pages

About, Contact, Terms, Privacy, Disclaimer, GDPR, Refund Policy, Pricing, Sign-in — already exist, no template needed, hand-edit each one's schema individually (10 pages, five-minute job each, see Section 7).

---

## 7. Schema markup and breadcrumbs — implementation notes

**Critical point:** schema logic is written **once per template**, not once per idea. Since every idea renders through the same `idea/[slug]` file, adding a schema-generation function to that one file automatically applies it to all 300+ existing ideas and every future idea Supabase sends in — no new database column needed, no per-idea manual work, no "schema" field required anywhere.

Required schema by template:
- `/idea/[slug]` → `Article` (headline, description, datePublished, category as `about`)
- `/category/[slug]` → `CollectionPage`
- `/list/[slug]` → `Article` or `ItemList` depending on final shape
- `/faq/[slug]` → `FAQPage`
- Static pages → `WebPage`
- All pages with a category → `BreadcrumbList`

Also required before scale:
- Split `sitemap.xml` into `sitemap-ideas.xml`, `sitemap-categories.xml`, `sitemap-pages.xml`, indexed via `sitemap-index.xml`
- Add `noindex,follow` to `/search?q=*` to prevent crawl-budget waste on infinite query variations

Do this work **first**, before new templates, since it retroactively fixes all existing content in one deploy.

---

## 8. Validate button — exact confirmed behavior

This has been tested live and works. Implement exactly as follows, no copy/paste UI element anywhere.

**Flow:**
1. User is on any idea page, clicks **Validate for Free**.
2. User picks a platform (Claude, Perplexity — no ChatGPT, no Grok, deliberately excluded from this product's positioning).
3. Backend builds a URL for the chosen platform with the idea's specific validation prompt attached as a query parameter (e.g. `https://claude.ai/new?q=<encoded prompt>`). This happens invisibly — no prompt text is ever shown or copyable in our UI.
4. New tab opens directly to that platform.
   - If the user is already logged into that platform (in-browser or via their installed app), the prompt appears pre-filled in the input box. It does **not** auto-submit — the user presses enter themselves, which is expected and fine.
   - If the user is not logged in, they go through that platform's own login flow, then click **Validate** again on our site — this re-triggers the flow now that they're authenticated.
5. A short 2–3 line note sits under the Validate button on our site explaining this exact two-step reality, so nobody is confused mid-flow: *"You'll be taken to Claude/Perplexity with your prompt ready — just hit enter. Not signed in yet? Sign in there, then tap Validate again."*

**Known platform-side behavior to be aware of, not a bug:** Claude's input screen may show a small caution notice about links carrying embedded queries, since query-based prompt injection is a known attack pattern the platform watches for generally. This is expected, is not an error, and does not block the flow — it's a standard platform-level notice, not specific to our implementation. Do not attempt to "fix" or suppress this; it's outside our control and not something we need to react to.

**Important ongoing caveat:** the `?q=` prefill mechanism is not a documented, permanently-guaranteed public API — treat it as best-effort. Test it periodically after platform updates. The fallback note under the button (step 5 above) is also the safety net if this behavior ever changes.

**Never build:** a visible copy button, a visible prompt textbox, or anything resembling "copy this and paste it into Claude." The entire point is that it's invisible and automatic up to the point the user has to hit enter themselves.

---

## 9. "Nothing static" / dynamic-feel requirement

Applies everywhere except the core layout/variant of a given idea page (that stays consistent per idea so URLs don't visually flicker):

- Related ideas (3 cards) — random pull from same category, with `LIMIT`, never hardcoded
- Related categories — random subset (e.g. 5 of however many categories exist), never a full static list
- Trending/most-searched carousel — random pull from top ideas
- FAQ section — random 5–10 from the category's FAQ pool (Section 6.5)

This is implemented as `ORDER BY random() LIMIT n` (or Supabase's equivalent) at the query level — not application logic, not a cron job, not pre-computed. Every page load recomputes it. This is also what makes the site scale cleanly past 100+ categories and 1,000+ ideas without needing to redesign any section.

---

## 10. Content pipeline — posts, blog, and future automation

- **Blog lives on our own Next.js/Supabase stack, not WordPress.** Headless WordPress caused hosting issues previously and is not worth revisiting. Blog posts render through their own template following the same schema/breadcrumb pattern as everything else, on the same domain — better for SEO than a split domain/platform anyway.
- **Content generation pipeline:** n8n workflow calling the Claude API (a separate paid product from Claude Pro/Claude Code — budget and purchase this separately) generates idea blueprints, FAQ pool content, and listicle content in bulk, writing into Supabase, which the frontend already reads from live.
- **Storage for the content pipeline itself:** Supabase remains the source of truth for idea data since the frontend already depends on it and is not prohibitively expensive at current + projected scale (aim for 3,000 ideas within the month) — re-evaluate cost only if actual usage numbers say otherwise. If cost becomes a real concern, Google Docs/Sheets can hold *drafts or the raw prompt/output log* before final content is pushed to Supabase, not as the live data source for the site itself, since the site's queries (random pulls, category filters, joins) need a real database, not a document store.
- Any new content template (list, FAQ hub, future guide/calculator types) should be built so the n8n workflow can target it directly — i.e., the workflow writes structured fields that map onto whichever template's expected shape, rather than needing a new pipeline built per template.

---

## 11. Our own llms.txt (later phase, not month one, but worth planning for)

Ideaproof.io publishes an `llms.txt` at their root — a plain-text manifest aimed at helping AI assistants and chatbots cite them accurately (key pages, one-line summaries, FAQ patterns, citation preferences). This is a legitimate and increasingly common practice worth adopting for businessidea.io once the site has real, verifiable numbers to put in it.

**Important distinction to hold onto:** several of the numeric claims in competitor manifests (accuracy percentages, user counts, "verified" savings figures) read as marketing copy dressed as data rather than independently audited facts. When we eventually write our own `llms.txt`, only include numbers we can actually stand behind — real idea count, real category count, actual platform fee, honest description of what the free validation flow does. Do not fabricate accuracy percentages, user testimonials, or "verified" statistics we haven't measured.

---

## 12. Design constraints (non-negotiable)

- Zero emojis anywhere — UI, buttons, AI-generated content, FAQs, everything.
- No generic/default component-library animation feel — deliberate, Figma-prototype-quality motion only.
- No stock icon packs or chat-interface-style visual language (no ChatGPT-bubble aesthetic).
- All icons/illustrations are custom-generated by the founder via AI image generation and supplied as links/files to be wired into the templates — flag every page/section that expects a visual asset so these can be generated in batches.
- Color system: a small deterministic palette (4–5 themes) cycles across idea pages using the same hash-based logic as the layout variants (Section 6.1), not per-idea manual selection.

---

## 13. Build order (month-one roadmap)

1. **Schema + breadcrumbs + sitemap segmentation** on existing `idea` and `category` templates — retroactively fixes all 300+ live ideas in one deploy. Add `noindex` to search.
2. **Validate button** — implement exactly per Section 8, plus the fallback note copy.
3. **FAQ pool system** — bulk-generate category FAQs via n8n/Claude API, wire the random pull into the idea template and build the standalone FAQ hub template.
4. **Listicle template** — highest leverage for both search volume and internal linking.
5. **Layout/color variation system** on the idea template (hash-based, Section 6.1).
6. **Random-pull sections** — related ideas, related categories, trending carousel (Section 9), if not already done alongside step 1.
7. **Blog template** on our own stack.
8. **Auto internal linking** — script that scans generated idea text for matches against other idea titles/categories and wraps 2–3 into working links automatically, no manual placement.
9. Only after 1–8 are stable: point the custom domain (businessidea.io) at the project and go live.

Do not reorder this list without a clear reason — steps 1–2 are foundational and retroactive, everything after compounds on them.
