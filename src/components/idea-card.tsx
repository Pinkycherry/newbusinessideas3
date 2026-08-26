import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";

import type { IdeaCard as IdeaCardData } from "@/lib/ideas-shared";
import { useAuth } from "@/hooks/use-auth";

const BLOBS = ["blob-sm-1", "blob-sm-2", "blob-sm-3"] as const;

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
  const auth = useAuth();
  // PROJECT_BRIEF.md Section 3.2 — idea content is blurred for anonymous
  // visitors; the browse/category page shell around it stays fully visible.
  // While the session is still resolving (auth.status === "loading"), we do
  // NOT know yet whether the visitor is signed in — treat that brief window
  // as unlocked-neutral rather than locked, so an already-logged-in user
  // never sees a flash of the "Sign in to view" overlay. Only the definitive
  // "anonymous" status renders the locked treatment.
  const locked = auth.status === "anonymous";

  // Organic blob outline, deterministic per idea so neighbouring cards differ.
  const blob =
    BLOBS[
      Math.abs(idea.slug.split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7)) %
        BLOBS.length
    ];
  return (
    <Link
      to="/idea/$slug"
      params={{ slug: idea.slug }}
      className={`glass glass-hover mo-card group relative flex h-full min-w-0 flex-col overflow-hidden ${blob} p-4 sm:p-5 ${
        featured ? "sm:col-span-2" : ""
      }`}
    >
      <div
        className={`flex h-full flex-col gap-2.5 ${locked ? "pointer-events-none select-none blur-sm" : ""}`}
      >
        <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
          <span className="truncate">{idea.subcategoryName}</span>
          {idea.trendScore !== null && (
            <span className="shrink-0 text-accent">Trend {idea.trendScore}</span>
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
      {locked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-background/45">
          <Lock className="h-4 w-4 text-accent" aria-hidden />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground">
            Sign in to view
          </span>
        </div>
      )}
    </Link>
  );
}
