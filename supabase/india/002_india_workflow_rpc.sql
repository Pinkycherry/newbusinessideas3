-- BBI India Idea Atlas: the database side of the four n8n workflows.
--
-- ADDITIVE ONLY, on top of 001_india_atlas.sql. Every deterministic rule
-- (idempotent planning, eligibility, staging, the publish gate, rollback on
-- failure) lives here, where it runs in one transaction and can be tested,
-- instead of being spread across n8n nodes. n8n calls these through
-- PostgREST /rest/v1/rpc/<name>. Rollback: 002_india_workflow_rpc_rollback.sql.

begin;

create table public.india_workflow_errors (
  id          bigint generated always as identity primary key,
  workflow    text not null check (length(workflow) <= 120),
  node        text check (node is null or length(node) <= 120),
  execution   text check (execution is null or length(execution) <= 60),
  message     text not null check (length(message) <= 1000),
  created_at  timestamptz not null default now()
);
alter table public.india_workflow_errors enable row level security;
revoke all on public.india_workflow_errors from anon, authenticated;
grant select, insert on public.india_workflow_errors to india_worker;
create policy india_errors_worker on public.india_workflow_errors
  for all to india_worker using (true) with check (true);

-- Secrets never reach the log: API keys, JWTs and bearer tokens are masked.
create function public.india_redact(p text) returns text
language sql immutable set search_path = '' as $$
  select left(
    regexp_replace(
      regexp_replace(
        regexp_replace(coalesce(p, ''), 'AIza[0-9A-Za-z_\-]{20,}', '[redacted-key]', 'g'),
        'eyJ[0-9A-Za-z_\-]+\.[0-9A-Za-z_\-]+\.[0-9A-Za-z_\-]+', '[redacted-jwt]', 'g'),
      '(?i)(bearer|apikey|api_key|key|password)(["''=:\s]+)[^\s"'',&]+', '\1\2[redacted]', 'g'),
    1000)
$$;

create function public.india_log_error(p_workflow text, p_node text, p_message text, p_execution text default null)
returns void language sql security invoker set search_path = '' as $$
  insert into public.india_workflow_errors (workflow, node, execution, message)
  values (left(p_workflow, 120), left(p_node, 120), left(p_execution, 60), public.india_redact(p_message));
$$;

-- --------------------------------------------------------------- planner
-- Upserts set briefs as DRAFT sets and queues one fill job per set,
-- idempotently: re-running the planner creates nothing new.
-- p_briefs: [{slug,title,introduction,selection_criterion,family,audience,
--             selection_rules,hero_variant,requested_count,pilot}, ...]
create function public.india_plan_upsert(p_briefs jsonb, p_prompt_version text, p_pilot_only boolean default true)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  v_sets integer;
  v_jobs integer;
begin
  with ins as (
    insert into public.india_sets (slug, title, introduction, selection_criterion, family,
                                   audience, selection_rules, hero_variant, requested_count, status)
    select b.slug, b.title, b.introduction, b.selection_criterion, b.family, b.audience,
           coalesce(b.selection_rules, '{}'::jsonb), coalesce(b.hero_variant, 'ledger'),
           coalesce(b.requested_count, 12), 'draft'
      from jsonb_to_recordset(p_briefs) as b(
        slug text, title text, introduction text, selection_criterion text, family text,
        audience text, selection_rules jsonb, hero_variant text, requested_count smallint, pilot boolean)
    on conflict (slug) do nothing
    returning 1)
  select count(*) into v_sets from ins;

  with ins as (
    insert into public.india_generation_jobs (idempotency_key, job_type, set_id, max_attempts, prompt_version)
    select 'fill:' || s.slug || ':' || p_prompt_version, 'fill_set', s.id, 12, p_prompt_version
      from jsonb_to_recordset(p_briefs) as b(slug text, pilot boolean)
      join public.india_sets s on s.slug = b.slug
     where s.status in ('draft', 'ready')
       and (not p_pilot_only or coalesce(b.pilot, false))
    on conflict (idempotency_key) do nothing
    returning 1)
  select count(*) into v_jobs from ins;

  return jsonb_build_object('sets_created', v_sets, 'jobs_created', v_jobs);
end $$;

-- ------------------------------------------------------------- matching
-- An idea may join a set only if it is eligible AND satisfies the set's
-- typed rules. Unknown budgets never match a budget-capped set.
create function public.india_idea_fits_rules(i public.india_ideas, p_rules jsonb) returns boolean
language sql stable set search_path = '' as $$
  select i.publication_status in ('ready', 'published')
     and i.india_fit_status = 'pass'
     and i.factual_review_status in ('pass', 'not_required')
     and (not (p_rules ? 'work_modes') or (p_rules -> 'work_modes') ? i.work_mode)
     and (not (p_rules ? 'max_budget_inr')
          or (i.budget_upper_inr is not null and i.budget_upper_inr <= (p_rules ->> 'max_budget_inr')::integer))
$$;

-- --------------------------------------------------------- worker context
-- Everything the worker needs for one claimed job, bounded: the set, the
-- reasons already accepted, up to p_limit reusable India ideas that fit the
-- rules and are not yet accepted, and recent titles for de-duplication.
create function public.india_job_context(p_job_id uuid, p_limit integer default 20)
returns jsonb language plpgsql stable security invoker set search_path = '' as $$
declare
  v_job public.india_generation_jobs;
  v_set public.india_sets;
  v_fits jsonb;
begin
  select * into v_job from public.india_generation_jobs where id = p_job_id;
  if not found then raise exception 'india_job_context: job % not found', p_job_id; end if;
  select * into v_set from public.india_sets where id = v_job.set_id;
  v_fits := coalesce(v_job.staged_output -> 'fits', '{}'::jsonb);

  return jsonb_build_object(
    'job', jsonb_build_object('id', v_job.id, 'attempts', v_job.attempts, 'max_attempts', v_job.max_attempts,
                              'last_error', v_job.last_error),
    'set', jsonb_build_object('id', v_set.id, 'slug', v_set.slug, 'title', v_set.title,
                              'introduction', v_set.introduction, 'selection_criterion', v_set.selection_criterion,
                              'family', v_set.family, 'audience', v_set.audience,
                              'rules', v_set.selection_rules, 'requested_count', v_set.requested_count),
    'accepted_count', (select count(*) from jsonb_object_keys(v_fits)),
    'candidates', coalesce((
      select jsonb_agg(jsonb_build_object('concept_key', c.concept_key, 'title', c.title,
                                          'customer', c.customer, 'offer', c.offer, 'work_mode', c.work_mode))
        from (select i.* from public.india_ideas i
               where public.india_idea_fits_rules(i, v_set.selection_rules)
                 and not v_fits ? i.concept_key
               order by i.created_at
               limit greatest(1, least(p_limit, 40))) c), '[]'::jsonb),
    'recent_titles', coalesce((
      select jsonb_agg(t.title) from (select title from public.india_ideas order by created_at desc limit 200) t),
      '[]'::jsonb)
  );
end $$;

-- ---------------------------------------------------------------- staging
-- Persists one generation round in ONE transaction, BEFORE anything else can
-- fail, so a later error never costs another model call:
--   * new ideas go in as 'ready' (never 'published') with the statuses the
--     deterministic validator assigned; an existing concept_key is kept.
--   * fit reasons are merged into the job, only for ideas that really fit.
--   * tokens are added to the job and to the shared daily quota ledger.
--   * the job moves to 'ready' (enough ideas), 'needs_review' (out of rounds)
--     or back to 'queued' for another round.
create function public.india_stage_generation(
  p_job_id uuid, p_new_ideas jsonb, p_fits jsonb,
  p_input_tokens integer, p_output_tokens integer,
  p_model text, p_prompt_version text, p_usage_date date)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  v_job public.india_generation_jobs;
  v_set public.india_sets;
  v_fits jsonb;
  v_accepted integer;
  v_target integer;
  v_state text;
begin
  select * into v_job from public.india_generation_jobs where id = p_job_id for update;
  if not found then raise exception 'india_stage_generation: job % not found', p_job_id; end if;
  select * into v_set from public.india_sets where id = v_job.set_id;

  insert into public.india_ideas (
    concept_key, title, customer, problem, offer, customer_reach, revenue_model, first_test,
    main_risk, assumptions, skill_tags, work_mode, weekly_hours_min, weekly_hours_max,
    india_fit_status, factual_review_status, publication_status)
  select n.concept_key, n.title, n.customer, n.problem, n.offer, n.customer_reach, n.revenue_model,
         n.first_test, n.main_risk, n.assumptions, coalesce(n.skill_tags, '{}'), n.work_mode,
         n.weekly_hours_min, n.weekly_hours_max,
         coalesce(n.india_fit_status, 'needs_review'), coalesce(n.factual_review_status, 'needs_review'), 'ready'
    from jsonb_to_recordset(coalesce(p_new_ideas, '[]'::jsonb)) as n(
      concept_key text, title text, customer text, problem text, offer text, customer_reach text,
      revenue_model text, first_test text, main_risk text, assumptions text, skill_tags text[],
      work_mode text, weekly_hours_min smallint, weekly_hours_max smallint,
      india_fit_status text, factual_review_status text)
  on conflict (concept_key) do nothing;

  -- Keep only fit reasons for ideas that exist and fit this set's rules.
  select coalesce(v_job.staged_output -> 'fits', '{}'::jsonb)
         || coalesce((select jsonb_object_agg(f.key, left(f.value #>> '{}', 300))
                        from jsonb_each(coalesce(p_fits, '{}'::jsonb)) f
                        join public.india_ideas i on i.concept_key = f.key
                       where public.india_idea_fits_rules(i, v_set.selection_rules)
                         and length(f.value #>> '{}') between 5 and 300
                         and cardinality(regexp_split_to_array(trim(f.value #>> '{}'), '\s+')) <= 35),
                     '{}'::jsonb)
    into v_fits;

  v_accepted := (select count(*) from jsonb_object_keys(v_fits));
  v_target := least(v_set.requested_count, coalesce((v_set.selection_rules ->> 'max_items')::integer, 60));
  v_state := case
    when v_accepted >= v_target then 'ready'
    when v_job.attempts >= v_job.max_attempts then
      case when v_accepted >= coalesce((v_set.selection_rules ->> 'min_items')::integer, 8) then 'ready' else 'needs_review' end
    else 'queued' end;

  update public.india_generation_jobs
     set staged_output = jsonb_build_object('fits', v_fits),
         state = v_state,
         next_attempt_at = now() + interval '90 seconds',
         lease_owner = null,
         lease_expiry = null,
         last_error = null,
         model_version = p_model,
         prompt_version = p_prompt_version,
         input_tokens = input_tokens + greatest(p_input_tokens, 0),
         output_tokens = output_tokens + greatest(p_output_tokens, 0)
   where id = p_job_id;

  insert into public.india_quota_usage (usage_date, model_version) values (p_usage_date, p_model)
    on conflict do nothing;
  -- Input tokens were already reserved by india_try_reserve; add output only.
  update public.india_quota_usage
     set output_tokens = output_tokens + greatest(p_output_tokens, 0)
   where usage_date = p_usage_date and model_version = p_model;

  return jsonb_build_object('accepted', v_accepted, 'target', v_target, 'state', v_state);
end $$;

-- ---------------------------------------------------------- AI review gate
-- No human review step: a separate reviewer call must pass every NEW idea
-- before it can be published. Rejected ideas leave every staged set and the
-- job goes back to 'queued' to find replacements.
alter table public.india_ideas
  add column ai_review_status text not null default 'pending'
    check (ai_review_status in ('pending', 'pass', 'reject')),
  add column ai_review_note text check (ai_review_note is null or length(ai_review_note) <= 300),
  add column ai_reviewed_at timestamptz;

-- Ideas waiting for review that are staged in a job, oldest first.
create function public.india_review_queue(p_limit integer default 12)
returns jsonb language sql stable security invoker set search_path = '' as $$
  select coalesce(jsonb_agg(to_jsonb(q)), '[]'::jsonb) from (
    select distinct on (i.created_at, i.concept_key)
           i.concept_key, i.title, i.customer, i.problem, i.offer, i.customer_reach,
           i.revenue_model, i.first_test, i.main_risk, i.assumptions, i.work_mode
      from public.india_ideas i
      join public.india_generation_jobs j on j.staged_output -> 'fits' ? i.concept_key
     where i.ai_review_status = 'pending' and i.publication_status = 'ready'
     order by i.created_at, i.concept_key
     limit greatest(1, least(p_limit, 20))) q
$$;

-- p_results: [{"concept_key": "...", "verdict": "pass"|"reject", "note": "..."}]
create function public.india_apply_review(p_results jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  v_pass integer;
  v_reject integer;
  v_rejected text[];
begin
  with r as (
    select x.concept_key, x.verdict, left(coalesce(x.note, ''), 300) as note
      from jsonb_to_recordset(coalesce(p_results, '[]'::jsonb)) as x(concept_key text, verdict text, note text)
     where x.verdict in ('pass', 'reject')),
  u as (
    update public.india_ideas i
       set ai_review_status = r.verdict,
           ai_review_note = nullif(r.note, ''),
           ai_reviewed_at = now(),
           india_fit_status = case when r.verdict = 'reject' then 'needs_review' else i.india_fit_status end
      from r
     where i.concept_key = r.concept_key and i.ai_review_status = 'pending'
    returning i.concept_key, r.verdict)
  select count(*) filter (where verdict = 'pass'),
         count(*) filter (where verdict = 'reject'),
         coalesce(array_agg(concept_key) filter (where verdict = 'reject'), '{}')
    into v_pass, v_reject, v_rejected
    from u;

  if cardinality(v_rejected) > 0 then
    update public.india_generation_jobs j
       set staged_output = jsonb_build_object('fits', (j.staged_output -> 'fits') - v_rejected),
           state = case when j.state in ('ready', 'needs_review') then 'queued' else j.state end,
           next_attempt_at = now()
     where j.staged_output -> 'fits' ?| v_rejected
       and j.state <> 'published';
  end if;
  return jsonb_build_object('passed', v_pass, 'rejected', v_reject);
end $$;

-- Quota check + reservation in one call. The date is the PROVIDER's day:
-- requests-per-day quotas reset at midnight Pacific time, not Indian time.
create function public.india_try_reserve(p_model text, p_input_tokens integer,
                                         p_max_requests_per_day integer, p_max_input_tokens_per_day bigint)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  v_day date := (now() at time zone 'America/Los_Angeles')::date;
  v_ok boolean;
  v_wait integer;
begin
  v_ok := public.india_reserve_quota(p_model, v_day, 1, p_input_tokens, p_max_requests_per_day, p_max_input_tokens_per_day);
  v_wait := ceil(extract(epoch from (((v_day + 1)::timestamp at time zone 'America/Los_Angeles') - now())))::integer + 120;
  return jsonb_build_object('ok', v_ok, 'usage_date', v_day, 'seconds_to_reset', v_wait);
end $$;

-- Puts a claimed job back without spending an attempt (quota stop, bad
-- credentials). Used instead of india_fail_job when the job did nothing wrong.
create function public.india_defer_job(p_job_id uuid, p_seconds integer, p_reason text)
returns void language sql security invoker set search_path = '' as $$
  update public.india_generation_jobs
     set state = 'retry_wait',
         attempts = greatest(attempts - 1, 0),
         next_attempt_at = now() + make_interval(secs => greatest(60, least(p_seconds, 172800))),
         lease_owner = null,
         lease_expiry = null,
         last_error = public.india_redact(p_reason)
   where id = p_job_id;
$$;

-- ----------------------------------------------------------------- publish
-- Publishes every set whose job is 'ready'. Each set runs in its own
-- sub-transaction: a failed gate rolls back THAT set only (its ideas stay
-- 'ready', the previously published version stays visible) and parks the
-- job in 'needs_review' with the reason.
create function public.india_publish_ready()
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  v_job record;
  v_set public.india_sets;
  v_items jsonb;
  v_version integer;
  v_out jsonb := '[]'::jsonb;
  v_max integer;
begin
  for v_job in
    select * from public.india_generation_jobs
     where state = 'ready' and job_type = 'fill_set'
       and not exists (
         select 1 from public.india_ideas i
          where staged_output -> 'fits' ? i.concept_key and i.ai_review_status = 'pending'
            and i.publication_status = 'ready')
     order by updated_at
     limit 20
     for update skip locked
  loop
    begin
      select * into v_set from public.india_sets where id = v_job.set_id for update;
      v_max := least(v_set.requested_count, coalesce((v_set.selection_rules ->> 'max_items')::integer, 60));

      select coalesce(jsonb_agg(jsonb_build_object('idea_id', x.id, 'rank', x.rn, 'fit_reason', x.reason) order by x.rn), '[]'::jsonb)
        into v_items
        from (select i.id, f.value #>> '{}' as reason,
                     row_number() over (order by i.created_at, i.concept_key) as rn
                from jsonb_each(v_job.staged_output -> 'fits') f
                join public.india_ideas i on i.concept_key = f.key
               where public.india_idea_fits_rules(i, v_set.selection_rules)
                 and (i.publication_status = 'published' or i.ai_review_status = 'pass')
               order by i.created_at, i.concept_key
               limit v_max) x;

      update public.india_ideas i
         set publication_status = 'published'
       where i.publication_status = 'ready'
         and i.id in (select (e ->> 'idea_id')::uuid from jsonb_array_elements(v_items) e);

      v_version := public.india_publish_set(v_set.id, v_items, v_set.published_version);

      update public.india_generation_jobs
         set state = 'published', publication_version = v_version, last_error = null
       where id = v_job.id;
      v_out := v_out || jsonb_build_object('slug', v_set.slug, 'published_version', v_version,
                                           'items', jsonb_array_length(v_items));
    exception when others then
      update public.india_generation_jobs
         set state = 'needs_review', last_error = public.india_redact('publish: ' || sqlerrm)
       where id = v_job.id;
      v_out := v_out || jsonb_build_object('slug', v_set.slug, 'error', sqlerrm);
    end;
  end loop;
  return v_out;
end $$;

-- ------------------------------------------------------------------ grants
revoke all on function public.india_redact(text) from public, anon, authenticated;
revoke all on function public.india_log_error(text, text, text, text) from public, anon, authenticated;
revoke all on function public.india_plan_upsert(jsonb, text, boolean) from public, anon, authenticated;
revoke all on function public.india_idea_fits_rules(public.india_ideas, jsonb) from public, anon, authenticated;
revoke all on function public.india_job_context(uuid, integer) from public, anon, authenticated;
revoke all on function public.india_stage_generation(uuid, jsonb, jsonb, integer, integer, text, text, date) from public, anon, authenticated;
revoke all on function public.india_publish_ready() from public, anon, authenticated;
revoke all on function public.india_review_queue(integer) from public, anon, authenticated;
revoke all on function public.india_apply_review(jsonb) from public, anon, authenticated;
revoke all on function public.india_try_reserve(text, integer, integer, bigint) from public, anon, authenticated;
revoke all on function public.india_defer_job(uuid, integer, text) from public, anon, authenticated;

do $$
declare r text;
begin
  foreach r in array array['india_worker', 'service_role'] loop
    if exists (select 1 from pg_roles where rolname = r) then
      execute format('grant execute on function public.india_redact(text) to %I', r);
      execute format('grant execute on function public.india_log_error(text, text, text, text) to %I', r);
      execute format('grant execute on function public.india_plan_upsert(jsonb, text, boolean) to %I', r);
      execute format('grant execute on function public.india_idea_fits_rules(public.india_ideas, jsonb) to %I', r);
      execute format('grant execute on function public.india_job_context(uuid, integer) to %I', r);
      execute format('grant execute on function public.india_stage_generation(uuid, jsonb, jsonb, integer, integer, text, text, date) to %I', r);
      execute format('grant execute on function public.india_publish_ready() to %I', r);
      execute format('grant execute on function public.india_review_queue(integer) to %I', r);
      execute format('grant execute on function public.india_apply_review(jsonb) to %I', r);
      execute format('grant execute on function public.india_try_reserve(text, integer, integer, bigint) to %I', r);
      execute format('grant execute on function public.india_defer_job(uuid, integer, text) to %I', r);
      execute format('grant execute on function public.india_claim_job(text, integer) to %I', r);
      execute format('grant execute on function public.india_fail_job(uuid, text, boolean, integer) to %I', r);
      execute format('grant execute on function public.india_reserve_quota(text, date, integer, integer, integer, bigint) to %I', r);
      execute format('grant execute on function public.india_publish_set(uuid, jsonb, integer) to %I', r);
    end if;
  end loop;
end $$;

commit;
