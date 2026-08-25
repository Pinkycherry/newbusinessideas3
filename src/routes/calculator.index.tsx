import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { CALCULATORS } from "@/lib/calculators";
import { JsonLd, breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { useElementPointerGroup, useStaggerReveal, useTextReveal } from "@/motion";

const TITLE = "Business Calculators for Indian Founders | BBI";
const DESCRIPTION =
  "Free break-even, startup cost, ROI and funding calculators in rupees. They run in your browser, they show the formula behind every number, and nothing is saved.";

export const Route = createFileRoute("/calculator/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CalculatorIndex,
});

function CalculatorIndex() {
  // One headline reveal per page, on the H1. One stagger, on the grid.
  const titleRef = useTextReveal<HTMLHeadingElement>();
  const gridRef = useStaggerReveal<HTMLDivElement>({ direction: "up", stagger: 0.05 });
  // One pointer listener for the whole grid rather than one per card.
  const pointerRef = useElementPointerGroup<HTMLDivElement>(".mo-card");

  return (
    <>
      <JsonLd
        schema={[
          collectionPageSchema({
            path: "/calculator",
            name: "Business calculators",
            description: DESCRIPTION,
            itemCount: CALCULATORS.length,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Calculators", path: "/calculator" },
          ]),
        ]}
      />
      <SiteShell>
        <div className="mx-auto max-w-6xl px-3 py-12 sm:px-4">
          {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Calculators" }]} />
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-accent">
            Calculators
          </p>
          <h1 ref={titleRef} className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Small tools that answer{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-warm bg-clip-text text-transparent">
              one question each
            </span>
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Every number here is worked out in your browser from what you type, in rupees. Each
            answer shows the formula under it, so you can check it by hand. Nothing is sent
            anywhere, nothing is stored, and no figure is filled in for you.
          </p>

          <div
            ref={(node) => {
              gridRef.current = node;
              pointerRef.current = node;
            }}
            className="mt-10 grid gap-5 sm:grid-cols-2"
          >
            {CALCULATORS.map((calculator) => (
              <Link
                key={calculator.slug}
                to="/calculator/$slug"
                params={{ slug: calculator.slug }}
                className="glass mo-card flex h-full flex-col gap-3 rounded-2xl p-6"
              >
                <h2 className="font-display text-xl font-bold tracking-tight">
                  {calculator.title} <span className="text-accent">{calculator.highlight}</span>
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {calculator.answers}
                </p>
                <p className="mt-auto pt-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {calculator.fields.length} things to fill in
                </p>
              </Link>
            ))}
          </div>

          <div className="glass mt-10 rounded-2xl px-5 py-6 sm:px-7">
            <h2 className="font-display text-lg font-bold tracking-tight">
              How to read the answers
            </h2>
            <ul className="mt-3 space-y-1 text-sm leading-relaxed text-muted-foreground">
              <li className="mo-row -mx-2 flex gap-2.5 rounded-lg px-2 py-1.5">
                <span
                  aria-hidden
                  className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                />
                <span>
                  A calculator only knows what you typed. It has no idea what your market charges,
                  and it will not tell you whether a number is good or bad.
                </span>
              </li>
              <li className="mo-row -mx-2 flex gap-2.5 rounded-lg px-2 py-1.5">
                <span
                  aria-hidden
                  className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                />
                <span>
                  When a sum cannot be done — dividing by zero, or a price that never covers its
                  cost — the tool says so in words instead of showing a broken number.
                </span>
              </li>
              <li className="mo-row -mx-2 flex gap-2.5 rounded-lg px-2 py-1.5">
                <span
                  aria-hidden
                  className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                />
                <span>
                  Results change as you type. There is no button to press and no result to wait for.
                </span>
              </li>
            </ul>
          </div>
          {/* EDITABLE SECTION END */}
        </div>
      </SiteShell>
    </>
  );
}
