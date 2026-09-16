import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Compass,
  BookOpen,
  Calculator,
  TrendingUp,
  FileText,
  Award,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { JsonLd, breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { STARTUP_GUIDES } from "@/lib/guides-data";
import { CALCULATORS } from "@/lib/calculators";
import { CASE_STUDIES } from "@/lib/case-studies-data";
import { GLOSSARY_DATA } from "@/lib/glossary-data";

export const Route = createFileRoute("/learning-resources/")({
  head: () => ({
    meta: [
      { title: "Founder Learning Resources & Operator Toolkit | BBI" },
      {
        name: "description",
        content:
          "Curated learning materials, tactical playbooks, financial calculators, founder case studies, and business building frameworks.",
      },
      { property: "og:title", content: "Founder Learning Resources & Operator Toolkit | BBI" },
      {
        property: "og:description",
        content:
          "Master hub for startup validation: TAM sizing, unit economics calculators, illustrative founder case studies, and playbooks.",
      },
    ],
  }),
  component: LearningResourcesIndexPage,
});

const OPERATOR_FRAMEWORKS = [
  {
    name: "The Mom Test (Rob Fitzpatrick)",
    summary:
      "How to talk to customers & learn if your business is a good idea when everyone is lying to you.",
    actionable_rule:
      "Never ask someone if your idea is good. Ask about past behavior and what they currently pay to solve the friction.",
  },
  {
    name: "Sean Ellis 40% PMF Benchmark",
    summary:
      "Quantitative survey metric assessing whether product-market fit has been reached before scaling marketing spend.",
    actionable_rule:
      "Survey active users: If >40% say they would be 'very disappointed' if your product disappeared tomorrow, you have PMF.",
  },
  {
    name: "Paul Graham's Default Alive / Dead",
    summary:
      "Mental model for calculating if current growth rate and burn rate reach profitability before bank balance reaches zero.",
    actionable_rule:
      "Simulate cash balance against compound monthly revenue growth. If cash reaches $0 before revenue crosses expenses, you are Default Dead.",
  },
  {
    name: "Productized Service Staircase",
    summary:
      "How to bootstrap from customized agency hours into standardized monthly recurring packages, and finally software.",
    actionable_rule:
      "Standardize scope, turnaround time, and price. Sell the outcome rather than hourly billing to escape the time-for-money trap.",
  },
];

const RECOMMENDED_BOOKS = [
  {
    title: "The Mom Test",
    author: "Rob Fitzpatrick",
    takeaway:
      "The definitive guide on customer discovery interviews without pitching false optimism.",
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    takeaway: "Build-Measure-Learn feedback loops, MVP smoke testing, and validated learning.",
  },
  {
    title: "High Output Management",
    author: "Andy Grove",
    takeaway:
      "Managerial leverage, operational bottlenecks, and production line analogies for startups.",
  },
  {
    title: "$100M Offers",
    author: "Alex Hormozi",
    takeaway:
      "Value equation: Dream outcome × Perceived likelihood / (Time delay × Effort & sacrifice).",
  },
];

function LearningResourcesIndexPage() {
  return (
    <>
      <JsonLd
        schema={[
          collectionPageSchema({
            path: "/learning-resources",
            name: "Founder Learning Resources & Operator Toolkit",
            description: "Master hub for startup validation, calculators, and frameworks.",
            itemCount: 4,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Learning Resources", path: "/learning-resources" },
          ]),
        ]}
      />
      <SiteShell tone="instrument">
        <div className="mx-auto max-w-6xl px-3 py-10 sm:px-4 sm:py-14">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Learning Resources" }]} />

          <div className="mt-6">
            <p className="t-eyebrow">Curated Knowledge Base</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Operator Learning Resources &{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-warm bg-clip-text text-transparent">
                Founder Toolkit
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
              A comprehensive library of empirical frameworks, mathematical calculators, in-depth
              playbooks, and illustrative case studies designed to help you build defensible,
              cash-flow-positive ventures.
            </p>
          </div>

          {/* 4 Core Pillars Bento Grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Pillar 1: Useful Tools */}
            <Link
              to="/calculator"
              className="glass group flex flex-col justify-between rounded-2xl p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Calculator className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-display text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  Interactive Calculators
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  TAM/SAM/SOM, Burn Rate, Runway, Break-Even, CAC, and LTV models running live
                  client-side.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-3 text-xs font-bold uppercase tracking-wider text-primary">
                <span>{CALCULATORS.length} Tools Available</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            {/* Pillar 2: Startup Guides */}
            <Link
              to="/startup-guides"
              className="glass group flex flex-col justify-between rounded-2xl p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-display text-xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
                  Startup Guides
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  In-depth playbooks on customer discovery, market sizing, lean validation, and
                  launch checklists.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-3 text-xs font-bold uppercase tracking-wider text-accent">
                <span>{STARTUP_GUIDES.length} Tactical Guides</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            {/* Pillar 3: Founder Stories */}
            <Link
              to="/founder-stories"
              className="glass group flex flex-col justify-between rounded-2xl p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-display text-xl font-bold tracking-tight text-foreground group-hover:text-emerald-600 transition-colors">
                  Founder Case Studies
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Illustrative case studies of bootstrapped business models, execution timelines,
                  and practical takeaways.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-3 text-xs font-bold uppercase tracking-wider text-emerald-600">
                <span>{CASE_STUDIES.length} Case Studies</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            {/* Pillar 4: Founder Glossary */}
            <Link
              to="/founder-glossary"
              className="glass group flex flex-col justify-between rounded-2xl p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                  <Layers className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-display text-xl font-bold tracking-tight text-foreground group-hover:text-indigo-600 transition-colors">
                  Startup Glossary
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {GLOSSARY_DATA.length} essential venture terms, financial ratios, and unit
                  economics formulas with operator rules of thumb.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-3 text-xs font-bold uppercase tracking-wider text-indigo-600">
                <span>{GLOSSARY_DATA.length} Terms Defined</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>

          {/* Section: Core Frameworks */}
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Essential Operating Frameworks
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Mental models and mathematical benchmarks every founder should internalize before
              scaling:
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {OPERATOR_FRAMEWORKS.map((fw) => (
                <div key={fw.name} className="glass rounded-2xl p-6">
                  <h3 className="font-display text-lg font-bold text-foreground">{fw.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{fw.summary}</p>
                  <div className="mt-4 rounded-xl border border-border/70 bg-background/50 p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                      The Operator Rule:
                    </p>
                    <p className="mt-1 text-xs font-medium text-foreground leading-snug">
                      {fw.actionable_rule}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Recommended Reading */}
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Curated Founder Reading List
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Books that contain high signal-to-noise ratios for modern operators:
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {RECOMMENDED_BOOKS.map((book) => (
                <div
                  key={book.title}
                  className="glass flex flex-col justify-between rounded-2xl p-5"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {book.author}
                    </span>
                    <h3 className="mt-1 font-display text-base font-bold text-foreground">
                      {book.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {book.takeaway}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fast CTA to Idea Library */}
          <div className="glass mt-16 rounded-3xl p-8 sm:p-10 text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to explore researched business blueprints?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Browse hundreds of vetted business ideas complete with market demand drivers,
              competitive density, trend scores, and founder-fit verdicts.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/browse"
                className="glass-btn-light rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-[0.18em]"
              >
                Browse Idea Library
              </Link>
              <Link
                to="/calculator"
                className="rounded-xl border border-border px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary"
              >
                Open Calculators
              </Link>
            </div>
          </div>
        </div>
      </SiteShell>
    </>
  );
}
