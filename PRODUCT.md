# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Someone starting from zero. No capital, no team, often no laptop — reading on a
phone, late, after searching "business ideas". They are not evaluating a
portfolio of options with an accountant; they are trying to find one thing that
could work for a person in their exact situation, and to find out fast whether
it could not.

Secondary: people already earning who want a second income and will not quit
anything to try it.

## Product Purpose

A free library of researched business ideas at businessidea.io. 290 completed
ideas live in Supabase, organised into categories and subcategories, browsable
and searchable without an account.

Every idea page answers four questions:

1. Who specifically will pay you
2. How the money actually works
3. What will hurt in year one
4. A straight founder-fit verdict — including "do not build this one"

Success is a reader leaving with either a real candidate or a clear reason to
discard one, having paid nothing and given up no email.

## Positioning

The fourth answer is the mechanism a competitor cannot truthfully copy: the
library tells you when *not* to build something. Idea lists compete on volume
and optimism; this one competes on being willing to talk a reader out of an
idea, and on charging nothing to do it.

Price is the supporting fact, not the personality — validating an idea
elsewhere costs money that the reader was going to start the business with.

## Constraints

Durable, and binding on all future work:

- **Zero fabricated numbers.** Every figure traces to a real source. If a
  number cannot be verified, say so rather than producing one.
- **Never invent a category slug, an idea title, or a statistic.** Two
  hand-typed slugs shipped broken once already.
- **Never name an AI vendor in public copy.**
- **Never mutate the live Supabase rows.** The site and the content pipeline
  both read them. Additive only.
- Free tiers only for third-party tooling until launch.

## Evidence and assets

- 290 ideas, all `status = 'completed'`, in the live `ideas` table.
- A pre-launch review group of 967 people, recorded before launch. It is a
  one-time count, not a live metric, and the copy says so.
- The golden tree is the site's own signature visual and is confirmed as
  something to keep.

## Terminology

Ideas are **ideas** or **blueprints**, never "listings" or "products".
Categories and subcategories are the two levels of the catalog. The reader is
never called a "user" in public copy.

## Voice

Plain and direct, honest about limits. Short sentences. It says the hard part
out loud rather than selling past it. No hype, no exclamation marks, no
manufactured urgency.

## Accessibility

Public, unauthenticated, read-heavy, largely mobile. Body text and controls
must clear WCAG AA contrast, and motion must respect
`prefers-reduced-motion`.

## Open decisions

- Whether the black visual world extends past the homepage to the other 25
  routes. Homepage is scoped for now, deliberately.
