import { renderToStaticMarkup } from "react-dom/server";
import { Header, Footer } from "@/components/v2/frame";
import { highlightKeywords, rawPaletteGuard } from "@/lib/keyword-highlight";

/**
 * One header and one footer everywhere (founder, 8 Nov 2026): pages served as raw HTML (lists hub,
 * failed startups, topic pages) render the very same React Header and Footer to static markup on
 * the server, so they can never drift from the React pages again. bought/menus.html binds the menus.
 */
let cache: { header: string; footer: string } | null = null;
function render() {
  cache ??= { header: renderToStaticMarkup(<Header />), footer: renderToStaticMarkup(<Footer />) };
  return cache;
}
export const menuPanels = {
  get header() { return render().header; },
  get footer() { return render().footer; },
};

/** Key words in red and dark panels on raw pages too: the same functions the React pages use,
 *  printed into the page (they are self-contained). */
export const keywordScript = `<script>(function(){var __name=function(f){return f};(${highlightKeywords.toString()})(document);(${rawPaletteGuard.toString()})();})();</script>`;
