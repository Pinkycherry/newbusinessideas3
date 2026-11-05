import { templateImages, type TemplateImage } from "@/config/template-imagery";

export type TemplateField = { label: string; prompt: string };
export type TemplateSection = { title: string; intro: string; fields: TemplateField[] };
export type FounderTemplate = {
  slug: string; title: string; short: string; outcome: string; group: string;
  image: TemplateImage; sections: TemplateSection[];
};

/** Indian-context writing prompts adapted from the purchased template structures. No sample answers. */
export const FOUNDER_TEMPLATES: FounderTemplate[] = [
  {
    slug: "customer-persona", title: "Customer persona", group: "Discover & define",
    short: "Understand the person behind the purchase, not just an age bracket.",
    outcome: "A buyer profile you can test through actual conversations.",
    image: templateImages.interview,
    sections: [
      { title: "The buyer in their real setting", intro: "Start with a situation you have seen, not a made-up biography.", fields: [
        { label: "Buyer and location", prompt: "Who makes the decision, where in India do they live or work, and what is their buying context?" },
        { label: "Moment that starts the search", prompt: "What happened just before they looked for a solution?" },
        { label: "What they do today", prompt: "How do they currently handle this need, including local alternatives?" },
      ] },
      { title: "What changes the decision", intro: "A useful persona explains the choice, the payment and the hesitation.", fields: [
        { label: "Job and desired outcome", prompt: "What are they trying to get done, and what would feel like progress?" },
        { label: "Payer and budget boundary", prompt: "Who pays, how do they pay, and what would make the cost feel too high?" },
        { label: "Trust barrier", prompt: "What would they need to see or hear before trying a new provider?" },
        { label: "Where to reach them", prompt: "Which real place, group, shop, platform or referral brings you into contact?" },
      ] },
      { title: "Evidence to collect", intro: "Keep your assumptions separate from what a buyer has actually said.", fields: [
        { label: "Observed words and behaviour", prompt: "Record the words a buyer used and what they did, without interpreting yet." },
        { label: "Unverified assumptions", prompt: "Which parts of this profile still need a conversation or field test?" },
      ] },
    ],
  },
  {
    slug: "customer-interview", title: "Customer interview script", group: "Discover & define",
    short: "Hear the last real attempt before you pitch a new solution.",
    outcome: "A neutral conversation guide you can take to a buyer.",
    image: templateImages.interview,
    sections: [
      { title: "Prepare the conversation", intro: "Choose one buyer and one recent situation to understand.", fields: [
        { label: "Buyer and context", prompt: "Who will you speak with, and where or how will the conversation happen?" },
        { label: "What you need to learn", prompt: "Which purchase or problem assumption could this conversation change?" },
      ] },
      { title: "Ask about what happened", intro: "Ask for the past, not promises about an imagined product.", fields: [
        { label: "Opening question", prompt: "Tell me about the last time this problem came up. What happened?" },
        { label: "Current workaround", prompt: "What did you try, and what did it cost in time, effort or money?" },
        { label: "Decision and payment", prompt: "Who chose the solution, who paid, and what alternatives did you compare?" },
      ] },
      { title: "Close without leading", intro: "Let the buyer's own next step reveal the strength of the need.", fields: [
        { label: "Follow-up question", prompt: "What would you do the next time this happened?" },
        { label: "Evidence and follow-up", prompt: "Note exact quotes, observed actions, unanswered questions and a respectful next contact." },
      ] },
    ],
  },
  {
    slug: "competitive-analysis", title: "Competitive analysis", group: "Position & strategy",
    short: "Understand the buyer's real alternatives and test one difference you can deliver.",
    outcome: "A sourced comparison of the options the buyer actually considers.",
    image: templateImages.planning,
    sections: [],
  },
  {
    slug: "lean-canvas", title: "Lean canvas", group: "Position & strategy",
    short: "Put the whole idea on one page, then mark what you still need to test.",
    outcome: "A compact map of assumptions, buyers, costs and revenue.",
    image: templateImages.canvas,
    sections: [
      { title: "Problem and customer", intro: "Name a specific buyer and a problem they already experience.", fields: [
        { label: "Customer segments", prompt: "Who is the early buyer and where do you find them?" },
        { label: "Problems", prompt: "What are the strongest problems, and how are they handled today?" },
        { label: "Existing alternatives", prompt: "Which local providers, workarounds or habits compete with your idea?" },
      ] },
      { title: "Offer and reach", intro: "Describe the outcome before the features.", fields: [
        { label: "Unique value", prompt: "Why would this buyer choose you over their current option?" },
        { label: "Possible solution", prompt: "What small offer could you test first?" },
        { label: "Channels", prompt: "How would your first buyers discover, trust and contact you?" },
      ] },
      { title: "Economics and evidence", intro: "Use rupees only when you have your own figures; mark guesses clearly.", fields: [
        { label: "Revenue streams", prompt: "Who pays, how often and for what? Record any proposed ₹ price as an assumption." },
        { label: "Cost structure", prompt: "List the real inputs you would need and any known ₹ cost." },
        { label: "Key metrics and unfair advantage", prompt: "What early behaviour would show demand, and what can you do that is hard to copy?" },
      ] },
    ],
  },
  {
    slug: "one-page-business-plan", title: "One-page business plan", group: "Plan & pitch",
    short: "Bring the buyer, offer, money and next move into one view.",
    outcome: "A concise plan to review with a partner, mentor or lender.",
    image: templateImages.planning,
    sections: [
      { title: "The business in one view", intro: "Write the most important facts plainly.", fields: [
        { label: "Business and purpose", prompt: "What will you offer, to whom, and why does it matter?" },
        { label: "Problem and present alternative", prompt: "What is difficult for the buyer now, and what do they use instead?" },
        { label: "Solution and value", prompt: "What outcome does your offer improve, and why might they trust it?" },
      ] },
      { title: "How it reaches buyers", intro: "Show the path to the first sale.", fields: [
        { label: "Target customer", prompt: "Who chooses and pays, and where can you meet them?" },
        { label: "Sales channels", prompt: "Which local or online routes will you test first?" },
        { label: "Revenue and pricing", prompt: "How does money come in? Use actual or clearly labelled estimated ₹ figures." },
      ] },
      { title: "What makes it viable", intro: "Keep numbers, costs and unknowns visible.", fields: [
        { label: "Costs and resources", prompt: "What must you spend or arrange before serving the first buyer?" },
        { label: "Key measures", prompt: "Which few observations show that the idea works?" },
        { label: "Team and advantage", prompt: "Who will do the work, and what capability or access do you already have?" },
        { label: "Next decision", prompt: "What will you test next, by when, and what result would change the plan?" },
      ] },
    ],
  },
  {
    slug: "saas-business-plan", title: "SaaS business plan", group: "Plan & pitch",
    short: "Connect your software product to a real buyer, retention and cash needs.",
    outcome: "A software-focused plan with product, market and financial questions.",
    image: templateImages.canvas,
    sections: [
      { title: "Executive summary", intro: "Write this after the rest. State what is real and what is proposed.", fields: [
        { label: "Company and stage", prompt: "What do you build, for whom in India, and what is the current stage?" },
        { label: "Traction and ask", prompt: "Record actual users or revenue if any, plus the amount and purpose of any funding need in ₹." },
      ] },
      { title: "Product and buyer", intro: "Explain the job, the first use and the reason to switch.", fields: [
        { label: "Core value", prompt: "What job does the software do for the buyer?" },
        { label: "First-use workflow", prompt: "What is the smallest experience that produces value?" },
        { label: "Buyer and alternatives", prompt: "Who approves, who pays and which local or global options do they use now?" },
      ] },
      { title: "Go to market and economics", intro: "Keep the assumptions measurable.", fields: [
        { label: "Distribution", prompt: "How will you reach and onboard the first users?" },
        { label: "Pricing and revenue", prompt: "What is the proposed model and ₹ price, and what buyer evidence supports it?" },
        { label: "Retention and acquisition", prompt: "Which activation, churn, lifetime value or acquisition-cost figures are measured rather than guessed?" },
        { label: "Costs, runway and risks", prompt: "What are the actual infrastructure, support and sales costs, and how much time can the team sustain them?" },
      ] },
      { title: "Milestones", intro: "Tie the next release to a decision, not a feature wish list.", fields: [
        { label: "Roadmap and funding use", prompt: "What will you build or test next, what will it cost, and what evidence would justify continuing?" },
      ] },
    ],
  },
  {
    slug: "standard-business-plan", title: "Standard business plan", group: "Plan & pitch",
    short: "A deeper plan for a shop, service, product or local operation.",
    outcome: "A structured plan for partners or a lender conversation.",
    image: templateImages.planning,
    sections: [
      { title: "Executive summary", intro: "Summarise the plan after the detail is clear.", fields: [
        { label: "Business and mission", prompt: "What will the business do and what is its current stage?" },
        { label: "Offer, buyer and funding", prompt: "What is sold, to whom, and what support or ₹ funding is needed?" },
      ] },
      { title: "Company and offer", intro: "Describe what exists today and what still depends on permission or investment.", fields: [
        { label: "Ownership and location", prompt: "Who owns or will run it, where in India, and which business structure is planned?" },
        { label: "Products or services", prompt: "What exactly will buyers receive and how will delivery work?" },
      ] },
      { title: "Market and competition", intro: "Base this on conversations and local alternatives.", fields: [
        { label: "Customer and demand", prompt: "Who buys, what evidence of need have you observed, and where?" },
        { label: "Competitors", prompt: "Which shops, providers or online options serve the same need?" },
      ] },
      { title: "Sales and operations", intro: "Trace the customer journey and the work required to serve it.", fields: [
        { label: "Marketing and sales", prompt: "How will a buyer hear about you, contact you, pay and return?" },
        { label: "Operations and people", prompt: "What suppliers, equipment, permissions, staff or skills are needed?" },
      ] },
      { title: "Financial plan and risks", intro: "Separate real quotes from estimated figures.", fields: [
        { label: "Startup and monthly costs", prompt: "List known ₹ quotes and clearly labelled estimates." },
        { label: "Revenue and cash flow", prompt: "What is the proposed ₹ price, sales volume and payment timing?" },
        { label: "Risks and next milestone", prompt: "What can go wrong, what will you test next and what would change the plan?" },
      ] },
    ],
  },
];

export const founderTemplateBySlug = (slug: string) => FOUNDER_TEMPLATES.find(template => template.slug === slug);
