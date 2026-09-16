// PROJECT_BRIEF.md Section 3.3 (2026-09-16) — four platforms, ChatGPT
// deliberately excluded. Was Claude + Perplexity only; Gemini and Grok
// added by explicit founder decision, reversing an earlier deferral.
export type ValidatePlatform = "claude" | "perplexity" | "gemini" | "grok";

export const VALIDATE_PLATFORMS: { id: ValidatePlatform; label: string }[] = [
  { id: "claude", label: "Claude" },
  { id: "perplexity", label: "Perplexity" },
  { id: "gemini", label: "Gemini" },
  { id: "grok", label: "Grok" },
];

/**
 * Ceiling on the optional user-supplied context box (validate-context-input.tsx).
 * Shared between client (char counter, `maxLength`) and server (input
 * validator in validate.functions.ts) so the two never drift apart.
 */
export const VALIDATE_CONTEXT_MAX_LENGTH = 600;
