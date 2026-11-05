import type { TopicPage } from "@/bought/topic-page";
import { PARENT, UPDATED, IMG, SRC, TOOLS, EXPLORE, CTA } from "./topic-pages-shared";

/**
 * New page 22. Seller reference: question page (/questions/what-is-ltv).
 * Composition (own to this page): opens with one customer's story, then the method as steps,
 * a business-by-business table, mistakes, a worksheet, a ladder to raise it, Q&A. No researched figures.
 */
export const ltv: TopicPage = {
  slug: "how-to-calculate-customer-lifetime-value-for-a-small-business-in-india",
  updated: "2026-11-05",
  sellerRef: "https://ideaproof.io/questions/what-is-ltv",
  parent: PARENT,
  explore: { guideCategory: "Growth & PMF", categories: ["home-kitchen-food-business-ideas", "salon-and-grooming-business-ideas", "tuition-and-coaching-business-ideas", "dairy-and-milk-product-business-ideas", "laundry-and-garment-care-business-ideas", "fitness-and-gym-business-ideas", "e-commerce-selling-business-ideas", "repair-and-maintenance-business-ideas"] },
  seo: {
    title: "How to Calculate Customer Lifetime Value for a Small Business in India",
    description: "Customer lifetime value in plain words for Indian small businesses: what one regular customer brings you over all the months they keep buying, how to work it out from your order book and UPI history, how it compares with what you spend to win them, and how to raise it.",
  },
  hero: {
    eyebrow: "Customer lifetime value",
    h1: "How to Calculate Customer Lifetime Value for a Small Business in India",
    highlight: "Customer Lifetime Value",
    intro: "Think of the aunty who has bought milk from the same dairy for years, or the family that gets every birthday cake from one home baker. One sale from them is small. Everything they buy over the years is large. Customer lifetime value (often called LTV or CLV) is that total, minus what it costs you to serve them. It tells you how much a regular customer is really worth, and how much you can sensibly spend to win the next one.",
    updated: UPDATED,
    primary: { label: "Work out my LTV", href: "#steps" },
    secondary: { label: "Customer acquisition cost", href: "/what-is-customer-acquisition-cost-for-a-small-business-in-india" },
    image: IMG.metrics,
    imageAlt: "A regular customer coming back to the same shop",
  },
  sections: [
    {
      type: "rich",
      heading: "One customer, many orders",
      blocks: [
        { kind: "p", text: "A tiffin service in Hyderabad gets a new office customer through a free trial and a small referral gift. That first month barely covers the cost of winning him. But he renews for many months, tells two colleagues, and orders extra for office parties. The real value of that customer is not his first payment; it is every rupee of profit he brings until he moves job or city." },
        { kind: "p", text: "Now picture the opposite: a buyer who came for a deep opening discount and never returned. Both count as one customer in your notebook. Lifetime value is how you tell them apart, and why you should spend more to keep the first kind." },
      ],
    },
    {
      type: "steps",
      heading: "How to work out lifetime value, step by step",
      items: [
        { title: "Find your average order value", body: "Total sales last month ÷ number of orders. Use UPI, cash book and marketplace dashboard together." },
        { title: "Find profit per order", body: "Average order value − material, packing, delivery, platform fee and GST you cannot claim back. Use the [first-price workbench](/business-pricing-india) if unsure." },
        { title: "Find how often a regular buys", body: "Pick ten customers from three months ago and count their orders since. Average it per month.", check: "Write the ten names and order counts in your notebook." },
        { title: "Find how long they stay", body: "From your old notebook or WhatsApp chats: how many months does a typical customer keep buying before they stop? If you are new, use a careful guess and correct it every quarter." },
        { title: "Multiply", body: "Lifetime value = profit per order × orders per month × months they stay. Write it next to your [customer acquisition cost](/what-is-customer-acquisition-cost-for-a-small-business-in-india)." },
        { title: "Compare", body: "If lifetime value is several times what you spend to win a customer, you can grow. If it is close or lower, fix repeat orders before spending on ads." },
      ],
    },
    {
      type: "table",
      heading: "What lifetime value looks like by business",
      columns: ["Business", "What drives it up", "What cuts it short"],
      rows: [
        ["Milk and dairy delivery", "Daily habit, reliable morning timing", "Late or skipped deliveries, quality complaints"],
        ["Tiffin service", "Monthly plans, office group orders", "Job changes, monotonous menu"],
        ["Salon and beauty", "Regular visits, family members, bridal referrals", "Staff turnover, long waits"],
        ["Tuition and coaching", "Students staying class to class, siblings joining", "Weak results, fee hikes mid-year"],
        ["Laundry and ironing", "Weekly pickup, society contracts", "Lost or damaged clothes"],
        ["Online reseller", "WhatsApp list of past buyers, new collections", "Returns, slow delivery, one-time discount buyers"],
        ["Repair and AMC services", "Annual maintenance contracts", "No reminder before the next service"],
      ],
      note: "Your own numbers decide your lifetime value. Typical repeat patterns differ by city; check with the Validate button.",
    },
    {
      type: "list",
      heading: "Mistakes that make lifetime value look better than it is",
      items: [
        { title: "Using sales instead of profit", body: "A customer who spends a lot on low-margin items may be worth less than one who spends a little on high-margin ones." },
        { title: "Counting family and friends", body: "They buy out of love and stay for ever; strangers do not. Leave them out." },
        { title: "Guessing how long customers stay", body: "Founders always guess too long. Check old records, or redo the number every few months." },
        { title: "Ignoring the cost of keeping them", body: "Loyalty discounts, free delivery and credit all reduce the profit a regular brings." },
        { title: "One number for all customers", body: "Office buyers, students and families behave differently. Work out value for each group." },
      ],
    },
    {
      type: "rich",
      heading: "Your lifetime value worksheet",
      blocks: [
        { kind: "table", columns: ["Line", "How to work it out", "Your figure"], rows: [
          ["Average order value", "Sales ÷ orders, last month", "₹ ______"],
          ["Profit per order (A)", "Order value − every cost per order", "₹ ______"],
          ["Orders per month per regular (B)", "From ten past customers", "______"],
          ["Months a customer stays (C)", "From old records or a careful guess", "______"],
          ["**Lifetime value**", "A × B × C", "₹ ______"],
          ["Cost to win one customer (CAC)", "From the CAC worksheet", "₹ ______"],
          ["**Value ÷ cost**", "Lifetime value ÷ CAC", "______"],
        ] },
        { kind: "p", text: "Many founders aim for lifetime value comfortably several times the cost of winning a customer. What is normal in your trade depends on the sector. [Validate: typical customer retention period and repeat purchase frequency for my type of business in India]" },
      ],
    },
    {
      type: "rich",
      heading: "How to raise lifetime value",
      intro: "Start at the bottom rung; each one is cheaper than finding a new customer.",
      blocks: [
        { kind: "steps", items: [
          { title: "Be reliable", body: "Same quality, same time, every time. Most customers leave because of one bad experience, not price." },
          { title: "Stay in touch", body: "A WhatsApp broadcast list of past buyers with new items, festival offers and reminders." },
          { title: "Make the next order easy", body: "Monthly plans, subscription boxes, a saved address, UPI auto-pay where it fits." },
          { title: "Offer the next thing", body: "A second product for the same buyer: a sweet box with the tiffin, hair spa after the haircut, Class 11 after Class 10." },
          { title: "Thank and reward", body: "A small loyalty card or a thank-you on the tenth order costs little and builds habit." },
          { title: "Ask why people stop", body: "Call three customers who stopped buying each month. Their answers show what to fix. See [product-market fit](/how-to-know-if-your-business-has-product-market-fit-in-india)." },
        ] },
        { kind: "h3", text: "City and village differences" },
        { kind: "p", text: "In metros customers switch quickly, so reliability and convenience keep them. In tier 2 and tier 3 towns loyalty is personal and lasts longer, but credit expectations are higher, which can eat into profit per order. In villages, one trusted relationship with a family or SHG can bring the whole lane." },
      ],
    },
    { type: "dbfaq", heading: "Questions about regular customers", intro: "Real questions from our published idea guides. More on our [founder FAQ page](/faq).", categories: ["home-kitchen-food-business-ideas", "salon-and-grooming-business-ideas", "tuition-and-coaching-business-ideas", "dairy-and-milk-product-business-ideas", "laundry-and-garment-care-business-ideas", "repair-and-maintenance-business-ideas", "home-based-business-ideas", "e-commerce-selling-business-ideas"], match: "(regular|repeat|loyal|customers? (come|return)|retain|subscription|monthly)", limit: 8 },
    {
      type: "rich",
      heading: "What to do this week",
      blocks: [
        { kind: "list", ordered: true, items: [
          "Pick ten customers from three months ago and count their orders since.",
          "Work out profit per order and fill the worksheet.",
          "Compare with your customer acquisition cost.",
          "Start a WhatsApp broadcast list of past buyers.",
          "Call three customers who stopped buying and write down why.",
        ] },
      ],
    },
    { type: "sources", heading: "Sources", items: [SRC.npci, SRC.udyam, { label: "WhatsApp Business", href: "https://business.whatsapp.com/", note: "Broadcast lists and catalogues for staying in touch with buyers." }, { label: "Ministry of MSME", href: "https://msme.gov.in/" }] },
    {
      type: "chips",
      heading: "Related questions",
      items: [
        { label: "What is customer acquisition cost?", href: "/what-is-customer-acquisition-cost-for-a-small-business-in-india" },
        { label: "How to keep customers coming back", href: "/how-to-keep-customers-coming-back-to-your-small-business-in-india" },
        { label: "Product-market fit", href: "/how-to-know-if-your-business-has-product-market-fit-in-india" },
        { label: "Business numbers to track", href: "/business-numbers-every-small-business-in-india-should-track" },
        { label: "Unit economics", href: "/unit-economics-india" },
      ],
    },
    { ...CTA, heading: "A regular customer is worth more than ten one-time buyers.", body: "Work out what your regulars are worth this week, then check the biggest risk in your idea, free." },
    TOOLS,
    EXPLORE,
  ],
};
