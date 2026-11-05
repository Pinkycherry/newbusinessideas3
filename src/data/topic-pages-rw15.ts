import type { TopicPage } from "@/bought/topic-page";
import { PARENT, UPDATED, UPDATED_ON, IMG, SRC, TOOLS, CTA } from "./topic-pages-shared";

const CONSUMER = { label: "Department of Consumer Affairs", href: "https://consumeraffairs.nic.in/", note: "Consumer protection rules, including those for e-commerce sellers." };
const INDIAMART = { label: "IndiaMART", href: "https://www.indiamart.com/", note: "B2B supplier and seller listings across India." };
const IPINDIA = { label: "Intellectual Property India: trademark search", href: "https://ipindia.gov.in/", note: "Check whether a brand name is already registered." };

/**
 * Rewrite 15 (owner review: previous version failed as thin and generic).
 * Seller layout: tool landing (/competitor-analysis). Seller sections kept in order:
 * 3 steps, why it matters, what to compare, FAQ, continue, tools, CTA, deeper answers, sources.
 * No researched figures: every number is a [Validate: ...] marker or a blank the reader fills in.
 */
export const competitors: TopicPage = {
  slug: "how-to-do-competitor-analysis-for-a-small-business-in-india",
  updated: UPDATED_ON,
  sellerRef: "https://ideaproof.io/competitor-analysis",
  parent: PARENT,
  explore: { guideCategory: "Market Sizing", categories: ["retail-shop-business-ideas", "home-kitchen-food-business-ideas", "salon-and-grooming-business-ideas", "tuition-and-coaching-business-ideas", "e-commerce-selling-business-ideas", "local-service-business-ideas", "restaurant-and-eatery-business-ideas", "trading-and-wholesale-business-ideas"] },
  seo: {
    title: "How to Do Competitor Analysis for a Small Business in India: Visit, Buy, Compare and Find the Gap",
    description: "Study your competitors the practical Indian way: list every option your buyer uses (including the unorganised one), buy from each, read Google Maps and marketplace reviews, compare price, quality, delivery, credit and trust, and find the gap you can fill. Comparison sheet, examples and a 7-day plan.",
  },
  hero: {
    eyebrow: "Competitor analysis",
    h1: "How to Do Competitor Analysis for a Small Business in India",
    highlight: "Competitor Analysis",
    intro: "Your biggest competitor might not be a brand at all. It might be the aunty two streets away who has cooked for the colony for years, the shop that gives credit to everyone, the cousin who does the accounts for free, or simply the buyer doing it themselves. Competitor analysis is not a fancy report. It is walking the market, buying from everyone your buyer uses today, listening to what annoys them, and finding the one thing you can do clearly better.",
    sub: "This page gives you three steps, a comparison sheet you can fill on your phone, what to look for in a metro, a small town and a village, and the mistakes founders make when they copy competitors.",
    updated: UPDATED,
    primary: { label: "Start in 3 steps", href: "#three-simple-steps-to-study-your-competitors" },
    secondary: { label: "Check my idea", href: "/how-to-check-if-your-business-idea-is-good-in-india" },
    image: IMG.validation,
    imageAlt: "A founder visiting local competitors",
  },
  sections: [
    {
      type: "rich",
      heading: "Three simple steps to study your competitors",
      blocks: [
        { kind: "h3", text: "Step 1: List everyone your buyer uses today" },
        { kind: "p", text: "Ask your buyers, \"Where do you get this today?\" and write every answer. Then search yourself. Your list should include:" },
        { kind: "list", items: [
          "**Organised competitors:** shops, brands, chains, coaching institutes, salons with a signboard.",
          "**Unorganised competitors:** home cooks, home tutors, the local tailor, the press-wala, the mechanic under the tree. They are often the strongest.",
          "**Online competitors:** marketplace sellers on Amazon, Flipkart, Meesho; delivery apps; Instagram pages; ONDC sellers.",
          "**B2B suppliers** for trade businesses: check [IndiaMART](https://www.indiamart.com/) and the wholesale lane.",
          "**Doing it themselves** or doing without: often the real competitor for new ideas.",
        ] },
        { kind: "p", text: "Search Google Maps and JustDial for your area, marketplaces for your product, and Instagram hashtags with your city name. Pick the five that buyers mention most." },
        { kind: "h3", text: "Step 2: Visit, buy and ask" },
        { kind: "p", text: "Buy from each one as an ordinary customer. Note the price, quality, packing, delivery or waiting time, payment options (UPI, cash, credit, cash on delivery), how they treat you, their timings, and how they follow up. Read their last fifty Google Maps and marketplace reviews and note every complaint. Talk to their customers outside the shop if you can: \"Why do you come here?\" and \"What would you change?\"" },
        { kind: "h3", text: "Step 3: Find the gap you can fill" },
        { kind: "p", text: "Look for the complaint that comes up again and again: late delivery, no evening slots, no regional language, poor hygiene, rude staff, no home visit, no small pack size, no credit, too much credit pressure, no bill for GST. The gap their buyers complain about is your opening. Write it as one sentence: \"Unlike others in this area, I will ______.\" Then test it with [ten buyer conversations](/how-to-talk-to-customers-before-starting-a-business-in-india)." },
        { kind: "callout", title: "Be a fair competitor", text: "Buying as a customer and reading public reviews is normal research. Do not copy their brand name, logo or photos, and do not post fake reviews. Check your own brand name on the [trademark search](https://ipindia.gov.in/) before you print anything." },
      ],
    },
    {
      type: "rich",
      heading: "Why competitor analysis matters for a small business",
      blocks: [
        { kind: "list", items: [
          "**It tells you the price buyers already accept in your area**, and whether your costs allow you to match it. [Validate: today's price range for this product or service in my area]",
          "**It shows you what buyers complain about**, so you can do it better from day one.",
          "**It stops you entering a lane that is already crowded and cheap**, where the only way to win is to lose money.",
          "**It reveals why buyers stay loyal** to an existing option: trust, credit, habit, location or a relationship. You must offer something stronger than that.",
          "**Banks and investors expect it.** Your [project report for a bank loan](/how-to-write-a-business-plan-for-a-bank-loan-in-india) and any pitch deck need a short competition section.",
        ] },
        { kind: "h3", text: "Mistakes Indian founders make with competitors" },
        { kind: "list", items: [
          "**Copying the competitor's price.** They may own their premises, use family labour or buy in bulk. Build your price from your own costs with the [first-price workbench](/business-pricing-india).",
          "**Saying \"we have no competition\".** Buyers always use something today, even if it is doing nothing.",
          "**Ignoring the unorganised competitor**: the home cook, the local tutor, the cousin.",
          "**Starting a price war.** Cutting prices to win buyers from an established shop usually ends with both of you losing money.",
          "**Copying everything instead of picking one gap.** You cannot be cheaper, better and faster at once.",
          "**Opening next to the busiest competitor without a reason** buyers can see.",
        ] },
      ],
    },
    {
      type: "rich",
      heading: "What to compare for each competitor",
      blocks: [
        { kind: "table", columns: ["Compare", "How to find out", "What it tells you"], rows: [
          ["Price", "Buy or ask; check marketplace listings and menus", "The range buyers accept"],
          ["Quality", "Try the product or service yourself", "Where you can be better"],
          ["Delivery and timing", "Order and note the time; check opening hours", "A service gap you can fill"],
          ["Payment options", "UPI, cash, credit, COD, monthly billing", "What buyers in your area expect"],
          ["Reviews", "Google Maps, marketplace ratings, society group chatter", "The most common complaints"],
          ["Location and reach", "Walk the area; check delivery radius", "Where they do not reach"],
          ["Language and personal touch", "Listen to how they talk to buyers", "Whether a language or style gap exists"],
          ["Trust", "How long they have been there, who recommends them", "Why buyers stay with them"],
        ] },
        { kind: "h3", text: "Your competitor comparison sheet" },
        { kind: "table", columns: ["", "Competitor 1", "Competitor 2", "Competitor 3", "You (plan)"], rows: [
          ["Name and type", "______", "______", "______", "______"],
          ["Price for the same item", "₹ ______", "₹ ______", "₹ ______", "₹ ______"],
          ["Quality (1–5)", "______", "______", "______", "______"],
          ["Delivery or waiting time", "______", "______", "______", "______"],
          ["Credit or payment terms", "______", "______", "______", "______"],
          ["Top complaint in reviews", "______", "______", "______", "—"],
          ["Why buyers stay", "______", "______", "______", "—"],
          ["My gap", "—", "—", "—", "______"],
        ] },
        { kind: "h3", text: "What to look for by place" },
        { kind: "list", items: [
          "**Metros:** many organised competitors and apps; look for gaps in timing, neighbourhood focus, quality and personal service that big players miss.",
          "**Tier 2 cities:** a few well-known local names dominate; look at what younger buyers or new colonies are not getting.",
          "**Tier 3 towns:** competitors are often relatives or long-time families; trust and credit are their strength. Win with reliability and a clear new benefit, not a price war.",
          "**Villages:** the competitor may be the nearest town's market. Your gap is often simply being nearer, on a fixed day.",
        ] },
        { kind: "h3", text: "What to look for by sector" },
        { kind: "list", items: [
          "**Food:** taste, hygiene, portion, packaging, delivery time, FSSAI display.",
          "**Coaching:** results claims, batch size, teacher attention, timings, fee instalments.",
          "**Retail:** range, stock availability, credit, home delivery, bill with GST.",
          "**Online selling:** listing quality, ratings, returns policy, delivery speed, price after discounts. [Validate: current price and rating of top sellers for my product on the marketplace I use]",
          "**Services:** response time, punctuality, verified staff, fixed pricing, follow-up.",
        ] },
      ],
    },
    { type: "dbfaq", heading: "Competition questions founders ask", intro: "Real questions from our published idea guides about competitors and standing out. More on our [founder FAQ page](/faq).", categories: ["retail-shop-business-ideas", "home-kitchen-food-business-ideas", "salon-and-grooming-business-ideas", "tuition-and-coaching-business-ideas", "e-commerce-selling-business-ideas", "local-service-business-ideas", "restaurant-and-eatery-business-ideas", "home-based-business-ideas"], match: "(compet|rival|other shops|differen|stand out|unique|crowded|market)", limit: 10 },
    {
      type: "rich",
      heading: "Continue your journey",
      blocks: [
        { kind: "h3", text: "Real situations from India" },
        { kind: "list", items: [
          "**Tiffin service, Bengaluru:** the competitors were three home cooks and two apps. Reviews showed late lunches were the top complaint. She promised delivery before a fixed time and won office buyers.",
          "**Coaching centre, Kota-style town in Rajasthan:** big institutes had huge batches. A small centre offered batches with personal doubt sessions and fee instalments, and filled quickly.",
          "**Saree reseller, Surat:** marketplace sellers competed on price. She competed on styling videos and WhatsApp advice in Gujarati, and kept her price.",
          "**Bike repair, Madurai:** the local mechanic gave credit and trust. A new garage offered pickup and drop and a written estimate, and won working customers who had no time.",
        ] },
        { kind: "h3", text: "What to do this week" },
        { kind: "table", columns: ["Day", "Task"], rows: [
          ["Day 1", "Ask five buyers where they buy today; list every option"],
          ["Day 2", "Search Google Maps, JustDial, marketplaces and Instagram for your area; pick five"],
          ["Day 3", "Buy from two competitors; fill their columns in the sheet"],
          ["Day 4", "Buy from the other three; read their reviews"],
          ["Day 5", "Talk to a few of their customers about why they stay and what they would change"],
          ["Day 6", "Write your one-sentence gap; check costs with the [first-price workbench](/business-pricing-india)"],
          ["Day 7", "Test the gap with buyers and run the [free risk check](/business-idea-risk-check)"],
        ] },
        { kind: "list", items: [
          "**Talk to customers:** ask buyers why they use your competitors. [How to talk to customers](/how-to-talk-to-customers-before-starting-a-business-in-india)",
          "**Size your market:** how many buyers are left for you. [TAM, SAM and SOM](/how-to-calculate-tam-sam-som-for-a-business-in-india)",
          "**Set your first price:** price against competitors without losing money. [First-price workbench](/business-pricing-india)",
        ] },
      ],
    },
    TOOLS,
    { ...CTA, heading: "Ready to study your competition?", body: "Pick five competitors, buy from each this week, and note every complaint you hear. Then run the free risk check." },
    {
      type: "chips",
      heading: "Deeper answers founders ask for",
      items: [
        { label: "Business idea research", href: "/business-idea-research-india" },
        { label: "Market research", href: "/market-research" },
        { label: "Competitor analysis framework", href: "/startup-guides/competitor-analysis-framework" },
        { label: "Common mistakes to avoid", href: "/common-mistakes-to-avoid-when-starting-a-business-in-india" },
        { label: "Customer acquisition cost", href: "/what-is-customer-acquisition-cost-for-a-small-business-in-india" },
        { label: "Business models compared", href: "/business-models-india" },
        { label: "Retail shop business ideas", href: "/category/retail-shop-business-ideas" },
      ],
    },
    { type: "sources", heading: "Sources", items: [INDIAMART, SRC.ondc, SRC.gem, CONSUMER, IPINDIA, SRC.udyam, { label: "ASCI: advertising code for India", href: "https://www.ascionline.in/", note: "Rules for honest advertising and comparisons." }] },
  ],
};
