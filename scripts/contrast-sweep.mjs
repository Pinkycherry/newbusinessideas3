/**
 * Contrast sweep — finds text the reader cannot read.
 *
 * Walks every main route with a real browser and reports any element whose own
 * text falls below 3:1 against the first opaque background behind it, AT REST.
 * At rest is the point: the bugs this catches are the ones that look like an
 * empty button until you hover it, which is exactly how three of them shipped.
 *
 * Run against the dev server (see .localdev/dev-with-stand-in.sh):
 *   node scripts/contrast-sweep.mjs
 *
 * KNOWN FALSE POSITIVE: a label sitting above an absolutely-positioned sibling
 * that carries the real background — the active tab in tabs.tsx is one. The
 * walk climbs ANCESTORS, so it cannot see a sibling pill. Check a flagged
 * element against a screenshot before changing it.
 */
import { chromium } from 'playwright';
const BASE = process.env.BASE_URL || 'http://127.0.0.1:8080';
setTimeout(() => { console.log('WATCHDOG'); process.exit(3); }, 280000);
const b = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
await ctx.route('**/*', (r) => { const u = r.request().url(); if (/^https?:\/\//.test(u) && !u.includes('127.0.0.1')) return r.abort(); return r.continue(); });
const p = await ctx.newPage();

const SWEEP = `(() => {
  const rgb = (s) => { const m = (s || '').match(/[\\d.]+/g) || []; return [ +m[0]||0, +m[1]||0, +m[2]||0, m[3] === undefined ? 1 : +m[3] ]; };
  const lum = (c) => { const [r,g,b] = c.map(v => { v/=255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); }); return 0.2126*r + 0.7152*g + 0.0722*b; };
  const ratio = (a, bg) => { const l1 = lum(a), l2 = lum(bg); return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05); };
  const effBg = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      const c = rgb(cs.backgroundColor);
      if (c[3] > 0.5) return c;
      const bi = cs.backgroundImage;
      if (bi && bi !== 'none') { const m = bi.match(/rgba?\\([^)]+\\)/); if (m) { const g = rgb(m[0]); if (g[3] > 0.5) return g; } }
      n = n.parentElement;
    }
    return [20,20,20,1];
  };
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!el.getClientRects().length) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || +cs.opacity < 0.05) continue;
    // only elements that render their OWN text
    let text = '';
    for (const n of el.childNodes) if (n.nodeType === 3) text += n.textContent;
    text = text.trim();
    if (!text) continue;
    const fg = rgb(cs.color);
    if (fg[3] < 0.15) continue;
    const r = ratio(fg.slice(0,3), effBg(el).slice(0,3));
    if (r < 3) {
      out.push({
        text: text.slice(0, 34),
        tag: el.tagName.toLowerCase(),
        cls: (typeof el.className === 'string' ? el.className : '').split(/\\s+/).filter(Boolean).slice(0,3).join('.'),
        color: cs.color, bg: 'rgb(' + effBg(el).slice(0,3).join(', ') + ')',
        ratio: +r.toFixed(2),
      });
    }
  }
  return out;
})()`;

const routes = ['/', '/sign-in', '/pricing', '/browse', '/about', '/contact', '/services', '/faq', '/search', '/idea/ugc-content-agency-creator-service', '/category/creator-media'];
for (const route of routes) {
  try {
    await p.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(3800);
    const bad = await p.evaluate(SWEEP);
    const seen = new Set();
    const uniq = bad.filter((x) => { const k = x.cls + '|' + x.color + '|' + x.bg; if (seen.has(k)) return false; seen.add(k); return true; });
    console.log('\n== ' + route + '  (' + bad.length + ' low-contrast, ' + uniq.length + ' distinct)');
    for (const x of uniq.slice(0, 8)) console.log('   ' + String(x.ratio).padStart(5) + '  <' + x.tag + '.' + x.cls.slice(0,30) + '>  "' + x.text + '"  ' + x.color + ' on ' + x.bg);
  } catch (e) { console.log('\n== ' + route + '  ERROR ' + String(e).slice(0, 70)); }
}
await b.close(); process.exit(0);
