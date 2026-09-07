# Motion consolidation + responsive repair — plan for approval

No code written yet. Two corrections to your brief first, because they change the work.

## Corrections to the brief

1. **`MOTION_SPEC.md` and `src/motion.css` do not exist in this repo.** There is no motion contract file to honour. If you have one in the Vercel branch, paste it and I will conform to it; otherwise I will write `MOTION_SPEC.md` as part of this work.
2. **`src/motion/` is 100% dead code — not "some hooks".** I grepped every file outside `src/motion/` for each of the 10 modules: zero imports. Not just `useWipe` and `useElementPointer` — `useStaggerReveal`, `useTextReveal`, `useScrollProgress`, `useMagnet`, `useTilt`, `useOdometer` and `PointerChannelProvider` are all unreferenced too. There is no `src/motion/index.ts`, so there is no public API currently being consumed.
3. **GitHub sync cannot be started from chat.** You connect it in the editor: the plus menu in the chat input → GitHub → Connect project. Vercel keeps deploying from the repo unchanged. Nothing in this plan touches deploy config or adds a dependency.

## 1. Map of the two motion systems

**System A — the live one (GSAP, lazy).**
- `src/lib/motion.ts` — `loadGsap(withScrollTrigger)`, `prefersReducedMotion()`. Dynamic import, own chunk.
- `src/components/reveal.tsx` — `<Reveal variant="rv-lift|rv-slide|rv-zoom|rv-wipe">`. Sets a hidden inline start state, then a ScrollTrigger `once:true` tween.
- `src/components/count-up.tsx` — `<CountUp>`, same loader, writes `textContent` directly.
- Used heavily in `src/routes/index.tsx`.

**System B — the cinematic one (CSS + IntersectionObserver).**
- `src/components/cine-scroll.tsx` — one IntersectionObserver, adds `.cine-in` to `[data-cine]`, plus a MutationObserver rescanning the whole body subtree.
- `src/components/cinematic-text.tsx` — `CineWords`, per-word CSS animation-delay.
- The `CINEMATIC LAYER` block in `styles.css` (~line 1984+) — `--cine-ease` tokens, `cine-float`, `cine-magnet`, grammars `depth/sweep/assemble/drift/focus`.
- 12 `data-cine` attributes in the codebase.

**System C — orphaned.** All of `src/motion/` plus its own second `loadGsap` (`src/motion/gsap.ts`, which also pulls SplitText).

So: two live systems with different engines, different reduced-motion checks, and two GSAP entry points; one dead library.

### Consolidation plan

Keep **GSAP + ScrollTrigger as the single engine** (already lazy, already in the bundle). Retire the IntersectionObserver path.

- Create `src/motion/index.ts` as the one public API. Because nothing imports `src/motion/*` today, "keeping the API stable" costs nothing — I define it now and it stays fixed.
- Promote the good orphans into the live system: `useStaggerReveal`, `useTextReveal`, `useScrollProgress`, `useMagnet`, `useOdometer`. Point them at the single `loadGsap` in `src/lib/motion.ts` and delete `src/motion/gsap.ts`'s duplicate.
- **Delete:** `use-wipe.ts`, `use-element-pointer.ts`, `use-tilt.ts` (tilt is on your forbidden list), `pointer-channel.tsx` (cursor-driven — you removed the cursor).
- Re-express `Reveal` and `CountUp` as thin wrappers over the new hooks, so existing call sites in `index.tsx` keep working unchanged. No rendered-output change.
- Migrate the 12 `data-cine` elements to the equivalent hook/variant, then delete `cine-scroll.tsx` and the CSS cinematic layer's observer-dependent rules. `CineWords` folds into `useTextReveal`.
- **Invisible-content guard:** hidden start states get applied in an effect only, never in SSR CSS, and every tween carries a completion fallback. If JS never runs, content renders at full opacity. This is already how `Reveal` behaves; I'll make it the rule.
- Reduced motion: one check, in `src/lib/motion.ts`, consulted before the dynamic import so RM users never download GSAP.

**Blast radius:** HIGH. `styles.css` and `index.tsx` both change. I will do it as its own round, touching no colour or type tokens, and re-verify `/browse`, `/idea/$slug`, `/category/*`, `/pricing`, `/blog` after.

## 2. Homepage scroll narrative

One pass over the 19 sections assigning intent rather than a blanket fade: hero headline is the single `useTextReveal`; the Golden Tree gets the single magnet; downstream sections alternate stagger direction and easing so the page reads as a sequence. Transform and opacity only, no `!important`. Signature pieces (orbit diagrams, canopy map, particle field, demand bars) keep their behaviour and get cheaper: shared rAF, `will-change` cleared on completion, canvas DPR capped, observers disconnected off-screen.

## 3. Responsive audit — measured, not guessed

Real `getBoundingClientRect()` on every `p/li/h1-h4` with 40+ characters, across 8 routes at 375 / 820 / 1024 / 1440. Everything under 220px:

| Where | Width | Widths affected | Cause |
|---|---|---|---|
| `HowItWorksSection` (`index.tsx:1249`) | **142px** | 820 | `sm:grid-cols-3` — exactly the bug you named |
| `TrustStatsBar` (`index.tsx:1143`) | **202px** | 820 | `sm:grid-cols-3` |
| `FourPillarStandardSection` (`index.tsx:965`, `978`) | **174px** | 820, 1024, **1440** | 4-up pillar grid never widens; broken at every desktop size |
| Footer brand blurb (`site-shell.tsx:693`) | **173px** | 1024, 1440 — **all 8 routes** | `max-w-xs` cap in a wide column |
| Golden Tree mobile read-out (`index.tsx:897`) | **114px** | 375 | `grid-cols-2` |
| Comparison list (`index.tsx:~1490`) | **143px** | 375 | `sm:grid-cols-2` list items |
| Hero frame caption (`index.tsx`) | **219px** | 375 | `right-16` inset |
| `.sr-only` blurb | 1px | all | correct, ignore |

Same `sm:grid-cols-3` mistake also present but not yet text-critical: `index.tsx:547` (image trio), `index.tsx:1241`, `blog.$slug.tsx:129`. Nested keyword grid `index.tsx:1616` (`lg:grid-cols-1 xl:grid-cols-2`) is the tightest structure on the site and needs review.

Fix approach: replace fixed `sm:grid-cols-N` with `repeat(auto-fit, minmax(<floor>, 1fr))` so a column can never fall below a readable floor, and lift the `md:`/`lg:` breakpoint where 3-up genuinely starts working.

## 4. Split `index.tsx`

1,698 lines, 19 components. One component per file under `src/components/home/`, byte-identical JSX, `index.tsx` becomes composition only. Purely mechanical, done as its own commit so a diff review is trivial.

## Order of work, one area at a time

1. Responsive grid fixes (low risk, immediate win) — verify all 8 routes at 4 widths.
2. Split `index.tsx` (mechanical, no output change).
3. Motion consolidation + dead-code removal.
4. Homepage scroll narrative + signature-piece optimisation.
5. Write `MOTION_SPEC.md`.

`npx tsc --noEmit` and `npx vite build` output shown after every step, before I call anything done.

## Question before I start

Step 1 and step 3 both touch `index.tsx`. Your BUTTERFLY_EFFECT rule says isolate. Confirm you want them as separate sequential rounds (slower, safer) rather than combined.
