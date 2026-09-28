# BBI EXPANSION

The founder's plan for the BBI India Idea Atlas, written up by Codex (ASTRA) from the founder's own words on 2026-09-28. Everything below this header is copied exactly as supplied.

**Who does what**

- **Codex (ASTRA):** design only.
- **Claude Cowork and Claude Code:** everything else: schema, n8n workflows, data, routes, build, testing and publishing.

The four parts, in order:

1. Architecture (the contract)
2. UI build prompt
3. n8n + Gemini workflow prompt
4. Design reference (standalone HTML preview)

---

## 1. Architecture

# BBI India Idea Atlas — future expansion only

Prepared 28 September 2026. This is a proposed architecture and design handoff, not a deployed feature.

## Non-negotiable boundary

Leave all existing BBI ideas, categories, posts, pages, URLs, database records, prompts and automation workflows unchanged. Do not import, rewrite, reclassify, translate, or backfill existing content. The new system generates NEW India-focused ideas. Reuse means reuse **between future India sets**, never reuse of the current content library.

Use the site's existing React / TanStack Start / TypeScript / Supabase / Cloudflare stack. Add a separate namespace, new tables, new workflows and scoped styles. No new framework or site rebuild is needed.

## What to learn from the references

The useful pattern is intent-based discovery: a searchable collection directory, themed lists, quick comparison and compact idea entries. The AI list illustrates comparison and expanded entries; the gaming page combines a few expanded entries with shorter options. Adapt those functions, not their copy, claims or visual identity. Their public pages do **not** establish what automation stack they use. [Directory](https://ideaproof.io/lists), [AI example](https://ideaproof.io/lists/ai-startup-ideas), [gaming example](https://ideaproof.io/lists/gaming-business-ideas).

BBI's improvement: consistent typed fields, INR assumptions, identifiable Indian customers and a useful first test. For example, the reference gaming comparison currently puts revenue-model descriptions under “Startup Cost”; our schema must prevent that mismatch. [Gaming comparison](https://ideaproof.io/lists/gaming-business-ideas).

## The architecture

```mermaid
flowchart LR
  A[New India set briefs] --> B[n8n queue and quota guard]
  B --> C[Match NEW India idea library]
  C --> D{Missing useful options?}
  D -- Yes --> E[Gemini: small structured batches]
  E --> F[Validate / deduplicate / India fit / evidence]
  F --> G[New India compact ideas]
  D -- No --> H[Ordered set memberships]
  G --> H
  H --> I[Atomic publication + version]
  I --> J[Cached SSR directory and list pages]
  J --> K[Search / filter / compare locally]
```

One idea is a short reusable record. A set is a selection of those records, with a short introduction and a reason each idea belongs. No full blueprint, blog, image, FAQ bundle or SEO article is generated for every membership. No AI runs when a visitor loads a page.

Illustration, not a throughput promise: 100 future ideas with three legitimate memberships each create 300 placements while storing only 100 idea records. Copying or regenerating those ideas three times adds expense without adding choice.

### New routes

| Route | Purpose |
|---|---|
| `/india/ideas` | Searchable India set directory |
| `/india/ideas/ai-services-for-indian-businesses` | One future AI set |
| `/india/ideas/gaming-services-in-india` | One future gaming set |
| `/india/ideas/{set-slug}#idea-{stable-id}` | Share an individual compact idea within a set |

Keep `/list`, `/category`, `/idea`, `/browse` and all other existing routes as they are. Do not create individual indexable pages for short previews initially. Introduce deeper India blueprints later only when specifically commissioned. An idea can appear in several relevant sets without duplicate standalone pages.

### Separate data model

| New table | Important fields |
|---|---|
| `india_ideas` | UUID, stable concept key, title, customer, problem, offer, revenue model, first test, main risk, country=`IN`, work mode, skills, weekly-hours estimate, INR budget bounds and assumptions, India-fit status, review status, content version, timestamps |
| `india_sets` | UUID, unique slug, title, intro, family, audience, explicit selection rules, status, published version, actual review date |
| `india_set_items` | set ID, idea ID, rank, brief fit reason; unique `(set_id, idea_id)` |
| `india_tags` + joins | Controlled industry, buyer, skill, setting and time tags; do not make a new category for every idea title |
| `india_evidence` | idea ID, claim key, original source URL, short supported finding, checked date, status; no invented citations |
| `india_generation_jobs` | idempotency key, scope, state, attempts, next attempt, lease expiry, model/prompt versions, token usage, redacted errors |

The proposal uses new prefixed tables; the implementer must check names for collisions. It must not alter current content tables. Use a restricted worker credential that can write only the new namespace. Jobs and draft research are private. Public reads require published sets AND published eligible ideas; membership rows alone must not expose drafts. Enable RLS plus appropriate grants. [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

### Compact idea content

Target 150–230 words across the complete record, with a hard size limit. In the collapsed row show title, Indian customer, offer, working mode and a budget label if supported. Expand to reveal first test, revenue model, main risk and assumptions.

An India idea must identify a customer operating in India, a locally usable offer, a plausible customer-reaching method and relevant operating assumptions. Changing dollars to rupees or adding “in India” to a global title is insufficient. Do not invent market size, earnings, growth, demand scores, customer validation or review credentials.

Budget is optional and numeric: `{lower_inr, upper_inr, basis, excludes, estimate_date}`. Null means unknown. A budget-filtered set must exclude unknown budgets and require the upper bound to fit its ceiling. Clearly label estimates, including whether a device, premises and working capital are excluded. Do not call an idea zero-investment when it assumes purchased equipment.

Regulated or factual claims need applicable evidence. Simple business proposals can be described as hypotheses without invented statistics. Automatically hold entries whose claims require unresolved verification. Do not make a model's self-rating equivalent to market validation.

## Breadth without content inflation

Start with 48 **draft set briefs**, four in each family below. Publish only the strongest 12 after they contain at least eight eligible, meaningfully different ideas. The remaining briefs are a planning backlog, not empty public pages. Increase scope based on measured quality and available quota.

| Family | Four possible future sets |
|---|---|
| Budget | Under ₹10,000; under ₹50,000; under ₹2 lakh; businesses using equipment already owned |
| Time | Weekend services; evening work; seasonal operations; part-time B2B support |
| Setting | Home-based services; apartment communities; small-town services; village support services |
| AI and digital | AI services for Indian small businesses; Indian-language content operations; catalogue support; workflow setup services |
| Gaming | Local game QA; gaming hardware repair; Indian-language game localisation; gaming creator support |
| Retail support | Stocktaking services; shop photography; catalogue maintenance; neighbourhood delivery coordination |
| Education | Tutor administration; learning-material production; skills workshops; after-school activity services |
| Food ecosystem | Packaging design; kitchen photography; supplier coordination; menu operations support |
| Repair and reuse | Appliance maintenance; furniture restoration; device refurbishment support; rental inventory services |
| Agriculture support | Equipment scheduling; farm record services; packaging support; producer catalogue services |
| Creative services | Product photography; regional copywriting; wedding vendor support; short-video editing |
| Business operations | Appointment administration; quotation preparation; customer follow-up setup; document organisation |

These are editorial starting points, not researched recommendations or claims of demand. Avoid turning every city, budget and industry combination into a page. Publish a separate set only when its selection and advice are materially different.

## Automation and publication

1. Planner creates a versioned set brief with typed eligibility rules and a requested maximum count.
2. Worker atomically claims a queued job. Search ONLY the new India idea library first. Reuse appropriate future records and generate only genuinely missing options.
3. Gemini drafts three to five compact records per ordinary structured-output request. Validate with JSON Schema and server-side semantic checks. Structured output controls shape, not factual truth. [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output).
4. Deduplicate by normalised customer + problem + offer and title similarity. Keep uncertain matches for review rather than merging unlike businesses. No vector database is required for the pilot.
5. Gate India fit, field quality, evidence, budget rules and distinctness. Pilot sets receive editorial review; later low-risk drafts may publish automatically only under the same explicit gates.
6. Upsert ideas and memberships idempotently, then publish a complete set in one transaction. Keep the previous published version visible if a refresh fails.
7. Increment content version, expire the affected public cache and include new canonical URLs in a separate India sitemap. A data update must not require a full website build.

Use `queued → running → ready / needs_review / retry_wait / failed → published` job states with leases and retry limits. Retry transient 429/5xx/network failures with bounded exponential backoff and jitter; honour provider retry guidance. Save a future retry time instead of holding an execution open for hours. n8n supports Retry On Fail and Loop Over Items/Wait patterns. [n8n rate handling](https://docs.n8n.io/integrations/builtin/handle-rate-limits/).

The free Gemini tier is a quota-constrained pilot, not unlimited infrastructure. Select a currently available free text model in AI Studio; keep its name and RPM/TPM/RPD configurable. Stop at project limits, never rotate keys to bypass them, and never fall back to paid services silently. Free hosting for n8n is a separate matter; a local instance runs only while its host is on. Model, grounding and data-use terms vary, so inspect the selected model's current pricing before activation. [Rate limits](https://ai.google.dev/gemini-api/docs/rate-limits), [pricing](https://ai.google.dev/gemini-api/docs/pricing).

## Page design and speed

Name: **BBI India Idea Atlas**. Keep crimson `#ca0808`, ink `#120404`, deep red `#270a0a`, paper `#fff1e8`. Poppins in the real implementation, existing font assets where available. The accompanying standalone HTML uses a system fallback to make the preview self-contained.

- Directory: editorial split hero, large type, physical index tabs, an integrated search field, grouped filter controls, compact numbered set rows and a small cream “start here” selection guide. No image grid.
- Detail: folded dossier header, sticky local contents rail on desktop, compact ranked idea rows with progressive disclosure, and a maximum-three-item comparison tray. Mobile keeps one column and a reachable filter trigger.
- Different hero compositions for budget, AI, gaming and local-service families, built from a few reusable CSS/SVG variants. Do not hand-code an entire page for every set.
- Finite interactions: sliding index underline, subtle paper lift, rotating disclosure indicator, short button-arrow movement and a one-time comparison-tray entrance. No continuous motion, huge blur, canvas, autoplay or scroll hijacking.
- SSR first-page content; paginate the directory at 24 sets and long lists at 20 ideas. Fetch only needed columns. Index set status/family/slug and membership set/rank. Never download the complete idea database to render a list.
- Target new feature overhead under 30 KB gzip JS and 15 KB gzip CSS; these are acceptance budgets, not current measurements. Test at 320, 390, 768, 1024 and 1440 px. Target p75 LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 under real measurements.
- No generated stock images required. Depth comes from typography, layered surfaces, shadows and spacing. Text stays readable without animation or hover.

Use honest published counts and review dates. Do not publish empty sets, doorway city variants or mass near-duplicate pages. Search quality depends on usefulness rather than whether AI helped produce the material. [Google scaled-content policy](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content).

## Delivery order

1. Build new schema + workflow in isolation with mock fixtures; no existing writes.
2. Produce and review a small India-only pilot; measure tokens and failure rate.
3. Implement the new directory/detail templates from the design preview.
4. Check keyboard/touch behaviour, schema/RLS, retry recovery, duplicates, cache invalidation, responsive layout and transfer size.
5. Publish only new India routes; leave existing site content and workflows intact. Grow the backlog when the pilot proves useful.

Use the two companion prompt files independently. Each restates the isolation boundary and the shared contract so the receiving account does not need this conversation.

---

## 2. UI build prompt

Implement the NEW BBI India Idea Atlas for bbusiness.online in repo Pinkycherry/newbusinessideas3. Use the accompanying BBI-India-Lists-Design.html as the visual/interaction reference and BBI-India-Future-Architecture.md as the architecture contract. If attachments are unavailable, the requirements below are sufficient to start. This is new future content, not a redesign of the existing library.

STRICT SCOPE
Leave the current homepage, /browse, /list, /category, /idea, calculator pages, posts, content database, prompts, workflows, authentication and existing URLs unchanged. Do not reuse, import, rewrite or backfill current content. Add ONLY /india/ideas and /india/ideas/{set-slug}, dedicated components/styles/data functions, and additive India sitemap support. Do not alter global CSS, add a global theme or change current navigation in this task. Reuse the existing brand font and utilities where safe; keep new page styles under .india-atlas. Inspect only the relevant routing/build/style conventions. No new framework, page builder, WebGL, stock-image generator or animation dependency.

PRODUCT STRUCTURE
New India-only compact ideas live in india_ideas and are shared among future india_sets through india_set_items. The new namespace is separate from all existing content. Never issue Gemini calls from the browser or at page request time. The n8n workflow supplies validated new records. If the new API/schema is not ready, build behind a fixture adapter with visibly labelled draft examples; do not publish fixtures as real researched content.

New route /india/ideas is the directory. Each /india/ideas/{set-slug} is a curated list with a meaningful selection criterion. Share individual entries using #idea-{stable-id}; do not create thin standalone idea pages. Initially support 12 pilot sets, while allowing many more through data. Counts, published dates and filters derive from data rather than marketing constants. No fake popularity/demand badges or algorithmic “best” claims.

DESIGN DIRECTION: CRIMSON EDITORIAL ATLAS
Keep #ca0808 crimson, #120404 black-red, #270a0a deep surface, #fff1e8 warm paper and #dfbfb5 muted text. Use Poppins 400/500/600/700 from existing assets. Build physical depth with offset paper shadows, restrained bevel highlights, clipped decorative corners and cream dividers. Essential content/focus rings must never be clipped. Large readable typography, compact content and rich contrast. This is not a glowing rounded-card grid. Different sections need different structures, but navigation and controls remain consistent. No random layouts on refresh.

Set CSS tokens on .india-atlas:
--ia-ink:#120404; --ia-surface:#270a0a; --ia-red:#ca0808; --ia-paper:#fff1e8; --ia-muted:#dfbfb5;
--ia-ease:cubic-bezier(.22,1,.36,1);
--ia-shadow:0 6px 0 #090202,0 18px 32px rgb(0 0 0 / .22);
Max content width 1240px, gutters clamp(16px,4vw,56px), section gaps clamp(32px,5vw,64px), body 16–18px with 1.55 line-height, H1 clamp(38px,5.3vw,76px). Never use low-contrast red text on black as body copy. Validate actual contrast after implementation.

DIRECTORY SECTIONS AND EXACT BEHAVIOUR
1. “India edition” masthead: compact breadcrumb and country label, existing BBI identity. Do not add a full-height splash.
2. “Your next business. Made for India.” hero: left-aligned editorial headline and short benefit statement, right-side layered field-note folio reading “A small start. A real customer.” with a compact India stamp, as in the prototype. Hero art is decorative and disappears on narrow phones to keep the finder close. Layered crimson-to-ink surfaces with restrained static texture. Content appears immediately; no entrance animation hides text or delays LCP.
3. “Find your starting point” finder: integrated search, labelled budget/setting/time selects or accessible filter sheet, result count and clear-all. Selected filters have visible text/check states. URL search params persist state and browser Back works. Search is case-insensitive; no-results state suggests removing a filter. Controls wrap; never force horizontal page overflow.
4. “Explore the sets” directory: compact numbered index rows grouped by intent, not identical photographic cards. Each row shows title, one-sentence purpose, actual idea count and meaningful eligibility labels. Desktop may use two editorial columns; mobile one column. One cream guide panel explains “Choose a set → compare a few → test one”; do not fill the page with repeated onboarding copy.
5. Pagination: 24 sets per page with ordinary crawlable previous/next links. No endless automatic loading. Keep all published sets discoverable through pagination and a small family index.

LIST DETAIL SECTIONS AND EXACT BEHAVIOUR
1. Folded dossier header: breadcrumb, family/India label, unique H1, short intro, actual published count and honest reviewed date only if available. State the selection criterion. Use one of four reusable hero compositions: budget ledger, AI wiring diagram, gaming control panel, local-service route grid. These are CSS/SVG composition variants with the same brand colors—not four different design systems or large illustrations.
2. “At a glance” rail: filter by supported attributes, link to the list, and methodology/estimate explanation. Desktop sticky rail must stop at its parent. Mobile uses a normal compact disclosure, never a huge floating pill covering the page.
3. “Explore the ideas” ranked rows: large but subordinate index number, title, customer, concise offer, skill/work-mode and budget where supported. Show short customer/offer content in server-rendered HTML. A native details/summary or accessible disclosure reveals revenue model, customer reach, first test, main risk and assumptions. All entries follow a reliable semantic field order. No unsupported earnings forecasts or made-up metrics.
4. “Compare your shortlist”: separate toggle per idea, not nested in a link. Max three selections; show a clear message at the limit. Sticky bottom tray appears only after selection and reserves space so it cannot cover controls. Compare view shows customer, offer, assumptions/cost, effort, skill, first test and risk; null values say “Not estimated”. On small screens use stacked comparisons or a contained horizontally scrollable table with proper headings. Removing/clearing items works with keyboard and touch. Store only selected public IDs in localStorage; handle unavailable storage safely. No sign-in requirement for browsing/comparing.
5. “Before you spend”: cream paper inset with a practical first-test checklist and estimate explanation. Only show source links actually supplied by the data. Do not call an AI proposal validated.
6. “Another direction”: three to six related published NEW India sets chosen by meaningful tags, not random links or current content imports.

MOTION SPECIFICATION — EACH INTERACTION DIFFERENT
- Hero field-note folio: on fine-pointer hover only, finite 2-degree paper straighten / 5px lift, 340ms; static on touch.
- Directory row “index runner”: a 2px crimson underline grows left-to-right, 180ms; arrow moves 4px, no whole-grid bounce.
- Filter “selection latch”: selected inset highlight appears through opacity over 140ms; no sliding layout or scroll reset.
- Detail “dossier reveal”: disclosure icon rotates 45 degrees over 160ms, panel text stays crisp; avoid height measurements and per-frame JavaScript. Native opening may be immediate.
- Shortlist “paper dock”: tray enters once by translateY(10px)+opacity over 180ms; no looping pulse. Item addition uses a short opacity transition, not exploding particles.
- Primary button “arrow shutter”: arrow slides 4px and an inset highlight crosses once within 220ms. Focus-visible uses a clear cream outline with offset. Press feedback is translateY(1px), not a magnetic pointer chase.
- Cream note “corner lift”: decorative folded corner moves 3px on hover/focus-within, 200ms; text and layout remain stationary.
All motion obeys prefers-reduced-motion. Only transform/opacity animate where possible; no pointer tracking, infinite marquees, background blur animation, scroll hijacking or hiding content until scroll. No information depends on hover.

RESPONSIVE AND PERFORMANCE CONTRACT
Test 320,390,768,1024,1440px and 200% zoom. One-column mobile content; tablet makes conscious use of width; desktop content does not stretch beyond its reading measure. Minimum comfortable 44px controls, semantic headings/labels, keyboard order, visible focus, accessible disclosures and status messages. No clipped titles, sideways body scroll, empty giant hero space or overlapping sticky UI.

Use TanStack Start SSR/loaders and a dedicated india.functions module. Select bounded published fields only. Paginate long lists at 20 entries. No catalogue-wide scan per detail request, select-star, entire database JSON payload, browser-only content loading or client cache of private drafts. Cache only public content, invalidate by published version and retain the last valid snapshot. Build a separate data adapter so workflow changes do not rewrite the page components.

Target incremental feature assets under 30KB gzip JS and 15KB gzip CSS; report measured build chunks rather than claiming success. Reuse installed icon components with tree-shaken imports; no emoji or huge icon bundles. Zero hero image bytes, no additional font family, no external animation library. Target real p75 LCP<=2.5s, INP<=200ms, CLS<=0.1; local audits are indicators, not proof of production field metrics.

SEO: canonical new routes, honest descriptions, real ItemList/CollectionPage/Breadcrumb structured data, crawlable pagination and a new India sitemap section. Filter combinations should not multiply indexable near-duplicates; define canonical/noindex behaviour. Dates update only when content changes. Keep all existing canonical URLs and sitemap entries intact.

CHECK AND DELIVER
Verify search/reset, filter eligibility including unknown budgets, URL/back navigation, pagination, direct hash links, all disclosures, max-three comparison, remove/clear, persistence, reduced motion, keyboard/touch, loading/error/empty states and draft isolation. Run relevant build/lint checks; report pre-existing errors separately. Confirm the diff touches only the new India feature and required generated route/sitemap integration, with no unrelated existing edits accidentally included.

Implement and verify new routes before publishing. If GitHub publishing is authorised in this chat, commit ONLY this feature directly through GitHub's API against the current main SHA, non-force, without a local git commit. Recheck main before the write and preserve concurrent changes. Never claim a GitHub commit proves live deployment: verify the deployed version separately and provide the new URLs plus commit link. If this is only a design session, return the reviewed implementation and deployment steps without changing the live site.

---

## 3. n8n + Gemini workflow prompt

Build a production-minded n8n workflow for a NEW, INDIA-ONLY idea-set system for bbusiness.online (BBI). I need actual importable n8n workflow JSON, new-schema SQL, validators, setup instructions and tests—not just a plan.

SCOPE — READ THIS FIRST
Existing BBI content must remain exactly as it is. Do not reuse, migrate, rewrite, translate, classify, update or delete existing ideas, categories, posts, pages, prompts or workflows. Do not invoke the current full-blueprint pipeline. All generated content is NEW. Reuse is permitted only among new India records created by this new system. Use new india_* tables and new workflows. No automatic publication to existing routes. Target new /india/ideas and /india/ideas/{set-slug} pages.

CONTEXT
The site uses React, TypeScript, TanStack Start/Router, Supabase and Cloudflare. The goal is a wide choice of useful compact lists, not thousands of enormous articles. One new canonical idea can belong to several relevant new sets. A set contains title, brief introduction, explicit selection criteria and ordered memberships with short fit explanations. Do not generate full blueprints, images, blog posts, FAQs, market reports or repeated SEO prose for every list item. Browsing must cause ZERO Gemini calls. Inspiration is the discovery function of ideaproof.io/lists, not its copyrighted text, estimates or backend implementation.

FREE GEMINI REQUIREMENT
Use a user-supplied Gemini Developer API key stored in n8n credentials. Verify the current official free text-model availability, structured-output request syntax and quota documentation before implementation. Make GEMINI_MODEL, MAX_REQUESTS_PER_MINUTE, MAX_INPUT_TOKENS_PER_MINUTE, MAX_REQUESTS_PER_DAY, MAX_RUN_TOKENS and MAX_OUTPUT_TOKENS configuration values. No hardcoded promise of a daily quota. Do not silently switch to paid models, paid grounding, paid search, paid embeddings or the paid Batch API. Small batches here mean multiple records in one ordinary model request. Start at concurrency one and three records per call; raise only after quota/quality measurements. Stop cleanly at quota exhaustion and retain queued jobs. Never rotate projects or keys to evade quotas. Explain separately that n8n hosting is not guaranteed free. Do not send private customer data or secrets to the model.

DATA CONTRACT
Design new tables only; verify names before creating them:
1. india_ideas: id UUID; unique stable concept_key; title <=90 characters; country fixed IN; customer; problem; offer; customer_reach; revenue_model; first_test; main_risk; skill_tags; work_mode enum home/local/online/hybrid; weekly_hours_min/max nullable; budget_lower_inr/budget_upper_inr nullable; budget_basis; budget_excludes; budget_estimate_date; India-fit status; factual-review status; publication status; content_version; created_at/updated_at. Target 150–230 words across prose fields, not per field; enforce an overall maximum.
2. india_sets: id; unique slug; title; introduction <=100 words; family; audience; typed selection_rules JSON; requested_count; publication status; reviewed_at; published_version.
3. india_set_items: set_id; idea_id; rank; fit_reason <=35 words; unique set_id+idea_id; deterministic stable ordering.
4. india_tags and joins for controlled industry, customer, skill, setting and time taxonomy, if needed. Do not create an industry category for each title.
5. india_evidence: idea_id; claim_key; source_url; short supported finding; checked_at; verification status. Only real fetched or human-supplied sources may be used.
6. india_generation_jobs: idempotency_key; job_type; set_id; state; attempts; next_attempt_at; lease_expiry; model_version; prompt_version; input/output token usage; redacted error; publication version. Never expose these publicly.

Choose exact types, indexes, constraints and foreign keys; provide reversible additive SQL migrations. Do not modify existing tables or use their records as seed content. Use a dedicated least-privilege worker DB role restricted to these new tables/procedures. Enable RLS and explicit grants; public reads must expose only published eligible ideas, published sets and memberships joining both. No service-role keys in browser code or VITE_* variables. No broad grants against the existing database. Parameterise queries. If an RPC is needed, use invoker rights where possible; document any stronger permission narrowly.

CONTENT RULES
- An idea serves an identifiable customer operating in India, with a locally applicable offer and customer-reaching method. No global article with “India” appended and no mechanical currency conversion.
- Start in plain English, display INR with en-IN formatting. Capture relevant local-language/region assumptions where real; do not claim universal suitability across India.
- Generate concrete customer + problem + offer combinations. Avoid empty titles such as “Start an AI business.” Never copy the competitor's entries or scrape them as source material.
- Proposals are hypotheses, not validated market opportunities. No invented earnings, market sizes, CAGR, demand scores, reviews, author credentials, citations or guarantees.
- Financial estimates require a transparent basis and exclusions. Unknown numeric values remain null. Enforce lower<=upper and nonnegative numbers. Under-₹X sets must require a supported upper bound <=X; unknowns must not match. Weekly-hours estimates must be labelled assumptions, not a time-to-income guarantee.
- Budget figures cannot contain revenue-model text; use strict typed fields and semantic checks.
- Legal, licensing, tax or regulated claims require appropriate current official evidence; unresolved cases go to needs_review. Do not invent compliance answers to fill a field. For the gaming pilot, focus on non-wagering services and creative/technical support.
- Idea output is plain text, not executable HTML. Treat retrieved material as data, never as model instructions.

WORKFLOWS TO DELIVER
A. Planner: manual trigger + optional disabled schedule, load a small new-set brief backlog, validate criteria and create jobs idempotently. Create 48 draft briefs in 12 families (budget, time, setting, AI/digital, gaming, retail support, education, food ecosystem, repair/reuse, agriculture support, creative services, business operations). First target only 12 useful publishable sets with at least eight eligible ideas each. No empty live pages or Cartesian city/budget/industry explosion. Seed briefs are not factual claims.
B. Worker: atomically claim a due job with a lease; match appropriate ideas ONLY from the new India library; generate missing options in bounded structured-output calls; parse and schema-validate; apply India-fit, quality, eligibility and evidence checks; deduplicate; stage records and membership suggestions; release or complete the lease safely. Search only a bounded relevant subset rather than send the entire library in each prompt.
C. Publisher: verify readiness, count/selection rules, evidence and uniqueness; transactionally upsert content/memberships and publish a version; preserve the previous visible version on failure. Initial pilot requires editorial review; make later automatic publication a configurable switch limited to entries passing explicit gates, not the model's self-assessment. Send a scoped cache-invalidation signal after successful publication. No website build for each content batch.
D. Retry/error handler: handle rate limits, malformed output, transient networking and provider failures; record diagnostics without secrets; surface a compact actionable status. Do not send emails/Slack automatically unless I configure a destination later.

RELIABILITY DETAILS
Use a unique idempotency key incorporating operation, set and prompt/content version. Duplicate webhooks, retried calls and restarted n8n executions must not create duplicate ideas or memberships. Persist generated output before retrying later steps so a DB failure does not incur another generation call unnecessarily. Use normalised customer+problem+offer keys, with title/token similarity for likely duplicates. Do not require embeddings for the pilot; ambiguous semantic duplicates become review items. Reusing one idea in several relevant sets is intentional, not a duplicate error.

Implement queued/running/ready/needs_review/retry_wait/failed/published states coherently; distinguish job state from content publication state. Reclaim expired leases. Use bounded exponential backoff with jitter for 429/5xx/network errors and respect Retry-After/provider retry guidance. Persist next_attempt_at for long waits instead of occupying an execution for hours. Authentication errors halt until credentials are corrected. Invalid JSON gets at most one bounded repair attempt, then review/failure; no infinite loops. Respect request AND token quotas, including retries. Apply daily ceilings across all workers sharing the same project. Do not compute provider daily reset from Indian midnight; use current provider rules/configuration.

DELIVERABLES
1. Importable JSON for each workflow with valid node typeVersions for the n8n version you target, placeholder credential references and no secrets. Use standard nodes; avoid an unnecessary AI-agent framework.
2. Additive schema SQL, restricted grants/RLS policies, job-claim and transactional-publish mechanism, plus rollback that touches only this new system.
3. Exact generation prompt, JSON Schema, deterministic validation/deduplication code and example valid/invalid payloads.
4. A small fixture run that generates new draft India concepts and demonstrates overlapping set membership without copying existing BBI content.
5. Setup steps, environment/credential list, quota configuration, import instructions and how to run a dry run. Clearly distinguish locally tested, import-validated and untested behaviour.
6. Tests for duplicate delivery, expired lease, partial DB failure, 429 retry, daily quota stop, malformed JSON, unsupported INR budget, non-India idea, fabricated source, RLS draft isolation and atomic rollback. Log token counts and measured cost/throughput; do not promise a completion rate in advance.

Do not deploy or activate recurring runs merely by producing this answer. Give me complete implementation artifacts I can review and import. Consult current official documentation: https://ai.google.dev/gemini-api/docs/rate-limits ; https://ai.google.dev/gemini-api/docs/pricing ; https://ai.google.dev/gemini-api/docs/structured-output ; https://docs.n8n.io/integrations/builtin/handle-rate-limits/ ; https://supabase.com/docs/guides/database/postgres/row-level-security .

---

## 4. Design reference: BBI-India-Lists-Design.html

Save the block below as an  file and open it in a browser to see the interactive preview.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>BBI — Ideas for an Indian beginning · Design preview</title>
<style>
:root{--red:#ca0808;--ink:#120404;--wine:#270a0a;--cream:#fff1e8;--muted:#bfa69a;--line:#68433a;--paper:#f4dfcf;--serif:'Poppins','Segoe UI',Arial,sans-serif;--sans:'Segoe UI',Arial,sans-serif}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#080303;color:var(--cream);font-family:var(--sans)}button,input,select{font:inherit}button,a,input,select,summary{-webkit-tap-highlight-color:transparent}button,a,summary{touch-action:manipulation}button{cursor:pointer}a{color:inherit}button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,summary:focus-visible{outline:3px solid #f2b39d;outline-offset:5px}button:disabled{cursor:default}button{color:inherit}button,a{transition:background .2s,color .2s,transform .2s}button:active{transform:translateY(1px)}[hidden]{display:none!important}.mono{font-family:Consolas,'Courier New',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase}.muted{color:var(--muted)}.eyebrow{font-size:10px;letter-spacing:.2em;text-transform:uppercase;font-weight:700}.preview-bar{min-height:47px;background:var(--cream);color:var(--ink);padding:10px 24px;display:flex;gap:18px;align-items:center;justify-content:space-between;font-size:11px}.preview-bar strong{font-size:10px;letter-spacing:.16em}.preview-controls{display:flex;align-items:center;gap:5px}.preview-controls button{background:none;border:0;color:var(--ink);padding:7px 12px;border-radius:3px;font-size:11px}.preview-controls button[aria-pressed="true"]{background:var(--ink);color:var(--cream)}.viewport{max-width:1600px;margin:auto;background:var(--ink);min-height:calc(100vh - 47px);container-type:inline-size;transition:max-width .3s}.viewport.phone{max-width:420px}.topbar{min-height:87px;margin:0 5.2%;display:flex;align-items:center;border-bottom:1px solid var(--line);gap:40px}.brand{border:0;background:none;display:flex;align-items:center;gap:13px;padding:0;text-align:left}.brand-mark{font-size:36px;font-weight:900;line-height:1;letter-spacing:-3px}.brand-dot{color:var(--red)}.brand-name{font-size:9px;line-height:1.4;letter-spacing:.1em;text-transform:uppercase;border-left:1px solid var(--line);padding-left:13px}.nav{display:flex;gap:28px;align-items:center;flex:1}.nav button{padding:12px 0;font-size:12px;background:none;border:0;color:var(--muted)}.nav button.active{color:var(--cream);position:relative}.nav button.active:after{content:'';position:absolute;height:3px;background:var(--red);bottom:-23px;left:0;width:100%}.nav button:hover{color:var(--cream)}.edition{margin-left:auto;color:var(--muted);font-size:10px;letter-spacing:.13em;display:flex;gap:8px;align-items:center}.edition:before{content:'';width:6px;height:6px;border-radius:50%;background:var(--red)}.wrap{margin:0 5.2%}.hero{display:grid;grid-template-columns:1.55fr 1fr;gap:5%;padding:62px 0 58px;align-items:center}.hero .eyebrow{color:#e8a794;display:flex;align-items:center;gap:12px}.hero .eyebrow:before{content:'';width:28px;height:1px;background:var(--red)}h1,h2,h3,p{margin:0}h1{font-family:var(--serif);font-weight:400;letter-spacing:-.06em;font-size:clamp(45px,6.5cqw,94px);line-height:.98;margin:22px 0 24px}h1 em{font-weight:400;color:#f0baa5}.hero p{font-size:14px;line-height:1.8;color:var(--muted);max-width:430px}.primary{background:var(--red);border:1px solid var(--red);color:var(--cream);padding:15px 21px;font-size:12px;font-weight:700;display:inline-flex;align-items:center;justify-content:space-between;gap:35px}.primary:hover{background:#a90707;transform:translateY(-2px)}.hero .primary{margin-top:25px}.arrow{font-size:22px;line-height:1}.folio{position:relative;min-height:310px;padding:25px 28px;border:1px solid #965a4b;background:linear-gradient(135deg,#3d100d,var(--wine));transform:rotate(2deg);box-shadow:-11px 11px 0 var(--ink),-12px 12px 0 #634036;transition:transform .35s}.folio:hover{transform:rotate(0deg) translateY(-4px)}.folio-top{display:flex;justify-content:space-between;padding-bottom:16px;border-bottom:1px solid #754a3d}.folio-top .mono{font-size:9px}.folio-word{font-family:var(--serif);font-size:51px;letter-spacing:-.06em;line-height:1.05;margin:28px 0 30px}.folio-word em{color:#dcb09b}.folio-bottom{display:flex;justify-content:space-between;gap:25px;align-items:end;color:#e4c9ba;font-size:11px;line-height:1.6}.seal{border:1px solid #cf8d73;border-radius:50%;min-width:82px;height:82px;display:grid;place-content:center;text-align:center;transform:rotate(-10deg);font-size:10px;letter-spacing:.11em;line-height:1.8}.seal b{font-family:var(--serif);font-size:24px;letter-spacing:0}.page-note{border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:15px 0;display:flex;justify-content:space-between;gap:18px;color:#d1b5a6;font-size:11px;line-height:1.6}.page-note strong{color:var(--cream);font-weight:600}.page-note .mono{white-space:nowrap;color:#e0b29d}.finder{padding:46px 0 0}.section-heading{display:flex;align-items:baseline;justify-content:space-between;gap:20px;margin-bottom:25px}.section-heading h2{font-size:32px;letter-spacing:-.04em;font-family:var(--serif);font-weight:400}.section-heading .mono{color:var(--muted);font-size:10px}.finder-fields{display:grid;grid-template-columns:1.7fr 1fr 1fr 1fr;border:1px solid var(--line);background:var(--wine)}.field{padding:14px 18px;border-right:1px solid var(--line)}.field:last-child{border:0}.field label{display:block;color:#c5a193;font-size:9px;text-transform:uppercase;letter-spacing:.14em;margin-bottom:9px}.field input,.field select{width:100%;background:transparent;color:var(--cream);border:0;border-radius:0;min-height:27px;padding:0;font-size:13px}.field input::placeholder{color:#e0c6b8}.field select option{background:var(--wine)}.filter-note{font-size:10px;color:var(--muted);line-height:1.6;margin-top:12px}.folder-tabs{margin-top:34px;display:flex;align-items:end;border-bottom:1px solid var(--line);gap:5px}.folder-tabs button{background:transparent;border:1px solid var(--line);border-bottom:0;border-radius:8px 8px 0 0;padding:12px 19px;font-size:11px;color:var(--muted)}.folder-tabs button[aria-pressed="true"]{background:var(--cream);color:var(--ink);border-color:var(--cream)}.folder-tabs button:hover{transform:translateY(-3px)}.result-count{margin-left:auto;font-size:10px;padding:12px 0;color:var(--muted)}.list-row{display:grid;grid-template-columns:54px 1.4fr 1fr 34px;gap:24px;align-items:center;padding:27px 8px;border-bottom:1px solid var(--line);width:100%;background:transparent;border-left:0;border-right:0;border-top:0;text-align:left;position:relative;overflow:hidden}.list-row:before{position:absolute;inset:0;background:linear-gradient(90deg,#4d0f0b,transparent);content:'';opacity:0;transition:opacity .25s}.list-row>*{position:relative}.list-row:hover:before{opacity:1}.list-row:hover .row-title{transform:translateX(5px)}.list-row:hover .row-arrow{transform:rotate(-35deg)}.row-number{font-family:var(--serif);font-size:28px;color:#bc8d78;align-self:start;padding-top:4px}.row-title{font-family:var(--serif);font-size:27px;line-height:1.16;letter-spacing:-.035em;transition:transform .25s}.row-title small{display:block;font-family:var(--sans);font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:#c89882;margin-bottom:10px}.row-desc{color:var(--muted);font-size:12px;line-height:1.8}.row-desc span{display:block;font-size:9px;color:#dfbbaa;margin-top:9px;letter-spacing:.07em;text-transform:uppercase}.row-arrow{font-size:26px;transition:transform .25s}.empty{padding:35px 0;color:var(--muted);line-height:1.8}.reset{background:none;border:0;color:var(--cream);padding:10px 0;text-decoration:underline;font-size:12px}.editor-note{display:grid;grid-template-columns:100px 1.5fr 1fr;gap:30px;padding:38px 30px;background:var(--cream);color:var(--ink);margin:45px 0 60px}.editor-star{font-size:76px;line-height:1;color:var(--red);font-family:var(--serif);transition:transform .5s}.editor-note:hover .editor-star{transform:rotate(30deg)}.editor-note h2{font-family:var(--serif);font-size:32px;font-weight:400;line-height:1.15;letter-spacing:-.04em}.editor-note p{font-size:12px;line-height:1.8;color:#63463a}.footer{border-top:1px solid var(--line);padding:25px 0 105px;display:flex;justify-content:space-between;gap:20px;font-size:10px;color:var(--muted)}.breadcrumb{display:flex;align-items:center;gap:13px;padding:30px 0;font-size:10px;color:var(--muted)}.breadcrumb button{background:none;border:0;padding:0;color:var(--cream);text-decoration:underline;text-underline-offset:4px}.detail-head{display:grid;grid-template-columns:1.65fr 1fr;gap:8%;padding:18px 0 42px}.detail-head h1{font-size:clamp(42px,5.9cqw,78px);margin-top:18px}.detail-head .intro{color:var(--muted);font-size:13px;line-height:1.9;max-width:550px}.detail-mark{background:var(--red);padding:30px;color:var(--cream);display:flex;flex-direction:column;justify-content:space-between;min-height:225px;position:relative;overflow:hidden}.detail-mark:after{content:'↗';position:absolute;right:-12px;bottom:-57px;font-size:180px;opacity:.18}.detail-mark strong{font-size:70px;font-weight:400;font-family:var(--serif);letter-spacing:-.07em}.detail-mark p{font-size:11px;max-width:190px;line-height:1.8}.detail-bar{display:flex;justify-content:space-between;gap:15px;align-items:center;padding:17px 0;border-block:1px solid var(--line);font-size:11px;color:var(--muted)}.detail-bar b{font-weight:500;color:var(--cream)}.idea-layout{display:grid;grid-template-columns:220px 1fr;gap:50px;padding-top:37px}.side-index{align-self:start;position:sticky;top:24px}.side-index h2{font-size:10px;text-transform:uppercase;letter-spacing:.15em;color:var(--muted);font-weight:500;margin-bottom:20px}.side-index a{display:block;text-decoration:none;border-bottom:1px solid var(--line);padding:15px 0;font-size:12px;line-height:1.5}.side-index a span{color:#ce927b;margin-right:8px;font-family:var(--serif)}.side-index a:hover{padding-left:5px;color:#f0baa5}.side-note{margin-top:25px;border-left:2px solid var(--red);padding-left:15px;font-size:11px;color:var(--muted);line-height:1.8}.idea{padding-bottom:32px;margin-bottom:32px;border-bottom:1px solid var(--line);scroll-margin-top:25px}.idea-top{display:flex;gap:20px;align-items:start}.idea-rank{font-family:var(--serif);font-size:55px;color:#976a58;line-height:1}.idea-title{flex:1;min-width:0}.idea-title .eyebrow{color:#ce9c84;font-size:9px;margin:4px 0 10px}.idea h2{font-family:var(--serif);font-weight:400;font-size:33px;line-height:1.1;letter-spacing:-.04em}.save{background:none;border:1px solid #885342;min-width:41px;min-height:41px;padding:9px 12px;font-size:20px;line-height:1}.save:hover{background:#4b1711}.save[aria-pressed="true"]{background:var(--red);border-color:var(--red)}.idea-lead{font-size:13px;color:var(--muted);line-height:1.85;padding:18px 0 22px;max-width:630px}.idea details{background:var(--wine);border-top:1px solid var(--line)}.idea summary{display:flex;justify-content:space-between;list-style:none;cursor:pointer;font-size:11px;font-weight:600;padding:17px 19px}.idea summary::-webkit-details-marker{display:none}.idea summary:after{content:'+';font-size:17px;font-weight:400}.idea details[open] summary:after{content:'−'}.idea summary:hover{background:#39100c}.idea dl{display:grid;grid-template-columns:110px 1fr;gap:16px 22px;padding:3px 19px 22px;margin:0;font-size:12px;line-height:1.8}.idea dt{color:#e7b19b;font-size:10px;font-weight:600}.idea dd{margin:0;color:#d9beb0}.idea-meta{display:flex;justify-content:space-between;gap:12px;margin-top:17px;color:#b18c79;font-size:9px;text-transform:uppercase;letter-spacing:.09em}.tray{position:fixed;z-index:5;bottom:18px;left:50%;transform:translateX(-50%);width:min(740px,calc(100% - 30px));background:var(--cream);color:var(--ink);box-shadow:0 8px 35px #0008;display:flex;align-items:center;gap:18px;padding:14px 19px;border-top:4px solid var(--red)}.tray-title{font-size:12px;font-weight:700;white-space:nowrap}.tray-items{display:flex;gap:7px;flex:1;flex-wrap:wrap}.tray-item{border:1px solid #d8b9a6;background:transparent;color:var(--ink);font-size:10px;padding:6px 8px;max-width:150px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.tray .primary{padding:10px 14px;gap:15px;white-space:nowrap}.status{position:fixed;z-index:8;bottom:110px;left:50%;transform:translateX(-50%);background:var(--red);color:var(--cream);padding:14px 22px;font-size:12px;box-shadow:0 4px 18px #0005;max-width:90%;text-align:center}.status:empty{display:none}dialog{width:min(1030px,94vw);max-height:85vh;background:var(--cream);color:var(--ink);border:0;padding:32px}dialog::backdrop{background:#120404df;backdrop-filter:blur(5px)}.dialog-head{display:flex;justify-content:space-between;gap:20px;align-items:start}.dialog-head h2{font-family:var(--serif);font-weight:400;font-size:34px;letter-spacing:-.04em}.dialog-head button{background:none;border:1px solid #a4806d;color:var(--ink);font-size:22px;width:38px;height:38px}.dialog-note{font-size:12px;line-height:1.7;color:#755443;margin:13px 0 25px}.compare-grid{display:grid;grid-template-columns:repeat(var(--count),minmax(0,1fr));gap:25px}.compare-col{border-top:4px solid var(--red);padding-top:18px}.compare-col h3{font-family:var(--serif);font-weight:400;font-size:24px;line-height:1.2;min-height:64px}.compare-col dt{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#7e3426;margin-top:20px}.compare-col dd{font-size:12px;line-height:1.8;margin:7px 0}.compare-col .remove{background:none;border:0;padding:12px 0;color:#7d2118;font-size:11px;text-decoration:underline}.route-label{font-family:Consolas,monospace;color:#76584d;font-size:10px}.skip{position:fixed;top:-100px;left:10px;background:var(--cream);color:var(--ink);z-index:20;padding:12px}.skip:focus{top:10px}
@container(max-width:900px){.topbar{gap:24px}.brand-name{display:none}.hero{gap:6%;grid-template-columns:1.5fr 1fr}.folio{min-height:260px;padding:21px}.folio-word{font-size:40px}.folio-bottom>span{font-size:10px}.seal{min-width:65px;height:65px}.finder-fields{grid-template-columns:1fr 1fr}.field:nth-child(2){border-right:0}.field:nth-child(-n+2){border-bottom:1px solid var(--line)}.list-row{grid-template-columns:36px 1.3fr 1fr 23px;gap:15px}.row-title{font-size:24px}.editor-note{grid-template-columns:60px 1fr;gap:24px}.editor-note p{grid-column:2}.idea-layout{grid-template-columns:160px 1fr;gap:28px}.idea h2{font-size:29px}.detail-head{gap:5%}.idea dl{grid-template-columns:90px 1fr;gap:15px}.nav{gap:22px}.edition{font-size:9px}}
@container(max-width:600px){.topbar{min-height:75px;gap:15px}.brand-mark{font-size:30px}.nav{gap:19px}.nav button{font-size:11px}.nav button.active:after{bottom:-19px}.edition{display:none}.wrap,.topbar{margin-inline:6%}.hero{grid-template-columns:1fr;padding:38px 0 33px;gap:35px}h1{font-size:56px;margin-block:20px}.hero p{font-size:13px}.hero .primary{width:100%;padding:16px 19px}.folio{display:none}.page-note{display:block;font-size:10px}.page-note .mono{display:block;margin-top:8px;font-size:9px}.finder{padding-top:31px}.section-heading{align-items:center;gap:12px;margin-bottom:20px}.section-heading h2{font-size:29px}.section-heading .mono{font-size:9px;max-width:75px;text-align:right;line-height:1.6}.field{padding:12px}.field input,.field select{font-size:16px;min-height:28px}.finder-fields .field:first-child{grid-column:1/-1;border-right:0}.finder-fields{grid-template-columns:1fr 1fr}.field:nth-child(2){border-right:1px solid var(--line)}.field:nth-child(3){border-bottom:1px solid var(--line);border-right:0}.field:last-child{grid-column:1/-1}.folder-tabs{gap:3px;margin-top:25px;flex-wrap:wrap}.folder-tabs button{font-size:10px;padding:12px 11px}.result-count{font-size:9px}.list-row{grid-template-columns:27px 1fr 20px;gap:13px;padding:23px 0}.row-number{font-size:23px}.row-title{font-size:26px}.row-title small{font-size:8px;margin-bottom:8px}.row-desc{grid-column:2;grid-row:2;font-size:12px;line-height:1.7;margin-top:-3px}.row-desc span{font-size:8px}.row-arrow{grid-column:3;grid-row:1;font-size:22px}.editor-note{grid-template-columns:34px 1fr;padding:25px 20px;gap:17px;margin:34px 0 40px}.editor-star{font-size:47px}.editor-note h2{font-size:27px}.editor-note p{font-size:11px}.footer{font-size:9px;line-height:1.7;padding-bottom:140px}.detail-head{display:block;padding:10px 0 27px}.detail-head h1{font-size:49px;line-height:1.03}.detail-head .intro{font-size:12px}.detail-mark{display:none}.breadcrumb{font-size:9px;padding:24px 0}.detail-bar{font-size:10px;align-items:start;line-height:1.6}.detail-bar span:last-child{max-width:120px;text-align:right}.idea-layout{display:block;padding-top:27px}.side-index{position:static;margin-bottom:30px}.side-index h2{margin-bottom:10px}.side-index a{display:none}.side-note{margin-top:10px;font-size:10px;line-height:1.8}.idea-top{gap:13px}.idea-rank{font-size:42px}.idea h2{font-size:29px}.idea-title .eyebrow{font-size:8px}.save{min-width:40px;padding:9px}.idea-lead{font-size:12px}.idea dl{display:block;padding-bottom:17px}.idea dt{margin-top:12px}.idea dd{font-size:12px;margin-top:4px}.idea-meta{font-size:8px;line-height:1.7}.idea{margin-bottom:26px;padding-bottom:26px}.route-label{display:none}}
.viewport.phone~.tray{width:min(390px,calc(100% - 30px));flex-wrap:wrap}.viewport.phone~.tray .tray-items{order:3;flex-basis:100%}.viewport.phone~.tray .primary{margin-left:auto}.viewport.phone~.tray .tray-item{max-width:105px}
@media(max-width:650px){.preview-bar{padding:10px 13px;gap:8px}.preview-bar>span{max-width:165px;line-height:1.6}.preview-controls{gap:0}.preview-controls button{padding:8px;font-size:10px}.preview-bar strong{font-size:8px}.preview-sub{display:none}.tray{gap:9px;padding:11px 13px;flex-wrap:wrap;bottom:10px}.tray-title{font-size:11px}.tray-items{order:3;flex-basis:100%}.tray-item{max-width:95px;font-size:9px}.tray .primary{margin-left:auto;font-size:11px}.status{bottom:130px}dialog{padding:23px}.dialog-head h2{font-size:28px}.compare-grid{grid-template-columns:1fr;gap:22px}.compare-col h3{min-height:0}.compare-col dl{margin-bottom:0}.compare-col dt{margin-top:12px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*:before,*:after{transition:none!important;animation:none!important}.folio,.folio:hover,.seal{transform:none}.list-row:hover .row-title,.list-row:hover .row-arrow,.editor-note:hover .editor-star,.folder-tabs button:hover,.primary:hover{transform:none}}
/* Brand display type: local font stack only; no downloaded assets. */
h1,.folio-word,.row-title,.section-heading h2,.editor-note h2,.idea h2,.dialog-head h2,.compare-col h3,.detail-mark strong,.row-number,.idea-rank,.seal b{font-family:var(--serif);font-weight:800;letter-spacing:-.055em}
h1{font-size:clamp(42px,5.5cqw,80px);line-height:1.04}h1 em,.folio-word em{font-style:normal;font-weight:800}.folio-word{font-size:clamp(28px,3.6cqw,44px);line-height:1.08}.row-title{font-size:25px}.section-heading h2{font-size:28px}.editor-note h2{font-size:29px}.detail-head h1{font-size:clamp(39px,5.2cqw,70px);line-height:1.04}.idea h2{font-size:29px}.dialog-head h2{font-size:30px}.compare-col h3{font-size:22px}.row-number{font-size:25px}.idea-rank{font-size:48px}.detail-mark strong{font-size:65px}
@container(max-width:900px){.folio-word{font-size:31px}.row-title{font-size:23px}.idea h2{font-size:26px}}
@container(max-width:600px){h1{font-size:clamp(32px,9.7cqw,42px);line-height:1.06}.detail-head h1{font-size:clamp(34px,9.6cqw,43px);line-height:1.08}.section-heading h2{font-size:25px}.row-title{font-size:24px}.editor-note h2{font-size:24px}.idea h2{font-size:26px}.idea-rank{font-size:37px}.row-number{font-size:22px}}
@media(max-width:650px){.dialog-head h2{font-size:25px}}
</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="preview-bar"><span><strong>BBI / DESIGN STUDY 01</strong><span class="preview-sub"> &nbsp; · &nbsp; Interactive concept, not the live site</span></span><div class="preview-controls" aria-label="Preview width"><button id="desktop" aria-pressed="true">Desktop</button><button id="phone" aria-pressed="false">Phone</button></div></div>
<div class="viewport" id="viewport">
<header class="topbar"><button class="brand" data-view="hub" aria-label="BBI home"><span class="brand-mark">bbi<span class="brand-dot">.</span></span><span class="brand-name">Bro Business<br>Ideas</span></button><nav class="nav" aria-label="Preview pages"><button id="hubNav" class="active" data-view="hub">Explore lists</button><button id="detailNav" data-view="detail">Inside a list</button></nav><div class="edition">THE INDIA EDITION</div></header>
<main id="main" class="wrap">
<section id="hubView" aria-label="Business idea lists hub">
<div class="hero"><div><div class="eyebrow">A place to begin</div><h1>Your next business.<br><em>Made for India.</em></h1><p>Find a starting point that fits your skills, your surroundings, and the time you actually have.</p><button class="primary" id="findButton">Find your starting point <span class="arrow" aria-hidden="true">↘</span></button></div><div class="folio" aria-hidden="true"><div class="folio-top"><span class="mono">The field notes</span><span class="mono">Vol. 01 / IN</span></div><div class="folio-word">A small start.<br><em>A real customer.</em></div><div class="folio-bottom"><span>Less chasing the next big thing.<br>More finding your first useful thing.</span><span class="seal">BUILT FOR<b>India</b>START HERE</span></div></div></div>
<div class="page-note"><span><strong>A new India collection.</strong> Independent concept previews for future sets. These are not verified business recommendations.</span><span class="mono">No cost or income estimates</span></div>
<section class="finder" id="finder" aria-labelledby="finderHeading"><div class="section-heading"><h2 id="finderHeading">Find your kind of beginning.</h2><span class="mono">Small lists.<br>Clear choices.</span></div>
<div class="finder-fields"><div class="field"><label for="search">What are you interested in?</label><input id="search" type="search" placeholder="Try AI, local shops, languages…" autocomplete="off"></div><div class="field"><label for="budget">Budget goal</label><select id="budget"><option value="all">Any starting point</option><option value="existing">Use what I own</option><option value="small">Small setup</option><option value="equipment">Equipment-led</option></select></div><div class="field"><label for="setting">Where you work</label><select id="setting"><option value="all">Anywhere</option><option value="home">From home</option><option value="local">In my neighbourhood</option></select></div><div class="field"><label for="time">Time available</label><select id="time"><option value="all">Any schedule</option><option value="flexible">Flexible hours</option><option value="scheduled">Set appointments</option></select></div></div>
<p class="filter-note">Filter labels are illustrative planning goals. Actual costs, suitability, and workload still need research.</p>
<div class="folder-tabs" aria-label="List themes"><button data-theme="all" aria-pressed="true">All beginnings</button><button data-theme="digital" aria-pressed="false">Digital</button><button data-theme="local" aria-pressed="false">Local</button><span class="result-count" id="resultCount" aria-live="polite"></span></div>
<div id="listRows"></div><div id="empty" class="empty" hidden>No preview lists match that combination.<br><button class="reset" id="reset">Clear the filters</button></div></section>
<aside class="editor-note"><span class="editor-star" aria-hidden="true">✳</span><h2>You don’t need every idea.<br>You need a useful next step.</h2><p>Open a list. Look at who might pay, the offer you could test, and what could go wrong. Keep up to three ideas side by side.</p></aside>
</section>
<section id="detailView" hidden aria-label="Ranked business idea list">
<div class="breadcrumb"><button data-view="hub">All lists</button><span aria-hidden="true">/</span><span id="crumbTitle">AI business ideas in India</span></div>
<div class="detail-head"><div><div class="eyebrow" id="detailLabel">Digital beginnings / India</div><h1 id="detailTitle">AI business ideas<br><em>with a human edge.</em></h1><p class="intro" id="detailIntro">A first look at useful services you could shape around AI tools. Start with a buyer’s problem, then decide whether the tools earn their place.</p></div><aside class="detail-mark"><span class="eyebrow">The shortlist</span><strong id="detailCount">05</strong><p>Illustrative concepts.<br>One practical question each:<br>who would this help?</p></aside></div>
<div class="detail-bar"><span><b id="detailCountText">5 concept previews</b> · India context to verify</span><span>Editorial sequence, <b>not a success ranking</b></span></div>
<div class="idea-layout"><aside class="side-index"><h2>Inside this list</h2><div id="sideLinks"></div><p class="side-note">Costs and income are unassessed. Each concept needs local demand, tool, privacy, and compliance checks before recommendation.</p></aside><div id="ideas"></div></div>
</section>
<footer class="footer"><span>Good questions before big commitments.<br>© BBI · Future India collection · Design concept</span><span class="route-label" id="routeLabel">/india/ideas</span><span>Illustrative content only.<br>Nothing is submitted or published.</span></footer>
</main></div>
<div class="tray" id="tray" hidden aria-label="Your comparison shortlist"><span class="tray-title" id="trayTitle">Your shortlist · 0/3</span><div class="tray-items" id="trayItems"></div><button class="primary" id="compareButton">Compare <span aria-hidden="true">↗</span></button></div>
<div class="status" id="status" role="status" aria-live="polite"></div>
<dialog id="compareDialog" aria-labelledby="compareHeading"><div class="dialog-head"><h2 id="compareHeading">Which beginning fits you?</h2><button id="closeDialog" aria-label="Close comparison">×</button></div><p class="dialog-note">Compare the proposed work and first test. These are concept briefs; budgets, earnings, and demand have not been verified.</p><div class="compare-grid" id="compareGrid"></div></dialog>
<script>
(() => {
'use strict';
const $ = id => document.getElementById(id);
const ideas = [
 {id:'catalogue',title:'Regional-language product listings',short:'Product listings',label:'Language + commerce',lead:'Help a shop owner turn a rough product sheet into clear draft listings in a language their customers use. Human review is the service, not just machine translation.',buyer:'An independent seller who wants help preparing multilingual product descriptions.',offer:'A small batch of edited listings, checked by a fluent speaker and approved by the seller.',test:'Ask one seller for permission to rewrite a sample listing. Have a fluent reviewer compare meaning, tone, and product claims.',risk:'Translations can alter claims or units. Avoid promising conversion gains; never publish without the seller’s approval.'},
 {id:'faq',title:'Customer-question libraries for small shops',short:'Shop FAQs',label:'Customer service',lead:'Turn the questions a shop answers repeatedly into an owner-approved response library. Use AI to organise drafts; keep the shop’s policies as the source.',buyer:'A shop owner who handles the same product and service questions repeatedly.',offer:'A searchable set of draft replies based only on policies and answers supplied by the owner.',test:'Collect a small set of anonymised questions with consent. Draft replies and ask the owner to correct every answer.',risk:'Incorrect refund or delivery answers create real problems. Keep private customer data out of unapproved tools.'},
 {id:'captions',title:'Human-checked workshop captions',short:'Workshop captions',label:'Language + learning',lead:'Prepare accurate captions and readable notes for a tutor’s or craft instructor’s own recordings. The work is in checking names, terminology, and meaning.',buyer:'An instructor who owns a recording and wants a more accessible version.',offer:'Reviewed captions and a concise summary, using only material the instructor has permission to share.',test:'Caption a short, authorised clip. Ask the instructor and a fluent listener to flag errors before discussing a paid trial.',risk:'Recordings may contain student data or third-party material. Obtain consent and verify technical vocabulary.'},
 {id:'quotes',title:'Quote and follow-up draft support',short:'Quote drafts',label:'Local service businesses',lead:'Help a service operator organise enquiry details and draft consistent quote messages. The operator stays responsible for scope, prices, and every message sent.',buyer:'A local service operator whose enquiry and quote process is hard to keep organised.',offer:'A reusable enquiry checklist and editable quote and follow-up drafts.',test:'Use invented customer data to demonstrate one complete enquiry-to-quote example. Let the operator check whether it fits their process.',risk:'Never invent prices or send messages without approval. Avoid uploading personal customer details to unsuitable tools.'},
 {id:'menus',title:'Menu and catalogue clean-up',short:'Menu clean-up',label:'Local commerce',lead:'Turn an owner’s untidy menu or catalogue into an editable, consistent draft. AI can assist with extraction; manual checking remains essential.',buyer:'A local shop or food business with an existing menu or catalogue that needs organising.',offer:'A checked editable file with consistent item names, categories, and owner-supplied details.',test:'Ask an owner to approve a short before-and-after sample using their own document.',risk:'OCR may misread prices, ingredients, or units. The owner must verify the final document; food claims need particular care.'}
];
const sets = [
 {id:'ai-business-ideas-india',title:'AI business ideas in India',theme:'digital',tag:'Tools with a human edge',desc:'Useful services built around editing, checking, and understanding a customer.',budget:'existing',setting:'home',time:'flexible',ids:['catalogue','faq','captions','quotes','menus']},
 {id:'regional-language-services-india',title:'Put your language skills to work',theme:'digital',tag:'Language-led beginnings',desc:'Concepts for people who can make information clearer in more than one language.',budget:'existing',setting:'home',time:'flexible',ids:['catalogue','captions','faq']},
 {id:'neighbourhood-shop-services-india',title:'Start with the shops around you',theme:'local',tag:'Neighbourhood services',desc:'Look at the everyday admin and communication jobs local owners might need help with.',budget:'small',setting:'local',time:'scheduled',ids:['menus','faq','quotes']},
 {id:'home-service-concepts-india',title:'A service desk, from home',theme:'digital',tag:'Home-based concepts',desc:'Start with a clear deliverable and a conversation about whether someone needs it.',budget:'existing',setting:'home',time:'flexible',ids:['faq','catalogue','quotes']},
 {id:'creator-support-india',title:'Behind the scenes for instructors',theme:'digital',tag:'Teaching + creative work',desc:'Captioning and content support for people with knowledge to share.',budget:'equipment',setting:'home',time:'scheduled',ids:['captions','catalogue']},
 {id:'local-business-admin-india',title:'Help a local business get organised',theme:'local',tag:'Practical support',desc:'Explore small, clearly scoped projects before committing to a larger service.',budget:'small',setting:'local',time:'flexible',ids:['quotes','menus','faq']}
];
let theme='all',currentSet=sets[0],selected=[],statusTimer;
const byId=id=>ideas.find(i=>i.id===id);
function announce(message){$('status').textContent=message;clearTimeout(statusTimer);statusTimer=setTimeout(()=>$('status').textContent='',4500);}
function renderHub(){
 const term=$('search').value.trim().toLowerCase();
 const rows=sets.filter(s=>(theme==='all'||s.theme===theme)&&($('budget').value==='all'||s.budget===$('budget').value)&&($('setting').value==='all'||s.setting===$('setting').value)&&($('time').value==='all'||s.time===$('time').value)&&`${s.title} ${s.desc} ${s.tag}`.toLowerCase().includes(term));
 $('resultCount').textContent=`${rows.length} preview lists`;$('empty').hidden=rows.length>0;
 $('listRows').innerHTML=rows.map(s=>`<button class="list-row" data-set="${s.id}" aria-label="Preview ${s.title}"><span class="row-number">${String(sets.indexOf(s)+1).padStart(2,'0')}</span><span class="row-title"><small>${s.tag}</small>${s.title}</span><span class="row-desc">${s.desc}<span>${s.ids.length} concept previews · ${s.setting==='home'?'From home':'Local setting'}</span></span><span class="row-arrow" aria-hidden="true">↗</span></button>`).join('');
}
function renderDetail(){
 const s=currentSet,isAi=s===sets[0];$('crumbTitle').textContent=s.title;$('detailLabel').textContent=`${s.tag} / India`;
 $('detailTitle').innerHTML=isAi?'AI business ideas<br><em>with a human edge.</em>':s.title;
 $('detailIntro').textContent=isAi?'A first look at useful services you could shape around AI tools. Start with a buyer’s problem, then decide whether the tools earn their place.':s.desc+' These examples outline a possible offer and an early test; they are not verified recommendations.';
 $('detailCount').textContent=String(s.ids.length).padStart(2,'0');$('detailCountText').textContent=`${s.ids.length} concept previews`;
 $('sideLinks').innerHTML=s.ids.map((id,n)=>`<a href="#idea-${id}"><span>${String(n+1).padStart(2,'0')}</span>${byId(id).short}</a>`).join('');
 $('ideas').innerHTML=s.ids.map((id,n)=>{const i=byId(id);return `<article class="idea" id="idea-${id}"><div class="idea-top"><span class="idea-rank">${String(n+1).padStart(2,'0')}</span><div class="idea-title"><div class="eyebrow">${i.label}</div><h2>${i.title}</h2></div><button class="save" data-save="${id}" aria-pressed="${selected.includes(id)}" aria-label="${selected.includes(id)?'Remove from':'Add to'} shortlist: ${i.title}">${selected.includes(id)?'✓':'+'}</button></div><p class="idea-lead">${i.lead}</p><details ${n===0?'open':''}><summary>Buyer, offer, first test &amp; risks</summary><dl><dt>Who might pay</dt><dd>${i.buyer}</dd><dt>The offer</dt><dd>${i.offer}</dd><dt>A first test</dt><dd>${i.test}</dd><dt>What to check</dt><dd>${i.risk}</dd></dl></details><div class="idea-meta"><span>Concept preview · not yet validated</span><span>Budget: unassessed</span></div></article>`}).join('');
}
function view(name,scroll=true){const detail=name==='detail';$('hubView').hidden=detail;$('detailView').hidden=!detail;$('hubNav').classList.toggle('active',!detail);$('detailNav').classList.toggle('active',detail);$('hubNav').setAttribute('aria-current',detail?'false':'page');$('detailNav').setAttribute('aria-current',detail?'page':'false');if(detail)renderDetail();$('routeLabel').textContent=detail?`/india/ideas/${currentSet.id}`:'/india/ideas';if(scroll)window.scrollTo({top:0,behavior:'instant'});}
function updateSelection(){
 $('tray').hidden=selected.length===0;$('trayTitle').textContent=`Your shortlist · ${selected.length}/3`;
 $('trayItems').innerHTML=selected.map(id=>`<button class="tray-item" data-remove="${id}" aria-label="Remove ${byId(id).title}">${byId(id).short} ×</button>`).join('');
 document.querySelectorAll('[data-save]').forEach(b=>{const has=selected.includes(b.dataset.save);b.textContent=has?'✓':'+';b.setAttribute('aria-pressed',String(has));b.setAttribute('aria-label',`${has?'Remove from':'Add to'} shortlist: ${byId(b.dataset.save).title}`)});
 if($('compareDialog').open){if(!selected.length)$('compareDialog').close();else renderCompare();}
}
function save(id){if(selected.includes(id)){selected=selected.filter(x=>x!==id);announce(`${byId(id).short} removed.`)}else if(selected.length<3){selected.push(id);announce(`${byId(id).short} added. ${selected.length} of 3 selected.`)}else{announce('Your shortlist has three ideas. Remove one to make room.')}updateSelection();}
function renderCompare(){ $('compareGrid').style.setProperty('--count',selected.length);$('compareGrid').innerHTML=selected.map(id=>{const i=byId(id);return `<section class="compare-col"><h3>${i.title}</h3><dl><dt>Potential buyer</dt><dd>${i.buyer}</dd><dt>First test</dt><dd>${i.test}</dd><dt>Key risk</dt><dd>${i.risk}</dd><dt>Costs &amp; income</dt><dd>Unassessed. Research needed.</dd></dl><button class="remove" data-remove="${id}">Remove this idea</button></section>`}).join(''); }
document.addEventListener('click',e=>{
 const v=e.target.closest('[data-view]');if(v)view(v.dataset.view);
 const s=e.target.closest('[data-set]');if(s){currentSet=sets.find(x=>x.id===s.dataset.set);view('detail')}
 const t=e.target.closest('[data-theme]');if(t){theme=t.dataset.theme;document.querySelectorAll('[data-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b===t)));renderHub()}
 const add=e.target.closest('[data-save]');if(add)save(add.dataset.save);
 const remove=e.target.closest('[data-remove]');if(remove)save(remove.dataset.remove);
});
['search','budget','setting','time'].forEach(id=>$(id).addEventListener(id==='search'?'input':'change',renderHub));
$('reset').addEventListener('click',()=>{$('search').value='';['budget','setting','time'].forEach(id=>$(id).value='all');theme='all';document.querySelectorAll('[data-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme==='all')));renderHub()});
$('findButton').addEventListener('click',()=>{$('finder').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});$('search').focus({preventScroll:true})});
['desktop','phone'].forEach(id=>$(id).addEventListener('click',()=>{$('viewport').classList.toggle('phone',id==='phone');$('desktop').setAttribute('aria-pressed',String(id==='desktop'));$('phone').setAttribute('aria-pressed',String(id==='phone'))}));
$('compareButton').addEventListener('click',()=>{renderCompare();$('compareDialog').showModal()});$('closeDialog').addEventListener('click',()=>$('compareDialog').close());
$('compareDialog').addEventListener('click',e=>{if(e.target===$('compareDialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}});
renderHub();view('hub',false);
})();
</script>
</body></html>
```
