export type ValidatePlatform = "claude" | "perplexity";

export const VALIDATE_PLATFORMS: { id: ValidatePlatform; label: string }[] = [
  { id: "claude", label: "Claude" },
  { id: "perplexity", label: "Perplexity" },
];
