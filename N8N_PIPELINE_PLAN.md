# n8n Content Pipeline — Plan (grounded in PROJECT_BRIEF.md Section 10)

Status: **planning**, nothing built yet. This doc is the shared reference we build from. Model decision is fixed by the brief: **all bulk content generation runs on the Gemini API, never Claude/ChatGPT** (Claude Pro is reserved for dev work in Claude Code).

## What the pipeline does

An n8n workflow that calls Gemini to generate content in bulk and writes it into Supabase, which the live site already reads from. Three content types, same pattern:
1. **Idea blueprints** — grow thin categories (e.g. Tech & SaaS is ~10, target 100–200).
2. **FAQ pool** — per-category FAQs the idea pages pull 5–10 from at random (Section 9).
3. **Listicle / guide content** — SEO-leverage pages.

Each generated record must come out with a **complete SEO package** (SEO title + meta description + slug as structured fields) and, for anything with images, **proper alt text** (brand name + role/position + descriptive caption). These are written into Supabase alongside the content, not bolted on later.

## Workflow shape (one reusable pattern, not one-per-template)

```
Trigger (manual/scheduled)
  → Read target: which category + how many + which content type
  → Build Gemini prompt (includes SEO-fields + alt-text requirements in the output schema)
  → Gemini API call  ──┐
       │               │ on rate-limit/fail: rotate to next API key,
       │               │ ~30s cooldown, then retry (do not stall the batch)
  → Parse structured JSON (idea/faq/listicle fields + seo_title, meta_description, slug, alt texts)
  → De-dupe check against existing Supabase rows (never duplicate a live idea)
  → Write to Supabase (only fields the live site queries)
  → Overflow: drafts / raw generation logs / prompt history → Google Drive/Docs, NOT Supabase
```

The workflow writes structured fields that map onto whichever template's expected shape, so new templates (FAQ hub, listicle, guide, calculator — Section 6.7–6.11) are *targets* the same pipeline fills, not new pipelines.

## Hard constraints (from the brief — build these in from the start)

- **Gemini only** for generation. Never Claude API, never ChatGPT.
- **API key rotation**: detect failed/rate-limited call → switch to next key, ~30s cooldown/retry window, so a single exhausted key doesn't stall a bulk job.
- **Supabase 500MB storage cap**: only core records the live site queries (ideas, categories, FAQs) go into Supabase. Drafts, logs, raw output → Google Drive/Docs overflow (founder has an unused 1-yr Google Workspace/Gemini Pro sub). Check before adding any new data type to Supabase.
- **Never duplicate or disrupt live ideas** — de-dupe against existing rows before writing; propose + confirm the per-category volume approach before running at scale.
- **Blog stays on our own stack** (Supabase-backed template on our domain), not WordPress.

## What I need from you to start building (the blockers)

1. **Gemini API key(s)** — how many, and how you want to supply them to n8n (env vars / n8n credentials). Rotation logic needs ≥2 to be meaningful.
2. **n8n access** — is this your existing n8n instance (cloud or self-hosted)? I have n8n tooling available and can generate the actual workflow JSON, or hand you a ready-to-paste prompt — your preference.
3. **Supabase write path** — confirm the exact table(s)/columns the pipeline writes to (I'll read the current `ideas` schema to match it exactly, and flag any missing SEO columns that need adding first — the brief says SEO fields are currently missing from the output schema).
4. **Google Drive/Docs overflow** — do you want drafts/logs there from day one, or start Supabase-only and add overflow when volume grows?
5. **First target** — recommend we start with **one category** (e.g. grow Tech & SaaS from ~10 toward ~50) as a controlled first batch, review the output quality together, then scale. Confirm the category + batch size.

## Recommended first milestone (smallest safe slice)

Generate **10 new Tech & SaaS idea blueprints** end-to-end: Gemini → structured JSON with full SEO fields → de-dupe → write to Supabase → verify they render live on the category page. One category, small batch, reviewed by you before any scale-up. Everything else (FAQ pool, listicles, other categories) reuses the exact same workflow once this slice is proven.
