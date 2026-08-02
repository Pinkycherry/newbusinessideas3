# Idea Vault AI

IDEAVAULT AI — COMPLETE BUILD BRIEF (START FRESH, READ FULLY FIRST)

WHAT WE'RE BUILDING

A business idea intelligence platform, real, live, production-grade, not a demo. Thousands of business idea "blueprints" organized in a Category → Subcategory → Idea hierarchy, browsable for free or unlocked with a paid Pro Pass, plus a live, real, working AI audit feature that generates a personalized report on any idea on demand. This is not a prototype. Every feature described below must actually function end to end, not just visually exist.

A previous attempt to build this exact platform was made. It hit a long, specific list of real technical failures. Every single one of them is documented below as a rule, precisely so none of them happen again. Read this whole document before writing a single line of code.

STEP ZERO — BEFORE ANY CODE, CONNECT TO THE REAL DATABASE AND PROVE IT

Do this before anything else, and show me proof before continuing to any other step:

Connect to my existing, already-live Supabase project. Do not create a new Supabase project, do not seed fake or sample data, do not scaffold an empty database and call it done.

Once connected, run a real query: SELECT COUNT(*) FROM ideas WHERE status = 'completed'. Tell me the actual number back.

Pull 3 real rows and show me their actual title values.

Only after that number and those real titles are confirmed back to me do we move to any other step.

Why this matters, exact prior failure: a previous attempt spun up a brand-new, empty Supabase project on its own and filled it with 48 invented sample rows, then declared pagination and performance "verified" against that fake data, never touching the real project or its real 32 rows. Every claim of "working" or "verified" from that point on was meaningless, because it was never checked against anything real. Do not repeat this. If you cannot connect to my real project, say so plainly and stop, do not substitute your own data and continue silently.

KNOWN FAILURE MODES FROM A PREVIOUS ATTEMPT — DO NOT REPEAT ANY OF THESE

A previous attempt at this exact build ran into every one of the following, in real production use, not in theory. Each one cost real hours to diagnose. Treat this list as mandatory guardrails, not suggestions.

Building against a fake database instead of the real one. Covered in Step Zero above. This was the single most damaging failure, everything after it was untrustworthy.

Claiming "verified" or "done" with no actual proof. A build compiling successfully, or a database query returning the right shape of result, is not the same as the live site actually working in a browser. A previous attempt repeatedly reported things as fixed based only on a clean build log, then the live site was still broken. Never do this. "Verified" must mean: a real screenshot of the real running page, or a real clickable live link, or a real query result you show me directly. If you cannot produce that proof, say exactly that, do not round up to "done."

A table the frontend code depended on was never actually created in the database. The code queried a lightweight table/view (a grid-optimized version of the main data table with fewer columns, meant for fast card rendering) that was assumed to exist but was never actually created in the real project, causing a hard runtime error: "Could not find the table in the schema cache." If your design calls for a lightweight grid-specific table or view, you must actually create it in the real connected database as part of this same build, and prove it with a real query returning real rows, not just reference it from frontend code and assume it's there.

Environment variables never carrying over between environments automatically. Values configured in one hosting environment do not automatically appear in a separately-deployed environment (e.g. a separate hosting provider connected via GitHub). These must be explicitly set in whichever environment is actually serving the live site, and a deployment must run again after they're set, since build tools typically bake these values in at build time, not at request time. An old deployment built before the correct values existed will keep serving broken behavior no matter how correct the values are afterward.

Multiple stale or leftover credential sets causing confusion. A .env file in the repository referenced an old, no-longer-relevant project's credentials, left over from an earlier, disconnected attempt, while the actual live site ran on a different, correct project entirely. Never trust a credentials file blindly. Always verify which project is actually live by checking real data in it (row counts, real content) against what the live site is actually displaying, not by matching text in a config file alone.

Two different API key formats existing for the same project during a platform transition, causing confusion about which one is "the real one." Both a legacy token-style key and a newer short-form key can be valid for the same project at the same time. Check which format the actual client code expects and use that one, don't assume an older or newer-looking key is wrong just because it looks different from another valid key for the same project.

No way to import an already-existing external code repository into a fresh project. Starting fresh means starting fresh, there is no reliable path to attach a pre-existing external repository to a brand-new project and inherit its code and connections automatically. Build forward from here, don't assume prior code/config carries over unless it was explicitly reconnected in Step Zero.

Every blueprint card rendering full, complete text simultaneously, with no pagination, at heavy visual cost. The homepage and category pages once rendered every single blueprint's complete multi-sentence summary in full, for every row, all at once, each wrapped in an expensive layered glass/blur visual effect applied identically to dozens of cards simultaneously. This was already slow with only a few dozen rows and would be completely unusable at real scale (thousands of rows). This must never happen again, see the Performance section below for the exact required fix.

Raw markdown symbols (like stray backtick characters) leaking directly into visible user-facing text. Any text pulled from stored content and shown to a visitor must be fully cleaned of markdown/formatting artifacts before display, a visitor should never see a stray backtick, asterisk, or pound sign sitting in the middle of a sentence.

Truncated preview text cutting off mid-word. Any shortened/excerpt text shown on a card must always end cleanly at a full word boundary followed by an ellipsis, never mid-word.

Footer and header links existing as visible text but not actually wired to real, working pages. Multiple legal and navigational pages were referenced in the footer without the actual pages existing yet, producing dead links. Every link shown anywhere in navigation must point to a real, built, working page, verified by actually visiting it, not just present in the visual design.

A payment feature existing visually with zero real payment flow behind it. A pricing page rendered correctly and looked complete, but no real checkout ever actually processed a payment. Never present a payment UI as functional unless a real, working checkout flow has been tested end to end.

An "AI audit" feature existing as a route/page with no real backend call wired to it. A feature that is supposed to make a real, live AI call and return a real, generated result must actually do that, verified with a real example output shown as proof, not just a page that exists with the right layout.

Business idea categories and blog content getting conceptually blurred together. These must be two entirely separate systems (see Data Sources section below), never mixed into one navigation concept or one data source.

Hardcoded category lists in navigation instead of reading live from the database. As new category data gets added over time, the site's navigation must reflect it automatically, with zero manual code changes, ever.

Generated business idea content defaulting to generic startup/SaaS language regardless of the actual real-world sector the idea describes, and generated business names following an obviously formulaic pattern (a generic noun plus an overused startup-style suffix) that pattern-matches real existing brand-naming conventions. Content generation logic (if and when it's touched in this build) must adapt its language to the real sector described and avoid templated naming patterns entirely.

Every one of these is a real, specific thing that went wrong, not a hypothetical. Build in a way that makes every one of them structurally impossible, not just individually patched.

VALIDATION CULTURE FOR THIS ENTIRE PROJECT

This applies to every single step from here forward, not just Step Zero:

Never say something is fixed, working, or verified without showing real proof: an actual screenshot of the real rendered page, an actual live clickable link, or an actual query result with real data in it.

If you cannot get real proof (for example, a preview environment isn't loading), say exactly that, plainly, and tell me what you could and could not confirm. Do not round an unverified claim up to a confirmed one.

A successful build/compile is not proof that the live site works. Confirm actual runtime behavior in an actual browser wherever possible.

Always confirm you are working against my real, connected database with real data in it, not a freshly created empty one, at every step where this could possibly be in question.

REFERENCE SITE — STRUCTURE ONLY, NOT A DESIGN TO COPY

I studied https://ideaproof.io for one thing only: the general idea of a deep, well-organized navigation, a categories dropdown in the header, and a full multi-column footer. That's it. I am not copying this site. Its branding, visual design, colors, exact page layout, and content are not mine and must not be replicated. My own visual identity, layout structure, and content are defined in this brief and in the reference images/colors I'm providing separately, and they are different from that site.

CORE VISION

Global/universal in scope for now, not tied to one specific country. A region_tags field is reserved in the data for future geography/demographic filtering, but no filter UI for it should be built yet, just keep the field present and unused.

Two-tier content model, keep these two systems clearly separate:

Tier 1 — static blueprint vault: pre-written idea blueprints stored in the database, browsable free or premium depending on the individual idea.

Tier 2 — live paid AI audit: a "Run AI Audit" action on any idea's detail page that makes a real, live AI call and returns a real, personalized report (market sizing, target customer profile, competitor analysis, a step-by-step go-to-market plan, a confidence score). This must actually work, verified with a real example output, not just exist as a page.

Monetization: a real, working checkout flow for a paid "Pro Pass" that unlocks premium blueprints and/or audit access, with tier upgrades actually reflected in the database after a real successful payment, verified end to end, not just visually present.

DATABASE SCHEMA — 23 COLUMNS, EXACT STRUCTURE

Table ideas:

idea_id               TEXT PRIMARY KEY
category_id           TEXT NOT NULL
category_name         TEXT NOT NULL
category_slug         TEXT NOT NULL
subcategory_id        TEXT NOT NULL
subcategory_name      TEXT NOT NULL
subcategory_slug      TEXT NOT NULL
collection_id         TEXT
status                TEXT NOT NULL DEFAULT 'pending'
focus_keyword         TEXT
additional_keyword_1  TEXT
additional_keyword_2  TEXT
business_description  TEXT
title                 TEXT
slug                  TEXT UNIQUE
summary               TEXT
tags                  JSONB
pros_json             JSONB
cons_json             JSONB
verdict               TEXT
trend_score           INT   (honest range 55-98)
tier                  TEXT DEFAULT 'free'   ('free' or 'premium', premium if trend_score >= 88)
region_tags           JSONB  (nullable, reserved for future use only)
created_at            TIMESTAMPTZ DEFAULT NOW()


Non-negotiable rule for every query touching this table: always filter WHERE status = 'completed'. Rows in any other status must never appear anywhere on the public site.

On the lightweight grid-query concern (see failure #3 above): if you build a separate, lighter-weight table or view for fast grid rendering (selecting only the handful of columns a card actually needs), you must create it for real in the connected database, and prove it works with a real query returning real rows, before wiring frontend code to depend on it.

CATEGORY & SUBCATEGORY LOGIC — FULLY DATA-DRIVEN

No manual per-category page building, ever:

One single dynamic template renders any category page, reading whichever category is requested directly from the real database.

One single dynamic template renders any idea detail page, same principle.

The header's category navigation and any homepage category showcase must both read live from the database, never a hardcoded list. New category data appearing in the database must appear on the live site automatically, with zero manual rebuilding.

Categories or subcategories with zero completed rows should show a clean "coming soon" state, never a broken empty page.

PAGES TO BUILD

Shared header and footer wrap every page.

/ — Home

/category/[category_slug] — category listing

/idea/[category_slug]/[slug] — idea detail/blueprint view

/idea/[category_slug]/[slug]/validate — live AI audit (must be a real, working call, see failure #13)

/pricing — Pro Pass pricing (must have a real, working checkout, see failure #12)

/services — real written explanation of the blueprint vault and the AI audit, not generic template copy

/about — who this is for, what makes this different from generic idea lists

/contact — a working contact form

/blog — blog index, sourced from an external WordPress instance (see Data Sources below), not a new custom blog system

/blog/[slug] — individual blog post, same source

/terms

/privacy

/disclaimer — clear statement that these are research/inspiration blueprints, not financial, legal, or investment advice

/gdpr — data handling and compliance summary

/refund-policy

Every link in the header and footer must point to a real, working page. Verify each one actually loads, don't just include it visually.

HEADER

Logo/wordmark

Categories dropdown/mega-menu, reading live from the database, showing each category's idea count, with a "Browse All Categories" link

Services link

Pricing link

Blog link

Primary CTA: "Get Pro Pass"

FOOTER

Platform: Blueprint Vault (home), Browse Categories, Pricing, Blog Company: About, Contact Legal: Terms & Conditions, Privacy Policy, Disclaimer, GDPR / Data Compliance, Refund Policy, Cookie Policy

Every single link must be real and working, verified, not just visually present (see failure #11).

HOMEPAGE SECTION ORDER

Hero — headline, live stats (pull real numbers from the real database, not invented placeholder numbers), search bar

Browse by Category — a visual showcase, each category as its own card with an icon, name, and real idea count, linking into that category

Trending Blueprints — a short highlighted strip of standout ideas, short teaser text only (never the full summary, see Performance section), linking to full detail pages

How It Works — a simple three-step explainer: Browse a category → Read the blueprint → Run a live AI audit

Full Vault Grid — the complete paginated grid of all blueprints (see Performance section for exact requirements)

CTA Banner linking to Pricing

Footer

VISUAL IDENTITY — COLORS AND REFERENCE IMAGES COME SEPARATELY

My exact color palette and reference mood images will be provided as a separate addition after this brief, attached directly. Do not assume, invent, or default to any specific hex codes, gradient, or default framework color palette until that's provided.

What I can tell you now, independent of exact colors:

A premium, dark, glass-panel aesthetic: translucent card surfaces with a clearly visible thin light border, generous rounded corners, soft outer shadow for lift, genuine depth and layering, not flat design anywhere.

Real hover behavior on every interactive element: cards, buttons, and links should all have a deliberate, smooth hover response (subtle lift, glow, or highlight), not static, dead-feeling elements.

A layout structure with mixed card sizes in key sections (a row of small stat cards, one larger panel, one distinct featured/highlight card), not a uniform grid everywhere. Reserve the uniform, lightweight grid style specifically for the dense full vault view (see Performance section).

Premium, intentional typography, a real chosen typeface with character, not a default system font.

Written content throughout the site (page copy, descriptions, explanations) must read like it was written by a real person with a real voice, never like generic templated or obviously AI-boilerplate copy.

PERFORMANCE REQUIREMENTS — CRITICAL, NON-NEGOTIABLE

This is the single most important technical requirement, directly tied to failure #8 above:

Card previews only, everywhere there's a grid: title, business name, tier badge, trend score, a short excerpt of the summary (ending cleanly at a full word, never mid-word, see failure #10), and no more than 3 tags. Never show full summary, full pros/cons, or full verdict text on a grid card, that belongs only on the idea's own detail page.

Paginate, never render everything at once: load an initial 12-16 cards, then a "load more" or infinite scroll fetching the next batch. Applies to the homepage grid and every category page.

Virtualize the grid so cards outside the visible viewport aren't mounted or painted at all.

Lighten the glass/blur effect specifically on dense grid views. Reserve the full rich glass treatment for the hero, category showcase, trending strip, and CTA sections, a handful of elements at most. The dense full vault grid should use a lighter, cheaper visual treatment so dozens of cards don't each carry an expensive blur effect simultaneously.

Query hygiene: grid views must only fetch the specific columns they need, never the full row, and must use real pagination at the database level, not fetch everything and slice it in the browser.

Text sanitization: any content pulled from the database and shown to a visitor must be stripped of raw markdown artifacts before display (see failure #9).

Every query must still respect WHERE status = 'completed'.

DATA SOURCES — TWO COMPLETELY SEPARATE SYSTEMS

The business idea directory (all categories, subcategories, blueprint data) comes entirely from my connected Supabase database. Every category page, the category navigation, and the full vault grid all read live from it.

Blog content comes from a separate external WordPress instance, not from Supabase and not from a new custom-built blog system. Build the blog pages to fetch published posts from that WordPress site's API and display them inside this site's own visual design, so it feels native even though the content is sourced externally.

If the WordPress connection is ever slow or unavailable, that must never block or break the rest of the site. The idea directory must keep working completely independently of blog/WordPress status.

Never blur these two systems into one navigation concept or one data source (see failure #14).

SEO REQUIREMENTS

Every idea page needs a dynamic page title and meta description built from the idea's focus keyword and additional keywords, not generic boilerplate.

Proper heading hierarchy on every idea page: one H1 (the idea title), H2s for summary, pros/cons, and verdict sections.

A dynamic sitemap covering all completed idea pages and category pages.

Fast loading is itself part of SEO, directly tied to the Performance section above.

WHAT NOT TO DO

Do not invent colors, brand name, or logo, that comes separately (see Visual Identity section).

Do not build a region/country filter UI, the region_tags field is reserved only.

Do not build a new custom blog/CMS system, blog content comes from WordPress.

Do not hardcode any category or subcategory list anywhere.

Do not create a new/empty database or seed fake sample data, connect to and verify against the real one first (see Step Zero).

Do not claim anything is fixed, working, or verified without real proof (see Validation Culture section).

Do not present payment or AI-audit features as functional unless they are genuinely, actually working end to end.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://newbusinessideas3.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/34db85a7-5f81-41f9-ab09-f0125616be27).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
