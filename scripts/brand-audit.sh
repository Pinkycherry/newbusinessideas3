#!/bin/sh
# Brand audit — fails if a domain is hardcoded into visible copy.
#
# The brand is "BBI" and "Bro Business Ideas". A domain is infrastructure, not
# a name, so it belongs in ONE place (src/lib/site-config.ts) and reaches the
# page from there. Typed into a route it survives a domain change silently and
# shows the wrong host to visitors -- which is exactly what happened on the
# trial domain, where four contact addresses and two footers still read
# businessidea.io.
#
# Run: sh scripts/brand-audit.sh
set -u

STATUS=0

echo "== hardcoded domains anywhere in src, content or data =="
# src/lib is included except site-config.ts, which IS the source of truth.
# schema.tsx and the meta helpers are the ones that matter most: a domain
# hardcoded there reaches Google, not just a reader.
HITS=$(grep -rn "businessidea\.io\|bbusiness\.online" src content data 2>/dev/null \
  | grep -v "^src/lib/site-config.ts:" || true)
if [ -n "$HITS" ]; then
  echo "$HITS"
  echo "FAIL: a domain is typed into visible copy. Route it through site-config.ts."
  STATUS=1
else
  echo "OK: no domain typed into any route, component, or content file."
fi

echo
echo "== the single source of truth (these SHOULD appear here, nowhere else) =="
grep -n "businessidea\.io" src/lib/site-config.ts || echo "(none)"

echo
echo "== stale brand names =="
STALE=$(grep -rn "IdeaVault\|Idea Vault" src/routes src/components content data 2>/dev/null || true)

if [ -n "$STALE" ]; then
  echo "$STALE"
  echo "FAIL: stale brand name in visible copy."
  STATUS=1
else
  echo "OK: brand reads BBI / Bro Business Ideas only."
fi

echo
echo "== meta, canonical and schema build their URLs from siteUrl() =="
for f in src/lib/schema.tsx src/lib/sitemap.ts src/routes/robots\[.\]txt.ts src/routes/__root.tsx; do
  [ -f "$f" ] || continue
  if grep -q "siteUrl\|canonicalUrl" "$f"; then
    echo "OK: $f derives its URLs"
  else
    echo "note: $f references no siteUrl() — check it emits no absolute URL"
  fi
done

echo
[ "$STATUS" -eq 0 ] && echo "PASS" || echo "FAILED — see above"
exit "$STATUS"
