import { ArrowDown, ArrowUpRight, AudioLines, Sun, type LucideIcon } from "lucide-react";
import ShareLinks from "@/components/effects/share-links";
import type { IdeaDetail } from "@/lib/ideas-shared";
import { absoluteUrl } from "@/lib/schema";

/** Presentation only. Keep the experiment allowlist at the route boundary. */
export function TrialIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="bbi-noir-icon" aria-hidden="true">
      <Icon size={22} strokeWidth={1.6} />
    </span>
  );
}

export function IdeaTrialHero({ idea }: { idea: IdeaDetail }) {
  const score = idea.trendScore === null ? null : Math.max(0, Math.min(100, idea.trendScore));
  const Icon = idea.slug === "solar-fencing-business-for-farms" ? Sun : AudioLines;
  // Keep every word of the existing overview, with the first sentence upfront.
  const sentenceEnd = idea.businessDescription.search(/[.!?]\s/);
  const lead =
    sentenceEnd < 0 ? idea.businessDescription : idea.businessDescription.slice(0, sentenceEnd + 1);
  const rest = sentenceEnd < 0 ? "" : idea.businessDescription.slice(sentenceEnd + 2);

  return (
    <section className="bbi-noir-hero" data-anchor="top" data-anchor-label="Top">
      <div className="bbi-noir-hero-copy">
        <div className="bbi-noir-eyebrow">
          <span className="bbi-noir-dot" /> Business blueprint{" "}
          <span className="bbi-noir-id">{idea.ideaId}</span>
        </div>
        <p className="bbi-noir-category">{idea.categoryName}</p>
        <h1>{idea.title}</h1>
        <p className="bbi-noir-lead">{lead}</p>
        <div className="bbi-noir-actions">
          <a href="#blueprint" className="bbi-noir-cta">
            Explore the blueprint <ArrowDown size={17} aria-hidden="true" />
          </a>
          <a href="#validate" className="bbi-noir-text-link">
            Validate this idea <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="bbi-noir-hero-visual">
        <div className="bbi-noir-orb" aria-hidden="true" />
        <div className="bbi-noir-signal-card">
          <div className="bbi-noir-signal-top">
            <TrialIcon icon={Icon} />
            <span>THE DEMAND SIGNAL</span>
          </div>
          <div className="bbi-noir-score">
            <svg viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="100" cy="100" r="85" className="bbi-noir-ring-track" />
              {score !== null && (
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  className="bbi-noir-ring-value"
                  pathLength="100"
                  strokeDasharray={`${score} 100`}
                />
              )}
            </svg>
            <div>
              <strong>{score ?? "—"}</strong>
              <span>{score === null ? "Score unavailable" : "Momentum / 100"}</span>
            </div>
          </div>
          <p>
            {score === null
              ? "Demand research is still in progress."
              : score >= 85
                ? "Strong momentum"
                : score >= 70
                  ? "Steady demand"
                  : "Niche, but real"}
          </p>
          <span className="bbi-noir-signal-note">
            {score === null
              ? "Explore the research below."
              : "A snapshot of demand. Not a forecast of earnings."}
          </span>
        </div>
        <span className="bbi-noir-visual-caption">RESEARCH IT. MAKE IT YOURS.</span>
      </div>
      <div className="bbi-noir-hero-foot">
        {rest ? (
          <details className="bbi-noir-overview">
            <summary>Read the full overview</summary>
            <p>{rest}</p>
          </details>
        ) : (
          <span className="bbi-noir-category">{idea.subcategoryName}</span>
        )}
        <ShareLinks url={absoluteUrl(`/idea/${idea.slug}`)} title={idea.title} />
      </div>
    </section>
  );
}
