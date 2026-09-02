#!/usr/bin/env python3
"""Check that template markup matches what each block's save() produces.

WordPress validates saved block markup against the output of the block's
`save()` on every editor load. When they disagree it shows "Block contains
unexpected or invalid content" and the block, and everything nested inside it,
becomes UNEDITABLE — while still rendering correctly on the front end. That
asymmetry is what makes this bug easy to ship and hard to notice.

It was shipped: `bbi/animate` returns `<InnerBlocks.Content />` and nothing
else, but the templates wrapped its children in the `<div class=
"wp-block-bbi-animate ...">` that the PHP render callback adds at output time.
Eighteen blocks across two templates were invalid.

Run this before pushing any template change.
"""
import glob, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent / 'bbi'

# Blocks whose save() returns null — their markup must be self-closing.
NULL_SAVE = ['idea-grid', 'idea-part', 'icon-band', 'marquee', 'dock', 'orbit']

# Blocks whose save() returns only InnerBlocks.Content — no wrapper of their own.
INNER_ONLY = {'animate': 'wp-block-bbi-animate'}

problems = []

for path in sorted(glob.glob(str(ROOT / 'templates/*.html')) + glob.glob(str(ROOT / 'parts/*.html'))):
    src = open(path).read()
    rel = pathlib.Path(path).relative_to(ROOT.parent)

    for name in NULL_SAVE:
        for m in re.finditer(r'<!--\s*wp:bbi/' + name + r'\b(?![^>]*/-->)', src):
            line = src[:m.start()].count('\n') + 1
            problems.append(f'{rel}:{line}  bbi/{name} is not self-closing — its save() returns null')

    for name, wrapper in INNER_ONLY.items():
        for m in re.finditer(re.escape(wrapper), src):
            line = src[:m.start()].count('\n') + 1
            problems.append(f'{rel}:{line}  bbi/{name} carries a "{wrapper}" wrapper — '
                            f'save() emits only InnerBlocks.Content, so this makes the block invalid')

if problems:
    print('INVALID BLOCK MARKUP:\n')
    for p in problems:
        print('  ' + p)
    print(f'\n{len(problems)} problem(s). These blocks will render but will NOT be editable.')
    sys.exit(1)

print('block markup valid — every template matches what save() produces')
