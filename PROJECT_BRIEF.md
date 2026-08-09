Here's the full updated brief, exactly as written in the file, for you to listen to:

---

**BusinessIdea.io — Master Project Brief for Claude Code**

Read this file first, every session. This is the single source of truth for this project. Do not ask me to re-explain context that is already written here — read this file, then ask only about what genuinely isn't covered.

Owner / Developer: Cherrry (solo founder, minimal coding background, learning by building this with Claude Code)
Domain: businessidea.io (confirm exact spelling and DNS before going live — double-check there is no extra letter anywhere in the registered domain)
Stack: Next.js, deployed on Vercel, GitHub-connected, Supabase backend
Timeline: Everything in this document is being completed within this month. Full stop. There is no "phase two" or "next month" — every section below, including items marked as future-facing inspiration, is in scope for this build cycle. Do not propose multi-month roadmaps.
Market positioning (read carefully, this was previously stated wrong and must not be repeated): This is not an India-only product. We are an Indian company, proudly positioned as Indian engineers, and India is our first and primary market — which is why pricing is low. But the idea database and platform are being built for global scale from day one. Never say or imply "we only make content for Indians" anywhere in code comments, copy, or explanations back to the founder — the correct framing is "India-first, built for the world."

---

**1. How Claude Code should work with me on this project**

- I am a solo, non-technical founder. Explain changes in plain terms when needed, but don't slow down — just build, and tell me what you did.
- When I ask "where is X" (a word, an image, a section, a file), always answer with the exact file path and, if relevant, what to search for inside it (e.g. "open app/idea/[slug]/page.tsx, press Ctrl+F, search for heroImage"). Never make me hunt.
- I do not want emojis anywhere in the codebase, UI copy, or generated content. None. Not in buttons, not in AI-generated idea text, not in FAQs, nowhere.
- I do not want generic chatbot-style UI patterns (no ChatGPT-style message bubbles, no cheap/generic animation libraries used without intention). Animations should feel deliberate and premium — closer to Figma-prototype quality than default component-library defaults.
- All visual assets (icons, illustrations, SVGs) should be custom, not stock or emoji-style. I will generate these myself using AI image generation and drop them into a shared Drive folder, then hand you the links to wire in. Flag clearly, page by page, where an image/icon slot is expected so I know what to generate.
- We do not copy content, layout text, or structure verbatim from any reference site named in this document. Reference sites below are studied for information architecture and technical patterns only — URL structure, template types, schema usage. All copy, design, and voice on businessidea.io is original.
- Work in small, reviewable chunks. Don't attempt the entire roadmap in one pass — confirm one piece is working before moving to the next.
- Keep responses short. Answer in a concise, direct way rather than long exhaustive explanations — this is a token/usage-limit concern across the accounts described in Section 1.1, not a style preference. Give me the short version by default; I'll ask if I want more detail.
- Butterfly-effect rule (added 2026-08-08): before creating, deleting, or editing any file, think through what else it touches — other files, other sections of this brief, anything built later that might depend on it. If a change is genuinely risky or hard to reverse, tell me before doing it. If it's a normal, contained edit, just do it and log it in `PENDING.md`.
- External-blocker rule (added 2026-08-08): if something is blocked by anything outside our control — a paid tool with a signup/approval delay, a service that's slow to respond, anything we don't have in hand — don't stall. Find the best free/available alternative and keep moving, and say plainly in the update that this was done because X was blocked. Never just wait silently on something external.
- Live-check rule (added 2026-08-08): for any visual/UI change, always try to check it against the live site (or a real rendered preview) before calling it done, not just typecheck/lint — then come back and fix anything found. Known constraint to work within: this session's sandbox blocks outbound access to the live Vercel domain and to the private package registry (confirmed, not assumed — both fail with a policy-level 403, not a transient error), so a literal screenshot isn't always possible from inside a session. When that's the case, say so plainly rather than silently skipping the check, do the most rigorous code-level review possible (actual class conflicts, real overflow/breakpoint math, not guessing), and ask the founder for a screenshot to close the loop on anything that needs an actual pixel check.

**1.1 Primary / backup Claude Pro account workflow — internal only, never disclose**

This section describes how I am personally running this project day-to-day. It is for Claude Code's own understanding of the working environment — it must never appear in code comments, UI copy, README files, or anything a client or outside collaborator could see.

- I am running this build across two paid Claude Pro accounts, not the Claude API, for the actual development/editing/chat work in Claude Code — one Pro account alone cannot cover a full month of heavy back-and-forth.
- One account is the primary/lead for a given stretch of work; the second is a backup. When the primary account hits its usage limit, I switch to the backup and keep going.
- GitHub is the shared source of truth between the two accounts. Whichever account I'm using, the actual state of the project is whatever is committed to the repo — not a specific chat history. So when I switch accounts, Claude Code should ground itself in the current repo state (files, this brief, recent commits) rather than assuming it needs prior conversation context to understand what's been done.
- When I bring a new/backup account onto the project mid-stream, I'll frame it explicitly as "another instance is already working on this, you're picking up as backup" — Claude Code should treat that framing normally and just get to work from the repo state, not treat it as anything unusual.
- This dual-account approach is purely an operational choice on my side to manage usage limits. It has no bearing on the product itself and should never be mentioned anywhere outward-facing.

---

**2. What this product is**

BusinessIdea.io is a searchable library of business ideas for the Indian market. Each idea has its own page with a detailed blueprint. The core differentiator (see Section 3) is that idea validation is free — we don't charge for AI analysis, we charge a small platform fee for access, curation, and the data layer. The user runs their own validation using their own Claude or Perplexity account, for free, through a one-click handoff from our site.

**3. Unique selling point (do not dilute this in any copy or messaging)**

Every competing "validate your business idea" tool charges $20–$70/month and markets itself as if it has some proprietary validation engine. In reality, they are calling the same public AI APIs (Claude, GPT-4, Gemini) that anyone can access directly. The user paying $20/month usually has no idea their "validation" is just an API call wrapped in a UI.

Our position: we are transparent about this. We don't charge for validation — validation is free, because the user runs it themselves on their own AI account. We charge a small platform fee (₹ pricing, India-first) for:
- The curated idea database itself (structured blueprints, not raw AI output)
- Platform access, search, and organization
- The one-click handoff that saves the user from writing their own research prompts

**3.1 The accessibility/underserved-niche moat**

This is a deliberate, structural part of the strategy, not a side thought: as the category system scales past a handful of demographics into hundreds, we are the ones building dedicated idea libraries for audiences nobody else serves — zero-budget business ideas for blind entrepreneurs, for deaf entrepreneurs, for physically disabled founders, for senior citizens, and similar genuinely underserved groups. No competitor studied in Section 4 has anything like this. These categories should be priced accessibly (low or no premium) and should be planned into the category taxonomy from the start, not bolted on later, since retrofitting category infrastructure is far more expensive than designing for hundreds of categories up front.

This should come through in copy: honest, India-first, "why pay $20 to validate one idea when you can pay us a small platform fee and validate as many as you want using your own AI subscription."

---

**3.2 Access, login, and pricing (new — read before touching Section 8, auth, or any pricing/payment code)**

RESOLVED 2026-08-08 — this replaces any prior pricing/access assumption, including the Pro Pass model that was removed from the codebase. This is now the confirmed source of truth for pricing and access tiers.

Pricing — only two tiers exist:
- ₹199 — 3-month access
- ₹399 — Lifetime access

No other plans, trials, or price points exist unless explicitly added later. Whatever pricing currently lives in the code should be checked against these two numbers specifically, not assumed correct.

Login method: Google/Gmail sign-in only. No email/password signup, no other OAuth providers (no Facebook, no phone-number login, nothing else) — Gmail is the single, deliberate choice.

Three levels of access, not two:
1. No login required — every page type except gated idea content is fully visible to any anonymous visitor: homepage, `/browse`, category pages, blog, static pages, the FAQ hub, listicles. Nothing about these should be blurred or locked.
2. Logged in (free Gmail account, no payment yet) — idea page content unlocks and displays normally. Before login, idea cards and idea detail pages show a blurred preview with a lock icon overlay instead of the real content.
3. Active paid plan holder (₹199 or ₹399) — required specifically to use the Validate button (Section 8). Being logged in is not enough on its own to validate — the account must have an active plan.

Open question, not yet resolved — confirm with the founder before building: whether pillar/guide-style long-form pages (Section 6.7) sit in tier 1 (public) or get grouped with idea pages under tier 2 (login-gated). Everything else above is unambiguous. Section 6.7 has not been built yet, so this does not block anything currently in progress — resolve it before that template is built.

Amendment to Section 8 (Validate button): insert a new precondition as Step 0, before the existing Step 1 — check whether the logged-in user has an active paid plan. If not, do not proceed to the platform-picker flow; show the paywall popup described below instead.

The paywall popup — tone and content requirements:
Warm, a little playful, emotionally direct — not a cold "upgrade required" dialog. Follows the same brand voice as Section 11.1 (honest, India-first, confident). Structure: a short emotional heading, then a short paragraph contrasting competitor pricing with ours, ending in a clear call to action showing both prices.

Heading: "Hold on — this one's worth doing right."
Body: "Everywhere else, someone's charging you $20 to $100 a month just to validate a handful of ideas. We're not charging you a rupee for the AI part — that's free, forever, on your own account. This small fee is just for our time and effort building this for you. ₹199 gets you 3 months. ₹399 gets you lifetime access, every future update, and unlimited validations. No subscriptions, no surprises."
Buttons: "Get 3 Months — ₹199" / "Get Lifetime — ₹399"

(Wording can be adjusted freely — keep the contrast and the honesty.)

Build order note: Gmail-only login, the blur/lock UI on idea cards, and the pricing/payment integration need to exist before or alongside Step 3 (Validate button) in Section 13 — the button's behavior now depends on plan status, so it cannot be finished in isolation.

Implementation note (added by Claude Code): actually charging ₹199/₹399 requires a real payment gateway account (e.g. Razorpay, the standard for one-time INR payments) with live API keys, plus Google OAuth credentials configured in the Supabase Auth dashboard. Neither exists in this session — both need the founder to set up externally before checkout or Google sign-in can go live end to end. Per this brief's own validation culture (Section 1, README "Validation Culture" / "WHAT NOT TO DO"), no payment or login flow will be presented as working until it genuinely is. Frontend/schema groundwork that does not require those credentials is safe to build now; the checkout call and the Google OAuth handshake itself are blocked on the founder's setup.

---

**4. Reference sites — technical/architecture study only**

**4.1 Our own current build**

Live at: newbusinessideas3.vercel.app (pre-launch working domain, will move to businessidea.io)

Structure as last confirmed by direct inspection:
- / — home
- /browse — master idea listing
- /category/[slug] — category template (currently minor/simple)
- /idea/[slug] — single idea template (this is the main product surface)
- /search?q= — dynamic search (must be set to noindex,follow)
- /blog, /pricing, /about, /contact, /terms, /privacy, /disclaimer, /gdpr, /refund-policy, /sign-in — static pages

Cross-check before building on top of this: the repo may have moved on since this structure was last inspected — files could have been renamed, replaced, or restructured since. Claude Code should re-verify the actual current file/route structure directly against the live repo before making assumptions based on the list above, rather than trusting this document as current truth for the existing codebase.

Data source: Supabase, dumped in via an n8n automation pipeline that's already running and has generated 300+ ideas, scaling toward 1,000+ within days and 3,000+ within the month.

**4.2 Competitor reference — ideaproof.io (the only competitor referenced in this project)**

There is exactly one competitor referenced throughout this project: ideaproof.io. This is the most structurally mature player in the space and the one studied in depth for information architecture only — URL patterns, template types, schema usage. Do not copy any wording, layout, visual design, or content from it. All copy and design on businessidea.io is original.

Reference URLs to study (structure and template-type inspiration only, not content):
- https://ideaproof.io/sitemap — full sitemap
- https://ideaproof.io/ — homepage layout and banner structure
- https://ideaproof.io/features, https://ideaproof.io/pricing, https://ideaproof.io/about — standard page patterns
- https://ideaproof.io/lists/ai-startup-ideas, https://ideaproof.io/lists/side-hustle-ideas, https://ideaproof.io/lists/small-business-ideas — listicle template examples
- https://ideaproof.io/questions/how-to-validate-business-idea, https://ideaproof.io/questions/how-to-do-market-research — FAQ/question template examples
- https://ideaproof.io/guides/complete-idea-validation-guide — pillar guide template example
- https://ideaproof.io/calculators/roi, https://ideaproof.io/calculators/ltv, https://ideaproof.io/calculators/market-size — interactive calculator template examples
- https://ideaproof.io/tools, https://ideaproof.io/tools/category/validation-research — curated tools directory example
- https://ideaproof.io/validate-idea/saas, https://ideaproof.io/validate-fintech-idea, https://ideaproof.io/validate-healthtech-idea — industry/vertical landing page examples
- https://ideaproof.io/compare, https://ideaproof.io/ideaproof-vs-validatorai — comparison page examples
- https://ideaproof.io/failed-startups, https://ideaproof.io/failure/[slug] — case-study database example (not part of our core concept — noted for completeness, not for building)

Full confirmed URL template inventory and what each is for:

Pattern → Purpose → Our equivalent

/lists/[slug] → Roundup listicle post (e.g. "50 AI Startup Ideas") — top 10 detailed, rest as cards → Build this month — Section 6.3

/questions/[slug] → Single-question FAQ page, atomic → Build this month — Section 6.4

/guides/[slug] → Long-form pillar guide → Build this month — Section 6.7

/calculators/[slug] → Interactive tool (ROI, CAC, LTV, valuation, etc.) → Build this month — Section 6.8

/tools/[slug] and /tools/category/[slug] → Curated free-tools directory → Build this month — Section 6.9

/validate-idea/[vertical] → Industry landing page (SaaS, fintech, healthtech, etc.) → Build this month, adapted to Indian verticals — Section 6.10

/failed-startups, /failure/[slug] → Failure case-study database → Not part of our core concept, skip entirely

/compare, /[competitor]-vs-ideaproof → Comparison pages → Build this month, low priority within the month — Section 6.11

/about, /pricing, /terms, /privacy → Standard static pages → We already have equivalents

Key architectural takeaways to apply (patterns, not content):

1. A small number of repeating templates scaled to thousands of URLs — validates our template-first approach.
2. Every template type has its own schema.org type (see Section 7) and its own sitemap file, not one flat sitemap.
3. Comparison, question, guide, calculator, and list content types exist specifically to catch long-tail search volume that a single "idea" page type can't catch alone.
4. They publish a llms.txt — a plain-text file listing key pages, facts, and citation preferences aimed at being cited correctly by AI assistants and chatbots. Legitimate technique, not something to fabricate false stats in (see Section 11 for the honest version of this for us).

---

**5. How Google (and any AI crawler) actually tells posts, pages, and categories apart**

This was a point of real confusion earlier — writing it here permanently so it's never re-explained.

The word used in a URL slug has no bearing on classification. Whether a folder is called /idea/, /list/, /entry/, or anything else is irrelevant to search engines. What actually determines page type:

1. Schema.org JSON-LD markup in the page <head> — this is the primary, authoritative signal. Idea pages should declare Article, category/browse pages should declare CollectionPage, static pages should declare WebPage.
2. Sitemap segmentation — split into sitemap-ideas.xml, sitemap-categories.xml, sitemap-pages.xml, referenced from a sitemap-index.xml. Do this before the idea count gets into the thousands.
3. Breadcrumb schema (BreadcrumbList) — proves hierarchy (Home > Category > Idea).
4. Internal linking pattern and content shape — category pages link out to many things and repeat short card layouts; idea pages have one long unique body and are linked into from many places.

Action: implement all four of the above. None of them require renaming any existing route.

---

**6. Templates — full specification**

The core five (6.1–6.5) are the priority build order. Sections 6.7–6.11 are additional templates inspired by the competitor's full page-type inventory (Section 4.2) and are also in scope this month — everything in this document is one build cycle, not phased.

**6.1 Idea template (/idea/[slug]) — the flagship template, gets the most effort**

Top-to-bottom structure:
1. Hero — idea title, category tag, one supporting visual (image slot: flag for me to generate)
2. Main blueprint body — the existing generated content (named buyer, money mechanics, risks, verdict, etc.)
3. Data visualization block — a simple demand/trend indicator, doesn't need to be complex, just needs to look alive (bar, gauge, or similar)
4. Validate This Idea button — see Section 8 for exact behavior, this is non-negotiable and confirmed working
5. FAQ section — 5 questions above additional content, 5 below (see Section 6.5 for how these are generated/pulled)
6. Related ideas — 3 cards, same category, pulled randomly with a limit, never hardcoded (see Section 9)
7. Related categories — random subset (e.g. 5), never a full static list of all categories
8. Trending/most-searched carousel — random pull from top ideas, not fixed
9. Closing call-to-action block — validate button repeated, plus any other conversion actions

Layout variation (to avoid the "AI factory" look) — confirmed requirement, explicitly restated by founder: build 3–4 visual layout variants of this template (hero-left vs hero-banner vs stat-forward, etc.) plus 3–4 accent color themes. Unlike the earlier draft of this document, the variant is not fixed per idea — it is chosen randomly on every page render, so if the user refreshes an idea page, the layout and color theme can visibly change along with the random content sections (Section 9). This reinforces the "something is alive behind the scenes" feeling the founder wants across the whole site, not just in the FAQ/related sections. This logic lives entirely in code (pick a random variant client- or server-side on each request) — no "layout" column needed in the database. (See Section 12.2 for the refined version of this — refreshes should cycle through gradient variations of the same brand palette, not unrelated color themes.)

**6.2 Category template (/category/[slug]) — kept minor, as is**

Top 10 ideas shown in detail-ish cards, remainder as simple clickable cards/buttons. One category count (dozens, not thousands) means this template does not need the same variation trick as the idea template.

**6.3 Listicle template (/list/[slug] or similar — pick a slug word freely, it has zero SEO effect per Section 5)**

New template. "50 Zero Investment Business Ideas for India" style. Top 10 get 200–300 words each written directly on the page; remaining ideas display as clickable cards linking to their full /idea/[slug] page. This is our fastest lever for both search volume and internal linking density.

**6.4 FAQ hub template (/faq/[category-slug] or similar)**

One page per category (e.g. "Low Investment Business Ideas — FAQ", "Side Hustle Ideas — FAQ"). Pulls from the same FAQ pool described in 6.5. This is a standalone page in addition to the embedded FAQ section inside idea pages.

**6.5 FAQ pool system (solves "we have 300 existing ideas with no FAQs" problem)**

Do not attempt to write bespoke FAQs for each of the 300+ existing ideas — not necessary and too slow.

Instead: generate roughly 10–15 FAQs per category in bulk (one-time job via the n8n + Gemini API pipeline — see Section 10 for the model change), giving a pool of ~150+ FAQs total across ~12 categories. Every idea page, at render time, pulls a random 5–10 FAQs from its own category's pool (ORDER BY random() LIMIT n at the Supabase query level). This:
- Covers all 300 existing ideas instantly with zero manual work
- Covers all future ideas automatically (they inherit their category's pool)
- Satisfies the "page should feel alive on refresh" requirement below, since the visible FAQ set changes each time

Later phase (not month one): idea-specific FAQs generated per-idea through the ongoing n8n pipeline for new content going forward.

**6.6 Static pages**

About, Contact, Terms, Privacy, Disclaimer, GDPR, Refund Policy, Pricing, Sign-in — already exist, no template needed, hand-edit each one's schema individually (10 pages, five-minute job each, see Section 7).

**6.7 Guide template (/guide/[slug])**

Long-form pillar content, inspired by the competitor's /guides/[slug] pattern (Section 4.2). India-first startup/business guidance — e.g. "how to validate a business idea with zero budget," "how to start a side hustle in India." Same schema/breadcrumb pattern as everything else.

**6.8 Calculator template (/calculator/[slug])**

Small interactive tools — ROI, break-even, startup cost, funding-needed calculators, adapted to Indian currency and context. Inspired by the competitor's /calculators/[slug] pattern. Simple client-side calculation widgets, no backend needed per calculator.

**6.9 Tools directory template (/tools and /tools/category/[slug])**

A curated directory of free tools useful to Indian founders (validation, no-code, landing pages, etc.), inspired by the competitor's /tools hub. This can start as a hand-curated list and does not need to be database-driven at launch.

**6.10 Vertical/industry landing page template (/validate/[vertical])**

Industry-specific landing pages — e.g. validate a SaaS idea, validate a D2C brand, validate a fintech idea — adapted to verticals relevant to the Indian market. Each links into the relevant category and idea pages rather than duplicating content.

**6.11 Comparison template (/compare/[slug])**

Comparison-style pages framed around honest value (Section 3), not attacking competitors by name in ways that could be seen as disparaging — e.g. "validating a business idea: platform fee vs $20/month tools" framed generically rather than as a direct competitor callout, to keep this defensible and evergreen.

---

**7. Schema markup and breadcrumbs — implementation notes**

Critical point: schema logic is written once per template, not once per idea. Since every idea renders through the same idea/[slug] file, adding a schema-generation function to that one file automatically applies it to all 300+ existing ideas and every future idea Supabase sends in — no new database column needed, no per-idea manual work, no "schema" field required anywhere.

Required schema by template:
- /idea/[slug] → Article (headline, description, datePublished, category as about)
- /category/[slug] → CollectionPage
- /list/[slug] → Article or ItemList depending on final shape
- /faq/[slug] → FAQPage
- Static pages → WebPage
- All pages with a category → BreadcrumbList

Also required before scale:
- Split sitemap.xml into sitemap-ideas.xml, sitemap-categories.xml, sitemap-pages.xml, indexed via sitemap-index.xml
- Add noindex,follow to /search?q=* to prevent crawl-budget waste on infinite query variations

Do this work first, before new templates, since it retroactively fixes all existing content in one deploy.

---

**8. Validate button — exact confirmed behavior**

RESOLVED 2026-08-08 — this section is now the sole source of truth for idea validation. The codebase previously had a different, undocumented mechanism live: a "Pro Pass" ($49 one-time, Stripe checkout never actually wired up) gating "premium" ideas, plus a "Live AI Audit" that called Gemini directly from our own server (via a Lovable AI gateway) and rendered the result in our UI. That entire mechanism has been removed — no more locked/Pro/tier gating on any idea, no more server-side AI audit call, no more Pro Pass plan, checkout stub, or Stripe reference anywhere in the codebase. All ideas are fully readable. The Validate button below is the only validation mechanism now, implemented exactly as this section describes (free, handoff to the user's own Claude/Perplexity account, nothing generated or stored on our servers). Pricing, terms, privacy, refund-policy, services and homepage copy referencing the old Pro Pass/AI-audit mechanism were updated to match. Platform-access pricing is now decided — see Section 3.2 (₹199 / 3 months, ₹399 / lifetime) — and Section 3.2 adds a Step 0 precondition below: an active paid plan is required before the platform-picker flow runs.

This has been tested live and works. Implement exactly as follows, no copy/paste UI element anywhere.

Flow:
0. Precondition (added by Section 3.2): check whether the logged-in user has an active paid plan (₹199 3-month or ₹399 lifetime). If not, do not proceed to Step 1 — show the paywall popup from Section 3.2 instead.
1. User is on any idea page, clicks Validate for Free.
2. User picks a platform (Claude, Perplexity — no ChatGPT, no Grok, deliberately excluded from this product's positioning).
3. Backend builds a URL for the chosen platform with the idea's specific validation prompt attached as a query parameter (e.g. https://claude.ai/new?q=<encoded prompt>). This happens invisibly — no prompt text is ever shown or copyable in our UI.

   The prompt itself must be a fully engineered, detailed instruction — not a casual one-liner. The user is about to spend one of their own daily uses on their own AI account, so this needs to be worth it. The backend prompt template should explicitly instruct the destination AI to: (a) produce a complete, structured markdown-file-style output covering the idea's market analysis, target buyer, revenue model, key risks, and a launch roadmap; and (b) generate an accompanying visual (a chart, diagram, or similar) where the platform supports it, not just plain paragraphs. This prompt template lives once in the backend, is applied to every idea via variable substitution (idea title, category, key facts), and should be treated as one of the highest-leverage pieces of copy in the whole product — it's effectively doing the job a $20/month competitor charges for. If the user's daily platform limit is already used up when they land there, that's expected and outside our control — the platform fee they paid us covers curation and access, not their AI provider's usage limits, and no messaging on our site needs to apologize for or explain that.
4. New tab opens directly to that platform.
   - If the user is already logged into that platform (in-browser or via their installed app), the prompt appears pre-filled in the input box. It does not auto-submit — the user presses enter themselves, which is expected and fine.
   - If the user is not logged in, they go through that platform's own login flow, then click Validate again on our site — this re-triggers the flow now that they're authenticated.
5. A short 2–3 line note sits under the Validate button on our site explaining this exact two-step reality, so nobody is confused mid-flow: "You'll be taken to Claude/Perplexity with your prompt ready — just hit enter. Not signed in yet? Sign in there, then tap Validate again."

Known platform-side behavior to be aware of, not a bug: Claude's input screen may show a small caution notice about links carrying embedded queries, since query-based prompt injection is a known attack pattern the platform watches for generally. This is expected, is not an error, and does not block the flow — it's a standard platform-level notice, not specific to our implementation. Do not attempt to "fix" or suppress this; it's outside our control and not something we need to react to.

Important ongoing caveat: the ?q= prefill mechanism is not a documented, permanently-guaranteed public API — treat it as best-effort. Test it periodically after platform updates. The fallback note under the button (step 5 above) is also the safety net if this behavior ever changes.

Never build: a visible copy button, a visible prompt textbox, or anything resembling "copy this and paste it into Claude." The entire point is that it's invisible and automatic up to the point the user has to hit enter themselves.

---

**8.1 Homepage banner + "Surprise Me" section (do not skip)**

Directly below the hero banner on the homepage, before any other content, add a dedicated interactive section:

- A dropdown lets the visitor pick a category (Work From Home, Side Hustle, Passive Income, etc. — pulls live from the existing category table, so it grows automatically as categories scale into the hundreds).
- A button labeled "Surprise Me" — clicking it (with or without a category selected) pulls 4–5 random ideas from the database (filtered by category if one was chosen) and displays them right there on the homepage.
- Clicking any of the 4–5 surprise results takes the user straight to that idea's full /idea/[slug] page.

This is the homepage's primary engagement hook — it should feel instant and a little delightful, not like a search form. It is powered entirely by the same random-pull database logic described in Section 9, just surfaced at the top of the homepage instead of inside an idea page. No new content needs to be written for this — it's a UI layer over data that already exists.

**8.2 Internal linking strategy**

Beyond the "related ideas" cards, every idea and article body needs contextual inline links woven into the actual text — not a dumped list at the end. Rules:
- Maximum 3 internal links per page. Do not over-link.
- Links are placed automatically by scanning generated content for phrases that match existing idea titles or category names in the database, and wrapping the first 2–3 genuine matches into working links. No manual placement, ever — this has to scale to thousands of pages.
- This runs as part of the same automation pipeline that generates the content (Section 10), not as a separate manual pass.
- Prioritize linking to category/hub-style pages and to closely related ideas over distant/unrelated matches — relevance beats link count.

---

**9. "Nothing static" / dynamic-feel requirement**

Applies everywhere except the core layout/variant of a given idea page (that stays consistent per idea so URLs don't visually flicker):
- Related ideas (3 cards) — random pull from same category, with LIMIT, never hardcoded
- Related categories — random subset (e.g. 5 of however many categories exist), never a full static list
- Trending/most-searched carousel — random pull from top ideas
- FAQ section — random 5–10 from the category's FAQ pool (Section 6.5)

This is implemented as ORDER BY random() LIMIT n (or Supabase's equivalent) at the query level — not application logic, not a cron job, not pre-computed. Every page load recomputes it. This is also what makes the site scale cleanly past 100+ categories and 1,000+ ideas without needing to redesign any section.

---

**10. Content pipeline — posts, blog, and future automation**

Model change — read carefully, this replaces the earlier Claude API plan: all content-pipeline generation — ideas, articles, FAQs, and everything else produced in bulk — runs on the Gemini API, not the Claude API. Claude Pro accounts (Section 1.1) are reserved for development work inside Claude Code, not for automated content generation. Reasoning: running two Claude Pro subscriptions already covers the month's dev budget, and mixing two different model "voices" (Gemini for bulk content, Claude for dev/editorial work) also helps the published content avoid a single-model templated tone — each model has its own default phrasing and body language, and blending sources is intentional here, not an oversight.

- Blog lives on our own Next.js/Supabase stack, not WordPress. Headless WordPress caused hosting issues previously and is not worth revisiting. Blog posts render through their own template following the same schema/breadcrumb pattern as everything else, on the same domain — better for SEO than a split domain/platform anyway.
- Content generation pipeline: n8n workflow calling the Gemini API generates idea blueprints, FAQ pool content, and listicle content in bulk, writing into Supabase, which the frontend already reads from live.
- Storage for the content pipeline itself: Supabase remains the source of truth for idea data since the frontend already depends on it. Important cost constraint: the current Supabase plan caps storage at 500MB — if the pipeline starts saving anything beyond core idea records (extra logs, drafts, raw generation output), that risks pushing us over and increasing cost. Before adding any new data type to Supabase, check whether it actually needs to live there. The founder has an unused one-year Google Workspace/Gemini Pro subscription (Drive, Docs, Sheets) that could hold drafts, generation logs, or raw prompt/output history instead — worth exploring as an overflow location so Supabase stays lean and only holds what the live site actually queries (ideas, categories, FAQs — anything needing random pulls, filters, or joins).
- Any new content template (list, FAQ hub, guide, calculator, and the other types in Section 6.7–6.11) should be built so the n8n workflow can target it directly — i.e., the workflow writes structured fields that map onto whichever template's expected shape, rather than needing a new pipeline built per template.
- API key rotation: the founder will supply multiple Gemini API keys for the content-generation pipeline (quantity to be confirmed). The n8n workflow (or a thin wrapper around the API calls) should detect a failed/rate-limited call and automatically rotate to the next key, with roughly a 30-second cooldown/retry window before switching, so bulk generation jobs don't stall on a single exhausted key.
- SEO fields, not just slugs: every piece of generated content (idea, FAQ, listicle, guide, etc.) must come out of the pipeline with a complete SEO package, not just a slug — SEO title, meta description, and slug, all written as structured fields into Supabase alongside the content itself. This is currently missing and needs to be added to the generation prompt/output schema.
- Image SEO: every image reference generated or attached through the pipeline needs proper alt text — including the brand name, the image's role/position on the page, and a genuinely descriptive caption of what the image shows — not a generic filename or blank alt attribute. Build this into the same automation output rather than handling it separately.
- New/extended workflow generation: when Claude Code is asked to build a new or extended n8n workflow for this pipeline, default to giving either (a) the actual n8n workflow JSON directly, or (b) a concise, ready-to-paste prompt the founder can run in a separate Claude account to generate that JSON — whichever is more token-efficient for the request at hand. Any workflow built this way must call the Gemini model for content generation — never Claude API, never ChatGPT, to stay consistent with the model decision above.
- Category scaling — open question to resolve, not yet decided: the current dataset has roughly 250–300 ideas across ~12–15 categories, but distribution is uneven — e.g. Tech & SaaS currently has only ~10 ideas and needs to grow toward 100–200. Before generating a large new batch for any category, propose an approach for adding volume to specific categories without disrupting or duplicating the ideas already live in Supabase, and confirm it with the founder before running it at scale.

---

**11. Our own llms.txt**

Ideaproof.io publishes an llms.txt at their root — a plain-text manifest aimed at helping AI assistants and chatbots cite them accurately (key pages, one-line summaries, FAQ patterns, citation preferences). This is a legitimate and increasingly common practice, in scope for this build. Build it toward the end of the month once category counts, idea counts, and pricing are stable enough to publish real numbers — sequence it after Section 13's core steps, not as a separate future project.

Important distinction to hold onto: several of the numeric claims in competitor manifests (accuracy percentages, user counts, "verified" savings figures) read as marketing copy dressed as data rather than independently audited facts. When we eventually write our own llms.txt, only include numbers we can actually stand behind — real idea count, real category count, actual platform fee, honest description of what the free validation flow does. Do not fabricate accuracy percentages, user testimonials, or "verified" statistics we haven't measured.

---

**11.1 Brand voice and homepage copy direction**

Position: proud Indian engineers, building for the world. Not a generic SaaS tone, and not a stack of "$20/month" comparisons repeated everywhere — the pricing contrast is a supporting fact, not the whole personality. Homepage copy especially should carry genuine emotional and motivational weight, with some rhythm/punch to the phrasing (short, confident lines rather than paragraph-style marketing copy) — the underlying message being something like: the world is racing to sell you access to AI that's already yours to use, and we'd rather hand you the idea and the strongest possible prompt than sell you a subscription to something you can already do yourself. This tone should run through the hero banner, the Surprise Me section intro line, and the pricing page framing — not just be a one-off homepage headline.

---

**12. Design constraints (non-negotiable)**

- Zero emojis anywhere — UI, buttons, AI-generated content, FAQs, everything.
- No generic/default component-library animation feel — deliberate, Figma-prototype-quality motion only.
- No stock icon packs or chat-interface-style visual language (no ChatGPT-bubble aesthetic).
- All icons/illustrations are custom-generated by the founder via AI image generation and supplied as links/files to be wired into the templates — flag every page/section that expects a visual asset so these can be generated in batches.
- Color system: a small deterministic palette (4–5 themes) cycles across idea pages using the same hash-based logic as the layout variants (Section 6.1), not per-idea manual selection.

**12.1 Homepage hero — mandatory brand visual (new, do not omit)**

The homepage hero carries a fixed, mandatory visual element: two animated ring/circle shapes in the background — one large, one small — representing the founder and his wife. This is a personal brand element, not a placeholder, and must stay in every redesign iteration. What can change freely: the animation style, motion timing, and the color treatment of the rings. What cannot change: the presence of exactly two rings (one large, one small). Pair this with the founder's mandatory hero image already in use.

**12.2 Refresh-based gradient variation (refines Section 6.1)**

The "changes on refresh" behavior across idea pages should specifically be a gradient shift within the same brand color family, not a swap to an unrelated color theme. Same brand colors, varying gradient treatment — visible and alive, never bright, loud, or off-brand. The founder will supply Figma-generated reference images showing the exact target look; match that reference closely once provided.

**12.3 Dark mode / light mode toggle — mandatory**

A dark mode / light mode switch must sit in the header/top of every page. This is not optional or later-phase.

**12.4 Footer — mandatory, must be wide and comprehensive**

The footer must be a full-width, substantial footer bar (not a thin single-row footer) — the founder will share a specific reference example to match the target density and layout; treat the current footer as needing a full rebuild, not a tweak.

**12.5 Header and navigation — critical, currently underbuilt**

The header is the site's primary hook and currently reads as weak — this needs a real redesign pass, not a minor tweak:
- Expand from the current single "category" dropdown to at least 3–4 dropdowns in the header (category plus additional groupings to be defined).
- Investigate and fix the current slow page-load issue, particularly around the category dropdown's lazy loading — performance here matters as much as visual design; keep the implementation lightweight while still highly interactive.
- The founder will supply reference images of dropdown-menu layouts (sourced from other sites) to guide the exact structure and interaction pattern — replicate the structural pattern shown in references, not the branding.

**12.6 Back-to-top button — mandatory**

A simple, no-frills "scroll to top" button (and optionally "scroll to bottom") should be present site-wide, styled in the existing brand colors. No special animation needed — clean and functional.

**12.7 Visual polish standard — Figma-quality, and an explicit brand-safety constraint**

- Cards, layouts, and visual patterns across the site must hit a genuinely premium, Figma-prototype level of polish — not a generic template look, and not a cluttered, dated, over-decorated aesthetic either.
- Hard constraint, stated explicitly because of a past incident: an earlier AI-generated pass at this site used a dark-navy palette with dense, uniform card grids that ended up looking like a cheap adult-content or tabloid website rather than a professional business directory — this must never happen again. Any dark-mode or dense-card-grid direction needs to be visibly distinct from that look: more whitespace, more intentional hierarchy, no repetitive same-size card walls.

**12.8 Image treatment — no raw/static image drops**

Images should never be dropped in as-is at arbitrary fixed aspect ratios. Every image slot needs custom treatment — subtle gradient overlays, consistent framing/cropping logic, and a genuinely polished presentation — so the site never looks like a stock-photo dump. Apply this consistently across idea cards, listing pages, and template hero images.

**12.9 Mobile and tablet UI — previously missing, must be specified**

This entire brief has so far only implicitly covered desktop. Mobile and tablet behavior needs its own explicit pass covering: responsive breakpoints for every template in Section 6, how the header's 3–4 dropdowns collapse on small screens, how the homepage Surprise Me section and hero rings behave on mobile, and touch-friendly sizing for the back-to-top button and validate button. Treat this as a required deliverable, not an assumed side-effect of responsive CSS.

---

**13. Build order (all within this month — one build cycle, not phases)**

Custom domain (businessidea.io) is intentionally not connected yet — that's Step 17, last on purpose. Testing happens on the Vercel-assigned production domain until then; branch/PR preview subdomains are incidental to testing, not a target to configure around.

1. Cross-check current live structure against Section 4.1 before touching anything (files may have moved since last inspection).
   - DONE 2026-08-08 — found the codebase is actually TanStack Start on Vercel/Lovable, not Next.js as originally assumed; brief corrected accordingly.
2. Schema + breadcrumbs + sitemap segmentation on existing idea and category templates — retroactively fixes all 300+ live ideas in one deploy. Add noindex to search.
   - DONE 2026-08-08.
3. Validate button — implement exactly per Section 8, including the fully-engineered backend prompt template (8's prompt requirement) and the fallback note copy.
   - DONE 2026-08-08 — Section 8 flow live; old Pro Pass/Stripe/server-side Gemini audit mechanism fully removed (confirmed by repo-wide grep, not just memory).
   - DONE 2026-08-08 — Section 3.2 access tiers live and confirmed: Google sign-in creates real sessions (verified in Supabase auth.users/profiles), redirect-destination bug fixed, blur/lock gating and Step 0 plan-check working, expiry enforced read-side.
   - DONE 2026-08-08 — closed a real RLS hole found during audit: profiles had a client-writable UPDATE policy, meaning any signed-in user could have self-granted a paid plan via the browser console. Policy dropped; plan changes now only possible via direct DB access. See PENDING.md.
   - PENDING — real checkout. ₹199/₹399 buttons route to /pricing, charge nothing. Razorpay deprioritized by founder (2026-08-08, not urgent). Manual activation (Claude running SQL via Supabase MCP) is the working fallback — no self-serve admin UI exists yet. See PENDING.md.
   - PENDING — no visible signed-in state anywhere in the UI (no name/account indicator). Flagged by founder 2026-08-08, not urgent, deferred behind Step 4.
4. Homepage rebuild — new banner with the mandatory two-ring hero visual (12.1), brand voice (Section 11.1), and the Surprise Me interactive section (Section 8.1).
   - DECISION 2026-08-08 (founder-confirmed, closed) — pre-existing homepage audit turned up fabricated "11 people, 11 states" team copy and a fabricated "767 founders reviewed us / WhatsApp group" stat; both replaced with an honest short line (no headcount/location claims) and a real reviewer count (967, rephrased around functionality/structure, no channel mentioned). Hotlinked ethicalfounder.com/upcomingtools.com images confirmed as the founder's own other properties — left as-is, migration to our own storage is low-priority (see PENDING.md). Brand name standardized site-wide to "BBI — Bharat Business Ideas" (short form "BBI" in body copy/titles), replacing the "IdeaVault AI" name used everywhere and the homepage-only "BBI — Best Business Ideas" variant. Domain stays businessidea.io — display name only. Twin-ring hero visual (12.1) already existed and already met spec (one large ring, one small, paired with the hero image) — preserved as-is. Surprise Me (8.1) built: category dropdown + button, pulls from a new get_random_ideas Postgres function (ORDER BY random() LIMIT n), placed directly below the hero before any other content.
   - FIXED 2026-08-08 (found during a founder-requested Step 4/5/6 audit) — the "standardized site-wide" claim above was wrong: `src/routes/index.tsx`'s own route-level `head()` (which overrides the root's meta) plus 5 more spots on the homepage (hero eyebrow, "Who we are" heading, sr-only LLM summary) still said "BBI — Best Business Ideas" — meaning the actual rendered `<title>`/meta description on the live homepage never got corrected. `__root.tsx`'s defaults were fixed correctly back in Step 4; index.tsx's own overrides were missed. All 7 occurrences now read "Bharat Business Ideas"; repo-wide grep confirms zero stale occurrences left.
   - CORRECTED 2026-08-08 (founder correction, overrides both entries above) — "Bharat Business Ideas" was wrong too. The confirmed, correct full brand name is **"BBI — Bro Business Ideas"**. Fixed in `__root.tsx` (site-wide default meta — covers every page that doesn't override it) and `src/routes/index.tsx` (homepage's own overrides, all 7 spots) in this pass. Repo-wide grep confirms zero remaining "Bharat" occurrences. Not yet swept: any other route file that might spell out the full name in its own `head()` or body copy — none were found in the codebase as of this correction (only `__root.tsx` and `index.tsx` ever had it spelled out; every other page uses just the short form "BBI"), but see PENDING.md for the standing instruction to double-check this on every remaining page as it's touched, in case a future page spells it out.
   - AWAITING FOUNDER APPROVAL 2026-08-08 — full homepage copy rewrite drafted, NOT YET applied to `src/routes/index.tsx`. Founder gave detailed direction: 6th/7th-grade English, warm "a brother talking to you" tone, real visitor pain + our solution, SEO keyword coverage kept, and — critical — never explain the actual validation mechanism (no "we send you a prompt," no "paste into Claude/Perplexity" language) in marketing copy, since that hands the business model to any competitor reading the homepage. The functional one-line note on the idea page itself (Section 8, right before the Validate button) is fine to keep as-is — that's necessary UX copy for someone already using the feature, not top-of-funnel marketing. Full drafted replacement text for founder review, organized by the section names the founder used:

     **Hero headline** — eyebrow: "The Truth About Business Ideas"; H1: "Tired of paying just to check if your idea will work?"; subtext: "We built a free home for real business ideas — side hustles, zero investment ideas, work from home ideas, and low investment ideas. Every idea is researched, not guessed. We tell you who will actually pay you, how the money works, and what will hurt you in year one. Then we give it to you straight — build it, or walk away. Browse for free. Validate as many times as you want. Pay only once, if you ever want full access."

     **What you get** (hero panel 1) — "Every idea here comes with four honest things: who will actually buy from you, how the money really works, the painful risks people find out too late, and a straight answer — build it, or walk away. This is not a list. This is the research you wish someone gave you before you spent your time or money."

     **How it works** (hero panel 2, mechanism hidden) — "Browse any category. Read the full blueprint. If it feels right, tap Validate — and get real research on your idea for free, using AI tools you already pay for. No extra charge. No monthly limit. Free to browse. Free to validate, again and again."

     **Who we are** (`BrandStatementBanner`) — "We have been where you are. We paid for those $20 'validation' platforms too. We got a few generic lines back, spent our money, and got nothing real in return. When we asked for help, no one answered. That hurt. So we built the thing we needed back then — a free, honest library of small business ideas and side hustles, with real research, not empty hype. Browse for free, always. Validate as many times as you want, on your own account, at no extra cost. Pay once — ₹199 for 3 months or ₹399 for life — only if you want full access. Never a monthly bill."

     **The problem we found** (`MarketGapSection`) — H2: "Why is everyone still charging you $20 to check one idea?"; para 1: "Before we built BBI, we went looking for a place to check our own business ideas. Every place we found charged at least $20 for three or four 'validations.' It sounded like deep research. It wasn't. It was really just one AI call — the same kind of call you could run yourself, a hundred times over, for the price of one month of Claude or Perplexity."; para 2: "We are regular people. Most of us have full-time jobs and build BBI at night and on weekends, because we know what it feels like to stare at a $20 paywall with nothing left to spend. So we built the thing we wished someone had built for us."

     **The Research Standard** — H2: "Not just a list. Real research you can trust."; sub: "Before you spend a rupee or a weekend, check these 4 things on every idea."; pillars: Named Buyer — "Exactly who will pay you, and why they have money ready right now."; Unit Economics — "Simple numbers on price, cost, and when you actually start making profit."; 1st-Year Risks — "The hidden costs and traps that quietly kill new businesses."; Founder-Fit Verdict — "An honest answer: should you build this, or walk away?"

     **Why this exists** — H2: "A list of ideas is not research. And it can cost you money."; para 1: "Most '100 business ideas' pages are written in one afternoon by someone who never actually sold anything. They just say 'the market is growing' and stop there. Finding an idea was never the hard part. The hard part is knowing who will really pay you, how often, and what happens when a bigger company copies you for free."; para 2: "That is why every blueprint here answers those questions first. We name your exact customer. We show you the real numbers. We tell you the risks most people only find out after they've already spent their money."; para 3: "Sometimes the honest answer is: don't build this one. That's the whole point. Research that only ever agrees with you isn't research — it's marketing wearing a lab coat." Sidebar 4 rows simplified too: "A named buyer" — "Not 'small businesses.' The real person, their budget, and why they need this now."; "Working money mechanics" — "What you charge, what it costs you, and the point where this stops being a side job and becomes a real business."; "The unglamorous risks" — "The platform risks, slow seasons, and the competitor who's already halfway there."; "A founder-fit verdict" — "Who should build this — and who should walk away."

     **Pricing** (stat tile note) — "₹199 for 3 months, ₹399 for life. Pay once. No surprise bills, ever."

     **Bonus — 3 more mechanism-leak spots found beyond what the founder flagged, same fix applied**: (1) "Validation is free" feature card → "Every blueprint has a Validate button. Tap it, and get real research on your idea — market size, your ideal buyer, the money model, and the risks — free, using AI tools you already pay for. No extra cost. No limit."; (2) FAQ "Is the whole library free?" → "Yes. Every blueprint is free to read, start to finish. Validating an idea is free too — you use AI tools you already pay for, so it costs you nothing extra, ever."; (3) FAQ "Is this useful if I already have a business idea?" → "Yes. Find the closest matching idea and tap Validate. You'll get real research — market size, competitors, and a launch plan — shaped around your own version of the idea, at no extra cost."

     **Footer tagline options** (new addition, footer currently just has a copyright line, no tagline) — A: "Bro Business Ideas — built by people who've been where you are. Businessidea.io"; B: "Bro Business Ideas — Build by BBI, for every dreamer who refuses to give up. Businessidea.io"

     Next action: founder reviews and either approves as-is, edits inline, or asks for another pass. Once approved, apply verbatim to `src/routes/index.tsx` (all locations named above) and `src/components/site-shell.tsx` (footer tagline), verify with `tsc`/`eslint`, commit, push, PR, merge per standing permission.
   - DONE 2026-08-09 — founder approved the draft above verbatim, footer tagline option A. Applied to `src/routes/index.tsx` and `src/components/site-shell.tsx` exactly as drafted, plus 2 extra mechanism-leak fixes found using the same stated principle (beyond the 3 the founder had already flagged). `tsc`/`eslint` clean. See `PENDING.md` for the full account. Step 4 (homepage rebuild) is now complete on the copy front; the mandatory two-ring hero visual and Surprise Me section were already done earlier in this step.
5. Header and navigation rebuild — 3–4 dropdowns, lazy-loading/performance fix, dark/light mode toggle, wide footer (Sections 12.3–12.5).
   - DONE 2026-08-08 — 4 dropdowns built (Categories, Browse by type, Explore, Company), all on one shared dropdown component instead of duplicated logic. Perf fix: the catalog query is now prefetched once in the root route loader instead of being fetched fresh by the header on every page visit — that per-page-visit client-only fetch was the actual cause of the "slow dropdown" complaint, not the dropdown UI itself. Dark/light toggle (12.3) already existed as a component but was only in the bottom-right floating dock, not the header as the section explicitly requires — moved into the header (desktop + mobile), removed the floating-dock duplicate. Back-to-top button (12.6) turned out to already exist in that same floating dock — confirmed compliant, no work needed there. Footer (12.4) widened to 5 columns including a live "Popular categories" list. Signed-in state gap (logged earlier in PENDING.md) fixed here as instructed — header/mobile menu now show the user's name and a sign-out control when authenticated. Exact dropdown grouping and footer layout are provisional — founder has not yet supplied the reference images for either (12.4/12.5); see PENDING.md.
   - DONE 2026-08-08 — follow-up dropdown/homepage pass (PR #7): fixed the Categories dropdown's positioning (was viewport-fixed/centered, now anchors under its own button like the other 3); Golden Tree section now sits in a full-bleed dark radial backdrop instead of a boxed 16:9 frame, and desktop nodes float/drift gently instead of sitting static; extracted a shared `CategoryBadge` component used in the header dropdown, footer, and Golden Tree nodes. Found `main` had moved ahead with unrelated concurrent theming work (`iv-nav-panel`/`iv-tag-cloud`, a re-tuned tree backing plate) — rebased onto it and reconciled by hand rather than overwriting it; see PENDING.md for the full account.
   - PAUSED 2026-08-08, founder instruction — Golden Tree 3D-rendering/transparency polish. Two rounds of visual iteration on this one element (boxed-frame fix, then a real-alpha mask that shipped a full regression when it hit a cross-origin CORS wall this sandbox couldn't have caught without a live screenshot) proved this sandbox cannot reliably ship pixel-level visual fixes without founder-provided screenshots in the loop. Founder's call: stop here, mark it pending, move on. Current state is the working `mix-blend-mode:screen` fallback (imperfect transparency, but visible everywhere). See PENDING.md for the durable-fix options (real alpha-channel asset, or CORS headers on the image host) — don't reopen this without a screenshot round-trip or explicit founder request.
6. Design system pass — Figma-quality card/visual polish, brand-safety constraint (12.7), image treatment rules (12.8), back-to-top button (12.6).
   - PARTIAL 2026-08-08 (PR #13) — 12.8 (image treatment): blog card thumbnails and the blog detail hero image now get a gradient scrim instead of a raw drop-in, matching the technique already proven in `hero-slider.tsx`. Checked idea cards specifically: `ideas-shared.ts` has no image field at all, so 12.8 doesn't apply to the idea/category grids — nothing to fix there. 12.7 (no repetitive same-size card walls): fixed on the blog index only — the most recent post is now a genuine featured tile instead of one more identical grid cell. 12.6 (back-to-top): already confirmed compliant under Step 5. NOT done: 12.7's broader "Figma-quality... no repetitive same-size card walls" standard has not been applied to the main idea/category browsing grids (still a uniform `grid-cols-2/3` wall of identical `IdeaCard`s) — deliberately deferred, see PENDING.md, since forcing visual variation onto a comparison-heavy browsing UI is a real usability risk that needs founder direction or a screenshot loop, not a guess.
7. Mobile and tablet responsive pass across all templates (Section 12.9).
8. FAQ pool system — bulk-generate category FAQs via n8n/Gemini API, wire the random pull into the idea template and build the standalone FAQ hub template.
9. Random-pull + refresh-variation system — related ideas, related categories, trending carousel, and the per-refresh gradient variation on the idea template (Sections 6.1, 12.2, and 9).
10. Listicle template — highest leverage for both search volume and internal linking.
11. Auto internal linking — max 3 per page, keyword-matched, generated by the same automation pipeline (Section 8.2).
12. Guide, calculator, tools-directory, vertical landing, and comparison templates (Sections 6.7–6.11).
13. Blog template on our own stack.
14. Content pipeline rebuild on Gemini — API key rotation, SEO fields, image SEO/alt text, category-scaling plan, and (if needed) new n8n workflow generation, all per Section 10.
15. Storage strategy decision — confirm what stays in Supabase vs. what moves to Drive/Docs overflow (Section 10).
16. Our own llms.txt, using real numbers only (Section 11).
17. Once everything above is stable: point the custom domain (businessidea.io) at the project and go live.

This is a large list for one month — sequence matters more than ever. Steps 1–3 are foundational and retroactive; get those genuinely solid before fanning out into the rest, since a mistake in schema or the validate button affects every single page on the site.
