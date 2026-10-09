# Pinky 1 assignment

Last updated: 2026-10-10 00:19 +05:30 · Writer name: **Pinky 1** · Account: Claude Code (cloud session)

## Permanent slot

| Slot | Category range | The only table I write |
|---|---|---|
| 1 | C001–C034 | `public.ideas_pinky_1` (37 columns, status `pending`) |

Database assignment row `bbi_agent_assignments` (agent `Pinky 1`, status `ready`, updated 2026-10-09 10:55 UTC) matches this slot, table and range.

## Active main category

**C004 Beverage Product Business Ideas** (`beverage-product-business-ideas`): **completed 2026-10-10 00:19 IST, 100 of 100 saved and verified, handed to the coordinator for review.** No new category starts until sign-off. Assigned by the coordinator on 2026-10-09 (17:57 IST checkpoint in `Current_Instruction.md`) and started 2026-10-09 18:03 IST. This is my only active category.

- Order is fixed: bring S01 to ten verified ideas, then S02, and so on to S10. No scattering.
- Target: at least ten distinct staged ideas in each of the ten approved subcategories, at least 100 C004 rows.
- Starting position (recounted 2026-10-09 18:03 IST): four drafts, all also live (each counts once, live copies untouched). They are PK1-C004-S01-0001 (tulsi and lemongrass tea), PK1-C004-S03-0001 (kokum and aam panna), PK1-C004-S09-0001 (sattu premix) and PK1-C004-S10-0001 (masala chaas). Their word counts are 862, 885, 575 and 661. None mentions Validate, so each gets a fresh Validate line in my staging table only. That means 96 new rows are needed.
- After S10 reaches ten, I report the S01–S10 counts, total unique C004 IDs, the minimum word count and any open concern, push this document and the work log, and stop for coordinator review. I do not copy anything to `public.ideas` and do not touch the site.

**Previous category:** C001 Packaged Food Business Ideas, completed 2026-10-09 17:39 IST (100 of 100 verified) and handed to the coordinator.

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

## C004 final verified counts

| Subcategory | Saved and verified |
|---|---|
| C004-S01 Tea Product | 10 |
| C004-S02 Coffee Product | 10 |
| C004-S03 Fruit and Vegetable Drink | 10 |
| C004-S04 Packaged Water | 10 |
| C004-S05 Plant Based Beverage | 10 |
| C004-S06 Fermented Beverage | 10 |
| C004-S07 Functional Beverage | 10 |
| C004-S08 Beverage Concentrate | 10 |
| C004-S09 Powdered Drink | 10 |
| C004-S10 Dairy Beverage | 10 |
| **Total** | **100** (100 unique IDs and slugs) |

All rows are pending/free and run 551–1059 words. Each one has a Validate line and matches the lookup tables, with no duplicates across live and staging. The four original drafts count once. Their live copies still lack the new Validate line, so the coordinator needs to resync them. Open concerns are listed in the work log.

## C004 idea plan (checked against live and staging titles)

Avoided because they already exist live: coffee cart, part-time coffee roasting, kombucha wholesale, packaged drinking water can delivery, fruit chaat and juice cart, milk delivery reselling, RO purifier service and espresso machine descaling.

- **S01 Tea:** Assam CTC blending for kiranas · Small-grower orthodox tea direct to buyers · Masala chai leaf-and-spice blend · Kashmiri kahwa packs · Tea bag contract packing for hotels and offices · Bottled iced tea · Butterfly pea and hibiscus flower teas · Tea gift boxes for weddings and companies · Tea premix for office vending machines
- **S02 Coffee:** Filter coffee and chicory powder for darshinis · Filter coffee decoction bottles · Cold brew bottles · Instant coffee sachets for offices · Drip coffee bags · Green coffee from small growers to roasters · Multi-estate coffee subscription boxes · Bean-to-cup office coffee supply · Cascara (coffee cherry husk) tea · Sukku malli (dry ginger coriander) coffee
- **S03 Fruit and Vegetable Drink:** Cold-pressed juice subscription · Bottled sugarcane juice · Easy-open tender coconuts · ABC (apple, beetroot, carrot) juice · Goli soda revival · Orchard litchi and mango nectar · Frozen smoothie packs · Watermelon juice for highway chillers · Cashew apple drink
- **S04 Packaged Water:** Small bottling plant · Water pouches for rural markets · Custom-label bottles for hotels and companies · Returnable glass-bottle water for restaurants · Village water ATM · Flavoured infused water · Packaged edible ice · Soda water supply to restaurants · Carton-packed water · Cup water for functions and temples
- **S05 Plant Based:** Peanut milk and curd · Barista oat milk for cafes · Fresh soy milk delivery · Flavoured coconut milk drinks · Almond milk for gyms · Millet milk for children · Nut-milk base paste · Bottled barley water · Plant-based chaas · Panakam
- **S06 Fermented:** Bottled kanji · Water kefir sodas · Ragi koozh · Brewed ginger beer (non-alcoholic) · Kombucha home-brew kits · Jamun and fruit vinegar shrubs · Pineapple peel tepache · Milk kefir · plus two to be planned after an overlap check
- **S07 Functional:** Electrolyte drinks for outdoor workers · Aloe and amla juice · Ready-to-drink protein shakes · Ready-to-drink kadha · Sabja and chia drinks · Prebiotic fibre sodas · Natural-caffeine energy drinks · After-meal digestive shots · Ginger shots · Caffeine-free evening herbal drinks
- **S08 Concentrate:** Rose and khus sharbat · Orange and pineapple squash · Cafe flavour syrups · Thandai concentrate · Panipuri water concentrate · Fountain soda syrups · Bar mocktail mixers · Fruit crush for parlours · Ginger-lemon-honey concentrate · Nannari syrup
- **S09 Powdered Drink:** Ragi malt · Badam milk mix · Jaljeera and shikanji sachets · Haldi doodh mix · Natural fruit drink powders · Hot chocolate from Indian cocoa · Milkshake premix for juice shops · Chaas masala · Bajra raab mix
- **S10 Dairy Beverage:** Bottled lassi · Flavoured milk in glass bottles · Cold coffee and milkshake bottles for colleges · Piyush · Jigarthanda · Camel milk drinks · Paneer whey drinks · Mohabbat ka sharbat · Kulhad hot milk counters

The plan can change if an overlap check finds a clash; every change goes in the work log.
