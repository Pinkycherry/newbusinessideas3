/**
 * Featured images for blog posts, matched to a post by its slug.
 *
 * A post's own `image` column wins when it is set; these fill the gap while
 * the column is empty, so no database row has to change. Written to the same
 * standard as `category-imagery.ts`: a keyword file name, a keyword alt, one
 * focus keyword, three supporting keywords, two long-tail phrases, and a topic
 * caption. Alt and caption describe the business topic and its keywords, never
 * what the picture looks like. None
 * of these keywords repeats another post's or a category image's.
 */
export type BlogImage = {
  src: string;
  alt: string;
  focus: string;
  keywords: [string, string, string];
  longTail: [string, string];
  description: string;
};

const DIR = "/images/blog";

const BLOG_IMAGES: Record<string, BlogImage> = {
  "how-to-price-a-side-hustle-with-no-customers": {
    src: `${DIR}/how-to-price-a-side-hustle-with-no-customers-yet.webp`,
    alt: "How to price a side hustle before you have any customers",
    focus: "how to price a side hustle",
    keywords: ["pricing with no customers", "first price quote", "side hustle pricing"],
    longTail: [
      "how to price a side hustle when you have no customers yet",
      "what to charge for your first paying customer",
    ],
    description:
      "How to price a side hustle with no customers yet: setting a first price, testing it with a real buyer and adjusting after the first sales.",
  },
  "online-business-no-money-no-laptop": {
    src: `${DIR}/starting-an-online-business-with-no-money-and-no-laptop.webp`,
    alt: "Starting an online business from a phone with no money or laptop",
    focus: "online business with no laptop",
    keywords: ["start from a phone", "no money business", "first online customers"],
    longTail: [
      "how to start an online business with no money and no laptop",
      "building an online business using only a smartphone",
    ],
    description:
      "Starting an online business with no money and no laptop: what can be done from a phone and how to find the first customers.",
  },
  "passive-income-myths-reality": {
    src: `${DIR}/the-passive-income-promises-that-fail-in-real-life.webp`,
    alt: "Passive income myths and what the work really involves",
    focus: "passive income promises",
    keywords: ["passive income myths", "income that is not passive", "online income reality"],
    longTail: [
      "passive income promises that fail in real life",
      "why passive income takes more work than people say",
    ],
    description:
      "The passive income promises that fail in real life: which claims about easy income do not hold up and what the work really involves.",
  },
  "find-first-paying-customer-without-ads": {
    src: `${DIR}/how-to-find-your-first-paying-customer-without-spending-on-ads.webp`,
    alt: "How to find your first paying customer without spending on ads",
    focus: "find your first paying customer",
    keywords: ["customers without ads", "first sale", "local business customers"],
    longTail: [
      "how to find your first paying customer without spending on ads",
      "getting a first customer by talking to local business owners",
    ],
    description:
      "Finding a first paying customer without ads: where to look, what to say and how to turn a conversation into a first sale.",
  },
  "packing-error-subscription-box-inventory-software": {
    src: `${DIR}/the-packing-error-that-ends-a-subscription-box-company.webp`,
    alt: "The packing error that ends a subscription box company",
    focus: "subscription box packing error",
    keywords: ["subscription box company", "inventory mistakes", "order fulfilment checks"],
    longTail: [
      "the packing error that ends a subscription box company",
      "how one inventory mistake can sink a subscription box business",
    ],
    description:
      "How a packing error and weak inventory control can end a subscription box company, and the checks that catch it early.",
  },
  "why-your-cobbler-said-no-and-who-still-says-yes": {
    src: `${DIR}/why-your-cobbler-said-no-and-who-still-says-yes.webp`,
    alt: "Why a cobbler says no to some jobs and who still says yes",
    focus: "why your cobbler said no",
    keywords: ["cobbler business", "repair customers", "who says yes"],
    longTail: [
      "why your cobbler said no and who still says yes",
      "finding the customers who will pay for a repair job",
    ],
    description:
      "Why repair businesses like a cobbler turn down some work, and how to find the customers who still say yes.",
  },
  "zero-investment-business-ideas-start-with-zero": {
    src: `${DIR}/stop-waiting-50-zero-investment-business-ideas-you-can-start-with-zero.webp`,
    alt: "Zero investment business ideas you can start today with no money",
    focus: "start with zero investment",
    keywords: ["stop waiting to start", "business from nothing", "no capital business ideas"],
    longTail: [
      "50 zero investment business ideas you can start with zero",
      "how to start a business today without any money",
    ],
    description:
      "Fifty zero investment business ideas: what you can start with no capital, who pays first and what the real cost turns out to be.",
  },
  "side-hustle-ideas-after-your-day-job": {
    src: `${DIR}/50-side-hustle-ideas-you-can-run-after-your-day-job-ends.webp`,
    alt: "Side hustle ideas you can run after your day job ends",
    focus: "side hustles after work",
    keywords: ["after hours business", "evening side business", "day job and side hustle"],
    longTail: [
      "50 side hustle ideas you can run after your day job ends",
      "evening businesses you can start while working full time",
    ],
    description:
      "Fifty side hustle ideas that fit around a full time job: the hours they take, who the first customer is and what can go wrong.",
  },
  "50-untold-work-from-home-business-ideas": {
    src: `${DIR}/50-untold-work-from-home-business-ideas-you-can-start-with-no-money.webp`,
    alt: "Work from home business ideas you can start with no money",
    focus: "untold work from home ideas",
    keywords: ["work from home with no money", "home business starts", "remote work ideas"],
    longTail: [
      "50 untold work from home business ideas you can start with no money",
      "home business ideas that need only a phone and a table",
    ],
    description:
      "Fifty work from home business ideas with no money needed to start: what each one involves, who pays and where it gets hard.",
  },
  "flexible-business-ideas-for-women": {
    src: `${DIR}/flexible-business-ideas-for-women-balancing-work-and-life-home-based-india.webp`,
    alt: "Flexible home based business ideas for women in India",
    focus: "flexible business ideas for women",
    keywords: [
      "balancing work and life",
      "home based business India",
      "women freelancing from home",
    ],
    longTail: [
      "flexible business ideas for women who work from home in India",
      "how women can start an online business around family time",
    ],
    description:
      "Fifty flexible business ideas for women balancing work and life: home based options in India, what each needs and where it gets hard.",
  },
  "high-margin-online-business-ideas": {
    src: `${DIR}/high-margin-online-business-ideas-low-capital-seo-dropshipping-ai-tools-digital-products.webp`,
    alt: "High margin online business ideas that need very little capital",
    focus: "high margin online business ideas",
    keywords: ["low capital online business", "digital products", "AI tools and automation"],
    longTail: [
      "high margin online business ideas that need very little capital",
      "which online businesses keep costs low and margins high",
    ],
    description:
      "Fifty high margin online business ideas that need little capital: digital products, SEO services, AI tools, courses and more, with the real costs.",
  },
  "passive-income-business-ideas-honest-list": {
    src: `${DIR}/passive-income-that-still-needs-work-templates-digital-assets-earn-while-you-build.webp`,
    alt: "Passive income business ideas that still need some work from you",
    focus: "passive income that still needs work",
    keywords: ["templates you sell again", "digital assets", "location freedom income"],
    longTail: [
      "passive income business ideas that still need you a little",
      "how to build once and keep earning from digital assets",
    ],
    description:
      "Fifty passive income business ideas that still need you a little: templates, digital assets and other models, with the work each one takes.",
  },
  "realistic-part-time-business-ideas": {
    src: `${DIR}/realistic-part-time-business-ideas-extra-income-evening-hustles-weekend-jobs-skills.webp`,
    alt: "Realistic part time business ideas for extra income after work",
    focus: "realistic part time business ideas",
    keywords: ["extra income", "evening hustles", "weekend jobs with tools"],
    longTail: [
      "realistic part time business ideas for extra income after a job",
      "evening and weekend businesses you can start with your own skills",
    ],
    description:
      "Fifty realistic part time business ideas for extra income: evening and weekend options, the hours each takes and what to expect.",
  },
  "realistic-small-town-business-ideas": {
    src: `${DIR}/realistic-small-town-business-ideas-local-entrepreneurs-trade-businesses-bazaar-services.webp`,
    alt: "Small town business ideas for local entrepreneurs serving local needs",
    focus: "small town business ideas for local entrepreneurs",
    keywords: ["trade businesses", "home services", "local demand"],
    longTail: [
      "small town business ideas that serve what your town already needs",
      "how a local entrepreneur can start a trade business in a small town",
    ],
    description:
      "Fifty realistic small town business ideas for local entrepreneurs: trade and service businesses built on what your town already needs.",
  },
  "30-smart-village-business-ideas": {
    src: `${DIR}/smart-village-business-ideas-agri-input-store-milk-collection-solar-dryer-rural-income.webp`,
    alt: "Smart village business ideas that earn rural income from farming",
    focus: "smart village business ideas",
    keywords: ["agri input store", "milk collection centre", "solar dryer unit"],
    longTail: [
      "smart village business ideas that actually make money",
      "rural business ideas around farming from sowing to harvest",
    ],
    description:
      "Thirty smart village business ideas that actually make money: agri input stores, milk collection, solar drying and other rural businesses.",
  },
};

/** The mapped image for a post, or null when none has been added for it. */
export function blogImage(slug: string): BlogImage | null {
  return BLOG_IMAGES[slug] ?? null;
}
