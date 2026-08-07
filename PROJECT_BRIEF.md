# BusinessIdea.io — Master Project Brief

**Read this file first, before touching any code.** This is the single source of truth for the project. If anything in a chat conversation conflicts with this file, this file wins unless the user explicitly says otherwise in that session.

---

## 1. What this is

BusinessIdea.io (currently live as a staging build at `newbusinessideas3.vercel.app`, branded "IdeaVault / BBI — Best Business Ideas") is a business-idea directory and startup-intelligence library. It is **not** a listicle site and it is **not** an AI-validator SaaS. It is a researched content library — every idea is a "blueprint," not a one-line suggestion — that then hands the user off to their own AI tool (Claude, ChatGPT, Gemini) to run a live validation, instead of running that validation server-side on the company's own API budget.

### 1.1 The core business model (do not build around a different one)

- The site is **free to browse**. Every idea blueprint (named buyer, money mechanics, first-year risks, founder-fit verdict) is readable without login.
- There is a **Validate** action on each idea page. Clicking it does **not** call an AI API on our backend. It redirects the user, in a **new external tab**, to `claude.ai` or `perplexity.ai` with the idea's specific prompt pre-loaded into the input box via a query-string trick (`https://claude.ai/new?q=<url-encoded prompt>` and the Perplexity equivalent). The user runs the validation on **their own** AI subscription. We never touch their AI account, never see their login, never pay per-validation.
- Monetization is **one-time lifetime access** to the full library (no monthly subscription, no expiring trial). This is the explicit differentiator called out on the current site ("$20 a month is the real problem") — don't let any future pricing work drift toward a subscription model without the user explicitly asking for that change.
- Auth is Google OAuth only for now. We store the OAuth confirmation token + email/name, never a password (Google owns the password entirely — there is no password field in our schema for these users).
- One account = one active device/session. Logging in on a second device invalidates the session token on the first device and surfaces a "your account was just accessed from a new device" notice.

### 1.2 What "the world-class feel" means in practice

The single biggest credibility risk on a database-driven content site at this scale (300 ideas now, heading toward 3,000+) is every page looking cloned. Two systems exist specifically to prevent that, and both are described in full in Section 5 — the **deterministic layout/color variation system** (so pages don't share an identical shell) and the **random-pull content system** (so related ideas, FAQs, and trending carousels don't show the exact same fixed list on every page load). Every new template built for this project must use both systems where applicable. Never hardcode a full list of related items anywhere on a database-driven page — always pull a small random slice with a limit.

---

## 2. Tech stack

- **Framework:** Next.js, deployed on Vercel
- **Database:** Supabase (Postgres)
- **Current domain (staging):** `newbusinessideas3.vercel.app`
- **Target production domain:** `businessidea.io` — do not cut over until the templates below are stable and schema/breadcrumbs are live. Google should index the improved structure from day one on the real domain, not the thinner staging version.
- **Content generation pipeline:** N8N workflow calling the Claude API in bulk (this is billed separately from the team's Claude Pro/chat usage — see Section 8)
- **Real-time data visuals:** Gemini API (free tier for now — watch rate limits as idea volume scales from ~300 toward 3,000)

---

## 3. Current site structure (as of this audit)

Audited live at `newbusinessideas3.vercel.app`. Top nav: `Categories` (dropdown), `Browse`, `Blog`, `Pricing`, `Sign In`, `Get Pro Pass`.

**Known URL patterns already in use:**
- Home: `/`
- Idea (post) pages: `/idea/<slug>` — e.g. `/idea/ugc-content-agency-creator-service`
- Category pages: `/category/<slug>` — e.g. `/category/side-hustle-ideas`, `/category/low-investment-business-ideas`, `/category/fintech-finance`, `/category/productivity-workflow`, `/category/tech-saas`, `/category/ecommerce-retail`, `/category/ai-automation`, `/category/health-fitness`, `/category/creator-media`, `/category/education-edtech`, `/category/zero-investment-business-ideas`, `/category/work-from-home-business-ideas`, `/category/passive-income-business-ideas`
- Browse / directory: `/browse`
- Search: `/search?q=<term>`
- Blog: `/blog`
- Static: `/pricing`, `/about`, `/contact`, `/sign-in`, `/services`, `/terms`, `/privacy`, `/disclaimer`, `/gdpr`, `/refund-policy`

**This answers the original core question — the `/idea/` segment is the thing that tells both a human and Google what a URL is.** A path is a **post** (an individual idea blueprint) if it starts with `/idea/`. A path is a **category/taxonomy page** if it starts with `/category/`. Everything else (`/about`, `/pricing`, `/blog`, `/browse`) is a static or hub **page**. This is exactly the mechanism to keep and extend — Google doesn't need to be told anything special beyond a clean, consistent path prefix per content type, correct internal linking, an XML sitemap that groups by type, and (ideally) `Article`/`CollectionPage` schema on the corresponding templates. Section 4 makes this explicit and mandatory for every new template.

**Existing idea blueprint structure (per the sample entries pulled from the homepage):** title, one-line trend tag/agency-name flourish, a 150–250 word narrative blueprint written in flowing prose (not bullet-first) that organically covers: who the named buyer is, what the mechanism/product is, how the money works, how to land the first 10 customers, and a note on the realistic growth ceiling — then 3 short tag keywords at the end. This voice and structure should be treated as the baseline for the Idea template's main content body; do not restructure it, just add the sections in Section 5.1 around it.

**Homepage sections currently live, in order:** hero + search bar, "what you get" / "how it works" 2-up, category grid (13 categories), interactive "Golden Tree" canopy map (SVG hover/tap demand visualization — desktop + mobile variants), weekly search-demand bar section, "who we are" narrative, "every angle covered" (by industry / by who you are / by model tag clouds — these are `/search?q=` links, not real category pages), team credibility stats (11 engineers / 11 states / 767 founders reviewed / lifetime pricing), featured blueprints (3 cards), "why this exists" narrative + 4-pillar breakdown (Named Buyer / Unit Economics / 1st-Year Risks / Founder-Fit Verdict — this 4-pillar framework is the site's core content promise and should be visually repeated on the Idea template itself), "how it works" 3-step (Browse → Take it anywhere → Go lifetime), FAQ accordion, "who we built this for" narrative, comparison table (typical validator vs. BBI + your own AI), evergreen category tag cloud, second FAQ accordion (pricing-focused), closing comparison narrative, footer with sitemap-style link columns.

---

## 4. Competitor structure — IdeaProof.io

Audited via `ideaproof.io/sitemap` (they publish a full sitemap page — worth doing the same at `businessidea.io/sitemap` once volume justifies it). This is the most direct competitor at far greater scale and is the benchmark for where our taxonomy should be able to grow toward, **not** a template to copy wholesale — our USP (free researched blueprint + hand off to the user's own AI, one-time lifetime price) is different from their AI-validator-with-credits model.

**Their scale:** 3,997 total indexed pages across 13 categories, last updated Aug 2026.

**Their category breakdown (page count in parens) — useful as a target taxonomy shape, not a copy list:**
- Core Pages (16) — About, Blog, Changelog, Contact, FAQ, Features, Glossary, Pricing, Research Methodology, Resources, Sitemap, plus a `/feed.xml` and an `/about/entity` page (an E-E-A-T / entity-authority page worth adopting)
- Industry Validators (23) — one vertical landing page per industry, e.g. `/validate-idea/aiml`, `/validate-idea/fintech`, `/validate-idea/b2b-saas`
- Calculators (14) — break-even, CAC, LTV, valuation, market size, ROI, startup cost, startup runway, equity, funding
- AI Tools (19) — standalone generators: logo generator, business name generator, pitch deck templates, lean canvas generator, competitor analysis, ad creatives, UGC scripts, email sequences
- Templates (5) — lean canvas, pitch deck, competitive analysis, customer persona, validation interview script
- Guides (42) — long-form authority content, e.g. `/guides/ai-business-plan`, `/guides/business-model-canvas`
- Questions Hub (131) — one page per specific founder question, e.g. `/questions/angel-vs-vc`, `/questions/calculate-tam-sam-som` — this is essentially a scaled-up, individually-paged version of the FAQ system we're building as a pooled/random-pull layer (see Section 5.2); worth revisiting as a dedicated hub template later per the roadmap
- Lists & Roundups (132) — this maps directly to our planned Listicle template (Section 5.3), e.g. `/lists/agriculture-business-ideas`, `/lists/ai-startup-ideas`
- Comparisons (70) — `/versus/` and root-level "best X 2026" / "X vs Y" pages, including direct competitor-comparison pages (`/dimeadozen-vs-ideaproof`) — worth doing our own eventually once we have 2–3 named competitors worth comparing against publicly
- Topic Hubs (4) — cross-content hub pages that pull from multiple content types under one theme (`/topics/fundraising`, `/topics/saas-metrics`)
- Startup Failures (1,734) — a full failure-case-study database (`/failure/<slug>`), not something we're replicating now, noted for awareness only
- Startup Ideas (1,799 live of 3,200+ total) — their direct equivalent of our `/idea/<slug>` pages, at `/startup-idea/<slug>`
- Legal (3) — Privacy, Terms, Cookies

**Takeaways to apply directly:**
1. Their slug prefix per content type (`/startup-idea/`, `/failure/`, `/guides/`, `/lists/`, `/versus/`, `/questions/`) is exactly the pattern this project is already using correctly with `/idea/` and `/category/` — keep extending new content types the same way (`/listicle/` or reuse `/category/` with a flag — see Section 5.3) rather than inventing a new nesting convention per content type.
2. They publish machine-readable content signals in their page metadata (`meta-content-signals: ai-training=allow, ai-inference=allow, citation=required`) and an `llms.txt` file at the root. Worth adding both once the core templates are stable — cheap to add, plausible SEO/AI-citation upside, zero engineering risk.
3. Their `/about/entity` page is a dedicated legal-entity/E-E-A-T page (they surface their legal entity name, VAT, and registered address in the footer of every page). If BusinessIdea.io wants strong E-E-A-T signals for YMYL-adjacent financial content, add an equivalent entity page once the business is formally registered.
4. Do not chase their raw page count. 3,997 pages took them to a mature stage of the business. Our roadmap in Section 7 targets the five templates that get the current ~300 ideas and ~13 categories production-solid first; their Guides/Questions/Comparisons/Topic-Hub layers are noted in Section 7.3 as month-2-and-beyond additions, not launch blockers.

---

## 5. Templates

Five templates total. Do not overbuild beyond these five at launch.

1. **Idea template** — the core product, most of the effort goes here
2. **Category template** — kept intentionally minor
3. **Listicle template** — "50 Business Ideas" style, our answer to competitors' list pages
4. **FAQ Hub template** — one page per category, e.g. "Low-Investment Business Ideas FAQ"
5. **Static pages** — About, Contact, Terms, etc. — one-offs, no template needed, already exist

### 5.1 Idea template (`/idea/<slug>`)

Top-to-bottom section order:

1. **Hero** — idea title + optional visual
2. **Main content body** — the existing blueprint prose (named buyer, money mechanics, risks, verdict — keep the current voice, see Section 3)
3. **4-pillar breakdown** — Named Buyer / Unit Economics / 1st-Year Risks / Founder-Fit Verdict, visually distinct callout blocks (this framework already exists on the homepage "Research Standard" section — surface it per-idea too, populated from that idea's own content, not a generic restatement)
4. **Data visualization section** — simple trend-score bar or demand chart; doesn't need to be complex, needs to look alive (Gemini API powers the underlying data per Section 2)
5. **FAQ section** — 5 questions above more content, 5 below, pulled dynamically per the FAQ pool system (Section 5.2) — never hand-written per idea at current volume
6. **Related ideas** — 3 cards, random-pulled from the same category (Section 6)
7. **Related categories** — random 5 of however many categories exist, never all of them (Section 6)
8. **Trending / most-searched carousel** — random pull from top ideas, not a fixed list (Section 6)
9. **Validate CTA** — the redirect-with-prompt flow (Section 9), plus any other CTAs scattered through the page as needed

**Layout variation:** every idea page must run through the deterministic hash-based variant system (Section 5.5) so the shell (hero image placement, trend-score position, accent color) differs across ideas without needing per-page manual design.

### 5.2 FAQ pool system

Do not write custom FAQs per idea. At ~13 categories, generate roughly 10–15 FAQs per category through the existing N8N + Claude bulk workflow — a pool of ~130–150 FAQs total, generated once. Every idea page, on load, pulls a random 5–10 FAQs from its own category's pool.

This solves three things at once:
- Covers all ~300 existing ideas instantly with zero manual work
- Covers every future idea automatically, since new ideas just inherit their category's pool
- Satisfies the "feels different on refresh" requirement, since the visible FAQ subset changes each load

Later (not launch-blocking): layer in truly idea-specific FAQs through the N8N pipeline for new entries going forward.

### 5.3 Listicle template

The site's answer to "50 Business Ideas" / "50 Work-From-Home Ideas" style competitor pages (maps to IdeaProof's `Lists & Roundups` category, Section 4). Top 10 ideas get 200–300 words of original framing each; the remaining ~40 render as clickable cards linking to their existing `/idea/<slug>` pages. This is the fastest template to catch search volume and reinforce internal linking — prioritized first in the post-launch roadmap (Section 7.3).

### 5.4 FAQ Hub template

One dedicated page per category — e.g. "Low-Investment Business Ideas FAQ," "Side Hustle FAQ" — pulling from that category's full FAQ pool as a standalone indexable page, distinct from the embedded per-idea FAQ section in 5.1. Deferred to month-2 roadmap (Section 7.3), not a launch blocker.

### 5.5 Deterministic layout/color variation system

This is the fix for pages "screaming AI-generated" through visual repetition. It is **not** a design task — it's a small amount of application logic, built in Claude Code, not Claude Design (see Section 10 for that distinction).

- Build 3–4 layout variants of the Idea template shell (e.g. hero-image-left vs. full-width-banner vs. trend-score-front-and-center vs. trend-score-lower). These are variations, not fully separate designs.
- In code, pick the variant using a small hash function run against the idea's own `id` or `slug` — deterministic and stable, so the same idea always renders the same variant on every load (no flicker), while spreading roughly evenly across variants automatically with zero manual tagging.
- Apply the same deterministic-hash approach to a set of 4–5 accent color themes.
- Category pages do **not** need this system — there are only ~13 (at most ~100 long-term) category pages, so one solid category template is enough; the repetition problem is specific to a database of hundreds-to-thousands of near-identical-shape idea pages, not a small set of categories.

### 5.6 Category template (`/category/<slug>`)

Kept minor per the existing pattern already live: top 10 ideas shown directly in the category, the rest as clickable cards. No variation system needed (Section 5.5). One consistent template is sufficient at current and projected category counts.

---

## 6. Random-pull content rule (applies everywhere, not just the Idea template)

Never hardcode a full list of related items on any database-driven page. Always pull a small random slice with a limit — related ideas, related categories, trending carousel, and which items surface if a category has 50 entries instead of 3. This is a small change at the query level (Supabase `ORDER BY random() LIMIT n` on the existing queries), not new engineering — do not over-architect it.

---

## 7. Schema, breadcrumbs, and internal linking

### 7.1 Schema markup

- Idea pages (`/idea/<slug>`): `Article` schema at minimum; consider `Product`/`Review`-adjacent structured data only if it doesn't misrepresent the blueprint as a literal reviewable product — default to `Article` unless research says otherwise.
- Category pages (`/category/<slug>`): `CollectionPage` schema.
- FAQ sections (embedded on Idea pages per 5.1, and standalone FAQ Hub pages per 5.4): `FAQPage` schema, generated from whichever FAQs are actually rendered on that load.
- Static pages: standard `WebPage`/`Organization` schema; add `Organization`/legal-entity fields once the business is formally registered (see Section 4's `/about/entity` note).

### 7.2 Breadcrumbs

Every content page (`/idea/<slug>`, `/category/<slug>`, listicles, FAQ hubs) gets breadcrumb navigation reflecting the type-prefixed URL structure already in place (Home → Category → Idea, etc.), paired with `BreadcrumbList` schema.

### 7.3 Auto internal linking

Manual inline linking inside generated prose is not viable at this content volume and isn't something the team wants to hand-code. Build a small automated script that runs after content is generated (or as a batch job against existing content): it scans an idea's body text for keyword matches against other idea titles and category names already in the database, and auto-wraps 2–3 of those matches into working internal links. This runs automatically the moment new data lands from Supabase — never touched by hand. Second priority in the post-launch roadmap (Section 8.2), right after the Listicle template.

---

## 8. Team tooling and workflow

### 8.1 Claude Pro vs. the N8N/API pipeline

These are two separate things and two separate bills — do not conflate them:
- **Claude Pro** ($20/mo): covers the team's own chat usage, Claude Code, and Cowork, under a shared usage pool with a rolling 5-hour cap and a separate weekly cap (both reset automatically; check the exact weekly reset day in account settings). Does **not** include API usage.
- **Claude API**: bills separately through the API console. This is what the N8N bulk-content-generation workflow (FAQ pools, idea blueprints at scale) runs on. Keep these budgets and usage entirely separate in planning.

### 8.2 Continuity across sessions

- Don't paste full old chat transcripts into new chats — wasteful and eats context unnecessarily.
- Use a **Project** in Claude to hold reference files, the example/competitor model, page layouts, and standing instructions once; every new chat inside that project has access automatically.
- Use **Claude Code**, connected directly to the GitHub repository, for the actual file-by-file build and edit work — it reads and writes against the live codebase directly, unlike a plain chat which only sees what's pasted or uploaded.
- Point Claude Code at **this file** (`PROJECT_BRIEF.md`, committed at the repo root) at the start of every session instead of re-explaining context — referencing a file costs a fraction of the tokens that retyping paragraphs does.

### 8.3 Expected build shape

Roughly four to five distinct chunks of work map to: schema + breadcrumbs, the FAQ pool + random-pull wiring, the Listicle template, the auto-linking script, and the variation system + validation flow. Working in steady, focused sessions (not continuous), a realistic range is **7–12 days** to get all of it built, tested, and deployed — faster if Supabase queries behave, slower if they need debugging. Session limits on Pro will be hit periodically on heavy code-editing days; that's normal, not a sign of a problem — break work into smaller focused tasks per session rather than trying to touch every template in one sitting. Max plans exist above Pro if Pro proves genuinely too tight in practice, but start with Pro and see how it feels first.

---

## 9. The "Validate" button — exact mechanics

This is the mechanism the entire business model depends on. Build it exactly as follows, no shortcuts, no visible copy button, no "copy to clipboard" UI pattern anywhere in it — the credibility of the product depends on this feeling native, not like a prompt-sharing site.

**Flow:**
1. User is on an idea page and clicks **Validate**, choosing Claude or Perplexity.
2. Backend builds a URL with that idea's specific prompt attached inside the query string — e.g. `https://claude.ai/new?q=<url-encoded prompt>` (Perplexity has an equivalent search-URL pattern — confirm the exact parameter live once building, don't assume it's identical to Claude's).
3. A **new external tab** opens directly to that URL. This is not our page — it's a real navigation to claude.ai or perplexity.ai.
4. **If the user is already logged in** on that platform: the prompt is already sitting in the input box. They hit Enter themselves — Claude fills the input box but does not auto-submit for the user, and that single manual Enter is a deliberate, expected part of the flow, not a bug.
5. **If the user is not logged in**: they land on that platform's own login screen (Gmail, email, GitHub, whatever the platform offers — entirely out of our hands and fully normal). After logging in, the prompt may or may not still be attached depending on the redirect chain, so the user comes back to our site and clicks **Validate** a second time — now authenticated, it lands them in with the prompt ready.
6. A short 2–3 line note beneath the Validate button explains this in plain language: *"You'll land in [Claude/Perplexity] with your idea's validation prompt already loaded — just hit Enter. Not logged in yet? Log in there, then hit Validate again."*

**Important caveat to build in as a permanent assumption, not a one-time note:** the URL-prefill trick is not an officially documented, permanently guaranteed platform feature — treat it as the current best-available integration, not an unchangeable foundation. It was restricted for a period previously over prompt-injection security concerns and could change again without much notice. The fallback note in step 6 is not only for the logged-out case — it's also the safety net if the platform ever changes how the URL behaves. Test both the Claude and Perplexity URL patterns live, don't assume Perplexity mirrors Claude's exact query parameter.

**Do not build:** any form of auto-login, auto-paste-and-send, or backend automation that logs into or drives the user's Claude/Perplexity session on their behalf. This isn't just a UX choice — it isn't technically possible (platforms block it) and would violate those platforms' terms if it were. The clipboard-free, single-manual-Enter version above is the actual buildable version of what's wanted, and it fully avoids ever touching the user's login or data on those platforms.

Before public launch, read Claude's and Perplexity's own terms of service regarding this kind of prompt-handoff pattern — not a legal opinion, just worth five minutes given the business model depends on directing paying users to another platform's free tier at scale.

---

## 10. Auth and sessions

- **Login:** Google OAuth only at launch. We receive and store the OAuth confirmation token, email, and name — never a password. There is no password field in the schema for these users; Google owns that entirely.
- **One device per account:** every login creates a session token tied to that device/browser, stored in a `sessions` table alongside the `users` table in Supabase. A login from a second device invalidates the first device's session token immediately, and the first device shows a "your account was just accessed from a new device — if this wasn't you, contact support" notice. This is a standard, well-established pattern (same approach used by most subscription/streaming platforms) — not unusual or hard to build.
- **Content gating:** show the first several lines of a blueprint, then blur/hide the rest → push to login → push to select lifetime access before the Validate action is available. Standard content-gating pattern, straightforward given the stack already in place.

---

## 11. Blog

Do not use WordPress or any headless CMS split — this already caused hosting problems previously and isn't worth repeating. Build the blog directly inside the same Next.js repository, using either markdown files or a simple `posts` table in the same Supabase instance, rendered through one additional template (a blog template, same pattern as the Idea and Category templates). Keeping everything on one domain, one hosting setup, one deploy pipeline is also better for SEO — Google treats content on the root domain as stronger than content split across two platforms.

---

## 12. Design vs. code — the actual distinction

There are two different things both called "design" here, and only one applies to this project:

- **Claude Design** — a separate tool for visual exploration: one-off mockups, graphics, or a fresh color-scheme/hero-section idea (e.g. the existing "Golden Tree" canopy visual). Useful occasionally, not the main tool.
- **What this project actually needs** — a component and layout system living entirely in code, built through **Claude Code**. With thousands of database-driven pages, hand-designing each one isn't scalable or desired. What's needed instead is a set of layout variants (Section 5.5) built once, with the system automatically picking a variant per page — so pages differ from each other without anyone manually designing each one.

**Code is the main tool for this entire project.** Design tooling plays a small, occasional supporting role only.

---

## 13. Roadmap

### 13.1 Day 1
Lock in schema markup and breadcrumbs (Section 7.1–7.2) across the Idea and Category templates.

### 13.2 Day 2
Build the FAQ pool (Section 5.2) via the existing N8N + Claude bulk workflow, and wire the random-pull logic into the Idea template. This is the single highest-leverage upgrade for the lowest effort.

### 13.3 Following month, in order
1. Listicle template (Section 5.3) — fastest to catch search volume, strengthens internal structure
2. Auto internal linking script (Section 7.3)
3. Trending carousel + related categories sections, both on the random-pull system (Section 6)
4. FAQ Hub template (Section 5.4) as standalone pages, not just the embedded per-idea section
5. Validate button flow (Section 9) and the auth/session system (Section 10) — build and test live against both Claude and Perplexity's actual current URL behavior
6. Blog migration/build inside the main Next.js repo (Section 11)

### 13.4 Domain cutover
Move to `businessidea.io` only after the above templates are stable — Google should index the improved structure from day one on the production domain, not the thinner current version.

### 13.5 Not launch-blocking, revisit once the core is stable (see Section 4 competitor notes)
- `llms.txt` and explicit AI-content-signal meta tags
- A full `/sitemap` page in the style of IdeaProof's, once page count justifies it
- Guides / Questions Hub / Topic Hub content layers, modeled loosely on IdeaProof's structure but not copied
- An `/about/entity` style E-E-A-T page once the business is formally registered

---

## 14. Open items to confirm live during the build (not assumptions to code against blindly)

- Exact Perplexity URL-prefill query parameter (don't assume it matches Claude's `?q=` pattern — test it)
- Whether the Claude URL-prefill behavior is still active at build time, given it has been restricted before without much notice
- Final `Article` vs. alternate schema type decision for Idea pages
- Exact hash function and variant count for Section 5.5 (3 vs. 4 layout variants, 4 vs. 5 color themes) — small implementation detail, decide during the build, not blocking the plan
