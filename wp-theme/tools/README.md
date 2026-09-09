# Render harness

Renders the theme's block markup against the real compiled stylesheet in a real
browser, and measures it.

**Run this before pushing a template or header change.** It exists because it
did not, and 0.4.0 shipped a homepage with two headings instead of twenty and a
search field that took 98% of the navigation bar. `php -l` passed. A grep for
class names in the compiled CSS passed. Neither of those can see a layout.

```bash
python3 wp-theme/tools/render-harness.py /tmp/bbi-harness
node     wp-theme/tools/measure.mjs /tmp/bbi-harness/front.html /tmp/bbi-harness/front
```

It prints, at 1440px and 390px:

| Field | Watch for |
|---|---|
| `horizontalOverflow` | must be `false` |
| `headerHeight` | one row is ~50px; 200+ means the nav is wrapping |
| `searchWidthPct` | share of the nav bar the search claims; ~17% desktop, 0 on mobile |
| `iconBandHeight` | ~110px; much more and it dominates the fold |
| `h2Count` | the homepage has 20. A sudden drop means sections were lost |

## Why `core-shim.css` exists

WordPress loads `wp-block-library` on every page and the harness does not, so
without a stand-in for its layout rules every `wp:columns` looks stacked and
every navigation looks wrapped — failures that are not real. The first version
of this harness had exactly that flaw and reported a broken header that was
fine, which is its own kind of dangerous: a check that cries wolf gets ignored.

The shim is deliberately small and only covers layout. It is not a substitute
for looking at the real site.

## What it cannot tell you

Dynamic `bbi/*` blocks are replaced with representative stand-ins, so this
measures the surrounding layout, not their output. The mobile navigation
overlay is not simulated. Fonts load from Google, so a sandbox without network
renders fallbacks and vertical measurements shift slightly.
