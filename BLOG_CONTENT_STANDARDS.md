# Blog content standards — batch 2 and onward

The 20 approved article assignments for batch 2 — titles, slugs, focus and
additional keywords, format, and word-count floor — live in
`BLOG_BATCH_2_TOPICS.md`. This file is the rules; that file is the list.

Read this before writing or publishing any blog post. It exists because the
Voice DNA rules and the image-SEO rules were previously only stated in chat
and in a repo file that got deleted — nothing written down survives a new
session. This file is now the durable copy. If a future session can't find
it, re-point here from CLAUDE.md rather than re-deriving these rules from
scratch.

## Where the 23 live posts actually stand (checked 2026-10-03)

`blog_posts` in Supabase has 23 published rows in two visibly different
batches:

- **IDs 18–31** (14 posts) — single-idea narrative deep-dives with
  story-driven titles ("The Packing Error That Ends a Subscription Box
  Company"). Not written by this session.
- **IDs 32–40** (9 posts) — the "50 real `<category>` ideas" listicle
  pattern, covering 9 of the 20 real categories. Only 2 of these 9
  (`50-untold-work-from-home-business-ideas`,
  `flexible-business-ideas-for-women`) have a repo mirror under
  `content/blog/`. The other 21 posts across both batches exist in Supabase
  only — no git backup. Not fixed in this pass; worth closing later so a
  Supabase mistake can't lose published work with no recovery copy.

Real category inventory (from `ideas`, `status = 'completed'`), for
grounding any future topic choice — never invent a category name or count:

| Category | Ideas | Has a blog post? |
|---|---|---|
| Low Investment Business Ideas | 75 | No |
| Business Ideas for Women | 50 | Yes |
| AI & Automation | 50 | No |
| Online Business Ideas | 50 | Yes |
| Agriculture & Farming Business Ideas | 50 | No |
| Side Hustle Ideas | 50 | Yes |
| Small Town Business Ideas | 50 | Yes |
| Passive Income Business Ideas | 50 | Yes |
| Work From Home Business Ideas | 50 | Yes |
| Zero Investment Business Ideas | 50 | Yes |
| Part Time Business Ideas | 50 | Yes |
| Village Business Ideas | 30 | Yes |
| Business Ideas That Never Go Out of Style | 10 | Partial (narrative only) |
| Creator & Media | 10 | No |
| Tech & SaaS | 10 | No |
| Education & EdTech | 10 | No |
| FinTech & Finance | 10 | No |
| E-Commerce & Retail | 10 | No |
| Health & Fitness | 10 | No |
| Productivity & Workflow | 4 | No |

A category with only 10 (or 4) real ideas cannot carry a "50 ideas" post —
don't force one. Write a curated 8–12 item piece, or a narrative/trend/guide
format instead. Never pad a short category out to a fake round number.

## The rule that started this file: stop templating

Two patterns already exist (narrative deep-dive, 50-idea listicle). A third
run of either, used again and again, is what the founder flagged as looking
like an AI content factory. From batch 2 onward:

- **No two articles in the same batch share a structural pattern.** Pick
  from (or invent a new) format per article: investment-tier breakdown,
  trend/state-of-the-category report, regional or seasonal guide, narrative
  founder-style deep-dive, myth-vs-reality teardown, decision matrix /
  comparison table, compliance-and-licensing deep-dive, audience-segment
  curation (students, retirees, parents...), cost-benchmark data piece,
  cornerstone/pillar guide.
- **Tone varies with format.** A compliance deep-dive reads differently from
  a myth-vs-reality teardown. Don't flatten every article into the same
  cadence just because the Voice DNA rules below apply to all of them —
  those rules govern grammar and banned patterns, not personality.
- **Every post still obeys the house rules in `CLAUDE.md`:** zero fabricated
  numbers, never invent a category slug/idea title/statistic, never name an
  AI vendor in public copy.

## Voice DNA — binding on every sentence, every post

This was given once in chat and must not be re-derived from memory or
drift over time. It overrides any default AI writing style.

**Never:**
- Em dashes (—) or double-hyphens (--) anywhere. Use a colon, comma,
  period, or a standard hyphen.
- Negative-parallelism / reframe constructions — **the single most severe
  violation.** Banned shapes: "Not X. Y." / "X isn't about Y, it's about
  Z." / any concession-then-pivot sentence disguising the same move. Scan
  for this explicitly before publishing; it is the pattern most likely to
  slip back in during edits.
- Banned vocabulary: delve, leverage (as a verb), effortless, seamless,
  robust, crucial, holistic, and the rest of the standard AI-tell list —
  treat any word that reads like SaaS marketing copy as suspect.
- Banned phrases: meta-commentary about the writing itself, "it's important
  to note," "nobody" as a sentence opener, and any other line that explains
  what the text is doing instead of just doing it.
- Title Case headers. Headers are sentence case.
- Emojis.

**Always:**
- Contractions. Direct "I"/"you" address.
- Short paragraphs: 3–4 sentences by default, 4 max.
- Long paragraphs (when the content needs one): 6–7 sentences, 7 max.
- Specific, checkable detail over a vague claim.

Run a pattern scan (grep for em dashes, the banned-word list, and sentences
starting with "Not " followed by a period-then-pivot) before calling any
draft final. This session caught and fixed violations it had itself
introduced, more than once, on the first two posts — assume a first draft
has at least one and check.

## SEO package — every post needs all of this, none of it invented

- **Focus keyword**: one, used naturally in the SEO title, the first 100
  words, at least one `<h2>`, and the meta description.
- **Additional keywords**: 5–6 minimum, each grammatically complete (never a
  stuffed fragment), spread naturally through body copy and subheadings.
  Keyword density target ~1.5–2% across the piece — never stuffed, never
  forced into a sentence that wouldn't otherwise exist.
- **SEO title**: the actual `<title>` / card headline, front-loads the focus
  keyword, no year baked in unless the article is genuinely time-bound.
- **Meta description**: 140–160 characters, focus keyword once, honest,
  click-worthy — never a claim the article doesn't back up.
- **Slug**: 3–6 words, no stuffing, derived from the title, never hand-typed
  without checking it matches the real title (two broken hand-typed slugs
  have already shipped in this project — always generate the slug from the
  confirmed title, don't type it separately).

## Image SEO — this is the content that was in the deleted file

Every image reference, whether supplied by the founder or described for one
he needs to generate, needs:

- **Alt text** that names the brand, the image's role or position on the
  page (e.g. "featured image," "infographic: cost breakdown by tier"), and
  a genuinely descriptive caption of what's actually in the frame. Never a
  generic filename, never a blank `alt`.
- **2–3 images per post minimum** for this batch: one featured/hero image,
  plus one or two in-body images. At least one of the in-body slots should
  be an infographic wherever the article has something tabular or
  sequential to show (a cost tier, a comparison, a step sequence) — this is
  new for batch 2; the first 23 posts didn't carry images at all. An
  infographic slot can be filled either way: a founder-supplied image (alt
  text per the rules above), or one of the live `data-embed="infographic"`
  blocks in "Dynamic content blocks" below, which renders from real data
  instead of a static picture. Prefer the live one when the data is
  genuinely tabular — a real rendered bar/grid beats a flat image of one.
- Images are supplied by the founder after the article text is approved.
  The article draft should flag exactly where each image slot goes and what
  it needs to show, the same way `PROJECT_BRIEF.md` requires for every other
  template on this site.

## Dynamic content blocks — how a post stops being plain text

Added 2026-10-03 after the founder pointed out that a 500-word article, a
hand-drawn infographic, and a live calculator all have to fit through the
same pipe as a 50-item listicle, and a sanitizer that only ever strips tags
can't also add icons, embed a real calculator, or drop a Validate button in
exactly where the text needs it. `blog.$slug.tsx` now renders through
`BlogRichBlock` (`src/components/blog-embeds.tsx`) instead of a single
`dangerouslySetInnerHTML` call, so a post's own HTML can contain markers
that get swapped for real, live site components at render time — not a
description of a widget, the actual widget.

`sanitizeHtml()` in `blog-shared.ts` already lets `<div>` and every `data-*`
attribute through untouched (it only ever strips `script/style/iframe/…`,
event handlers, and `class`/`style`/`id`), so none of this needed the
sanitizer relaxed. Write these markers directly into the article's HTML,
exactly as shown, as a bare empty `<div>` — no nested content inside it:

- **Validate button**, inline, wherever an idea is discussed:
  `<div data-embed="validate" data-idea-slug="SLUG"></div>` — renders the
  real `ValidateButton` component from the idea page, not a link to it. One
  per idea discussed is normal; don't stack several in a row.
- **Live calculator**, inline, wherever a number the reader could plug in
  comes up: `<div data-embed="calculator" data-calc-slug="SLUG"></div>` —
  renders the actual form-and-results widget from `/calculator/$slug`
  (same component, same arithmetic, just embedded). `SLUG` must be a real
  slug from `CALCULATORS` in `src/lib/calculators.ts` — check it resolves
  before using it; an unknown slug renders nothing rather than erroring the
  page, which means a typo here fails silently, so verify it.
- **Infographic**, wherever the article has something tabular or sequential
  to show: `<div data-embed="infographic" data-kind="tiers" data-json="..."></div>`
  for a ranked bar breakdown (cost tiers, investment bands — `data-json` is
  `{"title": "...", "rows": [{"label": "...", "value": 5000, "note": "..."}]}`),
  or `data-kind="comparison"` for a side-by-side grid (`{"title": "...",
  "columns": ["A", "B"], "rows": [{"label": "...", "cells": ["x", "y"]}]}`).
  `value` in a tiers row must be a real number from the article's own
  research, never an invented one — this is still content, the zero
  fabricated numbers rule still applies to it. The JSON goes inside the
  `data-json` attribute with its own quotes written as `&quot;` (standard
  HTML attribute escaping — write it as valid JSON first, then escape the
  double quotes when placing it in the attribute).
- **Icon bullet lists**: `<ul data-icon="check">...</ul>` (also `money`,
  `warning`, `clock`) — a plain colored-dot marker per `src/blog-content.css`,
  not a stock icon pack and not an emoji, so it stays inside the house
  rules while reading as more deliberate than a bare disc bullet.
- **Styled tables**: `<table data-style="tiers">...</table>` or
  `data-style="comparison"` — same table markup as always, just gets a
  header accent so a cost-tier table and a plain reference table don't look
  identical.

None of this is optional ornamentation to skip under time pressure — it's
the actual answer to "how does a 500-word post or a hand-written
infographic fit this template": it fits by using these markers inline,
exactly where the text calls for them, in a post of any length. A short
post uses fewer of them; a long one can use several. What never changes is
that each marker is a bare, self-closing-shaped `<div>` with no content
inside it — nesting real HTML inside one will not render, since the
renderer only recognizes the empty-marker shape.

## The Validate button — every idea discussed needs one, phrased without naming the mechanism

Use the inline embed above, not a plain sentence, wherever an idea is
actually named and discussed. Never explain the mechanism in body copy (no
"paste this into an AI chat," no naming Claude/Gemini/Perplexity/Grok) —
the embedded button's own copy already handles that correctly on its own.

## Minimum length and variation

- **2,000 words minimum per post**, never 800–1,000.
- **Vary the word count across a batch, and don't let the variation itself
  look engineered.** `BLOG_BATCH_2_TOPICS.md`'s floors range roughly
  2,020–3,480 — picked per-topic, not stepped down the list by a round
  number. A batch where every floor is a multiple of 50 or decreases by the
  same amount row after row is its own tell, exactly like a shared word
  count would be. When adding a batch 3, generate floors the same way:
  judge each topic on its own, not by a formula applied to the row above it.

## Publishing: repo + Supabase, every time

Mirrors the pattern already set by the first two batch-1 posts and by
`content/guides/`:

1. Write the body as plain semantic HTML (no `<h1>`, no `class`/`style`/`id`
   attributes — `sanitizeHtml()` in `src/lib/blog-shared.ts` strips those on
   the way out, so hand-authored markup should already assume they're
   gone).
2. Save it to `content/blog/<slug>.html` plus a `content/blog/<slug>.meta.json`
   sidecar (slug, title, excerpt, meta_description, categories, focus
   keyword, additional keywords, author, status, image slots). This repo
   copy is a version-controlled backup; the live `/blog` route reads
   Supabase only (`src/lib/blog.server.ts`), by design.
3. Insert the row into Supabase `blog_posts` directly
   (`mcp__Supabase__execute_sql`), `status = 'published'` only once the
   founder has actually approved the content — this is a new row, not a
   mutation of an existing one, so it doesn't trigger the
   never-mutate-without-asking rule, but a status flip on an existing row
   does.
4. The sitemap picks it up automatically — `fetchBlogPostsForSitemap()` and
   `fetchBlogPostsForHub()` in `src/lib/sitemap.server.ts` read `blog_posts`
   live, so a new published row appears in `/sitemap-blog.xml`,
   `/sitemap-index.xml`'s `lastmod`, and the human-readable `/sitemap` page
   on its own. Nothing else needs editing for indexing.

## Daily cadence — what "don't skip a day" actually requires

- One post published per day means one full pass through the publishing
  steps above per day, not just a draft sitting in chat.
- Because the sitemap is already live-data-driven (see above), there is no
  separate "remember to add it to the sitemap" step — publishing the
  Supabase row is the only action that matters for discoverability.
- Google Search Console needs no manual per-post submission. `sitemap-index.xml`
  is already submitted; its `lastmod` moves every time a post publishes,
  which is what tells Google to re-read `sitemap-blog.xml` for the new URL.
