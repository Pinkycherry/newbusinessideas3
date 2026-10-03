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
  plus one or two in-body images. At least one of the in-body images should
  be an infographic wherever the article has something tabular or
  sequential to show (a cost tier, a comparison, a step sequence) — this is
  new for batch 2; the first 23 posts didn't carry images at all.
- Images are supplied by the founder after the article text is approved.
  The article draft should flag exactly where each image slot goes and what
  it needs to show, the same way `PROJECT_BRIEF.md` requires for every other
  template on this site.

## The Validate button — every post needs this, phrased without naming the mechanism

Per idea discussed, close with a line that points at BBI's free Validate
feature for that idea's `/idea/$slug` page — never explaining the mechanism
(no "paste this into an AI chat," no naming Claude/Gemini/Perplexity/Grok).
Keep it the way the first two posts did it: a short, plain sentence that the
next real step is to validate the specific idea for free on its own page.

## Minimum length and variation

- **2,000 words minimum per post**, never 800–1,000.
- **Vary the word count across a batch** — if every post lands at exactly
  2,400 words, that's its own tell. A reasonable batch-2 spread is roughly
  2,000–4,200, genuinely driven by how much the topic needs, not padded.

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
