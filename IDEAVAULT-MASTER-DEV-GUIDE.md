# IDEAVAULT AI — MASTER DEVELOPER GUIDE
### The Complete Reference for Every Future Edit

This document is the single source of truth for editing, extending, and maintaining IdeaVault AI.
Start every new Claude session by sharing this file first.

---

## 1. PROJECT IDENTITY

**Working name:** IdeaVault AI (brand name TBD, replace everywhere when finalized)
**Live site (Lovable hosting):** https://newbusinessideas3.lovable.app
**GitHub repo:** https://github.com/Pinkycherry/V2-business
**Vercel deployment:** https://v2-business.vercel.app
**Supabase project ID:** hmusfenydgyitwgiseti
**Supabase URL:** https://hmusfenydgyitwgiseti.supabase.co
**WordPress trial source:** nutrizoe.in (placeholder only, will be replaced with real domain)

---

## 2. WHAT THIS SITE IS

A business idea directory and startup intelligence platform. Contains researched "blueprints" for small business ideas organized in a Category → Subcategory → Idea hierarchy. Users browse for free. Pro Pass ($49 one-time) unlocks premium blueprints and a live AI audit feature that generates a personalized report (market sizing, competitor map, 90-day launch plan) via Gemini API.

**Two-tier content model:**
- Tier 1: Static pre-written blueprints stored in Supabase, free or premium by tier column
- Tier 2: Live AI audit (Gemini API call) gated behind Pro Pass purchase via Stripe

**Data pipeline:** Google Sheets → n8n automation → Supabase (fully automated, never touch manually)

---

## 3. COMPLETE FILE MAP

### Pages (routes)
| Page | URL | File |
|---|---|---|
| Homepage | `/` | `src/routes/index.tsx` |
| Browse all | `/browse` | `src/routes/browse.tsx` |
| Category | `/category/[slug]` | `src/routes/category.$categorySlug.tsx` |
| Subcategory | `/category/[slug]/[sub]` | `src/routes/category.$categorySlug.$subcategorySlug.tsx` |
| Idea detail | `/idea/[slug]` | `src/routes/idea.$slug.tsx` |
| Search | `/search` | `src/routes/search.tsx` |
| Blog index | `/blog` | `src/routes/blog.index.tsx` |
| Blog post | `/blog/[slug]` | `src/routes/blog.$slug.tsx` |
| Pricing | `/pricing` | `src/routes/pricing.tsx` |
| Services | `/services` | `src/routes/services.tsx` |
| About | `/about` | `src/routes/about.tsx` |
| Contact | `/contact` | `src/routes/contact.tsx` |
| Terms | `/terms` | `src/routes/terms.tsx` |
| Privacy | `/privacy` | `src/routes/privacy.tsx` |
| Disclaimer | `/disclaimer` | `src/routes/disclaimer.tsx` |
| GDPR | `/gdpr` | `src/routes/gdpr.tsx` |
| Refund Policy | `/refund-policy` | `src/routes/refund-policy.tsx` |

### Components
| Component | File | What it does |
|---|---|---|
| Header + Footer | `src/components/site-shell.tsx` | Wraps every page, contains nav, dropdown, footer columns |
| Idea card | `src/components/idea-card.tsx` | Single blueprint card used in grids everywhere |
| Background spheres | `src/components/ambient-scene.tsx` | Animated orange spheres/rings behind all pages |
| AI audit widget | `src/components/ai-audit.tsx` | Run AI Audit button + drawer + Gemini call |
| Auth modal | `src/components/AuthModal.tsx` | Supabase sign-in/sign-up modal |
| Ad slot | `src/components/AdSlot.tsx` | Placeholder for all ad placements site-wide |
| Page layout | `src/components/page-layout.tsx` | Shell for legal/marketing static pages |

### Config files (edit these for quick changes, zero code knowledge needed)
| What | File | What to change |
|---|---|---|
| Featured homepage ideas | `src/config/featured.ts` | `FEATURED_IDEA_IDS` array |
| Header dropdown collections | `src/config/collections.ts` | Array of label+url objects |
| WordPress source URL | `src/lib/site-config.ts` | `DEFAULT_WORDPRESS_SITE_URL` constant |

### Library files (be careful, high butterfly effect)
| File | What it does | Risk if edited wrong |
|---|---|---|
| `src/lib/ideas.functions.ts` | All Supabase queries for ideas | Breaks every page showing ideas |
| `src/lib/blog.server.ts` | WordPress API fetch for blog | Breaks /blog and /blog/[slug] |
| `src/lib/blog.functions.ts` | Blog helper functions | Breaks blog pages |
| `src/lib/audit.server.ts` | Gemini API call for AI audit | Breaks Run AI Audit feature |
| `src/lib/supabase.ts` | Supabase client connection | Breaks entire site if touched |

### Root and config
| File | Purpose |
|---|---|
| `src/routes/__root.tsx` | Site-wide HTML head, meta title, meta description, favicon reference |
| `src/styles.css` | All color variables, blob shapes, glass effects — entire visual system |
| `src/config/featured.ts` | Homepage featured blueprint IDs |
| `src/config/collections.ts` | Header dropdown curated collection links |
| `public/favicon.ico` | Site favicon (replace file, keep filename) |
| `supabase/` folder | Database migrations and schema |
| `.env` | Environment variables (Supabase keys) |

---

## 4. BUTTERFLY EFFECT MAP

**Before editing any file, check this map. Changes cascade.**

### SAFE to edit (zero butterfly effect)
- `src/routes/index.tsx` — homepage only, nothing else reads from it
- `src/config/featured.ts` — only affects homepage featured strip
- `src/config/collections.ts` — only affects header dropdown Collections column
- `src/routes/about.tsx`, `src/routes/contact.tsx`, all legal page files — isolated static pages
- `public/favicon.ico` — replace file, keep filename

### LOW butterfly effect (touches 1-2 other things)
- `src/components/ambient-scene.tsx` — background visuals only, no data, safe but affects every page visually
- `src/components/page-layout.tsx` — affects all legal/static pages layout
- `src/routes/blog.index.tsx`, `src/routes/blog.$slug.tsx` — affects blog only
- `src/lib/blog.server.ts` — affects /blog and /blog/[slug] simultaneously
- `src/lib/site-config.ts` — changing WordPress URL affects all blog pages

### MEDIUM butterfly effect (touches multiple pages)
- `src/components/site-shell.tsx` — **touches every single page** since it wraps all of them. Changing nav links, footer, or header breaks navigation site-wide. Changing Supabase queries in here affects all category counts in the dropdown. Edit carefully.
- `src/routes/category.$categorySlug.tsx` — affects all category pages
- `src/routes/browse.tsx` — affects browse page and any component it imports

### HIGH butterfly effect (most dangerous files)
- `src/styles.css` — changing color variables or blob shapes affects **the entire site simultaneously**. Always change one variable at a time and verify before changing the next.
- `src/lib/ideas.functions.ts` — every query for ideas lives here. Changing a query, filter, or column selection breaks every page that shows ideas: homepage, browse, category, idea detail, search, featured strip.
- `src/components/idea-card.tsx` — used on homepage grid, category pages, browse page, search results simultaneously. Changing its structure or props breaks all four.
- `src/routes/idea.$slug.tsx` — changing layout or data fetching affects all 80+ idea detail pages simultaneously
- `src/lib/supabase.ts` — **never edit this file** unless you know exactly what you're doing. Breaking the Supabase client breaks the entire site.
- `src/routes/__root.tsx` — affects site-wide HTML head. Safe for meta text changes, risky for structural changes.

---

## 5. COLOR SYSTEM

**File: `src/styles.css` — `:root` block**

All colors use `oklch(lightness chroma hue)` format.

| Variable | Current value | Controls |
|---|---|---|
| `--background` | `oklch(0.19 0.008 264)` | Main page background (deep warm charcoal) |
| `--foreground` | `oklch(1 0 0)` | All primary text (white) |
| `--primary` | `oklch(0.687 0.161 51.5)` | Brand orange: buttons, CTAs, active links, VAULT pill |
| `--ember` | `oklch(0.723 0.161 56)` | Second orange in gradients: buttons, logo, spheres |
| `--accent` | soft amber | Eyebrow labels, trend scores, section kickers |
| `--warm` | `oklch(0.735 0.02 71)` | Warm neutral in headline gradients |
| `--muted-foreground` | warm grey | Secondary copy, card excerpts, footer links |
| `--card` | translucent white | Card and panel fill |
| `--border` | `oklch(1 0 0 / 20%)` | 1px glass borders and dividers |
| `--destructive` | red | "What will hurt" / cons markers |
| `--ambient-opacity` | `0.35` | Opacity of background spheres and rings (0 = hidden, 1 = full) |

**To change entire brand color:** Edit `--primary` and `--ember` in `:root`. Both update together.
**To calm background:** Lower `--ambient-opacity` toward 0.
**To change text color globally:** Edit `--foreground`.

### Real hex equivalents for reference
| Color | Hex | Use |
|---|---|---|
| Primary orange | `#E37D24` / `#F08C2B` | CTAs, highlights |
| Amber glow | `#FFAA4D` | Gradients, sphere glow |
| Dark background | `#1E2026` → `#2D2F36` | Canvas |
| Glass panel | `rgba(255,255,255,0.08)` | Card surfaces |
| Glass border | `rgba(255,255,255,0.20)` | Card edges |

---

## 6. HOW TO EDIT COMMON THINGS

### Change the site title and meta description
**File:** `src/routes/__root.tsx`
Find the `head()` function. Edit the `<title>` tag and `<meta name="description">` tag.
Current title: "IdeaVault — Researched Small Business Ideas & Startup Blueprints"

### Change brand name everywhere
1. `src/components/site-shell.tsx` → find "IDEA" and "VAULT" text in logo section
2. `src/routes/__root.tsx` → find title tag and twitter:site meta tag
3. `public/favicon.ico` → replace file, keep same filename
4. Search entire codebase for "IdeaVault" and replace all instances

### Change homepage headline and subheadline
**File:** `src/routes/index.tsx`
Find the hero section inside the EDITABLE SECTION START comment. The headline and subheadline are plain text strings inside JSX.

### Change featured blueprints on homepage
**File:** `src/config/featured.ts`
Edit the `FEATURED_IDEA_IDS` array. Use real idea_id values from your Supabase ideas table (format: `IDEA-00001`). Order in the array = order on screen. Non-existent or non-completed IDs are silently skipped.

### Add a new collection to the header dropdown
**File:** `src/config/collections.ts`
Add to the array: `{ label: "Your Collection Name", url: "/browse" }`
This appears in the "BY WHO YOU ARE" or "BY INVESTMENT" column of the mega-menu. To add a third column, edit `src/components/site-shell.tsx` where the dropdown columns are rendered.

### Change the WordPress blog source
**File:** `src/lib/site-config.ts`
Find constant: `DEFAULT_WORDPRESS_SITE_URL`
Change its value to your real WordPress domain. One line change. Affects /blog and /blog/[slug] automatically.

### Add a new footer link
**File:** `src/components/site-shell.tsx`
Find the `footerColumns` array. Add to whichever column is appropriate:
`{ to: "/your-path", label: "Your Label" }`

### Add a new page
1. Create `src/routes/your-page.tsx` (copy structure from `src/routes/about.tsx`)
2. Add `createFileRoute("/your-page")` at the top
3. Add EDITABLE SECTION START/END comments
4. Wire to footer: add to `footerColumns` in `src/components/site-shell.tsx`
5. Wire to header if needed: add to `navLinks` in same file
6. Never edit `src/routeTree.gen.ts` — it regenerates automatically

### Add a new section to any page
Every page file has these comments marking the safe zone:
`{/* EDITABLE SECTION START — safe to add, remove, or reorder sections below */}`
`{/* EDITABLE SECTION END */}`
Add your new section between these two comments. Do not edit above START.

### Activate an ad slot
**File:** whichever file contains the AdSlot with the position you want
Find: `<AdSlot position="position-name" size="banner" />`
Change to: `<AdSlot position="position-name" size="banner" adCode="YOUR_AD_HTML_HERE" />`
While adCode is empty the slot takes zero space and renders nothing.

---

## 7. COMPLETE AD SLOT MAP

All slots are currently empty (invisible). Activate by adding adCode prop.

| Position name | Size | File |
|---|---|---|
| `homepage-hero-below` | banner | `src/routes/index.tsx` |
| `homepage-featured-below` | banner | `src/routes/index.tsx` |
| `homepage-above-footer` | banner | `src/routes/index.tsx` |
| `category-above-grid` | banner | `src/routes/category.$categorySlug.tsx` |
| `category-in-grid-1` through `category-in-grid-N` (every 6th card) | banner | `src/routes/category.$categorySlug.tsx` |
| `idea-detail-between-proscons-verdict` | banner | `src/routes/idea.$slug.tsx` |
| `idea-detail-below-verdict` | banner | `src/routes/idea.$slug.tsx` |
| `idea-detail-right-affiliate` | rectangle | `src/routes/idea.$slug.tsx` (sticky right column) |
| `idea-detail-above-related` | banner | `src/routes/idea.$slug.tsx` |
| `blog-post-after-first-paragraph` | banner | `src/routes/blog.$slug.tsx` |
| `blog-post-mid-article` | rectangle | `src/routes/blog.$slug.tsx` |
| `blog-post-after-last-paragraph` | banner | `src/routes/blog.$slug.tsx` |
| `search-in-results-1` through `search-in-results-N` (every 5th result) | banner | `src/routes/search.tsx` |

---

## 8. DATABASE SCHEMA — 23 COLUMNS

**Table: `ideas` in Supabase project `hmusfenydgyitwgiseti`**

| Column | Type | Purpose |
|---|---|---|
| `idea_id` | TEXT PRIMARY KEY | Unique ID, format IDEA-00001 |
| `category_id` | TEXT | e.g. CAT-001 |
| `category_name` | TEXT | e.g. "Tech & SaaS" |
| `category_slug` | TEXT | e.g. "tech-saas" |
| `subcategory_id` | TEXT | e.g. SUB-001 |
| `subcategory_name` | TEXT | e.g. "AI Chrome Extension Tools" |
| `subcategory_slug` | TEXT | e.g. "ai-chrome-extension-tools" |
| `collection_id` | TEXT | Optional grouping |
| `status` | TEXT | pending / completed / needs_retry / regenerating |
| `focus_keyword` | TEXT | Primary SEO keyword for this idea |
| `additional_keyword_1` | TEXT | Secondary SEO keyword |
| `additional_keyword_2` | TEXT | Tertiary SEO keyword |
| `business_description` | TEXT | Human-written seed brief (LLM anchor) |
| `title` | TEXT | Invented business name |
| `slug` | TEXT UNIQUE | Full URL slug |
| `summary` | TEXT | 6-9 sentence blueprint (shown on detail page only) |
| `tags` | JSONB | Array of short topic tags |
| `pros_json` | JSONB | Array of specific advantages |
| `cons_json` | JSONB | Array of real obstacles |
| `verdict` | TEXT | Honest 2-3 sentence founder-fit assessment |
| `trend_score` | INT | Viability score 55-98 |
| `tier` | TEXT | 'free' or 'premium' (premium if trend_score >= 88) |
| `region_tags` | JSONB | Nullable, reserved for future country filtering |
| `created_at` | TIMESTAMPTZ | Auto-set on insert |

**CRITICAL RULE: Every frontend query must filter `WHERE status = 'completed'`**
Rows in any other status must never render anywhere on the public site.

**Row Level Security:** Enabled. Public read-only policy active. No public insert/update/delete.

---

## 9. DATA PIPELINE (DO NOT TOUCH)

**Google Sheets → n8n → Supabase → Live site**

- Data is generated by Gemini AI via n8n automation
- n8n workflow: `IdeaVault_AI_-_Sector_Adaptive_Fix.json`
- Gemini credential name in n8n: "Ethical Founder"
- New rows automatically appear on site when status = completed
- Never manually insert rows into Supabase, always go through the pipeline
- Never modify the n8n workflow without understanding the full schema

---

## 10. ENVIRONMENT VARIABLES

**Set in Vercel → Settings → Environment Variables**
Must be set for Production AND Preview environments.
Must redeploy after adding/changing any variable.

| Key | Value source | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase → Settings → API | Database connection |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase → Settings → API Keys (sb_publishable_...) | Database auth |

Note: AI audit uses `LOVABLE_API_KEY` (managed by Lovable, not needed in Vercel manually).
Stripe keys (when added): must NEVER have VITE_ prefix — keep server-side only.

---

## 11. 100 CATEGORY PLAN

All 100 categories go into Supabase via n8n automation. Zero code changes needed. Once added, they appear automatically in the dropdown and browse page.

**Target:** 100 categories × 50 subcategories × 1 idea each = 5,000 ideas (phase 1)
**Final scale:** 100 categories × 100 subcategories = 10,000 ideas

**Full category list (CAT-001 to CAT-100):**
CAT-001: Zero Investment Business Ideas | zero-investment-business-ideas
CAT-002: Low Investment Business Ideas | low-investment-business-ideas
CAT-003: Work From Home Business Ideas | work-from-home-business-ideas
CAT-004: Side Hustle Ideas | side-hustle-ideas
CAT-005: Passive Income Business Ideas | passive-income-business-ideas
CAT-006: Part Time Business Ideas | part-time-business-ideas
CAT-007: Online Business Ideas | online-business-ideas
CAT-008: Home Based Business Ideas | home-based-business-ideas
CAT-009: Small Investment Startup Ideas | small-investment-startup-ideas
CAT-010: One Person Business Ideas | one-person-business-ideas
CAT-011: Weekend Business Ideas | weekend-business-ideas
CAT-012: Student Business Ideas | student-business-ideas
CAT-013: Business Ideas for Women | business-ideas-for-women
CAT-014: Business Ideas for Retirees | business-ideas-for-retirees
CAT-015: Mobile Business Ideas | mobile-business-ideas
CAT-016: Seasonal Business Ideas | seasonal-business-ideas
CAT-017: Subscription Based Business Ideas | subscription-based-business-ideas
CAT-018: Local Service Business Ideas | local-service-business-ideas
CAT-019: Freelance Business Ideas | freelance-business-ideas
CAT-020: Rental Business Ideas | rental-business-ideas
CAT-021: Reselling Business Ideas | reselling-business-ideas
CAT-022: Skill Based Business Ideas | skill-based-business-ideas
CAT-023: Handmade Business Ideas | handmade-business-ideas
CAT-024: Digital Product Business Ideas | digital-product-business-ideas
CAT-025: Coaching and Consulting Business Ideas | coaching-consulting-business-ideas
CAT-026: Delivery and Errand Business Ideas | delivery-errand-business-ideas
CAT-027: Pet Related Business Ideas | pet-related-business-ideas
CAT-028: Beauty and Grooming Business Ideas | beauty-grooming-business-ideas
CAT-029: Fitness and Wellness Business Ideas | fitness-wellness-business-ideas
CAT-030: Cleaning Business Ideas | cleaning-business-ideas
CAT-031: Repair and Fix It Business Ideas | repair-fixit-business-ideas
CAT-032: Event and Party Business Ideas | event-party-business-ideas
CAT-033: Photography and Content Business Ideas | photography-content-business-ideas
CAT-034: Teaching and Tutoring Business Ideas | teaching-tutoring-business-ideas
CAT-035: Food From Home Business Ideas | food-from-home-business-ideas
CAT-036: Garden and Outdoor Business Ideas | garden-outdoor-business-ideas
CAT-037: Kids and Parenting Business Ideas | kids-parenting-business-ideas
CAT-038: Senior Care Business Ideas | senior-care-business-ideas
CAT-039: Automotive Side Business Ideas | automotive-side-business-ideas
CAT-040: Craft and Hobby Business Ideas | craft-hobby-business-ideas
CAT-041: Second Hand Reselling Business Ideas | secondhand-reselling-business-ideas
CAT-042: App and Software Side Income Ideas | app-software-side-income-ideas
CAT-043: Voice and Audio Business Ideas | voice-audio-business-ideas
CAT-044: Writing and Content Business Ideas | writing-content-business-ideas
CAT-045: Translation and Language Business Ideas | translation-language-business-ideas
CAT-046: Import and Export Small Business Ideas | import-export-small-business-ideas
CAT-047: Farm and Rural Business Ideas | farm-rural-business-ideas
CAT-048: Trade and Skilled Labor Business Ideas | trade-skilled-labor-business-ideas
CAT-049: Retail Kiosk Business Ideas | retail-kiosk-business-ideas
CAT-050: Franchise Free Business Ideas | franchise-free-business-ideas
CAT-051: No Experience Needed Business Ideas | no-experience-needed-business-ideas
CAT-052: Quick Cash Business Ideas | quick-cash-business-ideas
CAT-053: High Margin Small Business Ideas | high-margin-small-business-ideas
CAT-054: Niche Community Business Ideas | niche-community-business-ideas
CAT-055: Subscription Box Business Ideas | subscription-box-business-ideas
CAT-056: Rental Arbitrage Business Ideas | rental-arbitrage-business-ideas
CAT-057: Consulting From Home Business Ideas | consulting-from-home-business-ideas
CAT-058: Micro Manufacturing Business Ideas | micro-manufacturing-business-ideas
CAT-059: Recycling and Upcycling Business Ideas | recycling-upcycling-business-ideas
CAT-060: Personal Assistant Business Ideas | personal-assistant-business-ideas
CAT-061: Language and Culture Business Ideas | language-culture-business-ideas
CAT-062: Health Product Reselling Business Ideas | health-product-reselling-business-ideas
CAT-063: Wedding and Celebration Business Ideas | wedding-celebration-business-ideas
CAT-064: Travel and Tour Business Ideas | travel-tour-business-ideas
CAT-065: Storage and Organization Business Ideas | storage-organization-business-ideas
CAT-066: Vehicle Based Business Ideas | vehicle-based-business-ideas
CAT-067: Night Shift Business Ideas | night-shift-business-ideas
CAT-068: Weekend Market Business Ideas | weekend-market-business-ideas
CAT-069: Membership Business Ideas | membership-business-ideas
CAT-070: Print and Merchandise Business Ideas | print-merchandise-business-ideas
CAT-071: Voiceover and Podcasting Business Ideas | voiceover-podcasting-business-ideas
CAT-072: Errand and Concierge Business Ideas | errand-concierge-business-ideas
CAT-073: Home Improvement Side Business Ideas | home-improvement-side-business-ideas
CAT-074: Community and Neighborhood Business Ideas | community-neighborhood-business-ideas
CAT-075: Untold Business Ideas Nobody Talks About | untold-business-ideas
CAT-076: Recession Proof Business Ideas | recession-proof-business-ideas
CAT-077: Future Proof Business Ideas | future-proof-business-ideas
CAT-078: AI Resistant Business Ideas | ai-resistant-business-ideas
CAT-079: Automation Proof Business Ideas | automation-proof-business-ideas
CAT-080: Businesses You Can Run Without Internet | offline-business-ideas
CAT-081: Businesses You Can Run With Just a Phone | smartphone-only-business-ideas
CAT-082: Evergreen Demand Business Ideas | evergreen-demand-business-ideas
CAT-083: Aging Population Business Ideas | aging-population-business-ideas
CAT-084: Climate Resilient Business Ideas | climate-resilient-business-ideas
CAT-085: Multi Generational Family Business Ideas | family-business-ideas
CAT-086: Businesses for People With Disabilities | accessible-business-ideas
CAT-087: Barter and Cashless Economy Business Ideas | barter-economy-business-ideas
CAT-088: Cooperative and Shared Ownership Business Ideas | cooperative-business-ideas
CAT-089: Government Scheme Backed Business Ideas | government-scheme-business-ideas
CAT-090: Hyperlocal Neighborhood Business Ideas | hyperlocal-business-ideas
CAT-091: Recurring Revenue Business Ideas | recurring-revenue-business-ideas
CAT-092: Licensing and Royalty Business Ideas | licensing-royalty-business-ideas
CAT-093: Mentorship and Knowledge Business Ideas | mentorship-knowledge-business-ideas
CAT-094: Niche Marketplace Operator Business Ideas | niche-marketplace-business-ideas
CAT-095: Low Digital Literacy Friendly Business Ideas | low-tech-friendly-business-ideas
CAT-096: Credential Free Business Ideas | credential-free-business-ideas
CAT-097: Community Funded Business Ideas | community-funded-business-ideas
CAT-098: Multi Income Stream Business Ideas | multi-income-stream-business-ideas
CAT-099: Export Ready Small Business Ideas | export-ready-business-ideas
CAT-100: Business Ideas That Never Go Out of Style | timeless-business-ideas

---

## 12. PENDING FIXES (not yet done, do these in Claude chat or Claude Code)

### Priority 1 — URL slug fix
**Problem:** Idea pages show `/idea/ugc-content-agency-creator-service` instead of `/idea/creator-media/ugc-content-agency-creator-service`
**Fix needed:** Update routing in `src/routes/idea.$slug.tsx` to use `[category_slug]/[slug]` pattern. Add Cloudflare or Vercel redirect rules so old URLs still work.
**How to fix in Claude chat:** Paste contents of `src/routes/idea.$slug.tsx` into Claude chat, ask for the routing fix, commit the returned file to GitHub.

### Priority 2 — Stripe payment wiring
**Problem:** Pricing page shows "Checkout not live yet" — no real payment flow exists
**Fix needed:** Wire Stripe checkout to the Pro Pass button. Add Stripe publishable key to Vercel environment variables. The webhook handler already exists at `src/routes/api.stripe-webhook.tsx`.
**Warning:** Stripe SECRET key must never have VITE_ prefix. Server-side only.

### Priority 3 — Remove "Edit with Lovable" badge
**Problem:** Badge visible bottom-right to all public visitors
**Fix:** Requires Lovable Pro subscription plan OR find and delete the badge component in `src/components/site-shell.tsx` directly in GitHub (search for "lovable" or "LovableBadge" in that file).

### Priority 4 — Mobile audit
**Problem:** Mobile view never fully tested
**Fix:** Open site on real mobile device, screenshot every page, fix issues in Claude chat by editing specific component files.

### Priority 5 — Auth flow
**Problem:** Sign In button links to /sign-in but page may not exist or auth flow may not be complete
**Fix:** Verify Supabase Auth is configured. Check `src/components/AuthModal.tsx` exists and is wired to Sign In button.

---

## 13. KNOWN ARCHITECTURE DECISIONS

- Blog content comes from WordPress via API, NOT from Supabase
- WordPress instance should be set to "discourage search engines" (noindex) since blog content also lives on this site
- If WordPress is slow or down, the rest of the site continues working independently
- Categories in nav dropdown are live from database — adding new categories to Supabase automatically shows them in dropdown, zero code changes
- Featured homepage blueprints are manually controlled via `src/config/featured.ts`
- All ad slots are empty by default — activate individually by adding adCode prop
- region_tags column exists in database but no filter UI is built — reserved for future geo-filtering

---

## 14. HOW TO START A NEW CLAUDE SESSION FOR EDITS

1. Share this file first
2. Share the specific file you want to edit (get it from GitHub)
3. Describe what you want changed
4. Claude returns the corrected file
5. Go to GitHub → open the file → click pencil icon → paste new content → commit
6. Vercel auto-deploys within 1-2 minutes
7. Check the live site

**No Lovable credits needed for most edits when using this workflow.**

---

## 15. SEO IMPLEMENTATION STATUS

**Done:**
- Meta title: "IdeaVault — Researched Small Business Ideas & Startup Blueprints"
- Meta description: "Browse 1,000+ researched small business ideas, startup blueprints, and work from home business opportunities..."
- LLM SEO block (sr-only, crawlable): contains "business idea directory", "startup intelligence library", "small business ideas", "work from home business ideas", "zero investment business ideas", "business ideas for women"
- Collections menu labels carry real search keywords
- Homepage copy includes "small business ideas", "startup ideas", "work from home business ideas"
- FAQ section with 6 business-relevant Q&As

**Still needed:**
- Dynamic meta per idea page (using focus_keyword and additional_keyword fields)
- Dynamic sitemap for all completed idea and category URLs
- Blog post canonical tags pointing to this domain (not WordPress source)

---

*Last updated: August 2026. Generated from full project conversation history.*
*Save this file as `MASTER-DEV-GUIDE.md` in your GitHub repo root.*
