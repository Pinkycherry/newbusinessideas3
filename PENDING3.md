# PENDING3 — sample vs real data register

**Purpose:** one place to see, per surface, whether what a visitor sees is real
or standing in, and exactly where the content comes from. When real content
replaces a placeholder, change that row's status here in the same commit.

**How to read the status column**

| Status | Meaning |
|---|---|
| **LIVE** | Real content, from a real source, correct today. Nothing to do. |
| **PARTIAL** | Real source, real content, but incomplete — some rows or fields empty. |
| **SAMPLE** | Hand-written placeholder standing in for content that does not exist yet. |
| **ORPHAN** | Data exists in Supabase but nothing on the site reads it. |
| **MISSING** | Specified in PROJECT_BRIEF.md, does not exist in any form. |

Last verified against the live database and the working tree: **2026-09-13**.
All counts below were queried, not estimated.

---

## 1. Supabase tables

| Table | Rows | Read by the site? | Status | Source of the data | Replace with |
|---|---|---|---|---|---|
| `ideas` | 290 | Yes — `ideas.functions.ts`, 5 files | **PARTIAL** | n8n pipeline → Supabase | See §2 — 13 of 31 columns are empty on 282 rows |
| `category_faqs` | 84 | Yes — `faqs.functions.ts` via RPC | **LIVE** | Written by hand, 2026-09-13, 6 per category × 14 | Nothing. Real content. |
| `blog_posts` | 4 | No — blog reads WordPress instead | **ORPHAN** | Unknown, predates this register | Decide: wire it, or drop the table |
| `idea_research` | 72 | **No — 0 references in `src/`** | **ORPHAN** | Earlier research run, never wired | Decide: surface on idea pages, or drop |
| `market_pulse` | 0 | No — 0 references | **MISSING** | Never populated | Decide whether this concept survives |
| `testimonials` | 0 | No — 0 references | **MISSING** | Never populated | Real testimonials only. Never invent these. |
| `site_copy` | 0 | No — 0 references | **MISSING** | Never populated | Would replace hardcoded homepage copy (§3) |
| `newsletter_signups` | — | Write-only | **LIVE** | Visitor submissions | Nothing |
| `profiles` | — | Auth | **LIVE** | Supabase auth | Nothing |

---

## 2. `ideas` table — column-level gaps

The row count is not the problem. **13 columns are empty on 282 of 290 rows.**
Verified by query on 2026-09-13.

| Column | Filled | Status | Notes |
|---|---|---|---|
| `title`, `slug`, `summary`, `business_description` | 290 | **LIVE** | — |
| `verdict` | 290 | **LIVE** | The founder-fit answer. Complete. |
| `pros_json`, `cons_json` | 290 | **LIVE** | — |
| `trend_score`, `tier`, `created_at` | 290 | **LIVE** | No `updated_at` column exists |
| `target_customer` — *who pays you* | **8** | **PARTIAL** | Core promise #1. Missing on 282. |
| `how_you_make_money` — *how money works* | **8** | **PARTIAL** | Core promise #2. Missing on 282. |
| `market_opportunity` | 8 | **PARTIAL** | — |
| `competition_edge` | 8 | **PARTIAL** | — |
| `getting_started_steps` | 8 | **PARTIAL** | Would drive `HowTo` schema |
| `tools_needed` | 8 | **PARTIAL** | — |
| `startup_cost` | 8 | **PARTIAL** | **Money figure — real research only** |
| `income_potential` | 8 | **PARTIAL** | **Money figure — real research only** |
| `time_to_first_customer` | 8 | **PARTIAL** | — |
| `faq_json` | 8 | **PARTIAL** | Covered meanwhile by `category_faqs` fallback |
| `external_links` | 8 | **PARTIAL** | Citation source for E-E-A-T |
| `research_facts` | **7** | **PARTIAL** | — |
| `seo_title`, `meta_description` | **7** | **PARTIAL** | Falls back to generated title today |

**Source to fill these:** n8n pipeline + Gemini API (founder-owned keys).
**Not to be written by hand, and never estimated** — `startup_cost`,
`income_potential` and `time_to_first_customer` are figures a reader may spend
savings against.

### Taxonomy defect — decide before templates

`subcategory_slug` has **290 distinct values across 290 ideas**. Average 1.00
ideas per subcategory; **zero** subcategories contain more than one idea. So
`/category/[slug]/[subcategory]` can only ever show a single idea. The route
exists and renders. The data makes it meaningless.

`status` is `'completed'` on all 290 rows, including the 282 missing 13 fields.
The pipeline cannot tell finished rows from unfinished ones.

---

## 3. Hardcoded content in the codebase

Real, deliberate, and edited by hand — but not coming from a database, so it
does not change without a deploy.

| Surface | File | Status | Source | Replace with |
|---|---|---|---|---|
| Homepage sections | `src/routes/index.tsx` | **SAMPLE** | 8 hardcoded arrays: `FAQS`, `HERO_PANELS`, `BBI_US`, `BBI_THEM`, `BBI_HOW_STEPS`, `BBI_FUTURE_TERMS`, tree image consts | Founder-written copy, or `site_copy` table |
| Header "Collections" menu | `src/config/collections.ts` | **SAMPLE** | 5 labels, **all pointing at `/browse`** — none deep-link | Real filtered URLs per collection |
| Featured blueprints strip | `src/config/featured.ts` | **LIVE** | 3 real `idea_id`s; unknown ids are skipped, never faked | Nothing — edit the array to change picks |
| Photography | `src/config/imagery.ts` | **LIVE** | `ethicalfounder.com` WordPress library, real URLs | Nothing |
| Category imagery | `src/config/category-imagery.ts` | **LIVE** | Real files under `public/images/categories/` | Nothing |
| Calculators (31 entries) | `src/lib/calculators.ts` | **LIVE** | Hand-written formulas, run client-side, rupees | Nothing — formulas are the content |
| Pricing page | `src/routes/pricing.tsx` | **SAMPLE** | 1 hardcoded array | Confirm real prices before launch |
| Services page | `src/routes/services.tsx` | **SAMPLE** | 1 hardcoded array | Founder-confirmed services |
| Vertical landing pages | `src/routes/validate.$industrySlug.tsx` | **SAMPLE** | 1 hardcoded array + reads `ideas` | Indian verticals per Brief §6.10 |

---

## 4. Page types — what a visitor actually gets

| Route | Status | Data source | Gap |
|---|---|---|---|
| `/` | **SAMPLE** | Hardcoded arrays + live catalogue counts | Counts (290 / 14) are real; surrounding copy is placeholder |
| `/browse` | **LIVE** | `ideas` via `get_category_summary` | — |
| `/category/[slug]` | **LIVE** | `ideas` | — |
| `/category/[slug]/[sub]` | **LIVE but pointless** | `ideas` | 1 idea per subcategory — see §2 |
| `/idea/[slug]` | **PARTIAL** | `ideas` + `category_faqs` fallback | 13 sections empty on 282 ideas |
| `/faq` and `/faq/[category]` | **LIVE** | `category_faqs`, 84 rows | — |
| `/shortlist` and `/shortlist/[slug]` | **PARTIAL** | Generated from `ideas` | Brief §6.3 wants top-10 written long; currently auto-generated |
| `/calculator` + `/calculator/[slug]` | **LIVE** | `calculators.ts`, 31 entries | — |
| `/validate/[vertical]` | **SAMPLE** | Hardcoded array + `ideas` | Brief §6.10 |
| `/search` | **LIVE** | `ideas` | — |
| `/blog` + `/blog/[slug]` | **LIVE** | WordPress at `nutrizoe.in` | Points at an unrelated site — confirm intended source |
| `/pricing` | **SAMPLE** | Hardcoded | Confirm real prices |
| `/about`, `/contact`, `/services` | **SAMPLE** | Hardcoded | Founder copy |
| `/terms`, `/privacy`, `/disclaimer`, `/gdpr`, `/refund-policy` | **SAMPLE** | Hardcoded | **Legal review before launch** |
| `/sign-in` | **LIVE** | Supabase auth | — |
| `/step-by-step/[slug]` | **MISSING** | — | Brief §6.7. No route, no content. |
| `/useful-tools` + `/useful-tools/[slug]` | **MISSING** | — | Brief §6.9. No route, no content. |
| `/versus/[slug]` | **MISSING** | — | Brief §6.11. No route, no content. |

---

## 5. Schema and site identity

| Signal | Status | Source | Gap |
|---|---|---|---|
| `Article`, `BreadcrumbList`, `CollectionPage`, `WebPage` | **LIVE** | `src/lib/schema.tsx` | — |
| `FAQPage` + `Question` | **LIVE** | Idea page and FAQ hub | — |
| `Organization` + `publisher` | **LIVE** | `site-config.ts`, emitted in `__root.tsx` | — |
| `datePublished` / `dateModified` | **LIVE** | `ideas.created_at` | No `updated_at`, so both are the publication date |
| `sameAs` | **MISSING** | Reads `SITE_SAME_AS` env var | **Needs real profile URLs from the founder. Never invent these.** |
| `HowTo` | **MISSING** | Would come from `getting_started_steps` | Blocked on §2 |
| `SITE_URL` | **SAMPLE** | Falls back to `newbusinessideas3.lovable.app` | Set to `businessidea.io` at launch |
| Sitemaps | **LIVE** | `sitemap-{ideas,categories,pages}.xml` | Does not yet include `/shortlist`, `/faq`, `/calculator` |

---

## 6. Order to replace, highest leverage first

1. **`status` on `ideas`** — mark the 282 partial rows honestly, so the pipeline
   can target them. Everything else depends on knowing what is done.
2. **The 13 empty columns, 282 rows** — via n8n + Gemini. Fixes core promises
   #1 and #2, and unblocks `HowTo` schema.
3. **Subcategory taxonomy** — decide what a subcategory is for. Affects
   navigation and two route files. Cheaper to settle now than after templates.
4. **Homepage copy** — the most-seen page is entirely placeholder.
5. **Shortlist content** — biggest internal-linking lever in the brief.
6. **`/step-by-step/`, `/useful-tools/`, `/versus/`** — content first, then the
   route. Never the reverse.
7. **`sameAs`, `SITE_URL`, legal pages** — launch blockers, not build blockers.
8. **`idea_research` (72 rows) and `blog_posts` (4 rows)** — wire or drop.
   Leaving orphan tables is how this became unclear the first time.
