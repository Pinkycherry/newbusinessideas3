import { Link } from "@tanstack/react-router";

import CardSpotlight from "@/components/aceternity/card-spotlight";

import type { IdeaCard as IdeaCardData } from "@/lib/ideas-shared";

export function IdeaCard({
  idea,
  featured = false,
}: {
  idea: IdeaCardData;
  /** Section 12.7 — no repetitive same-size card walls. Pass true for exactly
   * ONE card per grid: the highest trend-scored idea in the set, which the
   * listing loaders already sort to the front. It spans 2 grid columns and
   * gets larger type, a longer summary and more tags, so a long grid reads as
   * ranked rather than as a uniform tile wall. This used to fire on every
   * seventh index, which scattered wide tiles through the grid at random —
   * that broke left-to-right comparison without telling the reader anything,
   * so the emphasis is now earned by real data or not given at all. */
  featured?: boolean;
}) {
  // PROJECT_BRIEF.md Section 3.2, as rewritten on 2026-09-21: an anonymous
  // visitor sees every page type in full. Nothing blurred, nothing locked.
  // This card used to cover itself with a "Sign in to view" overlay for
  // anonymous visitors, which contradicted that on every browse, category,
  // search and related rail on the site — and sat directly under copy
  // promising the library is free to read. The overlay, its Lock icon and the
  // useAuth call that drove them are all gone; the card no longer needs to
  // know who is looking at it.

  return (
    <CardSpotlight className={`mo-card h-full ${featured ? "sm:col-span-2" : ""}`}>
      <Link
        to="/idea/$slug"
        params={{ slug: idea.slug }}
        className="group relative flex h-full min-w-0 flex-col p-4 sm:p-5"
      >
        <div className="flex h-full flex-col gap-2.5">
          <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="truncate">{idea.subcategoryName}</span>
            {idea.trendScore !== null && (
              <span className="shrink-0 tabular-nums text-hl-teal">Trend {idea.trendScore}</span>
            )}
          </div>
          <h3
            className={`break-words font-semibold leading-snug transition-colors duration-300 group-hover:text-accent ${
              featured ? "text-2xl" : "text-lg"
            }`}
          >
            {idea.title}
          </h3>
          <p
            className={`break-words text-sm text-muted-foreground ${
              featured ? "line-clamp-4" : "line-clamp-3"
            }`}
          >
            {idea.summary}
          </p>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {idea.tags.slice(0, featured ? 5 : 3).map((tag) => (
              <span
                key={tag}
                className="max-w-full truncate rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </CardSpotlight>
  );
}
