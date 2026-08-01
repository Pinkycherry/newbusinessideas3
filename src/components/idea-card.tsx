import { Link } from "@tanstack/react-router";

import type { IdeaCard as IdeaCardData } from "@/lib/ideas-shared";

export function IdeaCard({ idea }: { idea: IdeaCardData }) {
  return (
    <Link
      to="/idea/$slug"
      params={{ slug: idea.slug }}
      className="group flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
    >
      <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
        <span>{idea.subcategoryName}</span>
        {idea.locked ? (
          <span className="rounded-sm bg-primary px-1.5 py-0.5 font-semibold text-primary-foreground">
            Pro
          </span>
        ) : idea.trendScore !== null ? (
          <span className="text-accent">Trend {idea.trendScore}</span>
        ) : null}
      </div>
      <h3 className="text-lg font-semibold leading-snug group-hover:text-primary">{idea.title}</h3>
      <p className="line-clamp-3 text-sm text-muted-foreground">{idea.summary}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
        {idea.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-sm border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}