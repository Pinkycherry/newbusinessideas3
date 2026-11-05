import type { TopicPage } from "@/bought/topic-page";
import { PARENT, UPDATED, IMG, SRC, CALCS, CTA } from "./topic-pages-shared";

/**
 * New page 23. Seller reference: question page (/questions/how-to-reduce-churn).
 * Composition (own to this page): reasons customers leave as cards first, a self-diagnosis,
 * a sector playbook, ready-to-send message scripts, a 30-day plan. No researched figures.
 */
export const retention: TopicPage = {
  slug: "how-to-keep-customers-coming-back-to-your-small-business-in-india",
  updated: "2026-11-05",
  sellerRef: "https://ideaproof.io/questions/how-to-reduce-churn",
  parent: PARENT,
  explore: { guideCategory: "Growth & PMF", categories: ["salon-and-grooming-business-ideas", "home-kitchen-food-business-ideas", "tuition-and-coaching-business-ideas", "fitness-and-gym-business-ideas", "retail-shop-business-ideas", "laundry-and-garment-care-business-ideas", "reselling-business-ideas", "pet-care-business-ideas"] },
  seo: {
    title: "How to Keep Customers Coming Back to Your Small Business in India",
    description: "Why customers stop buying from Indian small businesses and how to win them back: the real reasons (timing, quality slips, no follow-up, credit fights), a quick self-diagnosis, sector playbooks, WhatsApp message scripts and a 30-day retention plan.",
  },
  hero: {
    eyebrow: "Customer retention",
    h1: "How to Keep Customers Coming Back to Your Small Business in India",
    highlight: "Keep Customers Coming Back",
    intro: "Winning a new customer takes effort, offers and often money. Keeping one takes attention. In Indian neighbourhoods, people stay with a shop, a tutor, a tailor or a tiffin aunty for years, until one bad week, a rude word or a forgotten order sends them elsewhere, usually without saying why. This page helps you find out why customers quietly leave, and what to do so they don't.",
    updated: UPDATED,
    primary: { label: "Find why they leave", href: "#check" },
    secondary: { label: "Customer lifetime value", href: "/how-to-calculate-customer-lifetime-value-for-a-small-business-in-india" },
    image: IMG.validation,
    imageAlt: "A shopkeeper greeting a regular customer",
  },
  sections: [
    {
      type: "cards",
      heading: "Why customers quietly stop buying",
      intro: "Almost nobody tells you they are leaving. These are the reasons founders hear when they finally ask.",
      items: [
        { title: "One late or wrong order", body: "Late lunch, wrong size, missing item. Forgiven once; twice and they try someone else." },
        { title: "Quality slipped", body: "A cheaper ingredient, a new helper, a rushed job. Regulars notice before you do." },
        { title: "Nobody followed up", body: "No reminder for the next service, no message when new stock came. Out of sight, out of mind." },
        { title: "A credit argument", body: "Chasing udhaar rudely, or a dispute over a bill, ends many long relationships." },
        { title: "Price went up without a reason", body: "People accept a fair increase when you explain it; a silent jump feels like being cheated." },
        { title: "A competitor made it easier", body: "Home delivery, evening slots, UPI, an app. Convenience wins in busy households." },
      ],
    },
    {
      type: "quiz",
      heading: "Quick diagnosis",
      intro: "Tick what is true for your business. Each unticked line is a leak.",
      items: [
        "I know which of last month's customers did not come back this month.",
        "I have called at least three of them to ask why.",
        "Orders go out on time almost every day.",
        "Quality is the same whether I am there or a helper is.",
        "I message past customers when something new is available.",
        "I explain price changes before they happen.",
        "Credit is handled politely, with clear limits agreed upfront.",
      ],
      result: "Fewer than five ticks? Pick the first unticked line and fix it this week.",
    },
    {
      type: "rich",
      heading: "Playbook by business type",
      blocks: [
        { kind: "h3", text: "Tiffin and home food" },
        { kind: "p", text: "Rotate the weekly menu, deliver before the lunch break every day, and send the next week's menu on Saturday. Ask office groups for feedback every month. A simple \"skip a day\" option keeps people who travel." },
        { kind: "h3", text: "Salon and beauty" },
        { kind: "p", text: "Note each client's last service and send a reminder when the next one is due. Keep the same stylist for regulars. Offer a family package. Bridal clients bring sisters and friends if you treat them well." },
        { kind: "h3", text: "Tuition and coaching" },
        { kind: "p", text: "Share progress with parents every month, not just at exam time. Offer the next class or subject before the current year ends. Siblings are your best new students." },
        { kind: "h3", text: "Kirana and retail" },
        { kind: "p", text: "Keep the items regulars buy always in stock, take WhatsApp orders for home delivery, and manage udhaar with dignity: written limits and a polite collection day." },
        { kind: "h3", text: "Online sellers" },
        { kind: "p", text: "Pack carefully, deliver on time, and save every buyer to a WhatsApp list. Share new collections there first. A small thank-you note in the parcel brings more repeat orders than another discount." },
        { kind: "h3", text: "Repair and home services" },
        { kind: "p", text: "Offer an annual maintenance plan, send a reminder before the next service, and always give a written estimate. Being on time is your strongest marketing." },
      ],
    },
    {
      type: "rich",
      heading: "Messages you can send today",
      intro: "Short, warm and personal. Change the words to how you speak.",
      blocks: [
        { kind: "callout", title: "To a customer who stopped coming", text: "Hello, this is ______ from ______. We missed you this month. Was something not right last time? Please tell me honestly, I want to fix it." },
        { kind: "callout", title: "Before the next service is due", text: "Hello ______, it has been ______ weeks since your last ______. Shall I book you for this week? Evening slots are open." },
        { kind: "callout", title: "Before a price change", text: "Dear customers, from ______ our price for ______ will be ₹ ______ because ______ costs have gone up. Quality and timing stay the same. Thank you for staying with us." },
        { kind: "callout", title: "Polite credit reminder", text: "Hello ______, a small reminder that ₹ ______ is pending from ______. You can pay by UPI on this number whenever convenient this week. Thank you." },
        { kind: "p", text: "For tone that suits your city and language, the Validate button can rewrite these in everyday local language. [Validate: how small businesses in my city usually word customer follow-up messages in my language]" },
      ],
    },
    {
      type: "table",
      heading: "Your 30-day retention plan",
      columns: ["Week", "What you do", "What you write down"],
      rows: [
        ["1", "List last month's customers; mark who did not return", "Names and last order date"],
        ["1", "Call or message three who left", "Their exact reasons"],
        ["2", "Fix the most common reason", "What you changed"],
        ["2", "Start a WhatsApp broadcast list of past buyers", "Number of contacts"],
        ["3", "Send one useful update (new item, menu, slot)", "Replies and orders"],
        ["3", "Add a small thank-you on repeat orders", "Who reordered"],
        ["4", "Compare repeat customers with last month", "Better or worse, and why"],
      ],
    },
    { type: "dbfaq", heading: "Questions about keeping customers", intro: "Real questions from our published idea guides. More on our [founder FAQ page](/faq).", categories: ["salon-and-grooming-business-ideas", "home-kitchen-food-business-ideas", "tuition-and-coaching-business-ideas", "fitness-and-gym-business-ideas", "retail-shop-business-ideas", "reselling-business-ideas", "home-based-business-ideas", "local-service-business-ideas"], match: "(regular|repeat|loyal|retain|keep customers|come back|feedback|complain)", limit: 8 },
    {
      type: "chips",
      heading: "Related questions",
      items: [
        { label: "How to calculate customer lifetime value", href: "/how-to-calculate-customer-lifetime-value-for-a-small-business-in-india" },
        { label: "What is customer acquisition cost?", href: "/what-is-customer-acquisition-cost-for-a-small-business-in-india" },
        { label: "Product-market fit", href: "/how-to-know-if-your-business-has-product-market-fit-in-india" },
        { label: "How to talk to customers", href: "/how-to-talk-to-customers-before-starting-a-business-in-india" },
        { label: "Competitor analysis", href: "/how-to-do-competitor-analysis-for-a-small-business-in-india" },
      ],
    },
    { type: "sources", heading: "Sources", items: [{ label: "WhatsApp Business", href: "https://business.whatsapp.com/", note: "Broadcast lists, labels and quick replies." }, { label: "Google Business Profile", href: "https://www.google.com/business/", note: "Free listing where regulars leave reviews." }, SRC.npci, { label: "Department of Consumer Affairs", href: "https://consumeraffairs.nic.in/", note: "Consumer rights and fair trade practices." }] },
    { ...CTA, heading: "Keep the customers you already have.", body: "Call three customers who stopped buying this week. Then check the biggest risk in your business, free." },
    CALCS,
  ],
};
