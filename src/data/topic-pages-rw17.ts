import type { TopicPage } from "@/bought/topic-page";
import { PARENT, UPDATED, UPDATED_ON, IMG, SRC, TOOLS, CALCS, CTA } from "./topic-pages-shared";

const FSSAI = { label: "FSSAI FoSCoS: food registration and licence", href: "https://foscos.fssai.gov.in/", note: "Every food business needs FSSAI registration or a licence, depending on its size." };
const ASCI = { label: "ASCI: advertising code for India", href: "https://www.ascionline.in/", note: "Self-regulatory rules for honest advertising, including influencer posts." };

/**
 * Rewrite 17 (owner review: previous version failed as thin and generic).
 * Seller layout: guide (/guides/landing-page-validation-facebook-vs-adwords). Seller sections kept in order:
 * takeaways, test at a glance, what is a landing page test, Meta or Google, landing page setup, Meta ad setup,
 * Google ad setup, reading results, what to measure, final word, FAQ, deeper answers, people also search,
 * CTA, tools, calculators, related resources, rules, sources.
 * No researched figures: every number is a [Validate: ...] marker or a blank the reader fills in.
 */
export const adsTest: TopicPage = {
  slug: "how-to-test-demand-with-facebook-and-google-ads-in-india",
  updated: UPDATED_ON,
  sellerRef: "https://ideaproof.io/guides/landing-page-validation-facebook-vs-adwords",
  parent: PARENT,
  explore: { guideCategory: "Validation", categories: ["online-business-ideas", "e-commerce-selling-business-ideas", "reselling-business-ideas", "home-kitchen-food-business-ideas", "tuition-and-coaching-business-ideas", "repair-and-maintenance-business-ideas", "fashion-and-apparel-business-ideas", "digital-marketing-business-ideas"] },
  seo: {
    title: "How to Test Demand With Facebook and Google Ads in India on a Small Budget: Step-by-Step",
    description: "Test whether Indians will buy before you build: one clear offer, a simple WhatsApp, Google Form or landing page with a UPI pre-order, a small fixed budget on Meta (Facebook, Instagram) or Google search, click-by-click setup, a results sheet, how to read the numbers, rules and a 7-day plan.",
  },
  hero: {
    eyebrow: "Test demand with ads",
    h1: "How to Test Demand With Facebook and Google Ads in India",
    highlight: "Test Demand",
    intro: "Before you buy stock, rent a shop or pay for an app, you can spend a small, fixed amount on ads and see whether strangers in your area click, enquire and actually pay. It is the fastest way to hear the honest answer to \"will people buy this?\", from people who have no reason to be polite to you. Done right, it costs less than one wrong batch of stock. Done wrong, it is just money spent on likes.",
    sub: "You will set a budget and a pass mark first, build one simple page or WhatsApp link, run the ad on Meta or Google, and read the result without fooling yourself.",
    updated: UPDATED,
    primary: { label: "Set up the test", href: "#the-test-at-a-glance" },
    secondary: { label: "Demand test planner", href: "/business-demand-test-india" },
    image: IMG.hub,
    imageAlt: "A founder running a small ad test on a phone",
  },
  sections: [
    {
      type: "takeaways",
      heading: "Key takeaways",
      items: [
        "**Decide your budget and your pass mark before you start**, and stop when the budget ends. \"Continue if at least ______ people pre-order at my real price\" is a pass mark.",
        "**Send people to one simple page or a WhatsApp chat** with one clear offer, your real price and one action: a UPI pre-order or an enquiry.",
        "**Meta (Facebook and Instagram) suits things people discover**: food, fashion, gifts, home products, classes. **Google search suits things people already look for**: repairs, tuition, services, B2B supplies.",
        "**Count enquiries and pre-orders, not likes, views or followers.** Only money and serious questions are evidence.",
        "**Target only the area you can serve.** Clicks from places you cannot deliver to are wasted money.",
        "**A failed test is a good result** if it stops you from buying the wrong stock or signing the wrong lease.",
      ],
    },
    {
      type: "rich",
      heading: "The test at a glance",
      blocks: [
        { kind: "table", columns: ["Step", "What you do", "Time"], rows: [
          ["Offer", "One product or service, one price, one area", "An evening"],
          ["Pass mark", "The result that means \"continue\", written down", "Ten minutes"],
          ["Page", "A simple page, Google Form or WhatsApp Business catalogue", "A day"],
          ["Ads", "A small daily budget on Meta or Google, with an end date", "Set up in an hour or two"],
          ["Run", "Let it run until the budget you set is spent", "A few days"],
          ["Reply", "Answer every message quickly, as a real seller", "Daily"],
          ["Decide", "Compare results with your pass mark", "An hour"],
        ] },
        { kind: "callout", title: "Your test card", text: "Offer: ______ · Price: ₹ ______ · Area (pin codes): ______ · Platform: Meta / Google · Total budget: ₹ ______ · End date: ______ · Pass mark: ______ pre-orders or ______ serious enquiries" },
      ],
    },
    {
      type: "rich",
      heading: "What is a landing page test?",
      blocks: [
        { kind: "p", text: "A landing page test shows a real offer to real strangers and measures who takes the next step: an enquiry, a sign-up or a pre-order. You do not need the full business ready; you need the offer, the price and a way to take a booking. If people pay, you deliver the first orders by hand. If nobody does, you have learnt it for the cost of the ads." },
        { kind: "p", text: "The page can be as simple as a [WhatsApp Business](https://business.whatsapp.com/) catalogue link, a Google Form with a UPI QR code, an Instagram profile with a clear first post, or a one-page website from a free builder. It works for products, services, classes and local businesses. See [how to build an MVP with low investment](/how-to-build-an-mvp-with-low-investment-in-india)." },
        { kind: "h3", text: "When an ad test is the wrong tool" },
        { kind: "list", items: [
          "**Very local, trust-based services in small towns and villages**, where buyers decide through people they know. A stall, a shopkeeper tie-up or the SHG meeting tells you more.",
          "**Big-ticket or B2B deals** (machinery, contracts with factories) where buyers need meetings, not ads.",
          "**When you have not spoken to a single buyer yet.** Do [ten conversations](/how-to-talk-to-customers-before-starting-a-business-in-india) first; they will write your ad for you.",
        ] },
      ],
    },
    {
      type: "rich",
      heading: "Facebook and Instagram or Google: which to choose",
      blocks: [
        { kind: "table", columns: ["Question", "Meta (Facebook, Instagram)", "Google search"], rows: [
          ["Do buyers already search for this?", "Not needed; you can show it to them", "Yes; you appear when they search"],
          ["Best for", "Fashion, food, gifts, home products, classes, events", "Repairs, home services, tuition, clinics, B2B supplies"],
          ["Targeting", "Area, age, interests, language", "Search words and area"],
          ["Creative needed", "A clear photo or short video, made on your phone", "A short text ad"],
          ["Good next step", "Message on WhatsApp or Instagram", "Call or WhatsApp from the ad"],
          ["Watch out for", "Clicks and likes that never enquire", "Searches that do not match your offer"],
        ] },
        { kind: "h3", text: "Differences by place" },
        { kind: "list", items: [
          "**Metros:** many competing advertisers, so each click tends to cost more; very tight pin-code targeting matters most.",
          "**Tier 2 cities:** ads often reach more of your buyers for less, and local language creatives can stand out.",
          "**Tier 3 towns and villages:** reach is smaller and trust is personal; ads in the local language with your face and phone number work better than polished brand ads.",
        ] },
        { kind: "p", text: "Ad prices change with season, festival rush and competition. [Validate: today's typical cost per click and cost per message for Meta and Google ads in my city and category]" },
      ],
    },
    {
      type: "rich",
      heading: "Set up your landing page",
      blocks: [
        { kind: "steps", items: [
          { title: "One headline that names the buyer and the benefit", body: "\"Fresh home-cooked tiffin for working parents in Baner, delivered before lunch.\" \"Maths tuition for Class 10 CBSE in Vijayawada, evening batches.\"" },
          { title: "Your real price in rupees", body: "Hiding the price gives false hope. Use the [first-price workbench](/business-pricing-india)." },
          { title: "A clear photo or two", body: "Your real product, taken on your phone in daylight. No stock photos that buyers will see through." },
          { title: "One action", body: "Pre-order with a small UPI advance, or tap to WhatsApp you. Not both." },
          { title: "Trust details", body: "Your name, area, phone number and FSSAI number if you sell food. Follow [ASCI](https://www.ascionline.in/) rules: no false claims, no fake reviews." },
          { title: "Delivery and refund promise", body: "When it will arrive, and what happens if you cannot deliver. A clear refund line builds trust for a pre-order." },
        ] },
      ],
    },
    {
      type: "rich",
      heading: "Set up a Facebook and Instagram ad",
      blocks: [
        { kind: "steps", items: [
          { title: "Create the page and ad account in your own name", body: "Use Meta Business Suite with your own Facebook login; link your Instagram professional account and WhatsApp Business number. Official help: [Meta Business Help Centre](https://www.facebook.com/business/help)." },
          { title: "Choose a messages, leads or traffic goal", body: "Messages to WhatsApp works well for many Indian small businesses, because buyers like to ask before they pay." },
          { title: "Set the area tightly", body: "Only the pin codes or a small radius around the area you can deliver to. Add the language your buyers use." },
          { title: "Make one simple creative", body: "A clear photo or a short phone video with the price on it, and one line of text in the language your buyers speak." },
          { title: "Set a small daily budget and an end date", body: "So you never spend more than you planned. Write your total test budget and end date on your test card before you click publish." },
          { title: "Pay from a card or UPI you control", body: "Never hand your account to an agent who asks for your login; add them as a partner if you need help." },
        ] },
      ],
    },
    {
      type: "rich",
      heading: "Set up a Google search ad",
      blocks: [
        { kind: "steps", items: [
          { title: "Open Google Ads in your own account", body: "Official help: [Google Ads Help](https://support.google.com/google-ads/). Choose expert mode if you want full control of the settings." },
          { title: "Pick a few exact search phrases", body: "The words your buyers type, in English and your local language: \"AC repair near me\", \"tiffin service Baner\", \"maths tuition class 10 Vijayawada\"." },
          { title: "Limit the location", body: "Only the area you serve. Set it to people in the location, not people interested in it." },
          { title: "Write a short ad", body: "Name the service, the area and the price or offer, and add your call or WhatsApp button." },
          { title: "Set a daily budget and end date", body: "Pause the campaign when the test budget is spent." },
          { title: "Claim your free Google Business Profile too", body: "For local services it often brings enquiries without paying for every click." },
        ] },
      ],
    },
    {
      type: "rich",
      heading: "How to read your results",
      blocks: [
        { kind: "h3", text: "Many clicks, no enquiries" },
        { kind: "p", text: "The ad is interesting but the offer, price or page is not. Change one thing (headline, price, photo or area) and test again with a fresh small budget." },
        { kind: "h3", text: "Enquiries, no pre-orders" },
        { kind: "p", text: "People are curious but not convinced. Call them and ask what stopped them; [customer conversations](/how-to-talk-to-customers-before-starting-a-business-in-india) explain how. Often the answer is trust, delivery time or price." },
        { kind: "h3", text: "Pre-orders at your real price" },
        { kind: "p", text: "A strong signal. Deliver them well, ask for feedback, and watch for repeat orders, the start of [product-market fit](/how-to-know-if-your-business-has-product-market-fit-in-india)." },
        { kind: "h3", text: "Almost nothing happens" },
        { kind: "p", text: "Check the area, the wording and whether the ad was approved. If those are fine, demand may be low at this price in this area. That is useful to know now, before you spend on stock." },
        { kind: "h3", text: "Mistakes Indian founders make with ad tests" },
        { kind: "list", items: [
          "**Boosting a post** instead of setting up a proper ad with a goal, area and end date.",
          "**Targeting all of India** for a local business.",
          "**Replying hours later.** Buyers message several sellers; the fastest reply often wins.",
          "**Counting likes and comments** as demand.",
          "**Changing everything at once**, so you cannot tell what worked.",
          "**Giving your login to an agency or freelancer** instead of partner access.",
        ] },
      ],
    },
    {
      type: "rich",
      heading: "What to measure",
      intro: "We do not publish generic benchmarks; results depend on your product, price and area. Track these and compare with the pass mark you set.",
      blocks: [
        { kind: "table", columns: ["Measure", "How to count it", "Why it matters"], rows: [
          ["Spend", "Total rupees spent, including GST on the ad bill", "Your cost of learning"],
          ["Clicks or messages", "From the ads dashboard", "Interest"],
          ["Enquiries", "Messages or forms with a real question", "Serious interest"],
          ["Pre-orders or advances", "UPI payments received", "The real answer"],
          ["Cost per pre-order", "Spend ÷ pre-orders", "Your early [customer acquisition cost](/what-is-customer-acquisition-cost-for-a-small-business-in-india)"],
          ["Profit per order", "Price − every cost per order", "Whether that customer cost can be repaid"],
        ] },
        { kind: "h3", text: "Worked rupee example: your results sheet" },
        { kind: "table", columns: ["Line", "How to work it out", "Your figure"], rows: [
          ["Total spend (A)", "From the ads billing page", "₹ ______"],
          ["Messages or clicks (B)", "From the dashboard", "______"],
          ["Serious enquiries (C)", "Count by hand from chats", "______"],
          ["Pre-orders paid (D)", "From UPI history", "______"],
          ["Cost per enquiry", "A ÷ C", "₹ ______"],
          ["**Cost per pre-order**", "A ÷ D", "₹ ______"],
          ["Profit per order", "Price − every cost", "₹ ______"],
          ["**Pass or fail?**", "D compared with your pass mark", "______"],
        ] },
      ],
    },
    {
      type: "rich",
      heading: "The final word on ad tests",
      blocks: [
        { kind: "list", items: [
          "**A small ad test is cheaper than a wrong shop, a wrong batch or a wrong app.**",
          "**Set your pass mark first** so you cannot argue with the result later.",
          "**Use the money people pay you as the signal**, not compliments in the comments.",
          "**One test is a snapshot.** If it passes, deliver and test again a month later.",
        ] },
        { kind: "h3", text: "What to do this week" },
        { kind: "table", columns: ["Day", "Task"], rows: [
          ["Day 1", "Fill your test card: offer, price, area, budget, end date, pass mark"],
          ["Day 2", "Build the page, form or WhatsApp catalogue; add trust details"],
          ["Day 3", "Make one photo or phone video; set up the ad on Meta or Google"],
          ["Day 4", "Launch; reply to every message within minutes"],
          ["Day 5", "Keep replying; take pre-orders by UPI"],
          ["Day 6", "Let the budget finish; deliver first orders"],
          ["Day 7", "Fill the results sheet and decide with the [pivot or stop guide](/business-idea-pivot-or-stop)"],
        ] },
      ],
    },
    { type: "dbfaq", heading: "Frequently asked questions", intro: "Real questions from our published idea guides about selling and promoting online. More on our [founder FAQ page](/faq).", categories: ["online-business-ideas", "e-commerce-selling-business-ideas", "reselling-business-ideas", "digital-marketing-business-ideas", "social-media-service-business-ideas", "work-from-home-business-ideas", "home-kitchen-food-business-ideas", "fashion-and-apparel-business-ideas"], match: "(ads|advert|instagram|facebook|google|online|customers|promot|marketing|sell)", limit: 10 },
    {
      type: "chips",
      heading: "Deeper answers founders ask for",
      items: [
        { label: "Customer acquisition cost", href: "/what-is-customer-acquisition-cost-for-a-small-business-in-india" },
        { label: "Product-market fit", href: "/how-to-know-if-your-business-has-product-market-fit-in-india" },
        { label: "Competitor analysis", href: "/how-to-do-competitor-analysis-for-a-small-business-in-india" },
        { label: "Common mistakes to avoid", href: "/common-mistakes-to-avoid-when-starting-a-business-in-india" },
      ],
    },
    {
      type: "chips",
      heading: "People also search for",
      items: [
        { label: "How to validate a business idea in India", href: "/how-to-validate-a-business-idea-in-india" },
        { label: "How to validate an online selling idea", href: "/how-to-validate-an-online-selling-business-idea-in-india" },
        { label: "How to validate a food business idea", href: "/how-to-validate-a-food-business-idea-in-india" },
        { label: "Online business ideas", href: "/online-business-ideas-india" },
        { label: "Side business ideas", href: "/side-business-ideas-india" },
        { label: "Digital marketing business ideas", href: "/category/digital-marketing-business-ideas" },
      ],
    },
    { ...CTA, heading: "Ready to test your idea with real buyers?", body: "Plan your offer, budget and pass mark in the free demand test planner, then run your first ad test this week.", button: { label: "Plan my demand test", href: "/business-demand-test-india" } },
    TOOLS,
    CALCS,
    {
      type: "chips",
      heading: "Related resources",
      items: [
        { label: "Launch evidence plan", href: "/startup-launch-plan-india" },
        { label: "Weekend market stall check", href: "/weekend-market-stall-profit-check" },
        { label: "Validation field guide", href: "/startup-idea-validation" },
        { label: "Founder glossary", href: "/founder-glossary" },
      ],
    },
    {
      type: "takeaways",
      heading: "Rules worth knowing",
      intro: "Rules change; check the official pages in Sources.",
      items: [
        "Ads in India are expected to follow the [ASCI](https://www.ascionline.in/) code: honest claims, no misleading comparisons, and clear disclosure for paid influencer posts.",
        "Food sellers should show their FSSAI registration or licence number.",
        "Health, finance, education-result and \"guaranteed income\" claims draw extra scrutiny; keep them factual.",
        "Collect only the customer details you need, keep them safe, and do not add people to broadcast lists without their consent.",
        "Ad bills from Meta and Google carry GST; if you are GST registered, ask your accountant about input tax credit.",
      ],
    },
    { type: "sources", heading: "Sources", items: [{ label: "Meta Business Help Centre", href: "https://www.facebook.com/business/help" }, { label: "Google Ads Help", href: "https://support.google.com/google-ads/" }, ASCI, { label: "WhatsApp Business", href: "https://business.whatsapp.com/" }, SRC.npci, FSSAI, { label: "Google Business Profile", href: "https://www.google.com/business/", note: "Free local listing." }] },
  ],
};
