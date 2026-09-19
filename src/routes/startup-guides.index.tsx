import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Clock, ArrowRight, CheckCircle2, Sparkles, Compass } from "lucide-react";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { ExploreRail } from "@/components/explore-rail";
import { JsonLd, breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { STARTUP_GUIDES, type StartupGuideMeta } from "@/lib/guides-data";

export const Route = createFileRoute("/startup-guides/")({
  head: () => ({
    meta: [
      { title: "Tactical Startup & Validation Guides | BBI" },
      {
        name: "description",
        content:
          "In-depth tactical playbooks on idea validation, TAM calculation, zero-investment business models, and PMF benchmarks.",
      },
      { property: "og:title", content: "Tactical Startup & Validation Guides | BBI" },
      {
        property: "og:description",
        content:
          "Practical operator playbooks with zero fluff: Customer discovery, bottom-up market sizing, lean productized models, and launch audits.",
      },
    ],
  }),
  component: StartupGuidesIndexPage,
});

function StartupGuidesIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Validation",
    "Market Sizing",
    "Bootstrapping",
    "Growth & PMF",
    "Launch & Ops",
  ];

  const filteredGuides =
    selectedCategory === "All"
      ? STARTUP_GUIDES
      : STARTUP_GUIDES.filter((g) => g.category === selectedCategory);

  return (
    <>
      <JsonLd
        schema={[
          collectionPageSchema({
            path: "/startup-guides",
            name: "Tactical Startup & Validation Guides",
            description: "Practical operator playbooks on idea validation, TAM sizing, and PMF.",
            itemCount: STARTUP_GUIDES.length,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Startup Guides", path: "/startup-guides" },
          ]),
        ]}
      />
      <SiteShell tone="instrument">
        <div className="mx-auto max-w-6xl px-3 py-10 sm:px-4 sm:py-14">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Startup Guides" }]} />

          <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="t-eyebrow">Operator Playbooks</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Startup & Validation{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-warm bg-clip-text text-transparent">
                  Guides
                </span>
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Zero fluff, empirical frameworks written for early-stage builders. Learn how to run
                customer discovery without pitching, size defensible markets, and launch lean
                businesses from zero capital.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                to="/calculator"
                className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <Compass className="h-3.5 w-3.5" />
                Useful Tools
              </Link>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                  selectedCategory === cat
                    ? "glass-btn-glow glass-btn"
                    : "glass text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Guides Catalog Grid */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {filteredGuides.map((guide) => (
              <article
                key={guide.slug}
                className="glass group flex flex-col justify-between rounded-2xl p-6 transition-all hover:border-primary/50 hover:shadow-lg sm:p-7"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                      {guide.category}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {guide.readTime}
                      </span>
                      <span>·</span>
                      <span>{guide.wordCount} words</span>
                    </div>
                  </div>

                  <h2 className="mt-4 font-display text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">
                    <Link to="/startup-guides/$slug" params={{ slug: guide.slug }}>
                      {guide.title}
                    </Link>
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {guide.description}
                  </p>

                  <div className="mt-5 space-y-2 rounded-xl border border-border/60 bg-background/40 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                      Core Framework Takeaways:
                    </p>
                    {guide.keyTakeaways.map((takeaway, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <span className="leading-snug">{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                  <span className="text-xs text-muted-foreground">By {guide.author}</span>
                  <Link
                    to="/startup-guides/$slug"
                    params={{ slug: guide.slug }}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary transition-colors hover:underline"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Quick Cross-Link Banner */}
          <div className="glass mt-14 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Interactive Practice
                </span>
                <h3 className="mt-1 font-display text-xl font-bold tracking-tight">
                  Need to calculate your market size or cash runway?
                </h3>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  Our interactive financial calculators complement these guides with real-time
                  formulas and benchmark tests.
                </p>
              </div>
              <Link
                to="/calculator"
                className="glass-btn-light shrink-0 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em]"
              >
                Open Calculators →
              </Link>
            </div>
          </div>

          {/* This page already points at /calculator directly above, so the
              rail excludes it too and doesn't repeat the same link twice. */}
          <ExploreRail exclude={["guides", "calculators"]} heading="Keep exploring" />
        </div>
      </SiteShell>
    </>
  );
}
