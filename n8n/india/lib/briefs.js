// India Idea Atlas: the 48 draft set briefs (BBI_EXPANSION.md, "Breadth
// without content inflation"). Four per family, twelve families.
//
// These are EDITORIAL STARTING POINTS, not claims of demand. The planner's
// AI agent writes each set's introduction and selection criterion; the
// fields here only steer it. `pilot: true` marks the first twelve. The
// budget family stays out of the pilot: a budget-capped set needs sourced
// INR estimates, and the pilot generates none (unknown budgets never match).
//
// Loaded as plain text into an n8n Code node, so no import/export syntax.
const BRIEFS = [
  // AI and digital
  {
    slug: "ai-services-for-indian-small-businesses",
    title: "AI services for Indian small businesses",
    family: "ai-digital",
    hero_variant: "wiring",
    pilot: true,
    rules: { work_modes: ["home", "online", "hybrid", "local"] },
    focus:
      "Services built around AI tools where a person checks every output for an Indian small business.",
  },
  {
    slug: "indian-language-content-operations",
    title: "Indian-language content operations",
    family: "ai-digital",
    hero_variant: "wiring",
    pilot: true,
    rules: { work_modes: ["home", "online"] },
    focus: "Work where fluency in an Indian language is the skill being paid for.",
  },
  {
    slug: "catalogue-support-services",
    title: "Catalogue support for online sellers",
    family: "ai-digital",
    hero_variant: "wiring",
    rules: { work_modes: ["home", "online"] },
    focus:
      "Preparing and maintaining product listings for Indian sellers on marketplaces or their own shops.",
  },
  {
    slug: "workflow-setup-services",
    title: "Workflow setup for small offices",
    family: "ai-digital",
    hero_variant: "wiring",
    rules: { work_modes: ["online", "hybrid"] },
    focus:
      "Setting up simple digital routines (forms, reminders, shared sheets) for small Indian offices.",
  },

  // Gaming (non-wagering only)
  {
    slug: "local-game-qa-services",
    title: "Game testing services from India",
    family: "gaming",
    hero_variant: "console",
    pilot: true,
    rules: { work_modes: ["home", "online"] },
    focus:
      "Quality testing and bug reporting for game studios. No betting, wagering or real-money games.",
  },
  {
    slug: "gaming-hardware-repair",
    title: "Gaming hardware repair and care",
    family: "gaming",
    hero_variant: "console",
    pilot: true,
    rules: { work_modes: ["local", "hybrid"] },
    focus: "Repairing and maintaining consoles, controllers and gaming PCs for local players.",
  },
  {
    slug: "indian-language-game-localisation",
    title: "Indian-language game localisation",
    family: "gaming",
    hero_variant: "console",
    rules: { work_modes: ["home", "online"] },
    focus: "Translating and checking game text for Indian-language players. No real-money games.",
  },
  {
    slug: "gaming-creator-support",
    title: "Behind the scenes for gaming creators",
    family: "gaming",
    hero_variant: "console",
    rules: { work_modes: ["home", "online"] },
    focus: "Editing, thumbnails and channel admin for Indian gaming creators.",
  },

  // Budget (backlog: needs sourced estimates)
  {
    slug: "businesses-under-10000-rupees",
    title: "Businesses with a budget estimate under ₹10,000",
    family: "budget",
    hero_variant: "ledger",
    rules: { max_budget_inr: 10000 },
    focus: "Ideas whose sourced starting budget estimate fits under ten thousand rupees.",
  },
  {
    slug: "businesses-under-50000-rupees",
    title: "Businesses with a budget estimate under ₹50,000",
    family: "budget",
    hero_variant: "ledger",
    rules: { max_budget_inr: 50000 },
    focus: "Ideas whose sourced starting budget estimate fits under fifty thousand rupees.",
  },
  {
    slug: "businesses-under-2-lakh-rupees",
    title: "Businesses with a budget estimate under ₹2 lakh",
    family: "budget",
    hero_variant: "ledger",
    rules: { max_budget_inr: 200000 },
    focus: "Ideas whose sourced starting budget estimate fits under two lakh rupees.",
  },
  {
    slug: "businesses-using-equipment-you-own",
    title: "Businesses using equipment you already own",
    family: "budget",
    hero_variant: "ledger",
    rules: {},
    focus: "Ideas that start with a phone, computer, vehicle or tools a person already has.",
  },

  // Time
  {
    slug: "weekend-services-india",
    title: "Weekend services you can run in India",
    family: "time",
    hero_variant: "route",
    pilot: true,
    rules: { time_pattern: "weekend" },
    focus: "Services whose customers need them on Saturdays and Sundays.",
  },
  {
    slug: "evening-work-india",
    title: "Evening work after a day job",
    family: "time",
    hero_variant: "route",
    rules: { time_pattern: "evening" },
    focus: "Work that fits evenings, with customers who are available then.",
  },
  {
    slug: "seasonal-operations-india",
    title: "Seasonal businesses around Indian calendars",
    family: "time",
    hero_variant: "route",
    rules: { time_pattern: "seasonal" },
    focus: "Work tied to festivals, harvests, exams or wedding seasons.",
  },
  {
    slug: "part-time-b2b-support",
    title: "Part-time support for small businesses",
    family: "time",
    hero_variant: "route",
    rules: { time_pattern: "part-time", work_modes: ["online", "hybrid", "local"] },
    focus: "Recurring part-time help sold to small Indian businesses.",
  },

  // Setting
  {
    slug: "home-based-services-india",
    title: "Home-based services in India",
    family: "setting",
    hero_variant: "route",
    pilot: true,
    rules: { work_modes: ["home"] },
    focus:
      "Services delivered from home, with customers who come to you or receive the work remotely.",
  },
  {
    slug: "apartment-community-services",
    title: "Services for apartment communities",
    family: "setting",
    hero_variant: "route",
    pilot: true,
    rules: { work_modes: ["local", "hybrid"] },
    focus:
      "Services for residents and associations of Indian apartment complexes and gated societies.",
  },
  {
    slug: "small-town-services-india",
    title: "Services for small Indian towns",
    family: "setting",
    hero_variant: "route",
    rules: { work_modes: ["local", "hybrid"] },
    focus: "Services a small town lacks and residents or shops travel for today.",
  },
  {
    slug: "village-support-services",
    title: "Support services for villages",
    family: "setting",
    hero_variant: "route",
    rules: { work_modes: ["local"] },
    focus: "Practical services for village households, shops and panchayat-level needs.",
  },

  // Retail support
  {
    slug: "stocktaking-services",
    title: "Stocktaking help for shops",
    family: "retail-support",
    hero_variant: "route",
    rules: { work_modes: ["local"] },
    focus: "Counting, recording and reconciling stock for kirana stores and small retailers.",
  },
  {
    slug: "shop-photography-services",
    title: "Photography for local shops",
    family: "retail-support",
    hero_variant: "route",
    pilot: true,
    rules: { work_modes: ["local", "hybrid"] },
    focus: "Product and storefront photos for shops that sell on WhatsApp or online.",
  },
  {
    slug: "catalogue-maintenance-for-shops",
    title: "Catalogue upkeep for neighbourhood shops",
    family: "retail-support",
    hero_variant: "route",
    rules: { work_modes: ["local", "hybrid", "online"] },
    focus: "Keeping a shop's price lists and item details current.",
  },
  {
    slug: "neighbourhood-delivery-coordination",
    title: "Neighbourhood delivery coordination",
    family: "retail-support",
    hero_variant: "route",
    rules: { work_modes: ["local"] },
    focus: "Organising local deliveries for shops that have no delivery system.",
  },

  // Education
  {
    slug: "tutor-administration-services",
    title: "Admin help for tutors and coaching classes",
    family: "education",
    hero_variant: "ledger",
    pilot: true,
    rules: { work_modes: ["home", "online", "hybrid"] },
    focus: "Scheduling, fee reminders, parent communication and records for tutors.",
  },
  {
    slug: "learning-material-production",
    title: "Learning material production",
    family: "education",
    hero_variant: "ledger",
    rules: { work_modes: ["home", "online"] },
    focus: "Worksheets, notes and question banks prepared for Indian teachers and tutors.",
  },
  {
    slug: "skills-workshops-india",
    title: "Practical skills workshops",
    family: "education",
    hero_variant: "ledger",
    rules: { work_modes: ["local", "hybrid"] },
    focus: "Short in-person workshops teaching a practical skill locally.",
  },
  {
    slug: "after-school-activity-services",
    title: "After-school activity services",
    family: "education",
    hero_variant: "ledger",
    rules: { work_modes: ["local"] },
    focus: "Supervised activities for school children in the afternoon or evening.",
  },

  // Food ecosystem
  {
    slug: "food-packaging-design",
    title: "Packaging design for small food brands",
    family: "food-ecosystem",
    hero_variant: "ledger",
    rules: { work_modes: ["home", "online"] },
    focus: "Labels and packaging layouts for home food makers and small food brands.",
  },
  {
    slug: "kitchen-photography-services",
    title: "Photography for home kitchens and cafes",
    family: "food-ecosystem",
    hero_variant: "route",
    rules: { work_modes: ["local", "hybrid"] },
    focus: "Food photos for home kitchens, tiffin services and small cafes.",
  },
  {
    slug: "food-supplier-coordination",
    title: "Supplier coordination for small kitchens",
    family: "food-ecosystem",
    hero_variant: "route",
    rules: { work_modes: ["local", "hybrid"] },
    focus: "Sourcing and ordering help for small kitchens and caterers.",
  },
  {
    slug: "menu-operations-support",
    title: "Menu and ordering support for eateries",
    family: "food-ecosystem",
    hero_variant: "route",
    pilot: true,
    rules: { work_modes: ["local", "hybrid", "online"] },
    focus: "Keeping menus, item details and ordering channels tidy for small eateries.",
  },

  // Repair and reuse
  {
    slug: "appliance-maintenance-services",
    title: "Home appliance maintenance",
    family: "repair-reuse",
    hero_variant: "route",
    pilot: true,
    rules: { work_modes: ["local"] },
    focus: "Servicing fans, coolers, mixers, water purifiers and similar household appliances.",
  },
  {
    slug: "furniture-restoration-services",
    title: "Furniture restoration and repair",
    family: "repair-reuse",
    hero_variant: "route",
    rules: { work_modes: ["local"] },
    focus: "Repairing and refinishing household and shop furniture.",
  },
  {
    slug: "device-refurbishment-support",
    title: "Device refurbishment support",
    family: "repair-reuse",
    hero_variant: "console",
    rules: { work_modes: ["local", "hybrid"] },
    focus: "Cleaning, testing and preparing used phones and laptops for resale or reuse.",
  },
  {
    slug: "rental-inventory-services",
    title: "Rental inventory services",
    family: "repair-reuse",
    hero_variant: "ledger",
    rules: { work_modes: ["local"] },
    focus: "Tracking and maintaining items that small rental businesses lend out.",
  },

  // Agriculture support
  {
    slug: "farm-equipment-scheduling",
    title: "Farm equipment scheduling",
    family: "agriculture-support",
    hero_variant: "ledger",
    rules: { work_modes: ["local"] },
    focus: "Organising shared use of tractors, sprayers and other equipment among farmers.",
  },
  {
    slug: "farm-record-services",
    title: "Record keeping for farmers",
    family: "agriculture-support",
    hero_variant: "ledger",
    pilot: true,
    rules: { work_modes: ["local", "hybrid"] },
    focus: "Keeping input, sale and scheme paperwork records organised for farming households.",
  },
  {
    slug: "agri-packaging-support",
    title: "Packaging support for farm produce",
    family: "agriculture-support",
    hero_variant: "ledger",
    rules: { work_modes: ["local"] },
    focus: "Grading, packing and labelling help for farmers who sell directly.",
  },
  {
    slug: "producer-catalogue-services",
    title: "Catalogues for farmer producer groups",
    family: "agriculture-support",
    hero_variant: "ledger",
    rules: { work_modes: ["local", "hybrid", "online"] },
    focus: "Product lists and buyer-ready details for farmer producer organisations.",
  },

  // Creative services
  {
    slug: "product-photography-india",
    title: "Product photography for Indian sellers",
    family: "creative-services",
    hero_variant: "route",
    rules: { work_modes: ["home", "local", "hybrid"] },
    focus: "Photographing products for sellers who list online.",
  },
  {
    slug: "regional-copywriting-services",
    title: "Regional-language copywriting",
    family: "creative-services",
    hero_variant: "wiring",
    rules: { work_modes: ["home", "online"] },
    focus: "Writing ads, posts and product text in an Indian language.",
  },
  {
    slug: "wedding-vendor-support",
    title: "Behind-the-scenes help for wedding vendors",
    family: "creative-services",
    hero_variant: "route",
    rules: { work_modes: ["local", "hybrid"], time_pattern: "seasonal" },
    focus:
      "Admin, coordination and content help for decorators, caterers and photographers in wedding season.",
  },
  {
    slug: "short-video-editing-services",
    title: "Short video editing services",
    family: "creative-services",
    hero_variant: "wiring",
    rules: { work_modes: ["home", "online"] },
    focus: "Editing short videos for local businesses and creators.",
  },

  // Business operations
  {
    slug: "appointment-administration",
    title: "Appointment admin for clinics and salons",
    family: "business-operations",
    hero_variant: "ledger",
    rules: { work_modes: ["online", "hybrid"] },
    focus: "Booking, reminders and rescheduling for small clinics, salons and studios.",
  },
  {
    slug: "quotation-preparation-services",
    title: "Quotation preparation for tradespeople",
    family: "business-operations",
    hero_variant: "ledger",
    rules: { work_modes: ["online", "hybrid", "local"] },
    focus:
      "Turning enquiries into clear written quotes for electricians, fabricators and contractors.",
  },
  {
    slug: "customer-follow-up-setup",
    title: "Customer follow-up setup",
    family: "business-operations",
    hero_variant: "wiring",
    rules: { work_modes: ["online", "hybrid"] },
    focus: "Setting up simple follow-up routines so small businesses stop losing enquiries.",
  },
  {
    slug: "document-organisation-services",
    title: "Document organisation for households and shops",
    family: "business-operations",
    hero_variant: "ledger",
    rules: { work_modes: ["local", "hybrid"] },
    focus: "Sorting and filing bills, receipts and records for families and small shops.",
  },
];
