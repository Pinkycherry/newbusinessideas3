# BBI — WordPress theme

A WordPress port of the businessidea.io site (TanStack Start + Supabase). Ideas,
categories and the FAQ pool become Custom Post Types and taxonomies, so the
library is editable in wp-admin instead of only through the Sheet-and-pipeline
route.

**Status: Phase 1.** The theme installs, imports the library, and renders idea
pages, category archives, search, static pages and a 404. The homepage is
Phase 2 — see *What is not built yet* below.

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

## Import the library from Supabase

Needs WP-CLI on the host.

```bash
wp bbi import --url=https://<project>.supabase.co --key=<service-role-key> --dry-run
wp bbi import --url=https://<project>.supabase.co --key=<service-role-key>
```

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

The key is passed on the command line and never stored in the theme. Do not put
it in a file inside `wp-content`.

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
  assets/css/bbi.css     compiled — do not edit
  assets/js/*.js         vanilla ports of the motion and hero systems
  build/theme.css        the Tailwind entry that produces assets/css/bbi.css
```

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

## What is not built yet (Phase 2)

- `front-page.php` — the homepage. Roughly two dozen distinct sections on the
  original, several driven by live aggregate queries. It is the largest single
  piece of the port and is deliberately not stubbed, because a half-built
  homepage is worse than the fallback archive.
- The `/validate`, `/pricing`, `/guides`, `/tools` and `/compare` routes.
- SEO field mapping onto Rank Math or Yoast (`inc/seo.php`). The fields are
  registered and editable; nothing yet feeds them to an SEO plugin.

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
