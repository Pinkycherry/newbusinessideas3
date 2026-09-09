#!/usr/bin/env bash
# Rebuild the installable theme package.
#
# Run from the repository root. Two steps, in this order — the stylesheet is
# compiled INTO the theme directory, so packaging before compiling ships a
# stale one and nothing warns you.
set -euo pipefail

npx @tailwindcss/cli \
  -i wp-theme/bbi/build/theme.css \
  -o wp-theme/bbi/assets/css/bbi.css \
  --minify

rm -f bbi-theme.zip

# Zipped from inside wp-theme/ so the archive root holds a single `bbi/`
# folder. WordPress's uploader requires exactly that shape — an archive whose
# root is the theme's own files is rejected as "missing style.css".
( cd wp-theme && zip -rq ../bbi-theme.zip bbi -x '*.DS_Store' -x '__MACOSX/*' )

unzip -tq bbi-theme.zip
echo "bbi-theme.zip rebuilt."
