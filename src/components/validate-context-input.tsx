import { useId } from "react";

import { VALIDATE_CONTEXT_MAX_LENGTH } from "@/lib/validate-shared";

/**
 * Optional free-text add-on for the Validate flow (see validate-button.tsx).
 * Purely additive: whatever the user types here is appended into the
 * server-built master prompt (validate.server.ts) before the platform tab
 * opens. Never required — Validate works with zero input here, exactly as
 * before this box existed.
 *
 * Deliberately NOT the same thing PROJECT_BRIEF.md Section 8 says never to
 * build ("a visible prompt textbox... copy this and paste it into Claude").
 * That rule is about the server-built master prompt itself staying invisible
 * — it still is, nobody can read or copy it here. This box only holds the
 * user's own words, typed by them, appended server-side; there's nothing to
 * hide about text someone just wrote themselves.
 */
export function ValidateContextInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const remaining = VALIDATE_CONTEXT_MAX_LENGTH - value.length;

  return (
    <div className="glass rounded-2xl px-5 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <label htmlFor={id} className="text-sm font-semibold">
          Add your own context <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
          {Math.max(0, remaining)} left
        </span>
      </div>

      <textarea
        id={id}
        value={value}
        disabled={disabled}
        maxLength={VALIDATE_CONTEXT_MAX_LENGTH}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder="Sharpen it with specifics: your city or target market, the budget you're starting with, skills or an edge you already have, or one angle you want stress-tested hardest."
        className="mt-3 w-full resize-y rounded-xl border border-border/60 bg-background/30 px-3.5 py-3 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
      />

      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        This gets folded straight into your prompt before you hit Continue — nothing you type here
        is saved on our side.
      </p>
    </div>
  );
}
