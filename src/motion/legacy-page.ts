/**
 * The homepage keeps its original motion. Every other page runs the plain
 * site system (2026-09-24 rollout): one-time reveals, no pointer-following
 * layers, no scroll-scrubbed properties. The founder kept the homepage out of
 * that rollout, so the shared hooks below check this before they do anything
 * and fall back to the calm behaviour everywhere else.
 *
 * Only ever called inside effects and event handlers, never during render,
 * so server and client markup are identical.
 */
export function isLegacyMotionPage(): boolean {
  return typeof window !== "undefined" && window.location.pathname === "/";
}
