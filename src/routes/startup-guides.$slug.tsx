import { createFileRoute, Link } from "@tanstack/react-router";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Share2,
  Calculator,
} from "lucide-react";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { ExploreRail } from "@/components/explore-rail";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/schema";
import { getGuideBySlug, STARTUP_GUIDES } from "@/lib/guides-data";

export const Route = createFileRoute("/startup-guides/$slug")({
  head: ({ params }) => {
    const guide = getGuideBySlug(params.slug);
    const title = guide ? `${guide.title} | BBI Guide` : "Startup Guide | BBI – Bro Business Ideas";
    const description = guide?.description ?? "Practical tactical playbook for startup founders.";
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
  component: StartupGuideDetailPage,
});

function StartupGuideDetailPage() {
  const { slug } = Route.useParams();
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return (
      <SiteShell tone="instrument">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Guide not found</h1>
          <p className="mt-2 text-muted-foreground">The playbook you requested does not exist.</p>
          <Link
            to="/startup-guides"
            className="glass-btn-light mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Guides
          </Link>
        </div>
      </SiteShell>
    );
  }

  const currentIndex = STARTUP_GUIDES.findIndex((g) => g.slug === guide.slug);
  const prevGuide = currentIndex > 0 ? STARTUP_GUIDES[currentIndex - 1] : null;
  const nextGuide =
    currentIndex < STARTUP_GUIDES.length - 1 ? STARTUP_GUIDES[currentIndex + 1] : null;

  return (
    <>
      <JsonLd
        schema={[
          articleSchema({
            path: `/startup-guides/${guide.slug}`,
            headline: guide.title,
            description: guide.description,
            datePublished: guide.publishedDate,
            categoryName: guide.category,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Startup Guides", path: "/startup-guides" },
            { name: guide.title, path: `/startup-guides/${guide.slug}` },
          ]),
        ]}
      />
      <SiteShell tone="instrument">
        <div className="mx-auto max-w-4xl px-3 py-10 sm:px-6 sm:py-14">
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              { label: "Startup Guides", to: "/startup-guides" },
              { label: guide.title },
            ]}
          />

          {/* Article Header */}
          <header className="mt-8 border-b border-border/70 pb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                {guide.category}
              </span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {guide.readTime}
                </span>
                <span>·</span>
                <span>{guide.wordCount} words</span>
                <span>·</span>
                <span>By {guide.author}</span>
              </div>
            </div>

            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {guide.title}
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {guide.description}
            </p>
          </header>

          {/* Key Takeaways Callout Card */}
          <section className="glass my-8 rounded-2xl border-l-4 border-primary p-6 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Core Framework Principles
            </p>
            <div className="mt-4 space-y-3">
              {guide.keyTakeaways.map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground"
                >
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Markdown Content */}
          <article className="prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed text-foreground [&_img]:rounded-xl [&_img]:shadow-md [&_img]:border [&_img]:border-border/50 [&_img]:my-8 [&_img]:w-full [&_img]:object-cover [&_img]:aspect-[1200/630]">
            <div className="space-y-6 [&_h1]:hidden [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_p]:text-[1.05rem] [&_p]:leading-relaxed [&_p]:text-foreground/90 [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:text-foreground/90 [&_strong]:font-bold [&_strong]:text-foreground [&_code]:rounded [&_code]:bg-muted/70 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_hr]:my-8 [&_hr]:border-border/70">
              <Markdown
                rehypePlugins={[rehypeRaw]}
                components={{
                  img: ({ node, ...props }) => (
                    <img {...props} loading="lazy" decoding="async" className="mx-auto" />
                  ),
                }}
                children={guide.rawMarkdown}
              />
            </div>
          </article>

          {/* Cross-Tool CTA */}
          <div className="glass my-12 flex flex-col justify-between gap-4 rounded-2xl border border-primary/30 p-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-accent">
                Related Operator Utility
              </p>
              <h3 className="font-display text-lg font-bold">
                Model your numbers in the interactive calculator
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Test customer counts, contract values, and conversion rates live.
              </p>
            </div>
            <Link
              to="/calculator"
              className="glass-btn-light flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider"
            >
              <Calculator className="h-4 w-4" />
              Open Calculators
            </Link>
          </div>

          {/* Next / Previous Navigation */}
          <nav className="mt-12 grid gap-4 border-t border-border/80 pt-6 sm:grid-cols-2">
            {prevGuide ? (
              <Link
                to="/startup-guides/$slug"
                params={{ slug: prevGuide.slug }}
                className="glass flex min-w-0 flex-col rounded-xl p-4 transition-colors hover:border-primary/50"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  ← Previous Guide
                </span>
                <span className="mt-1 w-full font-semibold text-foreground truncate">
                  {prevGuide.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextGuide ? (
              <Link
                to="/startup-guides/$slug"
                params={{ slug: nextGuide.slug }}
                className="glass flex min-w-0 flex-col items-end rounded-xl p-4 text-right transition-colors hover:border-primary/50"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Next Guide →
                </span>
                <span className="mt-1 w-full font-semibold text-foreground truncate">
                  {nextGuide.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </nav>

          <ExploreRail exclude="guides" heading="Keep exploring" />
        </div>
      </SiteShell>
    </>
  );
}
