import { Link } from "@tanstack/react-router";

import type { IdeaCard as IdeaCardData } from "@/lib/ideas-shared";

const BLOBS = ["blob-sm-1", "blob-sm-2", "blob-sm-3"] as const;

export function IdeaCard({ idea }: { idea: IdeaCardData }) {
  // Organic blob outline, deterministic per idea so neighbouring cards differ.
  const blob =
    BLOBS[
      Math.abs(
        idea.slug.split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7),
      ) % BLOBS.length
    ];
  return (
    <Link
      to="/idea/$slug"
      params={{ slug: idea.slug }}
      className={`glass glass-hover group flex h-full min-w-0 flex-col gap-3 overflow-hidden ${blob} p-5 sm:p-7`}
    >
      <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
        <span className="truncate">{idea.subcategoryName}</span>
        {idea.locked ? (
          <span className="shrink-0 rounded-full bg-gradient-to-r from-primary to-accent px-2 py-0.5 font-semibold text-primary-foreground">
            Pro
          </span>
        ) : idea.trendScore !== null ? (
          <span className="shrink-0 text-accent">Trend {idea.trendScore}</span>
        ) : null}
      </div>
      <h3 className="break-words text-lg font-semibold leading-snug transition-colors duration-300 group-hover:text-accent">
        {idea.title}
      </h3>
      <p className="line-clamp-3 break-words text-sm text-muted-foreground">{idea.summary}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
        {idea.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="max-w-full truncate rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
