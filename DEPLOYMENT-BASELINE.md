# Deployment Baseline

The agreed starting point for all editing, updating and deploying on this
project. Everything from here is measured against this snapshot.

## Baseline

| | |
|---|---|
| **Baseline URL** | https://newbusinessideas3-hd3danwiq-pinky12.vercel.app/ |
| **Timestamp (UTC)** | `2026-09-09T01:48:33Z` |
| **Declared by** | Repo owner, as the point to start from |
| **Recorded on branch** | `claude/code-skills-plugins-setup-zg8aqz` |

## Repository state at baseline

| | |
|---|---|
| **Default branch** | `main` |
| **`main` HEAD** | `8f17dabbcbea65a74e11411917d41130e8b00812` |
| **Tree** | `957108b685914ca2db9e456a016285d9e256471a` |
| **Commit** | "Mapped motion systems" |
| **Authored** | `2026-09-07T18:36:30Z` by `gpt-engineer-app[bot]` (Lovable) |

Pin the baseline any time with:

```sh
git diff 8f17dab..HEAD          # everything changed since baseline
git checkout 8f17dab            # inspect the baseline tree
```

## What is deployed

**BBI — Bro Business Ideas** — "Researched business idea blueprints with market
context, trend scores and honest founder-fit verdicts."

**Stack:** React 19.2 · TanStack Start 1.168 / Router 1.170 · Vite (via
`@lovable.dev/vite-tanstack-config`) · Tailwind CSS 4.2.1 · Radix UI
(shadcn-style, 46 components) · Supabase 2.111 · GSAP 3.15 · Framer Motion 13.

**Routes (20):** `index` · `about` · `browse` · `search` · `pricing` ·
`services` · `contact` · `sign-in` · `blog.index` · `blog.$slug` ·
`idea.$slug` · `category.$categorySlug` (+ `.index`, `.$subcategorySlug`) ·
`privacy` · `terms` · `gdpr` · `disclaimer` · `refund-policy` · `__root`

**Motion layer:** `src/motion/` — `gsap.ts` plus 9 hooks (pointer channel,
magnet, odometer, scroll progress, stagger reveal, text reveal, tilt, wipe).
This is the surface the newly installed GSAP and Motion skills act on.

130 source files under `src/`.

## Verification status — read this before trusting the mapping

Recorded honestly, because two things could **not** be checked from the build
environment:

- **The live page content was not fetched.** `*.vercel.app` is blocked by this
  environment's egress proxy (`connect_rejected`, org policy), so the baseline
  URL could not be opened or screenshotted from here.
- **The URL was not confirmed to map to `8f17dab`.** That correlation is an
  inference: `8f17dab` is the newest commit on `main`, and the URL carries no
  `-git-<branch>` segment, which is Vercel's shape for a production deployment
  rather than a branch preview. Confirm it in the Vercel dashboard, where the
  deployment's source commit is shown.
- **No build was run.** `bun install --frozen-lockfile` fails here: the
  lockfile resolves to Lovable's private registry
  (`europe-west1/4-npm.pkg.dev/lovable-core-prod`), which returns 403 from this
  environment. So dependency install and `vite build` cannot be reproduced
  locally, and any build-affecting change must be verified by the Vercel
  deployment itself rather than here.

## Working agreement from this point

1. `main` @ `8f17dab` is the baseline. Changes land on feature branches and
   reach production through Vercel.
2. Lovable syncs from the connected branch — never force-push, rebase or amend
   already-pushed commits (see `AGENTS.md`).
3. The design skill stack in `.claude/settings.json` is active for work on top
   of this baseline; see `.claude/DESIGN-STACK.md` for what to reach for.
