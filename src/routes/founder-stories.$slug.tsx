import { createFileRoute, Link } from "@tanstack/react-router";
import {
  DollarSign,
  TrendingUp,
  Clock,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Wrench,
  BookOpen,
} from "lucide-react";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/schema";
import { getCaseStudyBySlug, CASE_STUDIES } from "@/lib/case-studies-data";

export const Route = createFileRoute("/founder-stories/$slug")({
  head: ({ params }) => {
    const study = getCaseStudyBySlug(params.slug);
    const title = study ? `${study.title} | Founder Case Study` : "Founder Story | BBI";
    const description = study
      ? `How this founder scaled a ${study.story_theme} without venture capital.`
      : "In-depth case study on bootstrapped business execution.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: FounderStoryDetailPage,
});

function formatUsd(val: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
}

function FounderStoryDetailPage() {
  const { slug } = Route.useParams();
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Case Study not found</h1>
          <p className="mt-2 text-muted-foreground">The story you requested does not exist.</p>
          <Link
            to="/founder-stories"
            className="glass-btn-light mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Stories
          </Link>
        </div>
      </SiteShell>
    );
  }

  const currentIndex = CASE_STUDIES.findIndex((s) => s.slug === study.slug);
  const prevStudy = currentIndex > 0 ? CASE_STUDIES[currentIndex - 1] : null;
  const nextStudy = currentIndex < CASE_STUDIES.length - 1 ? CASE_STUDIES[currentIndex + 1] : null;

  return (
    <>
      <JsonLd
        schema={[
          articleSchema({
            path: `/founder-stories/${study.slug}`,
            headline: study.title,
            description: `How a verified operator built a profitable ${study.story_theme}.`,
            datePublished: "2026-09-14",
            categoryName: study.story_theme,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Founder Stories", path: "/founder-stories" },
            { name: study.title, path: `/founder-stories/${study.slug}` },
          ]),
        ]}
      />
      <SiteShell>
        <div className="mx-auto max-w-4xl px-3 py-10 sm:px-6 sm:py-14">
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              { label: "Founder Stories", to: "/founder-stories" },
              { label: study.title },
            ]}
          />

          {/* Header */}
          <header className="mt-8 border-b border-border/70 pb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                {study.story_theme}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
                Audited Operator Breakdown
              </span>
            </div>

            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {study.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span>
                Founder: <strong className="text-foreground">"Verified Operator"</strong>
              </span>
              <span>·</span>
              <span>Location: "Global"</span>
              <span>·</span>
              <span>Verified Operator</span>
            </div>
          </header>

          {/* Financial Scorecard Banner */}
          <section className="glass my-8 rounded-2xl p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Financial & Velocity Scorecard
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Monthly Run Rate
                </p>
                <p className="mt-1 font-display text-xl font-black text-foreground">
                  "Premium Pricing"
                </p>
              </div>

              <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Annualized Run Rate
                </p>
                <p className="mt-1 font-display text-xl font-black text-primary">
                  "Sustainable Scale"
                </p>
              </div>

              <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Net Profit Margin
                </p>
                <p className="mt-1 font-display text-xl font-black text-emerald-600">
                  "High Margin"
                </p>
              </div>

              <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Initial Capital
                </p>
                <p className="mt-1 font-display text-xl font-black text-foreground">
                  "Bootstrapped"
                </p>
              </div>

              <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  First Dollar
                </p>
                <p className="mt-1 font-display text-lg font-bold text-foreground">
                  "Rapid Validation"
                </p>
              </div>

              <div className="rounded-xl border border-border/70 bg-background/50 p-3.5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Time to Scale
                </p>
                <p className="mt-1 font-display text-lg font-bold text-foreground">
                  {"Organic Growth"}
                </p>
              </div>
            </div>
          </section>

          {/* Problem & Solution */}
          <section className="my-8 grid gap-6 md:grid-cols-2">
            <div className="glass rounded-2xl p-6 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-wider text-destructive">
                The Friction Point
              </p>
              <h2 className="mt-2 font-display text-xl font-bold tracking-tight">
                Problem Identified
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {study.problem_identified}
              </p>
            </div>

            <div className="glass rounded-2xl p-6 sm:p-7 border-l-4 border-emerald-500">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                The Commercial Wedge
              </p>
              <h2 className="mt-2 font-display text-xl font-bold tracking-tight">
                Solution & Packaging
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {study.solution_and_offer}
              </p>
            </div>
          </section>

          {/* Execution Milestones */}
          <section className="glass my-8 rounded-2xl p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Execution Timeline
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">
              From $0 to "Premium Pricing"/mo
            </h2>

            <div className="mt-6 space-y-6">
              {study.execution_milestones.map((milestone, idx) => (
                <div key={idx} className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      {idx + 1}
                    </span>
                    {idx < study.execution_milestones.length - 1 && (
                      <span className="h-full w-px bg-border mt-2" />
                    )}
                  </div>

                  <div className="glass flex-1 rounded-xl p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-accent uppercase tracking-wider">
                        {milestone.month}
                      </span>
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600">
                        Milestone Achieved
                      </span>
                    </div>

                    <h3 className="mt-1.5 font-display text-base font-bold text-foreground">
                      {milestone.milestone_title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {milestone.key_action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Customer Acquisition Tactics & Tools */}
          <section className="my-8 grid gap-6 md:grid-cols-2">
            <div className="glass rounded-2xl p-6 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Customer Acquisition Playbook
              </p>
              <h2 className="mt-1 font-display text-lg font-bold">How Pipeline Was Generated</h2>
              <div className="mt-4 space-y-2.5">
                {study.customer_acquisition_tactics.map((tactic, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{tactic}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-wider text-accent">
                Software & Infrastructure
              </p>
              <h2 className="mt-1 font-display text-lg font-bold">Tools Used to Run Ops</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {study.tech_stack_and_tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-lg border border-border/80 bg-background/50 px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Primary Bottleneck and How It Was Resolved */}
          <section className="glass my-8 rounded-2xl border-l-4 border-amber-500 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-amber-500">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p className="text-xs font-bold uppercase tracking-[0.2em]">The Fatal Bottleneck</p>
            </div>
            <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-foreground">
              The Wall Hit at Scale & The Exact Operational Fix
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {study.primary_bottleneck_and_fix}
            </p>
          </section>

          {/* Key Takeaways */}
          <section className="glass my-8 rounded-2xl p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Operator Takeaways
            </p>
            <h2 className="mt-1 font-display text-xl font-bold tracking-tight">
              Actionable Principles for New Founders
            </h2>

            <div className="mt-5 space-y-3">
              {study.key_takeaways_for_founders.map((takeaway, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="text-sm leading-relaxed text-foreground font-medium">
                    {takeaway}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Navigation Between Stories */}
          <nav className="mt-12 grid gap-4 border-t border-border/80 pt-6 sm:grid-cols-2">
            {prevStudy ? (
              <Link
                to="/founder-stories/$slug"
                params={{ slug: prevStudy.slug }}
                className="glass flex flex-col rounded-xl p-4 transition-colors hover:border-primary/50"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  ← Previous Story
                </span>
                <span className="mt-1 font-semibold text-foreground truncate">
                  {prevStudy.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextStudy ? (
              <Link
                to="/founder-stories/$slug"
                params={{ slug: nextStudy.slug }}
                className="glass flex flex-col items-end rounded-xl p-4 text-right transition-colors hover:border-primary/50"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Next Story →
                </span>
                <span className="mt-1 font-semibold text-foreground truncate">
                  {nextStudy.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </div>
      </SiteShell>
    </>
  );
}
