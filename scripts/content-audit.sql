-- BBI content audit — how much of each idea page is unique to that page.
--
-- Run this against the BBI Supabase project whenever the pipeline adds rows.
-- It answers the only question that matters for indexing: if Google fetched
-- two of these pages, how much of the second one has it already seen?
--
-- Background. Google clusters near-identical pages and indexes one of them,
-- reporting the rest in Search Console as "Duplicate, Google chose a different
-- canonical" or "Crawled - currently not indexed". Those signals are assessed
-- across the site, so a large block of near-identical pages does not only fail
-- to rank itself, it weighs on the pages that would otherwise have ranked.
--
-- Every figure this prints is counted from the table. Nothing is estimated.

\echo '== 1. Fields that repeat verbatim across rows =============================='

select
  field,
  n_distinct                                  as distinct_values,
  modal_rows                                  as rows_sharing_one_value,
  round(100.0 * modal_rows / total, 1)        as pct_of_library
from (
  select 'startup_cost' as field,
         count(distinct startup_cost) as n_distinct,
         (select count(*) from ideas where status='completed'
          group by startup_cost order by count(*) desc limit 1) as modal_rows,
         count(*) as total
    from ideas where status='completed'
  union all
  select 'income_potential', count(distinct income_potential),
         (select count(*) from ideas where status='completed'
          group by income_potential order by count(*) desc limit 1), count(*)
    from ideas where status='completed'
  union all
  select 'how_you_make_money', count(distinct how_you_make_money),
         (select count(*) from ideas where status='completed'
          group by how_you_make_money order by count(*) desc limit 1), count(*)
    from ideas where status='completed'
  union all
  select 'competition_edge', count(distinct competition_edge),
         (select count(*) from ideas where status='completed'
          group by competition_edge order by count(*) desc limit 1), count(*)
    from ideas where status='completed'
  union all
  select 'time_to_first_customer', count(distinct time_to_first_customer),
         (select count(*) from ideas where status='completed'
          group by time_to_first_customer order by count(*) desc limit 1), count(*)
    from ideas where status='completed'
  union all
  select 'getting_started_steps', count(distinct getting_started_steps::text),
         (select count(*) from ideas where status='completed'
          group by getting_started_steps::text order by count(*) desc limit 1), count(*)
    from ideas where status='completed'
  union all
  select 'tools_needed', count(distinct tools_needed::text),
         (select count(*) from ideas where status='completed'
          group by tools_needed::text order by count(*) desc limit 1), count(*)
    from ideas where status='completed'
) x
order by pct_of_library desc;

\echo ''
\echo '== 2. Unique vs repeated characters per page =============================='
-- `shared_chars` counts only text this row holds byte-identical to the most
-- common value of the same field, plus the templated target_customer sentence.
-- It is therefore a floor: real near-duplicate detection is fuzzier and would
-- catch more.

with modal as (
  select
    (select startup_cost           from ideas where status='completed' group by 1 order by count(*) desc limit 1) sc,
    (select income_potential       from ideas where status='completed' group by 1 order by count(*) desc limit 1) ip,
    (select how_you_make_money     from ideas where status='completed' group by 1 order by count(*) desc limit 1) hm,
    (select competition_edge       from ideas where status='completed' group by 1 order by count(*) desc limit 1) ce,
    (select time_to_first_customer from ideas where status='completed' group by 1 order by count(*) desc limit 1) tt,
    (select getting_started_steps::text from ideas where status='completed' group by 1 order by count(*) desc limit 1) gs,
    (select tools_needed::text     from ideas where status='completed' group by 1 order by count(*) desc limit 1) tn
), p as (
  select i.idea_id,
    (i.startup_cost = m.sc) as is_boilerplate,
    length(i.summary) + length(i.market_opportunity) + length(i.target_customer)
      + length(i.how_you_make_money) + length(i.startup_cost) + length(i.income_potential)
      + length(i.competition_edge) + length(i.time_to_first_customer) + length(i.verdict)
      + length(i.getting_started_steps::text) + length(i.tools_needed::text)
      + length(i.faq_json::text) + length(i.pros_json::text) + length(i.cons_json::text)
      as total_chars,
      (case when i.startup_cost           = m.sc then length(i.startup_cost) else 0 end)
    + (case when i.income_potential       = m.ip then length(i.income_potential) else 0 end)
    + (case when i.how_you_make_money     = m.hm then length(i.how_you_make_money) else 0 end)
    + (case when i.competition_edge       = m.ce then length(i.competition_edge) else 0 end)
    + (case when i.time_to_first_customer = m.tt then length(i.time_to_first_customer) else 0 end)
    + (case when i.getting_started_steps::text = m.gs then length(i.getting_started_steps::text) else 0 end)
    + (case when i.tools_needed::text     = m.tn then length(i.tools_needed::text) else 0 end)
    + (case when i.target_customer like 'The person who pays is already dealing with%'
            then length(i.target_customer) else 0 end)
      as shared_chars
  from ideas i cross join modal m
  where i.status='completed'
)
select
  is_boilerplate,
  count(*)                                         as pages,
  round(avg(total_chars))                          as avg_chars_on_page,
  round(avg(shared_chars))                         as avg_chars_seen_elsewhere,
  round(avg(total_chars - shared_chars))           as avg_chars_unique,
  round(100.0 * avg(shared_chars) / avg(total_chars), 1) as pct_repeated
from p
group by is_boilerplate
order by is_boilerplate;

\echo ''
\echo '== 3. Two pages competing for one keyword ================================='

select focus_keyword, count(*) as pages, string_agg(slug, '  |  ' order by slug) as slugs
from ideas where status='completed'
group by focus_keyword having count(*) > 1;
