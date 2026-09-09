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

**No word of the site changed.** `scripts/copy-manifest.mjs` walks the
TypeScript AST and collects every user-visible string; the set has diffed
identical on every commit.

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
| `card-flip` | available | needs a title/points pair; not wired, see below |
| `attract-button` | available | ink specks gathering to the pointer |
| `text-cycle` | available | needs a phrase set; not wired, see below |
| `share-links` | available | adds a "Share" control |

Existing site motion is untouched and still in force: `useMagnet`,
`useStaggerReveal`, `useTextReveal`, `useScrollProgress` and the GSAP
`usePillInteraction` hook.

Every effect honours `prefers-reduced-motion`.

### Two effects are built but deliberately not wired

`card-flip` needs a title, a subtitle, a description and a list of points per
card. `text-cycle` needs a set of phrases to rotate. The surfaces they would
suit — "What you get", "How it works" — carry a single label and one body
paragraph each. Wiring either would mean **writing new copy**, which the
every-word rule forbids without a decision from the owner. They are ready and
one import away once that copy exists.

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

## Environment notes for whoever picks this up

- Install with **npm**, not bun. `bun.lock` resolves 42 packages through
  Lovable's private registry; `package-lock.json` is clean public npm.
- The build environment blocks `*.supabase.co`, `nutrizoe.in` (the blog
  source) and the off-site `/wp-content/` images. `/blog` returns 500 locally
  for that reason alone and is fine on Vercel.
- `.localdev/` holds a PostgREST stand-in that renders the site offline; it is
  gitignored and never deployed.
- `three` costs 1.16 MB (234 kB gzip) for the hero alone.
