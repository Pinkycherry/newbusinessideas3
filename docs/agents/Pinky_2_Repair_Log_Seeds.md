# Pinky 2 Repair Log: Seed Rows

**Purpose:** Editorial repair (not generation) of the seed rows in `public.ideas_pinky_2`, under the ACTIVE EDITORIAL HOLD in `docs/agents/Current_Instruction.md`. Each row is read in full and every visitor-facing field is rewritten by hand: second-person narrator voice (you/your, no operator first person), a business_description with a standalone hero sentence followed by 180+ meaningful words, a page of 900-1,300 useful words, specific JSON items, one natural Validate reference, dependency-based timing, no digits, no money figures, and no unverifiable legal, medical or trend claims. idea_id, slug, title, taxonomy fields, keywords and tags stay unchanged unless a defect is logged here.

**Started:** 2026-10-09 20:41 UTC / 2026-10-10 02:11 IST

**Scope (86 rows):** every `ideas_pinky_2` row whose category_id is not C035, C040 or C041, plus PK2-C041-S08-0001 and PK2-C041-S10-0001. Measured at start: 86.

PK2-C036-S01-0001, PK2-C036-S03-0001, PK2-C036-S06-0001, PK2-C036-S07-0001, PK2-C036-S10-0001,
PK2-C037-S06-0001, PK2-C037-S07-0001, PK2-C037-S08-0001, PK2-C037-S10-0001,
PK2-C038-S01-0001, PK2-C038-S03-0001, PK2-C038-S04-0001, PK2-C038-S05-0001, PK2-C038-S07-0001,
PK2-C039-S02-0001, PK2-C039-S04-0001, PK2-C039-S05-0001, PK2-C039-S06-0001, PK2-C039-S10-0001,
PK2-C041-S08-0001, PK2-C041-S10-0001,
PK2-C042-S03-0001, PK2-C042-S05-0001, PK2-C042-S06-0001, PK2-C042-S07-0001,
PK2-C043-S03-0001, PK2-C043-S05-0001, PK2-C043-S08-0001, PK2-C043-S09-0001, PK2-C043-S10-0001,
PK2-C044-S01-0001, PK2-C044-S02-0001, PK2-C044-S04-0001, PK2-C044-S07-0001,
PK2-C045-S04-0001, PK2-C045-S06-0001, PK2-C045-S07-0001, PK2-C045-S10-0001,
PK2-C046-S03-0001, PK2-C046-S05-0001, PK2-C046-S07-0001, PK2-C046-S09-0001,
PK2-C047-S01-0001, PK2-C047-S03-0001, PK2-C047-S04-0001, PK2-C047-S05-0001, PK2-C047-S09-0001,
PK2-C048-S05-0001, PK2-C048-S08-0001, PK2-C048-S09-0001,
PK2-C049-S01-0001, PK2-C049-S02-0001, PK2-C049-S04-0001, PK2-C049-S07-0001,
PK2-C050-S04-0001, PK2-C050-S05-0001, PK2-C050-S08-0001, PK2-C050-S10-0001,
PK2-C051-S04-0001, PK2-C051-S07-0001, PK2-C051-S09-0001,
PK2-C052-S01-0001, PK2-C052-S03-0001,
PK2-C053-S01-0001, PK2-C053-S10-0001,
PK2-C054-S02-0001, PK2-C055-S04-0001, PK2-C056-S01-0001, PK2-C057-S01-0001, PK2-C058-S09-0001,
PK2-C059-S02-0001, PK2-C060-S01-0001,
PK2-C061-S05-0001, PK2-C061-S07-0001,
PK2-C062-S04-0001, PK2-C062-S05-0001,
PK2-C063-S08-0001, PK2-C063-S10-0001,
PK2-C064-S08-0001, PK2-C064-S09-0001,
PK2-C065-S04-0001, PK2-C065-S08-0001,
PK2-C066-S01-0001, PK2-C066-S06-0001,
PK2-C067-S01-0001, PK2-C067-S06-0001

**Pre-existing flags at start:** tags contain a digit on PK2-C042-S05-0001, PK2-C058-S09-0001, PK2-C059-S02-0001, PK2-C062-S04-0001, PK2-C067-S01-0001; PK2-C062-S04-0001 also has a digit in title and seo_title (3D). Handled and logged when those rows are reached.

**QA per row (readback query):** words = rendered prose + JSON strings; bd = words after the hero sentence; minf = shortest of nine prose fields; fp/dig/spd must be false; val must be true; no newline or double-quote characters in prose.

## Entries

### Batch 1: C036, C037, C038 (14 rows) — logged 2026-10-09 20:49 UTC / 2026-10-10 02:19 IST

Reviewed and rewrote all 17 editable fields (meta_description, business_description, summary, market_opportunity, target_customer, how_you_make_money, startup_cost, income_potential, competition_edge, verdict, time_to_first_customer, pros_json, cons_json, getting_started_steps, tools_needed, faq_json; seo_title kept, none had first person). Titles, slugs, taxonomy, keywords and tags unchanged. Every old operator-voice sentence (I would run, I charge, My first test, I want to) replaced with second-person advice; FAQ answers no longer speak as the operator.

| idea_id | words | bd | minf | fp | dig | spd | val | JSON p/c/s/t/f |
|---|---|---|---|---|---|---|---|---|
| PK2-C036-S01-0001 | 1364 | 212 | 56 | f | f | f | 1 | 5/5/7/5/4 |
| PK2-C036-S03-0001 | 1268 | 211 | 57 | f | f | f | 1 | 5/5/7/5/4 |
| PK2-C036-S06-0001 | 1241 | 196 | 56 | f | f | f | 1 | 5/5/7/5/4 |
| PK2-C036-S07-0001 | 1199 | 211 | 55 | f | f | f | 1 | 5/5/7/5/4 |
| PK2-C036-S10-0001 | 1122 | 207 | 53 | f | f | f | 1 | 5/5/7/5/4 |
| PK2-C037-S06-0001 | 1222 | 206 | 53 | f | f | f | 1 | 5/5/7/5/4 |
| PK2-C037-S07-0001 | 1139 | 204 | 55 | f | f | f | 1 | 5/5/7/5/4 |
| PK2-C037-S08-0001 | 1125 | 209 | 53 | f | f | f | 1 | 5/5/7/5/4 |
| PK2-C037-S10-0001 | 1131 | 217 | 50 | f | f | f | 1 | 5/5/7/5/4 |
| PK2-C038-S01-0001 | 1048 | 203 | 44 | f | f | f | 1 | 5/5/7/5/4 |
| PK2-C038-S03-0001 | 1038 | 195 | 50 | f | f | f | 1 | 5/5/7/5/4 |
| PK2-C038-S04-0001 | 1000 | 185 | 44 | f | f | f | 1 | 5/5/7/5/4 |
| PK2-C038-S05-0001 | 990 | 201 | 43 | f | f | f | 1 | 5/5/7/5/4 |
| PK2-C038-S07-0001 | 1018 | 199 | 46 | f | f | f | 1 | 5/5/7/5/4 |

No newline or double-quote characters in any prose or JSON string (checked). Fixes after meaning read: removed unsourced growth/trend wording from market_opportunity in C037-S07, C037-S08, C037-S10, C038-S03, C038-S04, C038-S05, C038-S07 and from the first pro of C038-S05; replacement sentences describe the present need without claiming a trend. Railway rules (C037-S06), creche rules (C036-S07), pet food rules (C037-S10) and boarding rules (C037-S08) are left to the reader to check for their state; no legal claim made. Unresolved: none.
