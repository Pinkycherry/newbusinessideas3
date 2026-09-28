# BUTTERFLY EFFECT — the one rule we check before touching anything

Purpose (founder's standing instruction): before we **create, modify, or implement** anything — inside the site, outside it, in Supabase, in the pipeline, anywhere — we stop and ask one question first:

> **Does this change touch, depend on, or risk breaking any area other than the one I'm working on?**

If the honest answer is "yes" or "not sure," we do NOT proceed until we've mapped the blast radius and made the change additive/isolated. A change that fixes A but silently breaks X, Y, Z is worse than no change — it forces us to run again and again cleaning up secondary damage. This file is the checklist we run first, every time.

## The 5-question check (run before every task)

1. **Does it modify an existing file/route/component that other pages share?** (shared = higher risk. e.g. `site-shell.tsx`, `styles.css`, `ideas.functions.ts`, `use-auth.ts`, anything under `components/ui/`.)
2. **Does it change the Supabase schema or existing rows?** (Never mutate the ~280 live idea rows or the `ideas` table shape. New data = new table/columns, additive only.)
3. **Does it change global styling/tokens?** (A color/spacing/token change ripples to every page. Treat as high-blast-radius.)
4. **Does it change a data contract other code reads?** (types in `ideas-shared.ts`, query shapes, route params. Changing these breaks consumers.)
5. **Can it be built as a NEW, isolated thing instead?** (new route + new component + new table = near-zero blast radius. Always prefer this over editing shared code.)

If a task is all "no" on 1–4 and "yes" on 5 → **safe, proceed.** If any "yes" on 1–4 → **stop, scope it, isolate it, verify the affected areas explicitly before and after.**

## Blast-radius map of this project (know what's dangerous to touch)

| Area | Blast radius | Rule |
|---|---|---|
| New route + new component (e.g. `/tools/*`, `/list/*`) | **Isolated** | Safest work. Build freely. |
| New Supabase table keyed by id | **Isolated** | Additive. Never alter `ideas`. |
| `src/routes/idea.$slug.tsx` | Medium | Every idea renders through it. Embed things conditionally, never break the base render. |
| `src/routes/index.tsx` (homepage) | Medium | Many sections; edit one section at a time. |
| `src/components/site-shell.tsx` | **High** | Header/nav/footer on every page. Section-scoped edits only. |
| `src/styles.css` | **High** | Global. One owner at a time; only add scoped classes, avoid touching shared tokens. |
| `src/lib/ideas.functions.ts` / `ideas-shared.ts` | **High** | Data contract for the whole site. Additive fields only; never change existing shapes. |
| `src/hooks/use-auth.ts` | **High** | Gating logic sitewide. Read its states; don't change its signature. |
| Supabase `ideas` table / live rows | **Critical** | Never mutate. The live site + 280 ideas depend on it. |
| Payment/checkout | out of scope this phase | Do not touch. |
| Gemini/n8n pipeline | isolated build, but writes to DB | Writes to NEW tables only; never edits core `ideas` rows. |
| **India Idea Atlas** (`BBI_EXPANSION.md`): `/india/ideas*` routes, `src/components/india/*`, `src/lib/india*.ts`, `india-atlas.css` | **Isolated** | New namespace. Never imports, reads, rewrites or backfills existing ideas, categories, posts or workflows. Its CSS is scoped under `.india-atlas` and loaded only by the India routes. |
| `india_*` Supabase tables (`supabase/india/`) | **Isolated** | Additive only. No foreign key, view, trigger or function touches `ideas`, `blog_posts`, `category_faqs` or any existing table. Rollback drops only `india_*` objects. Apply only after the founder has seen the SQL. |
| India n8n workflows (Planner, Worker, Publisher, Error) | **Isolated**, writes DB | Four NEW workflows, by the founder's decision on 2026-09-28 (this overrides the old "never a second n8n workflow" rule, for the India system only). They write `india_*` tables only, by calling the `india_*` SQL functions over PostgREST with the service-role key (chosen so deployment needs no manual n8n or database step). The functions touch nothing outside `india_*`; the narrower `india_worker` role remains available if the founder sets its password. The existing idea pipeline is not edited. |
| `sitemap-index.xml` | Medium | One added child (`/sitemap-india.xml`). Existing children and their order stay exactly as they are. |

## Working rules that fall out of this

- **Prefer additive over edit.** New table/route/component beats modifying a shared one, every time.
- **One owner per shared file per work-round.** Two agents must never edit `styles.css` or `site-shell.tsx` at once.
- **Conditional rendering for enrichment.** New sections on existing pages render only when their data exists, so un-enriched content never breaks.
- **Centralized branding (colors/buttons/layout tokens) is HIGH blast radius** — it's valuable but touches everything, so it is a deliberate, isolated, single-focus round on its own, never bundled with feature work. Deferred until we choose to do it alone.
- **India expansion stays in its own lane.** The only lines it may add outside its own files are: one child in `sitemap-index.xml`, and the generated `routeTree.gen.ts`. It does not change global CSS, the header, navigation, the homepage or any existing route. Inside `SiteShell`, every India button carries `bbi-bare` so the site-wide button plate cannot restyle it.
- **Verify the affected areas, not just the changed one.** After a medium/high-risk change, screenshot/check the *other* pages that share the file, not only the one you meant to change.

This file is consulted first. Then we touch anything.
