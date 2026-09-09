# What the founder actually needs

Written 2026-08-24. Drawn from the founder's own words across this conversation,
not from my interpretation. My work on this site currently rates 4/10 — that
rating is about my output, not the founder's brief.

---

## 1. Motion applied to what ALREADY EXISTS — stop building new sections

The founder's own question, and it is the correct one: *"why can't we use such
kind of tool like animation for the existing sections?"*

The measured facts that make this the highest-leverage item:

- **18 of 20 templates have zero animation.** All motion lives in `index.tsx`
  (45 references) and `idea.$slug.tsx` (2). Every other page is completely still.
- The homepage **already has ~24 sections**. It did not need new ones.
- I spent two days building four image frames for **one** section while 18
  templates sat untouched.

Retrofit the existing layout. Do not add more sections.

## 2. Hover and pointer response on everything — not buttons pasted on artwork

*"When mouse is hovering anywhere, not just a random button that you generated,
like a capsules, like a pharmaceutical promotion."*

Every card, link, nav item, dropdown row, footer link and table row should
respond to the cursor. Nothing responds today — there is no pointer channel on
the site at all, and no scroll-velocity signal.

What this is NOT: category pills or CTA buttons layered on top of images. That
was my error, twice, and it made the artwork look cluttered.

## 3. Every page to the same standard — homepage through disclaimer

*"every page must be highly qualified, highly interactive."*

- **10 pages are literally the same component** — about, contact, pricing,
  privacy, terms, disclaimer, gdpr, refund-policy, services, sign-in all render
  `ContentPage` with different text. Half the site is one template.
- Template depth off the homepage collapses: index 1,698 lines, idea 755, then
  everything else 49–148.
- No page transitions anywhere. Navigating between routes is a hard cut.

## 4. Real data is the thing that should move

We are a researched idea library — the data IS the product, and right now it is
static. World-class comparison (verified, from the benchmark research):

- Stripe ticks "Global GDP running on Stripe: **1.70353809%**" — eight decimals
  is an odometer, not a number.
- Linear's homepage carries **one** alt attribute; Vercel's carries **zero**.
  Their product UI is live DOM, not screenshots.
- Linear shows real changelog dates and a "Weekly Pulse for Aug 24".

I removed the site's fabricated numbers, which was right, but put nothing live
in their place. Counters that count, filters that re-sort in front of the user,
real "N ideas / updated <date>" — motion applied to real values.

## 5. Header, footer, and the legal pages are damaging, not just weak

*"the footer that you gave me is two worse than everyone's"* and
*"go to the disclaimer page and what exactly you are talking about... damaging
my integrity. And misinformation in the disclaimer page."*

Specific, verifiable problems:

- **`disclaimer.tsx` names the validation mechanism explicitly** — it says the
  output "comes from Claude or Perplexity on your own account." That breaks the
  founder's own standing rule that marketing copy must never name the
  destination AI account, and it reads as generic boilerplate rather than BBI's
  voice.
- The footer is a tag-cloud of pills. `PROJECT_BRIEF.md` §12.4 already says it
  needs a **full rebuild**, not a tweak.
- Header dropdowns are flagged in §12.5 as "currently underbuilt".
- **A sitewide hydration bug** in `site-shell.tsx:724` makes React discard and
  re-render the tree on most pages.
- **A global rule** styles every `a[href*="/category/"]` with `!important` — any
  new component linking to a category gets silently overridden. This is a live
  trap that already broke the homepage arc once.

---

## Constraints that must not be forgotten again

- Scale target is **10,000+ pages**. Anything that needs hand-made art per page
  cannot work. Motion must be systemic, driven by data and CSS, not per-page assets.
- The homepage is the core, but it is not the whole site, and it consumed two
  days it should not have.
- Videos currently in `public/` are unusable: misspelled text baked into the
  pixels (`RIDE HUSTLE IDEAS`), wrong setting, wrong cast, generator watermark.
- No fabricated numbers, no fake testimonials, no invented stats. Ever.
- India-first audience.
