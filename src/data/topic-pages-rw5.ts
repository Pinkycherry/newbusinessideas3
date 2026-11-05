import type { TopicPage } from "@/bought/topic-page";
import { PARENT, UPDATED, UPDATED_ON, IMG, SRC, TOOLS, CALCS, EXPLORE, CTA } from "./topic-pages-shared";

const CENSUS = { label: "Census of India", href: "https://censusindia.gov.in/", note: "Population and household counts by state, district and town." };
const OGD = { label: "Open Government Data Platform India", href: "https://data.gov.in/", note: "Government datasets you can filter by sector and region." };
const MOSPI = { label: "Ministry of Statistics (MoSPI)", href: "https://www.mospi.gov.in/", note: "Household consumption, enterprise and labour surveys." };
const UDISE = { label: "UDISE+ school data (Ministry of Education)", href: "https://udiseplus.gov.in/", note: "School and enrolment counts down to block level." };

/**
 * Rewrite 5 (owner review: previous version failed as thin and generic).
 * Seller layout: question page (/questions/what-is-tam), sections in the seller's order:
 * takeaways, step by step, benchmarks, pitfalls, real situations, FAQ, expert tips, sources,
 * related questions, CTA, keep reading, deeper answers, tools, calculators, explore.
 * No researched figures: every number is a [Validate: ...] marker or a blank the reader fills in.
 */
export const tam: TopicPage = {
  slug: "how-to-calculate-tam-sam-som-for-a-business-in-india",
  updated: UPDATED_ON,
  sellerRef: "https://ideaproof.io/questions/what-is-tam",
  parent: PARENT,
  explore: { guideCategory: "Market Sizing", categories: ["local-service-business-ideas", "home-kitchen-food-business-ideas", "tuition-and-coaching-business-ideas", "e-commerce-selling-business-ideas", "accounting-and-compliance-service-business-ideas", "village-and-small-town-business-ideas", "dairy-and-milk-product-business-ideas", "retail-shop-business-ideas"] },
  seo: {
    title: "How to Calculate TAM, SAM and SOM for a Business in India: Bottom-Up Method and Worksheet",
    description: "TAM, SAM and SOM in plain words for Indian founders: count real buyers in your ward, town or district with Census, UDISE+ and your own street survey, work out yearly spend, and size what you can actually serve. Worksheet, examples and a 7-day plan.",
  },
  hero: {
    eyebrow: "TAM, SAM, SOM",
    h1: "How to Calculate TAM, SAM and SOM for a Business in India",
    highlight: "TAM, SAM and SOM",
    intro: "\"India is a huge country, so my market is huge\" is the most common line in Indian pitch decks, and the least useful. Your real market is the buyers you can reach, serve and win with your time, money, language and delivery area. This page shows you how to count them honestly, street by street, with sources a bank manager or an investor will believe.",
    sub: "You will build your numbers **bottom-up**: count buyers you can name, multiply by what they spend today, then cut down to what your kitchen, van, team or classroom can handle.",
    updated: UPDATED,
    primary: { label: "Size my market", href: "#step-by-step-the-bottom-up-method-for-indian-founders" },
    secondary: { label: "Validate my idea", href: "/how-to-validate-a-business-idea-in-india" },
    image: IMG.metrics,
    imageAlt: "Sizing a market from total to reachable buyers",
  },
  sections: [
    {
      type: "takeaways",
      heading: "Key takeaways",
      items: [
        "**TAM (total addressable market)** is everyone in India who could ever buy this kind of product or service, valued at what they spend on it in a year.",
        "**SAM (serviceable available market)** is the part of TAM you can actually serve with your product, price, language and delivery area. For most small businesses this is a ward, a town or a district, not India.",
        "**SOM (serviceable obtainable market)** is the share of SAM you can realistically win in the next one to three years, limited by your capacity, your money and your competitors.",
        "**For a local business, SOM is the number that matters.** It decides whether the business can pay you a salary. TAM matters mainly when you talk to investors or plan to expand to many cities.",
        "**Build bottom-up.** Count buyers you can see (households, schools, shops, clinics, societies), multiply by what they spend today, and write the source next to every number.",
        "**A small, sourced number beats a big, borrowed one.** Bank officers and angels have seen \"1% of India\" too many times. A count of the shops on three market roads is far more convincing.",
      ],
    },
    {
      type: "rich",
      heading: "Step by step: the bottom-up method for Indian founders",
      intro: "Keep a notebook open. Every number you write gets a source next to it.",
      blocks: [
        { kind: "h3", text: "Step 1: Write one buyer and one purchase" },
        { kind: "p", text: "Be exact. Not \"working people\", but \"a working couple in a gated society in Whitefield who buy a weekday lunch tiffin\". Not \"students\", but \"parents of Class 9 and 10 students in CBSE schools in Ludhiana who pay for maths tuition\". The narrower the line, the easier it is to count. If your business has two different buyers (for example, shops that stock your snacks and families who buy them), size each one separately." },
        { kind: "h3", text: "Step 2: Count the buyers in your area" },
        { kind: "p", text: "Use the source that fits your buyer. These are free and Indian:" },
        { kind: "list", items: [
          "**Households and population:** [Census of India](https://censusindia.gov.in/) tables for your district and town. Census data ages, so cross-check with your own count of new societies and colonies.",
          "**Schools and students:** [UDISE+](https://udiseplus.gov.in/) lists schools and enrolment down to block level.",
          "**Shops and small businesses:** walk the market roads and count, ask the traders' association or the vyapari mandal for its member list, or check the [Udyam](https://udyamregistration.gov.in/) and GST data published for your district on [data.gov.in](https://data.gov.in/).",
          "**Housing societies and flats:** the RWA or society office, builders' brochures, the electricity board's connection counts if published, or your own walk with a notebook.",
          "**Clinics, gyms, salons, coaching centres:** Google Maps search in your area, then visit a sample to check they still exist.",
          "**Villages:** the panchayat office, the anganwadi worker, the SHG federation, the milk society and the ration shop all know how many households they serve.",
        ] },
        { kind: "h3", text: "Step 3: Find what one buyer spends in a year" },
        { kind: "p", text: "Do not guess. Ask in your [customer conversations](/how-to-talk-to-customers-before-starting-a-business-in-india): \"What did you spend on this last month?\" and \"How many months a year do you buy it?\" Write the answers of at least ten buyers and take the middle answer, not the highest. Check today's local prices for the same product or service too. [Validate: typical monthly spend per household on this product or service in my city]" },
        { kind: "h3", text: "Step 4: Work out SAM" },
        { kind: "p", text: "SAM = buyers you can reach and serve × yearly spend per buyer. \"Reach and serve\" means within your delivery radius, in a language you speak, at a price band you can match and through channels you can use. A Tamil-speaking home tutor in Madurai cannot count Hindi-medium students in Bhopal in her SAM." },
        { kind: "h3", text: "Step 5: Cut down to SOM" },
        { kind: "p", text: "Now ask what you can actually win and deliver. Two limits apply, and you take the smaller one:" },
        { kind: "list", items: [
          "**Capacity limit:** how many tiffins your kitchen makes, how many students your room fits per batch, how many jobs your one van can do in a day, how many returns you can file with one assistant.",
          "**Competition limit:** how many buyers you can pull away from existing options, given how loyal they are and how much better or cheaper you are. Our [competitor analysis guide](/how-to-do-competitor-analysis-for-a-small-business-in-india) helps here.",
        ] },
        { kind: "h3", text: "Step 6: Only then scale up to TAM" },
        { kind: "p", text: "Repeat your count for other towns like yours, or use a published national figure as a cross-check, with the source named. [Validate: latest published India market size for this sector and its source] If your bottom-up TAM and the published figure are wildly apart, find out why before you show either to anyone." },
        { kind: "h3", text: "Worked rupee example: a home tiffin service in one city" },
        { kind: "table", columns: ["Line", "How to work it out", "Your figure"], rows: [
          ["Target households", "Working-couple households in the societies within your delivery radius (society office counts or your walk)", "______"],
          ["Share who buy a cooked-meal service", "From ten or more conversations: how many already buy tiffin, cook or order daily", "______ %"],
          ["Buying households", "Target households × share", "______"],
          ["Yearly spend per household", "Monthly tiffin spend they told you × months a year they buy", "₹ ______"],
          ["**SAM**", "Buying households × yearly spend", "₹ ______"],
          ["Capacity", "Tiffins your kitchen can make and deliver per day × working days", "______ tiffins a year"],
          ["**SOM (capacity)**", "Capacity × your price per tiffin", "₹ ______"],
          ["**SOM (realistic share)**", "The share of buying households you can win from existing cooks and services in your first year", "₹ ______"],
          ["**Your SOM**", "The smaller of the two lines above", "₹ ______"],
        ] },
        { kind: "p", text: "If your SOM, after costs, cannot pay you a fair monthly income, the idea needs a wider area, a higher price, a second product or more capacity. Check costs with the [startup cost calculator](/calculator/startup-cost) and the [break-even calculator](/calculator/break-even)." },
      ],
    },
    {
      type: "rich",
      heading: "TAM, SAM and SOM for Indian ideas (method, not numbers)",
      blocks: [
        { kind: "table", columns: ["Idea", "TAM: who could buy", "SAM: who you can serve", "SOM: who you can win soon"], rows: [
          ["Home tiffin service", "Families and workers buying cooked meals across India", "Buying households within your delivery radius", "Tiffins your kitchen can make and deliver each day"],
          ["GST and Tally filing service", "Small businesses that need bookkeeping and returns", "Traders in your district who prefer your language and want in-person help", "Clients you and one assistant can handle each month"],
          ["Maths tuition for Class 9–10", "All Class 9–10 students who take paid tuition", "Students in schools within a short commute, in your board and medium", "Batches your room and your evenings can fit"],
          ["Handmade toys sold online", "Parents buying toys online in India", "Buyers reached through the marketplaces and social apps you use", "Orders you can make, pack and ship each month"],
          ["Doorstep milk delivery", "Households that buy packaged or loose milk", "Flats in societies on your delivery route", "Litres your supplier and your morning route can handle"],
          ["Two-wheeler service garage", "Two-wheeler owners in India", "Owners within a short ride of your garage", "Bikes you and your mechanics can service per day"],
        ] },
        { kind: "h3", text: "How the size changes from metro to village" },
        { kind: "list", items: [
          "**Metros:** many buyers in a small radius, so SAM can be large even inside one pin code. But many competitors share it, so the competition limit usually sets your SOM.",
          "**Tier 2 cities:** fewer competitors per buyer, and buyers stay loyal once they trust you. SOM is often set by your capacity and your reach.",
          "**Tier 3 towns:** the whole town may be your SAM. Spend per buyer is often lower, so check that SOM can still pay you a living.",
          "**Villages and clusters:** count several nearby villages as one SAM if you can reach them on a weekly route or through the haat. Trust and the SHG or panchayat network decide your SOM.",
        ] },
        { kind: "h3", text: "How it changes by sector" },
        { kind: "list", items: [
          "**Daily-use goods and services** (milk, tiffin, laundry): small spend per buyer but bought every day, so yearly spend adds up. Delivery radius matters most.",
          "**Occasional services** (wedding décor, home painting, repairs): high spend per buyer, few purchases per year. Your SAM must cover a wide area.",
          "**B2B services** (bookkeeping, digital marketing for shops): count businesses, not people. Trade association lists and Google Maps are your best sources.",
          "**Online products:** SAM is defined by the channels you sell on and the languages you write in, not by your city.",
        ] },
      ],
    },
    {
      type: "rich",
      heading: "Common market-size mistakes Indian founders make",
      blocks: [
        { kind: "h3", text: "Starting from India's population" },
        { kind: "p", text: "\"If just 1% of Indians buy\" is a guess, not a size. Most people will never buy your product. Start from buyers you can count." },
        { kind: "h3", text: "Using a global or national report for a local business" },
        { kind: "p", text: "A report on India's food delivery market tells you nothing about how many families in your Nagpur colony want a tiffin. Use it only as a cross-check for TAM." },
        { kind: "h3", text: "Counting people who cannot pay your price" },
        { kind: "p", text: "Every household in your town is not a buyer of an organic, premium or English-medium product. Filter by the price band you have tested." },
        { kind: "h3", text: "Forgetting that buyers already have a solution" },
        { kind: "p", text: "The family cook, the mother-in-law's cooking, the kirana's credit, the uncle who does the accounts: these are your real competitors, and they set your SOM more than other businesses do." },
        { kind: "h3", text: "Confusing SOM with ambition" },
        { kind: "p", text: "SOM is what you can deliver, not what you hope. If your kitchen can make only a limited number of tiffins a day, your SOM cannot be the whole city." },
        { kind: "h3", text: "No source next to the numbers" },
        { kind: "p", text: "A bank officer reading your [project report](/how-to-write-a-business-plan-for-a-bank-loan-in-india) will ask where each number came from. \"I counted\" with a date and the roads counted is a perfectly good answer." },
      ],
    },
    {
      type: "cards",
      heading: "Real situations from India",
      intro: "Everyday examples of founders sizing a market honestly. Check your own figures with the Validate button.",
      items: [
        { title: "Dairy delivery, Coimbatore", body: "Counting flats in five societies near his supplier gave a believable SAM. His single morning route could serve only one society at first, so that became his first-year SOM, and he planned a second route only after it filled." },
        { title: "GST filing service, Indore", body: "She took the member list of a traders' association, called a sample and met twenty in person. That bottom-up count convinced her bank far more than a national figure would have." },
        { title: "Marathi lessons for children, online", body: "Instead of \"all smartphone users\", he sized the market as Marathi families living outside Maharashtra who want their children to read and write Marathi, reached through community groups and mandals in other cities." },
        { title: "Mobile repair kiosk, Gorakhpur", body: "He counted phone shops, footfall at the bus stand and the number of repairs the nearest kiosk did on a Saturday. His SOM was set by how many repairs he could finish in a day, not by phone ownership in the district." },
        { title: "Village tailoring unit, Bhilwara district", body: "Through the SHG federation she counted women in seven nearby villages who stitch blouses for weddings. Her SAM was the cluster; her SOM was the orders she and two helpers could finish before each wedding season." },
      ],
    },
    { type: "dbfaq", heading: "Market size questions founders ask", intro: "Real questions from our published idea guides about demand and market size. More on our [founder FAQ page](/faq).", categories: ["local-service-business-ideas", "home-kitchen-food-business-ideas", "tuition-and-coaching-business-ideas", "e-commerce-selling-business-ideas", "village-and-small-town-business-ideas", "retail-shop-business-ideas", "home-based-business-ideas", "food-business-ideas"], match: "(demand|market|customers? (are|in)|how many|scope|potential|competition|is there)", limit: 10 },
    {
      type: "rich",
      heading: "Expert tips",
      blocks: [
        { kind: "list", items: [
          "**Do the count on paper first**, then move it to a sheet. Writing by hand makes you question each number.",
          "**Ask ten buyers what they spend today.** Their answers beat any report for a local business.",
          "**Size one city or one ward well before you size India.** Investors trust a tested city more than a national guess.",
          "**Show your SOM next to your capacity.** A bank or investor wants to see that you know your own limits.",
          "**Redo your sizing every six months.** New societies, a new school or a new competitor can change it quickly.",
          "**Use it to choose between ideas.** Run the same worksheet on two or three ideas from our [idea lists](/lists) and pick the one with the healthiest SOM, not the biggest TAM.",
        ] },
        { kind: "checklist", title: "Market-size worksheet", items: [
          "One-line buyer and purchase: ______",
          "Source for the buyer count, with date: ______",
          "Number of buyers you can reach and serve: ______",
          "Yearly spend per buyer, from at least ten conversations: ₹ ______",
          "SAM = buyers × yearly spend: ₹ ______",
          "Capacity per year: ______ units, orders or students",
          "SOM = smaller of capacity value and realistic share: ₹ ______",
          "Published TAM figure for cross-check, with source: ______",
        ] },
      ],
    },
    { type: "sources", heading: "Sources", items: [CENSUS, UDISE, OGD, MOSPI, SRC.udyam, SRC.gst, { label: "Ministry of MSME", href: "https://msme.gov.in/", note: "Annual reports and MSME data by state." }] },
    {
      type: "chips",
      heading: "Related questions",
      items: [
        { label: "How to validate a business idea in India", href: "/how-to-validate-a-business-idea-in-india" },
        { label: "How to talk to customers before starting a business", href: "/how-to-talk-to-customers-before-starting-a-business-in-india" },
        { label: "How to do competitor analysis for a small business", href: "/how-to-do-competitor-analysis-for-a-small-business-in-india" },
        { label: "How to check if your business idea is good", href: "/how-to-check-if-your-business-idea-is-good-in-india" },
        { label: "What is customer acquisition cost?", href: "/what-is-customer-acquisition-cost-for-a-small-business-in-india" },
      ],
    },
    { ...CTA, heading: "Count real buyers, not India's population.", body: "Walk one market road or call one society office this week, and write down a number you can defend. Then check the biggest risk in your idea for free." },
    {
      type: "rich",
      heading: "What to do this week",
      blocks: [
        { kind: "table", columns: ["Day", "Task"], rows: [
          ["Day 1", "Write your one-line buyer and purchase; pick the source that fits it"],
          ["Day 2", "Get the count: Census or UDISE+ table, association list, society office, or a walk with a notebook"],
          ["Day 3", "Talk to five buyers and ask what they spend today and how often"],
          ["Day 4", "Talk to five more; take the middle spend figure"],
          ["Day 5", "Work out SAM and your capacity; write your SOM"],
          ["Day 6", "Check your SOM against costs with the [break-even calculator](/calculator/break-even)"],
          ["Day 7", "Decide: is the SOM enough to pay you? If not, widen the area, add a product or pick another idea"],
        ] },
      ],
    },
    {
      type: "cards",
      heading: "Keep reading",
      items: [
        { title: "Market sizing guide", body: "A longer walk-through of TAM, SAM and SOM.", href: "/startup-guides/tam-sam-som-market-sizing", cta: "Read" },
        { title: "Business idea research", body: "Find real data before you decide.", href: "/business-idea-research-india", cta: "Read" },
        { title: "Local business ideas", body: "Ideas where your SOM is your own neighbourhood.", href: "/local-business-ideas-india", cta: "Browse" },
      ],
    },
    {
      type: "chips",
      heading: "Deeper answers founders ask for",
      items: [
        { label: "Product-market fit", href: "/how-to-know-if-your-business-has-product-market-fit-in-india" },
        { label: "Business plan for a bank loan", href: "/how-to-write-a-business-plan-for-a-bank-loan-in-india" },
        { label: "How to raise funds for a startup", href: "/how-to-raise-funds-for-a-startup-in-india" },
        { label: "Village and small town business ideas", href: "/category/village-and-small-town-business-ideas" },
        { label: "Accounting and compliance service ideas", href: "/category/accounting-and-compliance-service-business-ideas" },
        { label: "Founder glossary", href: "/founder-glossary" },
      ],
    },
    TOOLS,
    CALCS,
    EXPLORE,
  ],
};
