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

---

## 4. The blog branch (added 2026-08-30)

A third branch in the same file, `n8n-idea-pipeline-v2.json`. Per the standing
rule this is the same workflow edited, never a second file — import it once and
you get all three branches.

| Branch | Trigger node | Writes to |
|---|---|---|
| Idea blueprints | `When clicking "Test workflow"` | Supabase `ideas` |
| FAQ pool | `FAQ Pool - Run` | Supabase `category_faqs` |
| **Blog posts** | **`Blog - Run`** | **WordPress** |

### Why WordPress and not Supabase

This is the thing worth knowing before you wire anything up. `/blog` on the
site does **not** read from Supabase. `src/lib/blog.server.ts` fetches from the
WordPress REST API at `{site}/wp-json/wp/v2`. So the pipeline posts to
WordPress and the site picks the post up on its own — **no site code changes at
all**. That is also why posts land in the right place automatically: the blog
cards read WordPress categories and the featured image straight from the API.

Posts are created as **`status: 'draft'`** on purpose. Nothing this pipeline
writes goes live until you open WordPress and publish it. Change `status` to
`'publish'` in `Create WordPress Post` only when you trust the output.

### The chain

```
Blog - Run
  -> Read Blog Queue          (Google Sheets, status = pending)
  -> Loop Blog Rows           (one row at a time)
  -> Rotate Gemini Key (Blog) (GEMINI_API_KEY_1..7, round-robin)
  -> Build Blog Prompt        (the writer prompt, with BBI's voice rules)
  -> Gemini - Write Post      (JSON out: title, slug, excerpt, HTML, image prompt, meta)
  -> Parse and Guard Post     (refuses thin, unsafe or malformed output)
  -> Gemini - Cover Image     (image generated from the model's own scene brief)
  -> Cover to Binary          (base64 -> binary for the media endpoint)
  -> Upload Cover to WordPress
  -> Create WordPress Post    (draft, with the cover as featured_media)
  -> Mark Blog Row Done       (writes slug, post id and link back to the sheet)
  -> back to Loop Blog Rows
```

### What you have to set

**One thing, if the sheet is the only change you want:** replace
`REPLACE_WITH_YOUR_SHEET_ID` in `Read Blog Queue` and `Mark Blog Row Done`, and
change the tab name from `Blog Queue` if yours differs.

Two environment variables, set once in n8n:

- `WORDPRESS_API_BASE` — e.g. `https://yoursite.com/wp-json/wp/v2`
- `GEMINI_API_KEY_1` … `GEMINI_API_KEY_7` — already used by the FAQ branch

One credential: an **HTTP Header Auth** credential holding a WordPress
Application Password, selected on `Upload Cover to WordPress` and
`Create WordPress Post`. Create it in WordPress under Users -> Profile ->
Application Passwords, then set the header to
`Authorization: Basic <base64 of user:app-password>`.

No key is ever written into the workflow file. `Rotate Gemini Key (Blog)` reads
them from `$env` for exactly that reason — an exported workflow that carries a
live key is a leaked key.

### The sheet

`blog-queue-template.csv` in the repository root has the exact columns, with
three worked example rows. Paste it into a new tab, name the tab `Blog Queue`,
and the branch reads it as-is.

| Column | You fill in | Written back by the pipeline |
|---|---|---|
| `row_id` | yes — any unique value | matched on |
| `status` | `pending` | set to `done` |
| `title` | working title (the model may improve it) | |
| `primary_keyword` | the one phrase this post targets | |
| `secondary_keywords` | comma-separated, in one quoted cell | |
| `category` | the BBI category it belongs to | |
| `search_intent` | informational / commercial / transactional | |
| `angle` | **the most important column.** A sentence telling the writer what to actually do. Generic rows produce generic posts. | |
| `internal_link` | a real URL on the site to link to | |
| `word_count` | target length | |
| `published_slug` | leave empty | filled |
| `wp_post_id` | leave empty | filled |
| `wp_edit_url` | leave empty | filled |

### Guards, and why each one exists

`Parse and Guard Post` throws rather than publishing when the model returns an
`<h1>` (the theme already renders the title, so a second one breaks the
document outline and the page's SEO), when the HTML carries `<script>`,
`<style>` or an inline event handler, when the post is under 350 words, when
the title exceeds 80 characters or the meta description exceeds 165, or when
any required field is missing.

The image step is the one deliberate exception: it is set to
`continueRegularOutput`, so a failed or refused image does **not** throw away a
good post. It publishes without a cover and the row still gets marked done.

### How many workflows the site needs, end to end

Three branches cover the content lifecycle, and they are all in this one file:

1. **Idea blueprints** — the library itself. Sheet to Supabase `ideas`.
2. **FAQ pool** — 10-15 FAQs per category, drawn onto category hubs and idea
   pages. Supabase `category_faqs`. Infrastructure is live; the pool is still
   empty and needs one run.
3. **Blog posts** — top-of-funnel search traffic. WordPress.

Two more are worth building later, and neither exists yet:

4. **Listicle refresh** — regenerate `/list/[slug]` entries as the library
   grows, so a "15 best X" page does not go stale the moment idea 16 lands.
5. **Internal link maintenance** — re-scan published posts for phrases that now
   have a matching idea or category page and add the link.

They are listed here rather than built because both edit content that already
exists, which is a different risk class from appending new rows, and
`BUTTERFLY_EFFECT.md` says that kind of change gets its own deliberate round.


---

## 5. n8n Cloud specifics (verified against the live instance, 2026-08-31)

Working directly inside the live instance turned up three defects that were
invisible from the exported file. All three are fixed; the notes stay because
each will bite again if the workflow is ever rebuilt from scratch.

### $env does not exist on n8n Cloud

The key-rotation nodes originally read `$env.GEMINI_API_KEY_1..7`. **n8n Cloud
does not let users set environment variables at all**, so on Cloud that lookup
always returns nothing and the node throws "No Gemini keys found" however many
keys you own. It looked like a missing-key problem; it was a wrong-store
problem.

Both rotation nodes now read **n8n Variables** (`$vars`) first and fall back to
`$env`, so the same workflow runs on Cloud today and on a self-hosted instance
later without an edit.

**Where the keys go:** n8n -> Settings -> Variables, named exactly
`GEMINI_API_KEY_1` through `GEMINI_API_KEY_7`. One is enough to start; the
rotation simply cycles through however many exist.

Keys are still never written into a node parameter. A parameter travels inside
every export of the workflow, and a Google API key that reaches a repository is
scraped and abused within minutes.

### Two trigger nodes did not survive the import

The FAQ Pool and Blog branches arrived with **no trigger at all** — both were
orphaned chains starting at `Read Completed Ideas` and `Read Blog Queue`, so
neither could be run from the editor. `FAQ Pool - Run` and `Blog - Run` were
re-added and wired to the head of each branch.

Worth checking after any import: the workflow should show **30 nodes and three
manual triggers**.

### The WordPress nodes used an auth type credential setup rejects

Both WordPress HTTP nodes specified the plain `httpHeaderAuth` generic type.
n8n only accepts that when you are **reusing** an existing credential — trying
to create a new one against it is rejected outright. They now use
`httpTemplatedCustomAuth`.

WordPress application passwords authenticate as HTTP Basic, so the credential
template is:

```json
{"headers": {"Authorization": "Basic {{api_key}}"}}
```

where `api_key` is the base64 encoding of `username:application-password`.

### What still needs a human, and why

Credentials hold secrets, and no agent can create them through the MCP
connection — only list them. As of 2026-08-31 the instance holds exactly one
credential, Google Sheets. These are still missing:

| Needed by | Credential | Nodes |
|---|---|---|
| Branch 1 | Google Gemini (PaLM) API | `Google Gemini Chat Model` |
| Branches 1 and 2 | Supabase (service role key) | `Sync to Supabase`, `Read Completed Ideas`, `Write FAQ Pool` |
| Branch 3 | Header Auth for WordPress | `Upload Cover to WordPress`, `Create WordPress Post` |

Plus two node parameters: `Read Blog Queue` and `Mark Blog Row Done` still
carry `REPLACE_WITH_YOUR_SHEET_ID`.
