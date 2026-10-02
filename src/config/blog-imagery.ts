/**
 * Featured images for blog posts, matched to a post by its slug.
 *
 * A post's own `image` column wins when it is set; these fill the gap while
 * the column is empty, so no database row has to change. Written to the
 * contract in IMAGE_SEO.md: a file name of at least 5 keywords, a 10-word alt
 * carrying the focus keyword and supporting keywords, one focus keyword, three
 * supporting keywords, two long-tail phrases, and a caption that contains the
 * focus keyword. Alt and caption describe the business topic, never what the
 * picture looks like.
 */
export type BlogImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  focus: string;
  keywords: [string, string, string];
  longTail: [string, string];
  description: string;
};

const DIR = "/images/blog";

const IMAGES: Record<string, BlogImage> = {
  "how-to-price-a-side-hustle-with-no-customers": {
    src: `${DIR}/how-to-price-a-side-hustle-with-no-customers-yet.webp`,
    width: 1279,
    height: 720,
    alt: "How to price a side hustle for your first customers",
    focus: "price a side hustle",
    keywords: ["first customers", "price quote", "pricing strategy"],
    longTail: [
      "how to price a side hustle when you have no customers yet",
      "what to charge for your first paying customer",
    ],
    description:
      "How to price a side hustle with no customers yet: setting a first price, testing it with a real buyer and adjusting after the first sales.",
  },
  "online-business-no-money-no-laptop": {
    src: `${DIR}/starting-an-online-business-with-no-money-and-no-laptop.webp`,
    width: 1439,
    height: 810,
    alt: "Start an online business with no money and no laptop",
    focus: "online business with no money",
    keywords: ["no laptop", "start from a phone", "first online customers"],
    longTail: [
      "how to start an online business with no money and no laptop",
      "building an online business using only a smartphone",
    ],
    description:
      "Starting an online business with no money and no laptop: what can be done from a phone and how to find the first customers.",
  },
  "passive-income-myths-reality": {
    src: `${DIR}/the-passive-income-promises-that-fail-in-real-life.webp`,
    width: 1439,
    height: 810,
    alt: "Passive income myths: the real work behind online income promises",
    focus: "passive income myths",
    keywords: ["real work", "income promises", "online income"],
    longTail: [
      "passive income promises that fail in real life",
      "why passive income takes more work than people say",
    ],
    description:
      "Passive income myths: which promises about easy online income do not hold up in real life, and what the work really involves.",
  },
  "find-first-paying-customer-without-ads": {
    src: `${DIR}/how-to-find-your-first-paying-customer-without-spending-on-ads.webp`,
    width: 1439,
    height: 810,
    alt: "How to find your first paying customer without any ads",
    focus: "first paying customer",
    keywords: ["without any ads", "first sale", "local business"],
    longTail: [
      "how to find your first paying customer without spending on ads",
      "getting a first customer by talking to local business owners",
    ],
    description:
      "Finding your first paying customer without ads: where to look, what to say and how to turn a conversation into a first sale.",
  },
  "packing-error-subscription-box-inventory-software": {
    src: `${DIR}/the-packing-error-that-ends-a-subscription-box-company.webp`,
    width: 1599,
    height: 900,
    alt: "Subscription box packing error and inventory mistakes that sink companies",
    focus: "subscription box packing error",
    keywords: ["inventory mistakes", "order fulfilment", "box company"],
    longTail: [
      "the packing error that ends a subscription box company",
      "how one inventory mistake can sink a subscription box business",
    ],
    description:
      "The subscription box packing error and weak inventory control that can end a company, and the order fulfilment checks that catch it early.",
  },
  "why-your-cobbler-said-no-and-who-still-says-yes": {
    src: `${DIR}/why-your-cobbler-said-no-and-who-still-says-yes.webp`,
    width: 1439,
    height: 810,
    alt: "Why your cobbler said no and who still says yes",
    focus: "why your cobbler said no",
    keywords: ["who still says yes", "cobbler business", "repair customers"],
    longTail: [
      "why your cobbler said no and who still says yes",
      "finding the customers who will pay for a repair job",
    ],
    description:
      "Why your cobbler said no, and who still says yes: why repair businesses turn down some work and how to find the customers who stay.",
  },
  "zero-investment-business-ideas-start-with-zero": {
    src: `${DIR}/stop-waiting-50-zero-investment-business-ideas-you-can-start-with-zero.webp`,
    width: 1672,
    height: 941,
    alt: "Zero investment business ideas you can start with zero money",
    focus: "zero investment business ideas",
    keywords: ["start with zero", "no capital", "business from nothing"],
    longTail: [
      "50 zero investment business ideas you can start with zero",
      "how to start a business today without any money",
    ],
    description:
      "Fifty zero investment business ideas: what you can start with no capital, who pays first and what the real cost turns out to be.",
  },
  "side-hustle-ideas-after-your-day-job": {
    src: `${DIR}/50-side-hustle-ideas-you-can-run-after-your-day-job-ends.webp`,
    width: 1672,
    height: 941,
    alt: "Side hustle ideas you can run after your day job",
    focus: "side hustle ideas",
    keywords: ["after hours", "day job", "evening business"],
    longTail: [
      "50 side hustle ideas you can run after your day job ends",
      "evening businesses you can start while working full time",
    ],
    description:
      "Fifty side hustle ideas that fit around a full time job: the hours they take, who the first customer is and what can go wrong.",
  },
  "50-untold-work-from-home-business-ideas": {
    src: `${DIR}/50-untold-work-from-home-business-ideas-you-can-start-with-no-money.webp`,
    width: 1672,
    height: 941,
    alt: "Work from home business ideas to start with no money",
    focus: "work from home business ideas",
    keywords: ["no money", "untold ideas", "home business"],
    longTail: [
      "50 untold work from home business ideas you can start with no money",
      "home business ideas that need only a phone and a table",
    ],
    description:
      "Fifty work from home business ideas with no money needed to start: what each one involves, who pays and where it gets hard.",
  },
  "mobile-bike-repair-business-startup": {
    src: `${DIR}/two-week-wait-that-built-a-van-business.webp`,
    width: 1280,
    height: 720,
    alt: "Two week wait that built a mobile bike repair business",
    focus: "mobile bike repair business",
    keywords: ["van business", "bike repair van", "two week wait"],
    longTail: [
      "the two week wait that built a van business",
      "how to start a mobile bike repair business from a van",
    ],
    description:
      "The two week wait that built a van business: how a mobile bike repair business got started, and what the wait taught about demand.",
  },
  "is-a-gutter-cleaning-business-profitable": {
    src: `${DIR}/one-off-gutter-jobs-are-a-bad-business-contracts-are-not.webp`,
    width: 1672,
    height: 941,
    alt: "Gutter cleaning business profit: annual contracts beat one off jobs",
    focus: "gutter cleaning business",
    keywords: ["annual contracts", "recurring revenue", "one off jobs"],
    longTail: [
      "one off gutter jobs are a bad business and contracts are not",
      "is a gutter cleaning business profitable with annual contracts",
    ],
    description:
      "Why a gutter cleaning business earns more from annual contracts than one off jobs: recurring revenue, steadier income and fewer slow weeks.",
  },
  "selling-invoice-templates-online": {
    src: `${DIR}/the-invoice-your-client-judged-before-reading-it.webp`,
    width: 1672,
    height: 941,
    alt: "Selling professional invoice templates to help clients get paid faster",
    focus: "invoice templates",
    keywords: ["professional invoices", "get paid faster", "estimate templates"],
    longTail: [
      "the invoice your client judged before reading it",
      "how to sell invoice templates online to plumbers, electricians and contractors",
    ],
    description:
      "The invoice your client judged before reading it: why invoice templates that look professional help small businesses get paid faster, and how to sell them online.",
  },
  "selling-social-media-caption-templates": {
    src: `${DIR}/selling-social-media-caption-templates-for-niche-businesses.webp`,
    width: 1672,
    height: 941,
    alt: "Selling social media caption templates for niche businesses on Instagram",
    focus: "social media caption templates",
    keywords: ["niche businesses", "Instagram captions", "content ideas"],
    longTail: [
      "selling social media caption templates for niche businesses",
      "how to sell caption templates to small businesses on Instagram",
    ],
    description:
      "Selling social media caption templates for niche businesses: which template packs small business owners will pay for, and how to find those buyers.",
  },
  "selling-business-templates-online": {
    src: `${DIR}/business-onboarding-templates-sop-checklists-new-hire-day-one-plan.webp`,
    width: 1672,
    height: 941,
    alt: "Business onboarding templates, SOP templates and checklists for small teams",
    focus: "onboarding templates",
    keywords: ["SOP templates", "onboarding checklist", "new hire"],
    longTail: [
      "day one goes badly because nobody wrote it down",
      "how to sell onboarding and SOP templates to small businesses",
    ],
    description:
      "Why day one goes badly when nobody wrote it down: how onboarding templates and SOP checklists fix it, and how to sell them to small businesses.",
  },
  "starting-a-small-batch-coffee-roasting-business": {
    src: `${DIR}/that-date-on-the-coffee-bag-is-not-a-roast-date.webp`,
    width: 1280,
    height: 720,
    alt: "Small batch coffee roasting business: label the roast date honestly",
    focus: "coffee roasting business",
    keywords: ["roast date", "coffee bag label", "small batch"],
    longTail: [
      "that date on the coffee bag is not a roast date",
      "how to start a small batch coffee roasting business and label it honestly",
    ],
    description:
      "Why the date on a coffee bag is not a roast date, and what a small batch coffee roasting business should label so customers know how fresh the coffee is.",
  },
  "how-to-start-a-niche-job-board": {
    src: `${DIR}/niche-job-board-startup-two-hundred-applications-licensed-candidates-hiring.webp`,
    width: 1280,
    height: 720,
    alt: "How to start a niche job board for licensed applicants",
    focus: "niche job board",
    keywords: ["job board startup", "licensed applicants", "qualified candidates"],
    longTail: [
      "two hundred applications and not one licensed applicant",
      "how to start a niche job board that attracts qualified candidates",
    ],
    description:
      "How to start a niche job board: why hundreds of applications can still include no licensed candidates, and how to attract the qualified ones.",
  },
  "paid-community-business-model-trades": {
    src: `${DIR}/five-contradictory-answers-and-real-liability.webp`,
    width: 1672,
    height: 941,
    alt: "Paid community for trades with verified professionals and legal compliance",
    focus: "paid community for trades",
    keywords: ["verified professionals", "legal compliance", "trade guidelines"],
    longTail: [
      "five contradictory answers and real liability",
      "how a paid community can replace conflicting free advice for tradespeople",
    ],
    description:
      "Five contradictory answers and real liability: why free forum advice on licences and methods is risky for trades, and how a paid community for trades with verified professionals fixes it.",
  },
  "flexible-business-ideas-for-women": {
    src: `${DIR}/flexible-business-ideas-for-women-balancing-work-and-life-home-based-india.webp`,
    width: 1280,
    height: 720,
    alt: "Flexible business ideas for women: home based business, balancing work",
    focus: "flexible business ideas for women",
    keywords: ["home based business", "balancing work and life", "freelancing from home"],
    longTail: [
      "flexible business ideas for women who work from home in India",
      "how women can start an online business around family time",
    ],
    description:
      "Fifty flexible business ideas for women balancing work and life: home based options in India, what each needs and where it gets hard.",
  },
  "high-margin-online-business-ideas": {
    src: `${DIR}/high-margin-online-business-ideas-low-capital-seo-dropshipping-ai-tools-digital-products.webp`,
    width: 1280,
    height: 720,
    alt: "High margin online business ideas with low capital, digital products",
    focus: "high margin online business ideas",
    keywords: ["low capital", "digital products", "AI tools"],
    longTail: [
      "high margin online business ideas that need very little capital",
      "which online businesses keep costs low and margins high",
    ],
    description:
      "Fifty high margin online business ideas that need little capital: digital products, SEO services, AI tools, courses and more, with the real costs.",
  },
  "passive-income-business-ideas-honest-list": {
    src: `${DIR}/passive-income-that-still-needs-work-templates-digital-assets-earn-while-you-build.webp`,
    width: 1280,
    height: 720,
    alt: "Passive income business ideas built on templates and digital assets",
    focus: "passive income business ideas",
    keywords: ["templates", "digital assets", "build once"],
    longTail: [
      "passive income business ideas that still need you a little",
      "how to build once and keep earning from digital assets",
    ],
    description:
      "Fifty passive income business ideas that still need you a little: templates, digital assets and other models, with the work each one takes.",
  },
  "realistic-part-time-business-ideas": {
    src: `${DIR}/realistic-part-time-business-ideas-extra-income-evening-hustles-weekend-jobs-skills.webp`,
    width: 1280,
    height: 720,
    alt: "Realistic part time business ideas for extra income after work",
    focus: "part time business ideas",
    keywords: ["extra income", "evening hustles", "weekend jobs"],
    longTail: [
      "realistic part time business ideas for extra income after a job",
      "evening and weekend businesses you can start with your own skills",
    ],
    description:
      "Fifty realistic part time business ideas for extra income: evening and weekend options, the hours each takes and what to expect.",
  },
  "realistic-small-town-business-ideas": {
    src: `${DIR}/realistic-small-town-business-ideas-local-entrepreneurs-trade-businesses-bazaar-services.webp`,
    width: 1280,
    height: 720,
    alt: "Small town business ideas for local entrepreneurs and trade businesses",
    focus: "small town business ideas",
    keywords: ["local entrepreneurs", "trade businesses", "home services"],
    longTail: [
      "small town business ideas that serve what your town already needs",
      "how a local entrepreneur can start a trade business in a small town",
    ],
    description:
      "Fifty realistic small town business ideas for local entrepreneurs: trade and service businesses built on what your town already needs.",
  },
  "30-smart-village-business-ideas": {
    src: `${DIR}/smart-village-business-ideas-agri-input-store-milk-collection-solar-dryer-rural-income.webp`,
    width: 1280,
    height: 720,
    alt: "Smart village business ideas: agri input store and milk collection",
    focus: "smart village business ideas",
    keywords: ["agri input store", "milk collection", "rural income"],
    longTail: [
      "smart village business ideas that actually make money",
      "rural business ideas around farming from sowing to harvest",
    ],
    description:
      "Thirty smart village business ideas that actually make money: agri input stores, milk collection, solar drying and other rural businesses.",
  },
};

/** The mapped image for a slug, or null when none has been added for it. */
export function blogImage(slug: string): BlogImage | null {
  return IMAGES[slug] ?? null;
}
