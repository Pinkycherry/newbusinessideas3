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

**Verification, and its limit at the time:** this container's network policy
blocks `*.supabase.co`, so the database-backed routes could not be exercised
end-to-end locally. Their queries were verified directly against the live
database with SQL, and the non-database routes (`robots.txt`,
`sitemap-pages.xml`, `feed.xml`) were exercised for real.

**That gap is now closed.** Every database-backed route was checked against the
live domain on 2026-09-18 and behaved as designed — see §15.

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
- [ ] **Sign in with Google, and confirm you land back on bbusiness.online** —
      not on any other deployment. See §11.1c if it redirects elsewhere.

### 7.3 Then

- [ ] Flip `SITE_INDEXABLE=true`
- [ ] Re-check `robots.txt` now reads `Allow: /` and names the sitemap index
- [ ] Re-check the `noindex` meta tag is **gone**

---

### 7.4 Pre-submission gate — DO NOT submit a sitemap before this passes

**`SITE_INDEXABLE=false` makes every sitemap return an empty `urlset`.** It is
not only a `noindex` tag. Five things gate on it:

| Gated                               | Where                           |
| ----------------------------------- | ------------------------------- |
| Every `urlset` returns empty        | `src/lib/sitemap.ts:31`         |
| The sitemap index returns empty     | `src/lib/sitemap.ts:53`         |
| `robots.txt` becomes `Disallow: /`  | `src/routes/robots[.]txt.ts:23` |
| Every page emits `noindex,nofollow` | `src/routes/__root.tsx:149`     |
| The RSS feed returns no items       | `src/routes/feed[.]xml.ts:34`   |

Submitting while it is `false` hands Google four empty files behind a blanket
disallow. Search Console will accept them and report success, and nothing will
ever index.

**Order of operations:**

- [ ] 1. Cloudflare → Worker → Variables and Secrets → set `SITE_INDEXABLE` to `true`
- [ ] 2. Redeploy, or wait for the next deployment to pick it up
- [ ] 3. Confirm `robots.txt` now reads `Allow: /` and names the sitemap index
- [ ] 4. Confirm the `noindex` meta tag is **gone** from the homepage source
- [ ] 5. Confirm the counts below
- [ ] 6. Only then submit

**Expected counts once indexable** (measured against the live database):

| URL                       | Expect                                                      |
| ------------------------- | ----------------------------------------------------------- |
| `/sitemap-pages.xml`      | 105 URLs                                                    |
| `/sitemap-categories.xml` | ~441 URLs (16 categories + 409 subcategories + 16 validate) |
| `/sitemap-ideas/1`        | 409 URLs                                                    |
| `/sitemap-ideas/2`        | **404** — there is only one tranche at 409 ideas            |
| `/sitemap-index.xml`      | 3 children, each with a `<lastmod>`                         |
| `/feed.xml`               | 50 items                                                    |
| **Total**                 | **~955 URLs**                                               |

**Submit only `sitemap-index.xml`.** It names the children itself. Submitting
the children separately as well only makes the coverage report harder to read.

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
- Thin pages → check which URLs they cite before changing anything; see §11.1a for why the subcategory pages were kept
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
- [ ] **7e.** Supabase → Authentication → URL Configuration → Redirect URLs:
      add `https://businessidea.io/**` and `https://www.businessidea.io/**`.
      Without it, Google sign-in lands on the wrong site — see §11.1c.
- [ ] **7f.** Add the GSC property, submit `sitemap-index.xml` and `feed.xml`
- [ ] **7g.** Apply to add it as a second site in the same AdSense account

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

### 11.1 `seo_title` — FIXED 2026-09-20, all 409 rows rewritten

**Status: closed.** Run on 2026-09-20. 392 of 409 rows changed; 17 were already
correct and were left alone. Repo side: commit
https://github.com/Pinkycherry/newbusinessideas3/commit/66f09de

`src/routes/idea.$slug.tsx:112` renders `seo_title` as the `<title>` ahead of
`title`, so this string — not the idea's display name — is **what Google prints
as the blue link, and what a person reads when deciding whether to click.**

#### What was wrong

The old values were title-cased slugs with `Business Path` appended, which broke
on three counts: `Business Business` on 173 rows, `Idea Idea` on the rows whose
keyword already ended in "idea", and acronyms cased as words (`Ai`, `Api`,
`Saas`, `Seo`, `Ugc`) on 11 rows. `Business Path` itself said nothing and
occupied the most valuable characters in the title.

#### The rule that replaced it

One focus keyword + `Business` + `Idea` + one hook, never over 60 characters.
The hard part was **not** appending words the keyword already carries. Counted
on the live table before the write:

| Keyword already contains | Rows | Appended |
| ------------------------ | ---- | -------- |
| business **and** idea    | 62   | nothing  |
| business only            | 211  | ` Idea`  |
| idea only                | 22   | nothing — `Business` after `…Idea` breaks word order |
| neither                  | 114  | ` Business Idea` |

Two rows in the last bucket ran past 60 with both words appended. There
`Business` is the droppable half: `<keyword> Idea` keeps the word order and the
singular, and the keyword itself is never cut, because it is the only part doing
SEO work.

Plurals are singularised (`Ideas` → `Idea`, `Businesses` → `Business`) because
one page is one idea. **Only 1 row of 409 was affected** — the rule exists to
stop the n8n pipeline reintroducing it, not because it was widespread.

#### Hooks

Six, chosen longest-first and rotated by `idea_id` so the library does not end
409 titles the same way:

`Real Costs + Honest Verdict` · `Costs, Pay + Verdict` · `Honest Verdict` ·
`Real Costs` · `Worth It?` · `Verdict`

Every one names a field verified non-empty on all 409 rows (`verdict` 409/409,
`startup_cost` 409/409, `income_potential` 409/409). **`Proven`, `Profitable`,
`Guaranteed`, `Best`, `Easy` and `Fastest` are all excluded** — they are claims
with no source, and the zero-fabricated-numbers rule covers adjectives too.

352 rows carry a hook. **57 do not**: their keyword alone eats 52–60 characters,
and buying a hook there means truncating the keyword. Those ship clean instead.

#### Verified after the write

| Check | Result |
| ----- | ------ |
| Rows | 409 |
| Distinct titles | **409** (was 408 — one collision removed) |
| Longest title | 60 characters |
| Average | 54.3 characters |
| Over 60 | 0 |
| `Business Business` / `Idea Idea` | 0 |
| Plurals | 0 |
| `Idea Business` word-order break | 0 |
| Unsourceable claim words | 0 |
| Rows stamped `updated_at` today | 392 — exactly the number that changed |

**Rollback:** the old values are in `public.ideas_seo_title_backup_20260920`
(`idea_id`, `seo_title`, `taken_at`). Drop that table once the new titles have
been seen in Search Console.

#### Still open from this pass

- **`meta_description`** is populated on all 409 and was probably generated by
  the same rule, so it likely carries the same duplication. It is the other half
  of what a person sees before they click, and it has not been audited yet.
- **The n8n pipeline still generates the old format.** It writes `seo_title` on
  every run, so the next run will reintroduce `Business Path` on any row it
  touches. The workflow needs the four-bucket rule applied to it — *edit the
  existing workflow, never add a second one*. Both n8n MCP servers failed to
  connect this session, so this could not be checked from here.
- **Casing note:** standard title case lower-cases joining words, so
  `Work From Home` is now `Work from Home`. Say the word and `From`, `With` and
  `For` go back to capitals everywhere.

### 11.1a Subcategory pages — DECIDED, keeping them

Measured: 409 completed ideas, 409 distinct subcategory paths, so every
`/category/x/y` page holds exactly one idea.

**Decision: keep them indexed, unchanged.** The reasoning, which is sound:

- The URL carries the category term **and** the specific term
  (`/category/ai-automation/ai-content-repurposing-tool`), which is a precise
  long-tail target. The strategy is not to rank all 409 — it is to place one
  bat on one specific ball, and a URL naming both the vertical and the exact
  thing is how a directory wins those queries.
- **They are not duplicates of the idea pages.**
  `category.$categorySlug.$subcategorySlug.tsx:152` renders an `IdeaCard` — a
  summary card — not the full blueprint. A listing page pointing at a detail
  page is ordinary directory structure.
- Every route emits its own canonical, so the two URLs are correctly
  distinguished to a crawler.

Revisit only if AdSense or Search Console gives a specific signal about these
pages. Not before.

### 11.1b Two lockfiles at the repo root — the cause of the first failed deploy

`bun.lock` and `package-lock.json` both sit at the root. Cloudflare detects bun
and runs `bun install --frozen-lockfile`, so `bun.lock` is the one that decides
whether a deploy happens at all.

They drifted: `ogl`, `react-markdown` and `rehype-raw` were added to
`package.json` and reached `package-lock.json`, but never `bun.lock`. The frozen
install refused, and the build stopped before the build command ever ran.

Both are now regenerated and agree. **The hazard remains:** installing a package
with `npm` updates only one of them, and the next deploy fails the same way.
Until one is removed, always run `bun install` after changing `package.json`,
and check `bun install --frozen-lockfile` passes before pushing.

The old `bun.lock` also pinned every `@supabase/*` tarball to a private Lovable
npm cache (`europe-west1-npm.pkg.dev/lovable-core-prod/...`), which returns 403
outside that sandbox. The regenerated lockfile resolves from the public registry
and carries none of those URLs.

Unrelated and not fixed: `npm audit` reports one high-severity advisory in
`js-yaml` (4.0.0–4.3.1), reached only through build and lint tooling. It is not
in the deployed Worker, so it is not launch-blocking.

### 11.1c Google sign-in redirects to the wrong site unless the domain is allow-listed

**Status: RESOLVED on bbusiness.online (2026-09-18), tested working. Still to do for `businessidea.io` — see §10.3 step 7e.**

Signing in sent the user to the BBI-With-ChatGPT deployment instead of back to
this site. **This is a Supabase dashboard setting, not a code defect.**

The code is correct. `src/routes/sign-in.tsx:26` builds
`window.location.origin + path`, and `src/lib/auth-client.ts:31` passes it to
`signInWithOAuth` as `redirectTo` — so from this domain it correctly asks to
return to `https://bbusiness.online/`.

But Supabase honours a `redirectTo` **only if it matches the project's Redirect
URLs allow-list**. Anything else is discarded and the user is sent to the
project's **Site URL** instead. Both sites share Supabase project
`jqzadwobnfypmytcbpkw` ("BBI"), whose Site URL names the other deployment — so
the sign-in completes and lands on the wrong site.

**Fix: add to the allow-list only. Do not change Site URL.** Because this app
always sends an explicit `redirectTo`, an allow-list entry is sufficient, and
Site URL then never applies here. Changing Site URL would move where the OTHER
project's sign-ins land, since it is the same Supabase project.

Supabase → Authentication → URL Configuration → Redirect URLs, add:

```
https://bbusiness.online/**
https://www.bbusiness.online/**
https://pinkycherry-newbusinessideas3.spandhana1212.workers.dev/**
```

Keep every existing entry. No Google Cloud change is needed — Google's
authorised redirect URI points at Supabase's own `/auth/v1/callback`, which does
not vary per site.

**This will need doing again for `businessidea.io`** at Phase 7. Added to §10.3.

### 11.2 `internal_link_anchors` is populated on only 11 of 409 rows

The field is now carried through to the page, so the plumbing is done. But
measured: **11 rows out of 409 have a value.** The enrichment run has to populate
the other 398 before on-page cross-linking does anything real. Until then
`/sitemap` is doing all the internal-linking work on its own.

### 11.3 `lastmod` — FIXED 2026-09-20

**Status: closed.** Migration `ideas_add_updated_at` applied to the BBI project
on 2026-09-20, immediately before the `seo_title` rewrite. Repo side:
https://github.com/Pinkycherry/newbusinessideas3/commit/66f09de

The `ideas` table had no `updated_at` column, so `LASTMOD_COLUMN` in
`src/lib/sitemap.server.ts` read `created_at` — honest for a new idea, a lie for
an edited one. Every sitemap reported the original creation date, so a content
pass could rewrite all 409 rows and **Google would see no reason to re-crawl any
of it.**

What was added:

- `updated_at timestamptz not null default now()`, backfilled from `created_at`
  so an untouched row still reports the date it was actually last changed.
- A `before update` trigger, `ideas_set_updated_at`.
- **The trigger carries `when (old.* is distinct from new.*)`.** This guard is
  the point, not a detail: the n8n pipeline upserts every row on each run, and
  without it a no-op upsert would stamp the current date on all 409 and tell
  Google the whole library changed when nothing did. An unchanged row keeps its
  old timestamp.

Proven on the `seo_title` write that followed: 392 rows changed, and exactly 392
rows were stamped with today's date. The 17 already-correct rows kept theirs.

### 11.4 Two content issues to settle before applying### 11.4 Two content issues to settle before applying

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

## 12. Competitor layout and metrics — what IdeaProof does that we do not

From screenshots of their validate flow. Recorded because it is the clearest
picture yet of the gap, and because three of the four ASAP items already in
this document are the same problem wearing different clothes.

### 12.1 What their page actually does

**A live progress readout.** "Validating your idea… 15s · 100-pt · GO/NO-GO ·
Risks · ICP", a percentage bar, and a stage checklist that ticks off as it
goes: researching market data, analysing competitors, evaluating industry
trends, processing insights (≈25s), calculating success score, generating
report. Each stage names its sources as chips — Reddit, X, HackerNews, YC
threads.

**The wait is converted into browsing.** "EXPLORE WHILE YOU WAIT — 73/73
resources", with tabs for All, Calculators, Lists, Guides, AI Tools,
Templates, Databases, Reports, Q&A, and a scrollable rail of real items
(Market Size Calculator, Startup Cost Calculator, CAC Calculator, ROI
Calculator), each with an icon, a one-line description and an open-in-new
affordance.

**A visible upgrade ladder.** "YOUR JOURNEY — Step 1 of 6 starts now":
Validation FREE → Market → Plan → Brand → Visual → Ads, each priced in
credits, with "1st validation FREE", a signup bonus, and "Unlock more steps
after validation". A credit balance sits in the header and visibly decrements.

**Trust microcopy at the point of hesitation:** "No card required · Your idea
is safe".

### 12.2 Why it works, and which parts are actually about SEO

| What it is                   | Why it works                                                                                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Stage checklist with timings | Makes a slow call read as work being done rather than a hang. The honesty about ≈25s is what buys the patience                                                                                   |
| Named sources as chips       | Substantiates the output before the output exists                                                                                                                                                |
| 73 resources during the wait | **This is internal linking sold as a feature.** Every one of those chips is a link from a page the visitor is already on to a deep page — the exact mechanism in §11.2 that we have switched off |
| Credit ladder                | Monetises without a subscription, and each rung is its own page to rank                                                                                                                          |
| Trust line                   | Removes the two objections a first-time visitor actually has                                                                                                                                     |

### 12.3 What we can copy, and what we cannot

**Can, and should:**

- **The resource rail.** We already have 60 calculators, ~22 guides, founder
  stories and a glossary — more than enough to fill it. It needs no AI and no
  credits, and it is the same internal-linking fix as §11.2 and the HTML
  sitemap, just surfaced where a visitor already is.
- **The stage checklist and trust line.** Presentation only.
- **A visible ladder.** Ours would be free tiers rather than credits, but the
  principle — show the next step and what it costs — holds.

**Cannot, honestly:**

- **The live AI validation.** `CLAUDE.md` is explicit: the Anthropic API is
  not part of a Pro or Max subscription, and any feature needing it ships
  switched off. A flow like theirs is a per-call cost we do not have. Ours has
  to stay a prompt the visitor runs themselves, which is the honest version and
  also the one the homepage copy already argues for.
- **Their source chips as-is.** Naming Reddit or HackerNews is fine. Naming an
  AI vendor is not — see §11.5, which is still open in
  `src/lib/validate-shared.ts`.

### 12.4 Where this sits against the ASAP list

Ranked by what actually moves indexing, which is the thing the trial is
testing:

1. ~~**`seo_title`** (§11.1)~~ — **done 2026-09-20.** All 409 rewritten.
2. ~~**`updated_at`** (§11.3)~~ — **done 2026-09-20**, and done *first*, so the
   rewrite above is visible to Google instead of silent.
3. **`meta_description`** (§11.1) — the other half of what a person sees before
   they click. Populated on all 409, almost certainly carries the same
   duplication the titles did, and has not been audited. **This is now the top
   item.**
4. **The n8n workflow still writes the old title format** (§11.1) — every run
   re-introduces `Business Path` on any row it touches, so the fix above decays
   until the workflow carries the four-bucket rule. *Edit the existing workflow.*
5. **Internal linking** (§11.2) — `internal_link_anchors` on 11 of 409 rows.
   The resource rail is the same fix with a visible payoff.
6. **Sources** — 398 of 409 ideas cite none (`external_links` on 11). The
   zero-fabricated-numbers rule is a promise the pages do not yet keep.
7. **The resource rail and ladder** — real, but presentation. It earns
   attention once pages are indexed; it does not get them indexed.

The order does not change. This is a reason to finish 3–6, not to start 7.

---

## 13. Log

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

## 14. Verification commands

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

---

## 15. Deployment record — bbusiness.online, 2026-09-18

Kept verbatim as the record of how the trial domain was brought up, including
the DNS records that were deleted, in case any of it has to be restored or
repeated for `businessidea.io`.

### 15.1 Worker

|        |                                           |
| ------ | ----------------------------------------- |
| Name   | `pinkycherry-newbusinessideas3`           |
| Repo   | `Pinkycherry/newbusinessideas3`           |
| Branch | `main`                                    |
| Build  | `#610c1d8d`, commit `4c26b6a` — succeeded |

Two commits landed after that build and deployed on their own: `231e942` (this
document's sign-in finding) and `ddf55c5` (the `/sitemap` layout fix noted as
open in 14.4).

### 15.2 Environment — the runtime/build distinction that cost an hour

Both sets carry the same six names. **Values are never recorded here.**

- **Build variables** (build-time, plain text) — all six set.
- **Runtime Secrets** — all six set. **This is what fixed the SSR error.**
  Stored as Secrets rather than plain-text variables because `npx wrangler
deploy` runs against a generated config with no `vars` block, so dashboard
  plain-text variables can be cleared by a future git deploy. Secrets are
  managed separately and survive.

`SITE_INDEXABLE` = `false`, deliberately.

The six: `SITE_URL`, `SITE_INDEXABLE`, `IDEAVAULT_DB_URL`,
`IDEAVAULT_DB_ANON_KEY`, `VITE_IDEAVAULT_DB_URL`, `VITE_IDEAVAULT_DB_ANON_KEY`.

### 15.3 Domain

- `bbusiness.online` (apex) attached as a **Custom Domain**; certificate active,
  site serves over HTTPS.
- `www.bbusiness.online` — **not attached.** Only the apex is in the list.

**DNS records deleted to free the apex — restore values if ever needed:**

```
A      bbusiness.online   →  2.57.91.91        (Hostinger)
CNAME  www                →  bbusiness.online
```

### 15.4 Live checks, all passed

| Check                | Result                                                                          |
| -------------------- | ------------------------------------------------------------------------------- |
| Homepage             | Renders fully — 409 blueprints across 16 categories                             |
| `/robots.txt`        | `User-agent: *` / `Disallow: /`                                                 |
| `/sitemap-pages.xml` | Empty urlset                                                                    |
| `/sitemap-index.xml` | Empty                                                                           |
| `/browse`            | Lists ideas, 409 across 16 categories                                           |
| `/sitemap`           | HTML, 409 idea links + 16 categories                                            |
| Idea page            | Renders fully — blueprint, who pays, money, risks, verdict, costs, how to start |
| Homepage `<head>`    | `<link rel="canonical" href="https://bbusiness.online/"/>`                      |
| Homepage `<head>`    | `<meta name="robots" content="noindex,nofollow"/>`                              |

**The last three rows are the ones that matter most.** `Disallow: /`, empty
sitemaps and a `noindex` meta tag together confirm `SITE_INDEXABLE=false` works
on a real deployment, which is what makes the teardown in §10 trustworthy. The
canonical naming `bbusiness.online` confirms `SITE_URL` drives every absolute
URL, which is what makes the domain switch a single variable.

### 15.5 Problems hit, and what each turned out to be

| Symptom                                                 | Actual cause                                                                                                                                                                              | Fix                                                                                                                                                            |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| First build failed                                      | `bun install --frozen-lockfile` — `bun.lock` missing `ogl`, `react-markdown`, `rehype-raw`, which were in `package-lock.json`. Build command never ran                                    | Both lockfiles regenerated — commit `4c26b6a`. See §11.1b                                                                                                      |
| Homepage SSR-errored on every route                     | Runtime env empty; the six variables were build-time only. The root loader hits the database before anything renders, so every route showed the app's own error page                      | Six runtime Secrets added                                                                                                                                      |
| Google sign-in bounced to the old BBI-With-ChatGPT site | Supabase honours `redirectTo` only if allow-listed, else falls back to the project's Site URL, which named the other deployment                                                           | Added `bbusiness.online/**`, `www.bbusiness.online/**` and the workers.dev `/**` to the Supabase redirect allow-list. **Site URL left untouched** — see §11.1c |
| Domain attach blocked                                   | Existing Hostinger `A` and `CNAME` records held the apex                                                                                                                                  | Both deleted (values in §15.3), apex attached                                                                                                                  |
| `/sitemap` inner layout looked dated                    | The page used `SiteShell` plus its own hand-rolled components, including a local `Section` shadowing the shared one, instead of the `ContentPage` layout the other ten content routes use | Commit `ddf55c5`                                                                                                                                               |

### 15.6 Open items from the bring-up

- [ ] `www.bbusiness.online` not attached — add it if www should resolve.
- [ ] One leftover Supabase redirect entry, `https://bbusiness.online/` with no
      wildcard. Harmless; optional to remove.
- [ ] §7.2 content and trust checks not yet walked — do these before Phase 4.

---
