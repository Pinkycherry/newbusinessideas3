import type { TopicPage } from "@/bought/topic-page";
import { PARENT, UPDATED, UPDATED_ON, IMG, SRC, TOOLS, CALCS, EXPLORE, CTA } from "./topic-pages-shared";

const JANSAMARTH = { label: "Jan Samarth portal", href: "https://www.jansamarth.in/", note: "Single government portal for several credit-linked schemes." };
const NABARD = { label: "NABARD", href: "https://www.nabard.org/", note: "Rural and agricultural credit, SHG-bank linkage." };
const NRLM = { label: "DAY-NRLM (Ministry of Rural Development)", href: "https://aajeevika.gov.in/", note: "Self-help groups and rural livelihoods." };

/**
 * Rewrite 2 (owner review: previous version failed as thin and generic).
 * Seller layout: question page (/questions/how-to-get-funding), sections in the seller's order:
 * takeaways, step-by-step, benchmarks, mistakes, real-world examples, expert insights, FAQ, expert tips,
 * sources, compare options, related questions, CTA, keep reading, deeper answers, tools, calculators, explore, what changed.
 */
export const getFunding: TopicPage = {
  slug: "how-to-get-funding-for-a-small-business-in-india",
  updated: UPDATED_ON,
  sellerRef: "https://ideaproof.io/questions/how-to-get-funding",
  parent: PARENT,
  explore: { guideCategory: "Bootstrapping", categories: ["home-based-business-ideas", "village-and-small-town-business-ideas", "women-friendly-business-ideas", "food-business-ideas", "printing-and-signage-business-ideas", "tailoring-and-boutique-business-ideas", "reselling-business-ideas", "freelance-business-ideas"] },
  seo: {
    title: "How to Get Funding for a Small Business in India: Loans, Schemes and Investors",
    description: "Exactly how a small business in India gets money: MUDRA at your bank branch, PMEGP, Stand-Up India, CGTMSE-backed loans, the Seed Fund and angels, with application steps, documents, a worked rupee example and city-by-city differences.",
  },
  hero: {
    eyebrow: "Business funding in India",
    h1: "How to Get Funding for a Small Business in India",
    highlight: "Funding",
    intro: "Most small businesses in India are funded by the owner's savings, family, and then a bank loan, often under a government scheme. Investors fund a small minority. This guide shows you which door fits your business, what happens at each door, which papers to carry, and how to avoid the agents and moneylenders who cost founders the most.",
    sub: "Covers **MUDRA**, **PMEGP**, **Stand-Up India**, **CGTMSE**, the **Startup India Seed Fund** and **angels**, with application steps you can follow this week.",
    updated: UPDATED,
    primary: { label: "Find your funding door", href: "#compare" },
    secondary: { label: "How much do I need?", href: "/calculator/funding-needed" },
    image: IMG.funding,
    imageAlt: "A founder planning business funding",
  },
  sections: [
    {
      type: "takeaways",
      heading: "Key takeaways",
      items: [
        "**Match the money to your stage.** A tiffin service, tailoring unit or mobile repair shop is usually best served by savings and a bank loan, not an investor.",
        "**MUDRA** loans for non-farm micro businesses come in four bands, Shishu, Kishore, Tarun and Tarun Plus, by loan size. Tarun Plus is only for borrowers who have repaid a Tarun loan. [Validate: current MUDRA loan limits] You apply through a bank, NBFC or MFI, not through MUDRA directly.",
        "**PMEGP** gives a margin-money subsidy on a bank loan for a new micro enterprise; **Stand-Up India** covers SC/ST and women entrepreneurs starting a new enterprise; **CGTMSE** lets banks lend to micro and small units without collateral.",
        "**The Startup India Seed Fund** is for DPIIT-recognised startups and is disbursed through selected incubators.",
        "**Udyam registration is free** and is the first document most banks and schemes ask a small business for.",
        "**Proof beats paperwork.** A few months of sales in a separate bank account make every lender take you more seriously.",
      ],
    },
    {
      type: "rich",
      heading: "Step by step: how to get your first business money",
      blocks: [
        { kind: "h3", text: "Step 1: Work out the exact amount and what it is for" },
        { kind: "p", text: "Every lender's first question is \"for what?\", not \"how much?\". Split your need into two parts. **Fixed assets** are things you buy once: machines, a counter, a freezer, a two-wheeler for delivery, interiors. **Working capital** is the money that keeps the business running until customers pay: raw material, stock, rent, salaries, electricity. Banks treat these differently, and many first-time founders under-ask for working capital and run dry in month three." },
        { kind: "p", text: "Use the [startup cost calculator](/calculator/startup-cost) for the fixed side and the [funding needed calculator](/calculator/funding-needed) for the months until break-even. Collect written quotations for every machine or item above a few thousand rupees; banks ask for them." },
        { kind: "h3", text: "Step 2: Register on Udyam and open a current account" },
        { kind: "p", text: "Register free on the [Udyam portal](https://udyamregistration.gov.in/) with your Aadhaar and PAN. Then open a current account in the business name at the bank where you plan to borrow, and route all business UPI and cash deposits through it. Three to six months of clean statements in a business account are often more persuasive than any project report." },
        { kind: "h3", text: "Step 3: Pick your door" },
        { kind: "p", text: "Use the comparison table further down. In short: a micro business that already sells goes to the bank for MUDRA; a new manufacturing or service unit may qualify for PMEGP; an SC/ST or woman entrepreneur starting a new enterprise should ask about Stand-Up India; a DPIIT-recognised startup building a scalable product looks at the Seed Fund and later angels. Read [how to raise funds for a startup](/how-to-raise-funds-for-a-startup-in-india) for the investor path." },
        { kind: "h3", text: "Step 4: Prepare a short, honest project report" },
        { kind: "p", text: "One to five pages: who you are, what you sell, to whom, at what price, the project cost, your own contribution, the loan amount, a monthly sales and profit estimate, and how the EMI will be paid. Our guide to [writing a business plan for a bank loan](/how-to-write-a-business-plan-for-a-bank-loan-in-india) gives you the nine sections in the order banks expect." },
        { kind: "h3", text: "Step 5: Apply through the official door" },
        { kind: "steps", items: [
          { title: "MUDRA at your bank branch", body: "Visit the branch where you hold your account. Ask for the MUDRA loan application for your band (Shishu, Kishore, Tarun or Tarun Plus). Submit the form with KYC, Udyam certificate, quotations, address proof of the business, and bank statements. Some banks also accept applications online, and the government [Jan Samarth portal](https://www.jansamarth.in/) lists several credit-linked schemes. [Data pending: typical MUDRA processing time and interest rate range at public sector banks, bank websites and RBI data, 2026–27]" },
          { title: "PMEGP through the KVIC portal", body: "Apply online on the [PMEGP e-portal](https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp): fill the application, upload documents and choose a bank. The application is scrutinised by the implementing agency (KVIC, KVIB or the District Industries Centre) and forwarded to the bank. An entrepreneurship development training is usually required before the subsidy is released. PMEGP sets a maximum project cost that differs for manufacturing and service units, a margin-money subsidy that is higher in rural areas and for special categories (such as SC/ST, OBC, women, minorities, ex-servicemen and persons with disabilities), and an own contribution that is lower for special categories. [Validate: current PMEGP project cost limits, subsidy and own contribution]" },
          { title: "Stand-Up India", body: "Register on [Stand-Up Mitra](https://www.standupmitra.in/), answer the eligibility questions and choose a bank branch; you can also apply directly at a branch. Loans are for greenfield enterprises within a set range. [Validate: current Stand-Up India loan range]" },
          { title: "Collateral-free loans backed by CGTMSE", body: "You do not apply to [CGTMSE](https://www.cgtmse.in/) yourself. Ask your bank whether it will cover your loan under the CGTMSE guarantee so that no collateral is needed. Ask how large a loan can be covered for your business. [Validate: current CGTMSE coverage limit] The bank pays an annual guarantee fee, which is usually passed on to you. [Data pending: current CGTMSE annual guarantee fee rates by loan size, cgtmse.in scheme document, 2026–27]" },
          { title: "Startup India Seed Fund", body: "First get DPIIT recognition on the [Startup India portal](https://www.startupindia.gov.in/content/sih/en/startupgov/startup_recognition_page.html). Then apply on the [Seed Fund portal](https://seedfund.startupindia.gov.in/) to selected incubators, which evaluate and disburse. Support covers proof of concept, prototypes and trials, and separately market entry and commercialisation. [Validate: current Seed Fund support amounts]" },
        ] },
        { kind: "callout", title: "Never pay an agent for a scheme loan", text: "Government scheme applications are made at bank branches and on official portals. Anyone who promises guaranteed approval for a fee is a red flag. If someone asks you for an advance fee, walk away and report it to your bank." },
      ],
    },
    {
      type: "rich",
      heading: "What lenders and investors look at",
      intro: "These are the checks you will face at each door, and what helps you pass them.",
      blocks: [
        { kind: "table", columns: ["Who", "What they check first", "What helps you"], rows: [
          ["Bank officer (MUDRA, CGTMSE-backed loans)", "Repayment ability from business income; your own contribution; your credit history", "Clean business bank statements, Udyam, quotations, a realistic project report, a good credit score"],
          ["PMEGP implementing agency", "Eligibility, project viability, a new (greenfield) unit", "A clear project report, training certificate when asked, correct category"],
          ["Stand-Up India branch", "Eligibility (SC/ST or woman entrepreneur), greenfield enterprise, viability", "Complete documents and a written project plan"],
          ["Seed Fund incubator", "DPIIT recognition, innovation, a team that can execute, early validation", "Prototype or pilot results, early users, a short pitch"],
          ["Angel investor", "The founder, the problem, early traction", "Paying customers, repeat purchases, honest numbers"],
        ] },
        { kind: "list", items: [
          "[Data pending: minimum credit score banks commonly expect for MUDRA and MSME loans, RBI or bank policy pages, 2026–27]",
          "[Data pending: typical own contribution (promoter margin) banks expect on small business term loans, bank policy documents on .in sites, 2026–27]",
          "[Data pending: MSME credit gap estimate for India, SIDBI or RBI report, 2026–27]",
        ] },
        { kind: "p", text: "Check your credit report before you apply. Every individual can get a free credit report from the major credit bureaus; errors in it are a common and fixable reason for rejection. [RBI's financial education pages](https://rbi.org.in/FinancialEducation/) explain credit and borrowing in plain words." },
      ],
    },
    {
      type: "rich",
      heading: "Common mistakes founders make while raising money",
      blocks: [
        { kind: "list", items: [
          "**Chasing investors for a local business.** A bakery, salon or coaching centre can be very profitable and still not fit venture capital. Months spent on pitch decks would have been better spent on a bank file.",
          "**Paying an agent for a \"guaranteed\" loan.** Applications are free at branches and on official portals.",
          "**Borrowing everything at once.** Borrow what gets you to steady sales. Borrow more when sales prove the need.",
          "**Taking money from informal moneylenders or high-cost apps.** Interest that looks small per week becomes very large per year. [Data pending: typical effective annual interest of informal moneylender and unregulated app loans versus bank MSME loans, RBI working group reports, 2026–27]",
          "**Pledging family gold without a plan.** Gold loans are fast, but if the business is slow, the family loses jewellery that carries emotional value. Agree the plan with the family first.",
          "**Mixing business and personal money.** Without a separate account, you cannot show the bank what the business earns.",
          "**Family money with no written terms.** Write down whether it is a loan or a share, the amount, and when it will be returned. It protects relationships as much as the business.",
        ] },
      ],
    },
    {
      type: "rich",
      heading: "Real situations: which money fits",
      blocks: [
        { kind: "h3", text: "Worked example: a mobile repair shop in a small town in Bihar" },
        { kind: "p", text: "Arjun repairs phones from a table at his uncle's shop and wants his own counter. He has steady customers and takes most payments by UPI. Here is how his application is built. He fills each pending figure with real quotations before he visits the bank." },
        { kind: "table", columns: ["Item", "Amount", "Where the figure comes from"], rows: [
          ["Counter, shelves and signboard", "[Data pending: local carpenter and signboard quote, small-town Bihar, 2026–27]", "Two written quotations"],
          ["Tools and testing equipment", "[Data pending: repair toolkit and equipment cost, wholesale electronics market quote, 2026–27]", "Wholesale market quotation"],
          ["Opening stock of spares", "[Data pending: starter spare-parts stock value for a small repair shop, distributor quote, 2026–27]", "Distributor quotation"],
          ["Shop deposit and three months' rent", "[Data pending: shop rent and deposit in a Bihar district town market, local broker, 2026–27]", "Rent agreement draft"],
          ["Total project cost", "Sum of the above", ""],
          ["His own contribution", "[Data pending: own contribution share his bank expects, branch policy, 2026–27]", "Ask the branch manager"],
          ["Loan requested", "Project cost minus contribution", "A Kishore MUDRA loan if it fits the Kishore band [Validate: current Kishore limit]"],
          ["Monthly EMI", "[Data pending: EMI at the bank's MUDRA rate for this amount and tenure, bank EMI table, 2026–27]", "Bank's EMI calculator"],
          ["Monthly profit available for EMI", "From his last six months of UPI records", "His business bank statement"],
        ] },
        { kind: "p", text: "If the EMI is comfortably below his monthly profit, the file is strong. If not, he reduces the project (used equipment, smaller counter) rather than borrowing more." },
        { kind: "h3", text: "Other situations" },
        { kind: "list", items: [
          "**Meena, home tiffin service, Nagpur.** Needs a commercial stove, steel containers and two months of groceries. Savings or a Shishu MUDRA loan fits. An investor would not.",
          "**A women's SHG making pickles near Guntur.** Bank credit through SHG-bank linkage and support under [DAY-NRLM](https://aajeevika.gov.in/) is often the first door, with [NABARD](https://www.nabard.org/) programmes behind it.",
          "**Two engineers building farm software in Bengaluru.** After DPIIT recognition, an incubator-led Seed Fund grant, then angel money if farmers keep paying.",
        ] },
      ],
    },
    {
      type: "rich",
      heading: "How funding differs by city and by sector",
      blocks: [
        { kind: "table", columns: ["Where you are", "Doors that are easiest to reach", "What to know"], rows: [
          ["Metro", "Private and public sector banks, NBFCs, fintech lenders, angel networks, incubators", "More options also means more high-cost offers; compare the full annual cost"],
          ["Tier 2 city", "Public sector bank branches, District Industries Centre, state finance corporations, university incubators", "The DIC office helps with PMEGP and state schemes; visit in person"],
          ["Tier 3 town", "Public sector banks, regional rural banks, cooperative banks", "A branch manager who knows your family's account history matters; keep your account active"],
          ["Village", "Regional rural banks, cooperative banks, SHG-bank linkage, NRLM support", "Group-based credit through SHGs is often the first step for women entrepreneurs"],
        ] },
        { kind: "table", columns: ["Sector", "Doors to try first", "Notes"], rows: [
          ["Trading and shops", "MUDRA", "Show stock turnover and daily sales records"],
          ["Small manufacturing", "PMEGP, MUDRA, CGTMSE-backed term loans", "Quotations for machines and power connection details matter"],
          ["Services", "MUDRA, Stand-Up India where eligible", "Show client invoices or bookings"],
          ["Food", "MUDRA, PMEGP", "FSSAI registration expected"],
          ["Agriculture and allied", "NABARD-supported bank credit, Kisan Credit Card for farmers", "MUDRA is for non-farm activities; allied activities have their own schemes"],
          ["Tech startup", "Seed Fund via incubators, angels", "Needs DPIIT recognition first"],
        ] },
      ],
    },
    { type: "dbfaq", heading: "Business funding FAQ", intro: "Real questions from our published idea guides about money, loans and starting costs. More on our [founder FAQ page](/faq).", categories: ["home-based-business-ideas", "women-friendly-business-ideas", "village-and-small-town-business-ideas", "food-business-ideas", "reselling-business-ideas", "freelance-business-ideas", "printing-and-signage-business-ideas", "tailoring-and-boutique-business-ideas"], match: "(loan|mudra|fund|investment|capital|budget|how much .*(start|need|invest))", limit: 10 },
    {
      type: "rich",
      heading: "Expert tips",
      blocks: [
        { kind: "list", items: [
          "Visit two banks, not one. Branch experience with schemes differs a lot.",
          "Ask the branch for its exact document list before you print or notarise anything.",
          "Raise only what gets you to the next proof point: first 50 customers, first repeat order, first profitable month.",
          "Keep a simple monthly record of sales, costs and cash. See [business numbers to track](/business-numbers-every-small-business-in-india-should-track).",
        ] },
        { kind: "checklist", title: "Document checklist for a small business loan", items: [
          "PAN and Aadhaar of the proprietor or partners",
          "Udyam registration certificate",
          "Business address proof (rent agreement or ownership papers)",
          "Bank statements of the business account for the last few months",
          "Quotations for machines, equipment or stock",
          "Short project report with sales, costs and repayment plan",
          "GST registration and returns, if registered",
          "FSSAI registration, if a food business",
          "Passport-size photographs",
        ] },
      ],
    },
    { type: "sources", heading: "Sources", items: [SRC.mudra, SRC.mudraPlus, SRC.pmegp, SRC.standUp, SRC.cgtmse, JANSAMARTH, SRC.seedFund, SRC.dpiit, SRC.udyam, NABARD, NRLM, { label: "RBI Financial Education", href: "https://rbi.org.in/FinancialEducation/" }, SRC.budget2024, { label: "PMEGP scheme details (Khadi and Village Industries Board, Himachal Pradesh)", href: "https://khadi.hp.gov.in/pmegp/" }, { label: "CGTMSE circular on guarantee cover (18 March 2025)", href: "https://www.cgtmse.in/Default/ViewFile/?id=1742382157365_Circular+No.+2502024-25+5cr+to+10+cr.pdf&path=Circular" }, { label: "Stand-Up India scheme guidelines", href: "https://www.standupmitra.in/Home/SchemeGuidelines" }, { label: "Startup India Seed Fund Scheme guidelines", href: "https://www.startupindia.gov.in/content/dam/invest-india/Templates/public/Guidelines%20for%20Startup%20India%20Seed%20Fund%20Scheme.pdf" }] },
    {
      type: "table",
      heading: "Compare your funding options",
      columns: ["Source", "You give up", "Best stage", "Where to apply"],
      rows: [
        ["Own savings and family", "Your own risk; write the terms down", "Before the first sale", "At home"],
        ["MUDRA loan", "Repayment with interest", "Micro business starting or growing", "Your bank, NBFC or MFI"],
        ["PMEGP", "Repayment; part of the project is subsidised", "New micro enterprise", "KVIC PMEGP portal"],
        ["Stand-Up India", "Repayment with interest", "New enterprise by SC/ST or women entrepreneurs", "Stand-Up Mitra portal or bank"],
        ["CGTMSE-backed loan", "Repayment; a guarantee fee may apply", "Micro and small units without collateral", "Ask your bank"],
        ["Startup India Seed Fund", "Conditions; sometimes debt or equity-linked", "DPIIT-recognised startup, proof of concept", "Selected incubator"],
        ["Angel investors", "A share of your company", "Early traction, scalable idea", "Angel networks and referrals"],
        ["Venture capital", "A larger share and board rights", "Fast growth in a large market", "VC funds"],
      ],
    },
    {
      type: "chips",
      heading: "Related questions",
      items: [
        { label: "How much money is needed to start a business in India?", href: "/how-much-money-is-needed-to-start-a-business-in-india" },
        { label: "How to start a business without investors", href: "/how-to-start-a-business-without-investors-in-india" },
        { label: "How to write a business plan for a bank loan", href: "/how-to-write-a-business-plan-for-a-bank-loan-in-india" },
        { label: "Startup funding questions for first-time founders", href: "/startup-funding-questions-for-first-time-founders-in-india" },
        { label: "Free government resources for starting a business", href: "/free-government-resources-for-starting-a-business-in-india" },
      ],
    },
    { ...CTA, heading: "Borrow on proof, not on hope.", body: "Test your idea with real buyers first, then walk into the branch with sales in your account. Start with the free risk check." },
    {
      type: "rich",
      heading: "What to do this week",
      blocks: [
        { kind: "table", columns: ["Day", "Task"], rows: [
          ["Day 1", "List fixed assets and working capital with rough amounts; run the [funding needed calculator](/calculator/funding-needed)"],
          ["Day 2", "Register on Udyam; open or confirm a business current account"],
          ["Day 3", "Collect two quotations for each major item"],
          ["Day 4", "Check your credit report and fix any errors"],
          ["Day 5", "Write the one-to-five-page project report"],
          ["Day 6", "Visit two bank branches; ask about MUDRA, PMEGP or Stand-Up India for your case and collect the document list"],
          ["Day 7", "Decide the scheme and submit a complete file"],
        ] },
      ],
    },
    {
      type: "cards",
      heading: "Keep reading",
      items: [
        { title: "How to raise funds for a startup", body: "The full funding ladder from savings to venture capital.", href: "/how-to-raise-funds-for-a-startup-in-india", cta: "Read" },
        { title: "Bootstrapping in India", body: "Grow from your own sales first.", href: "/how-to-start-a-business-without-investors-in-india", cta: "Read" },
        { title: "Indian startup failures", body: "Founders who ran out of money before they found buyers.", href: "/failed-startups/india", cta: "Read" },
      ],
    },
    {
      type: "chips",
      heading: "Deeper answers founders ask for",
      items: [
        { label: "Is my business idea good?", href: "/how-to-check-if-your-business-idea-is-good-in-india" },
        { label: "Product-market fit", href: "/how-to-know-if-your-business-has-product-market-fit-in-india" },
        { label: "Customer acquisition cost", href: "/what-is-customer-acquisition-cost-for-a-small-business-in-india" },
        { label: "Unit economics", href: "/unit-economics-india" },
        { label: "Village and small town business ideas", href: "/category/village-and-small-town-business-ideas" },
        { label: "Women-friendly business ideas", href: "/category/women-friendly-business-ideas" },
      ],
    },
    TOOLS,
    CALCS,
    EXPLORE,
    {
      type: "takeaways",
      heading: "Rules worth knowing",
      intro: "Limits are revised from time to time. Confirm the current figure on the official page in Sources.",
      items: [
        "**MUDRA** now includes a Tarun Plus band for borrowers who have repaid a Tarun loan. [Validate: current Tarun Plus limit]",
        "**Angel tax** has been abolished for all classes of investors.",
        "**MSME limits** for micro, small and medium enterprises were raised, so more growing businesses still count as micro. [Validate: current MSME investment and turnover limits]",
      ],
    },
  ],
};
