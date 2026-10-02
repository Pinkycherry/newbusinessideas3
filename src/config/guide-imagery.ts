/**
 * Featured images for startup guides, matched to a guide by its slug.
 *
 * Same standard as `blog-imagery.ts`: a keyword file name, a keyword alt, one
 * focus keyword, three supporting keywords, two long-tail phrases and a topic
 * caption. Alt and caption describe the business topic and its keywords,
 * never what the picture looks like. A guide with no entry simply shows no
 * image.
 */
export type GuideImage = {
  src: string;
  alt: string;
  focus: string;
  keywords: [string, string, string];
  longTail: [string, string];
  description: string;
};

const DIR = "/images/guides";

const GUIDE_IMAGES: Record<string, GuideImage> = {
  "zero-investment-business-models": {
    src: `${DIR}/zero-investment-business-models-for-bootstrapped-founders.webp`,
    alt: "Zero investment business models for bootstrapped founders with no capital",
    focus: "zero investment business models",
    keywords: ["bootstrapped founders", "productized services", "micro consulting"],
    longTail: [
      "zero investment business models for bootstrapped founders",
      "how to start a business with no capital using productized services",
    ],
    description:
      "Zero investment business models for bootstrapped founders: productized services, reverse marketplaces and micro-consulting that bring in cash flow without giving up equity.",
  },
  "b2b-saas-churn-reduction": {
    src: `${DIR}/b2b-saas-churn-reduction-high-retention-strategies.webp`,
    alt: "B2B SaaS churn reduction with high retention strategies for customer success",
    focus: "B2B SaaS churn reduction",
    keywords: ["high retention strategies", "customer success", "reduce customer churn"],
    longTail: [
      "B2B SaaS churn reduction high retention strategies",
      "how to reduce churn with onboarding and proactive customer success",
    ],
    description:
      "B2B SaaS churn reduction: why retaining customers beats replacing them, and how onboarding, proactive customer success and sticky product features keep churn down.",
  },
  "b2b-cold-email-lead-generation": {
    src: `${DIR}/b2b-cold-email-lead-generation-high-converting-frameworks.webp`,
    alt: "B2B cold email lead generation frameworks that turn prospects into clients",
    focus: "B2B cold email lead generation",
    keywords: ["cold email frameworks", "personalized outreach", "booking sales meetings"],
    longTail: [
      "high converting B2B cold email lead generation frameworks",
      "how to write cold emails that get replies and book meetings",
    ],
    description:
      "B2B cold email lead generation: finding the right prospects, personalizing the message, following up and turning replies into booked meetings and clients.",
  },
};

/** The mapped image for a guide, or null when none has been added for it. */
export function guideImage(slug: string): GuideImage | null {
  return GUIDE_IMAGES[slug] ?? null;
}
