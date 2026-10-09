# Pinky 2 assignment

## ACTIVE: EDITORIAL HOLD and full-table repair (received 2026-10-09 20:26 UTC, 01:56 IST 10 Oct)

New idea generation is **stopped**. No new idea IDs, slugs, categories or subcategories. C041 stays at 62 rows (S07 and S09 empty, S08 and S10 seed only) until the founder assigns otherwise. No publishing to `public.ideas`.

| | |
|---|---|
| Writer slot | 2 (permanent) |
| Only table I may edit | `public.ideas_pinky_2` |
| Assignment | Review and repair **every** existing row and **every** field |
| Starting count at receipt | **346** rows: C035 100, C040 100, C041 62, other seeds 84 (C036 5, C037 4, C038 5, C039 5, C042 4, C043 5, C044 4, C045 4, C046 4, C047 5, C048 3, C049 4, C050 4, C051 3, C052 2, C053 2, C054 1, C055 1, C056 1, C057 1, C058 1, C059 1, C060 1, C061 2, C062 2, C063 2, C064 2, C065 2, C066 2, C067 2). Full ID list in the work log. |
| Backup | `bbi_editorial.backup_pinky2_20261010_0118` (coordinator snapshot, 301 rows). The 45 C041 rows written after 01:18 IST are recorded in the work log. |

### Repair rules (founder hold + docs/agents/Current_Instruction.md ACTIVE EDITORIAL HOLD)

1. Voice: the site speaks **to** the possible founder as you/your. Never operator first person (I charge, I plan, my clients, I would hire), even hypothetically. Rewrite the thought, never a bulk pronoun swap. Read the complete sentence: a reader's FAQ question is not an owner claim.
2. business_description: standalone hero first sentence, then at least 180 meaningful words for Read the full overview.
3. Whole page more than 500 useful visitor-facing words, normally 500 to 1,000, longer when useful. Expand existing sections and JSON bullets, no filler, no new sections or disclaimers.
4. Every field: title, summary, overview, market, buyers, money, costs, income, competition, steps, tools, pros, cons, verdict, FAQs, SEO title, meta description, keywords, time-to-first-customer.
5. No repeated skeletons: remove My first test would, I want to, I would charge openings, identical verdict sequences, identical cost-line Validate endings and interchangeable examples. Each page gets its own buyer needs, first actions, costs, setbacks and candid verdict for India.
6. No fabricated numbers, permits, legal claims, earnings, experience or research. Remove unsupported figures and regulatory assertions.
7. Validate: tell the reader to click Validate on the page and inspect current information on their own screen, wording varied, never claiming a result.
8. Preserve IDs, slugs, category and subcategory mapping. Edit only `public.ideas_pinky_2`. Never touch `public.ideas`, the 679, taxonomy, other writers' tables, `bbi_editorial.work_*` drafts or the deployment. Keep sound coordinator repairs.
9. Small batches, read each back: every field, rendered length, meaning, duplicate titles and slugs. Log every reviewed ID, changed fields, failures and unresolved items with timestamps.
10. When the whole table is done: report to the founder first (counts, per-category and subcategory counts, number reviewed, changed IDs, unresolved issues, before/after examples), then **stop**.

---

*Everything below is history from before the hold and is superseded where it conflicts. Rule 3 below (first-person founder voice) is withdrawn.*


Updated 2026-10-09 19:38 UTC (01:08, 10 Oct IST).

| | |
|---|---|
| Current name | Pinky 2 |
| Writer slot | 2 (permanent) |
| Only table I may edit | `public.ideas_pinky_2` (37 columns, status pending) |
| Category range | C035–C067 |
| Active main category | **C041 Apparel and Clothing Retail Business Ideas** (`apparel-and-clothing-retail-business-ideas`), assigned 2026-10-10 |
| Completed, awaiting review | C035 Everyday Assistance Business Ideas (100 rows); C040 Local Event Services Business Ideas (100 rows) |
| Database assignment row | `bbi_agent_assignments` agent_name Pinky 2: matches this table and range |

## Rules in force (from docs/agents/Current_Instruction.md)

1. Finish one main category before starting another: all ten approved subcategories, at least ten meaningfully distinct ideas in each, at least 100 for the category. Existing drafts count after they are checked and improved. A row copied live counts once.
2. Every idea page carries at least 500 visitor-facing words across its existing fields. No upper limit. No new sections.
3. First-person prospective-founder voice ("I could", "I would", "I need to"), warm and specific, never claiming I ran the business. Varied openings, rhythm, bullets and calls to action. No template paragraphs.
4. Each page tells the reader, in fresh wording, to click Validate on that page to see current real-time information on their own screen. Never claim to know its result.
5. Indian context where relevant. No invented prices, figures, timelines, legal claims, testimonials or achievements. No web research claims.
6. Exact category and subcategory IDs, names and slugs from `bbi_expansion_categories` and `bbi_expansion_subcategories` (read-only).
7. Save in batches of up to ten, read back each batch, verify word count, required fields, unique IDs and slugs, taxonomy match, and duplicates across live and all staging tables.
8. Never edit `public.ideas`, legacy rows, lookup tables, schema, other writers' tables or the deployment.
9. Keep this file and `Pinky_2_Work_Log.md` current in `docs/agents/` and as chat copies. Report the ten counts for a finished category and pause for coordinator review.

## C035 starting position (read 2026-10-09 11:08 UTC)

Category name and slug checked against the 20 legacy categories: no overlap.

| Subcategory | Existing drafts | Words (min 500) | New ideas needed |
|---|---|---|---|
| C035-S01 Companionship and Social Visits | 1 (PK2-C035-S01-0001) | 1,112 | 9 |
| C035-S02 Errand and Shopping Assistance | 1 (PK2-C035-S02-0001) | 1,042 | 9 |
| C035-S03 At-Home Meal Support | 0 | | 10 |
| C035-S04 Transportation Accompaniment | 1 (PK2-C035-S04-0001) | 924 | 9 |
| C035-S05 Everyday Technology Help | 0 | | 10 |
| C035-S06 Appointment and Schedule Support | 1 (PK2-C035-S06-0001) | 862 | 9 |
| C035-S07 Light Household Assistance | 0 | | 10 |
| C035-S08 Community Activity Facilitation | 0 | | 10 |
| C035-S09 Family Update Services | 0 | | 10 |
| C035-S10 Downsizing and Transition Assistance | 1 (PK2-C035-S10-0001) | 884 | 9 |

The five existing drafts need a Validate-button line added. 95 new ideas are planned, one subcategory per batch where possible.

## C035 status: complete, awaiting coordinator review (2026-10-09 12:10 UTC)

All 100 rows are in `public.ideas_pinky_2`, status pending, IDs PK2-C035-S01-0001 to PK2-C035-S10-0010. None are live.

| Subcategory | Verified ideas |
|---|---|
| C035-S01 Companionship and Social Visits | 10 |
| C035-S02 Errand and Shopping Assistance | 10 |
| C035-S03 At-Home Meal Support | 10 |
| C035-S04 Transportation Accompaniment | 10 |
| C035-S05 Everyday Technology Help | 10 |
| C035-S06 Appointment and Schedule Support | 10 |
| C035-S07 Light Household Assistance | 10 |
| C035-S08 Community Activity Facilitation | 10 |
| C035-S09 Family Update Services | 10 |
| C035-S10 Downsizing and Transition Assistance | 10 |

Final read-back: 100 unique IDs and slugs; visitor-facing words 538 minimum, 718 average, 1,255 maximum; every row mentions Validate; taxonomy IDs, names and slugs match the lookup tables; status pending, tier free; no null required fields; no digits; no money estimates in words; no AI vendor names; 0 slug or title clashes with `ideas`, `ideas_pinky_1`, `ideas_pinky_3` or other Pinky 2 rows.

C035 is closed for writing. Known issue in my 95 older drafts (C036 to C067): their income and cost text still uses money estimates in words. Each one will be cleaned when its category is worked.

## C040 Local Event Services: active (from 2026-10-09 12:31 UTC)

Order: finish S01 to ten verified ideas, then S02, and so on to S10. Batches of up to ten, each read back. At least 500 visitor-facing words, detailed practical bullets, warm first-person founder voice, varied Validate wording, no invented fees, figures, licences or permissions.

Starting position (read 2026-10-09 12:31 UTC): 6 staged rows, 0 live copies.

| Subcategory | Existing drafts | Needed |
|---|---|---|
| C040-S01 Event Planning and Coordination | PK2-C040-S01-0001 house-ceremony-event-planner (589 words) | 9 |
| C040-S02 Venue Setup and Logistics | none | 10 |
| C040-S03 Event Decoration | none | 10 |
| C040-S04 Event Equipment Rental | PK2-C040-S04-0001 catering-equipment-rental (589) | 9 |
| C040-S05 Event Sound and Lighting | PK2-C040-S05-0001 sound-and-lighting-rental-for-small-functions (550) | 9 |
| C040-S06 Event Photo and Video Services | PK2-C040-S06-0001 same-day-wedding-highlight-reel (493, under minimum) | 9 |
| C040-S07 Guest Registration Systems | PK2-C040-S07-0001 qr-guest-check-in-service-for-events (543) | 9 |
| C040-S08 Party Activities and Entertainment | none | 10 |
| C040-S09 Talent Booking and Production | none | 10 |
| C040-S10 Community Markets and Fairs | PK2-C040-S10-0001 weekend-makers-market-organiser (521) | 9 |

Fixes needed on the six drafts: none mentions Validate; all six give income estimates in words (thousands, lakhs) that must go; S06-0001 needs more words; S10-0001 has an unsourced thousands of residents claim. 94 new ideas needed.

## C040 status: complete, awaiting coordinator review (2026-10-09 13:14 UTC)

100 pending rows in `public.ideas_pinky_2`, PK2-C040-S01-0001 to PK2-C040-S10-0010. None are live.

| Subcategory | Verified ideas |
|---|---|
| C040-S01 Event Planning and Coordination | 10 |
| C040-S02 Venue Setup and Logistics | 10 |
| C040-S03 Event Decoration | 10 |
| C040-S04 Event Equipment Rental | 10 |
| C040-S05 Event Sound and Lighting | 10 |
| C040-S06 Event Photo and Video Services | 10 |
| C040-S07 Guest Registration Systems | 10 |
| C040-S08 Party Activities and Entertainment | 10 |
| C040-S09 Talent Booking and Production | 10 |
| C040-S10 Community Markets and Fairs | 10 |

Final read-back: 100 unique IDs, slugs and titles; words 543 minimum, 640 average, 1,000 maximum; 100 distinct Validate sentences; taxonomy, status/tier, required fields, digits, money words, AI vendor names, line breaks and duplicates across live and all staging tables all pass. The six older drafts were improved (Validate line, income wording, S06-0001 length).

Remaining issue (unchanged): my older drafts in other categories still use money estimates in words; each will be cleaned when its category is worked.

## Voice and depth rule in force from 2026-10-09 19:38 UTC (supersedes every earlier first-person rule)

Source: founder prompt for C041 and the 00:53 IST editorial override in `Current_Instruction.md`.

1. The site speaks as an adviser to the reader who might run the shop or service. Operations belong to **you/your**: buying stock, fitting garments, finding customers, pricing, selling, handling returns. Never write "I buy the clothes", "I run the boutique", "my customers", "I would launch". Avoid operator "I" even hypothetically; this pass uses no narrator "I" at all.
2. Direct, human advice. No repeated greeting, no repeated verdict formula, no reusable paragraph skeleton. Read the meaning of every field, JSON bullet and FAQ, not only pronouns.
3. `business_description` opens with a self-contained hero sentence, then at least 180 useful, distinct words, because the remainder fills Read the full overview.
4. Every page has more than 500 informative visitor-facing words, usually 500 to 1,000, longer only when useful. No padding.
5. Garment-specific detail where it fits: who buys, sizing and fit, stock risk, sourcing and quality checks, alterations or returns, seasonality, delivery or footfall, starting without excess inventory, and a clear reason it may or may not suit the reader.
6. Natural reference to the page's Validate button; never claim to have seen its result. No invented figures, fees, licences or statistics.
7. Exact C041 taxonomy; check names, slugs and business models against live and all staging tables; small batches, each read back for word counts, field quality and voice.
8. Do not rewrite C035/C040 (coordinator owns that repair). Do not touch `public.ideas`, the 679 legacy ideas, taxonomy or other writers' tables.

## C041 starting position (read 2026-10-09 19:38 UTC)

0 live rows. 5 seed drafts, each to be rewritten to this standard before counting:
PK2-C041-S02-0001 designer-ethnic-wear-rental; PK2-C041-S04-0001 branded-uniforms-for-small-businesses; PK2-C041-S06-0001 cotton-nightwear-brand; PK2-C041-S08-0001 adaptive-clothing-for-elderly-and-patients; PK2-C041-S10-0001 made-to-measure-shirts-business.

Subcategories: S01 Everyday Apparel, S02 Ethnic Wear, S03 Occasionwear, S04 Workwear and Uniform, S05 Activewear and Performance Apparel, S06 Sleepwear and Loungewear, S07 Innerwear and Hosiery, S08 Adaptive Apparel, S09 Sustainable Apparel, S10 Custom and Made-to-Order Apparel. Target: 10 each, 100 total; 95 new rows needed.
