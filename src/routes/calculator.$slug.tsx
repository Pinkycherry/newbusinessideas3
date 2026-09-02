import { useId, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import {
  CALCULATORS,
  defaultInputs,
  fieldGroups,
  findCalculator,
  readValues,
  type Calculator,
  type FieldIssue,
  type Reading,
} from "@/lib/calculators";
import { JsonLd, breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { useStaggerReveal, useTextReveal } from "@/motion";

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
    <SiteShell>
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
  const [typed, setTyped] = useState<Record<string, string>>(() => defaultInputs(calculator));

  // Read, check, then compute — in that order, every render. The arithmetic is
  // a few subtractions on at most ten numbers, so it runs on each keystroke
  // and the answer is on screen in the same paint as the character. Nothing
  // here is debounced, animated or counted up: a number the visitor is driving
  // must never lag behind their own typing.
  const { values, issues } = readValues(calculator.fields, typed);
  const readings = issues.length === 0 ? calculator.compute(values) : [];
  const issueFor = (key: string): FieldIssue | undefined => issues.find((i) => i.key === key);

  const titleRef = useTextReveal<HTMLHeadingElement>();
  const fieldsRef = useStaggerReveal<HTMLDivElement>({
    selector: "[data-field]",
    distance: 12,
    stagger: 0.035,
  });

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
      <SiteShell>
        <div className="mx-auto max-w-6xl px-3 py-12 sm:px-4">
          {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              { label: "Calculators", to: "/calculator" },
              { label: pageName },
            ]}
          />
          <p className="mt-6 t-eyebrow">
            Calculator
          </p>
          <h1 ref={titleRef} className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {calculator.title}{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-warm bg-clip-text text-transparent">
              {calculator.highlight}
            </span>
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{calculator.intro}</p>

          <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)]">
            <form
              className="glass mo-card rounded-2xl px-5 py-6 sm:px-7"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-display text-lg font-bold tracking-tight">Your numbers</h2>
                <button
                  type="button"
                  onClick={() => setTyped(defaultInputs(calculator))}
                  className="rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:border-primary hover:text-foreground"
                >
                  Reset
                </button>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The boxes start with example figures so the page is never blank. Replace them with
                yours — the answers change as you type.
              </p>

              <div ref={fieldsRef} className="mt-6 space-y-7">
                {fieldGroups(calculator).map(({ group, fields }) => (
                  <fieldset key={group} className="border-0 p-0">
                    <legend className="t-eyebrow">
                      {group}
                    </legend>
                    <div className="mt-4 grid gap-5 sm:grid-cols-2">
                      {fields.map((field) => (
                        <FieldInput
                          key={field.key}
                          field={field}
                          value={typed[field.key] ?? ""}
                          issue={issueFor(field.key)}
                          onChange={(next) => setTyped((prev) => ({ ...prev, [field.key]: next }))}
                        />
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
            </form>

            <div className="lg:sticky lg:top-24">
              <div aria-live="polite" className="glass mo-card rounded-2xl px-5 py-6 sm:px-7">
                {issues.length > 0 ? (
                  <>
                    <h2 className="font-display text-lg font-bold tracking-tight">
                      Nothing to work out yet
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Every box has to hold a real number before the sums can run. Right now:
                    </p>
                    <ul className="mt-4 space-y-1">
                      {issues.map((issue) => (
                        <li
                          key={issue.key}
                          className="mo-row -mx-2 rounded-lg px-2 py-1.5 text-sm leading-relaxed"
                        >
                          <span className="font-semibold text-foreground">{issue.label}</span>
                          <span className="text-muted-foreground"> — {issue.message}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <h2 className="font-display text-lg font-bold tracking-tight">
                      What this comes to
                    </h2>
                    <ul className="mt-4 space-y-2">
                      {readings.map((reading) => (
                        <ResultRow key={reading.key} reading={reading} />
                      ))}
                    </ul>
                    <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                      These answers come only from the figures above. This page holds no benchmark,
                      no market average and no opinion on whether a number is good — it does the
                      arithmetic and shows its working.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="glass mt-10 rounded-2xl px-5 py-6 sm:px-7">
            <h2 className="font-display text-lg font-bold tracking-tight">Other calculators</h2>
            <ul className="mt-3 space-y-1">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link
                    to="/calculator/$slug"
                    params={{ slug: other.slug }}
                    className="mo-row -mx-2 flex flex-col gap-0.5 rounded-lg px-2 py-2"
                  >
                    <span className="text-sm font-semibold">
                      {other.title} {other.highlight}
                    </span>
                    <span className="text-xs leading-relaxed text-muted-foreground">
                      {other.answers}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* EDITABLE SECTION END */}
        </div>
      </SiteShell>
    </>
  );
}

function FieldInput({
  field,
  value,
  issue,
  onChange,
}: {
  field: Calculator["fields"][number];
  value: string;
  issue: FieldIssue | undefined;
  onChange: (next: string) => void;
}) {
  const id = useId();
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;

  return (
    <div data-field>
      <label htmlFor={id} className="block text-sm font-semibold">
        {field.label} <span className="font-normal text-muted-foreground">({field.unitLabel})</span>
      </label>
      <div className="mt-1.5 flex items-center gap-2 rounded-md border border-input bg-card px-3 focus-within:border-primary">
        {field.prefix && (
          <span aria-hidden className="text-sm text-muted-foreground">
            {field.prefix}
          </span>
        )}
        <input
          id={id}
          name={field.key}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={issue ? `${helpId} ${errorId}` : helpId}
          aria-invalid={issue ? true : undefined}
          className="w-full min-w-0 bg-transparent py-2.5 text-sm tabular-nums outline-none"
        />
        {field.suffix && (
          <span aria-hidden className="whitespace-nowrap text-xs text-muted-foreground">
            {field.suffix}
          </span>
        )}
      </div>
      <p id={helpId} className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
        {field.help}
      </p>
      {issue && (
        <p id={errorId} className="mt-1 text-xs font-medium text-destructive">
          {issue.message}
        </p>
      )}
    </div>
  );
}

function ResultRow({ reading }: { reading: Reading }) {
  const blocked = reading.status === "blocked";
  return (
    <li className="mo-row -mx-2 rounded-xl px-2 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {reading.label}
      </p>
      <p
        className={`mt-1 font-display font-bold tabular-nums ${
          blocked
            ? "text-lg leading-snug text-muted-foreground"
            : reading.primary
              ? "text-3xl text-accent"
              : "text-xl"
        }`}
      >
        {reading.display}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{reading.formula}</p>
      {reading.note && (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground/80">{reading.note}</p>
      )}
    </li>
  );
}
