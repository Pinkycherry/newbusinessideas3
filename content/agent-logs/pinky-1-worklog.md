# Pinky 1 work log

Own table: `public.ideas_pinky_1` · Range C001–C034 · Times in UTC.

## Assignment amendment · 2026-10-08 (coordinator, replaces research, 39-column and pilot rules)

- Production run: 100 distinct ideas, ten batches of ten, save and read back each batch.
- No web research. Briefs drafted from general knowledge; no prices, fees, market sizes, thresholds, timelines or sources in content.
- Table now has 37 columns (`research_facts`, `external_links` dropped by the coordinator's reset, see OPS_LOG 2026-10-08).
- status `pending`, tier `free`; collection_id, trend_score, internal_link_anchors null.
- Same IDs (PK1-Cxxx-Sxx-NNNN), taxonomy, overlap checks against `ideas` and all three Pinky tables.

## Run 1 · pilot attempt · 2026-10-08T16:40Z

- Read checks passed; write permissions indicated; pilot research blocked (egress proxy refused all government and research hosts). Nothing saved. Superseded by the amendment above.

## Run 2 · production · 2026-10-08

Each batch: slug overlap check against all four tables, insert, read-back check (count, status/tier/null metadata, JSON arrays, FAQ `{q,a}` only, required text non-empty, ID matches category/subcategory, no digits in content).

- 2026-10-08T18:23Z batch 1 saved and verified: PK1-C001-S01-0001, PK1-C002-S07-0001, PK1-C003-S01-0001, PK1-C004-S01-0001, PK1-C005-S06-0001, PK1-C007-S02-0001, PK1-C008-S02-0001, PK1-C009-S08-0001, PK1-C010-S07-0001, PK1-C011-S09-0001. Cumulative 10. One correction: PK1-C001-S01-0001 tag "B2B" replaced (digit), updated_at set. Skipped at planning as overlaps with live: pickle/masala, tiffin, cloud kitchen, vada pav, juice cart, microgreens, mushroom, goat, backyard poultry.
