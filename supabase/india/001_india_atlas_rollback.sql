-- Rollback for 001_india_atlas.sql. Drops ONLY india_* objects.
-- No existing BBI table, function or row is touched.
begin;

drop function if exists public.india_publish_set(uuid, jsonb, integer);
drop function if exists public.india_reserve_quota(text, date, integer, integer, integer, bigint);
drop function if exists public.india_fail_job(uuid, text, boolean, integer);
drop function if exists public.india_claim_job(text, integer);

drop table if exists public.india_quota_usage;
drop table if exists public.india_generation_jobs;
drop table if exists public.india_evidence;
drop table if exists public.india_set_tags;
drop table if exists public.india_idea_tags;
drop table if exists public.india_tags;
drop table if exists public.india_set_items;
drop table if exists public.india_sets;
-- india_idea_is_public is used by a policy on india_ideas: drop that policy,
-- then the function, then the table.
drop policy if exists india_ideas_public_read on public.india_ideas;
drop function if exists public.india_idea_is_public(public.india_ideas);
drop table if exists public.india_ideas;

drop function if exists public.india_touch_updated_at();

do $$ begin
  if exists (select 1 from pg_roles where rolname = 'india_worker') then
    revoke usage on schema public from india_worker;
    drop role india_worker;
  end if;
end $$;

commit;
