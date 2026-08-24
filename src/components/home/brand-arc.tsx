import { useRef } from "react";
import { Link } from "@tanstack/react-router";

import type { CategoryNode } from "@/lib/ideas.functions";
import { useKineticLines, useStaggerReveal, usePinProgress } from "@/lib/scroll-devices";

/**
 * The brand arc — four founder-generated frames telling one continuous story:
 * the idea appears inside them (1), gets examined (2), gets validated (3),
 * gets released (4).
 *
 * The single rule that governs every section here: **the image supplies the
 * glow, the DOM supplies the words.** Each frame was generated with its
 * holographic containers deliberately left EMPTY — blank pills, blank panels,
 * bare light beams — and every category name you see is real markup layered
 * on top, driven from the live Supabase catalog.
 *
 * That is not a stylistic preference. Baked-in text cannot be selected,
 * translated, indexed by search engines, or re-flowed on a 390px screen, and
 * it goes stale the moment a category is renamed. Keeping the words in the DOM
 * means they animate for real, stay readable at every width, and always match
 * what is actually in the database.
 */

/** Chapter 1 — the idea appears. Copy sits in the frame's empty left third. */
function ChapterOne({ totalIdeas, categoryCount }: { totalIdeas: number; categoryCount: number }) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  useKineticLines(headingRef);

  return (
    <section
      className="bbi-arc bbi-arc--one"
      data-anchor="arc-begin"
      data-anchor-label="The idea"
      aria-labelledby="arc-one-heading"
    >
      <img
        src="/01-mind-begins.webp"
        alt=""
        aria-hidden
        width={1280}
        height={720}
        className="bbi-arc-img"
        loading="eager"
        fetchPriority="high"
      />
      <div className="bbi-arc-scrim" aria-hidden />
      <div className="bbi-arc-copy bbi-arc-copy--lead">
        <p className="bbi-arc-eyebrow">Every business starts the same way</p>
        <h2 id="arc-one-heading" ref={headingRef} className="bbi-arc-h">
          It begins as a thought you cannot put down.
        </h2>
        <p className="bbi-arc-body">
          The hard part was never having the idea. It was finding out whether the idea is worth your
          next six months, before you spend them.
        </p>
        <dl className="sc-spec-label bbi-arc-stats">
          <div>
            <dt>Blueprints</dt>
            <dd>{totalIdeas}</dd>
          </div>
          <div>
            <dt>Categories</dt>
            <dd>{categoryCount}</dd>
          </div>
          <div>
            <dt>Cost to read</dt>
            <dd>Free</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

/**
 * Chapter 2 — the idea goes external. The frame's blank orbiting pills are
 * filled with the real category names, staggered in on scroll.
 */
function ChapterTwo({ categories }: { categories: CategoryNode[] }) {
  const pillsRef = useRef<HTMLDivElement | null>(null);
  useStaggerReveal(pillsRef, ".bbi-arc-pill", { staggerMs: 60 });
  const shown = categories.slice(0, 10);

  return (
    <section
      className="bbi-arc bbi-arc--two"
      data-anchor="arc-scan"
      data-anchor-label="The scan"
      aria-labelledby="arc-two-heading"
    >
      <img
        src="/02-global-scan.webp"
        alt=""
        aria-hidden
        width={1280}
        height={720}
        className="bbi-arc-img"
        loading="lazy"
      />
      <div className="bbi-arc-scrim bbi-arc-scrim--top" aria-hidden />
      <div className="bbi-arc-copy bbi-arc-copy--top">
        <h2 id="arc-two-heading" className="bbi-arc-h bbi-arc-h--sm">
          Then you look at what is actually out there.
        </h2>
        <div ref={pillsRef} className="bbi-arc-pills">
          {shown.map((c) => (
            <Link
              key={c.categorySlug}
              to="/category/$categorySlug"
              params={{ categorySlug: c.categorySlug }}
              className="bbi-arc-pill sc-flow-item sc-press"
            >
              <span>{c.categoryName}</span>
              <span className="bbi-arc-pill-n">{c.ideaCount}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Chapter 3 — validation. The frame's 3x3 grid of blank holographic panels is
 * overlaid with a real 3x3 grid carrying live category data, positioned to sit
 * inside the painted panels on wide screens and reflowing to a normal grid
 * below them on narrow ones.
 */
function ChapterThree({ categories }: { categories: CategoryNode[] }) {
  const stageRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  usePinProgress(stageRef, { spanVh: 1.4 });
  useStaggerReveal(gridRef, ".bbi-arc-panel", { staggerMs: 70 });
  const shown = categories.slice(0, 9);

  return (
    <section
      ref={stageRef}
      className="bbi-arc bbi-arc--three"
      data-anchor="arc-validate"
      data-anchor-label="Validation"
      aria-labelledby="arc-three-heading"
    >
      <img
        src="/03-validation-cascade.webp"
        alt=""
        aria-hidden
        width={1280}
        height={720}
        className="bbi-arc-img"
        loading="lazy"
      />
      <div className="bbi-arc-scrim bbi-arc-scrim--right" aria-hidden />
      <h2 id="arc-three-heading" className="bbi-arc-h bbi-arc-h--sm bbi-arc-h--corner">
        Sorted, scored, and honest about the downside.
      </h2>
      <div ref={gridRef} className="bbi-arc-panels">
        {shown.map((c) => (
          <Link
            key={c.categorySlug}
            to="/category/$categorySlug"
            params={{ categorySlug: c.categorySlug }}
            className="bbi-arc-panel sc-flow-item"
          >
            <span className="bbi-arc-panel-name">{c.categoryName}</span>
            <span className="bbi-arc-panel-n">
              {c.ideaCount} blueprint{c.ideaCount === 1 ? "" : "s"}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Chapter 4 — release. Copy sits in the frame's open upper half. */
function ChapterFour({ totalIdeas }: { totalIdeas: number }) {
  return (
    <section
      className="bbi-arc bbi-arc--four"
      data-anchor="arc-open"
      data-anchor-label="Start"
      aria-labelledby="arc-four-heading"
    >
      <img
        src="/04-open-pathways.webp"
        alt=""
        aria-hidden
        width={1280}
        height={720}
        className="bbi-arc-img"
        loading="lazy"
      />
      <div className="bbi-arc-scrim bbi-arc-scrim--top" aria-hidden />
      <div className="bbi-arc-copy bbi-arc-copy--top bbi-arc-copy--center">
        <h2 id="arc-four-heading" className="bbi-arc-h">
          {totalIdeas} ways out, all of them free to read.
        </h2>
        <p className="bbi-arc-body">
          No paywall on the reading. No counter on the checking. Start with the one that sounds like
          your life, not the one that sounds impressive.
        </p>
        <div className="bbi-arc-actions">
          <Link to="/browse" className="glass-pill sc-press bbi-arc-cta">
            Browse the library
          </Link>
          <Link to="/search" className="bbi-arc-link">
            Or search for something specific
          </Link>
        </div>
      </div>
    </section>
  );
}

export function BrandArc({
  categories,
  totalIdeas,
}: {
  categories: CategoryNode[];
  totalIdeas: number;
}) {
  if (categories.length === 0) return null;
  return (
    <>
      <ChapterOne totalIdeas={totalIdeas} categoryCount={categories.length} />
      <ChapterTwo categories={categories} />
      <ChapterThree categories={categories} />
      <ChapterFour totalIdeas={totalIdeas} />
    </>
  );
}
