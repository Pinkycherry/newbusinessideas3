# BBI — WordPress theme

A WordPress port of the businessidea.io site (TanStack Start + Supabase). Ideas,
categories and the FAQ pool become Custom Post Types and taxonomies, so the
library is editable in wp-admin instead of only through the Sheet-and-pipeline
route.

**Status: complete for the core site.** The theme installs, reads Supabase
live, imports the library, and renders the homepage, idea pages, category
archives, search, static pages and a 404. Colours, fonts, sizes, header,
footer, sidebars and card grids are all editable in the Customizer, and the
block editor gets a matching palette.

---

## Install

1. Copy `wp-theme/bbi` to `wp-content/themes/bbi` on the WordPress install.
2. **Appearance → Themes → Activate.**
3. **Settings → Permalinks → Save.** Nothing else on this page needs changing;
   saving is what flushes the rewrite rules so `/idea/<slug>` and `/browse`
   resolve. Skipping it is the single most common reason a freshly activated
   CPT theme 404s on every idea.
4. **Appearance → Menus** — create menus and assign them to *Primary
   navigation* and *Footer navigation*. Both use `fallback_cb => false`, so an
   unassigned location renders nothing rather than dumping every page into the
   header.

Requires WordPress 6.4+ and PHP 8.0+.

## Seeing your real data straight away

**BBI → Data** in the admin menu. Paste the Supabase project URL and the **anon** key,
tick *Enabled*, and press *Test connection*. The site then renders the live
library at the real URLs — `/idea/<slug>/`, `/category/<slug>/` — before
anything has been imported.

Three data sources:

| Source | Behaviour |
|---|---|
| **WordPress, falling back to Supabase** (default) | Reads WordPress posts when there are any, Supabase when there are none. A fresh install shows real data, and switches itself over the moment the import runs. |
| **Supabase, live** | Always Supabase. Anything edited in wp-admin is not read and will not appear. |
| **WordPress only** | No outbound requests at all. Use this once editing has moved into wp-admin. |

Responses are cached in a transient; the lifetime is a setting. `0` really does
fetch on every page view — that is genuinely live, and it is also the fastest
way to spend a free-tier request allowance. 300 seconds is close enough to live
for a library that changes a few times a day.

### Use the anon key, not the service role key

A service role key **bypasses row-level security and grants write access to
every table in the project**. Stored in `wp_options` it sits in the database, in
every backup, in any migration export, and is readable by any plugin on the
site. The anon key grants exactly what the public website already grants, which
is all this needs.

A service role key pasted into the settings screen is **detected and refused** —
the connection stays inactive and a warning appears on every admin screen until
it is replaced. If you pasted one, revoke it in the Supabase dashboard; it is
compromised the moment it lands in a database.

## n8n

**BBI → Automation.** Store the instance URL and an n8n API key (Settings → n8n
API inside n8n) and WordPress can list the workflows, show which are active,
read recent executions, and activate or deactivate one.

**An API key, never your account password.** A key can be revoked on its own,
regenerated if this site is ever compromised, and does not unlock the login.
There is deliberately no password field.

Activating and deactivating is all it can do — it cannot edit or delete a
workflow. Editing workflow JSON through a second system is how two sources of
truth start, and `n8n-idea-pipeline-v2.json` in the repo is already the source
of truth for the pipeline's shape.

## The assistant

**BBI → Assistant.** Claude, running inside wp-admin, briefed on this project
and this site's live state, with its conversation stored here so it persists
across logins.

Two things it is important to be straight about, both stated on the screen
itself:

**It is not a continuation of a conversation held elsewhere.** There is no
mechanism that moves a Claude Code session into a WordPress install. This
starts a *new* assistant that begins already knowing the project — the house
rules, the live counts, the data source, the n8n workflow states — and then
keeps its own history here. It will not remember a decision it was not part of.
The **Project notes** field is sent before every message and is how context
from elsewhere gets carried across.

**It bills separately.** The Anthropic API is pay-as-you-go and is **not**
included in a Claude Pro or Max subscription — a subscription covers claude.ai
and Claude Code, not API calls. It needs an API key from console.anthropic.com
with billing set up. This is the only screen in the theme that can spend money,
so it ships switched off, and the effort control (which sets how hard it thinks
per message) is the main cost dial.

Implementation notes worth keeping:

- Raw `wp_remote_post()`, not the official PHP SDK. In an ordinary PHP project
  the SDK would be right; a WordPress theme is not one — shipping a Composer
  vendor tree inside `wp-content/themes` collides with whatever else on the
  site already loaded a different version of the same package, and WordPress
  has no autoloader arbitration to resolve it.
- The system prompt is built **live on every message**, never from a stored
  snapshot. An assistant briefed from a snapshot confidently describes a
  configuration you changed last week and has no way to notice.
- A refusal arrives as HTTP 200 with `stop_reason: "refusal"`, not as an error.
  Reading `content` without checking that shows an empty reply and no
  explanation for it.
- `content` is an array of blocks and the first is often a *thinking* block, so
  the text is assembled from every `type: "text"` block rather than
  `content[0]`.
- The user turn is recorded only after the call succeeds. Appending it first
  would leave a dangling question in the transcript on every failure, and the
  next request would resend it.
- History is capped at 40 turns, trimmed from the front, and the trim can leave
  an assistant message first — which the API rejects — so leading non-user
  turns are dropped before sending.

## SEO

The four researched SEO fields the pipeline writes are wired up in
`inc/seo.php`. The rule it is built around: **never output a tag an SEO plugin
is also outputting.** Two descriptions or two canonicals is worse than none —
search engines pick one, not necessarily yours, and it is invisible in a
browser.

So it detects Rank Math, Yoast, SEOPress and All in One SEO. With one present
it stops emitting tags and instead feeds the researched values through that
plugin's own filters, and copies them into the plugin's meta on save so its
editor sidebar agrees with the page — only ever filling an *empty* field, so a
hand-written override survives a re-import. With no plugin active it emits a
minimal correct set itself: description, canonical, Open Graph, Twitter.

The canonical is deliberately **not** emitted on paginated or search views. A
canonical pointing every page of an archive at page one tells search engines
the later pages do not exist, which is how a paginated library loses most of
itself from the index.

`Article` and `BreadcrumbList` JSON-LD are emitted on idea pages even when a
plugin is present — plugins output WebPage and Organization graphs, so an
Article node for the specific post is additive rather than duplicated.

The ideas list in wp-admin gains **SEO** and **Trend** columns, so which of 290
pages still lack a description is visible at a glance instead of one post at a
time. The trend column prints an em dash for an unscored idea, never `0` —
zero is a real score and showing it for a missing one makes the column lie.

## Import the library from Supabase

Needs WP-CLI on the host.

```bash
wp bbi import --dry-run     # uses the URL and key saved under Settings → BBI Data
wp bbi import
```

Both flags can still be passed explicitly (`--url=…`, `--key=…`), but the saved
settings are the better route: a key typed on a command line lands in the shell
history file.

- `--dry-run` reports exactly what would be created or updated and writes
  nothing.
- `--only=<category_slug>` imports one category first, so the output can be
  eyeballed before committing to the whole catalogue.

The importer is **read-only against Supabase** and **idempotent** — rows are
matched on `bbi_idea_id` (the Supabase primary key), not on title or slug, so
running it twice updates in place instead of creating duplicates. It pages
explicitly at 500 because PostgREST caps a response at 1000 rows and does not
error when it truncates. Only `status = completed` rows are imported, matching
every frontend query on the live site.

When the import finishes it clears the Supabase read cache and the post-count
cache, so a site on the default `fallback` source switches from live reads to
its own posts immediately rather than at the end of the next cache lifetime.

## Layout

```
bbi/
  style.css              theme header only — all rules are in assets/css
  functions.php          supports, menus, asset enqueue
  header.php footer.php
  index.php              fallback + idea archive + taxonomy archives + search
  single-bbi_idea.php    the idea page
  page.php 404.php searchform.php
  inc/post-types.php     bbi_idea, bbi_faq, bbi_category, bbi_subcategory
  inc/meta.php           the 38 Supabase columns, registered and edit-boxed
  inc/import.php         the WP-CLI importer
  inc/template-tags.php  the helpers that were TypeScript on the original
  templates/            custom page templates + the live-Supabase templates
  theme.json            Gutenberg palette, type scale, spacing, shadows
  inc/tokens.php        THE token registry — one source of truth
  inc/customizer.php    every control, generated from that registry
  inc/dynamic-css.php   writes the choices back out as CSS variables
  inc/gutenberg.php     editor styles, block styles, block patterns
  inc/sidebars.php      seven widget areas + the sidebar layout
  inc/supabase.php      live PostgREST reads, cached
  inc/settings.php      BBI → Data (Supabase)
  inc/n8n.php           BBI → Automation (n8n credentials + workflow control)
  inc/assistant.php     BBI → Assistant (Claude, via the Anthropic API)
  inc/seo.php           SEO plugin integration, meta tags, schema, admin columns
  inc/data.php          the ONE accessor templates use, either source
  inc/routing.php       serves live rows at the real URLs before any import
  inc/home-content.php  every word of the homepage, filterable
  front-page.php        the homepage, unless a static front page is set
  assets/css/bbi.css    compiled — do not edit
  assets/js/*.js        motion, hero field, Customizer live preview
  build/theme.css       the Tailwind entry that produces assets/css/bbi.css
  build/custom.css      the rules that make the Customizer variables do something
```

## The blocks

Six, all with sidebar controls, all in the inserter:

| Block | What it does |
|---|---|
| **Animate** | Wrap anything and give it a scroll animation — direction (up/down/left/right/fade/scale/none), travel distance, duration, delay, child stagger, and replay-every-pass on or off. |
| **Idea Grid** | A grid of blueprints from WordPress or live Supabase. Category, order, count, columns, and which parts each card shows. |
| **Idea Part** | One piece of a blueprint behind a dropdown — breadcrumb, category, summary, trend bar, narrative sections, pros and cons, steps, tools, verdict, FAQ. |
| **Business Icon Band** | The eighteen outlined icons, bobbing on staggered offsets. |
| **Marquee** | Your categories or your own list, scrolling. Direction, duration, pause-on-hover, linked or not. |
| **Scroll Dock** | Fixed bottom-right: back to top, and a jump list built at runtime from the page's own sections. |

All six are **dynamic** — PHP owns the markup and nothing is baked into post
content. Changing how a card or an animation renders lands on every existing
page at once, instead of leaving them with stale markup and an "unexpected or
invalid content" warning.

Written in plain JS with `wp.element.createElement`, not JSX. JSX needs a build
step, and a theme that requires `npm run build` before anyone can change a
block is a theme that stops being edited. Each block ships a hand-written
`index.asset.php` declaring its script dependencies — without it WordPress
registers the script with none, `wp.blockEditor` and `wp.serverSideRender` are
undefined at runtime, and the block never appears in the inserter with nothing
in the PHP log to explain why.

## Customising it

**Appearance → Customize → BBI — Design system**

- **Brand colours, Surfaces, Text, Highlights, Borders** — 28 tokens, every one
  live-previewed. The six semi-transparent ones (the card surface especially)
  get a text field rather than a colour picker, because a picker cannot
  represent `rgba()` and would silently flatten the transparency the glass
  panels depend on.
- **Typography** — a curated font picker that also decides what gets downloaded,
  plus a free-text stack for a self-hosted face. Choosing system stacks for both
  means the site requests **no** webfont at all. Type scale and heading
  letter-spacing are sliders.
- **Shape / Card density / Widths / Effects** — corner radius (one value drives
  the whole radius scale), card padding at two breakpoints, grid gaps, section
  rhythm, content and reading widths, minimum card height, and glass blur.

**Appearance → Customize → BBI — Layout**

- **Header** — sticky or static, reading rail on/off, search on/off, nav
  alignment, an optional CTA button, an optional header widget area.
- **Footer** — 0–4 widget columns, menu on/off, copyright line, sign-off line.
- **Sidebars** — left, right or none, set separately for idea pages, archives
  and pages, plus sticky-on-scroll.
- **Idea cards** — columns at tablet and desktop, and whether the category
  label, summary and trend bar are shown, with the summary length.

Nothing here is decorative wiring: each control writes a CSS variable that the
whole site reads, so a change lands on every page at once.

### Widget areas

Seven: *Sidebar — idea listings*, *Sidebar — single idea*, *Sidebar — pages*,
*Header*, and *Footer column 1–4*. Every one is checked with
`is_active_sidebar()` before its column is drawn, so an empty area costs no
layout. A layout that reserves a third of the width for an empty box does not
read as "no widgets yet"; it reads as broken.

### In the block editor

`theme.json` supplies the palette, gradients, a nine-step fluid type scale, a
spacing scale and shadow presets, and `add_editor_style` loads the real
compiled stylesheet so the editor renders in the actual design. The palette and
the layout widths are **rewritten at runtime from the Customizer**, so the
swatches in the editor sidebar always match the live site rather than the
values that shipped.

There are eleven block styles (glass panel, eyebrow, lead, meta, checklist,
media frame, glass pill, hairline…) and four block patterns under **BBI
sections** in the inserter.

Two custom page templates: *Full width, no sidebar* and *Landing page, no header
or footer chrome*.

### Rebuilding the stylesheet

From the repository root:

```bash
npx @tailwindcss/cli -i wp-theme/bbi/build/theme.css -o wp-theme/bbi/assets/css/bbi.css --minify
```

Compile from `build/theme.css`, never from `src/styles.css` directly. Two
reasons, both of which produced silently broken pages the first time round:
`src/styles.css` scans only `../src`, so utilities used in a PHP template but
not in any `.tsx` file are omitted (the idea grid lost `lg:grid-cols-3` and
rendered as one column); and `src/motion.css` is a separate import in
`__root.tsx`, so `.mo-card` — the class every card in this theme carries — had
no rules behind it at all. `build/theme.css` pulls in both and adds the theme's
PHP to the scan.

## What does not carry over

Stated plainly, because "a full port" is easy to claim and these are real gaps:

- **React Query's caching layer.** WordPress queries the database per request.
  Page-level caching is a host or plugin concern now.
- **Client-side routing.** Every navigation is a full page load. The route
  transition animation goes with it.
- **The seven Postgres RPCs.** Replaced by `WP_Query` and taxonomy archives,
  not reproduced. Behaviour matches for ordering and filtering; the SQL does
  not.
- **Search reach.** The original matched six columns with `ILIKE`. WordPress
  core searches title, excerpt and content only. The importer writes `summary`
  into the content and `business_description` into the excerpt, which recovers
  most of it — but `focus_keyword` and the taxonomy names are not searched.

## The homepage

`front-page.php` renders the coded homepage — hero, category ticker, brand
statement, keyword mosaic, trust bar, market gap, the four-pillar research
standard, featured blueprints, "why this exists", how it works, who it is for,
the scroll stack, pricing philosophy, "why we built this", team, inspired by,
the comparison, ways into the library, the promise, and four FAQ blocks.

Every word lives in `inc/home-content.php`, and every block of copy runs
through `apply_filters()`, so a child theme or a one-file plugin can replace
any section without forking the template.

**Editing it in Gutenberg instead:** set Settings → Reading → *A static page*
and pick a page. WordPress normally picks `front-page.php` ahead of `page.php`
even then, which would leave you editing a page that never appears — so this
template detects that case and steps aside. The BBI block patterns are in the
inserter under **BBI sections**.

Four things from the original are deliberately absent rather than
approximated: the GSAP converge on the comparison cards, the orbit diagrams and
the category marquee (React components driving bespoke timelines — the shared
reveal in `motion.js` covers the rest of the page, and a half-imitation of a
bespoke animation reads worse than none); the "Surprise me" picker, which needs
a random-idea endpoint; the three editorial photographs, which are hotlinked
from another domain and belong in the media library; and the ad slots.

The FAQ blocks use `<details>` rather than a scripted accordion — it works with
no JavaScript, is keyboard-operable and correctly announced for free, and keeps
the answer text in the DOM whether open or closed, so it is readable by search
engines and by find-in-page. A `FAQPage` JSON-LD block is emitted from the same
arrays the page renders, so the structured data cannot drift from the visible
content.

## What is not built yet

- The `/validate`, `/pricing`, `/guides`, `/tools` and `/compare` routes.
- SEO field mapping onto Rank Math or Yoast (`inc/seo.php`). The fields are
  registered and editable; nothing yet feeds them to an SEO plugin.
- Writing back to Supabase. Every read here is read-only, deliberately — the
  live site and the n8n pipeline both depend on those rows, and a WordPress
  install that could write to them is a way to lose the library by accident.

## Notes for whoever edits this next

- Every meta key is prefixed `bbi_`. Unprefixed keys such as `title`, `status`
  and `tags` collide with plugins often enough that a collision is close to
  guaranteed.
- Category and subcategory are **taxonomies**, not meta. In Supabase they are
  denormalised text columns; that is right for a flat API table and wrong for
  WordPress, where a taxonomy gives archives, permalinks and admin filtering
  for free.
- `subcategory_name` is byte-identical to `title` in the live database. The
  taxonomy is registered anyway, but nothing should print it next to the title
  — it reads as a duplicate.
- Trend bars scale against a fixed 100, never against the highest score in the
  set. Scaling to the maximum makes a field of 71–74 look like a landslide.
- `bbi_trend_score()` returns `null`, not `0`, for a missing score. Zero is a
  real value that would draw an empty bar and read as "no demand".

### How a Customizer value actually reaches the page

Worth writing down, because the cascade here has three traps and this project
has already fallen into two of them.

The compiled stylesheet declares its tokens in **seven separate `:root`
blocks, every one unlayered**, and then re-declares the light palette under
`html.light` — specificity (0,1,1). So an override only lands if it is
unlayered, at least (0,1,1), and printed after the stylesheet.
`bbi_build_dynamic_css()` emits `:root, html.light { … }` and
`wp_add_inline_style()` guarantees the ordering.

The **variable name matters too**. `src/styles.css` uses Tailwind v4's
`@theme inline`, which aliases every utility token to a base variable —
`--color-primary: var(--primary)`. The name to override is the base one
(`--primary`), never the alias. Writing the alias sets a value nothing reads,
and the change appears to do nothing at all.

Two things a variable cannot reach, and how they are handled:

- **Glass blur** is written as a literal `blur(24px) … !important` in the
  compiled CSS, so the blur control emits a real rule with its own
  `!important` — and only when the value differs from the default, because
  emitting it always would flatten the three deliberately different blur
  strengths into one.
- **Grid column counts** are Tailwind utilities, and Tailwind generates
  utilities by scanning source text. `lg:grid-cols-{$n}` appears in no file, so
  it would never be compiled. The column settings map through a lookup table of
  literal class names instead.
