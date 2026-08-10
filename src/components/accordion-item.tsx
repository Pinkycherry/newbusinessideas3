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
  const padY = size === "base" ? "py-5" : "py-4";

  return (
    <div className={padY}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex w-full cursor-pointer items-center justify-between gap-6 text-left font-semibold text-foreground transition-colors hover:text-primary ${questionSize}`}
      >
        {question}
        <span
          aria-hidden
          className={`shrink-0 text-accent transition-transform duration-300 motion-reduce:transition-none ${
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
          <p className={`mt-3 leading-relaxed text-muted-foreground ${answerSize}`}>{answer}</p>
        </div>
      </div>
    </div>
  );
}
