# Image SEO

The standard for every image added to this site, and for the SEO fields on
anything else that carries them. It is not advice — it is the contract. New
images that do not meet it do not ship.

The founder set it on 2026-09-09: *"strong File name with minimum 5 strong
keywords, descriptions with focus and 3 additional keywords, 2 long tail
keywords, Alt text with 4 keywords. Follow the same for every future SEO for
images and other areas."*

---

## The six fields

Every image carries all six. None is optional, and none may be left to be
filled in later.

| Field | Rule |
|---|---|
| **File name** | At least **5 keywords**. Lowercase, hyphen-separated, no spaces, no underscores, no capitals, no `IMG_2481`. The extension is `.webp`. |
| **Alt text** | Exactly **4 keywords**, written as a real sentence that describes the picture. It is read aloud, so it must make sense read aloud. |
| **Focus keyword** | **One** phrase. The single thing the image is meant to rank for. |
| **Keywords** | **3** supporting keywords, none of them the focus keyword. |
| **Long-tail** | **2** full phrases, the kind someone types as a question or a sentence. |
| **Description** | One or two sentences. Contains the focus keyword and reads as a caption a person would actually want under the picture. Used as the `<figcaption>` and in the page's structured data. |

### Alt text is not the file name again

Alt text describes what is in the picture, for someone who cannot see it. A
file name is an address. Writing the same string into both wastes the alt text
and reads as keyword stuffing to a crawler.

- **Wrong:** `alt="side-hustle-business-ideas-part-time-income-evenings-weekends"`
- **Right:** `alt="Side hustle business ideas for part time income in evenings and weekends"`

### Nothing here may be invented

`CLAUDE.md`'s house rules apply to image copy exactly as they do to page copy.
No fabricated numbers in a description, no invented category name, no claim
that cannot be traced. A description says what the picture shows and what the
page behind it holds — nothing more.

---

## Where it lives in the code

`src/config/category-imagery.ts` is the reference implementation. Each entry is
a `CategoryImage`:

```ts
{
  src: "/images/categories/side-hustle-business-ideas-part-time-income-evenings-weekends-beginners.webp",
  alt: "Side hustle business ideas for part time income in evenings and weekends",
  focus: "side hustle ideas",
  keywords: ["part time business", "evening income", "weekend side hustle"],
  longTail: [
    "side hustle ideas you can run alongside a full time job",
    "part time business ideas for evenings and weekends",
  ],
  description:
    "Side hustle ideas: what fits around a job, how many hours it really takes, and the point at which it stops being a side hustle.",
}
```

The types enforce the counts: `keywords` is a 3-tuple and `longTail` is a
2-tuple, so an entry with the wrong number of either fails `tsc`, not review.

### Match on words, never on a hand-typed slug

`categoryImage(slug)` picks an image by testing the slug against a regex, and
returns a generic library image for anything unmatched. This is not a style
preference. `src/lib/catalog-display.ts` records what happened the last time
this site hardcoded a list of category slugs: fourteen were typed by hand, two
were wrong, and the surfaces reading them silently rendered short on every
page. A word match survives a rename; a typed slug does not.

---

## Where the files live

`public/images/categories/` — committed to this repository and served from our
own domain. Not hotlinked.

Photography sourced from ethicalfounder.com stays in `src/config/imagery.ts`
and is referenced by URL; that file is for the parent site's media library and
follows the same six fields as it gains entries.

---

## Markup checklist

Every `<img>` on the site:

- `alt` — always present, to the rule above. Decorative images get `alt=""` and
  `aria-hidden`, and then they need no SEO fields at all.
- `width` and `height` — always, so the layout does not shift while it loads.
- `loading` — `eager` with `fetchPriority="high"` if it is above the fold,
  `lazy` otherwise. Getting this backwards on a hero image tells the browser to
  deprioritise the one image that most needs priority.
- `ref={hideImgIfBroken}` — a URL that later disappears degrades to the plate's
  ink ground instead of a broken-image icon.
- Wrapped in `<figure>` with a `<figcaption>` when the description is worth
  showing; the caption is the `description` field, unchanged.

## Page checklist

A page whose subject has a featured image also sets, from the same entry:

- `og:image` and `og:image:alt`
- `twitter:image` (with `twitter:card` = `summary_large_image`)

So the same four keywords describe the image to a screen reader, to a crawler
and to a link preview. Three copies of one fact, written once.

---

## Applying this to anything that is not an image

The founder's instruction covers "other areas" too. Where a surface has an SEO
surface of its own — a page title, a meta description, a category landing page,
a blueprint — it carries the same shape:

| Surface | Focus | 3 supporting | 2 long-tail | The "alt" equivalent |
|---|---|---|---|---|
| Page | The page's one target phrase | In the body copy, not stuffed in the title | In an H2 or an FAQ answer | The meta description |
| Category | Category name as searched, not as branded | The three groups it belongs to | Two questions people ask about it | `og:description` |
| Blueprint | The idea as someone would search it | Model, audience, cost | Two "how do I…" phrasings | The summary line |

Same rule as the images: nothing invented, and the long-tail phrases have to be
things a person would actually type.

---

## Adding an image

1. Name the file to the rule — at least 5 keywords — before it is committed.
   Renaming later breaks the URL, and the URL is the part search engines keep.
2. Put it in `public/images/categories/` (or the right folder for its subject).
3. Add the entry to `src/config/category-imagery.ts` with all six fields.
4. If it is a new subject rather than a new category, add a rule with a word
   match, not a slug.
5. `npx tsc --noEmit`. The tuple types catch a miscounted field list.
