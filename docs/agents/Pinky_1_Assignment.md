# Pinky 1 assignment

Last updated: 2026-10-09 17:39 +05:30 · Writer name: **Pinky 1** · Account: Claude Code (cloud session)

## Permanent slot

| Slot | Category range | The only table I write |
|---|---|---|
| 1 | C001–C034 | `public.ideas_pinky_1` (37 columns, status `pending`) |

Database assignment row `bbi_agent_assignments` (agent `Pinky 1`, status `ready`, updated 2026-10-09 10:55 UTC) matches this slot, table and range.

## Active main category

**C001 Packaged Food Business Ideas** (`packaged-food-business-ideas`), started 2026-10-09, **completed 2026-10-09 17:39 IST: 100 of 100 saved and verified, handed to the coordinator for review.** No new category starts until the coordinator signs off.
Chosen because it is the first category in my range and already has four drafts.
Name and slug checked: no clash with any of the 20 legacy category names or slugs.

## Rules (from `docs/agents/Current_Instruction.md`, 2026-10-09)

1. Finish one main category before starting another: its ten approved subcategories, at least ten distinct ideas in each, at least 100 ideas in total.
2. Existing drafts count toward the target after checking and improving them. A draft also copied to live `ideas` counts once.
3. Every idea differs in buyer, offer, operation and first step. A new title or swapped nouns is not a new idea. Check titles and business models against live `ideas` and all three staging tables.
4. At least 500 visitor-facing words per idea page, no upper limit, across the existing fields. Deepen the bullet points instead of adding sections.
5. Cover: what I would offer, whom I would serve, how I would begin, tools and skills, how money comes in, what can go wrong, pros, cons, honest founder-fit verdict. Use Indian circumstances where they matter.
6. Warm first-person prospective-founder voice ("I could…", "I would…", "I need to…"). Never claim I have run the business. Vary openings, rhythm, examples and calls to action.
7. Mention the page's **Validate** button in a natural place, in fresh wording each time: the reader clicks Validate on that page to see current, real-time information on their own screen. Never claim to know its result.
8. No invented prices, figures, timelines, legal claims, testimonials or achievements. No web research claims.
9. Exact category and subcategory IDs, names and slugs from `bbi_expansion_categories` and `bbi_expansion_subcategories` (read-only).
10. Save pending rows only, in batches of up to ten. Read back every batch: required fields, 500-word minimum, unique IDs and slugs, taxonomy match, duplicates across live and staging.
11. Never edit `public.ideas`, legacy rows, the lookup tables, schema, another writer's table or the site deployment. The coordinator reviews and releases.
12. After the category is complete, report its ten verified subcategory counts and stop for coordinator review.
13. Keep this document and the work log as Markdown in Artifacts and in `docs/agents/` (founder rule: Markdown only for logs and notes).

## Field conventions

- `idea_id`: `PK1-C001-Sxx-NNNN`, counter continues per subcategory (existing drafts are `0001`).
- `status` `pending`, `tier` `free`; `collection_id`, `trend_score`, `internal_link_anchors` null.
- JSON fields are native arrays of strings; `faq_json` is an array of `{q, a}`.
- Word count method: words in all text fields plus every string inside the JSON arrays and every FAQ question and answer. Titles, keywords, SEO title and meta description are not counted.

## C001 final verified counts

| Subcategory | Saved and verified |
|---|---|
| C001-S01 Sauce and Condiment | 10 |
| C001-S02 Spice and Seasoning | 10 |
| C001-S03 Ready-to-Cook Food | 10 |
| C001-S04 Savory Snack | 10 |
| C001-S05 Packaged Bakery | 10 |
| C001-S06 Confectionery | 10 |
| C001-S07 Fruit Preserve | 10 |
| C001-S08 Breakfast Food | 10 |
| C001-S09 Nutrition Snack | 10 |
| C001-S10 Frozen Prepared Food | 10 |
| **Total** | **100** |

All 100 rows: status `pending`, 555–1448 words, Validate mention in each, taxonomy matched against the lookup tables, no duplicate IDs, slugs or titles across live and staging. The 4 original drafts are also live in `ideas` and count once. Full read-back details: `docs/agents/Pinky_1_Work_Log.md`.

## C001 starting position (read 2026-10-09)

| Subcategory | Existing drafts | Needed |
|---|---|---|
| C001-S01 Sauce and Condiment | 1 (PK1-C001-S01-0001) | 9 |
| C001-S02 Spice and Seasoning | 1 (PK1-C001-S02-0001) | 9 |
| C001-S03 Ready-to-Cook Food | 1 (PK1-C001-S03-0001) | 9 |
| C001-S04 Savory Snack | 0 | 10 |
| C001-S05 Packaged Bakery | 0 | 10 |
| C001-S06 Confectionery | 1 (PK1-C001-S06-0001) | 9 |
| C001-S07 Fruit Preserve | 0 | 10 |
| C001-S08 Breakfast Food | 0 | 10 |
| C001-S09 Nutrition Snack | 0 | 10 |
| C001-S10 Frozen Prepared Food | 0 | 10 |

All four existing drafts are also live in `ideas` (counted once). Three are close to the 500-word line and will be checked with the exact method and deepened if short.

## C001 idea plan

Already live elsewhere and avoided: pickle/papad/masala, dry spice blend pouching, garlic and onion powder, stone-ground chutney and podi, millet porridge mix, dry fruit laddu and energy bars, sprouted baby cereal, granola, hot sauce, honey, celebration cakes, sattu premix, papad and vadi.

- **S01 Sauce and Condiment:** Schezwan and chilli garlic sauce for street Chinese stalls · Kasundi mustard sauce · Green chilli thecha jars · Momo chutney supply for momo stalls · Portion sauce sachets for cloud kitchens · Fresh eggless mayonnaise for sandwich and shawarma stalls · Pizza and pasta sauce for small pizzerias · Salad dressings for cafes · Northeast chilli paste
- **S02 Spice and Seasoning:** Single-origin whole spice gift boxes · Fries and popcorn seasoning shakers · Flavour dust for snack makers · Herb salt and low-sodium seasoning · Curry leaf and moringa powder · Hing compounding and packing · Pepper and cardamom grading for small growers · Custom house blends for restaurants · Kokum and amchur souring agents
- **S03 Ready-to-Cook:** Biryani kits · Onion-tomato gravy base · Fresh chilled pasta and noodles · Dal-khichdi one-pot packs for hostels · Marinated soya chunk packs · Dhokla and handvo mixes · Puran poli dough and filling · Marinated paneer tikka packs · Vrat (fasting) food kits
- **S04 Savory Snack:** Banana chips · Makhana roasting · Khakhra · Bhakarwadi · Murukku for tea shops · Masala coated peanuts · Baked millet crackers · Extruded corn puffs · Fresh farsan (sev, gathiya) · Roasted chana
- **S05 Packaged Bakery:** Rusk for tea stalls · Nankhatai · Whole wheat bread · Pav for street vendors · Jar cookies for kiranas · Packaged cake slices for cafes · Jaggery atta cookies · Christmas plum cake · Khari · Sourdough subscription
- **S06 Confectionery:** Imli candy · Small-batch chocolate · Shelf-stable peda · Fruit jelly candies · Petha · Soan papdi · Mukhwas · Chocolate-coated dry fruits · Milk toffee
- **S07 Fruit Preserve:** Amla murabba and candy · Mixed fruit jam for school tiffins · Aam papad · Orange marmalade · Jackfruit jam and dried bulbs · Jaggery fruit spreads · Solar-dried fruit slices · Forest fruit preserves · Tutti frutti for bakeries · Bakery fruit fillings
- **S08 Breakfast Food:** Instant poha and upma cups · Vermicelli roasting · Small poha mill · Fresh thepla supply · Dalia packing · Puttu and appam flour · Overnight oats jars · Natural peanut butter · Instant rava idli mix · Moong chilla premix
- **S09 Nutrition Snack:** Roasted soya nuts · Seed trail mix · Popped rajgira and jowar · School snack boxes · Dehydrated vegetable chips · Toasted coconut chips · Panjiri · Trek and yatra packs · Toddler finger-food puffs · Healthy bhel kits
- **S10 Frozen Prepared Food:** Frozen stuffed parathas · Frozen momos for kiosks · Frozen samosas and spring rolls · Frozen grated coconut and coconut milk cubes · Frozen ready curries · Frozen peas and sweet corn · Frozen kebabs for restaurants · Frozen marinated fish · Kulfi for retail freezers · Frozen pizza bases and garlic bread

The plan can change when a duplicate check finds an overlap; every change goes in the work log.
