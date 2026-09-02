# FAQ pool — what the pipeline has to do

Written 2026-08-25. This is the one thing standing between the FAQ hub and
real content.

## The problem it solves

`PROJECT_BRIEF.md` §6.5 states it directly: "we have 300 existing ideas with
no FAQs". Verified against the live database on 2026-08-25 and it is total:

| Check | Result |
|---|---|
| completed ideas | 290 |
| `faq_json` is a JSON array | **0** |
| `faq_json` is NULL | 283 |
| `faq_json` is a bare string (malformed) | 7 |

So the FAQ section on every idea page renders empty today, and there is no
content anywhere to build a hub from.

§6.5's answer is deliberately NOT per-idea FAQs — writing 290 sets by hand is
too slow and unnecessary. It is a pool of 10–15 questions **per category**,
from which each page pulls a random handful at render time. Fill 14 pools and
all 290 existing ideas are covered at once, and every future idea inherits its
category's pool with no extra work.

## What already exists

Applied as migration `add_category_faq_pool`. Additive only — `ideas` was not
read, altered or dropped, and is still at 290 rows.

```sql
public.category_faqs
  id            uuid primary key default gen_random_uuid()
  category_slug text        not null
  question      text        not null
  answer        text        not null
  is_active     boolean     not null default true
  created_at    timestamptz not null default now()
  updated_at    timestamptz not null default now()
  unique (category_slug, question)
```

RLS: public `SELECT` where `is_active`. Writes are service-role only — nothing
in the browser can insert.

Two functions, both `stable`, both granted to `anon` and `authenticated`:

- `get_random_category_faqs(cat_slug text, lim int)` — `ORDER BY random()
  LIMIT n` at the query level, per §9. Pass `null` for `cat_slug` to draw from
  every category.
- `get_category_faq_counts()` — `(category_slug, faq_count)`, so a page can
  tell "this pool is empty" apart from "the query failed".

## What has to run

Roughly 10–15 questions per category across 14 categories — about 150–210
rows. One bulk Gemini job through the existing n8n pipeline. Per the standing
rule: **edit the existing workflow, do not generate a duplicate one.**

The insert shape:

```sql
insert into public.category_faqs (category_slug, question, answer)
values
  ('side-hustle-ideas',
   'How much time does a side hustle actually need each week?',
   '...'),
  ('side-hustle-ideas',
   '...',
   '...')
on conflict (category_slug, question) do update
  set answer = excluded.answer,
      updated_at = now();
```

The `on conflict` clause is why the unique constraint exists: re-running the
job updates answers in place instead of duplicating the pool.

The 14 live category slugs, with their real idea counts as of 2026-08-25:

| slug | ideas |
|---|---|
| `side-hustle-ideas` | 50 |
| `work-from-home-business-ideas` | 50 |
| `zero-investment-business-ideas` | 50 |
| `passive-income-business-ideas` | 35 |
| `low-investment-business-ideas` | 25 |
| `ai-automation` | 10 |
| `creator-media` | 10 |
| `e-commerce-retail` | 10 |
| `education-edtech` | 10 |
| `fintech-finance` | 10 |
| `health-fitness` | 10 |
| `tech-saas` | 10 |
| `business-ideas-that-never-go-out-of-style` | 6 |
| `productivity-workflow` | 4 |

Pull the current list from `getCatalog()` rather than pasting this table into
a workflow — it will drift as categories are added.

## Rules the generated content must follow

These are project-wide and non-negotiable, not suggestions for this job:

- **No fabricated statistics.** No invented market sizes, earnings figures,
  user counts, growth rates or survey results. If a question cannot be
  answered without a number nobody has measured, it is the wrong question.
- **Never name the validation mechanism.** No mention of Claude, Perplexity,
  ChatGPT, Grok, "your own account", or how the handoff works. This has had to
  be stripped from twelve files already.
- **Zero emojis**, in questions and answers alike.
- **India-first.** Rupees, Indian regulations, Indian platforms and Indian
  market conditions — not a US framing translated.
- **BBI's voice**: plain, direct, sixth-to-seventh-grade English. The tone of
  a straight-talking older brother, not a brochure. `src/routes/about.tsx` is
  the reference.
- Questions should be ones a real person would type into a search box, since
  these pages exist to be found.

## After it runs

Nothing to deploy. The hub, the counts and the schema all read from the table
at request time, so the pages light up as soon as the rows land. Confirm with:

```sql
select category_slug, count(*) from category_faqs where is_active group by 1 order by 2 desc;
```
