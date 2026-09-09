import { useId, useState } from "react";

import { useStaggerReveal } from "@/motion";
import { JsonLd } from "@/lib/schema";
import type { CategoryFaq } from "@/lib/faqs.functions";

/**
 * One FAQ renderer, shared by the hub pages and available to the idea page.
 *
 * Disclosure is a real button with `aria-expanded` and a labelled region
 * rather than a `<details>`, because the open/close has to animate on
 * transform and opacity only. Animating `height` would force layout on every
 * frame — the exact class of regression this codebase already documents
 * catching once, in the heading-glow block of styles.css.
 *
 * The panel is therefore always in the DOM, clipped by a grid-rows trick that
 * animates `grid-template-rows` between `0fr` and `1fr`. That is the one
 * property that can size to unknown content without a JavaScript measurement,
 * and browsers composite it without a full relayout of the page around it.
 */
export function FaqList({ faqs }: { faqs: CategoryFaq[] }) {
  const listRef = useStaggerReveal<HTMLDivElement>({ distance: 12, stagger: 0.04 });

  if (faqs.length === 0) return null;

  return (
    <div ref={listRef} className="mt-8 grid gap-3">
      {faqs.map((faq) => (
        <FaqItem key={faq.id} faq={faq} />
      ))}
    </div>
  );
}

function FaqItem({ faq }: { faq: CategoryFaq }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className="glass rounded-2xl px-5 py-4 sm:px-6">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="mo-row flex w-full items-start justify-between gap-4 rounded-lg py-1 text-left text-sm font-semibold text-foreground"
        >
          <span className="min-w-0 leading-snug">{faq.question}</span>
          <span
            aria-hidden
            className="mt-0.5 shrink-0 text-accent transition-transform duration-200"
            style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          >
            +
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="pt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * FAQPage structured data, emitted ONLY when there is at least one real
 * question. An empty `mainEntity` is a structured-data error, and a page that
 * declares itself an FAQ while holding no questions is worse for search than
 * one that says nothing.
 */
export function FaqSchema({ faqs }: { faqs: CategoryFaq[] }) {
  if (faqs.length === 0) return null;

  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  // Rendered through the shared JsonLd helper rather than a second
  // dangerouslySetInnerHTML script tag, so every structured-data block on the
  // site is emitted the same way.
  return <JsonLd schema={json} />;
}

/**
 * What renders when a category's pool has not been generated yet.
 *
 * This is the state the site is in right now for all 14 categories, so it is
 * not an edge case — it is the default view until the pipeline runs. It says
 * plainly that the questions are still being researched, and hands the reader
 * somewhere real to go instead. It must never show a placeholder question:
 * inventing content to fill a blank panel is exactly what this project has
 * had to undo four separate times.
 */
export function FaqEmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass mt-8 rounded-3xl px-6 py-8 sm:px-8">
      <p className="text-sm leading-relaxed text-muted-foreground">
        We are still writing the questions for this category. We would rather leave this empty than
        fill it with answers we have not checked, so nothing goes here until it is real.
      </p>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">{children}</div>
    </div>
  );
}
