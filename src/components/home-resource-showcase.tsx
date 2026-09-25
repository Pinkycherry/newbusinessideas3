import { Link } from "@tanstack/react-router";
import { useState } from "react";

import InfiniteMovingCards from "@/components/aceternity/infinite-moving-cards";
import MovingImageCards from "@/components/aceternity/moving-image-cards";
import type { PageResources, ResourceLink } from "@/lib/resources.server";
import "./home-resource-showcase.css";

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
 *   Guides       — numbered reading folios with a small hinged corner.
 *                  One transform answers hover; no border-painting loop.
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

/** One small original mark, shared by the folio links and the flip control. */
function FolioArrow({ turn = false }: { turn?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {turn ? (
        <path d="M7 7.5h8a4 4 0 0 1 0 8h-1M7 7.5l3-3M7 7.5l3 3M8 16.5H4m0 0 2.5-2.5M4 16.5 6.5 19" />
      ) : (
        <path d="M5 12h14m-5-5 5 5-5 5" />
      )}
    </svg>
  );
}

function GlossaryFlip({ term, index }: { term: ResourceLink; index: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <li
      className="hf-term"
      data-flipped={flipped || undefined}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setFlipped(true);
      }}
      onPointerLeave={(event) => {
        if (
          event.pointerType === "mouse" &&
          !event.currentTarget.contains(document.activeElement)
        ) {
          setFlipped(false);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFlipped(false);
      }}
    >
      <Link
        to="/founder-glossary"
        hash={term.slug}
        className="hf-term-link"
        aria-label={`${term.label}: ${term.blurb}`}
        onFocus={() => setFlipped(true)}
      >
        {/* The two faces share a grid cell, so the longer face sets their
            height. The accessible link name reads the definition once. */}
        <span className="hf-term-inner" aria-hidden="true">
          <span className="hf-term-face hf-term-front">
            <span className="hf-term-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="hf-term-title">{term.label}</span>
            {term.meta && <span className="hf-term-meta">{term.meta}</span>}
          </span>
          <span className="hf-term-face hf-term-back">
            <span className="hf-term-back-title">{term.label}</span>
            <span className="hf-term-definition">{term.blurb}</span>
            <span className="hf-term-open">
              Read in glossary <FolioArrow />
            </span>
          </span>
        </span>
      </Link>
      {/* Separate from the link: a phone can turn the page before choosing
          to leave it. Hover and keyboard focus retain the original flip. */}
      <button
        type="button"
        className="hf-term-toggle bbi-bare"
        aria-label={`Flip ${term.label}`}
        aria-pressed={flipped}
        onClick={() => setFlipped((value) => !value)}
      >
        <span>{flipped ? "Turn back" : "Turn over"}</span>
        <FolioArrow turn />
      </button>
    </li>
  );
}

export function HomeResourceShowcase({ resources }: { resources: PageResources | null }) {
  if (!resources) return null;
  const { calculators, guides, glossary, posts } = resources;

  return (
    <section
      data-anchor="toolkit"
      data-anchor-label="The toolkit"
      className="hf-toolkit ins-module py-16"
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
          <Heading legend="Run the numbers" title="Make your next move add up." />
          <InfiniteMovingCards
            className="bbi-built-ticker mt-6"
            itemClassName="glass glass-hover rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:text-accent"
            speed={46}
            items={calculators.map((item) => ({
              label: item.label,
              to: "/calculator/$slug",
              params: { slug: item.slug },
            }))}
          />
        </div>
      )}

      {/* ---- Guides: numbered reading folios -------------------------- */}
      {guides.length > 0 && (
        <div className="mt-16">
          <Heading legend="Read first" title="Six startup guides, drawn fresh each visit." />
          <ul className="hf-guides mx-auto mt-6 max-w-6xl px-6">
            {guides.map((guide, index) => (
              <li key={guide.slug}>
                <Link to="/startup-guides/$slug" params={{ slug: guide.slug }} className="hf-guide">
                  <span className="hf-guide-spine" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="hf-guide-sheet">
                    <span className="hf-guide-meta">
                      <span>Startup guide</span>
                      {guide.meta && <span>{guide.meta}</span>}
                    </span>
                    <span className="hf-guide-title">{guide.label}</span>
                    <span className="hf-guide-blurb">{guide.blurb}</span>
                    <span className="hf-guide-open">
                      Read the guide <FolioArrow />
                    </span>
                  </span>
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
          <ul className="hf-terms mx-auto mt-6 max-w-6xl px-6">
            {glossary.map((term, index) => (
              <GlossaryFlip key={term.slug} term={term} index={index} />
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
