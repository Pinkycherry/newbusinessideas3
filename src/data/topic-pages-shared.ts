/** Blocks repeated across India topic pages. Data only; the layout lives in src/bought/topic-page.ts. */
import type { Link, Section } from "@/bought/topic-page";

export const PARENT: Link = { label: "Startup topics", href: "/topics" };
export const UPDATED = "India edition";
/** Last content review date for the topic pages (ISO). Change it whenever a page is reviewed. */
export const UPDATED_ON = "2026-11-04";

export const IMG = {
  hub: "/bought/topics/images/hero-hub-DBrOLMFS.jpg",
  validation: "/bought/topics/images/featured-validation-BKTiEk3s.jpg",
  funding: "/bought/topics/images/featured-fundraising-BLJXHLXr.jpg",
  metrics: "/bought/topics/images/featured-saas-metrics-Ro2ZMNWC.jpg",
};

export const SRC = {
  udyam: { label: "Udyam Registration portal (Ministry of MSME)", href: "https://udyamregistration.gov.in/", note: "Free, online, Aadhaar-based registration for micro, small and medium enterprises." },
  msmeLimits: { label: "Revised MSME classification (News On AIR)", href: "https://newsonair.gov.in/govt-notifies-revised-criteria-for-classifying-msmes", note: "Revised investment and turnover limits for micro, small and medium enterprises." },
  mudra: { label: "Pradhan Mantri MUDRA Yojana", href: "https://www.mudra.org.in/", note: "Shishu, Kishore, Tarun and Tarun Plus loans through banks, NBFCs and MFIs." },
  mudraPlus: { label: "PIB: MUDRA Tarun Plus category", href: "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2024/oct/doc20241029426401.pdf" },
  seedFund: { label: "Startup India Seed Fund Scheme", href: "https://seedfund.startupindia.gov.in/", note: "Grants and convertible debt for DPIIT-recognised startups, through selected incubators." },
  dpiit: { label: "Startup India: DPIIT recognition", href: "https://www.startupindia.gov.in/content/sih/en/startupgov/startup_recognition_page.html" },
  standUp: { label: "Stand-Up India", href: "https://www.standupmitra.in/", note: "Bank loans for SC/ST and women entrepreneurs starting a new enterprise." },
  pmegp: { label: "PMEGP (KVIC)", href: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp", note: "Margin-money subsidy on bank loans for new micro enterprises." },
  cgtmse: { label: "CGTMSE credit guarantee", href: "https://www.cgtmse.in/", note: "Guarantee cover that lets banks lend to micro and small units without collateral." },
  gst: { label: "GST portal: registration", href: "https://www.gst.gov.in/", note: "Registration thresholds and the composition scheme." },
  gstLimits: { label: "GST threshold and composition limits (32nd GST Council)", href: "https://gstcouncil.gov.in/sites/default/files/2024-10/32nd_gst_press_information_bureau.pdf" },
  npci: { label: "NPCI: UPI for merchants", href: "https://www.npci.org.in/what-we-do/upi/product-overview" },
  budget2024: { label: "Business Standard: angel tax abolished for all classes of investors", href: "https://www.business-standard.com/budget/news/budget-2024-abolishes-angel-tax-on-startups-for-all-classes-of-investors-124072300667_1.html" },
  sidbi: { label: "SIDBI: Fund of Funds for Startups", href: "https://www.sidbi.in/en/ffs" },
  mca: { label: "MCA: company and LLP incorporation", href: "https://www.mca.gov.in/" },
  ondc: { label: "ONDC for sellers", href: "https://ondc.org/" },
  gem: { label: "GeM: sell to government buyers", href: "https://gem.gov.in/" },
} satisfies Record<string, Link>;

export const TOOLS: Section = {
  type: "cards",
  heading: "Free tools for your next step",
  intro: "Each one asks you a few honest questions and gives you something to act on today.",
  items: [
    { title: "Business idea risk check", body: "Find the one assumption that could sink your idea before you spend.", href: "/business-idea-risk-check", cta: "Check my risks" },
    { title: "Demand test for India", body: "Run a small, cheap test with real buyers in your town or online.", href: "/business-demand-test-india", cta: "Plan a test" },
    { title: "Startup cost ledger", body: "List every rupee you need before the first sale, line by line.", href: "/startup-costs-india", cta: "Open ledger" },
    { title: "First-price workbench", body: "Set a price that covers cost, GST and your own time.", href: "/business-pricing-india", cta: "Set my price" },
    { title: "Cash-flow calendar", body: "See the month your money runs short, before it happens.", href: "/startup-cash-flow-india", cta: "Plan cash" },
    { title: "Pivot or stop", body: "A calm way to decide when the numbers are not moving.", href: "/business-idea-pivot-or-stop", cta: "Decide" },
  ],
};

export const CALCS: Section = {
  type: "cards",
  heading: "Free calculators",
  items: [
    { title: "Startup cost calculator", body: "Add rent, deposit, stock, tools and licences in rupees.", href: "/calculator/startup-cost", cta: "Calculate" },
    { title: "Break-even calculator", body: "How many orders a month before you stop losing money.", href: "/calculator/break-even", cta: "Calculate" },
    { title: "Funding needed calculator", body: "How much to raise or borrow, and for how many months.", href: "/calculator/funding-needed", cta: "Calculate" },
    { title: "ROI calculator", body: "Is the money and time you put in coming back?", href: "/calculator/roi", cta: "Calculate" },
  ],
};

export const EXPLORE: Section = {
  type: "chips",
  heading: "Explore more",
  items: [
    { label: "Business ideas for India", href: "/business-ideas-india" },
    { label: "Side business ideas", href: "/side-business-ideas-india" },
    { label: "Local business ideas", href: "/local-business-ideas-india" },
    { label: "Online business ideas", href: "/online-business-ideas-india" },
    { label: "Business models compared", href: "/business-models-india" },
    { label: "Startup terms in plain words", href: "/startup-terms-india" },
    { label: "Founder glossary", href: "/founder-glossary" },
    { label: "Idea lists", href: "/lists" },
    { label: "Browse all categories", href: "/browse" },
  ],
};

export const CTA: Extract<Section, { type: "cta" }> = {
  type: "cta",
  heading: "Don't build what nobody in your area will pay for.",
  body: "Pick one idea, check the risks, and test it with ten real buyers this week. It costs you a few evenings, not your savings.",
  button: { label: "Check my idea", href: "/business-idea-risk-check" },
  note: "Free · No sign-up needed",
};

type S<T extends Section["type"]> = Extract<Section, { type: T }>;
type Q = {
  takeaways: string[];
  steps: { heading: string; intro?: string; items: S<"steps">["items"] };
  table: Omit<S<"table">, "type">;
  mistakes: { heading: string; items: S<"list">["items"] };
  situations: S<"cards">["items"];
  check?: Omit<S<"quiz">, "type">;
  faq: { heading: string; items: S<"faq">["items"] };
  tips: string[];
  sources: Link[];
  compare?: Omit<S<"table">, "type">;
  related: Link[];
  keepReading: S<"cards">["items"];
  deeper: Link[];
  rules?: string[];
};

/**
 * The purchased question-page section order: takeaways, step by step,
 * benchmarks, pitfalls, real situations, FAQ, expert tips, sources, compare,
 * related questions, CTA, keep reading, deeper answers, tools, calculators,
 * explore, what changed. Optional blocks are left out only when the seller
 * page for that topic did not have them.
 */
export function questionSections(q: Q): Section[] {
  const out: Section[] = [
    { type: "takeaways", heading: "Key takeaways", items: q.takeaways },
    { type: "steps", ...q.steps },
    { type: "table", ...q.table },
    { type: "list", ...q.mistakes },
    { type: "cards", heading: "Real situations from India", items: q.situations },
  ];
  if (q.check) out.push({ type: "quiz", ...q.check });
  out.push(
    { type: "faq", ...q.faq },
    { type: "takeaways", heading: "Expert tips", items: q.tips },
    { type: "sources", heading: "Sources", items: q.sources },
  );
  if (q.compare) out.push({ type: "table", ...q.compare });
  out.push(
    { type: "chips", heading: "Related questions", items: q.related },
    CTA,
    { type: "cards", heading: "Keep reading", items: q.keepReading },
    { type: "chips", heading: "Deeper answers founders ask for", items: q.deeper },
    TOOLS,
    CALCS,
    EXPLORE,
  );
  if (q.rules) out.push({ type: "takeaways", heading: "Rules worth knowing", intro: "Limits change from time to time. Confirm the current figure on the official page in Sources.", items: q.rules });
  return out;
}
