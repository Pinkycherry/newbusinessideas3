import { useId, useState } from "react";

import {
  defaultInputs,
  fieldGroups,
  readValues,
  type Calculator,
  type FieldIssue,
  type Reading,
} from "@/lib/calculators";
import { useStaggerReveal } from "@/motion";

/**
 * The form-and-results pair extracted out of `calculator.$slug.tsx` so the
 * same live widget can be dropped into a blog post via `CalculatorEmbed`
 * (see `blog-embeds.tsx`) without duplicating the arithmetic, the field
 * validation, or the "boxes start with example figures" UX. The full
 * `/calculator/$slug` page still owns the breadcrumbs, hero copy, and the
 * "other calculators" grid around it — those stay page-only.
 */
export function CalculatorWidget({
  calculator,
  headingLevel = "h3",
}: {
  calculator: Calculator;
  /** `/calculator/$slug` passes "h2" to sit under its own `h1`; a blog embed
   *  keeps the "h3" default so it never outranks the post's own `h2`s. */
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const [typed, setTyped] = useState<Record<string, string>>(() => defaultInputs(calculator));

  const { values, issues } = readValues(calculator.fields, typed);
  const readings = issues.length === 0 ? calculator.compute(values) : [];
  const issueFor = (key: string): FieldIssue | undefined => issues.find((i) => i.key === key);

  const fieldsRef = useStaggerReveal<HTMLDivElement>({
    selector: "[data-field]",
    distance: 12,
    stagger: 0.035,
  });

  return (
    <div className="mt-2 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)]">
      <form
        className="glass mo-card rounded-2xl px-5 py-6 sm:px-7"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <Heading className="font-display text-lg font-bold tracking-tight">Your numbers</Heading>
          <button
            type="button"
            onClick={() => setTyped(defaultInputs(calculator))}
            className="rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:border-primary hover:text-foreground"
          >
            Reset
          </button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The boxes start with example figures so this is never blank. Replace them with yours — the
          answers change as you type.
        </p>

        <div ref={fieldsRef} className="mt-6 space-y-7">
          {fieldGroups(calculator).map(({ group, fields }) => (
            <fieldset key={group} className="border-0 p-0">
              <legend className="t-eyebrow">{group}</legend>
              <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-5">
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
              <Heading className="font-display text-lg font-bold tracking-tight">
                Nothing to work out yet
              </Heading>
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
              <Heading className="font-display text-lg font-bold tracking-tight">
                What this comes to
              </Heading>
              <ul className="mt-4 space-y-2">
                {readings.map((reading) => (
                  <ResultRow key={reading.key} reading={reading} />
                ))}
              </ul>
              <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                These answers come only from the figures above. This holds no benchmark, no market
                average and no opinion on whether a number is good — it does the arithmetic and
                shows its working.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
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
