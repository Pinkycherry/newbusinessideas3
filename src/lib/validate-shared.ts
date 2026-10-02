// PROJECT_BRIEF.md Section 3.3 — four platforms. 2026-10-02: ChatGPT replaces
// Gemini in the same slot, by explicit founder decision (this picker is the one
// place the site names a destination; ChatGPT was excluded before today).
export type ValidatePlatform = "claude" | "perplexity" | "chatgpt" | "grok";

export const VALIDATE_PLATFORMS: { id: ValidatePlatform; label: string }[] = [
  { id: "claude", label: "Claude" },
  { id: "perplexity", label: "Perplexity" },
  { id: "chatgpt", label: "ChatGPT" },
  { id: "grok", label: "Grok" },
];

/**
 * Ceiling on the optional user-supplied context box (validate-context-input.tsx).
 * Shared between client (char counter, `maxLength`) and server (input
 * validator in validate.functions.ts) so the two never drift apart.
 */
export const VALIDATE_CONTEXT_MAX_LENGTH = 600;
