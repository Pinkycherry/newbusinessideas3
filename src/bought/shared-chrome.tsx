import { renderToStaticMarkup } from "react-dom/server";
import { Header, Footer } from "@/components/v2/frame";

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
