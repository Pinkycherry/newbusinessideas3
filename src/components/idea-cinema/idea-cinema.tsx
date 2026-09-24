import { Link } from "@tanstack/react-router";
import { Check, Link2, Linkedin, Twitter } from "lucide-react";
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { AdSlot } from "@/components/AdSlot";
import { InternalLinkLine, IdeaSignature, LockedBody } from "@/components/idea-blocks";
import { ValidateButton } from "@/components/validate-button";
import type { RelatedCategory } from "@/lib/ideas.functions";
import type { IdeaCard, IdeaDetail, InternalLink } from "@/lib/ideas-shared";
import { splitSentences, toParagraphs } from "@/lib/prose";
import { absoluteUrl } from "@/lib/schema";

import { CinemaContents, useTrackSections, type CinemaSection } from "./cinema-contents";
import { CinemaIcon, type CinemaIconName } from "./cinema-icons";
import { useCinemaStage } from "./use-cinema-stage";
import "./cinema.css";

/**
 * The shared idea-page presentation. The route supplies the existing data;
 * this component changes only how the research is arranged and read.
 *
 * Same content, links, ads, lock state and disabled features as the standard
 * template. Round two (2026-09-24, afternoon) reorders it so the page reads
 * as one argument that concludes before the library starts:
 *
 *   hero (what it is, who it helps, the next action) -> breakdown ->
 *   blueprint -> verdict -> costs -> playbooks -> questions -> validate ->
 *   keep exploring -> free tools
 *
 * - One list of destinations (`sections`) feeds both contents controls.
 * - One motion owner (`useCinemaStage`), CSS owns every transition, no
 *   scroll listener. Page-specific styles live in ./cinema.css, all scoped
 *   under `.cm-page`.
 * - Nothing on this page states a number the data does not hold. The
 *   numbers section renames itself when the row has no figures, and the
 *   demand score says what it is.
 */

export type CinemaContextualLink = {
  key: string;
  label: string;
  to: string;
  params: Record<string, string>;
};

type Props = {
  idea: IdeaDetail;
  related: IdeaCard[];
  trending: IdeaCard[];
  relatedCategories: RelatedCategory[];
  contextualLinks: CinemaContextualLink[];
};

const TRENDING_SHOWN = 3;

/** Section heading with an original, semantic mark; text carries its meaning. */
function CineHead({
  eyebrow,
  icon,
  children,
}: {
  eyebrow?: string;
  icon: CinemaIconName;
  children: ReactNode;
}) {
  return (
    <div className="cm-head">
      <span className="cm-head-icon" aria-hidden="true">
        <CinemaIcon name={icon} size={24} />
      </span>
      <div className="min-w-0">
        {eyebrow && <p className="cm-eyebrow">{eyebrow}</p>}
        {/* `text-xl` states the heading's size, which exempts it from the
            site's mobile rule that inflates unsized h2s (styles.css); the
            actual size is set in the trial stylesheet. */}
        <h2 className="text-xl">{children}</h2>
      </div>
    </div>
  );
}

/** A sub-heading inside a section (h3). */
function CineSubHead({ icon, children }: { icon: CinemaIconName; children: ReactNode }) {
  return (
    <div className="cm-subhead">
      <span className="cm-subhead-icon" aria-hidden="true">
        <CinemaIcon name={icon} size={20} />
      </span>
      <h3>{children}</h3>
    </div>
  );
}

/** Shorter reading measures, without changing any research words or punctuation. */
function readingParagraphs(text: string | null | undefined): string[] {
  const authored = (text ?? "")
    .trim()
    .split(/\n\s*\n+/)
    .filter(Boolean);
  if (authored.length > 1) return authored;

  return toParagraphs(text).flatMap((paragraph) => {
    const result: string[] = [];
    let pending: string[] = [];
    let words = 0;
    for (const sentence of splitSentences(paragraph)) {
      const nextWords = sentence.split(/\s+/).length;
      // Break nearest 90 words, always at a complete sentence. A single long
      // sentence remains intact, and a short final paragraph stays readable.
      if (words >= 60 && words + nextWords > 100) {
        result.push(pending.join(" "));
        pending = [];
        words = 0;
      }
      pending.push(sentence);
      words += nextWords;
      if (words >= 90) {
        result.push(pending.join(" "));
        pending = [];
        words = 0;
      }
    }
    if (pending.length > 0) result.push(pending.join(" "));
    return result;
  });
}

function CineParagraphs({
  text,
  className,
}: {
  text: string | null | undefined;
  className?: string;
}) {
  return (
    <>
      {readingParagraphs(text).map((paragraph, index) => (
        <p key={`${index}-${paragraph.slice(0, 48)}`} className={className}>
          {paragraph}
        </p>
      ))}
    </>
  );
}

/**
 * "Quiet Path". The full hierarchy is always in the markup; on a phone the
 * middle of it folds behind one button so the headline starts higher.
 */
function CinemaCrumbs({ idea }: { idea: IdeaDetail }) {
  const [open, setOpen] = useState(false);
  return (
    <nav aria-label="Breadcrumb" className="cm-crumbs" data-open={open || undefined}>
      <ol>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li className="cm-crumbs-more">
          <button
            type="button"
            className="bbi-bare"
            aria-expanded={open}
            aria-label={open ? "Hide the full breadcrumb path" : "Show the full breadcrumb path"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true">…</span>
          </button>
        </li>
        <li className="cm-crumbs-mid">
          <Link to="/browse">Browse</Link>
        </li>
        <li>
          <Link to="/category/$categorySlug" params={{ categorySlug: idea.categorySlug }}>
            {idea.categoryName}
          </Link>
        </li>
        <li className="cm-crumbs-mid cm-crumbs-last">
          <Link
            to="/category/$categorySlug/$subcategorySlug"
            params={{ categorySlug: idea.categorySlug, subcategorySlug: idea.subcategorySlug }}
          >
            {idea.subcategoryName}
          </Link>
        </li>
      </ol>
    </nav>
  );
}

/**
 * "Utility Reveal" share control. The actions open as a small popover under
 * the button, so opening it never pushes the page down. While closed they are
 * `hidden`: neither visible nor focusable.
 */
function CinemaShare({ url, title }: { url: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fanId = useId();
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const copy = () => {
    void navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <div
      ref={rootRef}
      className="cm-share"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className="cm-btn cm-btn-ghost bbi-bare"
        aria-expanded={open}
        aria-controls={fanId}
        onClick={() => setOpen((v) => !v)}
      >
        <Link2 aria-hidden className="h-4 w-4" />
        Share
      </button>
      <div id={fanId} className="cm-share-fan" hidden={!open}>
        <a
          href={`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          className="cm-icon-btn"
        >
          <Twitter aria-hidden className="h-4 w-4" />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className="cm-icon-btn"
        >
          <Linkedin aria-hidden className="h-4 w-4" />
        </a>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Link copied" : "Copy link"}
          className="cm-icon-btn cm-copy bbi-bare"
          data-copied={copied || undefined}
        >
          <Link2 aria-hidden className="cm-copy-idle h-4 w-4" />
          <Check aria-hidden className="cm-copy-done h-4 w-4" />
        </button>
        <span className="sr-only" role="status">
          {copied ? "Link copied" : ""}
        </span>
      </div>
    </div>
  );
}

function formatDay(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  // UTC so the server and the browser print the same day.
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * "Signal Lock". The real `trend_score`, one gauge, and what the number is:
 * the research pipeline assigns it when a blueprint is written (PIPELINE.md,
 * "SCORING"). It is not measured search volume or a time series, so the page
 * says so and links to how scores should be read.
 */
function DemandSignal({ score, scoredOn }: { score: number | null; scoredOn: string | null }) {
  if (score === null) {
    return (
      <section className="cm-signal" aria-labelledby="cm-demand-h">
        <h2 id="cm-demand-h" className="cm-signal-label text-xs">
          Demand score
        </h2>
        <p className="cm-signal-note">This blueprint has no demand score yet.</p>
      </section>
    );
  }
  const pct = Math.max(0, Math.min(100, score));
  const band = pct >= 85 ? "Strong momentum" : pct >= 70 ? "Steady demand" : "Niche, but real";
  return (
    <section className="cm-signal" aria-labelledby="cm-demand-h">
      <div className="cm-signal-top">
        <h2 id="cm-demand-h" className="cm-signal-label text-xs">
          Demand score
        </h2>
        <p className="cm-signal-value">
          <strong>{pct}</strong>
          <span>/ 100</span>
        </p>
      </div>
      <div
        className="cm-gauge"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`Demand score, ${band.toLowerCase()}`}
      >
        <span className="cm-gauge-fill" style={{ "--v": pct / 100 } as CSSProperties} />
      </div>
      <p className="cm-signal-note">
        <strong>{band}.</strong> An internal editorial score from BBI&apos;s research pipeline
        {scoredOn ? `, set when this blueprint was published on ${scoredOn}` : ""}. It is a
        judgement of demand, not measured search volume, sales data or a growth trend.{" "}
        <Link to="/disclaimer" className="cm-inline">
          How to read scores
        </Link>
      </p>
    </section>
  );
}

function FaqList({ items }: { items: IdeaDetail["faq"] }) {
  return (
    <div className="cm-faq">
      {items.map((item) => (
        <details key={item.q} className="cm-faq-item">
          <summary>
            <span className="cm-faq-q">{item.q}</span>
            <span className="cm-faq-mark" aria-hidden="true" />
          </summary>
          <div className="cm-faq-a">
            <CineParagraphs text={item.a} />
          </div>
        </details>
      ))}
    </div>
  );
}

/** "Editorial Lift" row: real title and link; edge and arrow respond. */
function DeckCard({ card, meta }: { card: IdeaCard; meta: string }) {
  return (
    <Link to="/idea/$slug" params={{ slug: card.slug }} className="cm-deck-card">
      <span className="cm-deck-meta">
        <span className="cm-deck-cat">{meta}</span>
        {card.trendScore !== null && <span className="cm-deck-trend">Score {card.trendScore}</span>}
      </span>
      <span className="cm-deck-title">{card.title}</span>
      <CinemaIcon name="arrow" size={18} className="cm-arrow" />
    </Link>
  );
}

/** Split a "Name - what it does" tool line into its two parts, if it has them. */
function splitTool(tool: string): [string, string | null] {
  const at = tool.indexOf(" - ");
  return at > 0 ? [tool.slice(0, at), tool.slice(at + 3)] : [tool, null];
}

/**
 * The header's contents control is mounted into the sticky header after
 * hydration, next to the menu button, so on a phone there is one compact
 * control in reserved space instead of floating circles over the article.
 */
function useHeaderSlot() {
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(".cm-page > header .glass-nav");
    if (!bar) return;
    const el = document.createElement("div");
    el.className = "cm-header-slot";
    const menuButton = bar.querySelector('button[aria-label="Open navigation menu"]');
    bar.insertBefore(el, menuButton);
    setSlot(el);
    return () => {
      el.remove();
      setSlot(null);
    };
  }, []);
  return slot;
}

export function IdeaCinemaPage({
  idea,
  related,
  trending,
  relatedCategories,
  contextualLinks,
}: Props) {
  const stageRef = useCinemaStage<HTMLDivElement>();
  const headerSlot = useHeaderSlot();
  const [subcategoryLink, categoryLink, matchedIdeaLink] = contextualLinks;
  const linkFor = (position: InternalLink["position"]) =>
    idea.internalLinkAnchors.find((l) => l.position === position);

  // Every word of the existing overview: the first sentence up front, the rest
  // behind the "Dossier Expand" disclosure.
  const sentenceEnd = idea.businessDescription.search(/[.!?]\s/);
  const lead =
    sentenceEnd < 0 ? idea.businessDescription : idea.businessDescription.slice(0, sentenceEnd + 1);
  const rest = sentenceEnd < 0 ? "" : idea.businessDescription.slice(sentenceEnd + 2);

  const faqAbove = idea.faq.slice(0, 5);
  const faqBelow = idea.faq.slice(5, 10);
  const hasPlaybooks =
    idea.gettingStartedSteps.length > 0 ||
    idea.toolsNeeded.length > 0 ||
    Boolean(idea.timeToFirstCustomer);
  const hasMoney = Boolean(idea.startupCost || idea.incomePotential);
  // The heading promises numbers only when the row actually holds some.
  const hasFigures = /\d/.test(`${idea.startupCost ?? ""} ${idea.incomePotential ?? ""}`);
  const moneyTitle = hasFigures ? "Real numbers" : "Costs and earning model";
  const hasExplore =
    Boolean(subcategoryLink) ||
    related.length > 0 ||
    trending.length > 0 ||
    relatedCategories.length > 0;

  const blueprint = (
    [
      { title: "The opportunity", body: idea.marketOpportunity, icon: "opportunity" },
      { title: "Who actually pays you", body: idea.targetCustomer, icon: "customer" },
      { title: "How the money works", body: idea.howYouMakeMoney, icon: "revenue" },
      { title: "Your edge", body: idea.competitionEdge, icon: "edge" },
    ] as const
  ).filter((entry): entry is typeof entry & { body: string } => Boolean(entry.body));
  const hasVerdict = idea.pros.length > 0 || idea.cons.length > 0 || Boolean(idea.verdict);

  // The one list every section control reads.
  const sections: CinemaSection[] = [
    { id: "breakdown", label: "Breakdown" },
    { id: "blueprint", label: "Blueprint" },
    ...(hasVerdict ? [{ id: "verdict", label: "Verdict" }] : []),
    { id: "numbers", label: hasFigures ? "Real numbers" : "Costs and earnings" },
    ...(hasPlaybooks ? [{ id: "playbooks", label: "Playbooks" }] : []),
    ...(faqAbove.length > 0 ? [{ id: "questions", label: "Questions" }] : []),
    { id: "validate", label: "Validate" },
    ...(hasExplore ? [{ id: "explore", label: "Keep exploring" }] : []),
    { id: "resources", label: "Free tools" },
  ];
  useTrackSections(sections);

  const ideaUrl = absoluteUrl(`/idea/${idea.slug}`);
  const scoredOn = formatDay(idea.createdAt);

  return (
    <div ref={stageRef} className="cm-frame">
      {headerSlot &&
        createPortal(<CinemaContents sections={sections} variant="header" />, headerSlot)}

      <CinemaCrumbs idea={idea} />

      {/* Hero: first the business, who it helps and the next action; the
          score, metadata and page contents come after. */}
      <header id="top" className="cm-hero">
        <div className="cm-hero-grid">
          <div className="cm-hero-copy">
            <p className="cm-kicker">Business idea · {idea.categoryName}</p>
            <h1 className="cm-h1">{idea.title}</h1>
            <p className="cm-lead">{lead}</p>
            <div className="cm-actions">
              <a href="#blueprint" className="cm-btn cm-btn-primary">
                <span>Explore the blueprint</span>
                <CinemaIcon name="arrow" size={18} className="cm-arrow cm-arrow-down" />
              </a>
              <a href="#validate" className="cm-trace-link">
                Validate this idea
                <CinemaIcon name="arrow" size={16} className="cm-arrow" />
              </a>
              <CinemaShare url={ideaUrl} title={idea.title} />
            </div>
            {rest && (
              <details className="cm-dossier">
                <summary>
                  <span className="cm-dossier-label">Read the full overview</span>
                  <span className="cm-faq-mark" aria-hidden="true" />
                </summary>
                <div className="cm-dossier-body">
                  <CineParagraphs text={rest} />
                </div>
              </details>
            )}
          </div>
          <div className="cm-hero-aside">
            <DemandSignal score={idea.trendScore} scoredOn={scoredOn} />
            <div className="cm-hero-meta">
              <span className="cm-hero-id">{idea.ideaId}</span>
              <CinemaContents sections={sections} variant="hero" />
            </div>
            {idea.keywords.length > 0 && (
              <p className="cm-keywords">
                <span className="cm-keywords-label">Keywords:</span>{" "}
                {idea.keywords.slice(0, 3).join(", ")}
              </p>
            )}
          </div>
        </div>
      </header>

      <section id="breakdown" className="cm-open-edge cm-section" data-reveal="wipe">
        <CineHead icon="journal">The breakdown</CineHead>
        <div className="cm-prose cm-measure">
          <CineParagraphs text={idea.summary} />
        </div>
        <InternalLinkLine
          link={linkFor("breakdown")}
          className="cm-prose cm-measure cm-link-line"
        />
      </section>

      <section id="blueprint" className="cm-section">
        <CineHead eyebrow="Premium research" icon="guide">
          The Blueprint
        </CineHead>
        <LockedBody>
          {blueprint.length > 0 && (
            <div className="cm-blueprint" data-reveal="stagger">
              {blueprint.map((item, i) => (
                <article
                  key={item.title}
                  className={`cm-card cm-blueprint-panel cm-blueprint-${item.icon} ${
                    i === 0 ? "cm-stepped cm-blueprint-lead" : "cm-open-edge"
                  }`}
                  style={{ "--i": i } as CSSProperties}
                >
                  <div className="cm-panel-heading">
                    <span className="cm-panel-index" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <CineSubHead icon={item.icon}>{item.title}</CineSubHead>
                  </div>
                  <div className="cm-prose">
                    <CineParagraphs text={item.body} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </LockedBody>
      </section>

      {hasVerdict && (
        <section id="verdict" className="cm-section" aria-labelledby="cm-verdict-h">
          <h2 id="cm-verdict-h" className="sr-only">
            Why it works, what will hurt, and the verdict
          </h2>
          <LockedBody>
            <div className="cm-oppose" data-reveal="oppose">
              <div className="cm-side cm-side-pro">
                <CineSubHead icon="strength">Why it works</CineSubHead>
                <ul>
                  {idea.pros.map((pro) => (
                    <li key={pro}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div className="cm-side cm-side-con">
                <CineSubHead icon="risk">What will hurt</CineSubHead>
                <ul>
                  {idea.cons.map((con) => (
                    <li key={con}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
            {idea.verdict && (
              <div className="cm-verdict" data-reveal="impact">
                <CineSubHead icon="verdict">Verdict</CineSubHead>
                <CineParagraphs text={idea.verdict} />
              </div>
            )}
          </LockedBody>
        </section>
      )}

      <div className="cm-ad">
        <AdSlot position="idea-detail-between-proscons-verdict" size="banner" />
      </div>

      <section id="numbers" className="cm-section">
        <CineHead eyebrow="Premium research" icon="calculator">
          {moneyTitle}
        </CineHead>
        <LockedBody>
          {hasMoney ? (
            <div
              className={`cm-ledger${idea.startupCost && idea.incomePotential ? "" : " is-single"}`}
              data-reveal="ledger"
            >
              {idea.startupCost && (
                <div className="cm-ledger-side cm-ledger-cost">
                  <div className="cm-ledger-rail">
                    <CineSubHead icon="cost">
                      {hasFigures ? "What it costs to start" : "Startup inputs"}
                    </CineSubHead>
                  </div>
                  <CineParagraphs text={idea.startupCost} className="cm-ledger-prose" />
                </div>
              )}
              <span className="cm-ledger-axis" aria-hidden="true" />
              {idea.incomePotential && (
                <div className="cm-ledger-side cm-ledger-income">
                  <div className="cm-ledger-rail">
                    <CineSubHead icon="income">
                      {hasFigures ? "What you can earn" : "Revenue model and capacity"}
                    </CineSubHead>
                  </div>
                  <CineParagraphs text={idea.incomePotential} className="cm-ledger-prose" />
                </div>
              )}
              <p className="cm-ledger-note">
                {hasFigures
                  ? "Figures are quoted from the sources listed under Useful resources on this page. Check them against current local prices before you rely on them."
                  : "No sourced cost or earnings figures exist for this idea yet, so none are shown. Nothing here is an estimate."}
              </p>
            </div>
          ) : (
            <p className="cm-prose">
              The costs and earnings research for this idea is still in progress.
            </p>
          )}
        </LockedBody>
      </section>

      {hasPlaybooks && (
        <section id="playbooks" className="cm-section">
          <CineHead eyebrow="Premium research" icon="launch">
            Tactical Playbooks
          </CineHead>
          <LockedBody>
            <div
              className={`cm-playbook${idea.gettingStartedSteps.length > 0 ? "" : " is-single"}`}
            >
              {idea.gettingStartedSteps.length > 0 && (
                <div className="cm-mission" data-reveal="rise">
                  <CineSubHead icon="launch">How to start</CineSubHead>
                  <div className="cm-mission-track">
                    <ol className="cm-ribbons">
                      {idea.gettingStartedSteps.map((step, i) => (
                        <li key={step} className="cm-ribbon">
                          <span className="cm-ribbon-idx" aria-hidden="true">
                            {i + 1}
                          </span>
                          <div className="cm-ribbon-copy">
                            <CineParagraphs text={step} />
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
              {(idea.toolsNeeded.length > 0 || idea.timeToFirstCustomer) && (
                <div className="cm-playbook-side">
                  {idea.toolsNeeded.length > 0 && (
                    <div className="cm-dock" data-reveal="rise">
                      <CineSubHead icon="tools">What you need</CineSubHead>
                      <ul className="cm-tools">
                        {idea.toolsNeeded.map((tool) => {
                          const [name, use] = splitTool(tool);
                          return (
                            <li key={tool} className="cm-tool">
                              <span className="cm-tool-name">{name}</span>
                              {use && <span className="cm-tool-use">{use}</span>}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  {idea.timeToFirstCustomer && (
                    <div className="cm-timeline" data-reveal="lock">
                      <CineSubHead icon="timeline">Time to first customer</CineSubHead>
                      <CineParagraphs
                        text={idea.timeToFirstCustomer}
                        className="whitespace-pre-line"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </LockedBody>
        </section>
      )}

      {/* Outside the locked sections on purpose, as in the standard template. */}
      <InternalLinkLine link={linkFor("playbooks")} className="cm-prose cm-measure cm-aside-line" />

      {faqAbove.length > 0 && (
        <section id="questions" className="cm-section" data-reveal="rise">
          <CineHead icon="glossary">Questions people ask</CineHead>
          <FaqList items={faqAbove} />
          {faqBelow.length > 0 && (
            <div className="cm-faq-more">
              <FaqList items={faqBelow} />
            </div>
          )}
        </section>
      )}

      {idea.externalLinks.length > 0 && (
        <section className="cm-section" data-reveal="rise">
          <CineHead icon="tools">Useful resources</CineHead>
          <ul className="cm-sources">
            {idea.externalLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="nofollow noopener"
                  className="cm-source cm-trace"
                >
                  <span>{link.label}</span>
                  <CinemaIcon name="arrow" size={16} className="cm-arrow cm-arrow-out" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {idea.tags.length > 0 && (
        <ul className="cm-capsules cm-section-tight" aria-label="Tags">
          {idea.tags.map((tag) => (
            <li key={tag} className="cm-capsule">
              {tag}
            </li>
          ))}
        </ul>
      )}

      <InternalLinkLine link={linkFor("closing")} className="cm-prose cm-measure cm-aside-line" />

      <div className="cm-ad">
        <AdSlot position="idea-detail-below-verdict" size="banner" />
      </div>

      {/* The page's conclusion, before the library: the existing validate
          flow, same controls, same disabled and sign-in behaviour. */}
      <section id="validate" className="cm-console cm-section" data-reveal="rise">
        <CineHead icon="verdict">Run it before you commit</CineHead>
        <p className="cm-console-sub">Free, on your own account, as many times as you want.</p>
        <ValidateButton slug={idea.slug} cinema />
        <Link to="/browse" className="cm-trace-link cm-console-browse">
          Browse more blueprints
          <CinemaIcon name="arrow" size={16} className="cm-arrow" />
        </Link>
      </section>

      <IdeaSignature className="cm-signature" />

      <div className="cm-ad">
        <AdSlot position="idea-detail-above-related" size="banner" />
      </div>

      {hasExplore && (
        <section id="explore" className="cm-section cm-explore" data-reveal="rise">
          <CineHead icon="opportunity">Keep exploring</CineHead>
          {subcategoryLink && (
            <p className="cm-prose cm-measure">
              This blueprint sits inside{" "}
              <Link
                to={subcategoryLink.to}
                params={subcategoryLink.params as never}
                className="cm-inline"
              >
                {subcategoryLink.label}
              </Link>
              {categoryLink && (
                <>
                  , part of the wider{" "}
                  <Link
                    to={categoryLink.to}
                    params={categoryLink.params as never}
                    className="cm-inline"
                  >
                    {categoryLink.label}
                  </Link>{" "}
                  lineup
                </>
              )}
              {matchedIdeaLink && (
                <>
                  . If it resonates,{" "}
                  <Link
                    to={matchedIdeaLink.to}
                    params={matchedIdeaLink.params as never}
                    className="cm-inline"
                  >
                    {matchedIdeaLink.label}
                  </Link>{" "}
                  explores a nearby angle worth a look
                </>
              )}
              .
            </p>
          )}

          {related.length > 0 && (
            <>
              <h3 className="cm-deck-heading">More in {idea.categoryName}</h3>
              <ul className="cm-deck">
                {related.map((r) => (
                  <li key={r.ideaId}>
                    <DeckCard card={r} meta={r.subcategoryName} />
                  </li>
                ))}
              </ul>
            </>
          )}

          {trending.length > 0 && (
            <>
              <h3 className="cm-deck-heading">Trending across the library</h3>
              <ul className="cm-deck">
                {trending.slice(0, TRENDING_SHOWN).map((t) => (
                  <li key={t.ideaId}>
                    <DeckCard card={t} meta={t.categoryName} />
                  </li>
                ))}
              </ul>
              {trending.length > TRENDING_SHOWN && (
                <details className="cm-more">
                  <summary>
                    Show {trending.length - TRENDING_SHOWN} more trending ideas
                    <span className="cm-faq-mark" aria-hidden="true" />
                  </summary>
                  <ul className="cm-deck">
                    {trending.slice(TRENDING_SHOWN).map((t) => (
                      <li key={t.ideaId}>
                        <DeckCard card={t} meta={t.categoryName} />
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </>
          )}

          {relatedCategories.length > 0 && (
            <>
              <h3 className="cm-deck-heading">Other categories worth a look</h3>
              <ul className="cm-capsules">
                {relatedCategories.map((c) => (
                  <li key={c.categorySlug}>
                    <Link
                      to="/category/$categorySlug"
                      params={{ categorySlug: c.categorySlug }}
                      className="cm-capsule cm-capsule-link"
                    >
                      <span>{c.categoryName}</span>
                      <span className="cm-capsule-count">{c.ideaCount}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      {/* The standard template's sidebar ad slot. It renders nothing until ad
          code is configured, exactly as there. */}
      <AdSlot position="idea-detail-right-affiliate" size="rectangle" />
    </div>
  );
}
