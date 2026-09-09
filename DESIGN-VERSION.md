# Design version record

## v3 — The Aceternity theme (2026-09-09)

Branch: `claude/bbi-field-guide`

The component set the founder supplied is now the site's theme, not a garnish
on top of an older one. Header to footer, a card, a button and a heading each
have exactly one implementation.

### What the components are, and where they run

| Component | Where |
|---|---|
| HoverBorderGradient | The one primary action per view — hero CTA, footer CTA, header "Browse free" |
| MovingBorder | Secondary actions — Surprise Me, newsletter Subscribe |
| CardSpotlight | Every idea card, the Surprise Me panel, the cost/earn plates on a blueprint |
| BentoGrid / BentoGridItem | The hero's two content panels |
| InfiniteMovingCards | The four category rows under "Browse by category" |
| FocusCards | The category grid on /browse |
| StickyScroll | The four research blocks on a blueprint page |
| ContainerTextFlip | The live category name in the Surprise Me eyebrow |
| FlipWords, TextGenerateEffect, Tabs, AnimatedTooltip | Built and available; see "Not placed" |

### What was removed

- **LiquidEther** and the `three` dependency (~600 kB out of the bundle).
- Six bespoke effect components: CardFlip, ShimmerText, SlideTextLink,
  TextCycle, AttractButton, and the ambient twin rings.
- The site-wide `Reveal` scroll wrappers, `WaveText`, and the hero `Typewriter`.
- Five hand-written gradient-pill button styles, replaced by one `.ac-cta` rule.
- The hand-rolled `iv-ticker` keyframes, replaced by InfiniteMovingCards.

### Typography

`--font-display` is Geist, which ships real weights, so hierarchy comes from
weight again and the sizes came down: h1 from `clamp(3.4rem, 5.6vw, 5rem)` to
`clamp(2.25rem, 5.4vw, 3.5rem)`, h2 to `clamp(1.6rem, 3.2vw, 2.25rem)`. The
heading rules are now `:where()` selectors, so a size utility at a call site
wins instead of being silently overridden.

### Not placed, and why

- **AnimatedTooltip** — the team section says in as many words that there is no
  fake team page. A row of portrait stamps would contradict its own copy.
- **Globe3D** — no geographic data in the schema.
- **AnimatedTestimonials** — would require inventing quotes.
- **LinkPreview** — needs an external screenshot service (api.microlink.io).
- **Compare**, **HeroParallax** — both need a supply of imagery; see below.

### Imagery

Every photograph is an ethicalfounder.com URL, listed in `src/config/imagery.ts`.
That file currently holds the three URLs already known to resolve. The container's
network policy blocks the domain, so the library could not be enumerated from
here — paste more media URLs into `EF_LIBRARY` and every image slot on the site
picks them up.

### Copy

`node scripts/copy-manifest.mjs` reads JSX text, copy-bearing JSX attributes,
and (new in this pass) copy-bearing keys of object literals — which is how
content declared as data reaches the page. Diffed against `02cbbf2`, this pass
removes nothing; the 29 strings absent from the baseline all belong to the
long homepage sections the founder asked to cut.

---

## v2 — Field Guide (2026-09-09T04:01:57Z)

Paper and ink, plates and rules. Brand indigo `#4643BA` re-roled from glow to
ink. Superseded above.
