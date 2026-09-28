/**
 * DRAFT PREVIEW CONTENT for the India Idea Atlas.
 *
 * Used only while the india_* tables are not yet applied or hold nothing
 * published. Every page that renders these shows a "Draft preview" notice and
 * is noindex, and the India sitemap never lists them. They are concept
 * sketches carried over from the design study, not researched ideas: no
 * budgets, no hours, no earnings, no sources.
 */
import type { IndiaIdea, IndiaSetSummary } from "./india-shared";

const blank = {
  assumptions: null,
  weeklyHoursMin: null,
  weeklyHoursMax: null,
  budgetLowerInr: null,
  budgetUpperInr: null,
  budgetBasis: null,
  budgetExcludes: null,
  budgetEstimateDate: null,
} as const;

export const FIXTURE_IDEAS: IndiaIdea[] = [
  {
    ...blank,
    key: "regional-language-product-listings",
    title: "Regional-language product listings",
    customer:
      "An independent seller who wants help preparing product descriptions in the language their customers use.",
    problem: "Rough product sheets read badly, and machine translation changes claims and units.",
    offer:
      "A small batch of edited listings, checked by a fluent speaker and approved by the seller.",
    customerReach: "Approach sellers you can already reach through your own market or community.",
    revenueModel: "A fixed fee per batch of listings, agreed before the work starts.",
    firstTest:
      "Ask one seller for permission to rewrite a sample listing, then have a fluent reviewer compare meaning, tone and product claims.",
    mainRisk:
      "Translations can alter claims or units. Never publish without the seller's approval, and never promise more sales.",
    skillTags: ["writing", "languages"],
    workMode: "home",
  },
  {
    ...blank,
    key: "customer-question-libraries-small-shops",
    title: "Customer-question libraries for small shops",
    customer: "A shop owner who answers the same product and service questions many times a day.",
    problem: "Repeated questions eat time, and replies drift from the shop's actual policies.",
    offer:
      "A searchable set of draft replies built only from policies and answers the owner supplies.",
    customerReach: "Start with shops you already buy from and ask what they are asked most often.",
    revenueModel: "A one-off setup fee, with an optional paid update when policies change.",
    firstTest:
      "Collect a small set of anonymised questions with consent, draft replies, and ask the owner to correct every answer.",
    mainRisk:
      "Wrong refund or delivery answers cause real problems. Keep private customer data out of unapproved tools.",
    skillTags: ["writing", "customer service"],
    workMode: "hybrid",
  },
  {
    ...blank,
    key: "human-checked-workshop-captions",
    title: "Human-checked workshop captions",
    customer: "A tutor or craft instructor who owns recordings and wants them easier to follow.",
    problem: "Automatic captions mangle names, terms and meaning, so viewers give up.",
    offer:
      "Reviewed captions and a short summary, using only material the instructor has permission to share.",
    customerReach: "Reach instructors through the classes, groups and channels they already run.",
    revenueModel: "A fee per recording, scoped by length before work begins.",
    firstTest:
      "Caption a short, authorised clip and ask the instructor and a fluent listener to flag errors.",
    mainRisk:
      "Recordings may contain student data or third-party material. Get consent and check technical vocabulary.",
    skillTags: ["languages", "editing"],
    workMode: "online",
  },
  {
    ...blank,
    key: "quote-and-follow-up-draft-support",
    title: "Quote and follow-up draft support",
    customer: "A local service operator whose enquiries and quotes are hard to keep organised.",
    problem:
      "Enquiries get lost between calls and messages, and quotes go out inconsistent or late.",
    offer:
      "A reusable enquiry checklist and editable quote and follow-up drafts the operator approves.",
    customerReach:
      "Talk to electricians, tailors and repair shops near you about how they handle enquiries now.",
    revenueModel: "A setup fee for the checklist and templates, then a small fee for changes.",
    firstTest:
      "Use invented customer data to show one complete enquiry-to-quote example and let the operator check it fits.",
    mainRisk:
      "Never invent prices or send messages without approval. Keep customer details out of unsuitable tools.",
    skillTags: ["operations", "writing"],
    workMode: "local",
  },
  {
    ...blank,
    key: "menu-and-catalogue-clean-up",
    title: "Menu and catalogue clean-up",
    customer: "A local shop or food business with a menu or catalogue that has grown messy.",
    problem:
      "Item names, categories and details are inconsistent, so customers ask and staff guess.",
    offer:
      "A checked, editable file with consistent item names, categories and owner-supplied details.",
    customerReach: "Offer a before-and-after sample to businesses whose menus you already know.",
    revenueModel: "A fixed fee per document, quoted after seeing it.",
    firstTest:
      "Ask an owner to approve a short before-and-after sample made from their own document.",
    mainRisk:
      "Scans misread prices, ingredients and units. The owner verifies the final file; food claims need extra care.",
    skillTags: ["organisation", "editing"],
    workMode: "local",
  },
];

type FixtureSet = IndiaSetSummary & { ideaKeys: string[] };

export const FIXTURE_SETS: FixtureSet[] = [
  {
    slug: "ai-services-for-indian-businesses",
    title: "AI services for Indian small businesses",
    introduction:
      "Services you could shape around AI tools, starting from a buyer's problem and keeping a person responsible for the result.",
    selectionCriterion:
      "Services where AI helps with drafting or sorting, and a human checks every output.",
    family: "ai-digital",
    audience: "People comfortable with writing and everyday software",
    rules: { work_modes: ["home", "online", "hybrid", "local"] },
    heroVariant: "wiring",
    ideaCount: 5,
    reviewedAt: null,
    ideaKeys: [
      "regional-language-product-listings",
      "customer-question-libraries-small-shops",
      "human-checked-workshop-captions",
      "quote-and-follow-up-draft-support",
      "menu-and-catalogue-clean-up",
    ],
  },
  {
    slug: "indian-language-content-operations",
    title: "Put your language skills to work",
    introduction:
      "Concepts for people who can make information clearer in more than one Indian language.",
    selectionCriterion: "Work where fluency in a second language is the core skill being paid for.",
    family: "ai-digital",
    audience: "Fluent speakers of two or more languages",
    rules: { work_modes: ["home", "online"] },
    heroVariant: "wiring",
    ideaCount: 2,
    reviewedAt: null,
    ideaKeys: ["regional-language-product-listings", "human-checked-workshop-captions"],
  },
  {
    slug: "neighbourhood-shop-services",
    title: "Start with the shops around you",
    introduction:
      "Everyday admin and communication jobs that local owners might pay someone to take off their hands.",
    selectionCriterion: "Services delivered to shops you can walk to, with a clear deliverable.",
    family: "retail-support",
    audience: "People who know their local market",
    rules: { work_modes: ["local", "hybrid"] },
    heroVariant: "route",
    ideaCount: 3,
    reviewedAt: null,
    ideaKeys: [
      "menu-and-catalogue-clean-up",
      "customer-question-libraries-small-shops",
      "quote-and-follow-up-draft-support",
    ],
  },
  {
    slug: "home-based-service-desk",
    title: "A service desk, from home",
    introduction:
      "Start with a clear deliverable and one conversation about whether someone needs it.",
    selectionCriterion: "Work that can be done entirely from home and delivered online.",
    family: "setting",
    audience: null,
    rules: { work_modes: ["home", "online"] },
    heroVariant: "ledger",
    ideaCount: 2,
    reviewedAt: null,
    ideaKeys: ["regional-language-product-listings", "human-checked-workshop-captions"],
  },
  {
    slug: "behind-the-scenes-for-instructors",
    title: "Behind the scenes for instructors",
    introduction:
      "Captioning and content support for people who have knowledge to share and no time to polish it.",
    selectionCriterion: "Support work for tutors and instructors who already publish or teach.",
    family: "education",
    audience: "Careful editors and listeners",
    rules: { work_modes: ["online"] },
    heroVariant: "console",
    ideaCount: 1,
    reviewedAt: null,
    ideaKeys: ["human-checked-workshop-captions"],
  },
  {
    slug: "help-a-local-business-get-organised",
    title: "Help a local business get organised",
    introduction: "Small, clearly scoped projects to try before committing to a larger service.",
    selectionCriterion: "One-off organising jobs with a finished file the owner keeps.",
    family: "business-operations",
    audience: null,
    rules: { work_modes: ["local", "hybrid"] },
    heroVariant: "route",
    ideaCount: 3,
    reviewedAt: null,
    ideaKeys: [
      "quote-and-follow-up-draft-support",
      "menu-and-catalogue-clean-up",
      "customer-question-libraries-small-shops",
    ],
  },
];
