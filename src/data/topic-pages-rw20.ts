import type { TopicPage } from "@/bought/topic-page";
import { PARENT, UPDATED, UPDATED_ON, IMG, SRC, TOOLS, CALCS, CTA } from "./topic-pages-shared";

const ONLINE = ["online-business-ideas", "reselling-business-ideas", "e-commerce-selling-business-ideas", "affiliate-and-content-site-business-ideas", "work-from-home-business-ideas", "handmade-product-business-ideas", "fashion-and-apparel-business-ideas", "personal-care-product-business-ideas"];
const CONSUMER = { label: "Department of Consumer Affairs", href: "https://consumeraffairs.nic.in/", note: "Consumer protection rules, including those for e-commerce sellers." };
const METROLOGY = { label: "Legal Metrology (Department of Consumer Affairs)", href: "https://consumeraffairs.nic.in/organisation-and-units/division/legal-metrology", note: "Rules for labelling packaged products." };

/**
 * Rewrite 20 (owner review: previous version failed as thin and generic).
 * Seller layout: industry validator (/validate-idea/ecommerce). Seller sections kept in order:
 * what the check covers, idea inspiration, why online sellers struggle, go deeper, validation steps,
 * questions sellers ask, FAQ, what it can and cannot tell you, other validators, tools, calculators,
 * popular questions, CTA, rules, sources.
 * No researched figures: every number is a [Validate: ...] marker or a blank the reader fills in.
 */
export const validateOnline: TopicPage = {
  slug: "how-to-validate-an-online-selling-business-idea-in-india",
  updated: UPDATED_ON,
  sellerRef: "https://ideaproof.io/validate-idea/ecommerce",
  parent: PARENT,
  explore: { guideCategory: "Validation", categories: ONLINE },
  seo: {
    title: "How to Validate an Online Selling Business Idea in India Before You Buy Stock",
    description: "Test an online selling idea in India before you buy stock: ten products on a WhatsApp or Instagram catalogue, prepaid UPI orders, a profit-per-order sheet with marketplace commission, shipping, returns, COD and GST, marketplace and ONDC steps, rules for online sellers and a 14-day plan.",
  },
  hero: {
    eyebrow: "Validate an online selling idea",
    h1: "How to Validate an Online Selling Business Idea in India",
    highlight: "Online Selling",
    intro: "Selling online looks easy: take photos, list, and orders arrive. Then the returns come back, cash-on-delivery parcels are refused at the door, and the marketplace fee turns out bigger than your profit. Before you buy a carton of stock or pay for a website, find out whether strangers will pay online for your products, keep them, and come back for more, at a price that leaves you money after every deduction.",
    sub: "For **resellers**, **handmade products**, **D2C brands**, **WhatsApp and Instagram stores** and **marketplace sellers**.",
    updated: UPDATED,
    primary: { label: "Check my online idea", href: "/business-idea-risk-check" },
    secondary: { label: "Browse online ideas", href: "/category/online-business-ideas" },
    image: IMG.validation,
    imageAlt: "A founder testing an online selling idea from home",
  },
  sections: [
    {
      type: "rich",
      heading: "What an online selling idea check covers",
      blocks: [
        { kind: "h3", text: "Buyers who pay online" },
        { kind: "p", text: "Prepaid UPI orders from strangers, not cart adds, likes or \"price please\" comments." },
        { kind: "h3", text: "Profit after every fee" },
        { kind: "p", text: "Marketplace commission, fixed and closing fees, shipping, payment charges, packaging, ads and GST. Check [unit economics](/unit-economics-india) and the profit sheet below." },
        { kind: "h3", text: "Returns and COD" },
        { kind: "p", text: "How many orders come back or are refused, and what each one costs you in two-way shipping and damaged packing. In many categories, especially fashion, this decides whether you make money at all." },
        { kind: "h3", text: "Cost of each buyer" },
        { kind: "p", text: "Ads, influencer barter and discounts per new buyer. See [customer acquisition cost](/what-is-customer-acquisition-cost-for-a-small-business-in-india)." },
        { kind: "h3", text: "Repeat buyers" },
        { kind: "p", text: "Who orders again without a discount, and whether you can reach them directly on WhatsApp next time." },
        { kind: "h3", text: "Rules for online sellers" },
        { kind: "p", text: "GST registration rules for e-commerce sellers, consumer protection rules on seller details and returns, and labelling rules for packaged products." },
      ],
    },
    { type: "dbideas", heading: "Get inspired: online business ideas", intro: "Published online and reselling ideas from our library.", categories: ONLINE, limit: 8, all: { label: "All online business ideas", href: "/category/online-business-ideas" } },
    {
      type: "rich",
      heading: "Why online selling businesses struggle in India",
      blocks: [
        { kind: "h3", text: "Fees not counted" },
        { kind: "p", text: "Commission, shipping, closing fees and the discounts the platform nudges you into can leave nothing on each order. Many sellers see only the payout, not the deductions. [Validate: current commission, closing fee and shipping charges for my category on the marketplace I plan to use]" },
        { kind: "h3", text: "High returns" },
        { kind: "p", text: "Wrong size, colour that looked different on screen, or quality below the photo brings orders back. Each return costs you shipping twice, and sometimes the product itself." },
        { kind: "h3", text: "Cash on delivery refusals" },
        { kind: "p", text: "COD is popular in tier 2 and tier 3 India, but refused parcels are pure loss. Prepaid orders show real intent." },
        { kind: "h3", text: "Too much stock too early" },
        { kind: "p", text: "Cash stuck in cartons that do not sell, especially in fashion and festival products that go out of season." },
        { kind: "h3", text: "Only one channel" },
        { kind: "p", text: "A marketplace rule change, an account suspension or an Instagram reach drop can stop sales overnight. Build a direct WhatsApp list of buyers from day one." },
        { kind: "h3", text: "Buying every customer with ads" },
        { kind: "p", text: "If nobody comes back, ad costs never end. Repeat buyers are the profit." },
        { kind: "h3", text: "Copying the cheapest seller" },
        { kind: "p", text: "The lowest price on a marketplace is often a seller losing money or cutting quality. Compete on something you can keep: styling, a niche, faster delivery, better packing, regional language service." },
      ],
    },
    {
      type: "chips",
      heading: "Go deeper on online businesses",
      items: [
        { label: "Reselling business ideas", href: "/category/reselling-business-ideas" },
        { label: "E-commerce selling ideas", href: "/category/e-commerce-selling-business-ideas" },
        { label: "Handmade product ideas", href: "/category/handmade-product-business-ideas" },
        { label: "Online business ideas", href: "/online-business-ideas-india" },
        { label: "Affiliate and content site ideas", href: "/category/affiliate-and-content-site-business-ideas" },
        { label: "Test demand with ads", href: "/how-to-test-demand-with-facebook-and-google-ads-in-india" },
      ],
    },
    {
      type: "rich",
      heading: "Online-selling validation steps",
      blocks: [
        { kind: "steps", items: [
          { title: "Start with ten products, not a hundred", body: "Photograph them well in daylight on your phone and list them on a [WhatsApp Business](https://business.whatsapp.com/) catalogue or an Instagram page with prices, sizes and delivery time." },
          { title: "Take prepaid UPI orders", body: "Prepaid orders show real intent and avoid COD refusals. A small discount for prepaid is fine." },
          { title: "Order stock only for what is booked", body: "Or use small batches from a supplier who restocks quickly, or a dropship arrangement while you test." },
          { title: "Ship a few orders yourself", body: "Book with a courier aggregator or the local post office, note the real shipping cost and delivery time for each zone." },
          { title: "Run a small ad test", body: "See [how to test demand with Facebook and Google ads](/how-to-test-demand-with-facebook-and-google-ads-in-india)." },
          { title: "Track returns and repeat orders for a month", body: "Both tell you more than total orders." },
          { title: "Then try one marketplace or ONDC", body: "Register as a seller with PAN, bank account and GST where required; list your best few products; compare profit per order with your direct orders. [ONDC](https://ondc.org/) is one more route, through a seller app." },
          { title: "Register properly before you scale", body: "Udyam (free), GST as required for online selling, and labels that meet legal metrology rules." },
        ] },
        { kind: "h3", text: "Worked rupee example: profit per order for a kurti sold online" },
        { kind: "table", columns: ["Line", "How to work it out", "Your figure"], rows: [
          ["Selling price (A)", "Your listed price", "₹ ______"],
          ["Product cost", "Wholesale price or your making cost per piece", "₹ ______"],
          ["Packing", "Poly bag, box, tag, tape, thank-you card", "₹ ______"],
          ["Shipping", "Courier charge for the zone, or the marketplace shipping fee", "₹ ______"],
          ["Marketplace fees", "Commission share × price + fixed and closing fees", "₹ ______"],
          ["Payment charges", "Gateway or COD charges", "₹ ______"],
          ["Return cost per order", "Return share × (two-way shipping + damage) ", "₹ ______"],
          ["Ad cost per order", "Ad spend ÷ orders", "₹ ______"],
          ["GST payable", "Output GST − input credit, if registered", "₹ ______"],
          ["**Total cost (B)**", "Add every line above except A", "₹ ______"],
          ["**Profit per order**", "A − B", "₹ ______"],
        ] },
        { kind: "p", text: "Do this for each channel: WhatsApp direct, Instagram, each marketplace. The channel with the highest profit per order and the most repeat buyers deserves your time." },
        { kind: "h3", text: "Differences by place and category" },
        { kind: "list", items: [
          "**Metro buyers** pay online more readily and expect fast delivery; returns are easy for them, so sizing and photos must be accurate.",
          "**Tier 2 and tier 3 buyers** use COD more and value trust; a WhatsApp call, a regional-language reply and clear return terms raise prepaid orders.",
          "**Selling from a small town** is an advantage for handmade, regional and craft products; buyers in metros pay for authenticity.",
          "**Fashion** has the highest returns; **home and kitchen** products return less but ship heavier; **beauty and personal care** need labels and ingredient lists; **handmade** needs consistent quality across batches.",
        ] },
      ],
    },
    {
      type: "chips",
      heading: "Questions online sellers ask",
      items: [
        { label: "How much money do I need to start?", href: "/how-much-money-is-needed-to-start-a-business-in-india" },
        { label: "How do I price my products?", href: "/business-pricing-india" },
        { label: "Can I start without investors?", href: "/how-to-start-a-business-without-investors-in-india" },
        { label: "What numbers should I track?", href: "/business-numbers-every-small-business-in-india-should-track" },
        { label: "How do I study other sellers?", href: "/how-to-do-competitor-analysis-for-a-small-business-in-india" },
      ],
    },
    { type: "dbfaq", heading: "Frequently asked questions", intro: "Real questions from our published online and reselling idea guides. More on our [founder FAQ page](/faq).", categories: ONLINE, limit: 12 },
    {
      type: "rich",
      heading: "What this validation can and cannot tell you",
      blocks: [
        { kind: "list", items: [
          "**It can tell you** whether strangers pay online for your products at your price.",
          "**It can tell you** which products sell, which come back, and which channel leaves you the most money.",
          "**It cannot promise** that a marketplace or ad platform will not change its rules. Keep a direct list of buyers.",
          "**It cannot replace** getting GST, labelling and consumer rules right. Check the official pages.",
        ] },
        { kind: "h3", text: "Your 14-day online selling test" },
        { kind: "table", columns: ["Days", "What you do"], rows: [
          ["1–2", "Pick ten products; photograph them; fill the profit sheet with real quotes"],
          ["3–4", "Set up WhatsApp Business catalogue and an Instagram page; set prices and return terms"],
          ["5–7", "Share with your network and two or three relevant groups; take prepaid UPI orders"],
          ["8–10", "Ship orders; note shipping cost, delivery time and any returns"],
          ["11–12", "Run a small ad test with a fixed budget and end date"],
          ["13", "Message every buyer for feedback and a second order"],
          ["14", "Compare profit per order, returns and repeats with your pass mark; decide with the [pivot or stop guide](/business-idea-pivot-or-stop)"],
        ] },
      ],
    },
    {
      type: "chips",
      heading: "Other idea validators",
      items: [
        { label: "How to validate a business idea in India", href: "/how-to-validate-a-business-idea-in-india" },
        { label: "How to validate a food business idea", href: "/how-to-validate-a-food-business-idea-in-india" },
        { label: "Is my business idea good?", href: "/how-to-check-if-your-business-idea-is-good-in-india" },
        { label: "How to test demand with ads", href: "/how-to-test-demand-with-facebook-and-google-ads-in-india" },
      ],
    },
    TOOLS,
    CALCS,
    {
      type: "chips",
      heading: "Popular founder questions",
      items: [
        { label: "Is my business idea good?", href: "/how-to-check-if-your-business-idea-is-good-in-india" },
        { label: "How to build an MVP with low investment", href: "/how-to-build-an-mvp-with-low-investment-in-india" },
        { label: "Common mistakes to avoid", href: "/common-mistakes-to-avoid-when-starting-a-business-in-india" },
        { label: "Competitor analysis", href: "/how-to-do-competitor-analysis-for-a-small-business-in-india" },
      ],
    },
    { ...CTA, heading: "Sell ten products before you buy a hundred.", body: "Run the free risk check for your online idea, then take your first prepaid orders this week.", button: { label: "Check my online idea", href: "/business-idea-risk-check" } },
    {
      type: "takeaways",
      heading: "Rules worth knowing",
      intro: "Confirm current rules on the official pages in Sources.",
      items: [
        "**GST** rules for selling through e-commerce platforms differ from shop thresholds; many online sellers must register earlier. Check the GST portal or ask a CA before you list. [Validate: current GST registration rules for small sellers on e-commerce platforms]",
        "**Consumer protection rules for e-commerce** require clear seller details, prices, return and refund policies, and grievance contact.",
        "**Packaged products** need proper labels with maker or packer details, MRP, net quantity and date under legal metrology rules.",
        "**Beauty, food and health products** have extra rules (FSSAI for food; cosmetics rules for beauty products). Check before you list.",
      ],
    },
    { type: "sources", heading: "Sources", items: [SRC.gst, CONSUMER, METROLOGY, SRC.ondc, SRC.npci, SRC.udyam, { label: "WhatsApp Business", href: "https://business.whatsapp.com/" }] },
  ],
};
