# n8n workflows — import guide

The old n8n instance ran out of free plan. The workflows live here now, split
into three files so each can be imported and run on its own.

| File | Workflow | Trigger | What it does |
|---|---|---|---|
| `n8n/idea-pipeline.json` | BBI 1 - Idea Pipeline | `When clicking "Test workflow"` | Sheet seed rows + Stage 1 research → writer → sheet + Supabase |
| `n8n/faq-pool.json` | BBI 2 - FAQ Pool | `FAQ Pool - Run` | Completed ideas → per-category FAQ pool |
| `n8n/blog-pipeline.json` | BBI 3 - Blog Pipeline | `Blog - Run` | Blog queue sheet → post → Supabase |

They were previously one 29-node workflow with three unrelated branches sharing
a canvas. Nothing is shared between them, so splitting loses nothing.

## Import

Import each file separately, then re-select credentials — credential IDs are
per-account, so every node using one warns until you pick the new one.

| Credential type | Name in the export | Used by |
|---|---|---|
| Google Sheets OAuth2 | `Google Sheets account` | idea pipeline, blog pipeline |
| Google Gemini (PaLM) API | `Google Gemini(PaLM) Api account` | idea pipeline |
| Supabase API | `Supabase account` | all three |

The FAQ pool and blog workflows call Gemini over plain HTTP Request nodes with
a key from their `Rotate Gemini Key` node, so check that node holds a live key.

## Two bugs fixed during the split

**1. The FAQ and blog loops could never run.** In both, the processing chain was
wired to the `Loop` node's **`done`** output (index 0) with the **`loop`** output
(index 1) left empty. A Split In Batches node emits the current batch on `loop`
and only fires `done` once the batches are exhausted — so the batch went to an
unconnected output, `done` never fired, and the chain never executed. Both are
now wired `loop → processing → back to loop`, with `done` left open.

**2. The idea pipeline's `done` output went nowhere.** Added `Run Summary`,
which reports `total_rows_read`, `rows_with_research_facts` and
`rows_skipped_missing_research_facts`, and warns when every row was skipped. A
starved run used to look identical to a working one.

## Five defects fixed in the idea pipeline

**1. One Gemini rate limit killed the whole run.** `Basic LLM Chain` had no
retry and no error handling, so a single 429 on the free tier aborted the
execution and lost every row still queued. It now retries three times, five
seconds apart, and on final failure emits the item anyway — the parser already
turns a missing response into `needs_retry`, which preserves the researcher's
work.

**2. One bad generation destroyed fifty good ones.** `Quality Guard` used
`throw` for all five of its checks, which aborts the entire execution. A row
that fails now gets `status: needs_review` and a `quality_error` explaining
why, and carries on. The sheet records the reason; the row simply does not
reach Supabase. Verified: four rows in, four rows out, with the vendor leak and
the thin summary both still caught.

**3. jsonb columns were double-encoded.** The parser stringified arrays and the
Supabase node wrote that string into a `jsonb` column, so `jsonb_typeof`
returned `"string"` on all 290 live rows. The parser now emits both shapes —
text for the sheet, real arrays and objects for Supabase — and the nine jsonb
fields point at the real values.

**4. A re-run crashed on the primary key.** `Sync to Supabase` has no
`operation` set, so it defaults to insert, and `ideas.idea_id` is the primary
key. Re-processing any completed idea raised a duplicate-key error that killed
the run. It now retries twice then continues, so one collision costs one row
rather than the batch.

**5. Failed rows were inserted anyway.** A new `Ready For Supabase?` gate sits
between the sheet write and the insert. Only `status = completed` inserts;
`needs_retry` and `needs_review` return straight to the loop. The sheet is
still updated either way, so a failure is visible rather than silent.

The `Loop Over Items` `done` output, which was connected to nothing, now feeds
`Run Summary`.

## The gate is unchanged, on purpose

`Has research_facts?` still requires more than 50 characters. It is the only
thing stopping rows with a blank `title` and blank `slug` reaching Supabase,
and `slug` is unique, so blanks would collide after the first one. All 116
pending sheet rows currently have an empty `research_facts`, which is why the
run processes nothing — the pipeline is starved, not broken.

## Still unfixed

`Read Blog Queue` in `n8n/blog-pipeline.json` has
`documentId: "REPLACE_WITH_YOUR_SHEET_ID"` and `sheetName: "Blog Queue"`. That
placeholder was never filled on the old account either, so the blog workflow has
never run. It needs a real sheet ID.

## Data shapes — no mismatch, existing or future

Nine `jsonb` columns in `public.ideas` hold a JSON *string* rather than an array,
because the parser does `JSON.stringify(...)` and the Supabase node writes that
string into a `jsonb` column:

| Column | Rows storing a string | Rows storing a real array |
|---|---|---|
| `tags`, `pros_json`, `cons_json` | 290 | 0 |
| `getting_started_steps`, `tools_needed`, `faq_json`, `external_links`, `internal_link_anchors` | 8 | 0 |
| `research_facts` | 7 | 0 |

Cosmetic, not breaking. `toStringList` and `toObjectList` in
`src/lib/ideas-shared.ts` unwrap up to three levels, so a double-encoded string
and a real array both render. Old and new rows keep working either way, so no
backfill is owed and none has been run.

The new `idea_research` table stores proper jsonb objects and arrays, not
strings — confirmed with `jsonb_typeof` after insert.
