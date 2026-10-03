# Content scheduling plan — proposal, not yet built

Written 2026-10-03 in response to the founder's explicit ask: schedule
batch-2 blog posts and the new startup-guides batch on fixed daily slots,
at most 3 blog posts a day (varying — not every day the same count),
guides on their own separate daily slot, with real non-round clock times
he supplies — and critically, running **outside this chat session**, so it
never depends on his laptop being on or on him remembering to ping Claude.

Nothing below is implemented yet. This is the plan to approve before
building it, per the founder's own instruction.

## The mechanism: a future date, read at request time — not a cron job

The safest place to schedule this is the data itself, not a bot. Both
`blog_posts` (Supabase) and the startup guides (bundled TypeScript) already
carry a publish-date field; neither currently gates visibility by it. Add
that one gate, and "scheduling" a piece becomes: set its publish date to a
future timestamp now, and the site itself won't show it until that moment
arrives, because every page load re-evaluates "is this date in the past"
against the server's own clock at request time. No external trigger of any
kind has to fire.

**Why not pg_cron or a GitHub Actions cron instead:** checked this
Supabase project directly — neither `pg_cron` nor `pg_net` is enabled, so
either option would mean turning on a new extension or spending GitHub
Actions minutes for something a single `WHERE` clause already does. The
date-gate approach needs zero new infrastructure, no extension, no
scheduled job to monitor for silent failures, and nothing to re-authorize
later. It is strictly simpler and safer, so it's the recommendation.

### For blog posts — Supabase, one small code change

`blog_posts` already has `published_at`. Today, `fetchPosts()` and
`fetchPostBySlug()` in `src/lib/blog.server.ts`, and
`fetchBlogPostsForSitemap()` / `fetchBlogPostsForHub()` in
`src/lib/sitemap.server.ts`, filter only on `status = 'published'` — a row
with a future `published_at` would show up immediately, which is the one
gap to close. The fix is additive: add
`.lte("published_at", new Date().toISOString())` to those four queries.
After that:

- Insert all 20 batch-2 rows into `blog_posts` any time, `status =
  'published'`, each with its real future `published_at` timestamp from the
  schedule below.
- Each one goes live automatically, on its own, the moment that timestamp
  passes. Nothing to trigger.
- The sitemap already recomputes its `lastmod` from live `blog_posts` data
  (shipped this session) — a newly-live post appears in `/sitemap-blog.xml`
  and the human `/sitemap` page on its own next crawl, same as always.

### For startup guides — bundled code, so the whole batch deploys once

Guides are a hardcoded array (`STARTUP_GUIDES` in `src/lib/guides-data.ts`)
compiled into the site, not rows read live from a database — a genuinely
different mechanism from blog posts, worth being explicit about. The
closest equivalent:

- Add a `publishedAt: string` (ISO timestamp) field to `StartupGuideMeta`
  and to all 40 entries (20 existing + 20 new) — existing 20 get a past
  date so nothing about them changes.
- Add one helper, `publishedGuides()`, returning only entries whose
  `publishedAt` has passed, and point every consumer at it instead of the
  raw array: `startup-guides.index.tsx`, `startup-guides.$slug.tsx` (so a
  direct link 404s before its time, not just hides from the index),
  `sitemap-pages[.]xml.ts`, `sitemap.tsx`, and `learning-resources.index.tsx`.
- All 20 new guide files, with their metadata, get written and deployed
  **once**, up front, each carrying its real future `publishedAt`. No
  further deploys are needed afterward — the gate alone controls when each
  one becomes visible, the same way the blog's `published_at` gate does.

This is the one place where "schedule it outside the ecosystem" needs a
single deploy to set up, because guides live in the deployed bundle rather
than a live database. After that one deploy, it behaves identically to the
blog's mechanism: nothing to trigger, nothing to remember.

## The daily shape, as described

- Blog: **at most 3 a day, varying** (1, 2, or 3) — not a fixed daily count,
  since a fixed count is its own kind of pattern. Three named slots a day:
  morning, afternoon, night.
- Guides: their **own** daily slot, separate from the blog's three, running
  independently.
- **All times non-round** — no `9:00`, no `10:00`. Exact clock times are the
  founder's to set; the layout below uses slot names as placeholders.

## Proposed 20-day blog schedule (slots to be filled with real times)

Daily count varies on purpose — 2, 3, 1, 3, 2, 3, 1, 2, 3 across 9 days,
never a flat 3-a-day:

| Day | Count | Morning | Afternoon | Night |
|---|---|---|---|---|
| 1 | 2 | Row 1 — low investment ideas by budget | — | Row 2 — agriculture by land size |
| 2 | 3 | Row 3 — AI business ideas, 2026 | Row 4 — real cost by category | Row 5 — fintech licensing |
| 3 | 1 | — | Row 6 — how to validate for free | — |
| 4 | 3 | Row 7 — which ideas need a license | Row 8 — SaaS with no funding | Row 9 — dropshipping vs private label vs reselling |
| 5 | 2 | Row 10 — seasonal/festival ideas | — | Row 11 — complete beginners |
| 6 | 3 | Row 12 — fitness certification | Row 13 — recession-proof ideas | Row 14 — ideas for students |
| 7 | 1 | — | — | Row 15 — ideas for retirees |
| 8 | 2 | — | Row 16 — creator ideas, small audience | Row 17 — edtech myths |
| 9 | 3 | Row 18 — start this weekend | Row 19 — run from your phone | Row 20 — productivity + calculator |

## Proposed 20-day guide schedule (own slot, separate from the blog's three)

One a day for 20 days, same row order as `STARTUP_GUIDES_BATCH_2_TOPICS.md`
— day 1 is guide row 1, day 2 is guide row 2, and so on through day 20.
Runs on its own daily "guide slot" at a different time than any of the
blog's three — independent calendars, so a guide and a blog post can land
on the same real-world day without colliding.

## What's still needed before this gets built

1. **The real clock times** for morning / afternoon / night (blog) and the
   guide slot — all non-round, founder's call entirely.
2. **Confirm the guide cadence** — this plan assumes 1 a day for 20 days;
   say so if a different count or a varying count (like the blog's 1–3) is
   wanted instead.
3. **Approval to implement** the two code changes above (the `published_at`
   filter on the 4 blog queries; the `publishedAt` field + `publishedGuides()`
   helper + 5 consumer updates for guides) — both are additive, no existing
   row or guide changes behavior, but they're still real code changes on
   files several routes depend on, so they wait for a yes rather than
   shipping speculatively.
