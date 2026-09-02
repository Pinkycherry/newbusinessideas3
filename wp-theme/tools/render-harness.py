"""
Render the theme's block markup against the real compiled stylesheet.

This is the check that was missing. `php -l` and a class-name grep tell you the
code parses and the utilities exist; neither tells you the navigation wraps onto
two lines or the search field is a quarter of the viewport. Only a browser does.

Block comments are stripped and the raw HTML inside them kept — that is what
WordPress emits for static blocks. Dynamic bbi/* blocks are replaced with a
representative stand-in so the surrounding layout is measured honestly.
"""
import re, pathlib, sys

THEME = pathlib.Path(__file__).resolve().parent.parent / 'bbi'
OUT   = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '/tmp/bbi-harness')
OUT.mkdir(parents=True, exist_ok=True)

def strip_block_comments(html: str) -> str:
    return re.sub(r'<!--\s*/?wp:[^>]*?-->', '', html)

STUBS = {
    'bbi/icon-band': '<div class="bbi-icons" aria-hidden>' + ''.join(
        '<div class="bbi-icon"><svg viewBox="0 0 24 24"><path d="m4 12 5 5L20 6"></path></svg></div>'
        for _ in range(36)) + '</div>',
    'bbi/marquee': '<div class="bbi-marquee bbi-marquee-left" style="--bbi-marquee-time:70s"><div class="bbi-marquee-track">' + ''.join(
        f'<span class="glass-pill bbi-marquee-item">{n}</span>' for n in
        ['Zero Investment Business Ideas','AI & Automation','Creator & Media','E-Commerce & Retail',
         'Education & EdTech','FinTech & Finance','Health & Fitness','Tech & SaaS',
         'Business Ideas That Never Go Out of Style','Productivity & Workflow','Side Hustle Ideas']*2) +
        '</div></div>',
    'bbi/idea-grid': '<div class="bbi-idea-grid"><h2 class="mb-6">Blueprints worth your afternoon</h2>'
        '<div class="bbi-grid sm:grid-cols-2 lg:grid-cols-3">' + ''.join(
        '<a class="mo-card glass glass-hover bbi-shape-card-a bbi-card-pad block h-full rounded-2xl border border-border/60">'
        '<p class="t-eyebrow">Creator &amp; Media</p><h3 class="t-card mt-2">Human Lens Media</h3>'
        '<p class="mt-2 text-sm leading-relaxed text-muted-foreground">This ugc content business idea focuses on being the bridge between brands and the diverse pool of everyday folks.</p>'
        '<p class="t-meta mt-3 tabular-nums text-hl-teal">89<span class="opacity-55">/100</span></p>'
        '<div aria-hidden class="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div class="h-full rounded-full bg-hl-teal" style="width:89%"></div></div>'
        '</a>' for _ in range(6)) + '</div></div>',
    'bbi/dock': '',
}

def stub_dynamic(html: str) -> str:
    # Replace each self-closing dynamic block with its stand-in.
    for name, markup in STUBS.items():
        html = re.sub(r'<!--\s*wp:' + re.escape(name) + r'[^>]*?/-->', markup, html)
    return html

def core_stubs(html: str) -> str:
    """WordPress core blocks that emit their own markup."""
    html = re.sub(r'<!--\s*wp:site-title[^>]*?/-->',
                  '<p class="wp-block-site-title glass-pill bbi-site-title"><a href="#">ideas.infopinky.com</a></p>', html)
    html = re.sub(r'<!--\s*wp:navigation[^>]*?/-->',
                  '<nav class="wp-block-navigation"><ul class="wp-block-navigation__container">' +
                  ''.join(f'<li class="wp-block-navigation-item"><a class="wp-block-navigation-item__content" href="#">{n}</a></li>'
                          for n in ['About','Contact','Disclaimer','Pricing','Privacy Policy','Terms of Service']) +
                  '</ul></nav>', html)
    html = re.sub(r'<!--\s*wp:search[^>]*?/-->',
                  '<form class="wp-block-search bbi-header-search glass" style="border-radius:999px">'
                  '<div class="wp-block-search__inside-wrapper">'
                  '<input class="wp-block-search__input" placeholder="Search ideas…">'
                  '<button class="wp-block-search__button wp-element-button">Search</button>'
                  '</div></form>', html)
    html = re.sub(r'<!--\s*wp:template-part[^>]*?/-->', '', html)
    html = re.sub(r'<!--\s*wp:post-title[^>]*?/-->', '<h1 class="wp-block-post-title">Idea title</h1>', html)
    html = re.sub(r'<!--\s*wp:[a-z-]+(/[a-z-]+)?[^>]*?/-->', '', html)
    return html

def render(name, body):
    body = core_stubs(stub_dynamic(body))
    body = strip_block_comments(body)
    page = f'''<!doctype html><html class="light" lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="core-shim.css">
<link rel="stylesheet" href="bbi.css">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head><body class="wp-site-blocks">{body}</body></html>'''
    (OUT / f'{name}.html').write_text(page)

header = (THEME / 'parts/header.html').read_text()
footer = (THEME / 'parts/footer.html').read_text()
front  = (THEME / 'templates/front-page.html').read_text()

render('front', header + front + footer)
import shutil
shutil.copy(THEME / 'assets/css/bbi.css', OUT / 'bbi.css')
shutil.copy(pathlib.Path(__file__).parent / 'core-shim.css', OUT / 'core-shim.css')
print("harness written to", OUT)
