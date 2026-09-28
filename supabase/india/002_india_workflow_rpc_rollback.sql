-- Rollback for 002_india_workflow_rpc.sql. Drops only what 002 added.
begin;
drop function if exists public.india_publish_ready();
drop function if exists public.india_defer_job(uuid, integer, text);
drop function if exists public.india_try_reserve(text, integer, integer, bigint);
drop function if exists public.india_apply_review(jsonb);
drop function if exists public.india_review_queue(integer);
drop function if exists public.india_stage_generation(uuid, jsonb, jsonb, integer, integer, text, text, date);
drop function if exists public.india_job_context(uuid, integer);
drop function if exists public.india_idea_fits_rules(public.india_ideas, jsonb);
drop function if exists public.india_plan_upsert(jsonb, text, boolean);
drop function if exists public.india_log_error(text, text, text, text);
drop function if exists public.india_redact(text);
drop table if exists public.india_workflow_errors;
alter table if exists public.india_ideas
  drop column if exists ai_reviewed_at,
  drop column if exists ai_review_note,
  drop column if exists ai_review_status;
commit;
