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
    };
  });
  console.log(tag, JSON.stringify(m));
  await p.close();
}
await b.close();
