# Pinky 2 assignment

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
