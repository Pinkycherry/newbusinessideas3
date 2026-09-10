# Moving the idea pipeline to a new n8n account

The old n8n instance (`pinkypinky1212.app.n8n.cloud`) ran out of free plan. Its
workflow has been exported to **`n8n-idea-pipeline-v3.json`** in this repo so
nothing is lost. That file is the rescue copy — import it into the new account.

The old `n8n-idea-pipeline-v2.json` has been deleted. It was nine nodes; the
live workflow had grown to twenty-eight, and its gate logic was different and
wrong (see "What was stale" below). Importing it would have quietly reintroduced
a bug. It is still in git history if it is ever needed.

## Import steps

1. In the new account: **Workflows → Import from File →
   `n8n-idea-pipeline-v3.json`**.
2. Re-create the three credentials. The workflow references them by name, but
   credential IDs are per-account, so every node using one will show a
   "credential not found" warning until you re-select it:

   | Credential type | Name in the export | Used by |
   |---|---|---|
   | Google Sheets OAuth2 | `Google Sheets account` | Read Pending Rows, Update Row in Sheet, Read Blog Queue, Mark Blog Row Done |
   | Google Gemini (PaLM) API | `Google Gemini(PaLM) Api account` | Google Gemini Chat Model |
   | Supabase API | `Supabase account` | Sync to Supabase, Read Completed Ideas, Write FAQ Pool, Write Blog Post |

3. Open each of those nodes once and pick the new credential from the dropdown.
4. The sheet and the Supabase project are unchanged — same document ID, same
   tab (`Updated SuperBase1`, gid `1572637316`), same `ideas` table. Nothing to
   re-point.

## Known placeholder, still unfixed

`Read Blog Queue` has `documentId: "REPLACE_WITH_YOUR_SHEET_ID"` and
`sheetName: "Blog Queue"`. That was never filled in on the old account either,
so the blog branch (`Blog - Run`) has never worked. It needs a real sheet ID
before that trigger will do anything. The idea branch and the FAQ branch are
unaffected.

## The three triggers

The workflow holds three independent branches, each with its own manual trigger:

- **`When clicking "Test workflow"`** — the idea pipeline (sheet → writer → sheet + Supabase)
- **`FAQ Pool - Run`** — builds the per-category FAQ pool from completed ideas
- **`Blog - Run`** — the blog branch, blocked on the placeholder above

## What is actually blocking the idea pipeline

Importing this will not by itself make the pipeline produce ideas. The blocker
is in the data, not the workflow:

- The sheet holds **116 pending rows** (`IDEA-00284` → `IDEA-00399`, sheet rows
  285–400).
- **All 116 have an empty `research_facts` cell.** Confirmed by running the
  workflow with its writes disabled: the `Has research_facts?` gate evaluated
  116 rows and returned **true 0 times, false 116 times**.
- Those rows also have empty `title`, `slug`, `seo_title`, `meta_description`,
  `tags`, `external_links` and `internal_link_anchors`. Only the seed columns
  are filled (category, subcategory, keywords, `business_description`).

So the Stage 1 research pass has never been run for these rows. The gate is
doing its job — it is the only thing stopping 116 rows with a blank title and a
blank slug from being inserted into Supabase. **Fix the input, not the gate.**

For contrast, the seven rows that do have `research_facts` (`IDEA-00603`–
`IDEA-00608`, plus `IDEA-00283`) all completed normally. The pipeline works; it
is starved.

## What changed in the export

One addition, nothing removed:

- **`Run Summary`** (Code node) is now wired to the `Loop Over Items` **"done"**
  output, which was previously connected to nothing. That empty branch is why a
  starved run looked identical to a working one — the loop and the IF would
  flash once per row, nothing downstream would light up, and the execution would
  report success having written nothing. The new node reports
  `total_rows_read`, `rows_with_research_facts` and
  `rows_skipped_missing_research_facts`, and adds an explicit warning when every
  row was skipped.

## What was stale in `n8n-idea-pipeline-v2.json`

Recorded here because the difference mattered:

- 9 nodes vs 28 live — the whole FAQ-pool branch and blog branch were missing.
- Its gate was `research_facts` **contains the string `"facts"`**. The live gate
  is `length > 50`. The old check would wrongly reject research written in the
  `IDEA-00283` shape, whose keys are `startup_cost` / `market_size` /
  `voice_angle` with no `facts` key at all.
- It had no `Quality Guard` node.

## Data shapes — no mismatch, existing or future

Nine Supabase columns are `jsonb` but hold a JSON *string* rather than a JSON
array, because the parser does `JSON.stringify(...)` and the Supabase node
writes that string straight into a `jsonb` column:

| Column | Rows storing a string | Rows storing a real array |
|---|---|---|
| `tags`, `pros_json`, `cons_json` | 290 | 0 |
| `getting_started_steps`, `tools_needed`, `faq_json`, `external_links`, `internal_link_anchors` | 8 | 0 |
| `research_facts` | 7 | 0 |

This is cosmetic, not breaking. `toStringList` and `toObjectList` in
`src/lib/ideas-shared.ts` unwrap up to three levels, so a double-encoded string
and a real array both render correctly. If the parser is ever changed to write
real arrays, old and new rows will still both work — the helpers accept either.
No backfill is required, and none has been run.
