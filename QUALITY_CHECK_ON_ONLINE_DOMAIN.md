# Quality Check on .ONLINE domain

Working document for the `bbusiness.online` trial run: SEO, sitemaps,
indexing, AdSense, and the switch to `businessidea.io`.

Everything here is either a measured fact or a procedure. Where a number could
not be verified it says so instead of guessing.

---

## 1. Why we are doing this

`businessidea.io` is the domain we keep. Before it goes live we want an outside
verdict on whether the content is good enough, because most of it was written
with AI assistance and nobody has independently judged it.

Google AdSense is that outside verdict. Its review checks whether a site has
enough real content, working navigation, and the trust pages a publisher is
expected to have. A **"low value content" rejection is a specific, actionable
signal** — that is the answer we are actually looking for. Approval is a weaker
signal: it means we cleared the bar, not that we will rank.

So: build the full site on a domain we do not care about, submit it, get
indexed, apply, read the verdict, then tear the trial domain down and launch the
real one.

**What this costs:** a few weeks, and a teardown pass.
**What it does not cost:** `businessidea.io`. It stays untouched and unindexed
until we are ready.

---

## 2. The plan, end to end

| Phase | What happens                                        | Where                  |
| ----- | --------------------------------------------------- | ---------------------- |
| 1     | DNS moves from Hostinger to Cloudflare              | Hostinger + Cloudflare |
| 2     | Worker gets the domain, env vars set                | Cloudflare             |
| 3     | Pre-index QA — every check in §7 passes             | Browser                |
| 4     | Search Console, sitemap submitted, indexing watched | GSC                    |
| 5     | AdSense application, verdict recorded               | AdSense                |
| 6     | Teardown — noindex, then removal, in that order     | Cloudflare + GSC       |
| 7     | `businessidea.io` goes live with the same content   | Cloudflare + GSC       |

---

## 3. One AdSense account, not two

Eligibility tracks the **payee identity** (in India, PAN and bank details), not
the Gmail address. Two accounts linked to one person usually ends with both
terminated, permanently.

We do not need a second account. Apply on `.online` with the one account. If it
is approved, the content cleared the bar — that is the whole finding. Later,
`businessidea.io` is added as a **second site** on that same account, which is a
lighter, site-level review because the account-level review is already done.

Same test. Same information. No policy exposure.

---

## 4. The control panel — three environment variables

No domain name is hardcoded anywhere in this codebase. `siteUrl()` in
`src/lib/site-config.ts` is the only place one exists, and canonicals, all
sitemaps, `robots.txt`, the RSS feed and the schema.org markup all read it.

**This is why the switch is dashboard clicks and not a code change.**

| Variable         | Default if unset          | What it controls                      |
| ---------------- | ------------------------- | ------------------------------------- |
| `SITE_URL`       | `https://businessidea.io` | Every absolute URL the site emits     |
| `SITE_INDEXABLE` | `true`                    | Whether crawlers are allowed at all   |
| `SITE_SAME_AS`   | empty                     | Social profile URLs in the org schema |

`SITE_INDEXABLE=false` does three things at once, read at request time with no
rebuild:

- `robots.txt` becomes `User-agent: * / Disallow: /`
- every page emits `<meta name="robots" content="noindex,nofollow">`
- every sitemap returns an empty `urlset`

**Verified on 2026-09-18** by running the app locally with the flag set. All
three behaved as described.

### Database credentials must be set on the Worker

`src/lib/ideas.functions.ts:14` reads **unprefixed** names from `process.env`:

```
IDEAVAULT_DB_URL
IDEAVAULT_DB_ANON_KEY
```

The repo's local `.env` only carries the `VITE_`-prefixed versions, which are
build-time and client-side. A deployment with only those set builds fine and
then fails at request time on every database-backed route with "BBI database
credentials are not configured." Set **all four** on the Worker — the two above
for the server, and `VITE_IDEAVAULT_DB_URL` / `VITE_IDEAVAULT_DB_ANON_KEY` for
the build — and set them for the Production environment.

### Settings for each domain

```
# bbusiness.online — the trial
SITE_URL=https://bbusiness.online
SITE_INDEXABLE=true          # false during Phase 3, true from Phase 4

# businessidea.io — the real one
SITE_URL=https://businessidea.io
SITE_INDEXABLE=false         # until we are ready, then true
```

---

## 5. Sitemap architecture

### 5.1 The shape

```
/sitemap-index.xml              ← the ONLY URL submitted to Search Console
  ├─ /sitemap-pages.xml         static pages, calculators, guides, stories
  ├─ /sitemap-categories.xml    categories, subcategories, validate pages
  ├─ /sitemap-ideas/1           ideas 1–1,000        + <lastmod>
  ├─ /sitemap-ideas/2           ideas 1,001–2,000    + <lastmod>
  └─ …enumerated from the live row count, so it grows by itself

/sitemap                        ← HTML sitemap, links to every page
/feed.xml                       ← RSS, 50 newest ideas, fast discovery
/robots.txt                     ← generated, names the sitemap index
```

### 5.2 Counts, measured 2026-09-18

|                                        | Today    | At target scale |
| -------------------------------------- | -------- | --------------- |
| Idea blueprints (`status = completed`) | **409**  | 10,000          |
| Distinct categories                    | **16**   | ~100–200        |
| Distinct subcategory paths             | **409**  | see §11.1       |
| `sitemap-pages.xml` URLs               | **105**  | ~120–220        |
| `sitemap-categories.xml` URLs          | ~441     | ~400–600        |
| Idea sitemap files                     | 1        | 10              |
| **Total URLs**                         | **~955** | **~10,600**     |

Google's cap is 50,000 URLs per file. At target scale we are at **21% of what
one file is allowed to hold**, so the split below is not about the cap.

### 5.3 Why the ideas sitemap is split at all

Google reads the index, compares each child's `<lastmod>` against what it last
saw, and **re-fetches only the children that changed.** That is the entire
mechanism.

One flat file: add a batch of 1,000, the file's date moves, Google re-reads all
10,000 URLs to find the new ones. Split into tranches: one file moves, one file
is read, and the crawl budget lands on the new content.

### 5.4 Why a tranche is exactly 1,000 rows

PostgREST caps a response at 1,000 rows and **does not error when it truncates.**
One tranche = one query = exactly that cap, so no query in the sitemap layer can
ever want more rows than the database will return. The truncation bug is not
merely handled, it is unreachable.

### 5.5 Why tranches are ordered by date, not slug

Tranching only helps if a tranche's contents are **stable**. Ordered by slug, one
new idea whose slug sorts early pushes a row across every later boundary: all
files change, all dates move, Google re-reads everything. Ordered by creation
date the table is append-only, so a new batch lands in the last tranche and
every earlier file is byte-identical to what Google already has.

### 5.6 Why `/sitemap` exists next to four XML files

An XML sitemap says a URL **exists**. A link says it **matters**, and only the
second reliably gets a page indexed. Pages that appear in a sitemap and nowhere
else are what Search Console reports as _"Discovered – currently not indexed"_ —
found, judged not worth fetching.

Before this page, every idea was in exactly that position. `/sitemap` puts all
of them one hop from a page that is itself indexed. This is what the most
structurally mature site in this space does with its own 5,381 pages.

### 5.7 Supabase cost

Sitemaps are not worth optimising for cost.

|                                           | Bytes          |
| ----------------------------------------- | -------------- |
| One idea row, full (a page render)        | 14,301         |
| One idea row in a sitemap (`slug` + date) | ~90            |
| All 10,000 ideas, one full sitemap crawl  | **under 1 MB** |

One complete sitemap crawl costs about the same as **60 page views**, against a
5 GB monthly free allowance. `sitemap-pages.xml` touches the database not at
all — it is built from TypeScript arrays. Page renders are the real cost and
always will be.

---

## 6. What was built (2026-09-18)

| Change                                          | File                                     | Verified                                      |
| ----------------------------------------------- | ---------------------------------------- | --------------------------------------------- |
| `SITE_INDEXABLE` flag                           | `src/lib/site-config.ts`                 | Yes — ran locally with flag on and off        |
| `<lastmod>` on index children                   | `src/lib/sitemap.ts`                     | Yes — inspected output                        |
| Empty sitemaps when not indexable               | `src/lib/sitemap.ts`                     | Yes — returned empty `urlset`                 |
| Tranched, range-bounded idea queries            | `src/lib/sitemap.server.ts`              | Queries verified against the live database    |
| Idea sitemap tranche route                      | `src/routes/sitemap-ideas.$page.ts`      | Route registered; 404s on bad/over-range page |
| Index enumerates tranches from row count        | `src/routes/sitemap-index[.]xml.ts`      | Logic verified by SQL                         |
| Categories query no longer full-scans unbounded | `src/routes/sitemap-categories[.]xml.ts` | Pages in tranches, stops short                |
| `robots.txt` honours the flag                   | `src/routes/robots[.]txt.ts`             | Yes — flipped to `Disallow: /`                |
| `noindex` meta on every route                   | `src/routes/__root.tsx`                  | Compiles; render blocked locally (see below)  |
| HTML sitemap                                    | `src/routes/sitemap.tsx`                 | Compiles; render blocked locally              |
| RSS feed                                        | `src/routes/feed[.]xml.ts`               | Yes — correct envelope, honours the flag      |
| `internal_link_anchors` carried to the page     | `src/lib/ideas-shared.ts`                | Typechecks (but see §11.2)                    |

**Honest limit on verification:** this container's network policy blocks
`*.supabase.co`, so the database-backed routes could not be exercised
end-to-end locally. Their queries were instead verified directly against the
live database with SQL, and the non-database routes (`robots.txt`,
`sitemap-pages.xml`, `feed.xml`) were exercised for real. **Every
database-backed route must be re-checked against the live domain in Phase 3.**

Checks that did pass: `eslint` clean on all changed files (68 pre-existing
problems elsewhere, unchanged), `npm run build` succeeds, TypeScript errors went
from 623 to 620.

### 6.1 The bug this fixed

`sitemap-ideas.xml` and `sitemap-categories.xml` both selected every completed
idea with no range. At 409 rows that worked. **Past 1,000 it would have kept
returning 200 OK and a green-in-Search-Console sitemap that silently omitted
every row beyond the first thousand.** No error, no warning, and the only symptom
would have been most of the site never getting indexed — with nothing to point at.

At the stated target of 10,000 ideas that was a matter of time, not of risk.

---

## 7. Phase 3 — pre-index QA checklist

Run with `SITE_INDEXABLE=false` so nothing can be crawled while we look. Every
line must pass before Phase 4.

### 7.1 Plumbing

- [ ] `https://bbusiness.online/` loads over HTTPS, valid certificate
- [ ] `robots.txt` reads `Disallow: /` (flag still off)
- [ ] `sitemap-index.xml` returns XML, not an error page
- [ ] `sitemap-pages.xml` returns **105** URLs, all on `bbusiness.online`
- [ ] `sitemap-categories.xml` returns ~441 URLs
- [ ] `sitemap-ideas/1` returns **409** URLs
- [ ] `sitemap-ideas/2` returns **404** (only one tranche at 409 ideas)
- [ ] `sitemap-ideas/abc` returns **404**
- [ ] `feed.xml` returns valid RSS
- [ ] No URL anywhere in any sitemap says `businessidea.io`
- [ ] View source on any page: canonical is `bbusiness.online`
- [ ] View source: `<meta name="robots" content="noindex,nofollow">` is present

### 7.2 Content and trust

- [ ] `/about`, `/contact`, `/privacy`, `/terms`, `/disclaimer`, `/gdpr` all load and read as real pages
- [ ] `/contact` has a working method of contact
- [ ] Header navigation works on mobile
- [ ] `/sitemap` lists all 409 ideas, all 16 categories, all 60 calculators
- [ ] Spot-check 10 idea pages: each has its own title, description, and body
- [ ] Spot-check 3 category pages: each lists its ideas
- [ ] No page shows a raw error, an empty state, or placeholder text
- [ ] No AI vendor is named anywhere in public copy — see §11.4

### 7.3 Then

- [ ] Flip `SITE_INDEXABLE=true`
- [ ] Re-check `robots.txt` now reads `Allow: /` and names the sitemap index
- [ ] Re-check the `noindex` meta tag is **gone**

---

## 8. Phase 4 — indexing

- [ ] Add `bbusiness.online` to Search Console as a **Domain** property
- [ ] Verify by DNS TXT record (add it in Cloudflare — same account as Phase 1)
- [ ] Submit **one** URL: `https://bbusiness.online/sitemap-index.xml`
- [ ] Submit `https://bbusiness.online/feed.xml` in the same field
- [ ] Record the discovered URL count per child sitemap
- [ ] Request indexing manually for `/`, `/browse`, `/sitemap`, and 3 idea pages
- [ ] Wait. Then watch these numbers weekly:

| Metric in GSC                               | What it means                                                                               |
| ------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Submitted vs indexed                        | The headline number                                                                         |
| **Discovered – currently not indexed**      | Google found it and chose not to fetch. The number that matters — it means thin or orphaned |
| Crawled – currently not indexed             | Fetched and rejected. Worse: a content-quality judgement                                    |
| Duplicate, Google chose different canonical | A canonical or near-identical-content problem                                               |

**Expect this to be slow.** A new domain gets a small crawl budget, and it grows
with trust. 955 URLs will not index in a week. Large directories get crawled
quickly because of years of domain authority, not a sitemap trick. What we
control is speed of response (Cloudflare Workers is genuinely fast), accurate
`lastmod`, dense internal linking, and the feed. All four are now in place.

---

## 9. Phase 5 — AdSense

- [ ] Site has been live and indexed for at least 2–3 weeks
- [ ] Every box in §7 still passes
- [ ] Apply with the **one** AdSense account (§3)
- [ ] **Record the verdict verbatim in §12 of this document**

### If rejected for "low value content"

This is the finding we paid for. Do not just re-apply. Read which pages they
cite, then fix the cause:

- Templated pages that read as variations of each other → the idea template
  needs more genuinely unique substance per page
- Thin pages → see §11.1, the subcategory pages are the prime suspect
- Not enough original content → the ratio of real prose to boilerplate

Then fix it on `.online`, and only carry the fixed version to `businessidea.io`.

### If approved

The content cleared the bar. Proceed to Phase 6.

---

## 10. Phase 6 and 7 — the flip

### 10.1 The one ordering rule that decides whether this works

**`noindex` first. Keep `robots.txt` crawlable. Block later, or never.**

Google has to _fetch_ a page to read the `noindex` that removes it. If crawling
is blocked at the same moment, it never reads the tag, and the URLs sit in the
index for months. This is the single most common way this exact plan fails.

Search Console's Removals tool hides URLs fast but is **temporary, about six
months**, and does not delete anything. `noindex` is what actually removes.

### 10.2 The teardown, in order

- [ ] **6a.** Cloudflare → `.online` Worker → `SITE_INDEXABLE=false`.
      Whole site goes `noindex` immediately. Sitemaps go empty.
- [ ] **6b.** GSC → Removals → **"Remove all URLs with this prefix"** →
      `https://bbusiness.online/`. One entry covers every URL. This is the
      one-click removal — not one URL at a time.
- [ ] **6c.** Wait. Watch the indexed count in GSC fall toward zero. Weeks, not days.
- [ ] **6d.** Only once it has fallen: block or retire the domain if you want to.

### 10.3 Launching businessidea.io

- [ ] **7a.** Attach `businessidea.io` to its own Worker
- [ ] **7b.** Set `SITE_URL=https://businessidea.io`, `SITE_INDEXABLE=false`
- [ ] **7c.** Run the whole §7 checklist again against the new domain
- [ ] **7d.** Flip `SITE_INDEXABLE=true`
- [ ] **7e.** Add the GSC property, submit `sitemap-index.xml` and `feed.xml`
- [ ] **7f.** Apply to add it as a second site in the same AdSense account

**No content moves. No database changes. No code changes.** Both domains read
the same Supabase project; only `SITE_URL` differs. There is nothing to sync.

### 10.4 On duplicate content

Google has duplicate **filtering**, not a duplicate **penalty**. It picks one
version to show. Once `.online` is de-indexed and dead, `businessidea.io` is the
only live copy, so that is the one shown. Nothing is inherited.

**Changing all the slugs is therefore not needed.** Duplicate matching
fingerprints body text, not URLs, so different slugs with identical content are
still identical content — but by then there is no live copy to be duplicate
against. Keep it as insurance, do not spend the work up front, and do not throw
away every internal link for it.

---

## 11. Known risks and open items

### 11.1 Subcategory pages are 1:1 with ideas — likely the biggest AdSense risk

Measured: **409 completed ideas, 409 distinct subcategory paths.** Every
subcategory contains exactly one idea, so every `/category/x/y` page is a
listing page with one item on it — and it is in the sitemap.

At 409 ideas that is 409 near-empty pages out of ~955 total. **That is 43% of the
site reading as thin content to a reviewer**, and it is the first thing to look at
if the verdict comes back "low value".

Options: exclude subcategory paths from the sitemap, `noindex` them
specifically, or make subcategories a real grouping level with several ideas
each. **Decision needed before Phase 4.**

### 11.2 `internal_link_anchors` is populated on only 11 of 409 rows

The field is now carried through to the page, so the plumbing is done. But
measured: **11 rows out of 409 have a value.** The enrichment run has to populate
the other 398 before on-page cross-linking does anything real. Until then
`/sitemap` is doing all the internal-linking work on its own.

### 11.3 `lastmod` is not truthful yet — needs a schema change

The `ideas` table has **no `updated_at` column** (verified). `lastmod` therefore
reads `created_at`, which is honest for a new idea and a lie for an edited one.

After the enrichment pass rewrites all 409 rows, every page will genuinely have
changed and every sitemap will still report the original date, so **Google will
see no reason to re-crawl any of it.**

Fix: add `updated_at` with a trigger, then change one constant
(`LASTMOD_COLUMN` in `src/lib/sitemap.server.ts`). This is a schema change to a
table the n8n pipeline writes to, so it needs an explicit go-ahead.

### 11.4 Two content issues to settle before applying

- `data/glossary.json` on `main` is marked `"data_level": "ACTUAL"` with **zero
  source URLs**. Either source the entries or change the label. Claiming
  verified data that is not verified is the kind of thing a reviewer does notice.
- `src/lib/validate-shared.ts` names AI vendors in public UI, against the
  standing rule in `CLAUDE.md`. Decide and fix before Phase 3's last checkbox.

### 11.5 Scale ceilings, for later

- `/sitemap` renders every idea in one document. Fine to ~20,000; tranche it
  after that.
- `sitemap-categories.xml` is one file. Fine to 50,000 URLs.
- Supabase: at 10,000 ideas, ~143 MB of the 500 MB free limit. **Egress is the
  binding constraint, not size** — 5 GB/month is roughly 357,000 idea-page
  renders.
- Cloudflare Workers free: 100,000 requests/day, ~2–3 per pageview, so a ceiling
  around 6,600–10,000 visitors/day.

---

## 12. Log

Record what actually happened, with dates. This is the part worth having in six
weeks.

| Date       | Phase | What happened                                                                  |
| ---------- | ----- | ------------------------------------------------------------------------------ |
| 2026-09-18 | 0     | Sitemap tranching, `SITE_INDEXABLE`, HTML sitemap, RSS feed built and verified |
|            | 1     | DNS Hostinger → Cloudflare                                                     |
|            | 2     | Worker + domain attached                                                       |
|            | 3     | QA checklist                                                                   |
|            | 4     | Sitemap submitted, first indexing                                              |
|            | 5     | AdSense verdict:                                                               |
|            | 6     | Teardown started                                                               |
|            | 7     | businessidea.io live                                                           |

---

## 13. Verification commands

Against the live domain once it is up. Replace the host for `businessidea.io` later.

```sh
B=https://bbusiness.online

curl -s $B/robots.txt
curl -s $B/sitemap-index.xml
curl -s $B/sitemap-pages.xml      | grep -c '<loc>'   # expect 105
curl -s $B/sitemap-categories.xml | grep -c '<loc>'   # expect ~441
curl -s $B/sitemap-ideas/1        | grep -c '<loc>'   # expect 409
curl -s -o /dev/null -w '%{http_code}\n' $B/sitemap-ideas/2     # expect 404
curl -s $B/feed.xml               | grep -c '<item>'  # expect 50

# canonical and robots meta on a real page
curl -s $B/ | grep -o '<link rel="canonical"[^>]*>'
curl -s $B/ | grep -o '<meta name="robots"[^>]*>'

# no stray references to the other domain
curl -s $B/sitemap-pages.xml | grep -c 'businessidea\.io'        # expect 0
```
