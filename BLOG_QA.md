# Blog quality standard

The contract every blog post passes before it reaches the live site. It is not
advice. A post that fails a blocking rule does not publish, however good the
writing is.

`IMAGE_SEO.md` governs the six image fields and is quoted, not rewritten, here.
`CLAUDE.md`'s house rules sit above this file and win any disagreement.

---

## Where a post lives

| Copy | Location | Role |
|---|---|---|
| Live | Supabase `blog_posts` | **The main source.** The site reads this. |
| Mirror | `content/blog/<slug>.md` | The backup. Same post, plain text, owned outright. |

The mirror is written on the same commit that publishes the post. A post in
Supabase with no mirror file is an incomplete publish, not a published post.

If Supabase is ever lost, `npm run blog:restore` rebuilds every row from the
mirror folder, with the same slugs. Search engines see no change, because the
URL is what they hold and the URL comes from the slug.

---

## The two kinds of check

**Machine checks** run in `scripts/blog-qa.mjs`. They are counts, patterns and
lookups. They are exact, they never get tired, and they catch nothing that
requires reading.

**Judgment checks** are done by whoever writes the post, reading it. They are
the ones that matter most, and no script can do them. A fabricated statistic is
well-formed text; it fails no pattern. Only a reader catches it.

A post publishes when both pass. Neither substitutes for the other.

---

## Machine checks — blocking

A post failing any of these does not publish.

| Check | Rule | Why |
|---|---|---|
| Word count | at least 350 words of body text | Below this it cannot answer anything properly |
| Headings | 4 to 7 `<h2>`, no `<h1>` anywhere | The theme renders the title; a second `<h1>` splits the page's topic |
| Heading case | sentence case, no question mark on a label | House style |
| Allowed HTML | only `h2 h3 p ul ol li strong em a` | Anything else is a styling decision the theme should own |
| Unsafe HTML | no `<script>`, `<style>`, `onclick=`, `onerror=` | A blog post is text, not code |
| `title` | 80 characters or fewer | Longer breaks the card layout |
| `meta_description` | 165 characters or fewer | Hard ceiling before it is cut off badly |
| `slug` | unique in `blog_posts` **and** not used by any idea in `ideas` | Two pages on one URL is a lost page |
| `slug` | lowercase, hyphens, no trailing hyphen | It is a URL, permanently |
| Internal link | every `/category/...` href resolves to a real `category_slug` | Fourteen slugs were hand-typed here once and two were wrong. Never again by hand |
| Vendor name | no AI tool or vendor named in the copy | House rule, no exceptions |
| Image fields | all six present and passing `IMAGE_SEO.md` | See the table below |

### The six image fields, from `IMAGE_SEO.md`

| Field | Rule |
|---|---|
| `image_file_name` | at least 5 keywords, lowercase, hyphenated, ends `.webp` |
| `image_alt` | exactly 4 keywords as a real sentence, describing the picture, sharing wording with the focus or supporting keywords, and never the file name repeated |
| `image_focus_keyword` | one phrase |
| `image_keywords` | exactly 3, none of them the focus keyword or the focus keyword reworded |
| `image_long_tail_1`, `_2` | 2 full phrases, different from each other |
| `image_description` | contains the focus keyword word for word |

An alt text that describes a generic desk when the post is about pricing is an
alt text for a different page. It fails.

## Machine checks — warnings

Recorded, shown, and do not block. Holding a good post over six characters
helps nobody, but a warning nobody reads is worse than no warning, so the list
stays short on purpose.

| Check | Comfortable range |
|---|---|
| `seo_title` | 40 to 60 characters. Over 60 is truncated in search results |
| `meta_description` | 120 to 160 characters |
| Excerpt vs meta | must not open with the same words |
| Word count vs target | within 20% of the brief's target |

---

## Judgment checks — blocking, and only a reader can do them

| Check | What it means |
|---|---|
| **No fabricated numbers** | Every figure traces to a real source. If a number cannot be verified, the post describes the shape of it in words instead. A made-up figure is worse than no figure. This is the single most important check in this file. |
| **No invented names** | No category slug, idea title, scheme, statute or organisation that was not confirmed to exist. |
| **Voice** | Reads as one person talking to another. No corporate register, no hype, no motivational-reel tone, no assistant-speak. |
| **Not a template** | If two posts could swap paragraphs without anyone noticing, the writing has failed. |
| **Angle honoured** | The post answers the angle it was briefed on, not a nearby easier question. |
| **Honest about cost** | Where an idea needs money the reader may not have, the post says so in the same paragraph that recommends it. |
| **Reads aloud** | Alt text and headings make sense spoken, not just scanned. |

---

## The mirror file

`content/blog/<slug>.md` — front-matter, then the article.

```markdown
---
slug: how-to-price-a-side-hustle
title: How to price a side hustle when you have no customers yet
seo_title: How to Price a Side Hustle With No Clients Yet
meta_description: ...
excerpt: ...
categories: [part-time-business-ideas]
status: published
published_at: 2026-09-11T00:01:53Z
image_file_name: side-hustle-pricing-first-client-rates.webp
image_alt: Notebook and calculator used to work out side hustle pricing and first client rates.
image_focus_keyword: side hustle pricing
image_keywords: first client rates, freelance day rate, charging without reviews
image_long_tail_1: how to set first client rates for small business
image_long_tail_2: pricing a side hustle with no experience
image_description: ...
---

<h2>...</h2>
```

Rules for the mirror:

- **The slug never changes once published.** Not for a better keyword, not for
  a typo, not ever. The URL is the asset. A rename is a new post plus a
  redirect, and that is a deliberate decision, never a tidy-up.
- One post, one file, one commit. A single post can then be reverted on its own.
- The file is written in the same commit that writes the Supabase row. They do
  not drift because they are never updated apart.

---

## The publish sequence

1. Research the topic. Real sources, or say plainly that a number is unknown.
2. Write the post.
3. `npm run blog:qa <slug>` — fix every blocking failure, look at every warning.
4. Read it. Run the judgment checks above. This step is not optional and not
   delegable to the script.
5. `npm run blog:push <slug>` — writes the Supabase row.
6. Write the mirror file, commit both, push.

A post that stops at step 4 stays a draft. Nothing half-published exists: the
row is written only once the post has passed.

---

## Status values

| `status` | Meaning |
|---|---|
| `draft` | written, not yet passed. Never served to a reader |
| `needs_review` | failed a check. `qa_notes` says which |
| `published` | passed both kinds of check. Live |

The site reads `published` only. A missed check therefore delays a post; it can
never publish a bad one.

---

## What is deliberately not here

- **Keyword density targets.** They produce writing that reads like it was
  written for a crawler, which is the opposite of the point.
- **A readability score.** The voice rules in `CLAUDE.md` say the same thing
  better, and a score can be gamed by shortening sentences that needed length.
- **A plagiarism percentage.** The post is written from research, not rewritten
  from a source, so the number would only ever confirm what the method already
  guarantees.
