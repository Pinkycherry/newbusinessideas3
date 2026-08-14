export type ValidatePlatform = "claude" | "perplexity";

export const VALIDATE_PLATFORMS: { id: ValidatePlatform; label: string }[] = [
  { id: "claude", label: "Claude" },
  { id: "perplexity", label: "Perplexity" },
];

/**
 * Ceiling on the optional user-supplied context box (validate-context-input.tsx).
 * Shared between client (char counter, `maxLength`) and server (input
 * validator in validate.functions.ts) so the two never drift apart.
 */
export const VALIDATE_CONTEXT_MAX_LENGTH = 600;
