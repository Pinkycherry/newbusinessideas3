# IdeaVault AI — Edit Guide

Everything you can safely change, where it lives, and exactly what to edit.
No file outside these paths needs to be touched for the tasks below.

---

## 1. Colors and branding

### Where colors live
**File: `src/styles.css`** — all colors are CSS variables inside the `:root` block
(values are `oklch(...)`). Change a value there and it updates everywhere in the app.

| Variable | Current value | What it controls on screen |
|---|---|---|
| `--background` | `oklch(0.19 0.008 264)` | Page background (deep charcoal) |
| `--foreground` | `oklch(1 0 0)` | Primary body/heading text (white) |
| `--primary` | `oklch(0.687 0.161 51.5)` | Main brand orange: buttons, CTAs, active links, "Vault" pill |
| `--primary-foreground` | near-white | Text sitting on orange buttons |
| `--ember` | `oklch(0.723 0.161 56)` | Second orange in every gradient (buttons, logo pill, ambient orbs) |
| `--accent` | soft amber | Eyebrow labels, trend scores, section kickers |
| `--warm` | `oklch(0.735 0.02 71)` | Warm neutral used at the end of headline gradients |
| `--muted-foreground` | warm grey | Secondary/body copy, card excerpts, footer links |
| `--card` | translucent white | Card and panel fill |
| `--border` | `oklch(1 0 0 / 20%)` | 1px glass borders and dividers |
| `--destructive` | red | "What will hurt" / cons column markers |

### Change the entire brand color scheme in one place
Edit `--primary`, `--ember` and `--accent` in `:root` of `src/styles.css`.
Every button, gradient, badge, orb and hover glow derives from those three.

### Background sphere / ambient opacity
* Variable: `--ambient-opacity` in `:root` of **`src/styles.css`**. Current value: `1`.
* To calm the background, set it lower, e.g. `--ambient-opacity: 0.35;`. `0` hides it entirely.
* The spheres themselves (count, size, position) are in **`src/components/ambient-scene.tsx`**.

### Site title and default meta description
**File: `src/routes/__root.tsx`** — the `head()` block at the top defines the
default `title` and `description` for the whole site.
Per-page titles live in each route file's own `head()` (e.g. `src/routes/about.tsx`).

### Brand name in header and footer
**File: `src/components/site-shell.tsx`**
* Header logo: inside `SiteShell`, the `<Link to="/">` block — the words `Idea` and `Vault`.
* Footer logo: the same two words in the footer `<Link to="/">` block.
* Footer copyright line: `© {new Date().getFullYear()} IdeaVault AI. All rights reserved.`

### Favicon
Replace **`public/favicon.ico`** (keep the filename). The `<link rel="icon">`
reference is in `src/routes/__root.tsx`.

---

## 2. Featured picks (homepage)

* **File: `src/config/featured.ts`**
* Exported array: `FEATURED_IDEA_IDS`
* To change the homepage highlights, replace the `idea_id` strings with real ids
  from the `ideas` table (format `IDEA-00022`). Order in the array = order on screen.
* Ids that don't exist or aren't `status='completed'` are skipped, never faked.
* Nothing else changes — `src/routes/index.tsx` reads this array.

---

## 3. Collections menu (header dropdown)

* **File: `src/config/collections.ts`**
* Exported array: `COLLECTIONS`
* Add a link by appending `{ label: "Your label", url: "/your-path" }`.
* This is Section B of the header dropdown. Section A ("Browse by type") is
  read live from the database and is not editable by hand.

---

## 4. Ad slots

* **Component: `src/components/AdSlot.tsx`**
* Props: `position` (label), `size` (`"banner" | "rectangle" | "square" | "sticky"`),
  `adCode` (raw HTML ad tag), optional `className`.
* **While `adCode` is empty the slot renders nothing and takes zero space.**

### How to activate a slot
Search the codebase for the `position` value, then add your ad HTML:

```tsx
<AdSlot position="homepage-hero-below" size="banner" adCode={'<ins class="adsbygoogle" ...></ins>'} />
```

### Every slot, its size and its file

| Position | Size | File |
|---|---|---|
| `homepage-hero-below` | banner | `src/routes/index.tsx` |
| `homepage-featured-below` | banner | `src/routes/index.tsx` |
| `homepage-above-footer` | banner | `src/routes/index.tsx` |
| `category-above-grid` | banner | `src/routes/category.$categorySlug.tsx` |
| `category-in-grid-1`, `-2`, … (after every 6th card) | banner | `src/routes/category.$categorySlug.tsx` |
| `idea-detail-between-proscons-verdict` | banner | `src/routes/idea.$slug.tsx` |
| `idea-detail-below-verdict` | banner | `src/routes/idea.$slug.tsx` |
| `idea-detail-right-affiliate` | rectangle | `src/routes/idea.$slug.tsx` (sticky right column) |
| `idea-detail-above-related` | banner | `src/routes/idea.$slug.tsx` |
| `blog-post-after-first-paragraph` | banner | `src/routes/blog.$slug.tsx` |
| `blog-post-mid-article` | rectangle | `src/routes/blog.$slug.tsx` |
| `blog-post-after-last-paragraph` | banner | `src/routes/blog.$slug.tsx` |
| `search-in-results-1`, `-2`, … (after every 5th result) | banner | `src/routes/search.tsx` |

The repeating grid slots are generated in a loop — to give them individual ad code,
pass `adCode` conditionally on the index inside that loop.

---

## 5. Pages and file paths

| Page | URL | File |
|---|---|---|
| Homepage | `/` | `src/routes/index.tsx` |
| Browse | `/browse` | `src/routes/browse.tsx` |
| Category | `/category/[slug]` | `src/routes/category.$categorySlug.tsx` |
| Subcategory | `/category/[slug]/[sub]` | `src/routes/category.$categorySlug.$subcategorySlug.tsx` |
| Idea detail | `/idea/[slug]` | `src/routes/idea.$slug.tsx` |
| Search | `/search` | `src/routes/search.tsx` |
| Blog index | `/blog` | `src/routes/blog.index.tsx` |
| Blog post | `/blog/[slug]` | `src/routes/blog.$slug.tsx` |
| Pricing | `/pricing` | `src/routes/pricing.tsx` |
| Services | `/services` | `src/routes/services.tsx` |
| About | `/about` | `src/routes/about.tsx` |
| Contact | `/contact` | `src/routes/contact.tsx` |
| Terms | `/terms` | `src/routes/terms.tsx` |
| Privacy | `/privacy` | `src/routes/privacy.tsx` |
| Disclaimer | `/disclaimer` | `src/routes/disclaimer.tsx` |
| GDPR | `/gdpr` | `src/routes/gdpr.tsx` |
| Refund policy | `/refund-policy` | `src/routes/refund-policy.tsx` |

Shared pieces:
* **Header + footer:** `src/components/site-shell.tsx` (both live in this one file)
* **Ambient background:** `src/components/ambient-scene.tsx`
* **Idea card:** `src/components/idea-card.tsx`
* **AI Audit block:** `src/components/ai-audit.tsx`
* **Legal/marketing page shell:** `src/components/page-layout.tsx`
* **Database connection (Supabase):** `src/lib/ideas.functions.ts` — the `db()` helper at
  the top creates the server-side client; all idea queries live in the same file
* **Blog (WordPress) fetching:** `src/lib/blog.server.ts` + `src/lib/blog.functions.ts`

---

## 6. Adding things without breaking anything

### Add a new section to any page
Open the page file and find:

```
{/* EDITABLE SECTION START — safe to add, remove, or reorder sections below ... */}
...
{/* EDITABLE SECTION END */}
```

Everything between those two comments is the template zone: add, remove or reorder
freely. Do not edit above the START comment (that's routing, data fetching and SEO).
These markers exist on: homepage, category page, idea detail, blog index, blog post,
search, pricing, services, about, contact, terms, privacy, disclaimer, GDPR, refund policy.

### Add a new footer link
**File: `src/components/site-shell.tsx`**, array `footerColumns`.
Find the column (`Platform`, `Company`, `Legal`) and add
`{ to: "/your-path", label: "Your label" }`. One link per destination — no duplicates.

### Add a new page and wire it into header/footer
1. Create `src/routes/your-page.tsx` with `createFileRoute("/your-page")`
   (copy `src/routes/about.tsx` as a template — it already includes `head()` SEO).
2. Add `EDITABLE SECTION START/END` comments around the content.
3. Footer link: add to `footerColumns` in `src/components/site-shell.tsx`.
4. Header link: add to the `navLinks` array at the top of the same file,
   or add it as a collection in `src/config/collections.ts`.
   The route tree regenerates automatically — never edit `src/routeTree.gen.ts`.

### Change the WordPress source URL
**File: `src/lib/site-config.ts`**, constant `DEFAULT_WORDPRESS_SITE_URL`
(currently `https://nutrizoe.in`). One line. Alternatively set the
`WORDPRESS_SITE_URL` environment variable, which overrides the file with no rebuild.

### Add a new column/block to the idea detail page
**File: `src/routes/idea.$slug.tsx`**.
The page is a two-column grid: `lg:grid-cols-[minmax(0,1fr)_20rem]`.
* Left column content: inside `<article>`, within the EDITABLE SECTION markers.
* Right sticky column: the `<aside className="hidden lg:block">` block — add a new
  `<div className="glass rounded-2xl px-5 py-5">…</div>` inside `.sticky` to add a card.
* For a third column, change the grid template to
  `lg:grid-cols-[16rem_minmax(0,1fr)_20rem]` and add the new `<aside>` before `<article>`.

Right column currently contains, top to bottom: trend score, tier badge (Free/Pro),
"Run AI Audit" CTA, affiliate AdSlot, and the 3 most related ideas.

---

## 7. AI Audit

* Component: `src/components/ai-audit.tsx`; server logic `src/lib/audit.server.ts`.
* Powered by the Lovable AI Gateway (`google/gemini-3.6-flash`) using the
  `LOVABLE_API_KEY` secret — no key is stored in code.
