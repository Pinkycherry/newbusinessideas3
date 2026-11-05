import type { TopicPage } from "@/bought/topic-page";
import { PARENT, UPDATED, UPDATED_ON, IMG, TOOLS, CALCS, EXPLORE, CTA } from "./topic-pages-shared";

const OGD = { label: "Open Government Data Platform India", href: "https://data.gov.in/", note: "Find where your buyers are, by district and sector." };
const CENSUS = { label: "Census of India", href: "https://censusindia.gov.in/", note: "Population, households and languages by district." };

/**
 * Rewrite 9 (owner review: previous version failed as thin and generic).
 * Seller layout: question page (/questions/conduct-customer-interviews), sections in the seller's order:
 * takeaways, step by step, benchmarks, pitfalls, real situations, FAQ, expert tips, sources,
 * related questions, CTA, keep reading, deeper answers, tools, calculators, explore.
 * No researched figures.
 */
export const interviews: TopicPage = {
  slug: "how-to-talk-to-customers-before-starting-a-business-in-india",
  updated: UPDATED_ON,
  sellerRef: "https://ideaproof.io/questions/conduct-customer-interviews",
  parent: PARENT,
  explore: { guideCategory: "Validation", categories: ["local-service-business-ideas", "home-kitchen-food-business-ideas", "tuition-and-coaching-business-ideas", "agri-input-and-farm-service-business-ideas", "laundry-and-garment-care-business-ideas", "retail-shop-business-ideas", "kids-learning-and-activity-business-ideas", "women-friendly-business-ideas"] },
  seo: {
    title: "How to Talk to Customers Before Starting a Business in India: Questions, Places and Scripts",
    description: "Talk to real buyers before you start a business in India: where to find them (market, society group, mandi, PG, school gate), what to ask in your own language, questions to avoid, a note sheet, how to read the answers and how to close with an advance.",
  },
  hero: {
    eyebrow: "Customer interviews",
    h1: "How to Talk to Customers Before Starting a Business in India",
    highlight: "Talk to Customers",
    intro: "The cheapest way to know whether your idea will work is to sit with ten people who would actually pay, and listen. Not pitch. Not ask \"would you buy this?\". Listen to how they handle the problem today, what it costs them and what annoys them. In India, where people are often too polite to say no to your face, how you ask matters even more than whom you ask.",
    sub: "This page gives you where to find buyers in a city, a small town or a village, the exact questions to ask (and the ones that give you false hope), a note sheet, how to read the answers and how to turn a conversation into an advance.",
    updated: UPDATED,
    primary: { label: "Get the questions", href: "#step-by-step-how-to-run-a-customer-conversation" },
    secondary: { label: "Plan a demand test", href: "/business-demand-test-india" },
    image: IMG.validation,
    imageAlt: "A founder listening to a potential customer",
  },
  sections: [
    {
      type: "takeaways",
      heading: "Key takeaways",
      items: [
        "**Talk to people who match your buyer line, not your friends and family.** Relatives will praise anything you make; strangers who pay are the only honest signal.",
        "**Ask about the past, not the future.** \"When did this last happen to you?\" and \"What did you spend on it?\" get true answers. \"Would you buy this?\" gets polite ones.",
        "**Ten good conversations usually show a pattern.** If ten people describe the same problem in similar words, you have something. If every answer is different, your buyer line is too broad.",
        "**Speak their language and meet them where the problem happens**: the vegetable market at dawn, the society gate in the evening, the mandi at harvest, the school gate at pickup time.",
        "**End every conversation with a small ask**: a sample, a trial order, a UPI advance or the name of someone else to talk to. Words are free; commitments are evidence.",
        "**Write their exact words straight after.** Your memory will soften what they said into what you hoped to hear.",
      ],
    },
    {
      type: "rich",
      heading: "Step by step: how to run a customer conversation",
      blocks: [
        { kind: "h3", text: "Step 1: Write your buyer line" },
        { kind: "p", text: "One sentence: who, where, and what problem. \"Working mothers in Kondapur societies who struggle to send a healthy tiffin to school.\" \"Kirana owners in Ludhiana who lose track of udhaar.\" \"Grape farmers near Nashik who struggle to get labour at harvest.\" If you cannot write this line, start with [how to validate a business idea](/how-to-validate-a-business-idea-in-india)." },
        { kind: "h3", text: "Step 2: Find ten people who match it" },
        { kind: "p", text: "Go where they already are, at a time they are not rushed:" },
        { kind: "list", items: [
          "**Housing societies:** the RWA WhatsApp group (ask the admin first), the evening walk, the society gate, the clubhouse.",
          "**Markets and shops:** visit shopkeepers at quiet hours, usually mid-afternoon; never during the evening rush or on festival days.",
          "**Students and young workers:** PGs and hostels, the canteen, the coaching centre lane, the tea stall near the college or tech park.",
          "**Parents:** the school gate at pickup time, the tuition centre waiting area, the park on weekends.",
          "**Professionals and clinics:** the waiting room with permission, LinkedIn messages, the local association meeting.",
          "**Farmers and rural buyers:** the mandi, the agri-input dealer's shop, the milk collection centre, the panchayat or SHG meeting, the weekly haat.",
          "**Businesses (B2B):** the traders' association, the industrial estate canteen, the wholesale lane, introductions from your CA.",
        ] },
        { kind: "h3", text: "Step 3: Open warmly, without pitching" },
        { kind: "p", text: "Introduce yourself simply: \"I'm trying to understand how families here manage school tiffins. Could I ask you a few questions for ten minutes?\" Offering a chai or meeting at a time that suits them is respectful and common. Do not mention your product yet; the moment you pitch, people become polite instead of honest." },
        { kind: "h3", text: "Step 4: Speak their language" },
        { kind: "p", text: "Use Hindi, English, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada or whatever they are most comfortable in. People explain their problems more honestly in their own language. If you do not speak it, take a friend who does, and let them ask." },
        { kind: "h3", text: "Step 5: Ask about the past" },
        { kind: "list", ordered: true, items: [
          "\"Tell me about the last time this happened.\"",
          "\"What did you do about it?\"",
          "\"What did that cost you, in money or time?\"",
          "\"What was the most annoying part?\"",
          "\"Have you tried anything else? Why did you stop?\"",
          "\"If you could change one thing about it, what would it be?\"",
          "\"Who else do you know who deals with this?\"",
        ] },
        { kind: "h3", text: "Step 6: Listen and take notes" },
        { kind: "p", text: "Let silences sit; people often fill them with the most useful detail. Write their exact words, especially complaints and amounts. Do not defend your idea or correct them. If they ask what you are building, say you will share it at the end." },
        { kind: "h3", text: "Step 7: Close with a small ask" },
        { kind: "p", text: "Now, briefly, describe what you plan to offer and ask for something real: \"Can I send you a sample next week?\", \"Would you book the first batch with a small UPI advance?\", \"Can I put your name on the list for the first week?\", \"Who else should I talk to?\". Decide your ask before you start. Write down who agreed and who hesitated. [Validate: typical advance or booking amount buyers pay for this kind of product or service in my city]" },
        { kind: "h3", text: "Your interview note sheet" },
        { kind: "table", columns: ["Field", "What to write"], rows: [
          ["Name, area, date", "______"],
          ["Matches my buyer line?", "Yes / partly / no"],
          ["Last time the problem happened", "Their words: ______"],
          ["What they do today", "______"],
          ["What it costs them (money and time)", "₹ ______ / ______ hours"],
          ["Most annoying part", "Their words: ______"],
          ["Tried anything else?", "______"],
          ["Response to my small ask", "Agreed / maybe / no"],
          ["Referral given", "______"],
        ] },
      ],
    },
    {
      type: "rich",
      heading: "Questions to ask, and questions to avoid",
      blocks: [
        { kind: "table", columns: ["Ask this", "Not this", "Why"], rows: [
          ["When did you last face this problem?", "Would you have this problem?", "Real past events, not guesses"],
          ["What did you do about it?", "Would you use my product?", "Shows what they already spend time or money on"],
          ["How much did that cost you?", "How much would you pay?", "People overstate what they would pay"],
          ["What was hardest about it?", "Don't you think my idea is good?", "You want problems, not compliments"],
          ["Who do you buy this from today?", "Would you switch to me?", "Tells you your real competitor"],
          ["Who else deals with this?", "Can you share my page?", "Gets you the next conversation"],
        ] },
        { kind: "h3", text: "Reading the answers: Indian politeness signals" },
        { kind: "list", items: [
          "**\"Very nice idea, beta\"** is kindness, not demand. Count it as zero.",
          "**\"Let me ask my husband / wife / father\"** often means the real decision-maker is someone else. Ask to meet them.",
          "**\"I'll tell you later\"** usually means no. Note it as no unless they follow up.",
          "**\"How much will it cost?\"** asked early is a good sign; they are already imagining buying.",
          "**A complaint with a rupee amount** (\"I wasted so much on that\") is the strongest signal of a real problem.",
          "**An offer to introduce you to others** is a strong sign the problem is real and shared.",
        ] },
        { kind: "h3", text: "Differences by place" },
        { kind: "list", items: [
          "**Metros:** people are busy; keep it to ten minutes and offer a phone call or a WhatsApp voice note instead of a meeting.",
          "**Tier 2 and tier 3 towns:** a personal introduction from a shopkeeper, teacher or relative opens doors and gets more honest answers.",
          "**Villages:** go through a trusted person (the SHG leader, the dealer, the sarpanch). Group conversations are common; also speak to people one-on-one afterwards, because some will not disagree in front of others.",
        ] },
      ],
    },
    {
      type: "rich",
      heading: "Interview mistakes Indian founders make",
      blocks: [
        { kind: "h3", text: "Pitching instead of listening" },
        { kind: "p", text: "Once you describe your idea, most people will agree to be kind. Keep the idea for the last two minutes." },
        { kind: "h3", text: "Only asking people like you" },
        { kind: "p", text: "If you sell to shopkeepers, meet shopkeepers, not college friends. If you sell to farmers, meet farmers, not agri graduates." },
        { kind: "h3", text: "Believing \"I'll definitely buy\"" },
        { kind: "p", text: "Only money, time or a referral committed counts. A UPI advance from a stranger is worth more than a hundred promises." },
        { kind: "h3", text: "Using a Google Form instead of a conversation" },
        { kind: "p", text: "Forms get ticks, not stories. You miss the tone, the hesitation and the detail that tells you what to build." },
        { kind: "h3", text: "Talking only to the user, not the payer" },
        { kind: "p", text: "Children use the coaching class, parents pay. Staff use the software, the owner pays. Talk to both." },
        { kind: "h3", text: "Not writing it down" },
        { kind: "p", text: "Write the note sheet within an hour of each conversation. Memory edits what you heard into what you wanted to hear." },
      ],
    },
    {
      type: "cards",
      heading: "Real situations from India",
      intro: "Everyday examples of what honest conversations revealed.",
      items: [
        { title: "Laundry pickup, a Noida society", body: "Residents said they wanted it, but when asked about last week, most used the press-wala downstairs and were happy. The founder moved to office-goers in nearby PGs, who had no such option." },
        { title: "Seed supply, farmers near Nashik", body: "Conversations at the mandi showed farmers trusted their local dealer more than any app. The founder partnered with dealers instead of selling directly." },
        { title: "Kids' coding class, Mysuru", body: "Parents' real worry was screen time, not coding. The founder changed the class to offline weekend sessions with screen-free activities." },
        { title: "Billing software, Ludhiana traders", body: "Shopkeepers did not complain about billing; they complained about tracking udhaar. The founder built a simple credit-tracking tool first." },
        { title: "Tiffin service, Kondapur", body: "Mothers cared less about price and more about the tiffin reaching before lunch break. Delivery timing became the main promise." },
        { title: "Pickle brand, Guntur", body: "Shopkeepers said they would stock it only after customers asked for it twice. She sold directly to families first, then returned to the shops with proof." },
      ],
    },
    { type: "dbfaq", heading: "Customer questions founders ask", intro: "Real questions from our published idea guides about finding and understanding buyers. More on our [founder FAQ page](/faq).", categories: ["local-service-business-ideas", "home-kitchen-food-business-ideas", "tuition-and-coaching-business-ideas", "agri-input-and-farm-service-business-ideas", "retail-shop-business-ideas", "women-friendly-business-ideas", "home-based-business-ideas", "village-and-small-town-business-ideas"], match: "(customer|buyer|client|demand|find|who (will|buys)|target|market)", limit: 10 },
    {
      type: "rich",
      heading: "Expert tips",
      blocks: [
        { kind: "list", items: [
          "**Go in pairs if you can**: one asks, one writes.",
          "**Talk at the time and place the problem happens**: the morning rush, month-end, harvest, exam season, wedding season.",
          "**After ten conversations, write the three sentences you heard most.** Those are your marketing lines.",
          "**Talk to people who stopped using a competitor.** They tell you exactly what to do better.",
          "**Keep a decision journal.** Write what you learned and what you will change after each batch of conversations. Use the [founder decision journal](/founder-decision-journal).",
          "**Then test with money.** Turn the best conversations into a small paid test with the [demand test planner](/business-demand-test-india).",
        ] },
        { kind: "checklist", title: "Before your first conversation", items: [
          "My buyer line is written in one sentence",
          "I know three places and times to find these buyers",
          "My seven past-behaviour questions are written down",
          "I know which language I will speak",
          "My closing ask is decided",
          "I have the note sheet ready on paper or phone",
        ] },
      ],
    },
    { type: "sources", heading: "Sources", items: [OGD, CENSUS, { label: "Ministry of MSME", href: "https://msme.gov.in/", note: "Cluster and district information for small businesses." }, { label: "Udyam Registration portal", href: "https://udyamregistration.gov.in/", note: "Free registration once you decide to start." }] },
    {
      type: "chips",
      heading: "Related questions",
      items: [
        { label: "How to validate a business idea in India", href: "/how-to-validate-a-business-idea-in-india" },
        { label: "How to know if your business has product-market fit", href: "/how-to-know-if-your-business-has-product-market-fit-in-india" },
        { label: "How to calculate TAM, SAM and SOM", href: "/how-to-calculate-tam-sam-som-for-a-business-in-india" },
        { label: "How to check if your business idea is good", href: "/how-to-check-if-your-business-idea-is-good-in-india" },
        { label: "How to do competitor analysis", href: "/how-to-do-competitor-analysis-for-a-small-business-in-india" },
      ],
    },
    { ...CTA, heading: "Ten honest conversations beat ten months of guessing.", body: "Write your buyer line tonight and book three conversations for this week. Then check the biggest risk in your idea, free." },
    {
      type: "rich",
      heading: "What to do this week",
      blocks: [
        { kind: "table", columns: ["Day", "Task"], rows: [
          ["Day 1", "Write your buyer line and seven questions; print or save the note sheet"],
          ["Day 2", "List three places and times; ask one society admin or shopkeeper for permission or introductions"],
          ["Day 3", "Three conversations; fill the note sheet within an hour of each"],
          ["Day 4", "Three more conversations, in a different place"],
          ["Day 5", "Four more; ask each for a referral"],
          ["Day 6", "Write the three sentences you heard most and count who agreed to your small ask"],
          ["Day 7", "Decide: continue to a paid test, change the buyer line, or change the idea"],
        ] },
      ],
    },
    {
      type: "cards",
      heading: "Keep reading",
      items: [
        { title: "Validation field guide", body: "More ways to test before you build.", href: "/startup-idea-validation", cta: "Read" },
        { title: "Business idea validation framework", body: "A full framework from problem to price.", href: "/startup-guides/business-idea-validation-framework", cta: "Read" },
        { title: "Founder decision journal", body: "Write what you learned after each conversation.", href: "/founder-decision-journal", cta: "Open" },
      ],
    },
    {
      type: "chips",
      heading: "Deeper answers founders ask for",
      items: [
        { label: "Get your first customer", href: "/first-customer-india" },
        { label: "Common mistakes when starting a business", href: "/common-mistakes-to-avoid-when-starting-a-business-in-india" },
        { label: "Demand test for India", href: "/business-demand-test-india" },
        { label: "Local service business ideas", href: "/category/local-service-business-ideas" },
        { label: "Agri input and farm service ideas", href: "/category/agri-input-and-farm-service-business-ideas" },
        { label: "Founder glossary", href: "/founder-glossary" },
      ],
    },
    TOOLS,
    CALCS,
    EXPLORE,
  ],
};
