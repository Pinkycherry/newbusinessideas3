import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { Lock } from "lucide-react";

import { IdeaCard } from "@/components/idea-card";
import { ValidateButton } from "@/components/validate-button";
import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { AdSlot } from "@/components/AdSlot";
import {
  getIdeaBySlug,
  type IdeaVariant,
  type IdeaGradient,
  type RelatedCategory,
} from "@/lib/ideas.functions";
import { type IdeaCard as IdeaCardType, type IdeaDetail } from "@/lib/ideas-shared";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/schema";
import { useAuth } from "@/hooks/use-auth";
import { useElementPointerGroup, useScrollProgress, useTextReveal } from "@/motion";

type IdeaDetailData = {
  idea: IdeaDetail;
  related: IdeaCardType[];
  relatedCategories: RelatedCategory[];
  trending: IdeaCardType[];
  variant: IdeaVariant;
  gradient: IdeaGradient;
} | null;

type ContextualLink = { key: string; label: string; to: string; params: Record<string, string> };

/**
 * PROJECT_BRIEF.md Section 8.2 / Build Order step 11 — up to 3 automatic,
 * keyword-matched internal links per page, prioritizing hub-style pages
 * (subcategory, then category) over distant matches. Reuses data already
 * loaded for this page (no extra Supabase round-trip): the idea's own
 * keywords/tags are scanned against the `related` list already fetched for
 * the sidebar/bottom cards to find one genuinely on-topic idea link.
 */
function pickContextualLinks(idea: IdeaDetail, related: IdeaCardType[]): ContextualLink[] {
  const links: ContextualLink[] = [
    {
      key: "subcategory",
      label: idea.subcategoryName,
      to: "/category/$categorySlug/$subcategorySlug",
      params: { categorySlug: idea.categorySlug, subcategorySlug: idea.subcategorySlug },
    },
    {
      key: "category",
      label: idea.categoryName,
      to: "/category/$categorySlug",
      params: { categorySlug: idea.categorySlug },
    },
  ];

  const keywordPool = [...idea.keywords, ...idea.tags]
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);
  const match = keywordPool.length
    ? related.find((r) => {
        const haystack = `${r.title} ${r.summary} ${r.tags.join(" ")}`.toLowerCase();
        return keywordPool.some((k) => haystack.includes(k));
      })
    : undefined;

  if (match) {
    links.push({
      key: match.ideaId,
      label: match.title,
      to: "/idea/$slug",
      params: { slug: match.slug },
    });
  }

  return links.slice(0, 3);
}

const ideaDetailQuery = (slug: string) =>
  queryOptions<IdeaDetailData>({
    queryKey: ["idea-detail", slug],
    // Used only inside the route loader's ensureQueryData call below, purely
    // as a typed fetch-and-return helper — the component reads the result via
    // Route.useLoaderData(), not via useSuspenseQuery, so these cache settings
    // no longer affect what's rendered (see the note on IdeaPage's data line
    // for why: router.tsx doesn't dehydrate the QueryClient to the client, so
    // a client-side useSuspenseQuery on this query would re-run it — a real
    // problem for Section 9's per-request-random variant/gradient/related
    // picks, since two independent calls return different results).
    staleTime: 0,
    gcTime: 60_000,
    queryFn: async () => {
      const result = await getIdeaBySlug({ data: { slug } });
      if (!result?.idea) return null;
      return result;
    },
  });

export const Route = createFileRoute("/idea/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(ideaDetailQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const idea = loaderData?.idea;
    // Prefer the researched SEO fields when the pipeline has filled them;
    // fall back to the previous behaviour for un-enriched ideas.
    const title = idea ? idea.seoTitle || `${idea.title} | BBI` : "Business Idea | BBI";
    const description =
      idea?.metaDescription ||
      idea?.businessDescription?.slice(0, 155) ||
      "A researched business idea blueprint with pros, cons and a founder-fit verdict.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: idea ? [{ rel: "canonical", href: `https://businessidea.io/idea/${idea.slug}` }] : [],
    };
  },
  component: IdeaPage,
  errorComponent: () => (
    <SiteShell>
      <p className="mx-auto max-w-6xl px-4 py-24">This idea could not be loaded.</p>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-24">
        <p>That idea does not exist in the library.</p>
        <Link to="/browse" className="mt-4 inline-block text-primary underline">
          Browse all ideas
        </Link>
      </div>
    </SiteShell>
  ),
});

/**
 * Section 6.1 item 3 — the demand/trend indicator.
 *
 * It has exactly one input: `ideas.trend_score`, the idea's own real column.
 * The gauge fills to that value and no further, and scroll is what moves it —
 * `useScrollProgress` publishes `--sc-p` on this section and the fill's
 * `scaleX` is the product of the real score and that playhead. So it is alive
 * because the reader is moving, not because a timer is running.
 *
 * What used to be here, and is deliberately not coming back: a twelve-bar
 * "sparkline" whose heights were `Math.sin(i * 0.9) + Math.cos(i * 0.5)`
 * layered over the score. That is a fabricated time series — this site has had
 * to strip invented figures three times and a sine-wave demand tracker was one
 * of them. There is no per-period demand history in the schema, so there is no
 * chart. One real number, honestly drawn.
 *
 * Transform only: the fill scales, its box never changes size. The old
 * `.demand-gauge-fill` rule animated `width` instead, which MOTION_SPEC rule
 * 8 forbids; it has been deleted from styles.css along with the bar chart.
 */
function DemandBlock({ score }: { score: number | null }) {
  const sectionRef = useScrollProgress<HTMLElement>();
  if (score === null) return null;
  const pct = Math.max(0, Math.min(100, score));
  const band = pct >= 85 ? "Strong momentum" : pct >= 70 ? "Steady demand" : "Niche, but real";
  return (
    <section ref={sectionRef} className="mt-10 rounded-lg border border-border bg-card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Demand signal
        </h2>
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">{band}</span>
      </div>
      <div
        className="demand-gauge-track mt-4"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Trend score"
      >
        {/* Resting state with no JavaScript, and under reduced motion, is the
            settled one: --sc-p falls back to 1 and the fill sits at the real
            score rather than at zero. */}
        <div
          className="h-full w-full origin-left rounded-full bg-gradient-to-r from-primary to-accent"
          style={{
            transform: `scaleX(calc(${(pct / 100).toFixed(4)} * clamp(0, calc(var(--sc-p, 1) * 1.6), 1)))`,
          }}
        />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Trend score {pct} of 100, based on current demand signals for this specific micro-niche
        rather than its broader category.
      </p>
    </section>
  );
}

/**
 * The blueprint's real pros/cons/verdict, computed state advancing while the
 * frame holds — the `pin` device (devices.md §2), the one leaned on hardest
 * by the Live Surface grammar. Three real panels, not a fake sequence: pros
 * and cons are both visible from the start (nothing here is hidden to force
 * a reveal), the verdict crossfades in as `--sc-p` passes its threshold. No
 * invented copy — every word is the idea's own `pros`/`cons`/`verdict` data.
 *
 * Migrated from `lib/scroll-devices`' `usePinProgress` to `@/motion`'s
 * `useScrollProgress({ mode: "pinned" })` — the same device, same `--sc-p`
 * contract, so the calc()-driven verdict cue below is untouched. One real
 * behaviour change came with it: the old hook parked `--sc-p` at 0 under
 * reduced motion, which drove this panel's own `clamp()` to zero opacity and
 * hid the verdict outright for those readers. The shared hook parks at its
 * settled value instead, so the verdict is simply there.
 */
function ComputedVerdictPanel({ idea }: { idea: IdeaDetail }) {
  const stageRef = useScrollProgress<HTMLElement>({ mode: "pinned", spanVh: 1.6 });

  return (
    <section
      ref={stageRef}
      data-anchor="verdict"
      data-anchor-label="Verdict"
      className="mt-10 flex min-h-[1px] flex-col justify-center rounded-lg border border-border bg-card p-5 sm:p-7"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">
            Why it works
          </h2>
          <ul className="mt-3 space-y-3 text-sm">
            {idea.pros.map((pro) => (
              <li key={pro} className="flex gap-2">
                <span aria-hidden className="text-accent">
                  +
                </span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-destructive">
            What will hurt
          </h2>
          <ul className="mt-3 space-y-3 text-sm">
            {idea.cons.map((con) => (
              <li key={con} className="flex gap-2">
                <span aria-hidden className="text-destructive">
                  −
                </span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {idea.verdict && (
        <div
          className="mt-6 border-t border-primary/30 pt-5"
          style={{
            opacity: "clamp(0, calc((var(--sc-p, 1) - 0.55) * 4), 1)",
            transform:
              "translateY(calc((1 - clamp(0, calc((var(--sc-p, 1) - 0.55) * 4), 1)) * 10px))",
          }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">Verdict</h2>
          <p className="mt-2 leading-relaxed">{idea.verdict}</p>
        </div>
      )}
    </section>
  );
}

/** A plain prose block that renders only when the field has content. */
function RichSection({ title, body }: { title: string; body: string }) {
  if (!body) return null;
  return (
    <section className="mt-10">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      <p className="mt-3 whitespace-pre-line leading-relaxed">{body}</p>
    </section>
  );
}

function IdeaPage() {
  // Reads the router's own loaderData rather than re-running the query via
  // useSuspenseQuery. router.tsx creates a fresh, empty QueryClient on both
  // server and client with no dehydration between them, so a client-side
  // useSuspenseQuery here doesn't read cached SSR data — it genuinely
  // re-invokes getIdeaBySlug from the browser on first render. For most
  // queries that's merely a wasted round trip; for this one, whose random
  // variant/gradient/related picks are recomputed server-side per call
  // (Section 9's "nothing static" rule), the two independent calls return
  // different results and React flags a real hydration mismatch — reproduced
  // via Playwright and confirmed before this fix. TanStack Router's own
  // loaderData transport does not have this problem: it serializes the
  // loader's single server-computed result to the client once.
  // Non-null by construction: the loader throws notFound() when the query
  // returns null, so this component never renders without data.
  const data = Route.useLoaderData() as NonNullable<IdeaDetailData>;
  const auth = useAuth();
  // MOTION_SPEC §2.3 — the page's single headline reveal, on the idea title.
  const titleRef = useTextReveal<HTMLHeadingElement>();
  // One delegated pointer listener per rail rather than one per card.
  const relatedRailRef = useElementPointerGroup<HTMLDivElement>("a");
  const trendingRailRef = useElementPointerGroup<HTMLDivElement>("a");
  if (!data) return null;
  const { idea, related, relatedCategories, trending, variant, gradient } = data;
  // PROJECT_BRIEF.md Section 3.2 — full blueprint content is blurred behind
  // a sign-in gate; the title/description teaser above stays visible.
  const contentLocked = auth.status !== "authenticated";

  const showSidebarList = related.length > 3;
  const sidebarRelated = showSidebarList ? related.slice(0, 3) : [];
  const bottomRelated = showSidebarList ? related.slice(3, 6) : related;
  const contextualLinks = pickContextualLinks(idea, related);
  const [subcategoryLink, categoryLink, matchedIdeaLink] = contextualLinks;

  // Section 6.1 item 5 — 5 FAQs above the additional content, 5 below.
  const faqAbove = idea.faq.slice(0, 5);
  const faqBelow = idea.faq.slice(5, 10);

  const ideaPath = `/idea/${idea.slug}`;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Browse", path: "/browse" },
    { name: idea.categoryName, path: `/category/${idea.categorySlug}` },
    {
      name: idea.subcategoryName,
      path: `/category/${idea.categorySlug}/${idea.subcategorySlug}`,
    },
    { name: idea.title, path: ideaPath },
  ];

  return (
    <>
      <JsonLd
        schema={[
          articleSchema({
            path: ideaPath,
            headline: idea.title,
            description: idea.businessDescription || idea.summary,
            datePublished: idea.createdAt,
            categoryName: idea.categoryName,
          }),
          breadcrumbSchema(breadcrumbItems),
        ]}
      />
      <SiteShell>
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <article className="idea-shell min-w-0" data-variant={variant} data-gradient={gradient}>
            {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
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

            {/* Section 6.1 item 1 — hero, built as a Live Surface status bar rather
                than a marketing banner: the blueprint's own computed state,
                already in view, no separate title treatment or CTA pill layered
                on top of it (uniqueness.md §2.3 bans marketing chrome here — the
                "validate" action lives at the page's actual close instead). The
                wrapper classes let the chosen layout variant genuinely restructure
                this block (see styles.css). */}
            <div className="idea-hero mt-5" data-anchor="top" data-anchor-label="Top">
              <div className="min-w-0">
                <div className="idea-hero-meta flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest">
                  <span className="rounded-sm bg-secondary px-2 py-1 font-mono text-secondary-foreground">
                    {idea.ideaId}
                  </span>
                  <span className="text-accent">{idea.categoryName}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground">{idea.subcategoryName}</span>
                </div>

                <h1 ref={titleRef} className="mt-3 text-4xl font-bold leading-tight tracking-tight">
                  {idea.title}
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">{idea.businessDescription}</p>
              </div>

              {/* A real telemetry readout, not a decorative visual: the idea's
                  own trend_score, already computed, with the verdict's status
                  read alongside it. */}
              <div className="idea-hero-aside">
                <div className="glass rounded-2xl p-5">
                  <dl className="sc-spec-label !text-[10px]">
                    <div className="w-full">
                      <dt>Momentum</dt>
                      <dd className="!ml-0 block">
                        <span className="font-mono text-4xl font-bold leading-none tabular-nums text-foreground">
                          {idea.trendScore ?? "—"}
                        </span>
                        <span className="ml-1 text-xs text-muted-foreground">/ 100</span>
                      </dd>
                    </div>
                  </dl>
                  {idea.keywords.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {idea.keywords.slice(0, 3).map((k) => (
                        <span
                          key={k}
                          className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="relative">
              <div
                className={contentLocked ? "pointer-events-none select-none blur-sm" : undefined}
              >
                <section className="mt-10" data-anchor="breakdown" data-anchor-label="Breakdown">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    The breakdown
                  </h2>
                  <p className="mt-3 whitespace-pre-line leading-relaxed">{idea.summary}</p>
                </section>

                <ComputedVerdictPanel idea={idea} />

                <div className="mt-8">
                  <AdSlot position="idea-detail-between-proscons-verdict" size="banner" />
                </div>

                {/* Researched detail — each block renders only when the pipeline
                    has filled it, so un-enriched ideas are unaffected. */}
                <div data-anchor="research" data-anchor-label="Research">
                  <RichSection title="The opportunity" body={idea.marketOpportunity} />
                  <RichSection title="Who actually pays you" body={idea.targetCustomer} />
                  <RichSection title="How the money works" body={idea.howYouMakeMoney} />

                  {(idea.startupCost || idea.incomePotential) && (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {idea.startupCost && (
                        <section className="rounded-lg border border-border bg-card p-5">
                          <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">
                            What it costs to start
                          </h2>
                          <p className="mt-2 text-sm leading-relaxed">{idea.startupCost}</p>
                        </section>
                      )}
                      {idea.incomePotential && (
                        <section className="rounded-lg border border-border bg-card p-5">
                          <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">
                            What you can earn
                          </h2>
                          <p className="mt-2 text-sm leading-relaxed">{idea.incomePotential}</p>
                        </section>
                      )}
                    </div>
                  )}

                  <RichSection title="Your edge" body={idea.competitionEdge} />
                </div>

                {idea.gettingStartedSteps.length > 0 && (
                  <section className="mt-10" data-anchor="steps" data-anchor-label="Steps">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                      How to start
                    </h2>
                    <ol className="mt-4 space-y-3">
                      {idea.gettingStartedSteps.map((step, i) => (
                        <li key={step} className="flex gap-3 text-sm leading-relaxed">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </section>
                )}

                {idea.toolsNeeded.length > 0 && (
                  <section className="mt-10">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                      What you need
                    </h2>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {idea.toolsNeeded.map((tool) => (
                        <li
                          key={tool}
                          className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                        >
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <RichSection title="Time to first customer" body={idea.timeToFirstCustomer} />

                {faqAbove.length > 0 && (
                  <section className="mt-10">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                      Questions people ask
                    </h2>
                    <div className="mt-4 space-y-3">
                      {faqAbove.map((item) => (
                        <details
                          key={item.q}
                          className="rounded-lg border border-border bg-card p-4 text-sm"
                        >
                          <summary className="cursor-pointer font-semibold">{item.q}</summary>
                          <p className="mt-2 leading-relaxed text-muted-foreground">{item.a}</p>
                        </details>
                      ))}
                    </div>
                  </section>
                )}

                {idea.externalLinks.length > 0 && (
                  <section className="mt-10">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                      Useful resources
                    </h2>
                    <ul className="mt-3 space-y-2 text-sm">
                      {idea.externalLinks.map((link) => (
                        <li key={link.url}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="nofollow noopener"
                            className="font-semibold text-primary underline decoration-border underline-offset-4 hover:text-accent"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <div className="mt-8">
                  <AdSlot position="idea-detail-below-verdict" size="banner" />
                </div>
              </div>

              {contentLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/55 text-center">
                  <Lock className="h-6 w-6 text-accent" aria-hidden />
                  <p className="text-sm font-semibold">Sign in free to read the full blueprint</p>
                  <Link
                    to="/sign-in"
                    search={{ redirect: ideaPath }}
                    className="sheen rounded-full bg-gradient-to-r from-primary to-ember px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-[0_10px_36px_color-mix(in_oklab,var(--primary)_40%,transparent)] transition-transform duration-300 hover:scale-105"
                  >
                    Continue with Google
                  </Link>
                </div>
              )}
            </div>

            <DemandBlock score={idea.trendScore} />

            {faqBelow.length > 0 && (
              <section className="mt-10" data-anchor="faq" data-anchor-label="FAQ">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  More questions
                </h2>
                <div className="mt-4 space-y-3">
                  {faqBelow.map((item) => (
                    <details
                      key={item.q}
                      className="rounded-lg border border-border bg-card p-4 text-sm"
                    >
                      <summary className="cursor-pointer font-semibold">{item.q}</summary>
                      <p className="mt-2 leading-relaxed text-muted-foreground">{item.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {idea.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {idea.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-sm border border-border px-2 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {subcategoryLink && (
              <section className="mt-8 rounded-lg border border-border bg-card p-5">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Keep exploring
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  This blueprint sits inside{" "}
                  <Link
                    to={subcategoryLink.to}
                    params={subcategoryLink.params as never}
                    className="font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
                  >
                    {subcategoryLink.label}
                  </Link>
                  {categoryLink && (
                    <>
                      , part of the wider{" "}
                      <Link
                        to={categoryLink.to}
                        params={categoryLink.params as never}
                        className="font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
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
                        className="font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
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

            <div className="mt-10">
              <AdSlot position="idea-detail-above-related" size="banner" />
            </div>

            {bottomRelated.length > 0 && (
              <section className="mt-16" data-anchor="related" data-anchor-label="Related">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  More in {idea.categoryName}
                </h2>
                {/* `.mo-card` for these cells lives on IdeaCard itself, which
                    is the listing agent's file — this rail supplies the single
                    delegated pointer listener the sheen reads from. */}
                <div ref={relatedRailRef} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {bottomRelated.map((r) => (
                    <IdeaCard key={r.ideaId} idea={r} />
                  ))}
                </div>
              </section>
            )}
            {relatedCategories.length > 0 && (
              <section className="mt-16">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Other categories worth a look
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {relatedCategories.map((c) => (
                    <Link
                      key={c.categorySlug}
                      to="/category/$categorySlug"
                      params={{ categorySlug: c.categorySlug }}
                      className="mo-row glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
                    >
                      <span>{c.categoryName}</span>
                      <span className="text-[10px] opacity-70">{c.ideaCount}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {trending.length > 0 && (
              <section className="mt-16">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Trending across the library
                </h2>
                <div
                  ref={trendingRailRef}
                  className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
                >
                  {trending.map((t) => (
                    <Link
                      key={t.ideaId}
                      to="/idea/$slug"
                      params={{ slug: t.slug }}
                      className="mo-card glass glass-hover w-64 shrink-0 snap-start rounded-2xl p-4"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                        {t.categoryName}
                      </p>
                      <p className="mt-2 text-sm font-bold leading-snug">{t.title}</p>
                      {t.trendScore !== null && (
                        <p className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                          Trend {t.trendScore}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* The page's actual close, per the Live Surface grammar: an actual
                input the visitor puts a cursor in, not a button pointing back
                at one. ValidateButton already opens Claude/Perplexity with a
                real prompt and an optional free-text context field — this IS
                the ending, not a decoration in front of it. */}
            <section
              id="validate"
              data-anchor="validate"
              data-anchor-label="Validate"
              className="mt-16 rounded-2xl border border-border bg-card p-6 sm:p-9"
            >
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Run it before you commit
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Free, on your own account, as many times as you want.
              </p>
              <div className="mt-6">
                <ValidateButton slug={idea.slug} />
              </div>
              <Link
                to="/browse"
                className="mt-6 inline-block text-xs font-semibold uppercase tracking-widest text-primary underline decoration-border underline-offset-4 hover:text-accent"
              >
                Browse more blueprints
              </Link>
            </section>
            {/* EDITABLE SECTION END */}
          </article>

          {/* Sticky right column — desktop only. Add or reorder blocks freely. */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-5">
              <AdSlot position="idea-detail-right-affiliate" size="rectangle" />

              {sidebarRelated.length > 0 && (
                <div className="glass rounded-2xl px-5 py-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
                    More in {idea.categoryName}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {sidebarRelated.map((r) => (
                      <li key={r.ideaId}>
                        <Link
                          to="/idea/$slug"
                          params={{ slug: r.slug }}
                          className="block text-sm font-semibold leading-snug text-muted-foreground transition-colors hover:text-primary"
                        >
                          {r.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </SiteShell>
    </>
  );
}
