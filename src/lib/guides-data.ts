import guide0 from "../../content/guides/b2b-cold-email-lead-generation.md?raw";
import guide1 from "../../content/guides/b2b-saas-churn-reduction.md?raw";
import guide2 from "../../content/guides/business-idea-validation-framework.md?raw";
import guide3 from "../../content/guides/calculating-customer-lifetime-value.md?raw";
import guide4 from "../../content/guides/competitor-analysis-framework.md?raw";
import guide5 from "../../content/guides/early-stage-startup-hiring.md?raw";
import guide6 from "../../content/guides/freemium-to-paid-conversion.md?raw";
import guide7 from "../../content/guides/go-to-market-strategy-b2b.md?raw";
import guide8 from "../../content/guides/inbound-marketing-bootstrapped-startups.md?raw";
import guide9 from "../../content/guides/minimum-viable-product-development.md?raw";
import guide10 from "../../content/guides/pre-launch-checklist-for-startups.md?raw";
import guide11 from "../../content/guides/product-led-growth-onboarding.md?raw";
import guide12 from "../../content/guides/product-market-fit-metrics.md?raw";
import guide13 from "../../content/guides/saas-pricing-models.md?raw";
import guide14 from "../../content/guides/startup-cash-flow-management.md?raw";
import guide15 from "../../content/guides/startup-equity-split-guide.md?raw";
import guide16 from "../../content/guides/startup-metrics-dashboard.md?raw";
import guide17 from "../../content/guides/tam-sam-som-market-sizing.md?raw";
import guide18 from "../../content/guides/user-retention-strategies-saas.md?raw";
import guide19 from "../../content/guides/zero-investment-business-models.md?raw";

export type StartupGuideMeta = {
  slug: string;
  title: string;
  description: string;
  category: "Validation" | "Market Sizing" | "Bootstrapping" | "Growth & PMF" | "Launch & Ops";
  wordCount: number;
  readTime: string;
  publishedDate: string;
  author: string;
  keywords: string[];
  rawMarkdown: string;
  keyTakeaways: string[];
};

function extractBody(markdown: string) {
  if (markdown.startsWith("---")) {
    const secondFence = markdown.indexOf("---", 3);
    if (secondFence !== -1) {
      return markdown.slice(secondFence + 3).trim();
    }
  }
  return markdown.trim();
}

export const STARTUP_GUIDES: StartupGuideMeta[] = [
  {
    slug: "b2b-cold-email-lead-generation",
    title: "B2B Cold Email Lead Generation: High-Converting Frameworks",
    description:
      "Cold email is not dead; it has simply evolved. Spray-and-pray tactics will ruin your domain reputation and yield zero results. Modern B2B cold outreach requires hyper-personalization, impeccable technical setup for deliverability, and concise, pain-focused copywriting that drives curiosity rather than demanding a meeting.",
    category: "Growth & PMF",
    wordCount: 1148,
    readTime: "5 min read",
    publishedDate: "2026-09-14",
    author: "BBI Research Team",
    keywords: [
      "b2b cold email lead generation",
      "outbound sales strategy",
      "email deliverability optimization",
      "cold outreach templates",
    ],
    rawMarkdown: extractBody(guide0),
    keyTakeaways: ["b2b cold email lead generation", "Execution", "Optimization"],
  },
  {
    slug: "b2b-saas-churn-reduction",
    title: "B2B SaaS Churn Reduction: High-Retention Strategies",
    description:
      "Acquiring a new customer is five times more expensive than retaining an existing one. High churn will eventually stall your growth, regardless of your acquisition engine. Reducing churn requires a proactive approach to customer success, deeply integrated features, and relentless onboarding optimization.",
    category: "Growth & PMF",
    wordCount: 1009,
    readTime: "5 min read",
    publishedDate: "2026-09-14",
    author: "BBI Research Team",
    keywords: [
      "b2b saas churn reduction",
      "customer retention rate",
      "saas onboarding optimization",
      "sticky software features",
    ],
    rawMarkdown: extractBody(guide1),
    keyTakeaways: ["b2b saas churn reduction", "Execution", "Optimization"],
  },
  {
    slug: "business-idea-validation-framework",
    title: "Business Idea Validation Framework: Test Before You Build",
    description:
      "The graveyard of startups isn't littered with bad ideas, but with unvalidated ones. Founders, blinded by conviction, often build elaborate solutions t...",
    category: "Validation",
    wordCount: 1056,
    readTime: "5 min read",
    publishedDate: "2026-09-14",
    author: "BBI Research Team",
    keywords: [
      "business idea validation framework",
      "customer discovery interviews",
      "pre-selling strategies",
      "smoke test mvp",
    ],
    rawMarkdown: extractBody(guide2),
    keyTakeaways: ["business idea validation framework", "Execution", "Optimization"],
  },
  {
    slug: "calculating-customer-lifetime-value",
    title: "Calculating Customer Lifetime Value (CLTV) in SaaS",
    description:
      "Customer Lifetime Value (CLTV) is the ultimate metric for SaaS unit economics. It determines exactly how much you can afford to spend on acquisition. If you do not understand the mathematical relationship between churn, MRR, and CLTV, you are operating blindly in a highly competitive market.",
    category: "Market Sizing",
    wordCount: 733,
    readTime: "5 min read",
    publishedDate: "2026-09-14",
    author: "BBI Research Team",
    keywords: [
      "calculating customer lifetime value",
      "saas unit economics",
      "cltv to cac ratio",
      "churn rate impact",
    ],
    rawMarkdown: extractBody(guide3),
    keyTakeaways: ["calculating customer lifetime value", "Execution", "Optimization"],
  },
  {
    slug: "competitor-analysis-framework",
    title: "Competitor Analysis Framework for Founders",
    description:
      "Obsessing over competitors leads to derivative products. However, ignoring them entirely is strategic negligence. A strong competitor analysis framework does not focus on feature parity; it focuses on identifying positioning gaps, systemic weaknesses, and unserved niches that allow you to establish a strong initial wedge.",
    category: "Market Sizing",
    wordCount: 716,
    readTime: "5 min read",
    publishedDate: "2026-09-14",
    author: "BBI Research Team",
    keywords: [
      "competitor analysis framework",
      "startup competitive advantage",
      "feature matrix comparison",
      "market positioning",
    ],
    rawMarkdown: extractBody(guide4),
    keyTakeaways: ["competitor analysis framework", "Execution", "Optimization"],
  },
  {
    slug: "early-stage-startup-hiring",
    title: "Early Stage Startup Hiring: Finding Founding Engineers",
    description:
      "Your first ten hires will dictate the culture, velocity, and ultimate success of your company. You cannot hire purely for specialized skills; you must optimize for high agency, adaptability, and an ownership mindset. Recruiting founding engineers requires selling the vision and aligning incentives perfectly.",
    category: "Launch & Ops",
    wordCount: 1061,
    readTime: "5 min read",
    publishedDate: "2026-09-14",
    author: "BBI Research Team",
    keywords: [
      "early stage startup hiring",
      "founding team recruitment",
      "startup compensation structure",
      "evaluating startup fit",
    ],
    rawMarkdown: extractBody(guide5),
    keyTakeaways: ["early stage startup hiring", "Execution", "Optimization"],
  },
  {
    slug: "freemium-to-paid-conversion",
    title: "Freemium to Paid Conversion: Strategies that Actually Work",
    description:
      "A massive free user base is a liability unless you can convert them. Freemium models only work when the friction between the free tier and the paid tier is perfectly calibrated. You must gate the exact features that drive professional value while leaving enough core functionality to hook the user.",
    category: "Launch & Ops",
    wordCount: 716,
    readTime: "5 min read",
    publishedDate: "2026-09-14",
    author: "BBI Research Team",
    keywords: [
      "freemium to paid conversion",
      "product qualified leads",
      "feature gating",
      "saas upgrade friction",
    ],
    rawMarkdown: extractBody(guide6),
    keyTakeaways: ["freemium to paid conversion", "Execution", "Optimization"],
  },
  {
    slug: "go-to-market-strategy-b2b",
    title: "Go-to-Market Strategy for B2B Startups",
    description:
      "A Go-To-Market strategy is not a marketing plan; it is the operational alignment of pricing, sales, and distribution. In B2B, assuming 'if we build it, they will come' is a death sentence. You must systematically identify your wedge into the market and construct a predictable engine to exploit it.",
    category: "Launch & Ops",
    wordCount: 737,
    readTime: "5 min read",
    publishedDate: "2026-09-14",
    author: "BBI Research Team",
    keywords: [
      "go to market strategy b2b",
      "ideal customer profile",
      "channel partner strategy",
      "b2b sales cycle",
    ],
    rawMarkdown: extractBody(guide7),
    keyTakeaways: ["go to market strategy b2b", "Execution", "Optimization"],
  },
  {
    slug: "inbound-marketing-bootstrapped-startups",
    title: "Inbound Marketing for Bootstrapped Startups",
    description:
      "Bootstrapped founders cannot outspend venture-backed competitors on ads. Your leverage lies in inbound marketing. By building high-value, programmatic SEO assets and establishing deep domain authority, you create an organic acquisition moat that compounds over time and drives CAC down to near zero.",
    category: "Bootstrapping",
    wordCount: 718,
    readTime: "5 min read",
    publishedDate: "2026-09-14",
    author: "BBI Research Team",
    keywords: [
      "inbound marketing bootstrapped startups",
      "content marketing strategy",
      "startup seo tactics",
      "organic lead generation",
    ],
    rawMarkdown: extractBody(guide8),
    keyTakeaways: ["inbound marketing bootstrapped startups", "Execution", "Optimization"],
  },
  {
    slug: "minimum-viable-product-development",
    title: "Minimum Viable Product Development: Ship Faster",
    description:
      "Perfectionism is the enemy of validation. An MVP is not a smaller version of your final vision; it is a singular tool designed to test your riskiest assumption. If you are not slightly embarrassed by your first release, you launched too late. Speed to market dictates survival.",
    category: "Launch & Ops",
    wordCount: 757,
    readTime: "5 min read",
    publishedDate: "2026-09-14",
    author: "BBI Research Team",
    keywords: [
      "minimum viable product development",
      "lean startup principles",
      "no code prototyping",
      "mvp feature prioritization",
    ],
    rawMarkdown: extractBody(guide9),
    keyTakeaways: ["minimum viable product development", "Execution", "Optimization"],
  },
  {
    slug: "pre-launch-checklist-for-startups",
    title: "Pre-Launch Checklist for Startups: Technical and Marketing Audit",
    description:
      "The market doesn't forgive unpreparedness. Your pre-launch phase isn't a suggestion; it’s the crucible where viability is forged. Ignore this comprehe...",
    category: "Launch & Ops",
    wordCount: 1015,
    readTime: "5 min read",
    publishedDate: "2026-09-14",
    author: "BBI Research Team",
    keywords: [
      "pre-launch checklist for startups",
      "startup launch preparation",
      "technical qa audit",
      "go to market hygiene",
    ],
    rawMarkdown: extractBody(guide10),
    keyTakeaways: ["pre-launch checklist for startups", "Execution", "Optimization"],
  },
  {
    slug: "product-led-growth-onboarding",
    title: "Product-Led Growth Onboarding: Driving Rapid Activation",
    description:
      "In a PLG model, your product must sell itself. This means the onboarding experience is your primary sales rep. If users do not reach their 'Aha!' moment within the first five minutes, they will abandon the platform. Rapid activation is the cornerstone of product-led growth.",
    category: "Growth & PMF",
    wordCount: 698,
    readTime: "5 min read",
    publishedDate: "2026-09-14",
    author: "BBI Research Team",
    keywords: [
      "product led growth onboarding",
      "time to value",
      "user activation rate",
      "freemium SaaS models",
    ],
    rawMarkdown: extractBody(guide11),
    keyTakeaways: ["product led growth onboarding", "Execution", "Optimization"],
  },
  {
    slug: "product-market-fit-metrics",
    title: "Product-Market Fit Metrics: How to Measure True PMF",
    description:
      "Product-market fit is not a gut feeling; it is a mathematical reality visible in your data. If you scale acquisition before achieving PMF, you are simply filling a leaky bucket. Understanding the exact metrics that indicate fit is the only way to know when to step on the gas.",
    category: "Growth & PMF",
    wordCount: 737,
    readTime: "5 min read",
    publishedDate: "2026-09-14",
    author: "BBI Research Team",
    keywords: [
      "product market fit metrics",
      "sean ellis test",
      "retention cohort curves",
      "startup growth KPIs",
    ],
    rawMarkdown: extractBody(guide12),
    keyTakeaways: ["product market fit metrics", "Execution", "Optimization"],
  },
  {
    slug: "saas-pricing-models",
    title: "Micro SaaS Pricing Models: Structuring for Profitability",
    description:
      "Pricing is the single most powerful lever in a Micro SaaS business. Yet, founders consistently underprice their products, relying on cost-plus models rather than value-based extraction. If you are building a targeted solution, your pricing must reflect the specific pain you are alleviating for your customer, not the hours you spent coding it.",
    category: "Validation",
    wordCount: 775,
    readTime: "5 min read",
    publishedDate: "2026-09-14",
    author: "BBI Research Team",
    keywords: [
      "micro saas pricing models",
      "value based pricing",
      "tiered subscription plans",
      "freemium vs trial",
    ],
    rawMarkdown: extractBody(guide13),
    keyTakeaways: ["micro saas pricing models", "Execution", "Optimization"],
  },
  {
    slug: "startup-cash-flow-management",
    title: "Startup Cash Flow Management: Extending Your Runway",
    description:
      "Revenue is vanity, margin is sanity, but cash is reality. A profitable startup will still go bankrupt if the timing of its cash outflows precedes its inflows. Mastering cash flow management—optimizing working capital and rigorously projecting runway—is the ultimate defensive skill for any founder.",
    category: "Launch & Ops",
    wordCount: 740,
    readTime: "5 min read",
    publishedDate: "2026-09-14",
    author: "BBI Research Team",
    keywords: [
      "startup cash flow management",
      "startup runway calculation",
      "working capital optimization",
      "bootstrapped financial modeling",
    ],
    rawMarkdown: extractBody(guide14),
    keyTakeaways: ["startup cash flow management", "Execution", "Optimization"],
  },
  {
    slug: "startup-equity-split-guide",
    title: "Startup Equity Split Guide: Avoiding Co-Founder Conflict",
    description:
      "More startups die from co-founder disputes than from market competition. A poorly structured equity split will cripple your company's future. Equity should never be a 50/50 handshake deal based on the initial idea; it must be a legally binding, vested structure tied to long-term execution and risk.",
    category: "Launch & Ops",
    wordCount: 1270,
    readTime: "5 min read",
    publishedDate: "2026-09-14",
    author: "BBI Research Team",
    keywords: [
      "startup equity split guide",
      "co-founder vesting schedules",
      "startup capitalization table",
      "dynamic equity models",
    ],
    rawMarkdown: extractBody(guide15),
    keyTakeaways: ["startup equity split guide", "Execution", "Optimization"],
  },
  {
    slug: "startup-metrics-dashboard",
    title: "Startup Metrics Dashboard: KPIs that Actually Matter",
    description:
      "Data without structure is noise. A startup metrics dashboard should not be a sprawling collection of every conceivable data point. It must be a highly focused array of leading and lagging indicators—Burn Rate, CAC, Churn, and your North Star—that directly inform operational decisions and drive team alignment.",
    category: "Growth & PMF",
    wordCount: 710,
    readTime: "5 min read",
    publishedDate: "2026-09-14",
    author: "BBI Research Team",
    keywords: [
      "startup metrics dashboard",
      "core startup kpis",
      "mrr and arr tracking",
      "burn rate calculation",
    ],
    rawMarkdown: extractBody(guide16),
    keyTakeaways: ["startup metrics dashboard", "Execution", "Optimization"],
  },
  {
    slug: "tam-sam-som-market-sizing",
    title: "TAM, SAM, and SOM Market Sizing: A Practical Guide",
    description:
      "Understanding your market isn't a theoretical exercise; it’s a foundational requirement for any operator building a viable business. Too many founders...",
    category: "Market Sizing",
    wordCount: 1109,
    readTime: "5 min read",
    publishedDate: "2026-09-14",
    author: "BBI Research Team",
    keywords: [
      "tam sam som market sizing",
      "total addressable market",
      "bottom up market sizing",
      "startup market analysis",
    ],
    rawMarkdown: extractBody(guide17),
    keyTakeaways: ["tam sam som market sizing", "Execution", "Optimization"],
  },
  {
    slug: "user-retention-strategies-saas",
    title: "User Retention Strategies for SaaS: Keeping Customers Forever",
    description:
      "Retention is a product of systemic engagement, not just friendly customer support. To keep customers long-term, your product must embed itself deeply into their daily workflows, creating high switching costs. Mastering user retention requires analyzing behavior cohorts and implementing highly targeted intervention strategies.",
    category: "Growth & PMF",
    wordCount: 715,
    readTime: "5 min read",
    publishedDate: "2026-09-14",
    author: "BBI Research Team",
    keywords: [
      "user retention strategies saas",
      "customer success management",
      "in app engagement",
      "saas renewal tactics",
    ],
    rawMarkdown: extractBody(guide18),
    keyTakeaways: ["user retention strategies saas", "Execution", "Optimization"],
  },
  {
    slug: "zero-investment-business-models",
    title: "Zero-Investment Business Models for Bootstrapped Founders",
    description:
      "Capital is an accelerant, not a prerequisite. Bootstrapping forces financial discipline and rapid iteration. By leveraging zero-investment models like productized services, reverse marketplaces, and micro-consulting, founders can generate cash flow from day one without sacrificing equity to venture capitalists.",
    category: "Bootstrapping",
    wordCount: 663,
    readTime: "5 min read",
    publishedDate: "2026-09-14",
    author: "BBI Research Team",
    keywords: [
      "zero investment business models",
      "bootstrapped business ideas",
      "productized services",
      "lean startup methodology",
    ],
    rawMarkdown: extractBody(guide19),
    keyTakeaways: ["zero investment business models", "Execution", "Optimization"],
  },
];

export function getGuideBySlug(slug: string): StartupGuideMeta | undefined {
  return STARTUP_GUIDES.find((g) => g.slug === slug);
}
