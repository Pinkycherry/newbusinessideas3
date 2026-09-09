# Deployment Baseline

The agreed starting point for all editing, updating and deploying. Everything
from here is measured against this snapshot.

## Baseline — the live production deployment

| | |
|---|---|
| **Commit** | `02cbbf23f2375a1e4bdc33adbd0e69deefbfcfcd` (`02cbbf2`) |
| **Subject** | "Add the session handoff for the n8n live-workflow fixes" |
| **Authored** | `2026-08-31T23:42:20Z` |
| **Source branch** | `claude/bbi-continuation-sj6nbr` |
| **Vercel deployment** | `8P2paKdnH` — Production, Current, Ready |
| **Baselined at (UTC)** | `2026-09-09T02:08:52Z` |

**Domains serving this build**

- `newbusinessideas3.vercel.app` — production
- `newbusinessideas3-4idksbvr3-pinky12.vercel.app` — immutable deployment URL
- `newbusinessideas3-git-claude-bbi-continuation-sj6nbr-pinky12.vercel.app` — branch URL

Pin the baseline any time:

```sh
git diff 02cbbf2..HEAD          # everything changed since baseline
git checkout 02cbbf2            # inspect the baseline tree
```

## How the baseline was confirmed

`*.vercel.app` is blocked by the build environment's egress proxy, so the live
page could not be fetched. It was identified instead by matching distinctive
copy from a screenshot of the live site against the source at each candidate
commit:

- The hero line **"Tired of paying just to check if your idea will work?"** is
  present at `02cbbf2` (`src/routes/index.tsx:345`) and **absent** at the
  branch head `05ca082`, whose homepage was rebuilt around
  `golden-tree-section.tsx` and `void-shell.tsx`.

That match is what fixes production at `02cbbf2` rather than at the branch tip.

## Three-way divergence — the thing to understand

The repository has three different states, and none of them agree:

| Ref | Commit | What it is |
|---|---|---|
| `main` | `8f17dab` | **Stale.** Does not match production. |
| **production** | **`02cbbf2`** | **Live at `newbusinessideas3.vercel.app`. The baseline.** |
| `claude/bbi-continuation-sj6nbr` | `05ca082` | 25 commits **ahead** of production. Not live. |

**`main` is behind production by 117 files (+9,050 / −6,528).** Its only unique
commits, `8f17dab` ("Mapped motion systems") and `bbe432c` ("Changes"), touch
nothing but `.lovable/plan.md` — no application code. So `main` carries no work
that production lacks.

**The branch tip is ahead of production by 25 commits (134 files, +19,409 /
−1,802)** — including the homepage rework. That work is *not* live. It stays on
`claude/bbi-continuation-sj6nbr`; nothing about this baseline deletes it.

### Consequence

Clicking through the GitHub repo's default branch does **not** show the code
running at `newbusinessideas3.vercel.app`. Closing that gap means bringing
`main` up to `02cbbf2` **and** pointing Vercel's production branch at `main` —
the second half is a dashboard setting that cannot be changed from the
repository.

## What is deployed at the baseline

**BBI — Bro Business Ideas** — "Researched business idea blueprints with market
context, trend scores and honest founder-fit verdicts."

**Stack:** React 19.2 · TanStack Start / Router · Vite (via
`@lovable.dev/vite-tanstack-config`) · Tailwind CSS 4.2.1 · Radix UI
(shadcn-style) · Supabase · GSAP 3.15 · Framer Motion 13.

## Constraints on this working environment

- **The live site cannot be fetched here.** `*.vercel.app` is blocked by the
  egress proxy (`connect_rejected`, org policy). Verification is done by
  reading source at a commit, or from screenshots.
- **No build can be run here.** `bun install --frozen-lockfile` fails: the
  lockfile resolves to Lovable's private registry
  (`*.pkg.dev/lovable-core-prod`), which returns 403. Build-affecting changes
  must be verified by the Vercel deployment itself.
- **Vercel settings cannot be changed from here.** No Vercel API access;
  production-branch and domain changes are dashboard actions.

## Working agreement from this point

1. `02cbbf2` is the baseline. All further edits are measured from it.
2. Lovable syncs from the connected branch — never force-push, rebase or amend
   already-pushed commits (see `AGENTS.md`).
3. The design skill stack in `.claude/settings.json` is active; see
   `.claude/DESIGN-STACK.md` for what to reach for.
