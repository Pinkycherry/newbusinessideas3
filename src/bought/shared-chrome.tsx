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

/** Raw pages (topic pages, lists hub, purchased pages): the same round "On this page" button as the React
 *  pages, in plain script. Every h2 by its full name, the current one marked, plus Back to top. */
const rawToc = `<style>.rt{position:fixed;right:14px;bottom:92px;z-index:95;font-family:Inter,system-ui,sans-serif}.rt-b{display:inline-flex;align-items:center;justify-content:center;width:58px;height:58px;border-radius:50%;border:2px solid #e01b1f;background:#0c0c0e;color:#fff;font:800 19px/1 Inter,system-ui,sans-serif;letter-spacing:-.06em;box-shadow:0 14px 34px -10px #000;cursor:pointer}.rt-b b{color:#e01b1f}.rt-p{position:absolute;right:0;bottom:70px;width:min(86vw,340px);max-height:min(66vh,560px);overflow:auto;padding:14px;border-radius:18px;background:#0f0f11;border:1px solid rgba(255,255,255,.16);box-shadow:0 30px 70px -20px #000}.rt-p[hidden]{display:none}.rt-h{margin:0 0 8px;font:800 11px/1 Inter,system-ui,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#ff3b30}.rt-p a{display:block;padding:10px 10px;border-radius:10px;font:600 14.5px/1.3 Inter,system-ui,sans-serif;color:#fff!important;text-decoration:none;border-left:3px solid transparent}.rt-p a.on{border-left-color:#e01b1f;background:rgba(224,27,31,.16)}.rt-p a:hover{background:rgba(255,255,255,.08)}.rt-t{margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.14)}@media (min-width:1024px){.rt{right:26px;bottom:auto;top:50%;margin-top:-29px}.rt-p{bottom:auto;top:50%;right:70px;transform:translateY(-50%)}}@media print{.rt{display:none}}</style><script>(function(){var hs=[].slice.call(document.querySelectorAll('main h2, body > section h2, article h2')).filter(function(h){return h.offsetParent!==null&&(h.textContent||'').trim().length>2&&!h.closest('header,footer,nav,[aria-hidden=true]')});if(hs.length<2)return;var w=document.createElement('div');w.className='rt';var p=document.createElement('div');p.className='rt-p';p.hidden=true;p.setAttribute('role','dialog');p.setAttribute('aria-label','On this page');var t=document.createElement('p');t.className='rt-h';t.textContent='On this page';p.appendChild(t);var links=hs.map(function(h){var a=document.createElement('a');a.href='#';a.textContent=(h.textContent||'').trim().replace(/\\s+/g,' ');a.addEventListener('click',function(e){e.preventDefault();p.hidden=true;window.scrollTo({top:h.getBoundingClientRect().top+window.scrollY-90,behavior:'smooth'})});p.appendChild(a);return a});var top=document.createElement('a');top.href='#';top.className='rt-t';top.textContent='Back to top';top.addEventListener('click',function(e){e.preventDefault();p.hidden=true;window.scrollTo({top:0,behavior:'smooth'})});p.appendChild(top);var b=document.createElement('button');b.type='button';b.className='rt-b';b.setAttribute('aria-label','On this page');b.innerHTML='b<b>b</b>';b.addEventListener('click',function(){if(p.hidden){var y=window.innerHeight*.45,cur=-1;hs.forEach(function(h,i){if(h.getBoundingClientRect().top<y)cur=i});links.forEach(function(a,i){a.className=i===cur?'on':''})}p.hidden=!p.hidden});document.addEventListener('pointerdown',function(e){if(!w.contains(e.target))p.hidden=true});w.appendChild(p);w.appendChild(b);document.body.appendChild(w)})();</script>`;

export const keywordScript = `<script>(function(){var __name=function(f){return f};(${highlightKeywords.toString()})(document);(${rawPaletteGuard.toString()})();})();</script>${rawToc}`;
