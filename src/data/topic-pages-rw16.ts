import type { TopicPage } from "@/bought/topic-page";
import { PARENT, UPDATED, UPDATED_ON, IMG, SRC, TOOLS, EXPLORE, CTA } from "./topic-pages-shared";

/**
 * Rewrite 16 (owner review: previous version failed as thin and generic).
 * Seller layout: FAQ hub (/startup-funding-faq). Seller sections kept in order:
 * in short, official facts, every source compared, stages, how a first raise goes, habits, Q&A (Supabase FAQ),
 * validate before you raise, mistakes, tools, comparisons, keep exploring, explore, CTA, sources.
 * No researched figures: every number is a [Validate: ...] marker or a blank the reader fills in.
 */
export const fundingQuestions: TopicPage = {
  slug: "startup-funding-questions-for-first-time-founders-in-india",
  updated: UPDATED_ON,
  sellerRef: "https://ideaproof.io/startup-funding-faq",
  parent: PARENT,
  explore: { guideCategory: "Bootstrapping", categories: ["home-based-business-ideas", "women-friendly-business-ideas", "village-and-small-town-business-ideas", "small-manufacturing-business-ideas", "food-processing-business-ideas", "web-and-app-service-business-ideas", "freelance-business-ideas", "retail-shop-business-ideas"] },
  seo: {
    title: "Startup Funding Questions for First-Time Founders in India, Answered in Plain Words",
    description: "Plain answers to the money questions first-time founders in India ask: loan or investor, MUDRA bands, PMEGP, Stand-Up India, DPIIT and the Seed Fund, how much to raise, family money, credit score, what banks and angels check, equity and term sheets, with steps and a readiness check.",
  },
  hero: {
    eyebrow: "Startup funding questions",
    h1: "Startup Funding Questions for First-Time Founders in India",
    highlight: "Funding Questions",
    intro: "Every first-time founder has the same worries at night. Will a bank lend to me without collateral? Do I need an investor at all? How much should I ask for? What if I take money from my father-in-law and the business fails? This page gives straight answers, with the official Indian portals to check, the steps to follow and the mistakes to avoid, so you walk into a branch or a pitch knowing what to expect.",
    sub: "Figures such as loan limits and scheme amounts change from time to time. Where a number matters, use the Validate button for today's figure and confirm it on the official page.",
    updated: UPDATED,
    primary: { label: "Jump to the questions", href: "#questions" },
    secondary: { label: "Funding stages", href: "/how-to-raise-funds-for-a-startup-in-india" },
    image: IMG.funding,
    imageAlt: "A founder reading answers about startup funding",
  },
  sections: [
    {
      type: "takeaways",
      heading: "Startup funding in short",
      items: [
        "**Most small businesses in India start with savings, family help and then a bank loan**, not investors.",
        "**MUDRA** loans cover non-farm micro businesses in four bands (Shishu, Kishore, Tarun and Tarun Plus); you apply at a bank, NBFC or MFI. [Validate: current MUDRA loan limits for each band]",
        "**DPIIT recognition** opens the Startup India Seed Fund, which is given through selected incubators, not directly.",
        "**Investors take ownership; loans need repayment.** Choose by your stage and your business type, not by excitement or what you read about funded startups.",
        "**Udyam registration is free** and is the first paper most banks and schemes ask for.",
        "**Proof beats paperwork.** Paying customers and clean bank statements matter more than any pitch deck.",
      ],
    },
    {
      type: "rich",
      heading: "Funding facts from official sources",
      intro: "What each scheme is for and where to check it. Limits change from time to time; confirm the current figure on the official page before you apply.",
      blocks: [
        { kind: "table", columns: ["Scheme or rule", "What it offers", "Official source"], rows: [
          ["MUDRA (PMMY)", "Collateral-free loans for non-farm micro businesses in four bands by size", "[mudra.org.in](https://www.mudra.org.in/)"],
          ["PMEGP", "Margin-money subsidy on a bank loan for a new micro enterprise; an EDP training is part of the process", "[KVIC PMEGP portal](https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp)"],
          ["Stand-Up India", "Bank loans for SC/ST and women entrepreneurs starting a new enterprise", "[standupmitra.in](https://www.standupmitra.in/)"],
          ["CGTMSE", "Credit guarantee that lets banks lend to micro and small units without collateral", "[cgtmse.in](https://www.cgtmse.in/)"],
          ["Startup India Seed Fund", "Grants and debt for DPIIT-recognised startups, through incubators", "[seedfund.startupindia.gov.in](https://seedfund.startupindia.gov.in/)"],
          ["Udyam registration", "Free, online, Aadhaar-based MSME registration", "[udyamregistration.gov.in](https://udyamregistration.gov.in/)"],
          ["MSME classification", "Investment and turnover limits for micro, small and medium enterprises", "[News On AIR](https://newsonair.gov.in/govt-notifies-revised-criteria-for-classifying-msmes)"],
        ] },
        { kind: "p", text: "For today's exact limits, rates and subsidy shares, run the Validate button. [Validate: current loan limits for MUDRA bands, Stand-Up India loan range, PMEGP subsidy rates and Seed Fund amounts]" },
      ],
    },
    {
      type: "rich",
      heading: "Every funding source, compared",
      blocks: [
        { kind: "table", columns: ["Source", "Repay?", "Ownership", "Best for", "Watch out for"], rows: [
          ["Savings and family", "Agree terms in writing", "Yours", "Testing and the first months", "Using money meant for school fees, weddings or medical needs"],
          ["SHG and cooperative credit", "Yes, small amounts", "Yours", "Village and women-led micro enterprises", "Group trust if repayments slip"],
          ["MUDRA and bank loans", "Yes, with interest", "Yours", "Micro and small businesses with sales", "EMI in slow months; agents who charge fees"],
          ["PMEGP", "Yes; part subsidised", "Yours", "New manufacturing or service micro units", "Long processing; subsidy rules and lock-in"],
          ["Seed Fund via incubator", "Depends on form", "Sometimes shared", "DPIIT-recognised startups proving a product", "Milestones and reporting"],
          ["Angel investors", "No", "Shared", "Early traction, scalable idea", "Giving away too much too early"],
          ["Venture capital", "No", "Shared, with board rights", "Fast growth in large markets", "Pressure to grow fast; loss of control"],
          ["Moneylenders and informal loans", "Yes, often at high interest", "Yours", "Avoid for business", "Debt traps and pressure on family"],
        ] },
      ],
    },
    {
      type: "rich",
      heading: "The funding stages, explained",
      blocks: [
        { kind: "steps", items: [
          { title: "Idea stage", body: "Use your own money to test. [Validate the idea](/how-to-validate-a-business-idea-in-india) with ten paying buyers before you borrow a rupee." },
          { title: "First customers", body: "A MUDRA or bank loan can fund equipment and stock once people pay you. Read [how to get funding for a small business](/how-to-get-funding-for-a-small-business-in-india)." },
          { title: "Proof of concept", body: "DPIIT-recognised startups can apply to the Seed Fund through an incubator; state startup cells often run grants too." },
          { title: "Early traction", body: "Angel investors come in when buyers return and sales grow month after month." },
          { title: "Growth", body: "Venture capital, for the few businesses that must grow very fast in a very large market." },
        ] },
        { kind: "p", text: "Many profitable Indian businesses stay at stage two for ever, and that is a good outcome. See [how to start a business without investors](/how-to-start-a-business-without-investors-in-india)." },
      ],
    },
    {
      type: "rich",
      heading: "How a first fundraise usually goes",
      blocks: [
        { kind: "steps", items: [
          { title: "Know your number", body: "Use the [funding needed calculator](/calculator/funding-needed): setup + running costs until break-even + a buffer." },
          { title: "Check your credit report", body: "Banks check it. Get your free report from a credit bureau and fix any errors before you apply." },
          { title: "Prepare your papers", body: "Udyam, KYC, GST if registered, bank statements, quotations, premises papers, and for companies the filings on [MCA](https://www.mca.gov.in/)." },
          { title: "Write a short plan or pitch", body: "For a bank, a [project report](/how-to-write-a-business-plan-for-a-bank-loan-in-india). For an investor, a ten-slide deck with proof." },
          { title: "Meet the right door", body: "Bank branch or [Jan Samarth](https://www.jansamarth.in/) for loans; incubators for the Seed Fund; angel networks for equity." },
          { title: "Read before you sign", body: "Have a chartered accountant or lawyer read loan terms or a term sheet, especially guarantees, valuation and control clauses." },
        ] },
        { kind: "h3", text: "Worked rupee example: how much should I ask for?" },
        { kind: "table", columns: ["Line", "How to work it out", "Your figure"], rows: [
          ["One-time setup", "Quotations for equipment, fit-out, deposit", "₹ ______"],
          ["Monthly running cost", "Rent, wages, power, material, your draw", "₹ ______"],
          ["Months to break even", "From the break-even calculator", "______"],
          ["Buffer months", "A few extra months for slow seasons", "______"],
          ["**Total need**", "Setup + monthly × (months + buffer)", "₹ ______"],
          ["Your own and family money", "Agreed in writing", "₹ ______"],
          ["**Amount to borrow or raise**", "Total need − own money", "₹ ______"],
          ["EMI that fits your profit", "Ask the branch for rate and tenure", "₹ ______"],
        ] },
      ],
    },
    {
      type: "rich",
      heading: "Funding habits that work",
      blocks: [
        { kind: "list", items: [
          "**Raise after proof, not before.** Even ten paying customers change the conversation in a branch or an angel meeting.",
          "**Borrow for assets that earn**: a machine that makes products, a vehicle that delivers, stock that sells. Not a fancy office or a big signboard.",
          "**Keep business money separate.** A current account with all UPI receipts makes banks trust you.",
          "**Ask two banks.** Branch experience with schemes differs a lot, even in the same town.",
          "**Write down family money**: is it a loan or a share, at what interest if any, and when it comes back.",
          "**Never pay agents for scheme approval.** Applications on official portals are free; anyone promising a guaranteed subsidy for a fee is a warning sign.",
          "**Track your numbers monthly.** See [business numbers to track](/business-numbers-every-small-business-in-india-should-track).",
        ] },
        { kind: "h3", text: "How it differs for you" },
        { kind: "list", items: [
          "**Women founders:** ask about Stand-Up India and women-focused bank products; many states also run schemes for women entrepreneurs.",
          "**SC/ST founders:** Stand-Up India and state SC/ST development corporations are worth asking about at your branch.",
          "**Village founders:** SHG credit, NRLM support, PMEGP and regional rural banks are usually the first doors.",
          "**Tier 2 and tier 3 founders with a tech product:** state startup cells and university incubators accept applications from your city; you do not need to move to Bengaluru to start.",
          "**Salaried founders testing a side business:** keep the job until the business covers your household needs; banks look more kindly on a steady income.",
        ] },
      ],
    },
    { type: "dbfaq", heading: "Founder funding questions", intro: "Real questions from our published idea guides, on money, loans and costs. More on our [founder FAQ page](/faq).", categories: ["home-based-business-ideas", "women-friendly-business-ideas", "village-and-small-town-business-ideas", "small-manufacturing-business-ideas", "food-processing-business-ideas", "freelance-business-ideas", "retail-shop-business-ideas", "food-business-ideas"], match: "(loan|mudra|pmegp|fund|investment|investor|capital|subsidy|scheme|how much .*(start|need|invest))", limit: 14 },
    {
      type: "rich",
      heading: "Validate before you raise",
      blocks: [
        { kind: "checklist", title: "Funding readiness check", items: [
          "At least ten paying customers who are not family",
          "Some of them have bought again",
          "Profit on one order is clear after every cost",
          "Monthly numbers for every month so far in one sheet",
          "Udyam done; a separate current account in use",
          "Credit report checked",
          "Family agreement on money at risk, in writing",
          "I know which funding door fits my stage",
        ] },
        { kind: "list", items: [
          "**[Is my business idea good?](/how-to-check-if-your-business-idea-is-good-in-india)** Six questions every lender will ask.",
          "**[Validate your idea](/how-to-validate-a-business-idea-in-india)** in five steps with real buyers.",
          "**[Product-market fit](/how-to-know-if-your-business-has-product-market-fit-in-india)**: the proof investors look for.",
        ] },
        { kind: "h3", text: "What to do this week" },
        { kind: "table", columns: ["Day", "Task"], rows: [
          ["Day 1", "Fill the how-much-to-ask sheet above"],
          ["Day 2", "Register on Udyam; check your credit report"],
          ["Day 3", "Tick the readiness check honestly; note the gaps"],
          ["Day 4", "Pick your funding door from the comparison table"],
          ["Day 5", "Write the project report or pitch"],
          ["Day 6", "Visit two branches or apply to one incubator"],
          ["Day 7", "Talk to your family about the amount and the terms"],
        ] },
      ],
    },
    {
      type: "chips",
      heading: "Learn from funding mistakes",
      items: [
        { label: "Indian startup failures", href: "/failed-startups/india" },
        { label: "Common mistakes to avoid", href: "/common-mistakes-to-avoid-when-starting-a-business-in-india" },
        { label: "Why startups fail", href: "/why-startups-fail-2026-2027" },
        { label: "Case studies", href: "/case-studies" },
      ],
    },
    TOOLS,
    {
      type: "chips",
      heading: "Related comparisons",
      items: [
        { label: "Loans vs investors", href: "/how-to-get-funding-for-a-small-business-in-india" },
        { label: "Bootstrapping vs raising", href: "/how-to-start-a-business-without-investors-in-india" },
        { label: "Business models compared", href: "/business-models-india" },
        { label: "Frameworks compared", href: "/frameworks-comparison" },
      ],
    },
    {
      type: "cards",
      heading: "Keep exploring",
      items: [
        { title: "How to raise funds for a startup", body: "The full funding ladder for Indian startups.", href: "/how-to-raise-funds-for-a-startup-in-india", cta: "Read" },
        { title: "How much money you need", body: "Your number, line by line.", href: "/how-much-money-is-needed-to-start-a-business-in-india", cta: "Read" },
        { title: "Free government resources", body: "Portals, incubators and schemes that cost nothing.", href: "/free-government-resources-for-starting-a-business-in-india", cta: "Read" },
        { title: "Startup terms in plain words", body: "Equity, dilution, runway and more.", href: "/startup-terms-india", cta: "Read" },
      ],
    },
    EXPLORE,
    { ...CTA, heading: "Raise on evidence, not hope.", body: "Test your idea with real buyers, know your numbers, then walk into the bank or the pitch with proof." },
    { type: "sources", heading: "Sources", items: [SRC.mudra, SRC.mudraPlus, SRC.seedFund, SRC.dpiit, SRC.standUp, SRC.pmegp, SRC.cgtmse, { label: "Jan Samarth portal", href: "https://www.jansamarth.in/", note: "Single government portal for several credit-linked schemes." }, SRC.udyam, SRC.msmeLimits, SRC.sidbi, SRC.budget2024] },
  ],
};
