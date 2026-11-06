import type { TopicPage } from "@/bought/topic-page";
import { PARENT, UPDATED, UPDATED_ON, IMG, TOOLS, CALCS, CTA } from "./topic-pages-shared";

/**
 * Rewrite 18 (owner review: previous version failed as thin and generic).
 * Seller layout: resources hub (/resources). Seller sections kept in order: library intro, register, funding,
 * sell, learn, data, calculators, templates, guides, knowledge base, validate by industry, idea inspiration,
 * ideas for every founder, ideas by budget, lists, comparisons, failure, research, tools, topic hubs, FAQ, CTA.
 * The portal sections now carry real step-by-step use of each official portal. No researched figures.
 */
export const govResources: TopicPage = {
  slug: "free-government-resources-for-starting-a-business-in-india",
  updated: UPDATED_ON,
  sellerRef: "https://ideaproof.io/resources",
  parent: PARENT,
  explore: { guideCategory: "Launch & Ops", categories: ["home-based-business-ideas", "village-and-small-town-business-ideas", "women-friendly-business-ideas", "small-manufacturing-business-ideas", "food-processing-business-ideas", "student-business-ideas", "senior-citizen-business-ideas", "accounting-and-compliance-service-business-ideas"] },
  seo: {
    title: "Free Government Resources for Starting a Business in India: Portals, Schemes and Step-by-Step Use",
    description: "Every free official portal a new founder in India needs, with how to use each one: Udyam, GST, MCA SPICe+, FSSAI FoSCoS, Startup India DPIIT, MUDRA, PMEGP, Stand-Up India, CGTMSE, Jan Samarth, GeM, ONDC, MSME Samadhaan, Skill India Digital and data portals, plus our free tools.",
  },
  hero: {
    eyebrow: "Free government resources",
    h1: "Free Government Resources for Starting a Business in India",
    highlight: "Free Government Resources",
    intro: "Registration, loans, selling to the government, getting paid on time, training and market data: most of what a new founder in India needs is available free on official portals. The hard part is knowing which one to open, in what order, and what to keep ready. Agents charge first-time founders for things that take twenty minutes online. This page shows you each portal, what it is for and how to use it, step by step.",
    sub: "Only **official government portals** and our own **free tools**. Never pay an agent for something the portal gives free.",
    updated: UPDATED,
    primary: { label: "Start with registration", href: "#register" },
    secondary: { label: "Free tools", href: "/tools" },
    image: IMG.hub,
    imageAlt: "Government portals for starting a business in India",
  },
  sections: [
    {
      type: "rich",
      heading: "Your free founder resource library",
      blocks: [
        { kind: "list", items: [
          "**Official portals for registration, tax, loans, selling, payments and training**, grouped by what you need to do, with the steps for each.",
          "**Our free calculators, templates and guides** for the work the portals do not do for you: costing, pricing, testing demand and planning.",
          "**Each link opens the official site.** Check the address bar ends in .gov.in, .nic.in or the scheme's own official domain. If any site asks for a fee to do what the portal does free, stop.",
        ] },
        { kind: "h3", text: "The usual order for a new small business" },
        { kind: "list", ordered: true, items: [
          "PAN and Aadhaar linked, with your mobile number on Aadhaar (needed for every OTP).",
          "A business current account at your bank.",
          "Udyam registration.",
          "FSSAI if you sell food; shop and establishment and trade licence from your state or local body.",
          "GST when your turnover or way of selling requires it.",
          "Company or LLP on MCA only if you need it (investors, partners, liability).",
          "DPIIT recognition only if you are building an innovative, scalable product.",
          "Loans and schemes once you have sales; GeM and ONDC to sell more.",
        ] },
        { kind: "callout", title: "Keep this folder ready", text: "PAN, Aadhaar, a passport photo, a cancelled cheque or bank details, business address proof (rent agreement or electricity bill), your mobile on Aadhaar, and a simple description of what you sell. Most portals ask for the same few things." },
      ],
    },
    {
      type: "rich",
      heading: "Register your business",
      blocks: [
        { kind: "h3", text: "Udyam (MSME) registration" },
        { kind: "p", text: "Free, Aadhaar-based registration for micro, small and medium enterprises on the [Udyam portal](https://udyamregistration.gov.in/). Choose the option for new entrepreneurs, enter the proprietor's or authorised person's Aadhaar and OTP, then PAN, business name, address, bank details, activity (manufacturing or services) and NIC codes for what you do. Submit and download the certificate. Banks, schemes and buyers ask for it, and it gives you delayed-payment protection." },
        { kind: "h3", text: "GST registration" },
        { kind: "p", text: "On the [GST portal](https://www.gst.gov.in/), choose Services, Registration, New Registration. Fill Part A (PAN, mobile, email), verify OTPs, then Part B with business details, address proof, bank details and authorised signatory. Aadhaar authentication speeds it up. Check whether you must register (turnover threshold, inter-state sales, e-commerce selling) and whether the composition scheme suits you. [Validate: current GST registration thresholds and composition scheme limits]" },
        { kind: "h3", text: "Company or LLP on MCA" },
        { kind: "p", text: "On the [MCA portal](https://www.mca.gov.in/), a private limited company is incorporated with the SPICe+ form, which also covers PAN, TAN, GST and bank account linking; an LLP uses the FiLLiP route. You need digital signatures for directors or partners and name approval. Most founders use a CA for this; the government fees are published on the portal. A proprietorship needs no MCA registration at all." },
        { kind: "h3", text: "FSSAI for food businesses" },
        { kind: "p", text: "On [FoSCoS](https://foscos.fssai.gov.in/), choose basic registration, state licence or central licence depending on the size of your food business, fill the form with your kitchen or premises address and food categories, upload ID and address proof, and pay the fee online. Home kitchens and tiffin services need at least basic registration. [Validate: current FSSAI fees and turnover bands]" },
        { kind: "h3", text: "Startup India (DPIIT recognition)" },
        { kind: "p", text: "On [Startup India](https://www.startupindia.gov.in/), register, then apply for DPIIT recognition with your company or LLP details, a short description of the innovation and supporting documents. Recognition opens tax and compliance benefits, the Seed Fund and many state schemes. It is for innovative, scalable businesses, not every small business." },
        { kind: "h3", text: "Income tax and PAN" },
        { kind: "p", text: "On the [income tax portal](https://www.incometax.gov.in/) you can apply for a PAN, use Instant e-PAN with Aadhaar, link PAN and Aadhaar, and file returns. As a proprietor, your business income goes in your own return; keep business and personal accounts separate to make this easy." },
        { kind: "h3", text: "State and local registrations" },
        { kind: "p", text: "Shop and establishment registration is done on your state labour department's portal; trade licences come from the municipal corporation, municipality or gram panchayat, often online. Rules and fees differ by state and town, so check your own state portal or ask at the local body office." },
      ],
    },
    {
      type: "rich",
      heading: "Get funding",
      intro: "Free portals for loans and schemes. Applying is free; beware of anyone charging to \"get your loan sanctioned\".",
      blocks: [
        { kind: "table", columns: ["Portal", "What it is for", "How you use it"], rows: [
          ["[MUDRA](https://www.mudra.org.in/)", "Collateral-free loans for non-farm micro businesses in four bands", "Read eligibility, then apply at your bank, NBFC or MFI, or through Jan Samarth"],
          ["[Jan Samarth](https://www.jansamarth.in/)", "One portal for several credit-linked government schemes", "Check eligibility, choose a scheme and bank, apply online and track status"],
          ["[PMEGP](https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp)", "Margin-money subsidy on bank loans for new micro enterprises", "Apply online with project details; complete the EDP training; the bank processes the loan"],
          ["[Stand-Up India](https://www.standupmitra.in/)", "Bank loans for SC/ST and women entrepreneurs starting a new enterprise", "Register, answer the eligibility questions, and get linked to banks and handholding support"],
          ["[CGTMSE](https://www.cgtmse.in/)", "Credit guarantee for collateral-free loans to micro and small units", "Ask your bank to cover your loan under CGTMSE; you do not apply directly"],
          ["[Startup India Seed Fund](https://seedfund.startupindia.gov.in/)", "Grants and debt for DPIIT-recognised startups", "Apply through the portal to selected incubators"],
          ["[SIDBI](https://www.sidbi.in/)", "Small industries bank, refinance and the Fund of Funds for Startups", "Read schemes and find SIDBI-supported lenders and funds"],
        ] },
        { kind: "p", text: "Loan limits and subsidy shares change from time to time. [Validate: current MUDRA band limits, PMEGP subsidy rates and Stand-Up India loan range] Read [how to get funding for a small business](/how-to-get-funding-for-a-small-business-in-india) for branch steps and documents." },
      ],
    },
    {
      type: "rich",
      heading: "Sell more",
      blocks: [
        { kind: "h3", text: "GeM: sell to government buyers" },
        { kind: "p", text: "On [GeM](https://gem.gov.in/), register as a seller with PAN, Aadhaar, Udyam and bank details, complete your profile, then list products or services in the right category. Government offices, schools, hospitals and PSUs buy through GeM; micro and small enterprises get preference in many purchases. Read the bid conditions carefully before you quote." },
        { kind: "h3", text: "ONDC: sell online beyond one marketplace" },
        { kind: "p", text: "[ONDC](https://ondc.org/) is an open network; you join through a seller app (a registered network participant) rather than ONDC itself, list your catalogue once and become visible on many buyer apps. Compare seller apps' fees and support before you choose." },
        { kind: "h3", text: "UPI for merchants" },
        { kind: "p", text: "Get a merchant QR code from your bank or a payment app linked to your current account. [NPCI](https://www.npci.org.in/what-we-do/upi/product-overview) explains how UPI works for merchants. Separate business UPI makes every other portal (loans, GST, Udyam) easier." },
        { kind: "h3", text: "MSME Samadhaan: get paid on time" },
        { kind: "p", text: "If a buyer delays payment to your Udyam-registered micro or small enterprise beyond the legal limit, you can file an application on [MSME Samadhaan](https://samadhaan.msme.gov.in/). Keep invoices with clear payment dates." },
      ],
    },
    {
      type: "rich",
      heading: "Learn skills",
      blocks: [
        { kind: "list", items: [
          "**[Skill India Digital](https://www.skillindiadigital.gov.in/):** free courses and certificates for many trades and skills, from tailoring and beauty to digital marketing and electrical work.",
          "**[Ministry of MSME](https://msme.gov.in/):** entrepreneurship development programmes, MSME technology centres and training through MSME Development and Facilitation Offices in each state.",
          "**[RBI financial education](https://rbi.org.in/FinancialEducation/):** plain guides on money, credit, safe digital banking and avoiding fraud.",
          "**Rural Self Employment Training Institutes (RSETIs):** free residential training for rural youth in many trades, run with banks in most districts. Ask your lead bank branch.",
        ] },
      ],
    },
    {
      type: "rich",
      heading: "Find data about your market",
      blocks: [
        { kind: "list", items: [
          "**[Census of India](https://censusindia.gov.in/):** population, households, literacy and languages by district and town.",
          "**[Open Government Data](https://data.gov.in/):** datasets by sector and state, including MSME and agriculture data.",
          "**[UDISE+](https://udiseplus.gov.in/):** schools and enrolment down to block level, useful for education and kids' businesses.",
          "**[MoSPI](https://www.mospi.gov.in/):** household consumption and enterprise surveys.",
        ] },
        { kind: "p", text: "Then use the data to count your buyers with [TAM, SAM and SOM](/how-to-calculate-tam-sam-som-for-a-business-in-india)." },
        { kind: "h3", text: "Mistakes founders make with government portals" },
        { kind: "list", items: [
          "**Paying agents or look-alike websites** for free registrations such as Udyam.",
          "**Using a mobile number not linked to Aadhaar**, so OTPs never arrive.",
          "**Picking the wrong NIC code or GST category**, which causes trouble with loans and returns later.",
          "**Registering for GST too early or too late** without checking the rules for your way of selling.",
          "**Forgetting state and local licences** because the central portals are done.",
        ] },
        { kind: "h3", text: "What to do this week" },
        { kind: "table", columns: ["Day", "Task"], rows: [
          ["Day 1", "Link PAN and Aadhaar; check your Aadhaar mobile number"],
          ["Day 2", "Open or confirm a business current account and UPI QR"],
          ["Day 3", "Register on Udyam and download the certificate"],
          ["Day 4", "Check FSSAI, shop registration and trade licence needs for your business and town"],
          ["Day 5", "Check whether you need GST now; register if you do"],
          ["Day 6", "Read the funding portals that fit your stage; check eligibility on Jan Samarth"],
          ["Day 7", "Pick one free Skill India course or MSME programme for a skill you lack"],
        ] },
      ],
    },
    CALCS,
    {
      type: "cards",
      heading: "Templates and frameworks",
      items: [
        { title: "Templates", body: "Plans, personas and canvases you can fill in.", href: "/templates", cta: "Browse" },
        { title: "Business plan for a bank loan", body: "The project report sections banks expect.", href: "/how-to-write-a-business-plan-for-a-bank-loan-in-india", cta: "Read" },
        { title: "Frameworks compared", body: "Which validation framework to use when.", href: "/frameworks-comparison", cta: "Read" },
      ],
    },
    {
      type: "cards",
      heading: "Long-form founder guides",
      items: [
        { title: "Startup guides", body: "Our full guide library.", href: "/startup-guides", cta: "Browse" },
        { title: "Reading room", body: "Curated reading for first-time founders.", href: "/business-idea-reading-room", cta: "Open" },
        { title: "Learning resources", body: "Courses and resources we recommend.", href: "/learning-resources", cta: "Open" },
      ],
    },
    {
      type: "chips",
      heading: "Founder knowledge base",
      items: [
        { label: "Founder glossary", href: "/founder-glossary" },
        { label: "Startup terms in plain words", href: "/startup-terms-india" },
        { label: "Founder FAQ", href: "/faq" },
        { label: "Startup funding questions", href: "/startup-funding-questions-for-first-time-founders-in-india" },
      ],
    },
    { type: "chips", heading: "Validate by industry", items: [
        { label: "How to validate a business idea in India", href: "/how-to-validate-a-business-idea-in-india" },
        { label: "How to validate a food business idea", href: "/how-to-validate-a-food-business-idea-in-india" },
        { label: "How to validate an online selling idea", href: "/how-to-validate-an-online-selling-business-idea-in-india" },
        { label: "Is my business idea good?", href: "/how-to-check-if-your-business-idea-is-good-in-india" },
      ] },
    { type: "dbideas", heading: "Idea inspiration", intro: "Published ideas from our library.", categories: ["home-based-business-ideas", "village-and-small-town-business-ideas", "women-friendly-business-ideas"], limit: 5, all: { label: "Browse all ideas", href: "/browse" } },
    {
      type: "chips",
      heading: "Ideas for every founder",
      items: [
        { label: "Women-friendly business ideas", href: "/category/women-friendly-business-ideas" },
        { label: "Student business ideas", href: "/category/student-business-ideas" },
        { label: "Senior citizen business ideas", href: "/category/senior-citizen-business-ideas" },
        { label: "Village and small town ideas", href: "/category/village-and-small-town-business-ideas" },
        { label: "Work from home ideas", href: "/category/work-from-home-business-ideas" },
      ],
    },
    {
      type: "chips",
      heading: "Ideas by how much you can start with",
      items: [
        { label: "Side business ideas", href: "/side-business-ideas-india" },
        { label: "Home-based ideas", href: "/category/home-based-business-ideas" },
        { label: "Zero-investment business models", href: "/startup-guides/zero-investment-business-models" },
        { label: "How much money is needed to start", href: "/how-much-money-is-needed-to-start-a-business-in-india" },
      ],
    },
    {
      type: "chips",
      heading: "Idea lists",
      items: [
        { label: "All idea lists", href: "/lists" },
        { label: "Local business ideas", href: "/local-business-ideas-india" },
        { label: "Online business ideas", href: "/online-business-ideas-india" },
        { label: "Product business ideas", href: "/product-business-ideas-india" },
        { label: "Service business ideas", href: "/service-business-ideas-india" },
      ],
    },
    {
      type: "chips",
      heading: "Comparisons",
      items: [
        { label: "Business models compared", href: "/business-models-india" },
        { label: "Startup ideas compared", href: "/startup-idea-comparison" },
        { label: "Loans vs investors", href: "/how-to-get-funding-for-a-small-business-in-india" },
      ],
    },
    {
      type: "chips",
      heading: "Learn from failure",
      items: [
        { label: "Indian startup failures", href: "/failed-startups/india" },
        { label: "Common mistakes to avoid", href: "/common-mistakes-to-avoid-when-starting-a-business-in-india" },
        { label: "Case studies", href: "/researched-case-studies" },
      ],
    },
    {
      type: "chips",
      heading: "Our research",
      items: [
        { label: "Business idea research", href: "/business-idea-research-india" },
        { label: "Market research", href: "/market-research" },
        { label: "Open source research", href: "/open-source" },
      ],
    },
    TOOLS,
    {
      type: "chips",
      heading: "Topic hubs",
      items: [
        { label: "All startup topics", href: "/topics" },
        { label: "How to raise funds for a startup", href: "/how-to-raise-funds-for-a-startup-in-india" },
        { label: "Business numbers to track", href: "/business-numbers-every-small-business-in-india-should-track" },
      ],
    },
    { type: "dbfaq", heading: "Registration and licence questions", intro: "Real questions from our published idea guides about registration, licences and rules. More on our [founder FAQ page](/faq).", categories: ["home-based-business-ideas", "village-and-small-town-business-ideas", "women-friendly-business-ideas", "food-business-ideas", "small-manufacturing-business-ideas", "freelance-business-ideas", "retail-shop-business-ideas", "home-kitchen-food-business-ideas"], match: "(register|registration|licen|gst|udyam|fssai|permit|legal|scheme|government)", limit: 10 },
    { ...CTA, heading: "Start with the free portals, not an agent.", body: "Register on Udyam today, then check your idea with our free risk check before you spend." },
    { type: "sources", heading: "Sources", items: [
      { label: "Udyam Registration portal", href: "https://udyamregistration.gov.in/" },
      { label: "GST portal", href: "https://www.gst.gov.in/" },
      { label: "Ministry of Corporate Affairs", href: "https://www.mca.gov.in/" },
      { label: "FSSAI FoSCoS", href: "https://foscos.fssai.gov.in/" },
      { label: "Startup India", href: "https://www.startupindia.gov.in/" },
      { label: "Jan Samarth", href: "https://www.jansamarth.in/" },
      { label: "GeM", href: "https://gem.gov.in/" },
      { label: "ONDC", href: "https://ondc.org/" },
      { label: "MSME Samadhaan", href: "https://samadhaan.msme.gov.in/" },
      { label: "Skill India Digital", href: "https://www.skillindiadigital.gov.in/" },
    ] },
  ],
};
