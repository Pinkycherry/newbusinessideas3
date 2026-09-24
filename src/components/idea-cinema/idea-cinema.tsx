import { Link } from "@tanstack/react-router";
import { Check, Link2, Linkedin, Twitter } from "lucide-react";
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { AdSlot } from "@/components/AdSlot";
import { InternalLinkLine, IdeaSignature, LockedBody } from "@/components/idea-blocks";
import { Breadcrumbs } from "@/components/site-shell";
import { ValidateButton } from "@/components/validate-button";
import type { RelatedCategory } from "@/lib/ideas.functions";
import type { IdeaCard, IdeaDetail, InternalLink } from "@/lib/ideas-shared";
import { toParagraphs } from "@/lib/prose";
import { absoluteUrl } from "@/lib/schema";

import { CinemaIcon, type CinemaIconName } from "./cinema-icons";
import { useCinemaStage } from "./use-cinema-stage";

/**
 * The idea-page cinema trial (2026-09-24). Rendered only for the slugs in
 * CINEMA_TRIAL_SLUGS in `routes/idea.$slug.tsx`; every other idea page keeps
 * the standard template.
 *
 * Same content, links, ads, lock state and disabled features as the standard
 * template, block for block. What changes is composition and motion:
 *
 * - One motion owner (`useCinemaStage`): a single IntersectionObserver that
 *   reveals each block once, and one hero pointer listener. CSS owns every
 *   transition. No scroll listener, no rAF loop, no ScrollTrigger.
 * - A family of surface shapes chosen per job (see styles.css, "CINEMA
 *   TRIAL"): cut-corner stage, stepped dossier, open-edge panel, split
 *   ledger, numbered ribbon, notched verdict, compact capsule.
 * - Its own icon family (`cinema-icons.tsx`).
 *
 * The friend-talk section is not rendered here because the standard template
 * currently renders it empty on every page (pulled 2026-09-24, see PENDING).
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

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Section heading row: icon plate, optional eyebrow, the heading itself. */
function CineHead({
  icon,
  eyebrow,
  children,
  id,
}: {
  icon: CinemaIconName;
  eyebrow?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <div className="cm-head">
      <span className="cm-plate" aria-hidden="true">
        <CinemaIcon name={icon} />
      </span>
      <div className="min-w-0">
        {eyebrow && <p className="cm-eyebrow">{eyebrow}</p>}
        <h2 id={id}>{children}</h2>
      </div>
    </div>
  );
}

/** A sub-heading inside a section (h3), with its icon. */
function CineSubHead({ icon, children }: { icon: CinemaIconName; children: ReactNode }) {
  return (
    <div className="cm-subhead">
      <CinemaIcon name={icon} size={20} />
      <h3>{children}</h3>
    </div>
  );
}

/**
 * "Utility Fan" share control. The actions are `hidden` while closed, so they
 * are neither visible nor focusable, and they wrap onto their own line on a
 * narrow phone rather than being clipped. Copy confirms in place.
 */
function CinemaShare({ url, title }: { url: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const fanId = useId();
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = () => {
    void navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <div
      className="cm-share"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) setOpen(false);
      }}
    >
      <button
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
          style={{ "--i": 0 } as CSSProperties}
        >
          <Twitter aria-hidden className="h-4 w-4" />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className="cm-icon-btn"
          style={{ "--i": 1 } as CSSProperties}
        >
          <Linkedin aria-hidden className="h-4 w-4" />
        </a>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Link copied" : "Copy link"}
          className="cm-icon-btn cm-copy bbi-bare"
          data-copied={copied || undefined}
          style={{ "--i": 2 } as CSSProperties}
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

/** "Signal Lock": the real trend score, one gauge, an honest empty state. */
function DemandSignal({ score }: { score: number | null }) {
  if (score === null) {
    return (
      <aside className="cm-signal" aria-labelledby="cm-demand-h">
        <p id="cm-demand-h" className="cm-signal-label">
          <CinemaIcon name="demand" size={18} /> Demand signal
        </p>
        <p className="cm-signal-empty">
          No demand score yet. The research for this signal is still in progress.
        </p>
      </aside>
    );
  }
  const pct = Math.max(0, Math.min(100, score));
  const band = pct >= 85 ? "Strong momentum" : pct >= 70 ? "Steady demand" : "Niche, but real";
  return (
    <aside
      className="cm-signal"
      aria-labelledby="cm-demand-h"
      data-anchor="demand"
      data-anchor-label="Demand"
    >
      <p id="cm-demand-h" className="cm-signal-label">
        <CinemaIcon name="demand" size={18} /> Demand signal
      </p>
      <p className="cm-signal-value">
        <strong>{pct}</strong>
        <span>/ 100</span>
      </p>
      <p className="cm-signal-band">{band}</p>
      <div
        className="cm-gauge"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Trend score"
      >
        <span className="cm-gauge-fill" style={{ "--v": pct / 100 } as CSSProperties} />
      </div>
      <p className="cm-signal-note">
        Trend score {pct} of 100, based on current demand signals for this specific micro-niche
        rather than its broader category.
      </p>
    </aside>
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
            <p>{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

/** "Deck Lift" card. Real title and link; the edge and arrow respond. */
function DeckCard({ card, meta }: { card: IdeaCard; meta: string }) {
  return (
    <Link to="/idea/$slug" params={{ slug: card.slug }} className="cm-deck-card">
      <span className="cm-deck-meta">
        <span className="cm-deck-cat">{meta}</span>
        {card.trendScore !== null && <span className="cm-deck-trend">Trend {card.trendScore}</span>}
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

export function IdeaCinemaPage({
  idea,
  related,
  trending,
  relatedCategories,
  contextualLinks,
}: Props) {
  const stageRef = useCinemaStage<HTMLDivElement>();
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

  const blueprint = (
    [
      { title: "The opportunity", body: idea.marketOpportunity, icon: "opportunity" },
      { title: "Who actually pays you", body: idea.targetCustomer, icon: "customer" },
      { title: "How the money works", body: idea.howYouMakeMoney, icon: "revenue" },
      { title: "Your edge", body: idea.competitionEdge, icon: "edge" },
    ] as const
  ).filter((entry): entry is typeof entry & { body: string } => Boolean(entry.body));

  const index = [
    { href: "#breakdown", label: "Breakdown" },
    { href: "#blueprint", label: "Blueprint" },
    { href: "#numbers", label: "Numbers" },
    ...(hasPlaybooks ? [{ href: "#playbooks", label: "Playbooks" }] : []),
    ...(faqAbove.length > 0 ? [{ href: "#questions", label: "Questions" }] : []),
    { href: "#validate", label: "Validate" },
  ];

  const ideaUrl = absoluteUrl(`/idea/${idea.slug}`);

  return (
    <div ref={stageRef} className="cm-frame">
      <div className="cm-crumbs">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Browse", to: "/browse" },
            {
              label: idea.categoryName,
              to: "/category/$categorySlug",
              params: { categorySlug: idea.categorySlug },
            },
            {
              label: idea.subcategoryName,
              to: "/category/$categorySlug/$subcategorySlug",
              params: {
                categorySlug: idea.categorySlug,
                subcategorySlug: idea.subcategorySlug,
              },
            },
          ]}
        />
      </div>

      {/* A. Cut-corner stage. The horizon and its one light pass sit on a
          decorative layer (`data-depth`); the copy never moves. */}
      <header className="cm-hero" data-depth-scene data-anchor="top" data-anchor-label="Top">
        <div className="cm-hero-backdrop" aria-hidden="true">
          <div className="cm-hero-horizon" data-depth>
            <svg viewBox="0 0 800 420" preserveAspectRatio="none" focusable="false">
              <path className="cm-horizon-glow" d="M-20 430 C 200 120, 520 40, 820 70" />
              <path className="cm-horizon-arc" d="M-20 430 C 200 120, 520 40, 820 70" />
            </svg>
            <span className="cm-horizon-pass" />
          </div>
        </div>

        <div className="cm-hero-rail">
          <span className="cm-hero-id">{idea.ideaId}</span>
          <span className="cm-hero-cat">{idea.categoryName}</span>
          <nav aria-label="On this page" className="cm-hero-index">
            {index.map((item, i) => (
              <a key={item.href} href={item.href} className="cm-index-link">
                <span aria-hidden="true">{pad(i + 1)}</span>
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="cm-hero-grid">
          <div className="cm-hero-copy">
            <p className="cm-kicker cm-enter" style={{ "--d": 0 } as CSSProperties}>
              Business blueprint
            </p>
            <h1 className="cm-h1 cm-enter" style={{ "--d": 1 } as CSSProperties}>
              {idea.title}
            </h1>
            <p className="cm-lead cm-enter" style={{ "--d": 1 } as CSSProperties}>
              {lead}
            </p>
            {rest && (
              <details className="cm-dossier cm-enter" style={{ "--d": 2 } as CSSProperties}>
                <summary>
                  <span className="cm-dossier-label">Read the full overview</span>
                  <span className="cm-faq-mark" aria-hidden="true" />
                </summary>
                <div className="cm-dossier-body">
                  <p>{rest}</p>
                </div>
              </details>
            )}
            <div className="cm-actions cm-enter" style={{ "--d": 2 } as CSSProperties}>
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
          </div>
          <div className="cm-enter" style={{ "--d": 3 } as CSSProperties}>
            <DemandSignal score={idea.trendScore} />
            {idea.keywords.length > 0 && (
              <ul className="cm-capsules cm-capsules-quiet" aria-label="Keywords">
                {idea.keywords.slice(0, 3).map((k) => (
                  <li key={k} className="cm-capsule">
                    {k}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      {/* C. Open-edge panel with an "Evidence Wipe". */}
      <section
        id="breakdown"
        className="cm-panel cm-open-edge cm-section"
        data-anchor="breakdown"
        data-anchor-label="Breakdown"
        data-reveal="wipe"
      >
        <CineHead icon="opportunity">The breakdown</CineHead>
        <div className="cm-prose cm-measure">
          {toParagraphs(idea.summary).map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
        <InternalLinkLine
          link={linkFor("breakdown")}
          className="cm-prose cm-measure cm-link-line"
        />
      </section>

      <section
        id="blueprint"
        className="cm-section"
        data-anchor="blueprint"
        data-anchor-label="The Blueprint"
      >
        <CineHead icon="edge" eyebrow="Premium research">
          The Blueprint
        </CineHead>
        <LockedBody>
          {blueprint.length > 0 && (
            <div className="cm-blueprint" data-reveal="stagger">
              {blueprint.map((item, i) => (
                <article
                  key={item.title}
                  className={i === 0 ? "cm-card cm-stepped" : "cm-card cm-open-edge"}
                  style={{ "--i": i } as CSSProperties}
                >
                  <div className="cm-tab">
                    {/* "Tactical Fold": decorative, so out of the accessibility
                        tree. The back face repeats this card's real position. */}
                    <span className="cm-fold" aria-hidden="true">
                      <span className="cm-fold-face cm-fold-front">
                        <CinemaIcon name={item.icon} />
                      </span>
                      <span className="cm-fold-face cm-fold-back">{pad(i + 1)}</span>
                    </span>
                    <span className="cm-tab-index" aria-hidden="true">
                      {pad(i + 1)} / {pad(blueprint.length)}
                    </span>
                  </div>
                  <h3>{item.title}</h3>
                  <div className="cm-prose">
                    {toParagraphs(item.body).map((paragraph) => (
                      <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}

          <section
            className="cm-verdict-block"
            data-anchor="verdict"
            data-anchor-label="Verdict"
            aria-label="Why it works, what will hurt, and the verdict"
          >
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
                <p>{idea.verdict}</p>
              </div>
            )}
          </section>
        </LockedBody>
      </section>

      <div className="cm-ad">
        <AdSlot position="idea-detail-between-proscons-verdict" size="banner" />
      </div>

      <section
        id="numbers"
        className="cm-section"
        data-anchor="numbers"
        data-anchor-label="Real Numbers"
      >
        <CineHead icon="income" eyebrow="Premium research">
          Real Numbers
        </CineHead>
        <LockedBody>
          {idea.startupCost || idea.incomePotential ? (
            <div
              className={`cm-ledger${idea.startupCost && idea.incomePotential ? "" : " is-single"}`}
              data-reveal="ledger"
            >
              {idea.startupCost && (
                <div className="cm-ledger-side">
                  <div className="cm-ledger-rail">
                    <CineSubHead icon="cost">What it costs to start</CineSubHead>
                  </div>
                  <p>{idea.startupCost}</p>
                </div>
              )}
              <span className="cm-ledger-axis" aria-hidden="true" />
              {idea.incomePotential && (
                <div className="cm-ledger-side">
                  <div className="cm-ledger-rail">
                    <CineSubHead icon="income">What you can earn</CineSubHead>
                  </div>
                  <p>{idea.incomePotential}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="cm-prose">
              The real-numbers research for this idea is still in progress.
            </p>
          )}
        </LockedBody>
      </section>

      {hasPlaybooks && (
        <section
          id="playbooks"
          className="cm-section"
          data-anchor="playbooks"
          data-anchor-label="Tactical Playbooks"
        >
          <CineHead icon="launch" eyebrow="Premium research">
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
                    <span className="cm-rail" aria-hidden="true">
                      <span className="cm-rail-fill" />
                    </span>
                    <ol className="cm-ribbons">
                      {idea.gettingStartedSteps.map((step, i) => (
                        <li key={step} className="cm-ribbon">
                          <span className="cm-ribbon-idx" aria-hidden="true">
                            {pad(i + 1)}
                          </span>
                          <span>{step}</span>
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
                      <span className="cm-timeline-bar" aria-hidden="true">
                        <span />
                      </span>
                      <p className="whitespace-pre-line">{idea.timeToFirstCustomer}</p>
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
          <CineHead icon="customer">Questions people ask</CineHead>
          <FaqList items={faqAbove} />
        </section>
      )}

      {idea.externalLinks.length > 0 && (
        <section className="cm-section" data-reveal="rise">
          <CineHead icon="guide">Useful resources</CineHead>
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

      <div className="cm-ad">
        <AdSlot position="idea-detail-below-verdict" size="banner" />
      </div>

      {faqBelow.length > 0 && (
        <section
          className="cm-section"
          data-anchor="faq"
          data-anchor-label="FAQ"
          data-reveal="rise"
        >
          <CineHead icon="customer">More questions</CineHead>
          <FaqList items={faqBelow} />
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

      {subcategoryLink && (
        <section className="cm-panel cm-open-edge cm-section" data-reveal="rise">
          <CineHead icon="guide">Keep exploring</CineHead>
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
        </section>
      )}

      <div className="cm-ad">
        <AdSlot position="idea-detail-above-related" size="banner" />
      </div>

      {(related.length > 0 || trending.length > 0) && (
        <div className="cm-decks cm-section">
          {related.length > 0 && (
            <section data-anchor="related" data-anchor-label="Related" data-reveal="stagger">
              <h2 className="cm-deck-heading">More in {idea.categoryName}</h2>
              <ul className="cm-deck">
                {related.map((r, i) => (
                  <li key={r.ideaId} style={{ "--i": i } as CSSProperties}>
                    <DeckCard card={r} meta={r.subcategoryName} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          {trending.length > 0 && (
            <section data-reveal="stagger">
              <h2 className="cm-deck-heading">Trending across the library</h2>
              <ul className="cm-deck">
                {trending.map((t, i) => (
                  <li key={t.ideaId} style={{ "--i": i } as CSSProperties}>
                    <DeckCard card={t} meta={t.categoryName} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {/* The standard template's sidebar ad slot. It renders nothing until ad
          code is configured, exactly as there. */}
      <AdSlot position="idea-detail-right-affiliate" size="rectangle" />

      {relatedCategories.length > 0 && (
        <section className="cm-section" data-reveal="rise">
          <h2 className="cm-deck-heading">Other categories worth a look</h2>
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
        </section>
      )}

      {/* R. "Launch Console": the existing validate flow, same controls,
          same disabled and sign-in behaviour, in the trial's surface. */}
      <section
        id="validate"
        className="cm-console cm-section"
        data-anchor="validate"
        data-anchor-label="Validate"
        data-reveal="rise"
      >
        <CineHead icon="verdict">Run it before you commit</CineHead>
        <p className="cm-console-sub">Free, on your own account, as many times as you want.</p>
        <ValidateButton slug={idea.slug} cinema />
        <Link to="/browse" className="cm-trace-link cm-console-browse">
          Browse more blueprints
          <CinemaIcon name="arrow" size={16} className="cm-arrow" />
        </Link>
      </section>

      <IdeaSignature className="cm-signature" />
    </div>
  );
}
