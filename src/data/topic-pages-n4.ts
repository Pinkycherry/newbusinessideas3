import type { TopicPage } from "@/bought/topic-page";
import { PARENT, UPDATED, IMG, SRC, TOOLS, CTA } from "./topic-pages-shared";

/**
 * New page 24. Seller reference: question page (/questions/when-to-raise-funding).
 * Composition (own to this page): signal table first, then the timeline, the cost of raising early as a
 * worked share example, timing by money type, a readiness check last, takeaways at the very end. No researched figures.
 */
export const whenToRaise: TopicPage = {
  slug: "when-to-raise-funds-for-a-startup-in-india",
  updated: "2026-11-05",
  sellerRef: "https://ideaproof.io/questions/when-to-raise-funding",
  parent: PARENT,
  explore: { guideCategory: "Bootstrapping", categories: ["web-and-app-service-business-ideas", "ai-and-automation-service-business-ideas", "food-processing-business-ideas", "e-commerce-selling-business-ideas", "education-business-ideas", "health-and-wellness-business-ideas", "small-manufacturing-business-ideas", "agriculture-and-farming-business-ideas"] },
  seo: {
    title: "When to Raise Funds for a Startup in India: Signs You Are Ready (and Signs to Wait)",
    description: "When should an Indian startup raise money? Read the signals that say raise now or wait, the usual timeline from savings to bank loan to angels, what raising too early costs you in ownership, timing for loans, grants and equity, and a readiness check.",
  },
  hero: {
    eyebrow: "When to raise funds",
    h1: "When to Raise Funds for a Startup in India",
    highlight: "When to Raise",
    intro: "Raise too early and you give away a big share of your company for very little, or take an EMI the business cannot carry. Raise too late and a competitor with money moves faster, or you run out of cash. The right time is not a date on the calendar; it is the moment you have proof that more money will turn into more customers.",
    updated: UPDATED,
    primary: { label: "Am I ready?", href: "#check" },
    secondary: { label: "How to raise funds", href: "/how-to-raise-funds-for-a-startup-in-india" },
    image: IMG.funding,
    imageAlt: "A founder deciding the right time to raise money",
  },
  sections: [
    {
      type: "table",
      heading: "Raise now or wait: read the signals",
      columns: ["Signal", "Raise now", "Wait"],
      rows: [
        ["Customers", "Strangers pay and come back", "Only friends and family have bought"],
        ["Demand", "You turn orders away for lack of stock, staff or machines", "You still chase every order"],
        ["Profit per order", "Each sale makes money, or clearly will at scale", "Each sale loses money and you don't know why"],
        ["Use of money", "You can say exactly what it buys and what it proves", "\"To grow\" with no line items"],
        ["Runway", "Several months left, so you can negotiate calmly", "Weeks left; you will accept any terms"],
        ["Market", "A competitor with funding is about to take your space", "Nobody else is moving fast"],
        ["Papers", "Company, GST, Udyam, clean bank statements in order", "Mixed home and business money"],
      ],
    },
    {
      type: "steps",
      heading: "The usual timeline for an Indian startup",
      items: [
        { title: "Test with your own money", body: "Two weekends to a few months: ten paying strangers, first repeat orders. See [how to validate a business idea](/how-to-validate-a-business-idea-in-india)." },
        { title: "Grow on sales and family money", body: "Written terms with family; reinvest profit. Read [how to start a business without investors](/how-to-start-a-business-without-investors-in-india)." },
        { title: "Borrow for things that earn", body: "Once sales are steady, a MUDRA or CGTMSE-backed bank loan for machines, stock or a vehicle. You keep full ownership." },
        { title: "Grants and incubators", body: "With DPIIT recognition and a working product, apply for the Startup India Seed Fund or state grants through an incubator." },
        { title: "Angels", body: "When customers return month after month and growth is clear, angels can speed you up." },
        { title: "Venture capital", body: "Only if you are growing very fast in a very large market and need to move faster than funded competitors." },
      ],
    },
    {
      type: "rich",
      heading: "What raising too early really costs",
      blocks: [
        { kind: "p", text: "Early investors pay little for each share because your risk is high. The same share sold a year later, with customers and sales, can be worth much more. Work it out with your own numbers before you sign anything." },
        { kind: "table", columns: ["Line", "How to work it out", "Your figure"], rows: [
          ["Amount you want to raise", "From the use-of-funds sheet", "₹ ______"],
          ["Value an investor puts on the company today (A)", "From the offer", "₹ ______"],
          ["Share you give away now", "Amount ÷ (A + amount)", "______ %"],
          ["Value after a year of proof (B)", "Your honest estimate after more sales", "₹ ______"],
          ["Share you would give for the same money then", "Amount ÷ (B + amount)", "______ %"],
          ["**Ownership saved by waiting**", "Difference between the two shares", "______ %"],
        ] },
        { kind: "p", text: "Valuations change with the market and your sector. [Validate: typical pre-seed and seed valuations and cheque sizes for Indian startups in my sector] Read [startup funding questions for first-time founders](/startup-funding-questions-for-first-time-founders-in-india) before you discuss terms." },
        { kind: "callout", title: "When raising early is right", text: "If your idea needs a long build before any sale (a hardware product, a regulated health or finance product) or a funded competitor is about to take the market, early money can be worth the share you give. Then raise only what gets you to the next proof point." },
      ],
    },
    {
      type: "rich",
      heading: "Timing by type of money",
      blocks: [
        { kind: "list", items: [
          "**Bank loans (MUDRA, CGTMSE, PMEGP):** after a few months of steady sales in a business account. Banks look at repayment, not vision.",
          "**Startup India Seed Fund and state grants:** after DPIIT recognition and a prototype or pilot; apply early because selection takes time.",
          "**Angels:** after repeat customers and a clear growth trend; start conversations a few months before you need the money.",
          "**Venture capital:** after strong, repeatable growth; begin building relationships long before you ask.",
          "**Family money:** any time, but only with written terms and an amount the family can afford to lose.",
        ] },
        { kind: "h3", text: "Mistakes Indian founders make with timing" },
        { kind: "list", items: [
          "Quitting a job and raising before a single paying customer.",
          "Starting the fundraise with only weeks of cash left.",
          "Taking money from the first relative or local businessman who offers, at any terms.",
          "Raising a big round for a business that should borrow from a bank.",
          "Paying \"funding consultants\" upfront to find investors or grants.",
        ] },
      ],
    },
    {
      type: "quiz",
      heading: "Readiness check",
      intro: "Tick what is true today.",
      items: [
        "Strangers have paid me and some came back.",
        "I know my profit per order and my cost to win a customer.",
        "I can list exactly what the money will buy and what it will prove.",
        "I have several months of runway left.",
        "My company structure fits the money I want.",
        "My papers and bank statements are clean and separate.",
        "I have a CA or lawyer to read any term sheet or loan agreement.",
      ],
      result: "Fewer than six ticks? Spend the next month closing the gaps; you will raise on better terms.",
    },
    { type: "dbfaq", heading: "Funding questions founders ask", intro: "Real questions from our published idea guides. More on our [founder FAQ page](/faq).", categories: ["web-and-app-service-business-ideas", "food-processing-business-ideas", "small-manufacturing-business-ideas", "e-commerce-selling-business-ideas", "education-business-ideas", "home-based-business-ideas", "agriculture-and-farming-business-ideas", "health-and-wellness-business-ideas"], match: "(loan|fund|investor|investment|capital|mudra|scheme)", limit: 8 },
    { type: "sources", heading: "Sources", items: [SRC.dpiit, SRC.seedFund, SRC.mudra, SRC.cgtmse, SRC.pmegp, SRC.sidbi, SRC.mca, SRC.budget2024] },
    {
      type: "chips",
      heading: "Related questions",
      items: [
        { label: "How to raise funds for a startup", href: "/how-to-raise-funds-for-a-startup-in-india" },
        { label: "How to calculate cash runway", href: "/how-to-calculate-cash-runway-for-a-small-business-in-india" },
        { label: "Startup funding questions", href: "/startup-funding-questions-for-first-time-founders-in-india" },
        { label: "Product-market fit", href: "/how-to-know-if-your-business-has-product-market-fit-in-india" },
        { label: "How to find a co-founder", href: "/how-to-find-a-co-founder-for-a-startup-in-india" },
      ],
    },
    { ...CTA, heading: "Raise when proof is in your hands, not before.", body: "Check your readiness this week, then test the biggest risk in your plan, free." },
    TOOLS,
    {
      type: "takeaways",
      heading: "In short",
      items: [
        "Raise when more money clearly turns into more customers, not to find out whether customers exist.",
        "Start conversations months before you need the money; never raise with weeks of runway.",
        "Borrow for assets that earn; sell shares only when speed is worth the ownership.",
      ],
    },
  ],
};
