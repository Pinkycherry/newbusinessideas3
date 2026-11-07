/**
 * Content protection (founder, 7 Nov 2026): AI crawlers and site downloaders may not read or copy
 * bbusiness.online. Googlebot, AdsBot-Google, Mediapartners-Google (AdSense) and Bingbot stay allowed.
 * Used by robots.txt (rules) and src/server.ts (a 403 for any of these user agents, so the block
 * travels with the code, not only with Cloudflare settings).
 */
export const AI_CRAWLERS = [
  "GPTBot", "ChatGPT-User", "OAI-SearchBot",
  "ClaudeBot", "Claude-Web", "Claude-User", "Claude-SearchBot", "anthropic-ai",
  "CCBot", "PerplexityBot", "Perplexity-User", "Bytespider", "Amazonbot",
  "meta-externalagent", "meta-externalfetcher", "FacebookBot",
  "cohere-ai", "cohere-training-data-crawler", "Diffbot", "Omgilibot", "Omgili",
  "ImagesiftBot", "YouBot", "Timpibot", "AI2Bot", "Ai2Bot-Dolma", "DuckAssistBot",
  "MistralAI-User", "PanguBot", "Webzio-Extended", "VelenPublicWebCrawler", "iaskspider",
  "ICC-Crawler", "Kangaroo Bot", "Sidetrade indexer bot", "QualifiedBot", "Brightbot",
] as const;

/** robots.txt-only tokens: they opt a site out of AI training without a separate crawler. */
export const AI_ROBOTS_TOKENS = ["Google-Extended", "Applebot-Extended"] as const;

/** Whole-site downloaders and scraping libraries. */
const DOWNLOADERS = ["HTTrack", "WebCopier", "WebZIP", "Offline Explorer", "SiteSucker", "Teleport Pro", "Wget", "Scrapy", "python-requests", "aiohttp", "Go-http-client", "node-fetch", "axios/"];

const BLOCK_RE = new RegExp([...AI_CRAWLERS, ...DOWNLOADERS].map((s) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")).join("|"), "i");

export function isBlockedAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return BLOCK_RE.test(userAgent);
}
