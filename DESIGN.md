# Design

The homepage runs its own visual world — **the void**. The other 25 routes keep
the light palette they were designed against. This file records the void.

## Scope

`html.bbi-void`, set in `src/routes/__root.tsx` on the server-rendered `<html>`
when `pathname === "/"`. `light` stays on alongside it, so every token the void
does not override still resolves and nothing renders unstyled. Written on the
server so the void paints on first byte rather than flashing light.

Extending it past `/` is an open decision, deliberately not taken:
`BUTTERFLY_EFFECT.md` classes a global token change as a single-focus round of
its own.

## Mode

**Persuade.** The homepage's job is a decision — start browsing, or leave. The
catalog pages behind it are Operate and keep their own language.

## Palette

Measured against `#000000`, not picked by eye:

| Token | Value | Contrast | Role |
|---|---|---|---|
| `--color-void` | `#000000` | — | every surface. The void is the design |
| `--color-bone-white` | `#ffffff` | 21.0:1 | headlines, lead copy |
| `--color-silver-mist` | `#bdbdbd` | 10.4:1 | body |
| `--color-ash-gray` | `#9a9a9a` | 6.6:1 | meta, captions |
| `--color-saffron-spark` | `#ffb829` | 11.9:1 | eyebrows, emphasis, link hover |
| `--color-electric-iris` | `#8052ff` | 4.1:1 | **ground only, never text** |
| `--color-deep-verdant` | `#15846e` | — | particle hue |

Violet at 4.1:1 fails as a foreground on black. That is precisely why the
reference reserves it for the filled pill, where white on it measures 4.57:1
and passes. It is not used as a text colour anywhere.

The four highlight hues were re-measured for black rather than carried over
from the light theme, where all four fell under 4.5:1 on this ground:
gold `#ffb829`, green `#3ddc97`, coral `#ff7a5c`, teal `#4fd1c5`.

## Type

Inter, weights 200/400/600. Weight **200** was added to the font link — it was
not being loaded, so the reference's signature ultra-light body would have
silently rendered at 400.

Hierarchy comes from scale and tracking, never weight. Headlines and body are
both 400 in the reference; body drops to 200.

| Role | Size | Tracking |
|---|---|---|
| h1 | `clamp(2.75rem, 8.4vw, 7.0625rem)` → 113px | -0.04em |
| h2 | `clamp(2.125rem, 5.6vw, 4.875rem)` → 78px | -0.04em |
| h3 / `.t-card` | → 27px | -0.02em |
| body | → 18px, weight 200 | normal |
| eyebrow | 14px, weight 600, uppercase | 0.025em |

Sizes are clamped so 113px does not shred a 390px phone: the ratio is
preserved, the floor is not.

## Surfaces and elevation

None. No cards, no borders, no shadows, no panels — elements float on black
with whitespace alone. `--border` resolves to `transparent`, so the 19 border
utilities already on the page go quiet without a markup edit.

The one exception: the category ticker pills keep a
`rgba(255,255,255,0.16)` hairline. Without it a row of bare words stops
reading as a set of controls.

## Imagery

**The tree stays.** It is BBI's own signature, not the reference's, and it was
kept deliberately. Its glow was retoned from midnight-violet-on-white to a
violet-to-amber bloom that reads as light in a void.

Around it, `VoidParticles` (`src/components/void-particles.tsx`) drifts a field
of outlined triangles in the five brand hues — canvas, one composited layer,
density scaled to viewport area, `aria-hidden`, wrapped rather than respawned
so nothing pops. It renders a single static frame under
`prefers-reduced-motion` so the texture survives when the movement is refused,
and stops entirely when the tab is hidden.

## Two cascade traps, both hit and both fixed

1. **Layered `!important` beats unlayered `!important`.** `CLAUDE.md` records
   that unlayered rules beat every `@layer` — true for *normal* declarations
   and exactly backwards for important ones. `html.light body` and
   `html.light .glass` both live in `@layer base` and both mark their paint
   `!important`, so the unlayered void block lost despite higher specificity.
   The overrides that collide with them are declared inside `@layer base`,
   where specificity decides again.
2. **Glass lives on pseudo-elements.** Clearing `.mo-card`'s own background
   left `::before` painting `linear-gradient(135deg, rgba(182,181,227,0.68)…)`
   — a pale violet outline around every card. The pseudo-elements are cleared
   explicitly. `.tree-asset-container::before` is deliberately excluded: that
   one is the tree's glow.

Both were caught by rendering and measuring, not by reading the CSS.

## Deviation from the craft floor, on purpose

The floor bans eyebrow labels outright — "no brief earns it back". The pinned
brief mandates amber uppercase eyebrows, and a pinned brief overrides the
floor. No new ones were added; the 24 already on the page were recoloured.
