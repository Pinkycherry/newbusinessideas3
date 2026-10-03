import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { CalculatorWidget } from "@/components/calculator-widget";
import { CALCULATORS, findCalculator, type Calculator } from "@/lib/calculators";
import { JsonLd, breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { useDepthScene, useTextReveal } from "@/motion";

/**
 * One route for every calculator. It renders whatever `src/lib/calculators.ts`
 * describes and contains no arithmetic of its own — a fifth calculator needs
 * one new entry in that registry and no change to this file.
 *
 * Everything happens in the browser. There is no server function, no database
 * read and no fetch: the loader below only looks a slug up in an array that is
 * already in the bundle, so it can answer "no such calculator" before the page
 * paints.
 */
export const Route = createFileRoute("/calculator/$slug")({
  loader: ({ params }) => {
    const calculator = findCalculator(params.slug);
    if (!calculator) throw notFound();
    return { slug: calculator.slug, name: `${calculator.title} ${calculator.highlight}` };
  },
  head: ({ loaderData }) => {
    const calculator = loaderData ? findCalculator(loaderData.slug) : undefined;
    if (!calculator) {
      return {
        meta: [{ title: "Calculator not found | BBI" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${calculator.title} ${calculator.highlight} — India, in rupees | BBI`;
    return {
      meta: [
        { title },
        { name: "description", content: calculator.description },
        { property: "og:title", content: title },
        { property: "og:description", content: calculator.description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CalculatorRoute,
  notFoundComponent: () => (
    <SiteShell tone="instrument">
      <div className="mx-auto max-w-3xl px-4 py-24">
        <h1 className="text-2xl font-bold">That calculator doesn&apos;t exist</h1>
        <p className="mt-2 text-muted-foreground">
          Nothing is published at this address. The full list is on the calculators page.
        </p>
        <Link to="/calculator" className="mo-link mt-5 inline-block font-semibold text-primary">
          See every calculator
        </Link>
      </div>
    </SiteShell>
  ),
});

function CalculatorRoute() {
  const { slug } = Route.useParams();
  const calculator = findCalculator(slug);
  if (!calculator) throw notFound();
  // Keyed on the slug so moving between calculators starts from that
  // calculator's own defaults instead of carrying the last one's typing over.
  return <CalculatorPage key={calculator.slug} calculator={calculator} />;
}

function CalculatorPage({ calculator }: { calculator: Calculator }) {
  const titleRef = useTextReveal<HTMLHeadingElement>();
  // Masthead depth scene: one shared observer + one shared frame callback
  // for the whole header. Cursor depth on fine pointers, scroll depth on touch
  // (see motion.css, coarse-pointer block).
  const sceneRef = useDepthScene<HTMLDivElement>({ strength: 0.5 });

  const pageName = `${calculator.title} ${calculator.highlight}`;
  const path = `/calculator/${calculator.slug}`;
  const others = CALCULATORS.filter((c) => c.slug !== calculator.slug);

  return (
    <>
      <JsonLd
        schema={[
          webPageSchema({ path, name: pageName, description: calculator.description }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Calculators", path: "/calculator" },
            { name: pageName, path },
          ]),
        ]}
      />
      <SiteShell tone="instrument">
        <div ref={sceneRef} className="cx-scene mx-auto max-w-6xl px-3 py-12 sm:px-4">
          {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              { label: "Calculators", to: "/calculator" },
              { label: pageName },
            ]}
          />
          <p className="mt-6 t-eyebrow">Calculator</p>
          <h1
            ref={titleRef}
            className="cx-layer cx-z3 mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl"
          >
            {calculator.title}{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-warm bg-clip-text text-transparent">
              {calculator.highlight}
            </span>
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{calculator.intro}</p>

          <CalculatorWidget calculator={calculator} headingLevel="h2" />

          <div className="glass mt-10 rounded-2xl px-5 py-6 sm:px-7">
            <h2 className="font-display text-lg font-bold tracking-tight">Other calculators</h2>
            {/* Was a single-column list -- 59 full-width rows, each with a
                title and a two-line description, made this the longest
                scroll on the page for what is really just a set of links.
                A dense grid of short cards gets the same 59 options into a
                fraction of the height, and drops the description (already
                on each calculator's own page) rather than truncate it. */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {others.map((other) => (
                <Link
                  key={other.slug}
                  to="/calculator/$slug"
                  params={{ slug: other.slug }}
                  className="rounded-lg border border-border/70 bg-card/50 px-3 py-2.5 text-xs font-semibold leading-snug transition-colors duration-200 hover:border-primary/60 hover:text-primary"
                >
                  {other.title} {other.highlight}
                </Link>
              ))}
            </div>
          </div>
          {/* EDITABLE SECTION END */}
        </div>
      </SiteShell>
    </>
  );
}
