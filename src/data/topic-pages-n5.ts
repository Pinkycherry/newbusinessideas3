import type { TopicPage } from "@/bought/topic-page";
import { PARENT, UPDATED, IMG, SRC, CALCS, EXPLORE, CTA } from "./topic-pages-shared";

/**
 * New page 25. Seller reference: question page (/questions/how-to-find-cofounder).
 * Composition (own to this page): "do you need one" check first, where to look as cards, a trial-project
 * method as steps, a partner-fit table, paperwork in plain words, red flags, a conversation list. No researched figures.
 */
export const cofounder: TopicPage = {
  slug: "how-to-find-a-co-founder-for-a-startup-in-india",
  updated: "2026-11-05",
  sellerRef: "https://ideaproof.io/questions/how-to-find-cofounder",
  parent: PARENT,
  explore: { guideCategory: "Launch & Ops", categories: ["web-and-app-service-business-ideas", "ai-and-automation-service-business-ideas", "digital-marketing-business-ideas", "food-processing-business-ideas", "education-business-ideas", "e-commerce-selling-business-ideas", "student-business-ideas", "freelance-business-ideas"] },
  inputs: [
    { label: "Partner skill I need", options: ["Tech", "Sales and marketing", "Operations", "Money and finance"] },
    { label: "Partner I have in mind", options: ["Friend", "Family member", "Colleague", "Not found yet"] },
  ],
  seo: {
    title: "How to Find a Co-Founder for a Startup in India (and Test the Partnership First)",
    description: "Find the right co-founder in India: decide whether you need one, where to look (college networks, incubators, work colleagues, communities), test with a paid trial project, check skills and values, and put the partnership on paper with a founders' agreement, partnership deed or LLP agreement.",
  },
  hero: {
    eyebrow: "Find a co-founder",
    h1: "How to Find a Co-Founder for a Startup in India",
    highlight: "Co-Founder",
    intro: "A co-founder is the person you will build with through bad months, family pressure and arguments about money. In India many partnerships start between college friends, cousins or colleagues, sealed by trust and nothing on paper. Many good businesses later break over exactly that. This page helps you decide whether you need a partner, where to find one, and how to test the partnership before you commit your savings and your friendship.",
    updated: UPDATED,
    primary: { label: "Do I need one?", href: "#check" },
    secondary: { label: "Start without investors", href: "/how-to-start-a-business-without-investors-in-india" },
    image: IMG.hub,
    imageAlt: "Two founders planning a business together",
  },
  sections: [
    {
      type: "quiz",
      heading: "Do you really need a co-founder?",
      intro: "Tick what is true. More ticks mean a partner would help.",
      items: [
        "The business needs a key skill I do not have and cannot hire yet (tech, sales, production).",
        "I cannot give it full time and need someone who can.",
        "Investors I plan to approach expect a founding team.",
        "The work is too much for one person even at a small scale.",
        "I have a person in mind whose skills are different from mine, not the same.",
      ],
      result: "Two or fewer ticks? You may do better alone, with a freelancer or a first employee. A proprietorship is a fine start.",
    },
    {
      type: "cards",
      heading: "Where Indian founders find co-founders",
      items: [
        { title: "College and alumni networks", body: "Batchmates, seniors and alumni groups, especially from engineering, design and management colleges." },
        { title: "Incubators and startup cells", body: "University incubators, state startup missions and Startup India events bring founders together." },
        { title: "Work colleagues", body: "People you have already worked with under pressure; you know how they behave on a bad day." },
        { title: "Communities and meetups", body: "Local founder meetups, hackathons, LinkedIn and sector WhatsApp groups." },
        { title: "Your own customers or suppliers", body: "Someone who knows the trade from the inside can be a stronger partner than a friend." },
        { title: "Family", body: "Common and often strong, but write the terms down even more carefully." },
      ],
    },
    {
      type: "steps",
      heading: "Test the partnership before you commit",
      items: [
        { title: "Agree a small trial project", body: "Four to eight weeks on one real task: a pilot with ten customers, a prototype, a first sales push." },
        { title: "Set clear roles for the trial", body: "Who does what, how many hours each week, who decides what." },
        { title: "Share money only for the trial", body: "A small, equal budget. Watch how each of you spends and records it." },
        { title: "Have the hard talks early", body: "Equity, salary, full-time dates, what happens if one leaves, family expectations. Use the list below." },
        { title: "Review honestly at the end", body: "Did you both deliver? Did disagreements end in decisions? Would you trust them with your savings? If not, part as friends now." },
      ],
    },
    {
      type: "table",
      heading: "What to check in a partner",
      columns: ["Check", "Good sign", "Warning sign"],
      rows: [
        ["Skills", "Fills a gap you have", "Same skills as you"],
        ["Commitment", "Clear date to go full time", "\"After my next promotion\" for ever"],
        ["Money attitude", "Careful, records every rupee", "Spends before earning"],
        ["Family situation", "Family knows and supports the plan", "Family expects a quick salary or marriage-driven exit"],
        ["Conflict", "Disagrees openly, then decides", "Goes silent or keeps score"],
        ["Values", "Honest with customers and suppliers", "Cuts corners on GST, quality or promises"],
      ],
    },
    {
      type: "rich",
      heading: "Put it on paper",
      blocks: [
        { kind: "p", text: "Whatever your structure, write the agreement before money or code changes hands. A chartered accountant or startup lawyer can draft it; ask two for quotes. [Validate: typical fee for drafting a founders' agreement or partnership deed in my city]" },
        { kind: "list", items: [
          "**Partnership firm:** a partnership deed on stamp paper, registered with the state Registrar of Firms where possible. Covers capital, profit share, roles and exit.",
          "**LLP:** an LLP agreement filed on the [MCA portal](https://www.mca.gov.in/) after incorporation. Limited liability for partners.",
          "**Private limited company:** shares issued to founders on incorporation, plus a founders' or shareholders' agreement with vesting, roles, decision rules and exit terms. Needed if you plan to raise equity.",
        ] },
        { kind: "checklist", title: "What the agreement must answer", items: [
          "Who owns what share, and on what vesting schedule",
          "Who contributes how much money and time",
          "Roles and who decides what",
          "Salaries or drawings, and when they start",
          "What happens if one founder leaves, stops working or wants to sell",
          "Who owns the brand, code, recipes and customer list",
          "How disputes are settled",
        ] },
      ],
    },
    {
      type: "list",
      heading: "Red flags to walk away from",
      items: [
        { title: "Wants a large share for an idea alone", body: "Ideas are cheap; work and money build the business." },
        { title: "Refuses to sign anything", body: "\"We are friends, why paper?\" is how friendships end in court." },
        { title: "Will not commit time", body: "A part-time partner forever is an advisor, not a co-founder." },
        { title: "Hides past debts or failures", body: "Everyone has failures; hiding them is the problem." },
        { title: "Different idea of success", body: "One wants a steady family business, the other a fast-growing startup. Talk about it before you start." },
      ],
    },
    {
      type: "rich",
      heading: "Ten conversations to have before you start",
      blocks: [
        { kind: "list", ordered: true, items: [
          "Why do we each want to do this?",
          "How big do we want it to be, and by when?",
          "How much money can each of us put in, and lose?",
          "When does each of us go full time?",
          "How will we split shares, and why?",
          "When will we start taking a salary?",
          "What does each family expect from us?",
          "Who has the final say when we disagree?",
          "What happens if one of us wants to leave?",
          "What will we never do, even to make money?",
        ] },
      ],
    },
    { type: "dbfaq", heading: "Partner and team questions", intro: "Real questions from our published idea guides. More on our [founder FAQ page](/faq).", categories: ["web-and-app-service-business-ideas", "digital-marketing-business-ideas", "food-processing-business-ideas", "education-business-ideas", "student-business-ideas", "freelance-business-ideas", "home-based-business-ideas", "e-commerce-selling-business-ideas"], match: "(partner|team|alone|hire|staff|help|family)", limit: 8 },
    { type: "sources", heading: "Sources", items: [SRC.mca, SRC.dpiit, SRC.udyam, { label: "Startup India: incubators and events", href: "https://www.startupindia.gov.in/", note: "Find incubators, programmes and founder events." }] },
    {
      type: "chips",
      heading: "Related questions",
      items: [
        { label: "When to raise funds for a startup", href: "/when-to-raise-funds-for-a-startup-in-india" },
        { label: "How to raise funds for a startup", href: "/how-to-raise-funds-for-a-startup-in-india" },
        { label: "Startup funding questions", href: "/startup-funding-questions-for-first-time-founders-in-india" },
        { label: "How to start a business without investors", href: "/how-to-start-a-business-without-investors-in-india" },
        { label: "Startup terms in plain words", href: "/startup-terms-india" },
      ],
    },
    { ...CTA, heading: "Choose a partner the way you test an idea.", body: "Run a small trial project before you share savings or shares. Check your idea's biggest risk too, free." },
    CALCS,
    EXPLORE,
  ],
};
