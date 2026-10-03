# Startup guides batch 2 — the next 20 guides

A second batch for `/startup-guides`, parallel to `BLOG_BATCH_2_TOPICS.md` but
a different content type and a different publish schedule — see
`CONTENT_SCHEDULING_PLAN.md` for how the two run independently.

## What's already there (checked 2026-10-03, so nothing below repeats it)

`src/lib/guides-data.ts` already has 20 guides, all general startup-operations
topics (churn, CLV, competitor analysis, hiring, freemium conversion, GTM,
inbound marketing, MVP, pre-launch checklist, PLG onboarding, PMF metrics,
SaaS pricing, cash flow, equity split, metrics dashboard, TAM/SAM/SOM,
retention, zero-investment models) across 5 categories: Validation, Market
Sizing, Bootstrapping, Growth & PMF, Launch & Ops. They run 663–1,270 words
each — short-form, nothing like the 2,000+ floor this batch uses. That's a
deliberate step up for batch 2, not an inconsistency to fix on the old 20.

**On "without naming our brand":** already true of all 20 existing guides —
checked every body for "BBI" / "businessidea.io" and found zero mentions
anywhere except the `author: "BBI Research Team"` frontmatter field, which
is attribution metadata, not body copy. Batch 2 follows the same line: body
text never names the site, author field stays as-is.

Two new categories below (**Finance & Fundraising**, **Legal & Compliance**)
don't exist in the current `StartupGuideMeta["category"]` union yet — that's
one small additive type edit in `guides-data.ts`, not a redesign.

## The 20 new guides

| # | SEO title | Slug | Focus keyword | Additional keywords (5–6) | Category | Min words |
|---|---|---|---|---|---|---|
| 1 | How to Register a Startup in India: OPC vs LLP vs Private Limited | `how-to-register-a-startup-in-india` | how to register a startup in india | startup registration process india; opc vs llp vs private limited; business registration types in india; which business structure to choose; startup registration cost india; new company registration india | Launch & Ops | 3180 |
| 2 | Founder Vesting Schedules: Protecting Equity When a Co-Founder Leaves | `founder-vesting-schedules-explained` | founder vesting schedule explained | what is a vesting schedule startup; co-founder equity vesting; cliff and vesting period startup; protecting equity from a departing co-founder; standard startup vesting terms | Bootstrapping | 2410 |
| 3 | Writing a Founder Agreement Before You Write a Line of Code | `founder-agreement-checklist` | founder agreement checklist for startups | what to include in a founder agreement; co-founder agreement template points; startup founder contract basics; splitting responsibilities between co-founders; founder agreement vs operating agreement | Legal & Compliance | 2860 |
| 4 | Runway Math: How Long Your Startup's Cash Actually Lasts | `how-to-calculate-startup-runway` | how to calculate startup runway | startup runway formula; burn rate vs runway explained; months of runway left; calculating cash runway for a small business; when to raise money based on runway | Finance & Fundraising | 2647 |
| 5 | Angel Investment vs Bootstrapping: Picking the Right Path for an Early Idea | `angel-investment-vs-bootstrapping` | angel investment vs bootstrapping | should i raise money or bootstrap; pros and cons of angel investment; bootstrapping a startup in india; when to take outside funding; self funding a startup | Finance & Fundraising | 2940 |
| 6 | Building a Cap Table That Doesn't Blow Up at the Next Funding Round | `how-to-build-a-startup-cap-table` | how to build a startup cap table | what is a cap table; cap table mistakes to avoid; equity dilution explained; cap table template for early startups; managing ownership percentages startup | Finance & Fundraising | 2290 |
| 7 | Trademark and IP Basics Every First-Time Founder Skips | `trademark-and-ip-basics-for-startups` | trademark registration for startups in india | how to trademark a business name; protecting intellectual property startup; trademark registration process india; patent vs trademark vs copyright; cost to trademark a brand name | Legal & Compliance | 3063 |
| 8 | GST Registration for a New Business: Who Actually Needs It | `gst-registration-for-small-business` | gst registration for small business india | who needs gst registration; gst registration turnover limit; gst registration process for startups; voluntary gst registration pros and cons; gst exemption for small business | Legal & Compliance | 2480 |
| 9 | Hiring Your First Employee: Contractor vs Full-Time vs Co-Founder | `hiring-your-first-employee` | when to hire your first employee startup | contractor vs full time employee startup; signs you need your first hire; cost of hiring first employee india; should i hire or take a co-founder; first hire mistakes startups make | Launch & Ops | 2720 |
| 10 | Negotiating With Your First Supplier When You Have Zero Track Record | `negotiating-with-suppliers-as-a-new-business` | how to negotiate with suppliers as a new business | getting better supplier terms with no history; small business supplier negotiation tips; minimum order quantity negotiation; building supplier trust as a startup; vendor payment terms for new businesses | Bootstrapping | 2160 |
| 11 | Local SEO for a Small Business With No Marketing Budget | `local-seo-for-small-business-no-budget` | local seo for small business with no budget | free local seo checklist; google business profile optimization; local seo for small business india; ranking in local search with no ads; local keyword research for small business | Growth & PMF | 2790 |
| 12 | Designing a Referral Program That Doesn't Rely on Paid Ads | `how-to-build-a-referral-program` | how to build a referral program for a small business | referral program ideas with no budget; word of mouth marketing strategy; customer referral incentive ideas; referral program structure for startups; tracking referrals without software | Growth & PMF | 2070 |
| 13 | WhatsApp Business for Indian Small Businesses: Setup and Real Limits | `whatsapp-business-for-small-business-india` | whatsapp business for small business india | whatsapp business api vs app; whatsapp business catalog setup; whatsapp business broadcast limits; using whatsapp business for customer support; whatsapp business automation for small business | Growth & PMF | 2330 |
| 14 | Break-Even Analysis Explained With a Real Example | `break-even-analysis-explained` | how to calculate break even point for a small business | break even point formula with example; fixed cost vs variable cost explained; break even analysis for a new business; when will my business start making profit; break even chart explained | Finance & Fundraising | 2910 |
| 15 | Unit Economics for a First-Time Founder: the Four Numbers That Matter | `unit-economics-explained-for-beginners` | unit economics explained for beginners | what is unit economics; cac and ltv explained simply; contribution margin per unit; unit economics for a small business; how to know if your business model works | Finance & Fundraising | 2580 |
| 16 | Co-Founder Conflict: What to Do Before It Becomes a Legal Problem | `resolving-co-founder-disputes` | how to resolve co-founder disputes | common causes of co-founder conflict; co-founder breakup checklist; buying out a co-founder; mediating a startup disagreement; when to involve a lawyer in a co-founder dispute | Legal & Compliance | 3230 |
| 17 | Outsourcing vs Hiring: What Actually Costs Less in Year One | `outsourcing-vs-hiring-for-startups` | outsourcing vs hiring for startups | cost comparison outsourcing vs employee; when to outsource a task instead of hiring; freelancer vs full time cost india; outsourcing risks for a small business; hidden costs of hiring too early | Bootstrapping | 2140 |
| 18 | Vendor Contracts: the Clauses That Protect a Small Business | `what-to-include-in-a-vendor-contract` | what to include in a vendor contract | vendor contract checklist for small business; payment terms clause examples; termination clause vendor agreement; liability clause small business contract; vendor contract red flags | Legal & Compliance | 2460 |
| 19 | Remote Team Management for a Bootstrapped Startup With No HR Department | `remote-team-management-no-hr` | how to manage a remote team with no hr | remote team tools for small startups; setting expectations for remote employees; remote work policy for a small business; managing freelancers across time zones; remote team communication without hr | Launch & Ops | 2063 |
| 20 | Pricing a Service Business: Hourly, Project, or Retainer | `how-to-price-a-service-business` | how to price a service business | hourly vs project pricing for services; how to set a retainer price; pricing a service business in india; raising prices as a service business; common service pricing mistakes | Growth & PMF | 2210 |

## Notes

- Rows 4 and 14 tie naturally to the Burn Rate/Runway and Break-even
  calculators already on the site — link to them, don't re-explain the
  arithmetic the calculator already does live.
- No row needs a Supabase lookup the way blog listicles do — these are
  standalone educational guides, same as the existing 20, not built from the
  `ideas` table.
- Word-count floors here are a deliberately different, independently
  scattered set from `BLOG_BATCH_2_TOPICS.md`'s — not reused, not patterned
  against them either.
