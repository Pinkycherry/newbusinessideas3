import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import MovingImageCards from "@/components/aceternity/moving-image-cards";
import { prefersReducedMotion } from "@/lib/motion";
import type { PageResources } from "@/lib/resources.server";

/**
 * The homepage's own treatment of the four resource pools.
 *
 * SiteShell renders `<ResourceHub />` — plain cards under four headings — on
 * every page but the homepage and the policy pages. This is the homepage's
 * replacement for it, and the founder's instruction was explicit: it must not
 * look like the block on every other page. Same data, four different
 * treatments, one per pool:
 *
 *   Calculators  — the "Built with" ticker. Twelve short names is a strip,
 *                  not a grid, and it is already the grammar this site uses
 *                  for a long list of small things (`.bbi-built-ticker`).
 *   Guides       — a light travelling the border of each card on hover
 *                  (`.bbi-aura`). Six cards, so the motion has room to be
 *                  noticed without the page turning into a light show.
 *   Glossary     — flip cards. Term on the face, definition behind. A
 *                  glossary is the one pool where the card genuinely has two
 *                  sides, so the effect is the content rather than decoration.
 *   Blog         — the same image marquee the category library above it runs
 *                  (`MovingImageCards`). It falls back to a typographic plate
 *                  when a post has no picture, so the day `blog_posts.image`
 *                  is filled in the photographs appear here with no code
 *                  change — which is what the founder asked for.
 *
 * It takes its data as a prop and fetches nothing. The picks come from the
 * root loader, drawn once per request; see resources.server.ts for why the
 * shuffle cannot happen in a component.
 *
 * This file is homepage-only. Nothing else imports it, and nothing here is
 * shared with `resource-hub.tsx`, deliberately — the two are meant to look
 * like different things.
 */

function Heading({ legend, title }: { legend: string; title: string }) {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <p className="ins-legend">{legend}</p>
      <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h3>
    </div>
  );
}

export function HomeResourceShowcase({ resources }: { resources: PageResources | null }) {
  // The ticker duplicates its own list to loop seamlessly; under reduced
  // motion it wraps into a static cluster instead, exactly as the
  // "Built with" row does.
  const [looping, setLooping] = useState(true);
  useEffect(() => {
    setLooping(!prefersReducedMotion());
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setLooping(!query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  if (!resources) return null;
  const { calculators, guides, glossary, posts } = resources;
  const tickerItems = looping ? [...calculators, ...calculators] : calculators;

  return (
    <section
      data-anchor="toolkit"
      data-anchor-label="The toolkit"
      className="ins-module py-16"
      aria-label="Free calculators, guides, glossary and writing."
    >
      <div className="mx-auto max-w-6xl px-6">
        <p className="ins-legend">The toolkit</p>
        <h2 className="mt-3 max-w-3xl">Everything else here, and all of it free.</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          No sign-in, no credits, nothing to pay. The guides, the glossary and the writing change
          every time this page loads.
        </p>
      </div>

      {/* ---- Calculators: the ticker ---------------------------------- */}
      {calculators.length > 0 && (
        <div className="mt-12">
          <Heading legend="Run the numbers" title="Twelve free calculators." />
          <div className="bbi-built-ticker mt-6">
            <div
              className={`bbi-built-ticker-track ${looping ? "" : "bbi-built-ticker-static"}`}
              style={looping ? { animationDuration: "46s" } : undefined}
            >
              {tickerItems.map((item, i) => (
                <Link
                  key={`${item.slug}-${i}`}
                  to="/calculator/$slug"
                  params={{ slug: item.slug }}
                  // The duplicated half is decoration for the loop, so it is
                  // hidden from assistive tech and taken out of the tab order
                  // rather than read out and tabbed through twice.
                  aria-hidden={i >= calculators.length ? true : undefined}
                  tabIndex={i >= calculators.length ? -1 : undefined}
                  className="glass glass-hover shrink-0 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---- Guides: the travelling border ---------------------------- */}
      {guides.length > 0 && (
        <div className="mt-16">
          <Heading legend="Read first" title="Six startup guides, drawn fresh each visit." />
          <ul className="mx-auto mt-6 grid max-w-6xl gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  to="/startup-guides/$slug"
                  params={{ slug: guide.slug }}
                  className="bbi-aura group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-transform duration-300 hover:-translate-y-1"
                >
                  <span className="text-base font-bold leading-snug text-foreground transition-colors group-hover:text-accent">
                    {guide.label}
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {guide.blurb}
                  </span>
                  {guide.meta && (
                    <span className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                      {guide.meta}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---- Glossary: flip cards ------------------------------------- */}
      {glossary.length > 0 && (
        <div className="mt-16">
          <Heading legend="Say it properly" title="Twelve terms. Turn one over." />
          <ul className="mx-auto mt-6 grid max-w-6xl gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3">
            {glossary.map((term) => (
              <li key={term.slug} className="bbi-flip h-40">
                {/* The link wraps BOTH faces, so the whole card is one target
                    and `:focus-within` on the outer element turns it for a
                    keyboard exactly as hover does for a cursor. */}
                <Link
                  to="/founder-glossary"
                  hash={term.slug}
                  className="block h-full rounded-2xl"
                  aria-label={`${term.label}: ${term.blurb}`}
                >
                  <span className="bbi-flip-inner block rounded-2xl">
                    <span className="bbi-flip-face glass rounded-2xl border border-border p-5">
                      <span className="text-lg font-bold leading-snug text-foreground">
                        {term.label}
                      </span>
                      {term.meta && (
                        <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                          {term.meta}
                        </span>
                      )}
                    </span>
                    <span className="bbi-flip-face bbi-flip-back rounded-2xl border border-primary/40 bg-card p-5">
                      {/* `aria-hidden`: the link's own label already reads the
                          term and its definition, so the back face would say
                          the same sentence a second time. */}
                      <span aria-hidden className="text-sm leading-relaxed text-foreground">
                        {term.blurb}
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---- Blog: the image marquee ---------------------------------- */}
      {posts.length > 0 && (
        <div className="mt-16">
          <Heading legend="From the blog" title="What we have been writing." />
          <div className="mt-6">
            <MovingImageCards
              direction="right"
              speed={52}
              cards={posts.map((post) => ({
                title: post.label,
                // Spread rather than assigned: `exactOptionalPropertyTypes`
                // is on, so an optional field may be absent but never
                // explicitly `undefined`.
                ...(post.meta ? { meta: post.meta } : {}),
                // `image` is null on a post with no featured image yet, and
                // MovingImageCards draws a ruled plate for those. Filling
                // `blog_posts.image` in Supabase is all it takes for the
                // photographs to appear here.
                ...(post.image ? { src: post.image, alt: post.label } : {}),
                to: "/blog/$slug",
                params: { slug: post.slug },
              }))}
            />
          </div>
        </div>
      )}
    </section>
  );
}
