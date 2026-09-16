import { useState } from "react";

/**
 * Animated FAQ accordion row. Replaces native <details>/<summary> (which the
 * 4 FAQ blocks on the homepage used — instant, unanimatable open/close)
 * with a button + CSS grid-template-rows transition, the standard technique
 * for animating to an unknown/auto content height without JS measuring the
 * element. This is a one-shot, user-triggered ~300ms transition, not a
 * continuous background animation, so animating a layout-affecting grid
 * track here doesn't repeat the infinite-loop text-shadow/box-model
 * mistake caught earlier this session — that concern is about animations
 * that run forever, not a single click response.
 */
export function AccordionItem({
  question,
  answer,
  size = "base",
}: {
  question: string;
  answer: string;
  size?: "sm" | "base";
}) {
  const [open, setOpen] = useState(false);
  const questionSize = size === "base" ? "text-base sm:text-lg" : "text-sm sm:text-base";
  const answerSize = size === "base" ? "text-sm sm:text-base" : "text-sm";
  const padY = size === "base" ? "py-4" : "py-3";

  return (
    <div className="bbi-faq-item">
      {/* `bbi-bare` opts this row OUT of the site-wide action treatment. That
          treatment is for buttons that look like buttons: it draws a
          travelling band along the border and fills the plate white under the
          pointer. On a full-width FAQ row it read as a light streak crossing
          the question at rest and as a solid white bar on hover. A disclosure
          row is not a button in that sense — it is a line of text you open. */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`bbi-bare bbi-faq-row flex w-full cursor-pointer items-center justify-between gap-6 px-4 text-left font-semibold ${padY} ${questionSize}`}
      >
        {question}
        <span
          aria-hidden
          className={`bbi-faq-mark shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          {/* Matches the row's own inset so the answer lines up under the
              question instead of starting 16px to its left. */}
          <p className={`mt-2 px-4 pb-1 leading-relaxed text-muted-foreground ${answerSize}`}>
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
