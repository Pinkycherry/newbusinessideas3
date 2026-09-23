import { createFileRoute } from "@tanstack/react-router";

/**
 * /version.json — which commit Cloudflare actually deployed.
 *
 * Two Claude accounts work this repo in turns, and a push to main is not the
 * same thing as a live site: a build can still be running, or can have failed.
 * `scripts/session-brief.mjs` reads this at the start of every session and
 * compares it with main, so nobody has to guess what is live.
 *
 * The values are stamped at build time in vite.config.ts from Workers Builds'
 * WORKERS_CI_COMMIT_SHA (falling back to `git rev-parse HEAD`). Nothing here is
 * secret: a commit hash and a timestamp. `noindex` keeps it out of search.
 */
declare const __BBI_COMMIT__: string | undefined;
declare const __BBI_BUILT_AT__: string | undefined;

const BODY = () =>
  JSON.stringify({
    commit: typeof __BBI_COMMIT__ === "string" ? __BBI_COMMIT__ : "unknown",
    builtAt: typeof __BBI_BUILT_AT__ === "string" ? __BBI_BUILT_AT__ : "unknown",
  });

export const Route = createFileRoute("/version.json")({
  server: {
    handlers: {
      GET: async () =>
        new Response(BODY(), {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Robots-Tag": "noindex",
          },
        }),
    },
  },
});
