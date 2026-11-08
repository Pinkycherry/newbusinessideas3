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

/** Key word in red in h1/h2 on raw pages too (same rule as use-glass-motion redKeywords, CSS highlight, no DOM change). */
export const keywordScript = `<script>(function(){var H=window.Highlight,R=window.CSS&&CSS.highlights;if(!H||!R)return;var hl=new H();R.set("kw-red",hl);
var K=["business ideas","business idea","side hustles?","startup ideas?","1 lakh women","women","validate","free","calculators?","blueprints?","lists?","ideas?","India(?:'s)?","money","profit","income","startups?","founders?","verdict","risks?","guides?","library","categor(?:y|ies)","compare","answers?","customers?","buyers?","costs?","loans?","GST","map"].map(function(k){return new RegExp("\\\\b("+k+")\\\\b","i")});
document.querySelectorAll("main h1, main h2").forEach(function(h){var t=[],w=document.createTreeWalker(h,4),n;while(n=w.nextNode())if(n.data.trim())t.push(n);if(!t.length)return;
function mark(x,s,l){var r=document.createRange();r.setStart(x,s);r.setEnd(x,s+l);hl.add(r)}
for(var i=0;i<K.length;i++)for(var j=0;j<t.length;j++){var m=K[i].exec(t[j].data);if(m){mark(t[j],m.index,m[0].length);return}}
var L=t[t.length-1],m2=/([A-Za-z0-9'’-]+)[^A-Za-z0-9]*$/.exec(L.data);if(m2)mark(L,m2.index,m2[1].length)})})();</script>`;
