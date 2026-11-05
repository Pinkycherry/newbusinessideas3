import type { TopicPage } from "@/bought/topic-page";
import { PARENT, UPDATED, UPDATED_ON, IMG, TOOLS, CTA } from "./topic-pages-shared";

/** Seller layout: guide (/avoid-startup-failure). */
export const mistakes: TopicPage = {
  slug: "common-mistakes-to-avoid-when-starting-a-business-in-india",
  updated: UPDATED_ON,
  sellerRef: "https://ideaproof.io/avoid-startup-failure",
  parent: PARENT,
  seo: {
    title: "Common Mistakes to Avoid When Starting a Business in India",
    description: "The seven validation mistakes first-time founders in India make most often, the red flags to check today, and a 14-day plan to test your idea before you spend.",
  },
  hero: {
    eyebrow: "Startup mistakes to avoid",
    h1: "Common Mistakes to Avoid When Starting a Business in India",
    highlight: "Mistakes",
    intro: "Most businesses do not fail on launch day. They fail months earlier, on a day the founder skipped one honest check. Here are the traps, and how you catch each one early.",
    updated: UPDATED,
    primary: { label: "See the 7 mistakes", href: "#mistakes" },
    secondary: { label: "Indian startup failures", href: "/failed-startups/india" },
    image: IMG.hub,
    imageAlt: "A founder reviewing what went wrong in a business plan",
  },
  sections: [
    {
      type: "takeaways",
      heading: "What failed founders tell us",
      intro: "From the post-mortems in our [India failure research](/failed-startups/india) and [why startups fail](/why-startups-fail-2026-2027):",
      items: [
        "They built first and asked buyers later.",
        "They trusted praise from family and friends over money from strangers.",
        "They set a price that did not cover delivery, GST, platform fees or their own time.",
        "They spent on ads, rent or an app before one customer came back for a second order.",
      ],
    },
    {
      type: "cards",
      heading: "The hard truth",
      items: [
        { title: "Your idea is not the risk", body: "Your untested guesses are. Who pays, how much, how often and how you reach them: each one is a guess until someone pays." },
        { title: "Savings run out quietly", body: "Rent, salaries and EMIs keep going whether or not orders come. That is why testing small first protects your family's money." },
        { title: "Stopping early is not failure", body: "Closing a weak idea after two weekends is cheaper than closing a shop after two years." },
      ],
    },
    {
      type: "steps",
      heading: "The prevention ladder",
      intro: "Climb one rung at a time. Do not skip to the top.",
      items: [
        { title: "Problem", body: "Real people near you have this problem and already spend money or time on it." },
        { title: "Buyer", body: "You can name who pays and where to find them." },
        { title: "Price", body: "They pay a price that covers your cost, GST where it applies, and your time." },
        { title: "Repeat", body: "Some come back, or tell others, without you pushing." },
        { title: "Scale", body: "Only now spend on rent, staff, ads or an app." },
      ],
    },
    {
      type: "list",
      heading: "7 validation mistakes and how to catch them",
      items: [
        { title: "1. Asking family instead of buyers", body: "Your family wants you to be happy. Catch it: talk to ten strangers who fit your buyer line. See [customer interviews](/how-to-talk-to-customers-before-starting-a-business-in-india)." },
        { title: "2. Counting likes as demand", body: "Reels and likes cost nothing. Catch it: ask for a ₹100 UPI advance or a pre-order." },
        { title: "3. Pricing from the competitor, not your cost", body: "The shop next door may have no rent or family labour. Catch it: build your price in the [first-price workbench](/business-pricing-india)." },
        { title: "4. Forgetting GST, fees and delivery", body: "Marketplace commission, payment fees, packing and delivery can eat the margin. Catch it: check [unit economics](/unit-economics-india) on one order." },
        { title: "5. Signing rent before testing", body: "A lease and deposit lock you in. Catch it: test with a stall, home kitchen, shared space or online catalogue first." },
        { title: "6. Building the app before the service", body: "Many Indian buyers are happy to order on WhatsApp. Catch it: run the service manually first. See [how to build an MVP](/how-to-build-an-mvp-with-low-investment-in-india)." },
        { title: "7. Ignoring what it costs to find each buyer", body: "Ads and commissions add up. Catch it: work out your [customer acquisition cost](/what-is-customer-acquisition-cost-for-a-small-business-in-india) before you scale." },
      ],
    },
    {
      type: "steps",
      heading: "The 14-day validation sprint",
      items: [
        { title: "Days 1–2: write your buyer line and your guesses", body: "Who pays, what price, how often, how you will reach them.", check: "Write your top three guesses on paper." },
        { title: "Days 3–6: ten conversations", body: "Meet buyers where they are: market, society group, office canteen, wholesale lane." },
        { title: "Days 7–9: ask for a commitment", body: "UPI advance, pre-order, trial agreement, shelf space." },
        { title: "Days 10–13: one small paid test", body: "A batch, a stall, a client, a class. Real price, real delivery." },
        { title: "Day 14: decide", body: "Continue, change one thing, or stop. Use [pivot or stop](/business-idea-pivot-or-stop) to decide calmly." },
      ],
    },
    {
      type: "quiz",
      heading: "10 red flags to check today",
      intro: "Tick each one that is true. Every tick is a mistake you have already avoided.",
      items: [
        "I have spoken to at least ten possible buyers who are not friends or family.",
        "Someone outside my family has paid me, even a small amount.",
        "I know my cost for one order or one unit.",
        "My price covers GST if it applies to me, fees and delivery.",
        "I know where my next ten buyers will come from.",
        "I have not signed a lease or bought machines yet, or I have proof I need them.",
        "I know how many months my savings can cover.",
        "My family knows the plan and the amount at risk.",
        "I have decided what result would make me stop.",
        "At least one buyer has come back or referred someone.",
      ],
      result: "Fewer than seven ticks? Fix those first, before spending more.",
    },
    {
      type: "list",
      heading: "What founders get wrong about validation",
      items: [
        { title: "\"Validation takes months\"", body: "Two weekends of honest testing is enough to know if you should continue." },
        { title: "\"I need a finished product first\"", body: "You need something you can show, sell or deliver by hand." },
        { title: "\"Someone will copy my idea\"", body: "Most ideas are already being done somewhere. Your edge is doing it well for your buyers." },
        { title: "\"A survey is enough\"", body: "People say yes on forms. Watch what they pay for." },
      ],
    },
    {
      type: "cards",
      heading: "Founders who caught the mistake early",
      intro: "Everyday situations, not famous stories.",
      items: [
        { title: "The cake order that did not cover the cost", body: "A home baker in Indore noticed every order earned less than the cream, box and delivery cost. She raised the price and lost a few buyers but started earning." },
        { title: "The coaching batch that never filled", body: "A teacher in Patna planned rent for a classroom, ran a free demo first, and found parents wanted evening online batches instead. No rent needed." },
        { title: "The reseller who checked fees", body: "A Surat saree reseller counted marketplace commission and returns on ten orders before ordering bulk stock, and moved to WhatsApp orders for repeat buyers." },
      ],
    },
    {
      type: "chips",
      heading: "Failures that could have been prevented",
      items: [
        { label: "Indian startup failure research", href: "/failed-startups/india" },
        { label: "Why startups fail", href: "/why-startups-fail-2026-2027" },
        { label: "Business idea risk check", href: "/business-idea-risk-check" },
      ],
    },
    TOOLS,
    {
      type: "faq",
      heading: "Frequently asked questions",
      items: [
        { q: "What is the most common startup mistake in India?", a: "Building or spending before checking that strangers will pay. Talk to buyers and take a small advance first." },
        { q: "How many customers should I talk to before starting?", a: "Start with ten people who fit your buyer line. If most describe the same problem and some agree to pay, keep going." },
        { q: "Should I quit my job to test my idea?", a: "Usually not. Most of the 14-day sprint fits evenings and weekends. Quit when the numbers, not the excitement, say so." },
        { q: "Do I need to register before testing?", a: "For a tiny test, often not. Before regular selling, check Udyam, GST and any local licence (FSSAI for food, for example) that applies to you." },
      ],
    },
    { ...CTA, heading: "Run the 14-day sprint, not the risk." },
  ],
};
