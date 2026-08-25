# n8n setup — credentials, keys, sheet, Supabase

Everything the pipeline needs, in the order you set it up. One workflow file:
`n8n-idea-pipeline-v2.json`. It now holds **two branches** that share nothing
but the file, so importing it once gives you both.

| Branch | Trigger node | What it does | Writes to |
|---|---|---|---|
| Idea blueprints | `When clicking "Test workflow"` | Sheet row → Gemini narrative → Sheet → Supabase | `ideas` |
| FAQ pool | `FAQ Pool - Run` | Supabase categories → Gemini → guard → Supabase | `category_faqs` |

Per the standing rule, this is the same file edited, never a second workflow.

---

## 1. Credentials to create in n8n

Three, and only three. Create them under **Credentials → New**.

### a. Google Sheets — `googleSheetsOAuth2Api`

Already wired on the idea branch (`Read Pending Rows`, `Update Row in Sheet`).
It points at the existing sheet:

- Document: `1Jx4-kCmcKXl2eOsivEBWnlSmkkGOql49_x54ssKqDZ8` ("Superbase Data")
- Tab: gid `1572637316` ("Updated SuperBase1")
- Filter: `status = pending`

**You do not need a new sheet.** The FAQ branch reads its categories from
Supabase, not from a sheet, because the categories already live in the `ideas`
table and a second copy would drift. The sheet stays the source of truth for
idea blueprints, exactly as the brief requires.

### b. Supabase — `supabaseApi`

Host: your project URL. Key: the **service role** key, not the anon key.

This matters. `category_faqs` has row-level security that allows public
`SELECT` and no public writes at all — the browser cannot insert into it by
design. The pipeline is the only writer, so it needs the service role.

After importing, open both Supabase nodes on the FAQ branch (`Read Completed
Ideas`, `Write FAQ Pool`) and pick this credential from the dropdown. They
ship with `REPLACE_WITH_SUPABASE_CRED_ID` as a deliberate placeholder so an
exported file never carries a real credential id.

### c. Google Gemini — `googlePalmApi`

Used by the **idea branch** only (`Google Gemini Chat Model`). The FAQ branch
deliberately does not use it — see key rotation below.

---

## 2. Gemini API keys — environment, never node parameters

The FAQ branch reads its keys from the n8n environment:

```
GEMINI_API_KEY_1
GEMINI_API_KEY_2
...
GEMINI_API_KEY_7
```

Set as many as you have; the rotation code counts what exists. Set them in
n8n's environment (self-hosted: the container's env or `.env`; cloud:
Settings → Variables).

**Never paste a key into a node parameter.** Node parameters are saved into
this JSON file, and this file is in the repository. The rotation node throws a
named error if it finds no keys rather than failing silently.

### How rotation works

`N8N_PIPELINE_PLAN.md` lists key rotation as a hard constraint and it had
never been built — one exhausted key stalled a whole batch.

`Rotate Gemini Key` picks the next key on every call and stores the index in
workflow static data, so it survives between runs. `Gemini - Generate FAQs`
has `retryOnFail` with 3 tries and a 30-second wait, and because the retry
re-runs the rotation node, each attempt lands on a **different** key instead
of hammering the exhausted one.

This is also why the FAQ branch calls the Gemini REST endpoint through an HTTP
Request node rather than the LangChain Gemini node: that node binds to one
stored credential and cannot rotate.

---

## 3. Run it

### First run — one category, on purpose

Set `ONLY_CATEGORY` in the n8n environment to a single slug, for example:

```
ONLY_CATEGORY=productivity-workflow
```

That is the smallest category (4 ideas), so it is the cheapest thing to get
wrong. Open `FAQ Pool - Run` and execute. Read all twelve questions yourself
before spending keys on the other thirteen categories.

When you are happy, unset `ONLY_CATEGORY` and run again. Categories already
populated will conflict on `(category_slug, question)` and skip, so a re-run
is safe.

### What "done" looks like

```sql
select category_slug, count(*)
from category_faqs
where is_active
group by 1
order by 2 desc;
```

Fourteen rows, around twelve each. **Nothing needs deploying afterwards** —
the site reads this table at request time, so the pages fill in the moment the
rows land.

---

## 4. The guards, and why they reject rather than clean up

`Parse and Guard FAQs` throws — failing the whole category — rather than
silently dropping a bad row. A bad row here appears on a public page, and this
project has already had to strip invented content four separate times.

It rejects the batch if any answer:

| Guard | Why |
|---|---|
| names Claude, Perplexity, ChatGPT, OpenAI, Grok, Gemini or Copilot | public copy must never name the validation mechanism; this leak has already been cleaned out of twelve files |
| contains a four-digit year | these pages must not date |
| contains an emoji | zero emojis is a project-wide rule |
| is under 25 or over 130 words | the target is 40–90; outside that band the model has drifted |
| duplicates another question in the same batch | a pool of rephrasings is not a pool |
| comes back as fewer than 8 items | a thin pool is worse than none |

If a run fails, the error names the category and quotes the offending text.
Re-run that category; the model is non-deterministic and usually passes on the
second attempt. If one category fails repeatedly, its prompt inputs are the
problem, not the guard.

**Note the guard cannot catch a fabricated number** — no regex can tell a real
figure from an invented one. Rule 1 of the prompt forbids them, but the only
real check is you reading the first category's output before scaling. That is
what the `ONLY_CATEGORY` step is for.

---

## 5. Extending this to the other blocked templates

`/guide`, `/tools`, `/compare` and `/validate/[vertical]` are blocked on
content, not on engineering. Each needs the same shape as the FAQ branch:

1. an additive Supabase table with public-read RLS and service-role writes
2. a prompt carrying the same non-negotiables — no invented numbers, no vendor
   names, no emojis, no years, India-first, BBI's voice
3. a guard node that rejects rather than repairs
4. a route that reads the table and states honestly when it is empty

Add them as further branches in **this same file**. Do not create a second
workflow.
