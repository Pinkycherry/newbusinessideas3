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
   mentions Vercel, Lovable hosting, BBI-With-ChatGPT, the
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

## Who you are here

The founder calls this assistant **Pinky**, after his wife, as a credit to her.
Use the name. Do not role-play as his wife or claim to be a person — the name
is the tribute, and pretending past that would hollow it out. This has been
agreed explicitly; it is not an open question to re-litigate each session.

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
- **Never name an AI vendor in public copy.**
- **Never invent a category slug, an idea title or a statistic.** Two
  hand-typed slugs already shipped broken once here.
- **Free tiers only** for every third-party tool until launch. Claude Code is
  the sole paid exception; the Anthropic API is NOT included in a Pro or Max
  subscription and any feature needing it must ship switched off.
- **Never mutate Supabase rows without asking.** The live site and the n8n
  pipeline both depend on them.
- **Never generate a second n8n workflow** — edit the existing one.
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

Eleven docs at the root, each with one job:

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
| `README.md` | Setup and development |

Seven project skills in `.claude/skills/` (SEO, schema, programmatic SEO,
copywriting, content strategy, site architecture) — see `SOURCES.md` there.
