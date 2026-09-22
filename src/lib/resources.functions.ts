import { createServerFn } from "@tanstack/react-start";

import type { PageResources } from "./resources.server";

/**
 * The one server entry point for the resource block at the foot of a page.
 *
 * `resources.server.ts` is reached through a dynamic import inside the
 * handler — the same pattern `blog.functions.ts` uses — so the twenty
 * markdown guides, the 159 glossary terms and the sixty calculator compute
 * functions it imports never reach the client bundle.
 *
 * A route calls this in its loader, beside whatever else it already loads,
 * and passes the result down. It is NOT called from a component: the picks
 * are random per request, and a component-level call would re-randomise in
 * the browser and throw away the server's markup.
 */
export const getPageResources = createServerFn({ method: "GET" }).handler(
  async (): Promise<PageResources> => {
    const { buildPageResources } = await import("./resources.server");
    return buildPageResources();
  },
);
