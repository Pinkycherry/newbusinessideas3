# Step 12 (Calculators/Tools) + Step 10 (Listicle template) — wide-scale plan

Status: **research + plan only. No feature code until you approve.**
Discipline: everything here is checked against `BUTTERFLY_EFFECT.md` first. Both areas are **new, isolated routes + new isolated tables** — they touch nothing that already exists on the site or in Supabase. That is exactly why they're the safest first builds.

---

## Why these two are safe (butterfly check)

Run against the 5-question check:
1. Modify a shared file? **No** — new routes `/tools/*` and `/list/*`, brand-new components.
2. Change Supabase schema/rows? **No** — new tables only, keyed by their own id. The `ideas` table and the ~280 live rows are never touched.
3. Change global styling/tokens? **No** — calculators reuse existing brand tokens read-only; they define nothing global.
4. Change a data contract others read? **No** — new types for new tables; existing `ideas-shared.ts` untouched.
5. Can it be a NEW isolated thing? **Yes.**

Result: **all "no" on 1–4, "yes" on 5 → safe to build.** The only place they ever touch existing pages is an *optional* embed step (a calculator card on a relevant idea page), and that is conditional-render only — it appears where data says it should and changes nothing when it's absent.

---

## The calculators — 22 of them (target was 20+)

Researched against what the market ships (SaaS calculators, HubSpot/Shopify/Stripe tool pages, startup-finance tools). Each is pure client-side math — **no API calls, no user data leaves the browser** — which is also why they're zero-risk.

### Group A — Money & Finance (highest dwell time; these are the hero tools)
1. **Startup Cost Calculator** — one-off + monthly line items → total to launch, first-year cost. Market standard: preset templates per business type, editable line items.
2. **Break-even Calculator** — fixed costs, price, variable cost → units + revenue + timeline to break even. Standard: break-even chart.
3. **Profit Margin Calculator** — cost + price → gross margin %, markup %, profit. Standard: reverse mode (target margin → price).
4. **Pricing Calculator** — cost-plus vs value-based; suggests a price band, not one number.
5. **SaaS MRR / ARR Calculator** — plans × subscribers → MRR, ARR, with expansion/contraction. Standard: growth projection.
6. **Burn Rate & Runway Calculator** — cash, monthly burn → months of runway, zero-cash date. Standard: gross vs net burn.
7. **LTV Calculator** — ARPU, margin, churn → customer lifetime value.
8. **CAC & LTV:CAC Ratio Calculator** — spend, new customers → CAC; pairs with LTV for the 3:1 health check. Standard: payback-months output.
9. **ROI Calculator** — investment vs return → ROI %, annualized.
10. **Payback Period Calculator** — investment, monthly profit → months to recover.
11. **Loan / EMI Calculator** — India-relevant: principal, rate, tenure → EMI, total interest. Standard: amortization summary.

### Group B — Marketing & Growth
12. **Conversion Rate Calculator** — visitors, conversions → rate; + "what-if" (lift % → extra revenue).
13. **Ad Budget / ROAS Calculator** — spend, revenue → ROAS, break-even ROAS from margin.
14. **Email Marketing ROI Calculator** — list, open/click/convert, AOV → revenue + ROI.
15. **SEO Traffic Value Calculator** — keywords, volume, CTR by position, CPC → traffic value vs paid.
16. **Viral Coefficient (K-factor) Calculator** — invites × conversion → K, viral growth signal.

### Group C — Market sizing, ops & product
17. **TAM / SAM / SOM Calculator** — top-down or bottom-up → market size trio. Standard: funnel chart.
18. **Freelance / Consulting Rate Calculator** — target income, billable hours, expenses → hourly/day rate.
19. **Churn & Retention Calculator** — churn % → retention, avg customer lifespan, cohort survival.
20. **Inventory Reorder Point Calculator** — daily usage, lead time, safety stock → reorder point.

### Group D — BBI-specific (our edge; nobody else has these)
21. **Idea Fit Scorecard** — weighted score across trend, competition, capital needed, skill match, time-to-revenue → a single "fit" score + verdict band. This is our signature tool and ties directly to the idea library.
22. **Side-Hustle Income Calculator** — hours/week × rate (or units × price) → realistic monthly/annual take-home, with a "quit-your-job" threshold line.

*(Room to grow later: Equity/Dilution, Runway-with-hiring, Unit-Economics dashboard — but 22 is a strong launch set.)*

---

## UI: small, interactive, on-brand

- **Small footprint, live results.** Every calc is a compact card: a few inputs on the left/top, the result updating instantly as you type (no "Calculate" button wait — results recompute on change). Sliders where a range makes sense, number inputs otherwise.
- **On-brand, reused tokens.** Same indigo/violet palette, same button style, same card treatment already on the site — read-only reuse, nothing new defined globally. When we do the centralized branding round later, these inherit it for free.
- **One result that matters, made big.** Each calc has a single headline number (e.g. runway = "7 months") shown large, with the supporting breakdown small underneath. That's the market pattern that keeps people engaged.

## Placement — "where users spend more time," visible & clickable (your ask)

1. **A dedicated `/tools` hub** — the home for all 22, grouped A–D, each a clickable card. This is the SEO + shareable surface.
2. **Homepage "Top Tools" strip** — the 4–5 most useful (Startup Cost, Break-even, Runway, Idea Fit Scorecard, Side-Hustle Income) shown as clickable cards in a section, not buried in a dropdown. Visible on the page people land on most.
3. **Contextual embed on idea pages** — a relevant calculator surfaces on an idea page (e.g. a SaaS idea shows the MRR + Runway calc). Conditional render: shows only when we've mapped a tool to that idea, breaks nothing when we haven't.
4. **In-content links from listicles** — the listicles (Step 10) link to the matching calculator, so the two areas feed each other.

Not a category dropdown. Prominent, clickable, on the high-traffic pages.

---

## Step 10 — Listicle template at wide scale

**One template, many listicles, driven by data — not one hand-built page each.**

- **New route `/list/$slug`** + **new isolated Supabase table** (e.g. `listicles`: id, slug, title, intro, seo fields, and a JSONB `items[]` array of entries — each item can point to an existing idea by id or stand alone). One React template renders any listicle from its row.
- **Wide scale = data, not code.** "27 Business Ideas Under ₹50,000", "15 AI SaaS Ideas for 2026", "Best Side Hustles for Students" — each is a new row, not a new file. Add 50 listicles → still one template.
- **Feeds off the library you already have.** Listicle items can reference the 280 live ideas (by id), so a listicle is a curated view over existing content — additive, never duplicating or mutating the `ideas` table.
- **SEO leverage.** Listicles are how this category of site ranks; each row carries its own SEO title/meta/slug (the same package the n8n pipeline will fill in bulk later).
- **Isolation.** New route + new table + optional read-only reference to existing ideas = near-zero blast radius, same as the calculators.

---

## What I recommend we do, in order

1. **Build the `/tools` hub + the first 5 hero calculators** (Startup Cost, Break-even, Runway, Idea Fit Scorecard, Side-Hustle Income) as one isolated slice. Prove the UI + brand fit on the branch preview, you review, then I fill the remaining 17.
2. **Add the homepage "Top Tools" strip** (one new section, one section only — medium risk, verified against the rest of the homepage after).
3. **Build the `/list/$slug` template + `listicles` table**, seed 3–5 listicles from existing ideas so you can see it live.
4. **Contextual embeds** on idea pages last (conditional, once the tools exist).

Everything above is additive and isolated. **Centralized branding stays deferred** — it's high blast radius and deserves its own single-focus round, exactly as you said.

Say GO on step 1 (or reorder) and I'll build only that slice, verify it on the preview, and show you before touching anything else.
