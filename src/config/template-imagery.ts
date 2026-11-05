/** Six-field image SEO entries for the founder template family. All assets are 16:9 WebP. */
export type TemplateImage = {
  src: string;
  alt: string;
  focus: string;
  keywords: [string, string, string];
  longTail: [string, string];
  description: string;
  width: 1600;
  height: 900;
};

export const templateImages = {
  planning: {
    src: "/images/templates/indian-founder-business-planning-template-lean-canvas-businessidea.webp",
    alt: "Indian business planning templates help founders examine buyers and costs.",
    focus: "business planning templates",
    keywords: ["Indian founders", "buyer research", "startup costs"],
    longTail: ["business planning templates for Indian first time founders", "how to examine buyers and startup costs before launching"],
    description: "BusinessIdea.io business planning templates bring buyer research, startup costs and the next founder decision into one working draft.",
    width: 1600, height: 900,
  },
  interview: {
    src: "/images/templates/indian-customer-persona-interview-business-template-founders.webp",
    alt: "Customer persona interview templates guide Indian founders toward buyer evidence.",
    focus: "customer interview template",
    keywords: ["customer persona", "Indian founders", "buyer evidence"],
    longTail: ["customer interview template for Indian business founders", "how to record buyer evidence for a customer persona"],
    description: "BusinessIdea.io customer interview and persona templates help founders listen to buyers and separate observed evidence from assumptions.",
    width: 1600, height: 900,
  },
  canvas: {
    src: "/images/templates/indian-lean-canvas-saas-business-plan-founder-template.webp",
    alt: "Lean canvas SaaS business plan templates organise Indian founder decisions.",
    focus: "lean canvas template",
    keywords: ["SaaS business plan", "Indian founders", "business decisions"],
    longTail: ["lean canvas template for Indian software founders", "how to organise a SaaS business plan before launch"],
    description: "BusinessIdea.io lean canvas and SaaS business plan templates organise a founder's buyer, offer, revenue and costs for the next decision.",
    width: 1600, height: 900,
  },
} as const satisfies Record<string, TemplateImage>;
