/**
 * Featured images for startup guides, matched to a guide by its slug.
 *
 * A guide with no entry shows no image. Written to the
 * contract in IMAGE_SEO.md: a file name of at least 5 keywords, a 10-word alt
 * carrying the focus keyword and supporting keywords, one focus keyword, three
 * supporting keywords, two long-tail phrases, and a caption that contains the
 * focus keyword. Alt and caption describe the business topic, never what the
 * picture looks like.
 */
export type GuideImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  focus: string;
  keywords: [string, string, string];
  longTail: [string, string];
  description: string;
};

const DIR = "/images/guides";

const IMAGES: Record<string, GuideImage> = {
  "competitor-analysis-framework": {
    src: `${DIR}/competitor-analysis-framework-for-founders-positioning-gaps-feature-matrix-startup.webp`,
    width: 1170,
    height: 659,
    alt: "Competitor analysis framework for founders: positioning gaps and feature matrix",
    focus: "competitor analysis framework",
    keywords: ["positioning gaps", "feature matrix", "unserved niches"],
    longTail: [
      "how to do competitor analysis for a startup",
      "best competitor analysis frameworks for founders",
    ],
    description:
      "Competitor analysis framework for founders: how to find positioning gaps, weaknesses and unserved niches instead of chasing feature parity.",
  },
  "early-stage-startup-hiring": {
    src: `${DIR}/early-stage-startup-hiring-finding-founding-engineers-high-agency-ownership-team.webp`,
    width: 1003,
    height: 565,
    alt: "Early stage startup hiring: finding founding engineers with ownership mindset",
    focus: "early stage startup hiring",
    keywords: ["founding engineers", "ownership mindset", "high agency"],
    longTail: [
      "how to hire founding engineers at an early stage startup",
      "early stage startup hiring for your first ten hires",
    ],
    description:
      "Early stage startup hiring: finding founding engineers with high agency and an ownership mindset, and aligning incentives from the first hire.",
  },
  "freemium-to-paid-conversion": {
    src: `${DIR}/freemium-to-paid-conversion-strategies-free-plan-pro-plan-upgrade-saas.webp`,
    width: 1003,
    height: 565,
    alt: "Freemium to paid conversion strategies: free plan to pro upgrade",
    focus: "freemium to paid conversion",
    keywords: ["free plan", "pro plan", "upgrade strategies"],
    longTail: [
      "how to increase freemium to paid conversion rate",
      "strategies for converting free SaaS users to paid customers",
    ],
    description:
      "Freemium to paid conversion: how to gate the features that drive professional value, keep enough free to hook users and turn them into paying customers.",
  },
  "go-to-market-strategy-b2b": {
    src: `${DIR}/go-to-market-strategy-for-b2b-startups-target-customers-pricing-sales-distribution.webp`,
    width: 1003,
    height: 565,
    alt: "Go-to-market strategy for B2B startups: target customers, pricing and distribution",
    focus: "go-to-market strategy",
    keywords: ["B2B startups", "target customers", "sales and distribution"],
    longTail: [
      "how to build a go-to-market strategy for B2B SaaS",
      "go-to-market plan examples for startups",
    ],
    description:
      "Go-to-market strategy for B2B startups: aligning pricing, sales and distribution around a clear wedge into the market.",
  },
  "inbound-marketing-bootstrapped-startups": {
    src: `${DIR}/inbound-marketing-for-bootstrapped-startups-seo-content-organic-growth-low-cac.webp`,
    width: 1003,
    height: 565,
    alt: "Inbound marketing for bootstrapped startups: SEO, content and organic growth",
    focus: "inbound marketing",
    keywords: ["bootstrapped startups", "organic growth", "content marketing"],
    longTail: [
      "how to do inbound marketing with no budget",
      "inbound marketing strategy for bootstrapped startups",
    ],
    description:
      "Inbound marketing for bootstrapped startups: using SEO and content to earn customers without paid ads.",
  },
  "minimum-viable-product-development": {
    src: `${DIR}/minimum-viable-product-development-ship-faster-validate-ideas-real-users-feedback-iterate.webp`,
    width: 1003,
    height: 565,
    alt: "Minimum viable product development: ship faster, validate ideas, iterate with feedback",
    focus: "minimum viable product",
    keywords: ["ship faster", "validate ideas", "user feedback"],
    longTail: [
      "how to build a minimum viable product fast",
      "minimum viable product development steps for startups",
    ],
    description:
      "Minimum viable product development: building the smallest version that tests your idea with real users.",
  },
  "zero-investment-business-models": {
    src: `${DIR}/zero-investment-business-models-for-bootstrapped-founders.webp`,
    width: 1003,
    height: 565,
    alt: "Zero investment business models for bootstrapped founders using productized services",
    focus: "zero investment business models",
    keywords: ["bootstrapped founders", "productized services", "micro consulting"],
    longTail: [
      "zero investment business models for bootstrapped founders",
      "how to start a business with no capital using productized services",
    ],
    description:
      "Zero investment business models for bootstrapped founders: productized services, reverse marketplaces and micro-consulting that bring in cash flow without giving up equity.",
  },
  "b2b-cold-email-lead-generation": {
    src: `${DIR}/b2b-cold-email-lead-generation-high-converting-frameworks.webp`,
    width: 1003,
    height: 565,
    alt: "B2B cold email lead generation: personalized outreach that books meetings",
    focus: "B2B cold email lead generation",
    keywords: ["cold email frameworks", "personalized outreach", "booking meetings"],
    longTail: [
      "high converting B2B cold email lead generation frameworks",
      "how to write cold emails that get replies and book meetings",
    ],
    description:
      "B2B cold email lead generation: finding the right prospects, personalizing the message, following up and turning replies into booked meetings and clients.",
  },
  "b2b-saas-churn-reduction": {
    src: `${DIR}/b2b-saas-churn-reduction-high-retention-strategies.webp`,
    width: 1003,
    height: 565,
    alt: "B2B SaaS churn reduction using customer success and retention strategies",
    focus: "B2B SaaS churn reduction",
    keywords: ["retention strategies", "customer success", "reduce churn"],
    longTail: [
      "B2B SaaS churn reduction high retention strategies",
      "how to reduce churn with onboarding and proactive customer success",
    ],
    description:
      "B2B SaaS churn reduction: why retaining customers beats replacing them, and how onboarding, proactive customer success and sticky product features keep churn down.",
  },
  "business-idea-validation-framework": {
    src: `${DIR}/business-idea-validation-framework-test-before-you-build.webp`,
    width: 1003,
    height: 565,
    alt: "Business idea validation framework: customer discovery and test before building",
    focus: "business idea validation framework",
    keywords: ["customer discovery", "validate demand", "test before building"],
    longTail: [
      "business idea validation framework test before you build",
      "how to validate a business idea with customer interviews and an MVP test",
    ],
    description:
      "Business idea validation framework: test the problem, the demand and the willingness to pay with customer interviews and a lean MVP test before you spend time building.",
  },
  "calculating-customer-lifetime-value": {
    src: `${DIR}/calculating-customer-lifetime-value-cltv-saas-churn-mrr-unit-economics.webp`,
    width: 1170,
    height: 659,
    alt: "Calculating customer lifetime value CLTV for SaaS using unit economics",
    focus: "customer lifetime value",
    keywords: ["CLTV", "unit economics", "churn and MRR"],
    longTail: [
      "how to calculate customer lifetime value in SaaS",
      "how much customer lifetime value tells you to spend on acquisition",
    ],
    description:
      "Calculating customer lifetime value (CLTV) in SaaS: how churn, MRR and unit economics set what you can afford to spend to win a customer.",
  },
};

/** The mapped image for a slug, or null when none has been added for it. */
export function guideImage(slug: string): GuideImage | null {
  return IMAGES[slug] ?? null;
}
