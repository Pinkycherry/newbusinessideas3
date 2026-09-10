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

## Stage 1 research now comes from Supabase, not the sheet

This is the change that unblocks the idea pipeline.

All 116 pending sheet rows (`IDEA-00284` → `IDEA-00399`, sheet rows 285–400)
carry only the seed columns — category, subcategory, keywords,
`business_description`. Their `research_facts`, `title`, `slug`, `seo_title`,
`meta_description`, `tags` and link columns are all empty. Verified by running
the workflow with its writes disabled: the gate evaluated 116 rows and returned
**true 0 times, false 116 times**.

Writing those columns back into the sheet is not possible from the pipeline's
side, so Stage 1 output now lives in Supabase instead:

```
public.idea_research
  idea_id  (pk)  title  slug  seo_title  meta_description
  tags  external_links  internal_link_anchors  research_facts   (all jsonb)
  created_at  updated_at
```

It is a **separate table on purpose**. `public.ideas` has `idea_id` as its
primary key and `slug` as unique, so pre-inserting a pending idea there would
collide with the row the pipeline itself inserts at the end of its run. This
table is additive and touches none of the 290 existing rows.

Two new nodes in the idea pipeline consume it, between `Loop Over Items` and
the gate:

- **`Fetch Stage 1 Research`** — Supabase lookup on `idea_research` by
  `idea_id`. `alwaysOutputData` is on, so an idea with no research yet arrives
  as an empty object, falls through with an empty `research_facts`, and is
  skipped by the gate exactly as before. A miss is not an error.
- **`Merge Research`** — merges the researcher's fields onto the seed row from
  the sheet, stringifying the jsonb columns because both the gate and the
  writer prompt expect text.

The gate itself is unchanged and should stay that way: it is the only thing
stopping rows with a blank `title` and blank `slug` from reaching Supabase, and
`slug` is unique, so blanks would collide after the first one.

### Filling `idea_research`

Rows are researched and inserted directly into Supabase. Every number in
`research_facts` must trace to a URL in its own `sources` array — that is the
whole point of the table. Shape:

```json
{
  "facts":   ["A claim with a real number", "Another"],
  "sources": ["https://…", "https://…"],
  "voice_angle": "the emotional stance for this idea",
  "open_with":   "how to start it"
}
```

`voice_angle` and `open_with` are optional; the writer prompt follows them
exactly when present and picks its own distinct combination when absent. They
exist to stop every idea reading alike.

**Currently populated: 13 of 116.** Run the idea pipeline and those thirteen
process end to end while the other 103 are skipped and counted by `Run Summary`.

Ideas that share a business model share their sourced economics — the template
licensing cluster, the unattended-machine cluster, the plant-growing cluster —
with a per-idea `voice_angle` and `open_with` so no two pages read alike. The
insert pattern is a CTE holding each cluster's fact block once, concatenated
per row with `jsonb_build_object('voice_angle', …, 'open_with', …)`.

Every row is checked before it lands: at least three facts and three sources,
a unique slug, a non-blank title, and no banned filler, vendor name or year in
the title, SEO title or meta description.

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
