import type { TopicPage } from "@/bought/topic-page";
import { PARENT, UPDATED, UPDATED_ON, IMG, SRC, TOOLS, CTA } from "./topic-pages-shared";

/**
 * Rewrite 3 (owner review: previous version failed as thin and generic).
 * Seller layout: guide (/avoid-startup-failure). Seller sections in order: what post-mortems tell us, the brutal truth,
 * the prevention pyramid, 7 fatal mistakes, 14-day validation sprint, 10 red flags, what founders get wrong,
 * founders who caught it early, failures that could have been prevented, explore tools, FAQ, CTA.
 */
export const mistakes: TopicPage = {
  slug: "common-mistakes-to-avoid-when-starting-a-business-in-india",
  updated: UPDATED_ON,
  sellerRef: "https://ideaproof.io/avoid-startup-failure",
  parent: PARENT,
  explore: { guideCategory: "Validation" },
  seo: {
    title: "Common Mistakes to Avoid When Starting a Business in India",
    description: "The mistakes first-time founders in India make most: family praise as demand, early rent, udhaar, wrong pricing, GST and marketplace fees, licences, family money. How to catch each one, a 14-day check, red flags and a worksheet.",
  },
  hero: {
    eyebrow: "Startup mistakes to avoid",
    h1: "Common Mistakes to Avoid When Starting a Business in India",
    highlight: "Mistakes",
    intro: "Most small businesses in India do not close because the idea was bad. They close because of a handful of avoidable decisions made in the first few months: a lease signed too early, a price copied from the shop next door, credit given to everyone, savings meant for something else. Every one of these can be caught with a cheap check before it costs you.",
    sub: "Each mistake below comes with the check that catches it, the Indian reality behind it, and what to do instead.",
    updated: UPDATED,
    primary: { label: "See the 7 mistakes", href: "#7-mistakes-indian-founders-make-and-how-to-catch-each-one" },
    secondary: { label: "Do the 14-day check", href: "#the-14-day-validation-sprint" },
    image: IMG.hub,
    imageAlt: "A founder reviewing what went wrong in a business plan",
  },
  sections: [
    {
      type: "rich",
      heading: "What failed founders tell us",
      blocks: [
        { kind: "p", text: "When Indian founders look back at a business that closed, the same few stories come up again and again in our [India startup failure research](/failed-startups/india) and in the patterns we track for [why startups fail](/why-startups-fail-2026-2027). The business was built before anyone paid for it. The founder trusted relatives' encouragement over strangers' wallets. The price looked fine until delivery, packing, platform fees and GST were added. The money ran out in a slow month, often around a festival or the monsoon, because there was no buffer." },
        { kind: "p", text: "We will not quote numbers we cannot source. [Data pending: share of new MSMEs that stop operating within a few years, and the main reasons, Ministry of MSME or SIDBI survey, 2026–27] What we can do is show you the decisions behind those stories, and how to check each one before it is too late." },
      ],
    },
    {
      type: "rich",
      heading: "The hard truth about starting up",
      blocks: [
        { kind: "list", items: [
          "**Your idea is rarely the risk. Your untested guesses are.** Who pays, how much, how often and how you reach them are all guesses until money changes hands.",
          "**Fixed costs keep running when sales do not.** Rent, salaries, EMIs and electricity arrive every month. A slow Shravan, an exam season or heavy rain can halve sales for weeks.",
          "**In India, closing costs more than money.** There is family pride, neighbours' talk and sometimes a guarantor's relationship at stake. That is exactly why testing small first protects you.",
          "**Stopping early is a good decision.** Closing a weak idea after two weekends is cheaper, and far less painful, than closing a shop after two years.",
        ] },
      ],
    },
    {
      type: "rich",
      heading: "The prevention ladder",
      intro: "Climb one rung at a time. Every rung you skip becomes a mistake you pay for later.",
      blocks: [
        { kind: "steps", items: [
          { title: "Problem", body: "Real people near you have this problem and already spend money or time on it. Check with [ten buyer conversations](/how-to-talk-to-customers-before-starting-a-business-in-india)." },
          { title: "Buyer", body: "You can name who pays and where to find them in one line. See [how to validate a business idea](/how-to-validate-a-business-idea-in-india)." },
          { title: "Price", body: "They pay a price that covers every cost and your time. Build it in the [first-price workbench](/business-pricing-india)." },
          { title: "Repeat", body: "Some buyers come back or bring others without being pushed. See [product-market fit](/how-to-know-if-your-business-has-product-market-fit-in-india)." },
          { title: "Scale", body: "Only now spend on rent, staff, machines, ads or an app." },
        ] },
      ],
    },
    {
      type: "rich",
      heading: "7 mistakes Indian founders make, and how to catch each one",
      blocks: [
        { kind: "h3", text: "1. Taking family praise as demand" },
        { kind: "p", text: "Your mother, your cousins and your office friends will buy once, out of love, and tell you it is wonderful. That is not demand. **Catch it:** count only strangers who pay and then come back a second time. Talk to ten people who match your buyer line and ask about their past spending, not their opinion of your idea." },
        { kind: "h3", text: "2. Signing a lease and paying a deposit before testing" },
        { kind: "p", text: "In many Indian markets a shop deposit runs to several months of rent, and interiors are money you never get back. [Data pending: typical shop deposit in months and fit-out cost for a small shop in a metro and a tier 2 market, broker surveys, 2026–27] **Catch it:** test from home, a weekend stall, a shared shop or a cart for a few weeks first. Use the [weekend market stall check](/weekend-market-stall-profit-check)." },
        { kind: "h3", text: "3. Copying the competitor's price" },
        { kind: "p", text: "The shop next door may own its premises, use family labour and buy in bulk. Its price can be below your cost. **Catch it:** build your price from your own costs: material, packing, delivery, fees, GST where it applies, and a fair value for your hours. Then compare with the market. Our [competitor analysis guide](/how-to-do-competitor-analysis-for-a-small-business-in-india) shows how to study them properly." },
        { kind: "h3", text: "4. Forgetting fees, delivery and GST" },
        { kind: "p", text: "Delivery app commission, marketplace fees, payment charges, packaging, return shipping and GST can quietly turn a profitable item into a loss. [Data pending: typical commission range charged by food delivery and e-commerce marketplaces to small sellers in India, platform rate cards, 2026–27] **Catch it:** work out the profit on one real order with every deduction in the [unit economics guide](/unit-economics-india)." },
        { kind: "h3", text: "5. Giving udhaar to win customers" },
        { kind: "p", text: "Credit is expected in many Indian markets, and refusing it feels rude. But a notebook full of unpaid dues is cash you cannot use for stock. **Catch it:** set a credit limit and a fixed day for collection before you start. Take at least part payment upfront by UPI. Track money owed to you every month, as shown in [business numbers to track](/business-numbers-every-small-business-in-india-should-track)." },
        { kind: "h3", text: "6. Building the app or buying machines before the service works" },
        { kind: "p", text: "Many Indian buyers are perfectly happy ordering on WhatsApp or by phone. A manual version tells you what customers actually want before you spend on software or machinery. **Catch it:** run the business by hand first. See [how to build an MVP with low investment](/how-to-build-an-mvp-with-low-investment-in-india)." },
        { kind: "h3", text: "7. Using money that was meant for something else" },
        { kind: "p", text: "School fees, a sibling's wedding fund, a parent's medical savings or the family's gold are not test budgets. When a business uses them and slows down, the damage reaches the whole family. **Catch it:** agree a fixed test amount with your family in writing, and keep business and household money in separate bank accounts. If you need more, see [how to get funding for a small business](/how-to-get-funding-for-a-small-business-in-india)." },
        { kind: "h3", text: "Registration mistakes that cause trouble later" },
        { kind: "list", items: [
          "**Paying an agent for Udyam registration.** It is free on the [official Udyam portal](https://udyamregistration.gov.in/).",
          "**Selling food without FSSAI registration.** Every food business needs registration or a licence on [FoSCoS](https://foscos.fssai.gov.in/), depending on size.",
          "**Ignoring GST until a buyer or marketplace asks.** Check the [GST portal](https://www.gst.gov.in/) thresholds early; online sellers may need to register sooner than shops.",
          "**No shop and establishment registration** where your state requires it for premises.",
        ] },
      ],
    },
    {
      type: "rich",
      heading: "The 14-day validation sprint",
      intro: "Run this before you sign, buy or quit anything.",
      blocks: [
        { kind: "table", columns: ["Days", "What you do", "What you write down"], rows: [
          ["1–2", "Write your one-line buyer statement, your price and your pass mark", "\"Continue if...\" in one sentence"],
          ["3–6", "Ten conversations with buyers where they already are", "Their exact words about the problem and what they spend today"],
          ["7–9", "Ask for commitments: UPI advances, pre-orders, a trial order from a shop", "Names, amounts and dates"],
          ["10–13", "One small paid test at your real price: a batch, a stall, a class, a client job", "Orders, repeats, complaints, hours taken"],
          ["14", "Compare with your pass mark and decide: continue, change one thing, or stop", "Your decision and why"],
        ] },
        { kind: "p", text: "Use the [demand test planner](/business-demand-test-india) to set it up and the [pivot or stop guide](/business-idea-pivot-or-stop) on day 14." },
      ],
    },
    {
      type: "quiz",
      heading: "10 red flags to check today",
      intro: "Tick each statement that is true. Every unticked line is a mistake still waiting for you.",
      items: [
        "I have spoken to at least ten possible buyers who are not friends or family.",
        "Someone outside my family has paid me, even a small amount.",
        "I know my cost for one order or one unit, including packing and delivery.",
        "My price covers GST if it applies to me, platform fees and delivery.",
        "I know where my next ten buyers will come from.",
        "I have not signed a lease or bought machines yet, or I have proof I need them.",
        "I know how many months my savings can cover running costs.",
        "My family knows the plan and the amount at risk, and agreed to it.",
        "I have a written credit (udhaar) limit and collection day.",
        "I have decided what result would make me stop.",
      ],
      result: "Fewer than seven ticks? Fix those first, before spending more.",
    },
    {
      type: "rich",
      heading: "What founders get wrong about checking an idea",
      blocks: [
        { kind: "list", items: [
          "**\"Validation takes months.\"** Two weekends of honest testing are usually enough to know whether to continue.",
          "**\"I need a finished product first.\"** You need something you can show, sell or deliver by hand.",
          "**\"Someone will copy my idea.\"** Most ideas already exist somewhere. Your edge is serving your buyers better, nearer and more reliably.",
          "**\"A Google Form survey is enough.\"** People tick yes on forms. Watch what they pay for.",
          "**\"I'll get a loan, so the risk is the bank's.\"** The EMI is yours every month, and often a family member is the guarantor.",
        ] },
      ],
    },
    {
      type: "rich",
      heading: "Founders who caught the mistake early",
      intro: "Everyday Indian situations, written as examples. The figures they used are marked for research.",
      blocks: [
        { kind: "h3", text: "The cake order that lost money" },
        { kind: "p", text: "A home baker in Indore took 30 birthday-cake orders in a month and felt busy, but her account balance did not grow. When she costed one cake line by line (cream, box, gas, delivery rider) she found each order earned almost nothing. [Data pending: ingredient and packaging cost of a 1 kg cream cake for a home baker in Indore, local wholesale prices, 2026–27] She raised her price, lost a few price-sensitive buyers and began to earn." },
        { kind: "h3", text: "The coaching batch that never needed a classroom" },
        { kind: "p", text: "A teacher in Patna was about to rent a room for an evening batch. She ran a free demo first and learnt that parents wanted online evening batches after school, not another commute. She saved the rent and deposit entirely." },
        { kind: "h3", text: "The reseller who checked the fees" },
        { kind: "p", text: "A saree reseller in Surat counted marketplace commission, shipping and returns on her first ten orders before ordering bulk stock, then moved repeat buyers to WhatsApp orders where her margin was higher. See [how to validate an online selling business idea](/how-to-validate-an-online-selling-business-idea-in-india)." },
      ],
    },
    {
      type: "chips",
      heading: "Failures that could have been prevented",
      items: [
        { label: "Indian startup failure research", href: "/failed-startups/india" },
        { label: "Why startups fail", href: "/why-startups-fail-2026-2027" },
        { label: "Business idea risk check", href: "/business-idea-risk-check" },
        { label: "Is my business idea good?", href: "/how-to-check-if-your-business-idea-is-good-in-india" },
        { label: "Case studies", href: "/researched-case-studies" },
      ],
    },
    TOOLS,
    { type: "dbfaq", heading: "Frequently asked questions", intro: "Real questions from our published idea guides. More on our [founder FAQ page](/faq).", categories: ["home-based-business-ideas", "women-friendly-business-ideas", "village-and-small-town-business-ideas", "food-business-ideas", "reselling-business-ideas", "freelance-business-ideas"], match: "(mistake|risk|fail|avoid|problem|challenge|loss)", limit: 8 },
    {
      type: "rich",
      heading: "Your mistake-proofing worksheet and this week's plan",
      blocks: [
        { kind: "table", columns: ["Question", "Your answer"], rows: [
          ["Who exactly pays me, and where are they?", "__________"],
          ["What does one order cost me, with packing, delivery, fees and GST?", "₹ __________"],
          ["What is my price, and what does the nearest competitor charge?", "₹ ______ / ₹ ______"],
          ["How many months can my savings cover fixed costs?", "______ months"],
          ["What is my test budget, agreed with my family?", "₹ __________"],
          ["What is my udhaar limit and collection day?", "__________"],
          ["What result would make me stop?", "__________"],
        ] },
        { kind: "list", ordered: true, items: [
          "Today: fill the worksheet above honestly.",
          "This week: complete days 1–6 of the 14-day sprint.",
          "Before signing anything: tick at least seven of the ten red flags.",
          "Then run the [free risk check](/business-idea-risk-check).",
        ] },
      ],
    },
    { ...CTA, heading: "Run the 14-day check, not the risk.", body: "Two weeks of testing protects your savings, your family's trust and your confidence. Start with the free risk check." },
    { type: "sources", heading: "Sources", items: [SRC.udyam, { label: "FSSAI FoSCoS", href: "https://foscos.fssai.gov.in/" }, SRC.gst, SRC.msmeLimits, { label: "Ministry of MSME", href: "https://msme.gov.in/", note: "Schemes and MSME data." }] },
  ],
};
