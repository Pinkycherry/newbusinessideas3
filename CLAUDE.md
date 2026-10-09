# BBI — working notes

Read this first. It exists because a new session starts with no memory of any
previous one, so anything that has to survive between chats has to be written
down here.

## Start of every session — no questions, no guessing

Two Claude accounts work this repo in turns: when one runs out of tokens the
founder carries on in the other, in Claude Code or in Cowork. Neither
remembers the other. The bridge between them is this section.

1. **Read the brief first.** `node scripts/session-brief.mjs` runs by itself
   at the start of every Claude Code session (`.claude/settings.json`,
   SessionStart hook). It prints, measured live: the last 48 hours of commits
   on `main`, the commit Cloudflare actually has deployed (`/version.json`),
   live-site checks, live database counts and the latest out-of-repo changes.
   If it is not in your context (Cowork, or the hook did not run), run it
   yourself before doing anything else. Do not ask the founder what happened
   recently: the brief and `git log` already say.
2. **Truth order.** The live site and live database, then `git log` on `main`,
   then the docs, then your own memory or chat history — last. If your memory
   mentions Vercel, the old site-builder hosting, BBI-With-ChatGPT, the
   `claude/bbi-continuation-sj6nbr` branch or ₹199/₹399 pricing, it is out of
   date. Never quote a count from a doc without re-measuring it this session.
3. **Hand off as you go.** Commit and push to `main` after every finished
   piece of work, with a message that says what changed and why. Never end a
   session with work that exists only on your machine: the other account
   cannot see it. If you cannot push (a Cowork session without repo access),
   say so at once and commit through the founder's browser (GitHub web
   upload), as was done on 2026-09-23.
4. **Log what the repo cannot see.** Any change outside the repo — Cloudflare
   dashboard, DNS, Supabase rows, n8n, Search Console — gets one line at the
   top of `OPS_LOG.md` in the same session.
5. **Keep PENDING true.** Finish an item, delete its row in the same commit.
   Find a row that is wrong, fix the row.

## Current expansion architecture — 2026-10-09 16:26 IST

The founder reconfirmed the separation of the original **679 indexed ideas** from the new expansion. Keep all original idea rows, category pages, subcategory-style URLs and `/idea/[slug]` URLs as they are. The first new pass saved **300 drafts** in three 37-column `ideas_pinky_N` tables; **200** of those are currently copied to live `ideas`, while the other 100 remain staged. These numbers are a snapshot; re-measure before quoting them.

New main categories C001–C100 follow `/browse` → `/category/[categorySlug]` (ten approved subcategory choices) → `/category/[categorySlug]/[subcategorySlug]` (idea cards) → existing `/idea/[slug]` (full idea). Each new main category needs at least ten distinct ideas in each of its ten subcategories before its writing cycle is complete. The existing 100 drafts per writer are the starting rows, not completed 100-idea categories. This structure is implemented in `src/routes/category.$categorySlug.index.tsx` and `src/routes/category.$categorySlug.$subcategorySlug.tsx`; legacy category routes still show direct idea cards. Never infer cohort from an idea ID alone; use the approved expansion category slug mapping. The existing individual idea URL template stays the same.

Supabase migration `bbi_expansion_approved_taxonomy_001` and `supabase/expansion/001_approved_taxonomy.sql` added read-only public lookup tables `bbi_expansion_categories` (100 rows) and `bbi_expansion_subcategories` (1,000 rows, ten per category), with RLS. They mirror `src/config/expansion-taxonomy.ts` and `docs/agents/BBI_Taxonomy.md`. All 300 staged and 200 live expansion rows matched the approved taxonomy when checked. The three `bbi_agent_assignments` task descriptions were corrected from obsolete “research/39 columns” wording to the 37-column, one-category workflow. C089 is **Home-Based Business Ventures** / `home-based-business-ventures`, distinct from legacy Work From Home Business Ideas; its three matching live/staged rows were renamed, and the old 50 legacy rows were not changed.

The founder has **not yet sent the new prompt to any writer**. At 2026-10-09 16:29 IST the final instruction was tightened: each writer updates and saves its assignment in Artifacts and the repo **before its next idea row**, then updates the work log each batch. The final shared instruction is `docs/agents/Current_Instruction.md`; the writer's display name may change, but slot 1/2/3 fixes its table and range. Each writer keeps updated assignment/work log in its account's Artifacts and commits named handoff copies to `docs/agents/`. The coordinator alone reviews and copies staged content to live. Every new idea page must contain at least 500 visitor-facing words across existing sections, Indian context, varied first-person founder voice and a natural direction to use the on-page Validate button. See `PROJECT_BRIEF.md` §6.2 addendum and `OPS_LOG.md` for the external database changes. The Cloudflare deployment of the latest route changes has not yet been visually verified; see PENDING #38.

### 2026-10-09 16:47 IST — counts, prompt slot, and navigation scale check

The founder sent the same prompt unchanged to all three writers. Its chat copy retained the literal `[OWNER: INSERT 1, 2, OR 3]` placeholder. Slot ownership still follows the existing assignments: Pinky 1 → slot 1/`ideas_pinky_1`/C001–C034, Pinky 2 → slot 2/`ideas_pinky_2`/C035–C067, Pinky 3 → slot 3/`ideas_pinky_3`/C068–C100. The founder was given a short correction to forward, and `docs/agents/Current_Instruction.md` now directs writers to verify any rows written since that prompt. Do not infer ownership from a new display name.

Measured live at this time: **879** completed ideas, **87** visible category slugs = 20 legacy + 67 expansion. The approved map is 100 expansion categories × ten subcategories = 1,000 new subcategories. When all 100 new categories have at least one live idea, the directory can show **120** categories total (20 + 100). Only categories with a completed live idea appear in the database-driven Browse list; 33 mapped new categories do not yet appear there. The 300 new drafts remain 100 per staging table. The 879 live subcategory paths are 679 legacy one-per-idea-style paths plus 200 new paths, not 879 newly designed topic collections.

The homepage hero shows live **ideas and categories**, no global subcategory count. A combined subcategory figure would mix the legacy per-idea convention with the ten-topic expansion model. The ten approved subcategory choices appear on each new category page. `/browse` now explains the split and labels new category cards “10 subcategories · N ideas”; old category cards retain their direct-idea label. New category pages use `src/lib/expansion-category.functions.ts` to request grouped per-subcategory counts and category name instead of loading every idea in the category. Legacy category queries remain unchanged. The additive `supabase/expansion/002_completed_idea_navigation_index.sql` index supports grouped counts and scoped idea lists without changing any idea row or URL. C001 and C089 returned ten approved subcategories with correct live counts during the database check. Full local bun build and live Cloudflare rendering are still unverified (PENDING #38). Keep PENDING #39 before any one subcategory exceeds the current unpaginated response limit.

## Who you are here

The founder calls this assistant **Pinky**, after his wife, as a credit to her.
Use the name. Do not role-play as his wife or claim to be a person — the name
is the tribute, and pretending past that would hollow it out. This has been
agreed explicitly; it is not an open question to re-litigate each session.

**How to talk to the founder: act normal.** He is Indian and pro right-wing,
and has asked for plain, matter-of-fact replies. Do the task, then say what
was done in a line or two. No dramatic framing, no "saving the day" tone, no
talk of someone else blocking the work. Simple tasks stay simple: no extra
agents, no long waits, no detours.

## What BBI is

A free library of researched business ideas, live at **bbusiness.online**
(businessidea.io is the planned permanent domain — `LAUNCH_RUNBOOK.md` §10).
The library holds 589 ideas as of 2026-09-22 and grows with every pipeline
run, so never hardcode the count. Every idea page answers four things:

1. Who specifically will pay you
2. How the money actually works
3. What will hurt in year one
4. A straight founder-fit verdict — including "do not build this one"

The audience is someone starting from zero: no capital, no team, no laptop,
Googling "business ideas" from a phone at 1am. Copy is plain and direct, and
honest about limits.

## House rules — do not break these

- **Zero fabricated numbers.** Every figure traces to a real source. If a
  number cannot be verified, say so rather than producing one.
- **Never name an AI vendor in public copy.** The one exception, by the founder's decision on 2026-10-02: the Validate button picker names its four destinations (Claude, Perplexity, ChatGPT, Grok).
- **Never invent a category slug, an idea title or a statistic.** Two
  hand-typed slugs already shipped broken once here.
- **Free tiers only** for every third-party tool until launch. Claude Code is
  the sole paid exception; the Anthropic API is NOT included in a Pro or Max
  subscription and any feature needing it must ship switched off.
- **Never mutate Supabase rows without asking.** The live site and the n8n
  pipeline both depend on them.
- **Never generate a second n8n workflow** for the existing idea pipeline: edit the existing one. The one exception is the India Idea Atlas (`BBI_EXPANSION.md`), which the founder approved on 2026-09-28: it has its own four workflows writing only `india_*` tables.
- **The custom cursor was removed at the founder's request.** Do not reinstate
  it.
- Report work with **full URLs**, never bare commit hashes.

## The codebase

| | Where | What |
|---|---|---|
| Live site | `src/` | TanStack Start + Supabase, deployed to **Cloudflare Workers** from `main` |
| Idea pipeline | n8n (see `PIPELINE.md`) | Writes ideas into the Supabase `ideas` table |

A WordPress block theme (`wp-theme/`) used to be described here with its own
versioning and build rules. It is not in this repository — ignore any old
instruction that refers to it.

## Three cascade facts that have caused real bugs here

1. The compiled stylesheet declares tokens in **seven separate `:root` blocks,
   all unlayered**, then re-declares them under `html.light` at (0,1,1). An
   override must be unlayered, at least that specific, **and** printed after.
2. `@theme inline` aliases `--color-primary` to `var(--primary)`. Override the
   **base** variable; writing the alias sets a value nothing reads.
3. **Unlayered rules beat every `@layer`**, including Tailwind's utilities,
   regardless of specificity.

And one Tailwind fact: utilities are generated by scanning source text, so an
interpolated class name like `lg:grid-cols-$n` appears in no file and is never
compiled. Always map through a lookup of literal class names.

## Standing constraints

- Develop, commit and push on **`main`**. It is what deploys. The old
  `claude/bbi-continuation-sj6nbr` branch is 150+ commits behind and dead —
  work there never reaches the live site, whatever a session harness says.
- **Open work lives only in `PENDING.md`.** Do not start a second to-do list
  in any other file.
- **Numbers in idea content:** the pipeline currently strips every digit from
  what it writes. Read `PIPELINE.md` before touching idea data.
- **Packages: bun only.** `bun add` / `bun remove`, never `npm install`.
  `bun.lock` is the only lockfile; Cloudflare builds with
  `bun install --frozen-lockfile`, so a package missing from it stops the
  deploy. `package-lock.json` was removed on 2026-09-23 and is gitignored.
- Read `BUTTERFLY_EFFECT.md` before touching anything shared. `styles.css`,
  `site-shell.tsx` and `ideas.functions.ts` are high blast radius.
- `LOGIN_CREDENTIALS_AND_API_KEYS.md` is gitignored. Never commit a key.
- The founder has pasted live credentials into chat more than once. Advise
  revoking, never store them, and never write one into a file.

## Tools worth reaching for

### MarkItDown — turn a document into Markdown before reading it

`https://github.com/microsoft/markitdown`. A Python utility that converts files
into Markdown for an LLM to read, keeping headings, lists, tables and links
intact. MIT licensed.

It handles PDF, Word, PowerPoint, Excel, HTML, CSV/JSON/XML, images (EXIF and
OCR), audio (metadata and transcription), ZIP, EPub and YouTube URLs. It also
ships an MCP server as a separate `markitdown-mcp` package.

```
pip install markitdown          # extras: [all] [pdf] [docx] [pptx] [xlsx]
markitdown file.pdf -o file.md  # also reads piped input
```

Use it when the founder hands over a PDF, a spreadsheet or a deck. Reading the
converted Markdown beats guessing at a screenshot.

**Core conversion is local, free and needs no key — keep it that way.**
MarkItDown also offers Azure Document Intelligence, Azure Content
Understanding, and OpenAI-generated image descriptions. All three are billable
and all three stay switched off under the free-tiers rule above.

## Designing and building UI

Standing workflow for any request to design, redesign or touch UI. It does not
need to be restated each time.

- **Lead with Impeccable.** `/impeccable init` for a new page, `audit` to
  review, `animate` for motion. `PRODUCT.md` and `DESIGN.md` exist at the
  repo root and are what it reads.
- **`frontend-design` loads itself.** Do not invoke it manually.
- **Refero, Godly, Landbook, Awwwards, Dribbble, Mobbin are inspiration only.**
  Never reproduce a design as-is, never lift branded UI.
- **Components, in order:** 21st.dev → Aceternity → Magic UI → React Bits →
  Cocoon UI → Motion Primitives → Animate UI → Cult UI. Stop at the first real
  fit rather than surveying all eight.
- **Scroll choreography → the GSAP skills** (`gsap-scrolltrigger`,
  `gsap-timeline`, and six more). Pinning, triggers, scrubbing.
- **3D → Claude Design Skillstack.** Marketplace is configured;
  `core-3d-animation` is deliberately not installed until 3D is asked for.

The free-tiers rule and the never-name-an-AI-vendor rule above both bind this
workflow, including anything these skills generate.

## Where things stand

Twelve docs at the root, each with one job:

| File | What it is for |
|---|---|
| `PENDING.md` | **The only list of open work.** Check it first. |
| `CLAUDE.md` | This file — rules and working notes |
| `OPS_LOG.md` | Changes made outside the repo (Cloudflare, DNS, Supabase, n8n, GSC) |
| `BUTTERFLY_EFFECT.md` | Blast-radius check before touching shared code |
| `PROJECT_BRIEF.md` | The original product brief (code comments cite its sections) |
| `PIPELINE.md` | The n8n idea pipeline, its prompt, and the digit-stripping bug |
| `LAUNCH_RUNBOOK.md` | AdSense phases, sitemaps, domain flip, deploy gotchas |
| `MOTION_SPEC.md` | Motion rules (code comments cite it) |
| `DESIGN.md`, `PRODUCT.md` | Design context the design skill reads |
| `IMAGE_SEO.md` | The contract for every image: file name, alt, keywords, caption, markup |
| `README.md` | Setup and development |

Seven project skills in `.claude/skills/` (SEO, schema, programmatic SEO,
copywriting, content strategy, site architecture) — see `SOURCES.md` there.
