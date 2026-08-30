import { Link } from "@tanstack/react-router";

import type { IdeaCard } from "@/lib/ideas-shared";
import { useStaggerReveal } from "@/motion";

/**
 * The demand board.
 *
 * A ranked read of what is actually moving in the library right now, ordered
 * by the live `trend_score` column. Every number on it is a real column value.
 *
 * That last sentence is the whole point of this component, and the reason it
 * is written defensively. PENDING2.md records that a previous "demand chart"
 * on the idea page drew twelve bars from `Math.sin(i * 0.9) * 12 +
 * Math.cos(i * 0.5) * 8` and presented them as market data. It was deleted.
 * Nothing here may ever drift back toward that:
 *
 *   - Bars are scaled against a fixed 100, not against the highest score in
 *     the set. Scaling to the max makes a field of 71-74 look like a landslide
 *     and is the most common honest-looking way to lie with a chart.
 *   - An idea with no score is not given one. It is dropped.
 *   - If nothing in the set has a score, the whole section renders nothing
 *     rather than an empty frame or a placeholder.
 *
 * The homepage's other idea row uses a hand-picked `FEATURED_IDEA_IDS` list,
 * which is an editorial choice and does not move on its own. This one does.
 */
export function DemandBoard({ ideas }: { ideas: IdeaCard[] }) {
  const ref = useStaggerReveal<HTMLOListElement>({ selector: "li", stagger: 0.06, distance: 14 });

  const scored = ideas
    .filter((i): i is IdeaCard & { trendScore: number } => typeof i.trendScore === "number")
    // Sorted here as well as in the query. The rows are NUMBERED, so the
    // ranking is a claim this component makes -- and a claim a component makes
    // has to be enforced by the component, not assumed from its caller. Caught
    // in testing: the rows arrived 81, 90, 94, 63, 56, 73 while being labelled
    // 01 through 06.
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, 6);

  // No scores, no section. An empty board is worse than no board.
  if (scored.length === 0) return null;

  return (
    <section
      id="demand"
      data-anchor="demand"
      data-anchor-label="What's moving"
      className="mx-auto mt-16 max-w-6xl px-3 sm:px-4"
    >
      <div className="glass bbi-shape-soft-deep p-5 sm:p-9">
        <p className="t-eyebrow hl-teal">What&apos;s moving right now</p>
        <h2 className="mt-3">The ideas with the strongest demand signal today.</h2>
        <p className="t-lead mt-4 max-w-2xl">
          Not a hand-picked list. This is the library ordered by its own demand score, so it moves
          when the data moves. Every bar below is that score out of 100 — nothing here is drawn to
          look good.
        </p>

        <ol ref={ref} className="mt-7 space-y-2.5">
          {scored.map((idea, i) => (
            <li key={idea.ideaId}>
              <Link
                to="/idea/$slug"
                params={{ slug: idea.slug }}
                className="mo-card glass-hover group block rounded-2xl border border-border/60 p-4 sm:p-5"
              >
                <div className="flex items-baseline gap-3">
                  <span className="t-meta w-6 shrink-0 tabular-nums text-hl-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="t-card min-w-0 flex-1">{idea.title}</h3>
                  <span className="t-meta shrink-0 tabular-nums text-hl-teal">
                    {idea.trendScore}
                    <span className="opacity-55">/100</span>
                  </span>
                </div>

                {/* Scaled against a fixed 100, never against the set's own
                    maximum. `aria-hidden` because the number beside it already
                    says the same thing to a screen reader. */}
                <div
                  aria-hidden
                  className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
                  style={{ marginLeft: "2.25rem" }}
                >
                  <div
                    className="h-full rounded-full bg-hl-teal transition-[width] duration-700 ease-out"
                    style={{ width: `${Math.max(2, Math.min(100, idea.trendScore))}%` }}
                  />
                </div>

                {/* Category only. `subcategoryName` is byte-identical to
                    `title` in this database -- PENDING2.md records that the
                    "290 subcategories" figure was the idea count relabelled --
                    so printing it here just repeats the heading verbatim. */}
                <p className="t-meta mt-2.5 pl-9">{idea.categoryName}</p>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
