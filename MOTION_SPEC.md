# Motion spec

The single reference every page follows. Written so that four people working
in parallel on different pages produce one system rather than four dialects.

Import everything from `@/motion`. The CSS classes come from `src/motion.css`,
which is already imported globally in `__root.tsx` — no page imports it.

---

## 1. What exists

### Hooks — `@/motion`

| Hook | Returns | What it publishes | Use for |
|---|---|---|---|
| `useElementPointer(opts?)` | ref | `--el-ptr-x/y` (-1..1), `--el-ptr-d` (0 centre → 1 corner), `--el-ptr-in` (0/1) | one card, one panel, one hero |
| `useElementPointerGroup(sel)` | ref on the **container** | same vars, on whichever child is hovered | grids — one listener for 200 cards |
| `useScrollProgress(opts?)` | ref | `--sc-p` (0..1) on that element | parallax, pinned stages, scrubbed reveals |
| `usePageScrollProgress()` | — | `--page-p` (0..1) on `:root` | a top progress rail |
| `useStaggerReveal(opts?)` | ref on the **container** | reveals children in sequence | any list, grid, or run of sections |
| `useTextReveal(opts?)` | ref | masked line-by-line reveal | one headline per page, no more |
| `useOdometer(value, opts?)` / `<Odometer value={n} />` | ref / element | counts a real number up | live counts only |
| `useMagnet(opts?)` | ref | small pointer-follow displacement | one primary CTA per page |
| `useTilt(opts?)` | ref | bounded 3D tilt | a hero image, a feature panel |
| `useWipe(opts?)` | ref | directional clip-path reveal | a media block |

Every hook no-ops under `prefers-reduced-motion`. Pointer hooks additionally
no-op on touch. None of them require a wrapper element or a particular DOM
shape — they attach to markup that already exists.

### Classes — `src/motion.css`

| Class | Effect |
|---|---|
| `.mo-card` | lift + border warm on hover, plus a cursor-following sheen when paired with a pointer hook |
| `.mo-row` | colour + background + 4px slide on hover — list rows, nav rows, table rows, footer links |
| `.mo-link` | underline grows from the left; also on focus |
| `.mo-lift` | plain hover lift for anything that is neither card nor row |
| `.mo-media` | image slot: container fixed, image scales inside it (brief §12.8) |
| `.mo-drift` | slow parallax from `--sc-p` |
| `.mo-page-rail` | `scaleX(--page-p)` progress bar |

### Tokens

`--mo-dur-1` 140ms · `--mo-dur-2` 240ms · `--mo-dur-3` 420ms · `--mo-dur-4` 700ms
`--mo-ease` · `--mo-ease-out` · `--mo-ease-in-out`
`--mo-lift-1/2/3` = 1px / 2px / 4px

Use these. Do not write a raw `ms` value or a raw `cubic-bezier` in a page.

---

## 2. Rules that bind every page

1. **Retrofit, do not rebuild.** Add a class or a ref to markup that exists.
   Restructuring a page to fit an animation is backwards.
2. **No new sections.** The site has enough. Make the existing ones move.
3. **One headline reveal per page.** `useTextReveal` on the H1 only. Two on a
   page reads as a slideshow.
4. **One magnet per page**, on the single most important CTA.
5. **Colours come only from existing tokens.** No hex, anywhere, ever.
6. **Zero emojis.**
7. **No fabricated numbers.** If a counter has no real value behind it, no
   counter.
8. **Transform and opacity only.** Never animate width, height, top, left, or
   box-shadow blur.
9. **No `!important`.** The one global `!important` rule this codebase had
   caused four separate live bugs; it was removed. Do not add another.
10. **Never write to shared files.** `src/styles.css`, `src/components/
    site-shell.tsx`, `src/lib/*` and `src/motion/*` have one owner each and it
    is not the page you are working on. Read them freely.

---

## 3. Per page type

### Homepage — `index.tsx`

Already has motion. Do not add more sections. What it needs:
- `useStaggerReveal` on each section's card row, replacing anything that
  currently appears all at once
- `.mo-card` on the four-pillar tiles, the comparison table rows, the team
  panel
- `.mo-media` on every image slot including the hero
- one `<Odometer />` on the real blueprint count, none anywhere else
- `.mo-drift` on the ambient layers only, never on text

### Idea detail — `idea.$slug.tsx`

The flagship. Scroll is the spine here.
- `useTextReveal` on the idea title
- `useScrollProgress` on the verdict panel, already present — keep
- `.mo-card` + `useElementPointerGroup` on the related-ideas and trending rails
- `.mo-row` on the related-categories list
- `useMagnet` on the Validate button, and only that button
- `.mo-media` on the hero image slot
- the demand/trend indicator (brief §6.1 item 3) animates from a real value
  via `useScrollProgress`, not a timer

### Listing pages — `browse`, `category.*`, `search`

Gallery grammar. These are comparison surfaces; motion must not fight scanning.
- `useElementPointerGroup` on the grid container, `.mo-card` on each cell —
  one listener, not one per card
- `useStaggerReveal` on the grid, short stagger (`stagger: 0.03`), so a
  50-card page does not take four seconds to appear
- category headings get `useTextReveal`, subcategory pills do not
- **no tilt, no magnet on listing pages** — the cursor is scanning, not aiming
- `.mo-row` on the filter/facet rows

### Pricing — `pricing.tsx`

Split stage. Two plans, a real difference between them.
- `useStaggerReveal` on the plan columns, direction `up`
- `.mo-card` on each plan
- `useMagnet` on the primary plan's CTA only
- the feature-comparison rows get `.mo-row`
- checkout is disabled — that stays until it is real. Do not animate a
  button that does nothing into looking like it does something.

### Blog — `blog.index.tsx`, `blog.$slug.tsx`

Editorial.
- `useStaggerReveal` on the post grid
- `.mo-media` on every thumbnail and the detail hero
- `.mo-card` on post cards, `.mo-link` on inline links in post bodies
- no reading-progress rail here. The shell owns one rail on every page (see
  "Header" below); a second one on the post page renders two bars ten pixels
  apart. One rail, site-wide, in the shell.

### Static and legal — the 10 sharing `ContentPage`

The real problem here is not motion, it is that ten pages are one component
with different text. Motion alone will not fix that; differentiation does.
- `ContentPage` gains an optional `tone` so pages stop rendering identically:
  vary the eyebrow treatment, the section rhythm, and whether sections are
  numbered — within the same tokens
- `useTextReveal` on the page H1
- `useStaggerReveal` on the sections
- `.mo-link` on every inline link — there are many, and today none of them
  respond to anything
- `.mo-row` on `Bullets` items
- no cards, no tilt, no magnet. These are documents.

### Header, dropdowns, mobile menu — `site-shell.tsx`

Single owner. Not touched by page work.
- `.mo-row` on every dropdown row and mobile-menu row
- `.mo-link` on the top-level nav items
- dropdown open/close: opacity + 4px translate, `--mo-dur-2`, nothing longer
- `usePageScrollProgress` + `.mo-page-rail` under the header

### Footer — `site-shell.tsx`

Single owner. Needs the full rebuild (brief §12.4) before motion is worth
applying. Until then: `.mo-row` on every link, and nothing else.

---

## 4. What should move because it is real

Motion on a real number reads as a live system. Motion on a decorative number
reads as a screensaver, and this site has already had to remove fabricated
figures three times.

| Value | Source | Treatment |
|---|---|---|
| total blueprints | `getCatalog().totalIdeas` | `<Odometer />`, homepage hero only |
| per-category depth | `CategoryNode.ideaCount` | plain text, `.mo-row` hover |
| category count | `categories.length` | plain text |
| trend score | `ideas.trend_score` | gauge driven by `useScrollProgress` |
| last updated | a real column, once one exists | plain text |

Everything not in this table is decoration and gets no counter.
