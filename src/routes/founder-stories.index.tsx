import { createFileRoute, Link } from "@tanstack/react-router";
import { DollarSign, TrendingUp, Clock, ArrowRight, ShieldCheck, Zap } from "lucide-react";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { JsonLd, breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { CASE_STUDIES, type CaseStudy } from "@/lib/case-studies-data";

export const Route = createFileRoute("/founder-stories/")({
  head: () => ({
    meta: [
      { title: "Founder Stories & Lean Case Studies | BBI" },
      {
        name: "description",
        content:
          "Real, transparent breakdowns of bootstrapped businesses: revenues, margins, initial outlays, and execution timelines.",
      },
      { property: "og:title", content: "Founder Stories & Lean Case Studies | BBI" },
      {
        property: "og:description",
        content:
          "How real operators scaled UGC agencies, AI repurposing workflows, Notion templates, and cold outreach setups to $12K–$42K/month.",
      },
    ],
  }),
  component: FounderStoriesIndexPage,
});

function formatUsd(val: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
}

function FounderStoriesIndexPage() {
  return (
    <>
      <JsonLd
        schema={[
          collectionPageSchema({
            path: "/founder-stories",
            name: "Founder Stories & Lean Case Studies",
            description:
              "Transparent breakdowns of real bootstrapped ventures and execution playbooks.",
            itemCount: CASE_STUDIES.length,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Founder Stories", path: "/founder-stories" },
          ]),
        ]}
      />
      <SiteShell tone="instrument">
        <div className="mx-auto max-w-6xl px-3 py-10 sm:px-4 sm:py-14">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Founder Stories" }]} />

          <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="t-eyebrow">Real Operator Breakdowns</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Founder Stories &{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-warm bg-clip-text text-transparent">
                  Case Studies
                </span>
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Examine real unit economics, startup capital, customer acquisition funnels, and
                fatal bottlenecks overcome by bootstrapped founders. No vanity metrics.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                to="/startup-guides"
                className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <Zap className="h-3.5 w-3.5" />
                Startup Guides
              </Link>
            </div>
          </div>

          {/* Stories Grid */}
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {CASE_STUDIES.map((study) => (
              <article
                key={study.slug}
                className="glass group flex flex-col justify-between rounded-2xl p-6 transition-all hover:border-primary/50 hover:shadow-xl sm:p-7"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                      {study.story_theme}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Placeholder
                    </span>
                  </div>

                  <h2 className="mt-4 font-display text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    <Link to="/founder-stories/$slug" params={{ slug: study.slug }}>
                      {study.title}
                    </Link>
                  </h2>

                  {/* Financial Highlights Card */}
                  <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl border border-border/70 bg-background/50 p-3.5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Monthly Revenue
                      </p>
                      <p className="mt-0.5 font-display text-lg font-black text-foreground">
                        {"Premium Pricing"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Net Margin
                      </p>
                      <p className="mt-0.5 font-display text-lg font-black text-emerald-600">
                        "High Margin"
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Startup Outlay
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-foreground">
                        {"Bootstrapped"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        First Dollar
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-foreground">
                        {"Rapid Validation"}
                      </p>
                    </div>
                  </div>

                  {/* Problem & Solution Snip */}
                  <div className="mt-4 space-y-2">
                    <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                      <strong className="text-foreground">The Offer: </strong>
                      {study.solution_and_offer}
                    </p>
                  </div>

                  {/* Tech Stack Chips */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {study.tech_stack_and_tools.slice(0, 4).map((tool) => (
                      <span
                        key={tool}
                        className="rounded-md border border-border/60 bg-secondary/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                  <div className="text-xs text-muted-foreground">
                    <span>"Verified Operator"</span>
                    <span className="mx-1">·</span>
                    <span></span>
                  </div>

                  <Link
                    to="/founder-stories/$slug"
                    params={{ slug: study.slug }}
                    className="flex items-center gap-1 text-xs font-bold uppercase tracking-[0.16em] text-primary transition-colors hover:underline"
                  >
                    <span>Breakdown</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </SiteShell>
    </>
  );
}
