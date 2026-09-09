# Field Guide — version record

The current visual system, and what it replaced. Companion to
`DEPLOYMENT-BASELINE.md` (on `claude/code-skills-plugins-setup-zg8aqz`),
which pins the commit this redesign started from.

## This version

| | |
|---|---|
| **Stamped (UTC)** | `2026-09-09T04:01:57Z` |
| **Branch** | `claude/bbi-field-guide` |
| **Started from** | `02cbbf2` — the live production commit, not `main` |
| **Design world** | Field Guide — paper and ink, plates and rules |
| **Preview** | https://newbusinessideas3-git-claude-bbi-field-guide-pinky12.vercel.app |

## The rule that governs it

The brand indigo `#4643BA` is unchanged. What changed is its job: it was a
glow — gradient washes, frosted glass, coloured shadow — and it is now ink:
rules, marks, plate edges.

**No word of the site was lost.** `scripts/copy-manifest.mjs` walks the
TypeScript AST and collects every user-visible string. Against the `02cbbf2`
baseline of 390, the site differs by exactly one addition — "Share", from the
share control on the blueprint page — and zero removals.

## Tokens

| Token | Value | Role |
|---|---|---|
| `--background` | `#F7F6FB` | paper, cooled toward the violet — deliberately not warm cream |
| `--foreground` | `#12122E` | ink |
| `--primary` / `--ring` | `#4643BA` | engraving ink. Unchanged from before |
| `--card` | `#FFFFFF` | opaque. The single value that stops surfaces reading as glass |
| `--border` | `rgba(70,67,186,0.22)` | the plate rule |
| `--radius` | `0.5rem` | plate, not capsule |

Plate radii: `0.5rem` / `0.375rem` / `0.4375rem`, from a capsule set of
`1.75` / `1.25` / `1.5rem`.

## The verdict palette

Four colours, defined and contrast-measured in `styles.css` before this
redesign and unused on the page that needed them most:

| Token | Value | Means |
|---|---|---|
| `--hl-gold` | `#8A5D00` | emphasis and labels |
| `--hl-green` | `#0F6E44` | a positive verdict — why it works, what you earn |
| `--hl-coral` | `#B0442C` | a cost or a risk — what hurts, what it costs |
| `--hl-teal` | `#10627A` | a measured figure — trend scores, demand |

## Motion

| Effect | Where | Notes |
|---|---|---|
| `liquid-ether` | hero ground | WebGL fluid in brand ink. The one loud moment |
| `shimmer-text` | standing lines | never body copy — a moving gradient on a paragraph is unreadable |
| `slide-text-link` | links | CSS only, no runtime cost |
| `card-flip` | the two hero panels | label on the front, body on the back. Flips on hover, tap and Enter/Space, so the back is reachable on touch |
| `attract-button` | Surprise Me | ink specks gathering to the pointer |
| `text-cycle` | Surprise Me eyebrow | cycles the real catalogue — data, not decoration |
| `share-links` | blueprint page | share destinations unrolling sideways |

Existing site motion is untouched and still in force: `useMagnet`,
`useStaggerReveal`, `useTextReveal`, `useScrollProgress` and the GSAP
`usePillInteraction` hook.

Every effect honours `prefers-reduced-motion`.

### All seven are wired

An earlier version of this file said two were held back because they needed
copy that did not exist. That was too cautious: `card-flip` runs on the hero
panels' own label and body, and `text-cycle` runs on the real category names
from the catalogue. Neither needed a word written.

The one thing `card-flip` did need was reach. Hover alone would have hidden a
panel's body on touch, where there is no hover, so it flips on tap and on
Enter or Space too and carries `role`/`tabIndex`/`aria-pressed`.

## Bugs found and fixed on the way

- A per-card hash (reduce → abs → modulo over the slug) selecting between
  `blob-sm-1/2/3`, all byte-identical, so it computed a constant for every
  card in every grid.
- A gauge fill of `from-primary to-accent` — byte-identical tokens, so a
  gradient between one colour.
- The header overlap at 1280px, where the logo carried `min-w-0` and was
  crushed by the nav. Predates this redesign.
- The fluid hero fading through grey: the shader mixed toward `vec4(0,0,0,0)`,
  so soft edges passed through black before their alpha reached zero. It now
  mixes toward the paper token.
- The copy check's own blind spot. `scripts/copy-manifest.mjs` did not read
  `text` props, so it could not see strings passed that way — including the
  hero eyebrow — and reported a false removal the moment a string moved into
  one. `text` is now counted, and the baseline was regenerated from `02cbbf2`
  with the corrected extractor: **390 strings**, not the 389 first recorded.

## Environment notes for whoever picks this up

- Install with **npm**, not bun. `bun.lock` resolves 42 packages through
  Lovable's private registry; `package-lock.json` is clean public npm.
- The build environment blocks `*.supabase.co`, `nutrizoe.in` (the blog
  source) and the off-site `/wp-content/` images. `/blog` returns 500 locally
  for that reason alone and is fine on Vercel.
- `.localdev/` holds a PostgREST stand-in that renders the site offline; it is
  gitignored and never deployed.
- `three` costs 1.16 MB (234 kB gzip) for the hero alone.
