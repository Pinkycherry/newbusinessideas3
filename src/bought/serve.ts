import menuPanels from "./menu-panels.json";
import sharedFooterSource from "@/components/v2/v2.css?raw";
import glassCss from "@/components/home/glass.css?raw";
import emberCss from "@/components/home/ember.css?raw";

/**
 * Footer rules only (plus the footer logo), taken from the shared v2.css so the
 * raw purchased pages show the exact footer the React routes render, without
 * pulling header or page rules into pages that keep their own header.
 */
const sharedFooterStyles = sharedFooterSource
  .split("\n")
  .filter((line) => /^(\.v2-footer|\.mm-brand[ {]|@media[^{]*\{ \.v2-footer)/.test(line))
  .concat(".v2-footer, .v2-footer .v2-footer-bottom { border-top-color: transparent !important; border-bottom-color: transparent !important; }")
  .join("\n")
  .replaceAll("var(--primary)", "var(--primary, #4643ba)");

/**
 * Every route shows one footer: the shared site footer (src/components/v2/frame.tsx
 * `Footer`, rendered to menu-panels.json). Swap the seller's page footer for it.
 */
function withSharedFooter(html: string): string {
  let page = html.replace(/<footer\b[^>]*role="contentinfo"[^>]*>[\s\S]*?<\/footer>/, menuPanels.footer);
  if (!page.includes('class="v2 v2-footer"')) return page;
  if (!page.includes("bbi-shared-header-styles") && !page.includes("bbi-shared-footer-styles")) {
    page = page.replace("</head>", `<style id="bbi-shared-footer-styles">${sharedFooterStyles}</style></head>`);
  }
  return page;
}

/**
 * AdSense approval (founder, 6 Nov 2026): these are hub and topic pages on bbusiness.online and are
 * indexed. The staging-only noindex was removed; any robots tag left in a snapshot is dropped.
 */
function withNoindex(html: string): string {
  return html.replace(/<meta[^>]+name=["']robots["'][^>]*>/gi, "");
}

/**
 * Serve a purchased page snapshot without redesigning its original frame.
 * Preserve the supplied header, page markup, copy and interactions.
 * Only namespace the page-local image, stylesheet and script paths so each
 * imported folder can keep its own editable assets.
 */
export function boughtPage(html: string, assetFolder: string): Response {
  const base = `/bought/${assetFolder}`;
  // Glass system (7 Nov 2026): the purchased pages get the same thin 3D buttons, glass cards and spacing.
  const prepared = withNoindex(withSharedFooter(html))
    .replace("</head>", `<style id="bbi-glass">${glassCss}</style><style id="bbi-ember">${emberCss}</style></head>`)
    .replace(/<body([^>]*)>/, (m: string, a: string) => (a.includes('class="') ? m.replace('class="', 'class="ember ') : `<body${a} class="ember">`))
    .replace(/(["'(=])\.\/(images|scripts|styles)\//g, `$1${base}/$2/`)
    // The authored homepage uses the site's existing featured images and
    // transparent golden tree under /images/. Other purchased snapshots keep
    // their original namespaced assets.
    .replace(/(["'(=])\/images\//g, assetFolder === "home" || assetFolder === "lists" ? "$1/images/" : `$1${base}/images/`)
    .replaceAll(`${base}/scripts/~flock.js`, `${base}/scripts/flock.js`);
  return new Response(prepared, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
