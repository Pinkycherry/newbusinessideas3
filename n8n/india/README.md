# India Idea Atlas: n8n workflows

Four workflows that fill the new `/india/ideas` section (`BBI_EXPANSION.md`).
They write only `india_*` tables. The existing idea pipeline
(`n8n-idea-pipeline-v3.json`) is not touched.

| Workflow                  | Runs             | What it does                                                                                                                                                                                                                  |
| ------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BBI India 1 Planner       | every hour       | Turns the 48 briefs in `lib/briefs.js` into draft sets (an AI agent writes each set's introduction and selection criterion), 12 per run, pilot first, and queues one job per pilot set. Idempotent.                           |
| BBI India 2 Worker        | every 2 minutes  | Claims one due job (lease), reserves quota, asks the generator agent for up to 3 new ideas plus a fit verdict on up to 20 existing India ideas, validates and de-duplicates in code, and stages the round in one transaction. |
| BBI India 3 Publisher     | every 20 minutes | The reviewer agent passes or rejects every new idea (no human step), then publishes every set whose ideas are all reviewed, one transaction per set. A failed set keeps its previous version live.                            |
| BBI India 4 Error handler | on any failure   | Logs a redacted, compact error to `india_workflow_errors`.                                                                                                                                                                    |

Browsing the site never calls a model. Every rule that must hold lives in SQL
(`supabase/india/002_india_workflow_rpc.sql`) where it is tested:
idempotent planning, eligibility, staging, the review gate and the publish gate.

## Deploy (no work inside n8n)

```
N8N_URL=https://<you>.app.n8n.cloud \
N8N_API_KEY=<n8n Settings > n8n API > Create API key> \
GEMINI_API_KEY=<Google AI Studio key> \
SUPABASE_SERVICE_ROLE_KEY=<Supabase > Settings > API > service_role> \
node n8n/india/deploy.mjs
```

It creates two credentials (`BBI India Gemini`, `BBI India Supabase`), creates
or updates the four workflows by name, links the error handler and activates
them. Re-running updates in place. `DRY_RUN=1` prints what it would do.
To reuse credentials that already exist in n8n, pass `GEMINI_CRED_ID` /
`SUPABASE_CRED_ID` instead of the keys.

Settings (all optional env vars, baked into each workflow's Config node):
`GEMINI_MODEL` (default `gemini-3.8-flash`, a free-tier model per the pricing
page on 2026-09-28), `MAX_REQUESTS_PER_DAY` (100), `MAX_INPUT_TOKENS_PER_DAY`
(1,000,000), `MAX_OUTPUT_TOKENS` (8,000), `RECORDS_PER_CALL` (3),
`PILOT_ONLY` (true). Check the real limits for your key in AI Studio
(https://aistudio.google.com/rate-limit) and set these at or below them.
Daily quotas reset at midnight Pacific time; the quota ledger uses that day.

## Behaviour worth knowing

- **Zero fabricated numbers.** Generated prose may not contain any digit, rupee
  amount, percentage or "lakh/crore". Budgets stay null ("Not estimated") until
  an evidence step exists, so the four budget-capped sets never publish in the
  pilot. Weekly hours are allowed and shown as assumptions.
- **Regulated or doubtful ideas are never published**: they are stored with
  `needs_review` and excluded from every set.
- **Retries:** 429/5xx/network errors back off exponentially with jitter in the
  database (`india_fail_job`), honouring a provider retry delay when given.
  Malformed output gets one retry, then the job fails. A refused credential
  parks jobs for six hours without spending attempts. Quota exhaustion parks
  jobs until the provider reset.
- **Token counts** are estimates (characters / 4); n8n's agent node does not
  expose exact usage.
- **Free tier data use:** on the free tier, Google may use prompts and
  responses to improve its products (pricing page). Nothing private is sent:
  only set briefs and India idea text.
- **n8n hosting is not free by default.** n8n Cloud's free trial ends; a
  self-hosted instance runs only while its host is on.

## Tests

```
node --test n8n/india/test/*.test.mjs   # validator + workflow structure
node n8n/india/build.mjs                # regenerate workflows/*.json
```

The SQL was tested on a local Postgres 16 (apply, plan twice, two rounds,
shared idea across two sets, review reject and requeue, publish, failed
publish keeps the old version, quota stop, defer without spending an attempt,
secret redaction, anon isolation, rollback to zero objects). The workflows are
import-shaped and structurally tested, NOT yet run inside n8n.
