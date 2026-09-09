import { Link } from "@tanstack/react-router";

import { CategoryBadge } from "@/components/category-badge";
import { Reveal } from "@/components/reveal";
import { hideImgIfBroken } from "@/lib/utils";
import type { CategoryNode } from "@/lib/ideas.functions";

/**
 * Lifted verbatim out of routes/index.tsx when the homepage was recomposed for
 * the void. Not one line of it changed: the tree and the twin rings are the
 * two things on this page that were explicitly kept as they are, so this file
 * is a move, not a rewrite. Diff it against the old route if you ever doubt
 * that.
 */
// The only two tree asset URLs in the app — do not add or swap in others.
const DESKTOP_TREE_SRC =
  "https://ethicalfounder.com/wp-content/uploads/2026/08/business-ideas-tree-for-startup-invention-low-cost-business-ideas-latest-zero-investement.jpg";
const MOBILE_TREE_SRC =
  "https://ethicalfounder.com/wp-content/uploads/2026/08/new-business-ideas-tree-for-small-and-low-upfront-business-or-startups.svg";

export function GoldenTreeSection({ categories }: { categories: CategoryNode[] }) {
  // Real blueprint counts, straight from the live catalog. This block used to
  // render a sine wave over hardcoded bases, labelled "weekly web searches" —
  // figures that were never sourced from anything. A node whose category is
  // not in the catalog renders no number at all rather than inventing one.
  const countBySlug = new Map(categories.map((c) => [c.categorySlug, c.ideaCount]));
  const countFor = (slug: string) => countBySlug.get(slug) ?? null;

  const fmt = (n: number | null) =>
    n === null ? "" : `${n} researched blueprint${n === 1 ? "" : "s"}`;

  const desktopNodes = [
    {
      label: "Zero Investment Ideas",
      slug: "zero-investment-business-ideas",
      x: 28,
      y: 18,
      d: 0,
      count: countFor("zero-investment-business-ideas"),
    },
    {
      label: "Work From Home Ideas",
      slug: "work-from-home-business-ideas",
      x: 50,
      y: 12,
      d: 0.6,
      count: countFor("work-from-home-business-ideas"),
    },
    {
      label: "Low Investment Ideas",
      slug: "low-investment-business-ideas",
      x: 72,
      y: 20,
      d: 1.2,
      count: countFor("low-investment-business-ideas"),
    },
    {
      label: "Side Hustle Ideas",
      slug: "side-hustle-ideas",
      x: 20,
      y: 38,
      d: 1.8,
      count: countFor("side-hustle-ideas"),
    },
    { label: "Tech & SaaS", slug: "tech-saas", x: 42, y: 32, d: 2.4, count: countFor("tech-saas") },
    {
      label: "FinTech & Finance",
      slug: "fintech-finance",
      x: 60,
      y: 34,
      d: 3.0,
      count: countFor("fintech-finance"),
    },
    {
      label: "E-Commerce & Retail",
      slug: "ecommerce-retail",
      x: 80,
      y: 40,
      d: 3.6,
      count: countFor("ecommerce-retail"),
    },
    {
      label: "Creator & Media",
      slug: "creator-media",
      x: 30,
      y: 55,
      d: 4.2,
      count: countFor("creator-media"),
    },
    {
      label: "Health & Fitness",
      slug: "health-fitness",
      x: 70,
      y: 56,
      d: 4.8,
      count: countFor("health-fitness"),
    },
    {
      label: "Validation Center",
      path: "/browse",
      x: 50,
      y: 52,
      isCenter: true,
      d: 5.4,
      count: null,
    },
  ];

  return (
    <section
      id="golden-tree"
      data-anchor="golden-tree"
      data-anchor-label="Golden Tree"
      className="mx-auto mt-12 sm:mt-16 max-w-6xl px-3 sm:px-4"
    >
      <div className="text-center max-w-3xl mx-auto">
        <p className="t-eyebrow">Interactive Canopy Map</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
          The Golden Tree of Business Growth
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base leading-relaxed">
          Tap or hover any leaf node to see how many researched blueprints that category holds right
          now, then open the ones behind it.
        </p>
      </div>

      {/* No boxed/16:9 backdrop element here on purpose — the dark glow behind the
          tree lives entirely in .tree-asset-container::before in styles.css, as a
          large, heavily-blurred radial glow with no hard edge or rectangle. */}
      <Reveal
        variant="rv-zoom"
        className="relative mt-8 sm:mt-12 flex w-full items-center justify-center py-10 sm:py-16"
      >
        {/* DESKTOP TREE ASSET — this is a hotlinked cross-origin JPG (lives on
            ethicalfounder.com, not our domain), so any technique that needs
            to read its actual pixel data (a CSS mask-image, an SVG luminance
            filter) is blocked by the browser unless that domain sends CORS
            headers, which it doesn't — the previous attempt at this made the
            whole tree invisible. mix-blend-mode is a pure rendering
            composite, not a pixel read, so it's the only cross-origin-safe
            option here; see .tree-asset-container img in styles.css. */}
        <div className="hidden sm:block relative w-full max-w-5xl aspect-[16/9] group tree-asset-container">
          <img
            ref={hideImgIfBroken}
            src={DESKTOP_TREE_SRC}
            alt="The Golden Tree of Business Growth"
            fetchPriority="high"
            className="w-full h-full object-contain filter drop-shadow-[0_10px_35px_rgba(27,42,107,0.35)] transition-all duration-700 group-hover:drop-shadow-[0_15px_50px_rgba(27,42,107,0.5)]"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />

          {desktopNodes.map((node) => (
            <div
              key={node.label}
              className="bbi-tree-node-d absolute group/node z-20"
              style={{ left: `${node.x}%`, top: `${node.y}%`, animationDelay: `${node.d}s` }}
            >
              {node.slug ? (
                <CategoryBadge slug={node.slug} label={node.label} dot />
              ) : (
                <CategoryBadge to={node.path ?? "/browse"} label={node.label} dot />
              )}

              <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 opacity-0 group-hover/node:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap glass rounded-md px-2.5 py-1 text-[10px] font-semibold shadow-xl">
                {fmt(node.count)}
              </div>
            </div>
          ))}
        </div>

        {/* MOBILE TREE ASSET — same cross-origin constraint as desktop, so no
            mask-image here either. Organic floating liquid capsules for the
            node pills below. */}
        <div className="block sm:hidden relative w-full max-w-xs aspect-[9/16] tree-asset-container">
          <img
            ref={hideImgIfBroken}
            src={MOBILE_TREE_SRC}
            alt="The Golden Tree of Business Growth (Mobile)"
            fetchPriority="high"
            className="w-full h-full object-contain filter drop-shadow-[0_8px_25px_rgba(27,42,107,0.35)]"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />

          {/* Nodes sit on the canopy at organic coordinates (not a vertical list). */}
          <div className="absolute inset-0 z-20">
            {[
              {
                label: "Zero Investment",
                slug: "zero-investment-business-ideas",
                x: 30,
                y: 14,
                d: 0,
              },
              {
                label: "Work From Home",
                slug: "work-from-home-business-ideas",
                x: 70,
                y: 24,
                d: 0.8,
              },
              {
                label: "Low Investment",
                slug: "low-investment-business-ideas",
                x: 26,
                y: 36,
                d: 1.6,
              },
              { label: "Side Hustle", slug: "side-hustle-ideas", x: 68, y: 47, d: 2.4 },
              { label: "Validation Center", path: "/browse", x: 48, y: 60, d: 3.2 },
            ].map((mNode) => (
              <div
                key={mNode.label}
                className="bbi-tree-node-m"
                style={{ left: `${mNode.x}%`, top: `${mNode.y}%`, animationDelay: `${mNode.d}s` }}
              >
                {mNode.path ? (
                  <CategoryBadge to={mNode.path} label={mNode.label} size="sm" dot />
                ) : (
                  <CategoryBadge
                    slug={mNode.slug ?? ""}
                    // The count rides inside the pill. It used to live in a
                    // second grid of cards below the artwork that repeated all
                    // four of these labels verbatim — the same topics printed
                    // twice, on the screen with the least room for it.
                    // Desktop shows the count in a hover tooltip; a phone has
                    // no hover, so it belongs here.
                    label={
                      countFor(mNode.slug ?? "") === null
                        ? mNode.label
                        : `${mNode.label} · ${countFor(mNode.slug ?? "")}`
                    }
                    size="sm"
                    dot
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
