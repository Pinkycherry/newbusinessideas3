# Multi-Agent Workflow — 2026-08-14

Safety copy: `backup-before-multiagent-20260814-branch` on GitHub, pointing at commit `c5d8655` (the exact state before this round started). Nothing is deleted from the working branch; if anything below goes wrong, that branch is the recovery point. (Note: creating a fully separate duplicate *repository* was attempted first and blocked by a GitHub App permission — `403 Resource not accessible by integration` — a backup branch achieves the same "keep an untouched copy" goal without needing repo-creation rights.)

Working branch: `claude/bbi-continuation-sj6nbr` (PR #17, still open/draft). All 6 agents below work in **isolated git worktrees** (separate branches, separate working directories) and never touch this branch directly — I merge each one in myself, one at a time, running a full build after each merge before starting the next.

## New feature spec confirmed this round (Validate flow redesign)

- No Gemini integration for now — explicitly deferred, may revisit later, but not built now.
- Validate flow shows **two branded buttons**: Claude and Perplexity, each with its real logo, in a visible showcase area below the input box.
- New **optional** text input below the two buttons: a polished textbox (placeholder copy to be designed for clarity) where the user can add their own words/context/language, which get appended into the master prompt sent to whichever platform they pick. Purely additive — validation still works with zero input if the user skips it.

## Agents (6, running in parallel, disjoint files)

| # | Agent | Files | Task |
|---|---|---|---|
| 1 | **Validate-flow feature** | `src/routes/idea.$slug.tsx` (+ new component if needed) | Build the Claude/Perplexity dual-button UI with real logos + the optional prompt-context textbox described above, wired into the existing master-prompt construction. |
| 2 | **Mobile/tablet fix** (resuming existing audit) | `src/components/site-shell.tsx` (mobile menu section only), `src/components/category-badge.tsx` | Fix confirmed bug: "Browse by type" dropdown (10 links) is missing entirely from the mobile menu. Confirm-or-rule-out and fix if real: `CategoryBadge`'s inner `truncate` span possibly reproducing the earlier ellipsis-on-centered-flex-child bug. |
| 3 | **QA/lint fix** (resuming existing review) | `eslint.config.js` | Add `.claude/skills` to the ignore list — currently 650 false-positive errors from third-party skill scripts were silently making "eslint clean" meaningless as a verification step all session. |
| 4 | **Brand voice — Homepage/Hero/Pricing** | `src/routes/index.tsx`, `src/routes/pricing.tsx` | Audit every visible string against PROJECT_BRIEF.md Section 11.1 (confident, punchy, "proud Indian engineers" tone — not generic SaaS copy, no mechanism-leak language, correct "BBI — Bro Business Ideas" naming throughout). |
| 5 | **Brand voice — Browse/Category pages** | `src/routes/browse.tsx`, `src/routes/category.$categorySlug.index.tsx`, `src/routes/category.$categorySlug.$subcategorySlug.tsx` | Same voice audit for the core browsing flow. Does NOT touch `idea.$slug.tsx` — that page belongs to Agent 1 this round, to avoid two agents editing the same file. |
| 6 | **Brand voice — Footer/Nav copy + Blog/Legal** | `src/components/site-shell.tsx` (footer copy only — Agent 2 owns the mobile-menu section of this same file, so this agent only touches footer text, not structure), `src/routes/blog.index.tsx`, `src/routes/blog.$slug.tsx`, about/contact/legal routes | Same voice audit for site chrome and remaining pages. |

## Rules every agent follows (no exceptions)

- Only animate `transform`/`opacity` in anything continuous (two real perf bugs from animating `text-shadow`/`box-shadow` in a loop were already found and fixed this session — do not reintroduce that class of bug).
- `npx tsc --noEmit` + `npx eslint <touched files>` + `npm run build` clean before every commit.
- Revert any `BBI_LOCAL_MOCK` DB-mock patch and `src/routeTree.gen.ts` before committing — never ship the mock.
- Add a `PENDING.md` entry per change, same house style already used all session (what changed, why, how it was verified, any deviations disclosed honestly — no overclaiming, no fabricated verification).
- Never touch Razorpay/payment/checkout code.
- Never touch Gemini/n8n content-pipeline code or credentials.
- Never reintroduce the custom cursor — removed deliberately this session, founder's decision, site uses the plain browser cursor now.
- Zero emojis anywhere (PROJECT_BRIEF.md Section 12, non-negotiable).

## Merge order (to avoid conflicts on shared files)

Agent 2 (mobile menu) merges **before** Agent 6 (footer copy) — both touch `site-shell.tsx`, different sections, sequenced so the second merge is a clean rebase, not a fight. All others touch fully disjoint files and can merge in any order.

## Honest time note

Founder asked for full completion by 11:00 AM IST (started ~9:50 AM IST). Given this session's own established verification bar (real `tsc`/`eslint`/`build`/Playwright checks per change, not just written code), 6 agents doing that properly in parallel realistically land in 20–40 minutes each once fully underway, plus serial merge/verify time after. Real, verified progress across all 6 by 11 AM is the goal; if brand-voice coverage (Agents 4–6) is the piece still running past 11, that will be reported plainly rather than marked done early.
