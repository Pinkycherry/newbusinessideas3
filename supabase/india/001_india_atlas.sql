-- BBI India Idea Atlas: schema (see BBI_EXPANSION.md)
--
-- ADDITIVE ONLY. Every object created here is prefixed india_ and nothing in
-- this file references, alters or reads an existing table (ideas, blog_posts,
-- category_faqs, ...). Rollback: 001_india_atlas_rollback.sql.
--
-- NOT APPLIED AUTOMATICALLY. Run it in the Supabase SQL editor after review.
-- The worker role is created NOLOGIN; give it a password yourself afterwards:
--   alter role india_worker with login password '<choose one, keep it out of git>';

begin;

-- ---------------------------------------------------------------- ideas
create table public.india_ideas (
  id                     uuid primary key default gen_random_uuid(),
  concept_key            text not null unique
                           check (concept_key ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(concept_key) <= 120),
  title                  text not null check (length(title) between 8 and 90),
  country                char(2) not null default 'IN' check (country = 'IN'),
  customer               text not null check (length(customer) between 10 and 400),
  problem                text not null check (length(problem) between 10 and 400),
  offer                  text not null check (length(offer) between 10 and 400),
  customer_reach         text not null check (length(customer_reach) between 10 and 400),
  revenue_model          text not null check (length(revenue_model) between 10 and 400),
  first_test             text not null check (length(first_test) between 10 and 400),
  main_risk              text not null check (length(main_risk) between 10 and 400),
  assumptions            text check (assumptions is null or length(assumptions) <= 400),
  skill_tags             text[] not null default '{}' check (cardinality(skill_tags) <= 8),
  work_mode              text not null check (work_mode in ('home', 'local', 'online', 'hybrid')),
  weekly_hours_min       smallint check (weekly_hours_min between 1 and 80),
  weekly_hours_max       smallint check (weekly_hours_max between 1 and 80),
  budget_lower_inr       integer check (budget_lower_inr >= 0),
  budget_upper_inr       integer check (budget_upper_inr >= 0),
  budget_basis           text check (budget_basis is null or length(budget_basis) <= 300),
  budget_excludes        text check (budget_excludes is null or length(budget_excludes) <= 300),
  budget_estimate_date   date,
  india_fit_status       text not null default 'pending'
                           check (india_fit_status in ('pending', 'pass', 'fail', 'needs_review')),
  factual_review_status  text not null default 'pending'
                           check (factual_review_status in ('pending', 'pass', 'not_required', 'needs_review', 'fail')),
  publication_status     text not null default 'draft'
                           check (publication_status in ('draft', 'ready', 'published', 'withdrawn')),
  content_version        integer not null default 1 check (content_version >= 1),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),

  constraint india_ideas_hours_order  check (weekly_hours_min is null or weekly_hours_max is null or weekly_hours_min <= weekly_hours_max),
  constraint india_ideas_budget_order check (budget_lower_inr is null or budget_upper_inr is null or budget_lower_inr <= budget_upper_inr),
  -- A number without its basis is not an estimate. Either both bounds are
  -- unknown, or the basis and the estimate date travel with them.
  constraint india_ideas_budget_basis check (
    (budget_lower_inr is null and budget_upper_inr is null)
    or (budget_basis is not null and budget_estimate_date is not null)
  ),
  -- Budget fields hold money, not a revenue model. Crude but effective guard
  -- against the mismatch BBI_EXPANSION.md calls out.
  constraint india_ideas_basis_not_revenue check (budget_basis is null or budget_basis !~* '(subscription|per month retainer|commission of|revenue model)'),
  -- 150 to 230 words across the prose is the target; this is the hard ceiling.
  constraint india_ideas_prose_ceiling check (
    length(customer) + length(problem) + length(offer) + length(customer_reach)
    + length(revenue_model) + length(first_test) + length(main_risk)
    + coalesce(length(assumptions), 0) <= 2200
  ),
  -- Titles like "Start an AI business" are not ideas.
  constraint india_ideas_title_not_empty check (title !~* '^(start|begin|launch) (an?|your) [a-z]+ business$')
);

create index india_ideas_public_idx on public.india_ideas (publication_status, india_fit_status, factual_review_status);
create index india_ideas_work_mode_idx on public.india_ideas (work_mode);
create index india_ideas_budget_upper_idx on public.india_ideas (budget_upper_inr);

-- ------------------------------------------------------------------ sets
create table public.india_sets (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 90),
  title              text not null check (length(title) between 8 and 90),
  introduction       text not null check (length(introduction) between 20 and 800),
  selection_criterion text not null check (length(selection_criterion) between 10 and 300),
  family             text not null check (family in (
                       'budget', 'time', 'setting', 'ai-digital', 'gaming', 'retail-support',
                       'education', 'food-ecosystem', 'repair-reuse', 'agriculture-support',
                       'creative-services', 'business-operations')),
  audience           text check (audience is null or length(audience) <= 120),
  -- Typed rules the worker and the publisher both enforce, e.g.
  -- {"max_budget_inr": 10000, "work_modes": ["home","online"], "min_items": 8, "max_items": 20}
  selection_rules    jsonb not null default '{}'::jsonb check (jsonb_typeof(selection_rules) = 'object'),
  hero_variant       text not null default 'ledger' check (hero_variant in ('ledger', 'wiring', 'console', 'route')),
  requested_count    smallint not null default 12 check (requested_count between 1 and 60),
  status             text not null default 'draft' check (status in ('draft', 'ready', 'published', 'withdrawn')),
  reviewed_at        timestamptz,
  published_at       timestamptz,
  published_version  integer not null default 0 check (published_version >= 0),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  -- Word ceiling on the intro (<= 100 words).
  constraint india_sets_intro_words check (cardinality(regexp_split_to_array(trim(introduction), '\s+')) <= 100)
);

create index india_sets_public_idx on public.india_sets (status, family, slug);

-- ------------------------------------------------------------ memberships
create table public.india_set_items (
  set_id      uuid not null references public.india_sets (id) on delete cascade,
  idea_id     uuid not null references public.india_ideas (id) on delete restrict,
  rank        smallint not null check (rank between 1 and 500),
  fit_reason  text not null check (length(fit_reason) between 5 and 300
                and cardinality(regexp_split_to_array(trim(fit_reason), '\s+')) <= 35),
  created_at  timestamptz not null default now(),
  primary key (set_id, idea_id),
  unique (set_id, rank)
);

create index india_set_items_set_rank_idx on public.india_set_items (set_id, rank);
create index india_set_items_idea_idx on public.india_set_items (idea_id);

-- ------------------------------------------------------------------ tags
create table public.india_tags (
  id     uuid primary key default gen_random_uuid(),
  kind   text not null check (kind in ('industry', 'customer', 'skill', 'setting', 'time')),
  slug   text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  label  text not null check (length(label) between 2 and 60),
  unique (kind, slug)
);

create table public.india_idea_tags (
  idea_id uuid not null references public.india_ideas (id) on delete cascade,
  tag_id  uuid not null references public.india_tags (id) on delete cascade,
  primary key (idea_id, tag_id)
);

create table public.india_set_tags (
  set_id uuid not null references public.india_sets (id) on delete cascade,
  tag_id uuid not null references public.india_tags (id) on delete cascade,
  primary key (set_id, tag_id)
);

-- --------------------------------------------------------------- evidence
create table public.india_evidence (
  id                   uuid primary key default gen_random_uuid(),
  idea_id              uuid not null references public.india_ideas (id) on delete cascade,
  claim_key            text not null check (length(claim_key) between 2 and 60),
  source_url           text not null check (source_url ~ '^https://'),
  finding              text not null check (length(finding) between 10 and 400),
  checked_at           timestamptz not null,
  verification_status  text not null default 'unverified'
                         check (verification_status in ('unverified', 'verified', 'rejected')),
  created_at           timestamptz not null default now(),
  unique (idea_id, claim_key, source_url)
);

-- ----------------------------------------------------------------- jobs
create table public.india_generation_jobs (
  id                 uuid primary key default gen_random_uuid(),
  idempotency_key    text not null unique check (length(idempotency_key) between 8 and 200),
  job_type           text not null check (job_type in ('plan_set', 'fill_set', 'publish_set')),
  set_id             uuid references public.india_sets (id) on delete set null,
  state              text not null default 'queued'
                       check (state in ('queued', 'running', 'ready', 'needs_review', 'retry_wait', 'failed', 'published')),
  attempts           smallint not null default 0 check (attempts >= 0),
  max_attempts       smallint not null default 5 check (max_attempts between 1 and 20),
  next_attempt_at    timestamptz not null default now(),
  lease_owner        text,
  lease_expiry       timestamptz,
  model_version      text,
  prompt_version     text,
  input_tokens       integer not null default 0 check (input_tokens >= 0),
  output_tokens      integer not null default 0 check (output_tokens >= 0),
  -- Generated output is stored BEFORE later steps run, so a DB failure never
  -- forces a second paid-for (or quota-consuming) model call.
  staged_output      jsonb,
  last_error         text check (last_error is null or length(last_error) <= 1000),
  publication_version integer,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index india_jobs_due_idx on public.india_generation_jobs (state, next_attempt_at);

-- Daily quota ledger shared by every worker on the same model project.
create table public.india_quota_usage (
  usage_date     date not null,
  model_version  text not null,
  requests       integer not null default 0 check (requests >= 0),
  input_tokens   bigint not null default 0 check (input_tokens >= 0),
  output_tokens  bigint not null default 0 check (output_tokens >= 0),
  primary key (usage_date, model_version)
);

-- ------------------------------------------------------- updated_at trigger
create function public.india_touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger india_ideas_touch before update on public.india_ideas
  for each row execute function public.india_touch_updated_at();
create trigger india_sets_touch before update on public.india_sets
  for each row execute function public.india_touch_updated_at();
create trigger india_jobs_touch before update on public.india_generation_jobs
  for each row execute function public.india_touch_updated_at();

-- ---------------------------------------------------------------- public view
-- "Eligible" in one place: published, passed India fit, and factual review
-- passed or not required. Everything public reads through this definition.
create function public.india_idea_is_public(i public.india_ideas) returns boolean
language sql stable set search_path = '' as $$
  select i.publication_status = 'published'
     and i.india_fit_status = 'pass'
     and i.factual_review_status in ('pass', 'not_required')
$$;

-- ---------------------------------------------------------------- roles
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'india_worker') then
    create role india_worker nologin;
  end if;
end $$;

grant usage on schema public to india_worker;
grant select, insert, update on
  public.india_ideas, public.india_sets, public.india_set_items, public.india_tags,
  public.india_idea_tags, public.india_set_tags, public.india_evidence,
  public.india_generation_jobs, public.india_quota_usage
  to india_worker;
grant delete on public.india_set_items, public.india_idea_tags, public.india_set_tags to india_worker;

-- Public (anon + authenticated) may only SELECT, and RLS below narrows that
-- to published, eligible rows. Nothing else is granted.
revoke all on
  public.india_ideas, public.india_sets, public.india_set_items, public.india_tags,
  public.india_idea_tags, public.india_set_tags, public.india_evidence,
  public.india_generation_jobs, public.india_quota_usage
  from anon, authenticated;
grant select on
  public.india_ideas, public.india_sets, public.india_set_items, public.india_tags,
  public.india_idea_tags, public.india_set_tags, public.india_evidence
  to anon, authenticated;

-- ------------------------------------------------------------------- RLS
alter table public.india_ideas           enable row level security;
alter table public.india_sets            enable row level security;
alter table public.india_set_items       enable row level security;
alter table public.india_tags            enable row level security;
alter table public.india_idea_tags       enable row level security;
alter table public.india_set_tags        enable row level security;
alter table public.india_evidence        enable row level security;
alter table public.india_generation_jobs enable row level security;
alter table public.india_quota_usage     enable row level security;

create policy india_ideas_public_read on public.india_ideas
  for select to anon, authenticated
  using (public.india_idea_is_public(india_ideas));

create policy india_sets_public_read on public.india_sets
  for select to anon, authenticated
  using (status = 'published');

-- A membership row alone must never leak a draft: both ends must be public.
create policy india_set_items_public_read on public.india_set_items
  for select to anon, authenticated
  using (
    exists (select 1 from public.india_sets s where s.id = set_id and s.status = 'published')
    and exists (select 1 from public.india_ideas i where i.id = idea_id and public.india_idea_is_public(i))
  );

create policy india_tags_public_read on public.india_tags
  for select to anon, authenticated using (true);

create policy india_idea_tags_public_read on public.india_idea_tags
  for select to anon, authenticated
  using (exists (select 1 from public.india_ideas i where i.id = idea_id and public.india_idea_is_public(i)));

create policy india_set_tags_public_read on public.india_set_tags
  for select to anon, authenticated
  using (exists (select 1 from public.india_sets s where s.id = set_id and s.status = 'published'));

create policy india_evidence_public_read on public.india_evidence
  for select to anon, authenticated
  using (
    verification_status = 'verified'
    and exists (select 1 from public.india_ideas i where i.id = idea_id and public.india_idea_is_public(i))
  );

-- The worker sees and writes the India namespace, and nothing else exists for it.
create policy india_ideas_worker on public.india_ideas for all to india_worker using (true) with check (true);
create policy india_sets_worker on public.india_sets for all to india_worker using (true) with check (true);
create policy india_set_items_worker on public.india_set_items for all to india_worker using (true) with check (true);
create policy india_tags_worker on public.india_tags for all to india_worker using (true) with check (true);
create policy india_idea_tags_worker on public.india_idea_tags for all to india_worker using (true) with check (true);
create policy india_set_tags_worker on public.india_set_tags for all to india_worker using (true) with check (true);
create policy india_evidence_worker on public.india_evidence for all to india_worker using (true) with check (true);
create policy india_jobs_worker on public.india_generation_jobs for all to india_worker using (true) with check (true);
create policy india_quota_worker on public.india_quota_usage for all to india_worker using (true) with check (true);

-- ------------------------------------------------------ job claim (leases)
-- Atomically claims ONE due job. Expired leases are reclaimable. Invoker
-- rights: only a role that can already update jobs can claim one.
create function public.india_claim_job(p_worker text, p_lease_seconds integer default 600)
returns setof public.india_generation_jobs
language plpgsql security invoker set search_path = '' as $$
begin
  return query
  update public.india_generation_jobs j
     set state = 'running',
         attempts = j.attempts + 1,
         lease_owner = p_worker,
         lease_expiry = now() + make_interval(secs => greatest(60, least(p_lease_seconds, 3600)))
   where j.id = (
     select c.id from public.india_generation_jobs c
      where c.attempts < c.max_attempts
        and (
          (c.state in ('queued', 'retry_wait') and c.next_attempt_at <= now())
          or (c.state = 'running' and c.lease_expiry < now())
        )
      order by c.next_attempt_at, c.created_at
      limit 1
      for update skip locked
   )
  returning j.*;
end $$;

-- Records a failure: retry with bounded exponential backoff and jitter, or
-- fail for good once attempts are spent. Auth errors never retry.
create function public.india_fail_job(p_job_id uuid, p_error text, p_retryable boolean, p_retry_after_seconds integer default null)
returns void
language plpgsql security invoker set search_path = '' as $$
declare
  v_attempts smallint;
  v_max smallint;
  v_delay integer;
begin
  select attempts, max_attempts into v_attempts, v_max
    from public.india_generation_jobs where id = p_job_id for update;
  v_delay := coalesce(p_retry_after_seconds,
                      least(3600, (30 * power(2, greatest(v_attempts - 1, 0)))::integer))
             + floor(random() * 30)::integer;
  update public.india_generation_jobs
     set state = case when p_retryable and v_attempts < v_max then 'retry_wait' else 'failed' end,
         next_attempt_at = now() + make_interval(secs => v_delay),
         lease_owner = null,
         lease_expiry = null,
         last_error = left(p_error, 1000)
   where id = p_job_id;
end $$;

-- Reserves quota BEFORE a model call. Returns false (and reserves nothing)
-- when the day's request or token ceiling would be crossed, so every worker
-- sharing the project stops cleanly and jobs stay queued.
create function public.india_reserve_quota(
  p_model text, p_usage_date date, p_requests integer, p_input_tokens integer,
  p_max_requests_per_day integer, p_max_input_tokens_per_day bigint)
returns boolean
language plpgsql security invoker set search_path = '' as $$
declare
  v_row public.india_quota_usage;
begin
  insert into public.india_quota_usage (usage_date, model_version)
    values (p_usage_date, p_model) on conflict do nothing;
  select * into v_row from public.india_quota_usage
    where usage_date = p_usage_date and model_version = p_model for update;
  if v_row.requests + p_requests > p_max_requests_per_day
     or v_row.input_tokens + p_input_tokens > p_max_input_tokens_per_day then
    return false;
  end if;
  update public.india_quota_usage
     set requests = requests + p_requests, input_tokens = input_tokens + p_input_tokens
   where usage_date = p_usage_date and model_version = p_model;
  return true;
end $$;

-- --------------------------------------------------- transactional publish
-- Replaces a set's memberships and publishes it in ONE transaction. Any
-- failed check raises, the whole call rolls back, and the previously
-- published version stays exactly as it was.
-- p_items: [{"idea_id": "...", "rank": 1, "fit_reason": "..."}, ...]
create function public.india_publish_set(p_set_id uuid, p_items jsonb, p_expected_version integer)
returns integer
language plpgsql security invoker set search_path = '' as $$
declare
  v_set public.india_sets;
  v_rules jsonb;
  v_min integer;
  v_max integer;
  v_max_budget integer;
  v_count integer;
  v_bad integer;
begin
  select * into v_set from public.india_sets where id = p_set_id for update;
  if not found then raise exception 'india_publish_set: set % not found', p_set_id; end if;
  if v_set.published_version <> p_expected_version then
    raise exception 'india_publish_set: version moved (% vs %)', v_set.published_version, p_expected_version;
  end if;

  v_rules := v_set.selection_rules;
  v_min := coalesce((v_rules ->> 'min_items')::integer, 8);
  v_max := coalesce((v_rules ->> 'max_items')::integer, 60);
  v_max_budget := (v_rules ->> 'max_budget_inr')::integer;

  select count(*) into v_count from jsonb_array_elements(p_items);
  if v_count < v_min or v_count > v_max then
    raise exception 'india_publish_set: % items, rules need % to %', v_count, v_min, v_max;
  end if;

  -- Every idea must be eligible, and must satisfy the set's typed rules.
  -- Unknown budgets never match a budget-capped set.
  select count(*) into v_bad
    from jsonb_array_elements(p_items) it
    left join public.india_ideas i on i.id = (it ->> 'idea_id')::uuid
   where i.id is null
      or not public.india_idea_is_public(i)
      or (v_max_budget is not null and (i.budget_upper_inr is null or i.budget_upper_inr > v_max_budget))
      or (v_rules ? 'work_modes' and not (v_rules -> 'work_modes') ? i.work_mode);
  if v_bad > 0 then
    raise exception 'india_publish_set: % ideas are not eligible for this set', v_bad;
  end if;

  delete from public.india_set_items where set_id = p_set_id;
  insert into public.india_set_items (set_id, idea_id, rank, fit_reason)
    select p_set_id, (it ->> 'idea_id')::uuid, (it ->> 'rank')::smallint, it ->> 'fit_reason'
      from jsonb_array_elements(p_items) it;

  update public.india_sets
     set status = 'published',
         published_version = published_version + 1,
         published_at = now(),
         reviewed_at = coalesce(reviewed_at, now())
   where id = p_set_id;

  return v_set.published_version + 1;
end $$;

revoke all on function public.india_claim_job(text, integer) from public, anon, authenticated;
revoke all on function public.india_fail_job(uuid, text, boolean, integer) from public, anon, authenticated;
revoke all on function public.india_reserve_quota(text, date, integer, integer, integer, bigint) from public, anon, authenticated;
revoke all on function public.india_publish_set(uuid, jsonb, integer) from public, anon, authenticated;
grant execute on function public.india_claim_job(text, integer) to india_worker;
grant execute on function public.india_fail_job(uuid, text, boolean, integer) to india_worker;
grant execute on function public.india_reserve_quota(text, date, integer, integer, integer, bigint) to india_worker;
grant execute on function public.india_publish_set(uuid, jsonb, integer) to india_worker;
grant execute on function public.india_idea_is_public(public.india_ideas) to anon, authenticated, india_worker;

commit;
