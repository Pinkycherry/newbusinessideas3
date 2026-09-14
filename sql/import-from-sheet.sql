-- =============================================================================
-- Import a finished Google Sheet into `ideas` — in one hit, without any of the
-- data passing through a chat window.
--
-- WHY THIS FILE EXISTS
-- Pasting 409 rows into a conversation costs tokens twice (once to read, once
-- to emit) and re-bills the whole context on every tool call. This file moves
-- the data on a path that costs nothing: Sheet -> CSV -> Supabase's own CSV
-- importer -> a staging table -> one merge. The rows never touch a model.
--
-- HOW TO RUN IT — four steps, in order, in the Supabase SQL Editor
--   STEP 1  Run part 1. It creates the staging table and two helpers.
--   STEP 2  Sheet: File > Download > CSV. Then Supabase Table Editor >
--           ideas_import > Insert > Import data from CSV. Nothing is merged
--           yet — the staging table is a scratch space, `ideas` is untouched.
--   STEP 3  Run part 3, the fact-check gate. It reports, per row, exactly what
--           is wrong. Fix those cells in the sheet, re-export, re-import.
--           Repeat until part 3 returns zero blocking rows.
--   STEP 4  Run part 4, the merge. Only rows that passed part 3 are written.
--
-- THE ONE RULE THIS FILE ENFORCES
-- A blank cell never overwrites existing data. Every column merges through
-- COALESCE(new, old), so a half-filled sheet can be imported safely and the
-- rest filled in later. There is no way for this file to empty a column.
-- =============================================================================


-- =============================================================================
-- PART 1 — staging table and helpers.  Safe to re-run; drops only the staging.
-- =============================================================================

drop table if exists ideas_import;

-- Every column is text. The sheet has no types, so casting happens at merge
-- time where a bad cell can be caught and named instead of aborting the batch.
create table ideas_import (
  idea_id                text,
  category_id            text,
  category_name          text,
  category_slug          text,
  subcategory_id         text,
  subcategory_name       text,
  subcategory_slug       text,
  collection_id          text,
  status                 text,
  focus_keyword          text,
  additional_keyword_1   text,
  additional_keyword_2   text,
  business_description   text,
  title                  text,
  slug                   text,
  summary                text,
  tags                   text,
  pros_json              text,
  cons_json              text,
  verdict                text,
  trend_score            text,
  tier                   text,
  seo_title              text,
  meta_description       text,
  market_opportunity     text,
  target_customer        text,
  how_you_make_money     text,
  startup_cost           text,
  income_potential       text,
  competition_edge       text,
  getting_started_steps  text,
  tools_needed           text,
  time_to_first_customer text,
  faq_json               text,
  external_links         text,
  internal_link_anchors  text,
  research_facts         text
);
-- created_at is deliberately absent. It is set by the database, not by a sheet.

-- Parses a cell as JSON, returns NULL instead of throwing on a malformed one,
-- and unwraps the double-encoding bug: 7 rows in `ideas` currently hold
-- research_facts as a JSON *string* containing JSON, rather than as an object.
-- Anything imported through here comes out as a proper object.
create or replace function bbi_json(t text) returns jsonb
language plpgsql immutable as $f$
declare v jsonb;
begin
  if t is null or btrim(t) = '' then return null; end if;
  begin v := btrim(t)::jsonb; exception when others then return null; end;
  if jsonb_typeof(v) = 'string' then
    begin v := (v #>> '{}')::jsonb; exception when others then return null; end;
  end if;
  return v;
end $f$;

-- True when the text parses as JSON (or is blank). Used by the gate below.
create or replace function bbi_json_ok(t text) returns boolean
language sql immutable as $f$
  select t is null or btrim(t) = '' or bbi_json(t) is not null;
$f$;


-- =============================================================================
-- PART 3 — the fact-check gate.  Run this and read it before you merge.
--
-- `blocking` stops the merge. `warning` does not, but is worth a look — these
-- are the EEAT tells a reviewer would catch.
-- =============================================================================

create or replace view ideas_import_qa as
with flags as (
  select
    i.idea_id,
    i.slug,
    -- every narrative field concatenated, for the prose checks
    concat_ws(' ', i.summary, i.market_opportunity, i.target_customer,
              i.how_you_make_money, i.startup_cost, i.income_potential,
              i.competition_edge, i.verdict, i.time_to_first_customer) as prose,
    i.*
  from ideas_import i
)
select
  f.idea_id,
  array_remove(array[
    -- --- structural: these columns are NOT NULL in `ideas` ------------------
    case when coalesce(btrim(f.idea_id),'')          = '' then 'idea_id blank' end,
    case when coalesce(btrim(f.category_id),'')      = '' then 'category_id blank' end,
    case when coalesce(btrim(f.category_name),'')    = '' then 'category_name blank' end,
    case when coalesce(btrim(f.category_slug),'')    = '' then 'category_slug blank' end,
    case when coalesce(btrim(f.subcategory_id),'')   = '' then 'subcategory_id blank' end,
    case when coalesce(btrim(f.subcategory_name),'') = '' then 'subcategory_name blank' end,
    case when coalesce(btrim(f.subcategory_slug),'') = '' then 'subcategory_slug blank' end,
    case when coalesce(btrim(f.status),'')           = '' then 'status blank' end,

    -- --- the slug, which has broken this import before ----------------------
    -- An empty string is NOT the same as NULL. `ideas` already carries one row
    -- with slug = '' and the unique index rejects the second one. This is the
    -- 23505 that stopped the pipeline twice.
    case when f.slug is not null and btrim(f.slug) = ''
         then 'slug is an empty string — clear the cell completely or fill it' end,
    case when btrim(coalesce(f.slug,'')) <> '' and f.slug <> lower(f.slug)
         then 'slug has capitals' end,
    case when f.slug ~ '[^a-z0-9-]' then 'slug has a character other than a-z 0-9 -' end,
    case when (select count(*) from ideas_import d
               where btrim(coalesce(d.slug,'')) = btrim(coalesce(f.slug,''))
                 and btrim(coalesce(d.slug,'')) <> '') > 1
         then 'slug appears twice in this import' end,
    case when exists (select 1 from ideas e
                      where e.slug = btrim(f.slug) and e.idea_id <> btrim(f.idea_id))
         then 'slug already belongs to a different idea_id in the live table' end,

    -- --- JSON columns -------------------------------------------------------
    case when not bbi_json_ok(f.tags)                  then 'tags is not valid JSON' end,
    case when not bbi_json_ok(f.pros_json)             then 'pros_json is not valid JSON' end,
    case when not bbi_json_ok(f.cons_json)             then 'cons_json is not valid JSON' end,
    case when not bbi_json_ok(f.getting_started_steps) then 'getting_started_steps is not valid JSON' end,
    case when not bbi_json_ok(f.tools_needed)          then 'tools_needed is not valid JSON' end,
    case when not bbi_json_ok(f.faq_json)              then 'faq_json is not valid JSON' end,
    case when not bbi_json_ok(f.external_links)        then 'external_links is not valid JSON' end,
    case when not bbi_json_ok(f.internal_link_anchors) then 'internal_link_anchors is not valid JSON' end,
    case when not bbi_json_ok(f.research_facts)        then 'research_facts is not valid JSON' end,

    -- --- the house rule: no number without a source -------------------------
    -- If the prose quotes a figure, research_facts must exist and must carry at
    -- least one http source. A number nobody can check is the one thing that
    -- cannot ship.
    case when f.prose ~ '[0-9]'
           and coalesce(btrim(f.research_facts),'') = ''
         then 'prose quotes a number but research_facts is empty' end,
    case when f.prose ~ '[0-9]'
           and btrim(coalesce(f.research_facts,'')) <> ''
           and f.research_facts not like '%http%'
         then 'prose quotes a number but research_facts carries no source URL' end,

    -- --- trend_score --------------------------------------------------------
    case when btrim(coalesce(f.trend_score,'')) <> '' and f.trend_score !~ '^[0-9]+$'
         then 'trend_score is not a whole number' end,
    case when f.trend_score ~ '^[0-9]+$'
           and (f.trend_score::int < 55 or f.trend_score::int > 98)
         then 'trend_score outside 55-98' end,
    case when f.trend_score ~ '^[0-9]+$' and f.trend_score::int >= 88
           and lower(btrim(coalesce(f.tier,''))) not in ('premium','')
         then 'trend_score 88+ but tier is not premium' end,
    case when f.trend_score ~ '^[0-9]+$' and f.trend_score::int < 88
           and lower(btrim(coalesce(f.tier,''))) = 'premium'
         then 'tier premium but trend_score under 88' end
  ], null) as blocking,

  array_remove(array[
    -- --- SEO shape ----------------------------------------------------------
    case when length(btrim(coalesce(f.seo_title,''))) > 60
         then 'seo_title over 60 characters' end,
    case when length(btrim(coalesce(f.meta_description,''))) > 160
         then 'meta_description over 160 characters' end,
    case when btrim(coalesce(f.focus_keyword,'')) <> ''
           and lower(btrim(f.focus_keyword)) in (lower(btrim(coalesce(f.additional_keyword_1,''))),
                                                 lower(btrim(coalesce(f.additional_keyword_2,''))))
         then 'an additional keyword repeats the focus keyword' end,
    case when btrim(coalesce(f.seo_title,'')) <> ''
           and btrim(coalesce(f.focus_keyword,'')) <> ''
           and position(lower(btrim(f.focus_keyword)) in lower(f.seo_title)) = 0
         then 'focus keyword missing from seo_title' end,

    -- --- voice: the banned list from the pipeline prompt ---------------------
    case when f.prose ~* '(game.changer|revolutionar|revolutionize|fast.paced world|unlock|seamless|robust|cutting.edge|disrupt|leverag|synerg|holistic|empower|elevate|next.generation|paradigm|dive in|look no further)'
         then 'template/marketing-fluff wording — see the banned list' end,
    case when f.prose ~ '\m(19|20)[0-9]{2}\M'
         then 'a year appears in the prose — the pages are meant to be evergreen' end,
    case when f.prose ~ '[\U0001F300-\U0001FAFF☀-➿]'
         then 'an emoji appears in the prose' end,

    -- --- thin content -------------------------------------------------------
    case when length(btrim(coalesce(f.summary,''))) between 1 and 200
         then 'summary is very short' end,
    case when btrim(coalesce(f.verdict,'')) = '' then 'verdict empty' end,
    case when btrim(coalesce(f.summary,'')) = '' then 'summary empty' end
  ], null) as warning
from flags f;

-- Read these three, in this order.
-- 1. the headline count
select
  (select count(*) from ideas_import)                                      as rows_imported,
  (select count(*) from ideas_import_qa where cardinality(blocking) = 0)   as will_merge,
  (select count(*) from ideas_import_qa where cardinality(blocking) > 0)   as blocked,
  (select count(*) from ideas_import_qa where cardinality(warning)  > 0)   as with_warnings;

-- 2. what is blocking, most common first  (fix these in the sheet)
select problem, count(*) as rows
from ideas_import_qa, unnest(blocking) as problem
group by 1 order by 2 desc;

-- 3. the warnings, most common first  (judgement calls, not blockers)
select problem, count(*) as rows
from ideas_import_qa, unnest(warning) as problem
group by 1 order by 2 desc;

-- And to see one bad row in full:
--   select * from ideas_import_qa where cardinality(blocking) > 0 limit 5;


-- =============================================================================
-- PART 4 — the merge.  Only rows with an empty `blocking` array are written.
--
-- Read this before running it: it is the only statement in this file that
-- touches `ideas`.  Every column goes through COALESCE(new, old), so a blank
-- cell leaves the live value alone.  Nothing is ever emptied by this.
-- =============================================================================

-- Dry run first — this changes nothing and shows what would be written.
select i.idea_id,
       (select count(*) from ideas e where e.idea_id = btrim(i.idea_id)) = 1 as is_update
from ideas_import i
join ideas_import_qa q on q.idea_id = i.idea_id
where cardinality(q.blocking) = 0
order by i.idea_id;

-- The merge itself. Run it once.
insert into ideas as t (
  idea_id, category_id, category_name, category_slug,
  subcategory_id, subcategory_name, subcategory_slug, collection_id, status,
  focus_keyword, additional_keyword_1, additional_keyword_2, business_description,
  title, slug, summary, tags, pros_json, cons_json, verdict, trend_score, tier,
  seo_title, meta_description, market_opportunity, target_customer,
  how_you_make_money, startup_cost, income_potential, competition_edge,
  getting_started_steps, tools_needed, time_to_first_customer, faq_json,
  external_links, internal_link_anchors, research_facts
)
select
  btrim(i.idea_id),
  nullif(btrim(i.category_id), ''),
  nullif(btrim(i.category_name), ''),
  nullif(btrim(i.category_slug), ''),
  nullif(btrim(i.subcategory_id), ''),
  nullif(btrim(i.subcategory_name), ''),
  nullif(btrim(i.subcategory_slug), ''),
  nullif(btrim(i.collection_id), ''),
  nullif(btrim(i.status), ''),
  nullif(btrim(i.focus_keyword), ''),
  nullif(btrim(i.additional_keyword_1), ''),
  nullif(btrim(i.additional_keyword_2), ''),
  nullif(btrim(i.business_description), ''),
  nullif(btrim(i.title), ''),
  nullif(btrim(i.slug), ''),          -- '' becomes NULL, never the empty slug
  nullif(btrim(i.summary), ''),
  bbi_json(i.tags),
  bbi_json(i.pros_json),
  bbi_json(i.cons_json),
  nullif(btrim(i.verdict), ''),
  nullif(btrim(i.trend_score), '')::int,
  nullif(btrim(i.tier), ''),
  nullif(btrim(i.seo_title), ''),
  nullif(btrim(i.meta_description), ''),
  nullif(btrim(i.market_opportunity), ''),
  nullif(btrim(i.target_customer), ''),
  nullif(btrim(i.how_you_make_money), ''),
  nullif(btrim(i.startup_cost), ''),
  nullif(btrim(i.income_potential), ''),
  nullif(btrim(i.competition_edge), ''),
  bbi_json(i.getting_started_steps),
  bbi_json(i.tools_needed),
  nullif(btrim(i.time_to_first_customer), ''),
  bbi_json(i.faq_json),
  bbi_json(i.external_links),
  bbi_json(i.internal_link_anchors),
  bbi_json(i.research_facts)
from ideas_import i
join ideas_import_qa q on q.idea_id = i.idea_id
where cardinality(q.blocking) = 0
on conflict (idea_id) do update set
  category_name          = coalesce(excluded.category_name,          t.category_name),
  category_slug          = coalesce(excluded.category_slug,          t.category_slug),
  subcategory_name       = coalesce(excluded.subcategory_name,       t.subcategory_name),
  subcategory_slug       = coalesce(excluded.subcategory_slug,       t.subcategory_slug),
  collection_id          = coalesce(excluded.collection_id,          t.collection_id),
  status                 = coalesce(excluded.status,                 t.status),
  focus_keyword          = coalesce(excluded.focus_keyword,          t.focus_keyword),
  additional_keyword_1   = coalesce(excluded.additional_keyword_1,   t.additional_keyword_1),
  additional_keyword_2   = coalesce(excluded.additional_keyword_2,   t.additional_keyword_2),
  business_description   = coalesce(excluded.business_description,   t.business_description),
  title                  = coalesce(excluded.title,                  t.title),
  slug                   = coalesce(excluded.slug,                   t.slug),
  summary                = coalesce(excluded.summary,                t.summary),
  tags                   = coalesce(excluded.tags,                   t.tags),
  pros_json              = coalesce(excluded.pros_json,              t.pros_json),
  cons_json              = coalesce(excluded.cons_json,              t.cons_json),
  verdict                = coalesce(excluded.verdict,                t.verdict),
  trend_score            = coalesce(excluded.trend_score,            t.trend_score),
  tier                   = coalesce(excluded.tier,                   t.tier),
  seo_title              = coalesce(excluded.seo_title,              t.seo_title),
  meta_description       = coalesce(excluded.meta_description,       t.meta_description),
  market_opportunity     = coalesce(excluded.market_opportunity,     t.market_opportunity),
  target_customer        = coalesce(excluded.target_customer,        t.target_customer),
  how_you_make_money     = coalesce(excluded.how_you_make_money,     t.how_you_make_money),
  startup_cost           = coalesce(excluded.startup_cost,           t.startup_cost),
  income_potential       = coalesce(excluded.income_potential,       t.income_potential),
  competition_edge       = coalesce(excluded.competition_edge,       t.competition_edge),
  getting_started_steps  = coalesce(excluded.getting_started_steps,  t.getting_started_steps),
  tools_needed           = coalesce(excluded.tools_needed,           t.tools_needed),
  time_to_first_customer = coalesce(excluded.time_to_first_customer, t.time_to_first_customer),
  faq_json               = coalesce(excluded.faq_json,               t.faq_json),
  external_links         = coalesce(excluded.external_links,         t.external_links),
  internal_link_anchors  = coalesce(excluded.internal_link_anchors,  t.internal_link_anchors),
  research_facts         = coalesce(excluded.research_facts,         t.research_facts);

-- Afterwards: what is still empty, so the next sheet knows what to fill.
select count(*) filter (where summary is null)            as no_summary,
       count(*) filter (where verdict is null)            as no_verdict,
       count(*) filter (where seo_title is null)          as no_seo_title,
       count(*) filter (where research_facts is null)     as no_research_facts,
       count(*) filter (where slug is null or slug = '')  as no_slug,
       count(*)                                           as total
from ideas;

-- Optional, once the merge looks right:  drop table ideas_import;
