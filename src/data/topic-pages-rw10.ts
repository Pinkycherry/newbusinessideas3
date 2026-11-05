import type { TopicPage } from "@/bought/topic-page";
import { PARENT, UPDATED, UPDATED_ON, IMG, SRC, TOOLS, CALCS, EXPLORE, CTA } from "./topic-pages-shared";

const WAB = { label: "WhatsApp Business", href: "https://business.whatsapp.com/", note: "Catalogue, quick replies and labels for small businesses." };
const FSSAI = { label: "FSSAI FoSCoS: food business registration", href: "https://foscos.fssai.gov.in/", note: "Registration or licence for every food business, by size." };

/**
 * Rewrite 10 (owner review: previous version failed as thin and generic).
 * Seller layout: question page (/questions/how-to-build-mvp), sections in the seller's order:
 * takeaways, step by step, benchmarks, pitfalls, real situations, FAQ, expert tips, sources, compare,
 * related questions, CTA, keep reading, deeper answers, tools, calculators, explore.
 * No researched figures: every number is a [Validate: ...] marker or a blank the reader fills in.
 */
export const mvp: TopicPage = {
  slug: "how-to-build-an-mvp-with-low-investment-in-india",
  updated: UPDATED_ON,
  sellerRef: "https://ideaproof.io/questions/how-to-build-mvp",
  parent: PARENT,
  explore: { guideCategory: "Launch & Ops", categories: ["cloud-kitchen-business-ideas", "fashion-and-apparel-business-ideas", "web-and-app-service-business-ideas", "trading-and-wholesale-business-ideas", "education-business-ideas", "rental-and-hiring-business-ideas", "wedding-service-business-ideas", "online-business-ideas"] },
  seo: {
    title: "How to Build an MVP With Low Investment in India: WhatsApp, UPI and Manual-First Steps",
    description: "Build a minimum viable product in India for very little: pick your riskiest guess, sell it through a WhatsApp catalogue, Instagram, a Google Form, a first batch or a manual service, take UPI payment, and measure. Options by business type, costs worksheet, mistakes and a 14-day plan.",
  },
  hero: {
    eyebrow: "Build an MVP",
    h1: "How to Build an MVP With Low Investment in India",
    highlight: "MVP",
    intro: "An MVP, or minimum viable product, is the smallest thing you can sell to find out whether people really want what you plan to build. In India it is usually not an app. It is a WhatsApp catalogue, a UPI QR code, a first small batch and you, doing the work by hand. Many founders spend their savings on an app, a shop or a machine before a single stranger has paid. This page helps you do it the other way round.",
    sub: "You will pick the one guess that could sink your idea, choose the cheapest way to test it, take real payment, and decide within two weeks whether to build more.",
    updated: UPDATED,
    primary: { label: "Build mine", href: "#step-by-step-how-to-build-your-mvp" },
    secondary: { label: "Validate first", href: "/how-to-validate-a-business-idea-in-india" },
    image: IMG.hub,
    imageAlt: "A simple first version of a product",
  },
  sections: [
    {
      type: "takeaways",
      heading: "Key takeaways",
      items: [
        "**Your MVP must be something people can pay for**, not just look at or like. A real UPI payment from a stranger is the test.",
        "**Test your riskiest guess, not everything.** Will people pay this price? Will shops reorder? Will students come every week? Build only what answers that.",
        "**Do things that don't scale first**: deliver yourself, take orders on WhatsApp, track in a notebook, cook in your own kitchen, teach on a video call.",
        "**Many Indian buyers are happy ordering by WhatsApp or phone.** An app is rarely the first thing you need.",
        "**Spend on an app, a shop, machines or a brand only after the MVP shows repeat demand.**",
        "**Set a deadline.** Launch within fourteen days and decide within a few weeks. Endless preparation is how savings disappear.",
      ],
    },
    {
      type: "rich",
      heading: "Step by step: how to build your MVP",
      blocks: [
        { kind: "h3", text: "Step 1: Write the one guess that could kill your idea" },
        { kind: "p", text: "Every idea rests on a few guesses. Pick the riskiest one and write it as a sentence you can prove or disprove: \"Office workers in Guindy will pay my price for a millet breakfast jar every week.\" \"Kirana shops in my ward will reorder my namkeen within two weeks.\" \"Parents will pay for a weekend robotics class without a big brand name.\" If you have not spoken to buyers yet, start with [how to talk to customers](/how-to-talk-to-customers-before-starting-a-business-in-india)." },
        { kind: "h3", text: "Step 2: Choose the simplest form that tests it" },
        { kind: "list", items: [
          "**Products:** a small first batch, made by hand or through a job-worker, sold to a list of people.",
          "**Food:** a fixed weekly menu on WhatsApp, pre-orders only, delivered by you.",
          "**Services:** do the job yourself for the first few customers; a phone number and a notebook are your app.",
          "**Marketplaces and platforms:** connect buyers and sellers manually through a WhatsApp group and a Google Sheet.",
          "**Online courses and coaching:** a live batch on a video call before you record or build anything.",
          "**Software:** a clickable mock-up or a spreadsheet tool, or do the work manually behind a simple form (often called a \"concierge\" MVP).",
          "**Physical shops:** a weekend stall, a corner in an existing shop or an exhibition stall before a lease. Use the [weekend market stall check](/weekend-market-stall-profit-check).",
        ] },
        { kind: "h3", text: "Step 3: Set up the basics for free or nearly free" },
        { kind: "checklist", title: "Low-cost MVP kit", items: [
          "WhatsApp Business with a catalogue, quick replies and labels",
          "A UPI QR code linked to a separate bank account",
          "An Instagram or Facebook page with clear photos taken on your phone",
          "A Google Form for orders or bookings, and a Google Sheet to track them",
          "A free Google Business Profile if you serve a local area",
          "Plain, clean, labelled packaging for products",
          "FSSAI basic registration if you sell food, even in a test",
        ] },
        { kind: "h3", text: "Step 4: Launch to your interview list first" },
        { kind: "p", text: "The people you spoke to are your first buyers. Message each one personally, not a broadcast. Then share in two or three relevant groups (society, school parents, office, trade) with permission from the admin." },
        { kind: "h3", text: "Step 5: Take real payment" },
        { kind: "p", text: "Charge your intended price, or close to it. A small discount for early buyers is fine; free is not. Free tells you almost nothing about demand. Take UPI advances for pre-orders." },
        { kind: "h3", text: "Step 6: Measure, then change one thing at a time" },
        { kind: "p", text: "Track orders, repeat orders, complaints, delivery time and the hours each order takes you. Call every first-time buyer after a week and ask what to improve. Change only one thing at a time (price, menu, delivery area, pack size) so you know what worked. Read [product-market fit](/how-to-know-if-your-business-has-product-market-fit-in-india) for the signs to watch." },
        { kind: "h3", text: "Worked rupee example: MVP cost sheet for a clothing brand" },
        { kind: "table", columns: ["Line", "How to work it out", "Your figure"], rows: [
          ["Fabric for a few designs", "Metres per piece × pieces × price per metre from the wholesale market", "₹ ______"],
          ["Stitching", "Pieces × the local tailor's or job-worker's rate", "₹ ______"],
          ["Labels and packaging", "Smallest order lot from a local printer", "₹ ______"],
          ["Photos", "Your phone and a plain wall; a friend as model", "₹ ______"],
          ["Shipping first orders", "Orders × courier charge for your zone", "₹ ______"],
          ["Promotion", "Small boosts or samples to two or three creators", "₹ ______"],
          ["**Total MVP spend**", "Add the lines", "₹ ______"],
          ["Orders needed to recover it", "Total ÷ profit per piece", "______"],
        ] },
        { kind: "p", text: "Check today's job-work and courier rates in your area before you start. [Validate: current stitching job-work rate per piece and courier charge per order in my city]" },
      ],
    },
    {
      type: "rich",
      heading: "MVP options for common Indian businesses",
      blocks: [
        { kind: "table", columns: ["Business", "Simple MVP", "What it tests"], rows: [
          ["Cloud kitchen", "A fixed weekly menu on WhatsApp, pre-orders only, from your home kitchen", "Taste, price and repeat orders"],
          ["Clothing brand", "A few designs, made to order, sold on Instagram and WhatsApp", "Which designs and sizes sell"],
          ["Local services app", "A phone number and a Google Sheet of service partners", "Whether customers book and pay"],
          ["B2B supply to shops", "Deliver to five shops yourself on a two-wheeler", "Whether shops reorder"],
          ["Online course", "A live batch on a video call", "Whether students pay and finish"],
          ["Equipment rental (tractor, camera, party items)", "Rent out one item you own, bookings by phone", "Demand, pricing and damage risk"],
          ["Event and wedding service", "A small family function at cost for photos and testimonials", "Quality, timing and referrals"],
          ["Software for small businesses", "A shared spreadsheet or a no-code form doing the job for a few shops", "Whether owners use it weekly and pay"],
        ] },
        { kind: "h3", text: "Metro, tier 2, tier 3 and village" },
        { kind: "list", items: [
          "**Metros:** Instagram and WhatsApp reach buyers fast; delivery is your main cost. Test in one or two pin codes only.",
          "**Tier 2 cities:** local pages, school and society groups and exhibitions work well. People trust a face; show yours.",
          "**Tier 3 towns:** a counter in a known shop, a stall at the weekly market or a local fair is often the best MVP.",
          "**Villages:** the SHG meeting, the haat and the dealer's shop are your channels. Bookings by phone call are normal.",
        ] },
      ],
    },
    {
      type: "rich",
      heading: "MVP mistakes Indian founders make",
      blocks: [
        { kind: "h3", text: "Building an app first" },
        { kind: "p", text: "App development quotes are tempting, but an app is the most expensive way to find out nobody wants your service. Test demand with WhatsApp and a phone first; build software when the manual way is breaking under real orders." },
        { kind: "h3", text: "Making it free" },
        { kind: "p", text: "Free samples get thanks, not evidence. Charge something, even with an early-bird discount." },
        { kind: "h3", text: "Perfect branding before proof" },
        { kind: "p", text: "Logo designers, custom boxes and a fancy website can wait. Plain, clean and labelled is enough for the first batch." },
        { kind: "h3", text: "Testing too many things at once" },
        { kind: "p", text: "If you change price, menu and area together, you will not know what worked. One change per round." },
        { kind: "h3", text: "Selling only to friends and relatives" },
        { kind: "p", text: "Their orders are kind, not proof. Count strangers and repeat strangers separately." },
        { kind: "h3", text: "Skipping the basic registration" },
        { kind: "p", text: "Even a food test needs FSSAI basic registration. Udyam is free once you sell regularly. Avoid shortcuts that cause trouble later." },
      ],
    },
    {
      type: "cards",
      heading: "Real situations from India",
      intro: "Everyday examples of MVPs that cost very little.",
      items: [
        { title: "Millet breakfast brand, Chennai", body: "Sold jars to office colleagues through a Google Form and UPI before talking to any shop. Repeat orders from strangers in other teams told her the idea worked." },
        { title: "Tractor rental, rural Punjab", body: "The founder took bookings by phone for his own tractor for one season before building any app. He learnt which weeks were busiest and what farmers would pay." },
        { title: "Wedding planning, Jaipur", body: "Planned two small family functions at cost to build a portfolio and testimonials before charging full fees." },
        { title: "Robotics class, Pune", body: "Ran a weekend batch in a borrowed school room with kits she already had. Parents' re-enrolment for the next term was her proof before renting a centre." },
        { title: "Namkeen supply, Indore", body: "Delivered small packs to five kirana shops on his scooter. Three reordered within two weeks; he then spoke to a distributor." },
        { title: "Billing tool for clinics, Kochi", body: "A developer set up a shared spreadsheet and WhatsApp reminders for three clinics manually. When they asked to pay, he started building the software." },
      ],
    },
    { type: "dbfaq", heading: "MVP and first-version questions founders ask", intro: "Real questions from our published idea guides about starting small. More on our [founder FAQ page](/faq).", categories: ["cloud-kitchen-business-ideas", "fashion-and-apparel-business-ideas", "web-and-app-service-business-ideas", "online-business-ideas", "education-business-ideas", "rental-and-hiring-business-ideas", "home-based-business-ideas", "food-business-ideas"], match: "(start small|small scale|low investment|first|test|trial|sample|from home|without)", limit: 10 },
    {
      type: "rich",
      heading: "Expert tips",
      blocks: [
        { kind: "list", items: [
          "**Set a deadline: launch within fourteen days.** Anything that cannot launch in two weeks is too big for an MVP.",
          "**Keep a notebook of every order and every complaint.** It becomes your product plan.",
          "**Call every first-time buyer after a week.** Ask what to improve and whether they would order again.",
          "**Write a pass mark before you start**: \"Continue if strangers reorder within the first few weeks.\" Then honour it.",
          "**Use the [demand test planner](/business-demand-test-india)** to set up the test and the [pivot or stop guide](/business-idea-pivot-or-stop) to decide.",
          "**Price it properly from day one** with the [first-price workbench](/business-pricing-india), so the test tells you about real demand.",
        ] },
        { kind: "callout", title: "When to stop being manual", text: "Move from manual to tools when you are turning away orders, making mistakes because of volume, or spending more hours on admin than on making and selling. That is the moment to spend on software, staff or machines." },
      ],
    },
    { type: "sources", heading: "Sources", items: [WAB, SRC.npci, SRC.udyam, FSSAI, SRC.ondc, { label: "Google Business Profile", href: "https://www.google.com/business/", note: "Free local listing." }] },
    {
      type: "table",
      heading: "Compare your options",
      columns: ["Approach", "Cost", "Speed", "When to choose"],
      rows: [
        ["Manual service + WhatsApp + UPI", "Very low", "Days", "Almost always, first"],
        ["Weekend stall or shared shop", "Low", "A week", "Physical products and food"],
        ["No-code tools (forms, sheets, site builders)", "Low", "A week or two", "When orders grow beyond what you can track by hand"],
        ["Marketplace listing (Amazon, Flipkart, Meesho, ONDC)", "Low to medium", "A few weeks", "When you have stock and want reach beyond your city"],
        ["Custom app or software", "High", "Months", "After proven demand, when the manual way breaks"],
      ],
    },
    {
      type: "chips",
      heading: "Related questions",
      items: [
        { label: "How to talk to customers before starting a business", href: "/how-to-talk-to-customers-before-starting-a-business-in-india" },
        { label: "How to know if your business has product-market fit", href: "/how-to-know-if-your-business-has-product-market-fit-in-india" },
        { label: "How much money is needed to start a business?", href: "/how-much-money-is-needed-to-start-a-business-in-india" },
        { label: "How to start a business without investors", href: "/how-to-start-a-business-without-investors-in-india" },
        { label: "How to validate an online selling business idea", href: "/how-to-validate-an-online-selling-business-idea-in-india" },
      ],
    },
    { ...CTA, heading: "Sell the small version before you build the big one.", body: "Write your riskiest guess tonight and launch a test within fourteen days. Then check the other risks in your idea, free." },
    {
      type: "rich",
      heading: "What to do this week",
      blocks: [
        { kind: "table", columns: ["Day", "Task"], rows: [
          ["Day 1", "Write your riskiest guess and your pass mark"],
          ["Day 2", "Pick the simplest MVP form from the table above"],
          ["Day 3", "Set up WhatsApp Business, a UPI QR on a separate account and an order sheet"],
          ["Day 4", "Make the first small batch, menu, class plan or service offer; take phone photos"],
          ["Day 5", "Message everyone from your customer conversations personally"],
          ["Day 6", "Take the first paid orders; deliver yourself"],
          ["Day 7", "Call your first buyers; note what to change; plan week two"],
        ] },
      ],
    },
    {
      type: "cards",
      heading: "Keep reading",
      items: [
        { title: "MVP development guide", body: "A longer guide to building your first version.", href: "/startup-guides/minimum-viable-product-development", cta: "Read" },
        { title: "Online business ideas", body: "Ideas you can test with a phone and a catalogue.", href: "/online-business-ideas-india", cta: "Browse" },
        { title: "Weekend market stall check", body: "Test a product with real buyers in one weekend.", href: "/weekend-market-stall-profit-check", cta: "Check" },
      ],
    },
    {
      type: "chips",
      heading: "Deeper answers founders ask for",
      items: [
        { label: "How to validate a business idea", href: "/how-to-validate-a-business-idea-in-india" },
        { label: "First-price workbench", href: "/business-pricing-india" },
        { label: "Common mistakes when starting a business", href: "/common-mistakes-to-avoid-when-starting-a-business-in-india" },
        { label: "Cloud kitchen business ideas", href: "/category/cloud-kitchen-business-ideas" },
        { label: "Web and app service business ideas", href: "/category/web-and-app-service-business-ideas" },
        { label: "Startup terms in plain words", href: "/startup-terms-india" },
      ],
    },
    TOOLS,
    CALCS,
    EXPLORE,
  ],
};
