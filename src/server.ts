import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { isBlockedAgent } from "./lib/ai-bots";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

/**
 * AdSense approval (6 Nov 2026): the free Workers plan stops a request at ~10 ms of CPU, and a
 * full page render needs ~20 ms, so about a third of renders failed with Cloudflare error 1102.
 * Public pages are the same for every visitor, so a rendered page is kept in Cloudflare's edge
 * cache for an hour and served from there without rendering again.
 */
const EDGE_TTL_SECONDS = 3600;

function isCacheablePage(request: Request): boolean {
  if (request.method !== "GET") return false;
  const url = new URL(request.url);
  if (url.pathname.startsWith("/_serverFn") || url.pathname.startsWith("/api")) return false;
  if (url.search) return false;
  const cookie = request.headers.get("cookie") ?? "";
  return !/sb-|auth|session/i.test(cookie);
}

function edgeCache(): Cache | undefined {
  const store = (globalThis as { caches?: { default?: Cache } }).caches;
  return store?.default;
}

async function renderAndMaybeCache(request: Request, env: unknown, ctx: unknown): Promise<Response> {
  const handler = await getServerEntry();
  const response = await normalizeCatastrophicSsrResponse(await handler.fetch(request, env, ctx));
  const cache = edgeCache();
  const type = response.headers.get("content-type") ?? "";
  const storable =
    (response.status === 200 && (type.includes("text/html") || type.includes("xml"))) ||
    response.status === 301;
  if (cache && storable && !response.headers.has("set-cookie")) {
    const copy = new Response(response.clone().body, response);
    copy.headers.set("cache-control", `public, max-age=${EDGE_TTL_SECONDS}`);
    // Awaited: under nitro the worker ctx is not always passed through, so waitUntil is unreliable.
    await cache.put(request, copy).catch((error: unknown) => console.error("edge cache put", error));
  }
  return response;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    // Content protection: AI crawlers and site downloaders get a 403 (robots.txt stays readable).
    if (isBlockedAgent(request.headers.get("user-agent")) && new URL(request.url).pathname !== "/robots.txt") {
      return new Response("Automated copying of bbusiness.online is not allowed.", {
        status: 403,
        headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
      });
    }
    try {
      if (isCacheablePage(request)) {
        const cache = edgeCache();
        const hit = cache ? await cache.match(request) : undefined;
        if (hit) {
          const served = new Response(hit.body, hit);
          served.headers.set("cache-control", "public, max-age=0, must-revalidate");
          served.headers.set("x-bbi-edge", "hit");
          return served;
        }
        return await renderAndMaybeCache(request, env, ctx);
      }
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
