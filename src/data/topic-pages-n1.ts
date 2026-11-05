import type { TopicPage } from "@/bought/topic-page";
import { PARENT, UPDATED, UPDATED_ON, IMG, SRC, TOOLS, CALCS, CTA } from "./topic-pages-shared";

/**
 * New page 21. Seller reference: question page (/questions/what-is-runway).
 * Composition (own to this page): quick check first, then the worksheet, then situations as a table,
 * then the stretch plan as numbered steps. No researched figures; [Validate: ...] where a number is needed.
 */
export const runway: TopicPage = {
  slug: "how-to-calculate-cash-runway-for-a-small-business-in-india",
  updated: "2026-11-05",
  sellerRef: "https://ideaproof.io/questions/what-is-runway",
  parent: PARENT,
  explore: { guideCategory: "Launch & Ops", categories: ["retail-shop-business-ideas", "home-kitchen-food-business-ideas", "cloud-kitchen-business-ideas", "tuition-and-coaching-business-ideas", "small-manufacturing-business-ideas", "salon-and-grooming-business-ideas", "e-commerce-selling-business-ideas", "freelance-business-ideas"] },
  seo: {
    title: "How to Calculate Cash Runway for a Small Business in India (and Make It Last Longer)",
    description: "Cash runway in plain words: how many months your money lasts if sales stay where they are. Work it out from your bank balance, UPI history and udhaar register, see what shortens it in Indian businesses, and use a stretch plan before the money runs out.",
  },
  hero: {
    eyebrow: "Cash runway",
    h1: "How to Calculate Cash Runway for a Small Business in India",
    highlight: "Cash Runway",
    intro: "Runway is the number of months your business can keep paying its bills with the money it has today, if nothing changes. Most Indian small businesses do not close because the idea was bad. They close because the money ran out a few weeks before the sales came in. Knowing your runway turns that surprise into a date you can plan around.",
    sub: "Takes one evening, your bank app, your UPI history and your udhaar notebook.",
    updated: UPDATED,
    primary: { label: "Work out my runway", href: "#the-runway-worksheet" },
    secondary: { label: "Cash-flow calendar", href: "/startup-cash-flow-india" },
    image: IMG.metrics,
    imageAlt: "A shop owner checking how many months of cash are left",
  },
  sections: [
    {
      type: "quiz",
      heading: "Quick check: do you know your runway?",
      intro: "Tick what you can answer today without guessing.",
      items: [
        "I know how much cash the business has in the bank and in hand today.",
        "I know my fixed costs every month: rent, salaries, EMI, power, internet.",
        "I know how much I lose (or earn) in a normal month.",
        "I know how much customers owe me and when they will pay.",
        "I know which month of the year is slowest for my business.",
        "I keep business and household money in separate accounts.",
      ],
      result: "Fewer than four ticks? Fill the worksheet below tonight; it is the most useful hour you will spend this month.",
    },
    {
      type: "takeaways",
      heading: "Runway in one minute",
      items: [
        "**Runway (months) = cash you can use today ÷ monthly cash loss.** If you are not losing money, your runway is open-ended, but check slow months separately.",
        "**Use cash, not sales.** Udhaar that has not come in and stock on the shelf are not cash yet.",
        "**Monthly cash loss = money going out in a month − money coming in.** Take an average of the last three months, not your best month.",
        "**Count your own household draw.** If the family lives on this business, that draw is a monthly cost.",
        "**Below three months of runway, act this week**, not next month.",
      ],
    },
    {
      type: "rich",
      heading: "The runway worksheet",
      intro: "Fill it with your own figures. Take each line from a record, not from memory.",
      blocks: [
        { kind: "table", columns: ["Line", "Where to find it", "Your figure"], rows: [
          ["Cash in the business bank account", "Bank app balance today", "₹ ______"],
          ["Cash in hand and in the galla", "Count it", "₹ ______"],
          ["Minus: GST collected but not yet paid", "Your last GST return or your accountant", "− ₹ ______"],
          ["Minus: bills due this month you cannot delay", "Rent, salaries, EMI, supplier dues", "− ₹ ______"],
          ["**Usable cash (A)**", "Add and subtract the lines above", "₹ ______"],
          ["Average money in per month", "UPI + cash + bank receipts, last three months ÷ 3", "₹ ______"],
          ["Average money out per month", "Every payment, last three months ÷ 3, including your own draw", "₹ ______"],
          ["**Monthly cash loss (B)**", "Money out − money in (if negative, you are earning)", "₹ ______"],
          ["**Runway**", "A ÷ B", "______ months"],
          ["Udhaar likely to come in within a month", "Your credit register, only reliable payers", "₹ ______"],
          ["**Runway with collections**", "(A + udhaar) ÷ B", "______ months"],
        ] },
        { kind: "callout", title: "Two numbers, not one", text: "Write both runways. The first is what you can count on; the second is what happens if your customers pay on time. If the gap is large, collecting udhaar is your fastest way to buy time." },
        { kind: "p", text: "If you want to compare your costs with similar businesses in your town, run the Validate button for today's local rent and wage levels. [Validate: typical monthly rent and helper wages for my type of business in my city]" },
      ],
    },
    {
      type: "table",
      heading: "What shortens runway in Indian businesses",
      columns: ["Situation", "Why runway drops", "What to do early"],
      rows: [
        ["Festival stock (Diwali, Eid, wedding season)", "Cash goes into stock weeks before sales come", "Buy against advances; keep a stock limit"],
        ["Monsoon or exam months", "Footfall and orders fall while rent stays", "Build a buffer in the strong months"],
        ["B2B buyers paying late", "Work is done, money is stuck", "Part-advance, clear due dates, Udyam delayed-payment protection"],
        ["Delivery app payout cycle", "Money arrives days after the order", "Count the payout delay in money in"],
        ["New hire or second outlet", "Fixed costs jump before sales do", "Add only after three steady months"],
        ["Family emergency or function", "Business cash used for home needs", "Separate accounts; a small family emergency fund"],
        ["GST payment month", "Collected GST leaves the account", "Keep collected GST in a separate account"],
      ],
    },
    {
      type: "rich",
      heading: "How to stretch your runway",
      intro: "Do these in order. The first ones cost nothing.",
      blocks: [
        { kind: "steps", items: [
          { title: "Collect what is owed", body: "Call every customer on the udhaar list this week. Offer a small discount for paying in full by UPI today if needed. Stop new credit to anyone with an old bill pending." },
          { title: "Ask for advances", body: "Take part-payment upfront on custom orders, monthly plans and event bookings." },
          { title: "Delay what you can, honestly", body: "Ask suppliers for a longer credit period; ask the landlord whether rent can be split in two parts for a month." },
          { title: "Cut the cost that brings nothing back", body: "Pause ads and offers that do not bring repeat buyers. See [customer acquisition cost](/what-is-customer-acquisition-cost-for-a-small-business-in-india)." },
          { title: "Sell slow stock", body: "Clear old stock at cost to turn it into cash for fresh, faster-selling items." },
          { title: "Borrow only to bridge, not to hide a loss", body: "A working-capital limit or MUDRA loan helps when sales are coming; it makes things worse if every month loses money. Read [how to get funding for a small business](/how-to-get-funding-for-a-small-business-in-india)." },
          { title: "Decide calmly if nothing changes", body: "If runway keeps shrinking after these steps, use the [pivot or stop guide](/business-idea-pivot-or-stop) before savings go too." },
        ] },
        { kind: "h3", text: "Metro, small town and village" },
        { kind: "list", items: [
          "**Metros:** rent and salaries make monthly loss large; runway shrinks fast, so check it every month.",
          "**Tier 2 and tier 3 towns:** udhaar is usually the biggest runway killer; collections matter more than cost cuts.",
          "**Villages:** income comes in seasons (harvest, festivals); plan runway across the whole year, not month by month.",
        ] },
      ],
    },
    {
      type: "cards",
      heading: "Real situations from India",
      items: [
        { title: "Cloud kitchen, Pune", body: "Runway looked fine until they counted the delivery app's payout delay and GST due. Real runway was much shorter; they cut one paid ad channel and lasted until the festival rush." },
        { title: "Coaching centre, Nagpur", body: "Fees came in at the start of each term, rent every month. A term-wise cash plan showed the dry months clearly, so they started a short summer batch." },
        { title: "Garment unit, Tiruppur", body: "A big buyer paid late. After Udyam registration and a clear due date on invoices, payments became more regular and runway stopped swinging." },
        { title: "Kirana, a town in Odisha", body: "Most of the cash was in the udhaar notebook. A weekly collection day and a credit limit doubled the cash available within two months." },
      ],
    },
    { type: "dbfaq", heading: "Money and cash questions founders ask", intro: "Real questions from our published idea guides. More on our [founder FAQ page](/faq).", categories: ["retail-shop-business-ideas", "home-kitchen-food-business-ideas", "cloud-kitchen-business-ideas", "tuition-and-coaching-business-ideas", "small-manufacturing-business-ideas", "salon-and-grooming-business-ideas", "home-based-business-ideas", "food-business-ideas"], match: "(cash|money|profit|loss|cost|expense|working capital|credit|payment)", limit: 8 },
    {
      type: "rich",
      heading: "What to do this week",
      blocks: [
        { kind: "table", columns: ["Day", "Task"], rows: [
          ["Day 1", "Download three months of bank and UPI statements; count cash in hand"],
          ["Day 2", "Fill the worksheet; write both runway numbers"],
          ["Day 3", "Call everyone on the udhaar list"],
          ["Day 4", "Ask two suppliers and the landlord about payment terms"],
          ["Day 5", "Pause one cost that brings nothing back"],
          ["Day 6", "Mark your slowest months in the [cash-flow calendar](/startup-cash-flow-india)"],
          ["Day 7", "Set a monthly reminder to redo the worksheet"],
        ] },
      ],
    },
    { type: "sources", heading: "Sources", items: [SRC.udyam, { label: "MSME Samadhaan: delayed payment portal", href: "https://samadhaan.msme.gov.in/", note: "Micro and small enterprises can file against buyers who pay late." }, SRC.gst, SRC.mudra, { label: "RBI: Financial Education", href: "https://rbi.org.in/FinancialEducation/" }] },
    {
      type: "chips",
      heading: "Related questions",
      items: [
        { label: "Business numbers every small business should track", href: "/business-numbers-every-small-business-in-india-should-track" },
        { label: "How much money is needed to start a business?", href: "/how-much-money-is-needed-to-start-a-business-in-india" },
        { label: "How to start a business without investors", href: "/how-to-start-a-business-without-investors-in-india" },
        { label: "When to raise funds for a startup", href: "/when-to-raise-funds-for-a-startup-in-india" },
      ],
    },
    { ...CTA, heading: "Know the date before the money runs out.", body: "Fill the runway worksheet tonight, then check the biggest risk in your plan, free." },
    TOOLS,
    CALCS,
  ],
};
