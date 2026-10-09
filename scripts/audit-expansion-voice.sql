-- BBI expansion narrator POV review, 2026-10-10.
-- Read-only candidate screen. A match needs human reading: some "I" advice is valid.
-- Never use these patterns as a mass UPDATE. Legacy IDEA-* rows are excluded.
-- Change the optional category_id in params to inspect a single current category.
WITH params AS (
  SELECT NULL::text AS category_id
), expansion_rows AS (
  SELECT 'live' AS source, idea_id, category_id,
         business_description, summary, market_opportunity, target_customer,
         how_you_make_money, startup_cost, income_potential, competition_edge,
         time_to_first_customer, verdict,
         pros_json, cons_json, getting_started_steps, tools_needed, faq_json
  FROM public.ideas WHERE idea_id LIKE 'PK%-C%-%'
  UNION ALL
  SELECT 'stage1', idea_id, category_id,
         business_description, summary, market_opportunity, target_customer,
         how_you_make_money, startup_cost, income_potential, competition_edge,
         time_to_first_customer, verdict,
         pros_json, cons_json, getting_started_steps, tools_needed, faq_json
  FROM public.ideas_pinky_1
  UNION ALL
  SELECT 'stage2', idea_id, category_id,
         business_description, summary, market_opportunity, target_customer,
         how_you_make_money, startup_cost, income_potential, competition_edge,
         time_to_first_customer, verdict,
         pros_json, cons_json, getting_started_steps, tools_needed, faq_json
  FROM public.ideas_pinky_2
  UNION ALL
  SELECT 'stage3', idea_id, category_id,
         business_description, summary, market_opportunity, target_customer,
         how_you_make_money, startup_cost, income_potential, competition_edge,
         time_to_first_customer, verdict,
         pros_json, cons_json, getting_started_steps, tools_needed, faq_json
  FROM public.ideas_pinky_3
), passages AS (
  SELECT r.source, r.category_id, r.idea_id, f.field, f.copy
  FROM expansion_rows r
  CROSS JOIN params p
  CROSS JOIN LATERAL (VALUES
    ('business_description',r.business_description),
    ('summary',r.summary),
    ('market_opportunity',r.market_opportunity),
    ('target_customer',r.target_customer),
    ('how_you_make_money',r.how_you_make_money),
    ('startup_cost',r.startup_cost),
    ('income_potential',r.income_potential),
    ('competition_edge',r.competition_edge),
    ('time_to_first_customer',r.time_to_first_customer),
    ('verdict',r.verdict),
    ('pros_json',r.pros_json::text),
    ('cons_json',r.cons_json::text),
    ('getting_started_steps',r.getting_started_steps::text),
    ('tools_needed',r.tools_needed::text),
    ('faq_json',r.faq_json::text)
  ) f(field,copy)
  WHERE p.category_id IS NULL OR r.category_id = p.category_id
), candidates AS (
  SELECT source, category_id, idea_id, field, copy
  FROM passages
  WHERE copy ~* '(\mI\M[[:space:]]+(would[[:space:]]+|could[[:space:]]+|want[[:space:]]+to[[:space:]]+)?(charge|sell|offer|run|make|treat|train|hire|buy|source|supply|deliver|install|operate|earn|reach|approach|visit|start|build|need|manage|provide|grow|design)[[:space:][:punct:]]|\mmy[[:space:]]+(buyers|customers|products|stock|staff|business|store|service)\M)'
)
SELECT source, category_id, idea_id,
       string_agg(field, ', ' ORDER BY field) AS fields_to_read,
       left(string_agg(field || ': ' || copy, E'\n' ORDER BY field), 1500) AS context
FROM candidates
GROUP BY source, category_id, idea_id
ORDER BY source, category_id, idea_id;
