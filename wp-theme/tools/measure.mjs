import { chromium } from 'playwright';
const url = 'file://' + process.argv[2];
const out = process.argv[3];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [w,h,tag] of [[1440,900,'desktop'],[390,844,'mobile']]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(url, { waitUntil: 'load' });
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${out}-${tag}.png`, fullPage: true });

  // The measurements that would have caught every defect reported.
  const m = await p.evaluate(() => {
    const q = s => document.querySelector(s);
    const nav = q('.wp-block-navigation');
    const search = q('.bbi-header-search');
    const bar = q('.bbi-header-bar');
    const icons = q('.bbi-icons');
    const r = el => el ? el.getBoundingClientRect() : null;
    const navItems = [...document.querySelectorAll('.wp-block-navigation-item')].map(e => e.getBoundingClientRect().top);
    return {
      docWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      navRows: new Set(navItems.map(t => Math.round(t))).size,
      searchWidthPct: search && bar ? Math.round(r(search).width / r(bar).width * 100) : null,
      headerHeight: bar ? Math.round(r(bar).height) : null,
      iconBandHeight: icons ? Math.round(r(icons).height) : null,
      h2Count: document.querySelectorAll('h1,h2').length,
      // There must be exactly ONE definition of each type role. The
      // `is-style-*` names are rewritten to the real classes by a render_block
      // filter in inc/blocks.php, so any CSS rule for them here means a
      // duplicate has come back — and a duplicate is what drifted before,
      // colouring every eyebrow purple where the real token is gold.
      duplicateTokenRules: (() => {
        const dupes = [];
        for (const sheet of document.styleSheets) {
          let rules;
          try { rules = sheet.cssRules; } catch { continue; }
          for (const r of rules) {
            if (r.selectorText && /\.is-style-t-(lead|eyebrow|meta|card)\b/.test(r.selectorText)) {
              dupes.push(r.selectorText);
            }
          }
        }
        return dupes;
      })(),
      headings: {
        sections: document.querySelectorAll('h1,h2').length,
        cards: document.querySelectorAll('h3').length,
      },
      // Text squeezed into a narrow flex item. A column laid out as a flex
      // ROW instead of a flex COLUMN put every paragraph in its own strip and
      // broke headings to one word per line — the whole page, and the numbers
      // above all still read as healthy. Width is the only thing that shows it.
      squeezedText: (() => {
        const longP = [...document.querySelectorAll('.wp-block-columns p')]
          .filter(e => e.textContent.trim().length > 60);
        const heads = [...document.querySelectorAll('.wp-block-columns h1, .wp-block-columns h2')];
        return {
          paragraphsUnder220px: longP.filter(e => e.getBoundingClientRect().width < 220).length,
          headingsUnder260px: heads.filter(e => e.getBoundingClientRect().width < 260).length,
        };
      })(),
      // The design system caps the orbit at 21rem. A blanket width:100% on
      // column children overrode it and let one fill a 600px column.
      orbitWidths: [...document.querySelectorAll('.bbi-orbit-wrap')]
        .map(e => Math.round(e.getBoundingClientRect().width)),
      // The ambient layers the original site carries. Zero means they were
      // dropped from the template, which is exactly what happened in 0.4.0.
      ambient: {
        heroField: document.querySelectorAll('canvas.bbi-field').length,
        twinRings: document.querySelectorAll('.bbi-twin-ring').length,
        orbits: document.querySelectorAll('.bbi-orbit-wrap').length,
        animateBlocks: document.querySelectorAll('.bbi-anim').length,
      },
    };
  });
  console.log(tag, JSON.stringify(m));
  await p.close();
}
await b.close();
