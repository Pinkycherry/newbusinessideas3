/**
 * Key words in red (founder, 8-9 Nov 2026). Self-contained: this function is also printed into the
 * raw HTML pages with Function.prototype.toString, so it must not use imports or outer variables.
 *
 * Rules:
 *  - Section headings (h1, h2, h4 and h3 that are not idea titles): only a real topic word or phrase
 *    from the site's vocabulary turns red ("business ideas", "MVP", "first customer", "guides"...).
 *    No match, no red. Never a random last word.
 *  - Idea titles (idea page title, card titles, h3 that name an idea): the core subject turns red,
 *    the product or trade itself: "Urad Papad" in "Urad Papad WhatsApp Society Brand",
 *    "South Indian Podi" in "Regional South Indian Podi Making". Leading modifiers (regional, home,
 *    small...), trailing generic words (making, brand, service...) and anything after a channel or
 *    joining word (WhatsApp, society, for, with...) are left white.
 *  - Paints with the CSS Custom Highlight API (::highlight(kw-red)), so the page DOM is not touched.
 */
export function highlightKeywords(root: ParentNode): void {
  const w = window as unknown as { Highlight?: new () => { add(r: Range): void }; __kwDone?: WeakSet<Element> };
  const reg = (window.CSS as unknown as { highlights?: Map<string, unknown> } | undefined)?.highlights;
  if (!w.Highlight || !reg) return;
  const hl = (reg.get("kw-red") as { add(r: Range): void } | undefined) ?? (() => { const x = new w.Highlight!(); reg.set("kw-red", x); return x; })();
  const done = (w.__kwDone ??= new WeakSet<Element>());
  const PHRASES = ["business ideas", "business idea", "side hustles?", "startup ideas?", "go wrong", "money to start", "who pays you", "money comes", "first customers?", "startup costs?", "business models?", "cash flow", "break-even", "unit economics", "case stud(?:y|ies)", "failed startups?", "launch plan", "MVP", "validat(?:e|ion|ing)", "pricing", "demand", "pivot", "funding", "GST", "ROI", "glossary", "need", "guides?", "questions?", "tools?", "calculators?", "resources", "blueprints?", "categor(?:y|ies)", "women", "students?", "senior citizens?", "India(?:'s)?", "profit", "income", "verdict", "risks?"];
  const RES = PHRASES.map((k) => new RegExp("\\b(" + k + ")\\b", "i"));
  const TAIL = /^(family|making|maker|makers|brand|brands|business|businesses|idea|ideas|service|services|shop|store|plan|plans|kit|unit|work|route|centre|center|studio|setup|supply|selling|seller|counter|desk|batch|batches|class|classes|stall|cart|subscription|delivery|hub|house|point|company|agency|venture|startup|model|box|pack|packs|line|label|joint|order|orders|booking|bookings|help|support|kitchen)$/i;
  const LEAD = /^(regional|home|homemade|small|local|daily|weekly|monthly|premium|simple|new|budget|low|cost|quick|mini|modern|traditional|the|a|an|your|my|easy|basic|classic|custom|fresh|own|society|office|family|college|school|women|woman|student|students|senior|village|town|city|kids|to|ready|night|morning|evening)$/i;
  const STOP = /^(and|for|with|from|in|of|at|by|on|via|through|near|using|whatsapp|instagram|online|app|apps|website|websites|&|-|–)$/i;
  const isRed = (el: Element) => { const m = getComputedStyle(el).color.match(/\d+/g); return !!m && +m[0]! > 150 && +m[1]! < 90 && +m[2]! < 90; };
  const textNodes = (h: Element) => { const out: Text[] = []; const tw = document.createTreeWalker(h, NodeFilter.SHOW_TEXT); for (let n = tw.nextNode(); n; n = tw.nextNode()) if ((n.textContent ?? "").trim()) out.push(n as Text); return out; };
  const mark = (t: Text, s: number, e: number) => { const r = document.createRange(); r.setStart(t, s); r.setEnd(t, e); hl.add(r); };
  const core = (t: Text): boolean => {
    const words: { w: string; s: number; e: number }[] = [];
    const re = /[\p{L}\p{N}'’-]+/gu; let m: RegExpExecArray | null;
    while ((m = re.exec(t.data))) words.push({ w: m[0], s: m.index, e: m.index + m[0].length });
    // The product or trade is the last two or three words before any channel or joining word,
    // once generic tail words are removed: "Urad Papad", "South Indian Podi", "Mango Pickle".
    const cut = words.findIndex((x, i) => i > 0 && STOP.test(x.w));
    let ws = cut > 0 ? words.slice(0, cut) : words.slice();
    while (ws.length > 1 && TAIL.test(ws[ws.length - 1]!.w)) ws.pop();
    ws = ws.slice(-3);
    while (ws.length > 1 && LEAD.test(ws[0]!.w)) ws.shift();
    if (!ws.length) return false;
    mark(t, ws[0]!.s, ws[ws.length - 1]!.e); return true;
  };
  root.querySelectorAll<HTMLElement>("main :is(h1,h2,h3,h4)").forEach((h) => {
    if (done.has(h) || h.closest(".eh-stage,[data-keep-colour],.eh-hero")) return;
    done.add(h);
    if (Array.from(h.querySelectorAll("*:not(svg):not(svg *)")).some(isRed) || isRed(h)) return;
    const texts = textNodes(h);
    if (!texts.length) return;
    // "X Business Ideas" headings (categories, lists): X is the keyword, not the words "business ideas".
    const t0 = texts[0]!;
    const bi = (h.tagName === "H1" || h.tagName === "H3") && texts.length === 1 ? /^(\s*(?:(?:featured|best|top|all|more|popular|latest)\s+)*)(.+?)\s+business ideas?\s*$/i.exec(t0.data) : null;
    if (bi && bi[2]) { const s0 = bi[1]!.length; mark(t0, s0, s0 + bi[2].length); return; }
    const words = h.textContent!.trim().split(/\s+/).length;
    const ideaTitle = h.matches(".e-idea-title,.cm-h1") || (!/\?\s*$/.test(h.textContent!) && words <= 9 && !h.closest("details,summary,[class*=faq],[id*=faq]") && (h.matches("h3") || h.matches("h1")) && (!!h.closest('a[href^="/idea/"]') || !!h.querySelector('a[href^="/idea/"]')
      || (h.tagName === "H3" && !!h.closest("article") && !!h.closest("article")!.querySelector('a[href^="/idea/"]') && !h.closest("article")!.querySelector("input,textarea,select,form"))));
    if (ideaTitle) { core(texts[0]!); return; }
    const max = h.tagName === "H3" || h.tagName === "H4" ? 2 : 1;
    let n = 0; const used: [Text, number, number][] = [];
    for (const r of RES) for (const t of texts) {
      const m = r.exec(t.data);
      if (m && !used.some(([u, a, b]) => u === t && m.index < b && m.index + m[0].length > a)) { mark(t, m.index, m.index + m[0].length); used.push([t, m.index, m.index + m[0].length]); if (++n >= max) return; break; }
    }
  });
}

/** Raw HTML pages (no React, no palette guard): turn light panels, toasts and trays dark once, and
 *  again for anything added later. Self-contained for toString printing, like highlightKeywords. */
export function rawPaletteGuard(): void {
  const seen = new WeakSet<Element>();
  const lum = (c: string) => { const m = c.match(/[\d.]+/g); if (!m) return null; const a = m.length > 3 ? +m[3]! : 1; return { l: (0.2126 * +m[0]! + 0.7152 * +m[1]! + 0.0722 * +m[2]!) / 255, a }; };
  const fix = (scope: Element) => {
    [scope, ...Array.from(scope.querySelectorAll("*"))].forEach((el) => {
      if (seen.has(el) || el.closest("svg,img,video,canvas,.mm-header,.v2-footer")) return;
      seen.add(el);
      const cs = getComputedStyle(el);
      const bg = lum(cs.backgroundColor);
      if (bg && bg.a > 0.5 && bg.l > 0.82) { (el as HTMLElement).style.setProperty("background-color", "#161313", "important"); (el as HTMLElement).style.setProperty("border-color", "rgba(255,255,255,.12)", "important"); }
      const fg = lum(cs.color);
      if (fg && fg.a > 0.3 && fg.l < 0.35 && Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent ?? "").trim())) (el as HTMLElement).style.setProperty("color", "#ece3e3", "important");
    });
  };
  const run = () => fix(document.body);
  const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 300));
  idle(run);
  let pending: Element[] = []; let t: ReturnType<typeof setTimeout> | null = null;
  new MutationObserver((ms) => { ms.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType === 1) pending.push(n as Element); })); if (!t) t = setTimeout(() => { t = null; const p = pending; pending = []; p.forEach(fix); }, 120); }).observe(document.body, { childList: true, subtree: true });
}
