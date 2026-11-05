import type { TopicPage } from "@/bought/topic-page";
import { PARENT, UPDATED, UPDATED_ON, IMG, SRC, TOOLS, CALCS, CTA } from "./topic-pages-shared";

const FOOD = ["food-business-ideas", "home-kitchen-food-business-ideas", "street-food-business-ideas", "cloud-kitchen-business-ideas", "packaged-snack-business-ideas", "bakery-and-confectionery-business-ideas", "catering-business-ideas", "sweet-shop-and-mithai-business-ideas", "restaurant-and-eatery-business-ideas", "regional-specialty-food-business-ideas"];
const FSSAI = { label: "FSSAI FoSCoS: food registration and licence", href: "https://foscos.fssai.gov.in/", note: "Every food business needs FSSAI registration or a licence, depending on its size." };
const FSSAI_MAIN = { label: "FSSAI: food safety and labelling", href: "https://www.fssai.gov.in/", note: "Hygiene, labelling and packaging rules for food businesses." };

/**
 * Rewrite 19 (owner review: previous version failed as thin and generic).
 * Seller layout: industry validator (/validate-idea/foodtech). Seller sections kept in order:
 * what the check covers, idea inspiration, why food businesses struggle, go deeper, food validation steps,
 * questions founders ask, FAQ, what it can and cannot tell you, other validators, tools, calculators,
 * popular questions, CTA, rules, sources.
 * No researched figures: every number is a [Validate: ...] marker or a blank the reader fills in.
 */
export const validateFood: TopicPage = {
  slug: "how-to-validate-a-food-business-idea-in-india",
  updated: UPDATED_ON,
  sellerRef: "https://ideaproof.io/validate-idea/foodtech",
  parent: PARENT,
  explore: { guideCategory: "Validation", categories: FOOD.slice(0, 8) },
  seo: {
    title: "How to Validate a Food Business Idea in India Before You Rent a Kitchen",
    description: "Test a home kitchen, tiffin, cloud kitchen, street food, bakery, sweets or packaged snack idea in India before you spend: tasting with strangers, UPI pre-orders, a weekend stall, a full cost-per-plate sheet with gas, packing, delivery and app commission, FSSAI steps, shelf life, city differences and a 14-day plan.",
  },
  hero: {
    eyebrow: "Validate a food business idea",
    h1: "How to Validate a Food Business Idea in India",
    highlight: "Food Business Idea",
    intro: "Everyone at home says your food is delicious, and your colleagues finish your lunchbox before you do. But will strangers in your area pay for it every week, at a price that covers ingredients, gas, packing, delivery, the app's cut and your hours at the stove? Food is one of the most loved and most crowded small businesses in India. Testing it properly before you rent a kitchen or buy equipment protects your savings and your confidence.",
    sub: "For **home kitchens**, **tiffin services**, **cloud kitchens**, **street food**, **bakeries**, **sweets and mithai** and **packaged snacks**.",
    updated: UPDATED,
    primary: { label: "Check my food idea", href: "/business-idea-risk-check" },
    secondary: { label: "Browse food ideas", href: "/category/food-business-ideas" },
    image: IMG.validation,
    imageAlt: "A home cook testing a food business idea with real buyers",
  },
  sections: [
    {
      type: "rich",
      heading: "What a food idea check covers",
      blocks: [
        { kind: "h3", text: "Taste with strangers" },
        { kind: "p", text: "Not family, not friends. Ten buyers who fit your target: working parents, PG students, office teams, shopkeepers. Watch whether they finish it and whether they ask the price." },
        { kind: "h3", text: "A price that covers everything" },
        { kind: "p", text: "Ingredients, gas or electricity, packing, delivery, app commission, payment charges, GST where it applies and your time. Use the [first-price workbench](/business-pricing-india) and the cost-per-plate sheet below." },
        { kind: "h3", text: "Repeat orders" },
        { kind: "p", text: "Food lives on regulars. A tiffin service needs monthly renewals; a snack brand needs shops that reorder; a bakery needs the same families every birthday." },
        { kind: "h3", text: "Licences" },
        { kind: "p", text: "[FSSAI](https://foscos.fssai.gov.in/) registration or licence for every food business, plus local permissions for stalls and premises. Platforms and many buyers ask for your FSSAI number." },
        { kind: "h3", text: "Shelf life and safety" },
        { kind: "p", text: "How long it stays fresh in Indian heat and humidity, how you store and carry it, and what happens in the monsoon. Packaged snacks and pickles need labelling and shelf-life testing before they go to shops." },
        { kind: "h3", text: "Delivery and reach" },
        { kind: "p", text: "Your own delivery, a local rider, a pickup point, or delivery apps and their fees. Distance and timing decide how far your food can travel before it loses quality." },
      ],
    },
    { type: "dbideas", heading: "Get inspired: food business ideas", intro: "Published food ideas from our library, with who pays and what it costs.", categories: FOOD, limit: 8, all: { label: "All food business ideas", href: "/category/food-business-ideas" } },
    {
      type: "rich",
      heading: "Why food businesses struggle in India",
      intro: "Patterns from our [failure research](/failed-startups/india) and the stories food founders share.",
      blocks: [
        { kind: "h3", text: "Price set too low" },
        { kind: "p", text: "Prices set to please friends do not cover gas, packing and delivery. Many home cooks discover months later that every order earned almost nothing." },
        { kind: "h3", text: "Delivery app fees eat the margin" },
        { kind: "p", text: "Commission, discounts the app asks you to fund, packaging rules and payout delays can turn a profitable dish into a loss. Count them on every order. [Validate: current commission and fees charged to small restaurants and home kitchens by the delivery apps in my city]" },
        { kind: "h3", text: "Rent and staff before demand" },
        { kind: "p", text: "A kitchen lease, interiors and a cook's salary before regular orders is the costliest mistake food founders make." },
        { kind: "h3", text: "Inconsistent taste or timing" },
        { kind: "p", text: "A late lunch once is forgiven; twice, the office team moves to someone else. Consistency matters more than variety." },
        { kind: "h3", text: "Missing FSSAI registration" },
        { kind: "p", text: "It is required by law, and buyers, shops and platforms ask for it. Selling without it risks penalties and lost trust." },
        { kind: "h3", text: "Too big a menu" },
        { kind: "p", text: "Twenty dishes means more wastage, more purchases and less consistency. Successful home kitchens often start with a handful of items." },
        { kind: "h3", text: "Ignoring seasons and festivals" },
        { kind: "p", text: "Navratri fasting, Shravan, Ramzan, exam months, summer heat and the monsoon all change what and how much people order. Plan your menu around them." },
      ],
    },
    {
      type: "chips",
      heading: "Go deeper on food businesses",
      items: [
        { label: "Home kitchen food ideas", href: "/category/home-kitchen-food-business-ideas" },
        { label: "Cloud kitchen ideas", href: "/category/cloud-kitchen-business-ideas" },
        { label: "Street food ideas", href: "/category/street-food-business-ideas" },
        { label: "Packaged snack ideas", href: "/category/packaged-snack-business-ideas" },
        { label: "Bakery ideas", href: "/category/bakery-and-confectionery-business-ideas" },
        { label: "Sweet shop and mithai ideas", href: "/category/sweet-shop-and-mithai-business-ideas" },
        { label: "Catering ideas", href: "/category/catering-business-ideas" },
        { label: "Weekend market stall check", href: "/weekend-market-stall-profit-check" },
      ],
    },
    {
      type: "rich",
      heading: "Food-specific validation steps",
      blocks: [
        { kind: "steps", items: [
          { title: "Fix one menu and one price", body: "Three or four items, a real price, a pickup or delivery area. Write your menu and price on one WhatsApp status today." },
          { title: "Get FSSAI basic registration", body: "On [FoSCoS](https://foscos.fssai.gov.in/): choose the registration type for your size, fill your kitchen address and food categories, upload ID and address proof, pay online, and keep the number for your labels and listings." },
          { title: "Take pre-orders with a UPI advance", body: "Share in your society group, office group or with nearby offices and PGs. Cook only what is booked." },
          { title: "Run a tasting batch or a weekend stall", body: "Real buyers, real price. Use the [stall profit check](/weekend-market-stall-profit-check). Note what sells out and what you carry home." },
          { title: "Count repeat orders for four weeks", body: "Regulars matter more than first-week excitement. See [product-market fit](/how-to-know-if-your-business-has-product-market-fit-in-india)." },
          { title: "Check the numbers on one order", body: "Profit after every cost, including any app fees. Fill the sheet below and see [unit economics](/unit-economics-india)." },
          { title: "Test one delivery app only after direct orders work", body: "List on one app with a small menu and compare profit per order with your direct WhatsApp orders." },
          { title: "Register before you grow", body: "Upgrade FSSAI as you grow; register on Udyam (free); check GST when your turnover or way of selling needs it." },
        ] },
        { kind: "h3", text: "Worked rupee example: cost per plate for a lunch tiffin" },
        { kind: "table", columns: ["Line", "How to work it out", "Your figure"], rows: [
          ["Ingredients", "Total ingredient bill for a batch ÷ plates in the batch", "₹ ______"],
          ["Gas or electricity", "Monthly increase in the bill ÷ plates a month", "₹ ______"],
          ["Packing", "Container + lid + bag + spoon + label per plate", "₹ ______"],
          ["Delivery", "Rider's charge or your fuel per plate", "₹ ______"],
          ["App commission (if on an app)", "Price × the app's commission share + fees", "₹ ______"],
          ["Payment charges", "Any gateway or card charge per order", "₹ ______"],
          ["Wastage", "Plates wasted a week × cost ÷ plates sold a week", "₹ ______"],
          ["Your time", "Hours a day × your hourly value ÷ plates a day", "₹ ______"],
          ["**Total cost per plate**", "Add the lines", "₹ ______"],
          ["Your price", "From the first-price workbench", "₹ ______"],
          ["**Profit per plate**", "Price − total cost", "₹ ______"],
        ] },
        { kind: "p", text: "Check today's wholesale prices for your main ingredients and packaging in your city before you fix the price. [Validate: today's wholesale price of my main ingredients and food packaging in my city]" },
        { kind: "h3", text: "Differences by place" },
        { kind: "list", items: [
          "**Metros:** large office and PG demand, but delivery distance, traffic and app dependence are high. Build a dense cluster of buyers in one or two areas.",
          "**Tier 2 cities:** families and offices are open to home food; society groups and local Instagram pages bring orders. Direct orders often beat apps.",
          "**Tier 3 towns:** festive sweets, snacks, catering for functions and street food usually work better than daily tiffins. Trust and taste travel by word of mouth.",
          "**Villages:** pickles, papads, masalas, millet snacks and sweets made by SHGs can sell in nearby towns, haats and through shops; labelling and FSSAI open bigger buyers.",
        ] },
        { kind: "h3", text: "Differences by food business type" },
        { kind: "table", columns: ["Type", "Test first", "Watch most closely"], rows: [
          ["Tiffin service", "One week of paid trial plans in one society or office", "Monthly renewals and delivery time"],
          ["Cloud kitchen", "Direct orders from a small menu before listing on apps", "Profit per order after commission"],
          ["Street food", "A borrowed cart or stall at one spot for two weeks", "Daily footfall and local permissions"],
          ["Bakery", "Pre-orders for birthdays and festivals", "Wastage and cream or chocolate costs"],
          ["Sweets and mithai", "Festival pre-orders and box orders for offices", "Shelf life and festival peaks"],
          ["Packaged snacks", "Five shops for two weeks; direct sales to families", "Shop reorders, labelling and shelf life"],
        ] },
      ],
    },
    {
      type: "chips",
      heading: "Questions food founders ask",
      items: [
        { label: "How much money do I need to start?", href: "/how-much-money-is-needed-to-start-a-business-in-india" },
        { label: "How do I find my first customers?", href: "/first-customer-india" },
        { label: "What does each customer cost me?", href: "/what-is-customer-acquisition-cost-for-a-small-business-in-india" },
        { label: "Should I take a MUDRA loan?", href: "/how-to-get-funding-for-a-small-business-in-india" },
        { label: "How do I study other food sellers near me?", href: "/how-to-do-competitor-analysis-for-a-small-business-in-india" },
      ],
    },
    { type: "dbfaq", heading: "Frequently asked questions", intro: "Real questions from our published food idea guides. More on our [founder FAQ page](/faq).", categories: FOOD, limit: 12 },
    {
      type: "rich",
      heading: "What this validation can and cannot tell you",
      blocks: [
        { kind: "list", items: [
          "**It can tell you** whether real buyers near you pay your price and come back.",
          "**It can tell you** which dishes or products sell, and which do not.",
          "**It can tell you** whether direct orders or apps leave you more money.",
          "**It cannot promise** success at a bigger scale or in another city. Test again before you expand.",
          "**It cannot replace** proper licences, hygiene and food safety rules. Follow FSSAI guidance.",
        ] },
        { kind: "h3", text: "Your 14-day food test plan" },
        { kind: "table", columns: ["Days", "What you do"], rows: [
          ["1–2", "Fix menu and price; fill the cost-per-plate sheet; apply for FSSAI basic registration"],
          ["3–4", "Talk to ten buyers who fit your target; share your menu with two groups"],
          ["5–7", "Take UPI pre-orders; cook and deliver only what is booked; note timing and feedback"],
          ["8–9", "Run a tasting batch or weekend stall at your real price"],
          ["10–13", "Second round of orders; count who came back"],
          ["14", "Compare repeat orders and profit per plate with your pass mark; decide with the [pivot or stop guide](/business-idea-pivot-or-stop)"],
        ] },
      ],
    },
    {
      type: "chips",
      heading: "Other idea validators",
      items: [
        { label: "How to validate a business idea in India", href: "/how-to-validate-a-business-idea-in-india" },
        { label: "How to validate an online selling idea", href: "/how-to-validate-an-online-selling-business-idea-in-india" },
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
        { label: "Common mistakes to avoid", href: "/common-mistakes-to-avoid-when-starting-a-business-in-india" },
        { label: "How to build an MVP with low investment", href: "/how-to-build-an-mvp-with-low-investment-in-india" },
        { label: "Business numbers to track", href: "/business-numbers-every-small-business-in-india-should-track" },
      ],
    },
    { ...CTA, heading: "Cook for ten paying strangers before you rent a kitchen.", body: "Run the free risk check for your food idea, then take your first pre-orders this week.", button: { label: "Check my food idea", href: "/business-idea-risk-check" } },
    {
      type: "takeaways",
      heading: "Rules worth knowing",
      intro: "Confirm current rules on the official pages in Sources.",
      items: [
        "Every food business operator needs **FSSAI registration or a licence**; which one depends on the size of the business. [Validate: current FSSAI turnover bands and fees]",
        "**Packaged food** must carry a label with the FSSAI number, ingredients, date of manufacture, best-before and other details under FSSAI labelling rules.",
        "**Udyam registration** is free and helps with MSME schemes and loans.",
        "**GST** depends on your turnover and how you sell; restaurant, delivery-app and packaged food rules differ, so check the GST portal or ask a CA.",
        "**Street food** stalls need permission from the local body; many cities follow the street vendors' law with vending zones and certificates.",
      ],
    },
    { type: "sources", heading: "Sources", items: [FSSAI, FSSAI_MAIN, SRC.udyam, SRC.gst, SRC.mudra, SRC.pmegp, SRC.npci, { label: "PM SVANidhi (street vendors)", href: "https://pmsvanidhi.mohua.gov.in/", note: "Working-capital loans for street vendors." }] },
  ],
};
