# Lovable prompt — BBI motion system

Paste everything below the line into Lovable as one message.

---

## Who you are working on

This is **BBI (businessidea.io)** — a researched business-idea library for an
India-first audience. You built the very first layout of this project. Since
then the project moved out of Lovable and has been developed elsewhere. The
codebase you are holding is **months out of date**. Read this whole brief
before you generate anything.

**I do not want you to rebuild the site.** I want you to build **one thing**:
a self-contained **motion and interaction system** that I will port into the
current codebase by hand. Treat this as building a design system deliverable,
not a website.

---

## Current stack (this is what your output must be compatible with)

- **TanStack Start** (SSR React) — not Next.js, not Vite SPA
- **React 19**, TypeScript
- **Tailwind v4, CSS-first** — there is **no `tailwind.config.js` / `.ts` file
  and there must never be one**. All tokens live in `src/styles.css` inside
  `@theme inline` and `:root` / `html.light` blocks.
- **Supabase** (Postgres) for data
- **Vercel** for hosting
- `lucide-react` is the only icon set
- GSAP + ScrollTrigger + SplitText are available
- Framer Motion / `motion` is available

---

## The exact colour tokens — do not invent a single new colour

The site renders in light mode only (`<html class="light">` is set statically).
These are the only values that exist. Use `var(--token)` everywhere, never a
raw hex, and never a colour outside this list.

```
--background:        #FCFBFE
--background-2:      #EEECF8
--foreground:        #0C0C25
--foreground-hover:  #FCFBFE
--card:              rgba(255, 255, 255, 0.72)
--card-foreground:   #0C0C25
--popover:           #FFFFFF
--primary:           #4643BA
--primary-foreground:#FFFFFF
--secondary:         #EEECF8
--muted:             rgba(43, 40, 113, 0.06)
--muted-foreground:  #3A3697
--accent:            #4643BA
--accent-foreground: #FFFFFF
--border:            rgba(43, 40, 113, 0.18)
--input:             rgba(43, 40, 113, 0.14)
--ring:              #4643BA
--ember:             #8886DB
--warm:              #3A3697
--glass-border:      rgba(43, 40, 113, 0.22)
--violet:            #4643BA
--violet-soft:       #8886DB
--radius:            1.25rem
```

Fonts:
```
--font-display: "Sora", ui-sans-serif, system-ui, sans-serif;
--font-sans:    "Manrope", ui-sans-serif, system-ui, sans-serif;
```

**Hard rule: zero emojis anywhere.** Not in UI, not in labels, not in comments,
not in sample copy.

---

## Where the project actually is right now — the honest state

There are 20 route files.

- `index.tsx` (homepage) — 1,698 lines, ~24 sections, has some motion
- `idea.$slug.tsx` — 755 lines, has a little motion
- **The other 18 routes have literally zero animation.** A grep for
  `gsap`, `ScrollTrigger`, `<Reveal`, or any scroll hook returns 0 on all of them.
- **12 of the 20 routes have zero `hover:` rules of any kind.**
- **10 pages render the exact same `ContentPage` component** with different
  text only: about, contact, disclaimer, gdpr, pricing, privacy,
  refund-policy, services, sign-in, terms.
- **There are no page transitions.** Every route change is a hard cut.
- **There is no pointer channel** — nothing anywhere tracks cursor position,
  cursor velocity, or scroll velocity, so nothing can respond to the mouse.

That last point is the root problem. Start there.

---

## What I want you to produce

### Deliverable 1 — a motion primitive library (the most important thing)

A single folder of framework-agnostic React hooks + a single CSS file. These
must work on **any** element, retrofitted onto layouts that already exist. They
must NOT require me to restructure my markup.

Build these primitives:

**Pointer channel (build this first — everything else depends on it)**
- A provider that publishes, on a requestAnimationFrame loop, as CSS custom
  properties on `:root`: normalized cursor X/Y (`--ptr-x`, `--ptr-y` in 0–1),
  cursor velocity (`--ptr-v`), and scroll velocity (`--scroll-v`).
- It must write to the DOM directly, never through React state, so it causes
  zero re-renders.
- It must respect `prefers-reduced-motion` and disable itself on touch devices.

**Per-element pointer proximity**
- A hook that attaches to any element and publishes, on that element only:
  `--el-ptr-x`, `--el-ptr-y` (cursor position relative to that element,
  -1 to 1) and `--el-ptr-d` (0 at the centre, 1 at the far edge).
- Purpose: any card, any nav row, any table row, any footer link can then
  respond to the cursor purely in CSS, with no per-component JS.

**Scroll-progress primitive**
- Publishes `--sc-p` (0 to 1) on a section as it travels through the viewport.
- Two modes: pinned (section holds the viewport, scroll is the playhead) and
  unpinned (progress as the section passes through).
- Must be driven by ScrollTrigger with `scrub`, not by a one-shot entry trigger.

**Stagger reveal**
- Reveals children of a container in sequence as it enters. Must accept a
  child selector so it works on markup that already exists.

**Text reveal**
- Line-by-line masked reveal using GSAP SplitText with `mask: "lines"`,
  `autoSplit: true`, `aria: "auto"`. Must re-split correctly on resize.

**Odometer / counter**
- Counts a real number up when it enters view. Must handle decimals (I need to
  show values like `1.70353809`), must accept a formatter, and must never
  animate from a fabricated starting number.

**Magnet, tilt, and wipe**
- Small pointer-driven displacement, small 3D tilt, and a directional reveal
  wipe. All bounded — subtle, not novelty.

**Page transition**
- A route-change enter/exit treatment that works with TanStack Router's
  navigation lifecycle. It must not block content paint or hurt LCP.

### Deliverable 2 — a "taste floor" CSS layer

One CSS file that, when included, gives **every** interactive element on the
site a baseline response, without me editing 20 route files by hand:

- Every `<a>`, `<button>`, card, nav row, dropdown row, table row and footer
  link gets a hover and focus-visible response driven by the pointer variables
  above.
- Focus-visible states must be real and accessible, using `--ring`.
- Every transition uses one shared easing curve and one shared duration scale —
  define both as tokens.
- Everything inside a `@media (prefers-reduced-motion: reduce)` guard that
  disables it.

**Critical constraint:** write it with **low specificity** and **no
`!important`**. Our existing `styles.css` already has a global rule using
`!important` that has broken components before. Do not add another one.

### Deliverable 3 — a motion specification document

A markdown file that, for each of the page types below, specifies:
- which primitives to apply
- to which elements
- at what timing, distance, and easing
- what the hover response is
- what the scroll response is

Page types to specify:
1. Homepage (~24 existing sections — motion applied to what is already there,
   NOT new sections)
2. Idea detail page
3. Category / subcategory / browse / search listing pages
4. Pricing page
5. Blog index and blog post
6. Static/legal pages (the 10 that share one component — I need them to stop
   looking identical)
7. Header, its 4 dropdowns, and the mobile menu
8. Footer

For each, also tell me what should move because it is **real data** — counts,
dates, category depth — versus what is decoration.

### Deliverable 4 — a single demo page

One page that demonstrates every primitive against **placeholder layouts that
match the shapes we actually have** (a card grid, a long-form legal page, a
pricing table, a nav bar with dropdowns, a wide footer). This is my reference
for what the motion should feel like. It does not need real data.

---

## Rules — read these twice

1. **Do not create `tailwind.config.js` or `tailwind.config.ts`.** Tailwind v4,
   CSS-first, tokens in CSS only.
2. **Do not invent colours.** Only the tokens listed above.
3. **Do not use `!important` anywhere.**
4. **Do not add emojis anywhere.**
5. **Do not fabricate any number, statistic, testimonial, review count, user
   count, or activity feed.** If a demo needs a number, label it clearly as a
   placeholder. This is non-negotiable — fabricated stats have already had to
   be removed from this site three times.
6. **Do not restructure my markup.** Every primitive must retrofit onto
   existing DOM.
7. **Do not build new page sections.** I have enough sections. I need the ones
   I have to move.
8. **Do not touch or reference Supabase, auth, routing, or data fetching.**
   Motion and interaction only.
9. **Performance:** all motion must run on `transform` and `opacity` only.
   No animating `width`, `height`, `top`, `left`, or `box-shadow`. Everything
   must hold 60fps on a low-end Android phone — that is a real reported
   problem on this site, not a hypothetical.
10. **Mobile:** every primitive must degrade correctly on touch, where there is
    no cursor. Scroll-driven motion stays; pointer-driven motion turns off.
11. **Scale:** this site is heading to 10,000+ pages. Nothing may require a
    hand-made asset or hand-written config per page. Everything must be
    systemic, driven by CSS variables and data.

---

## Output format

Give me, as files:
1. `motion/` — the hooks, one file per primitive, TypeScript, fully typed
2. `motion.css` — the taste-floor layer
3. `MOTION_SPEC.md` — the specification document
4. `demo.tsx` — the single demo page

Do not modify any other file in the project. Do not deploy. I am porting this
by hand into a different codebase.
