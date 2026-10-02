/**
 * Featured images for blog posts, matched to a post by its slug.
 *
 * A post's own `image` column wins when it is set; these fill the gap while
 * the column is empty, so no database row has to change. Written to the same
 * standard as `category-imagery.ts`: a keyword file name, a four-keyword alt,
 * one focus keyword, three supporting keywords, two long-tail phrases, and a
 * description of what the picture actually shows (used as the caption). None
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
    alt: "Young woman showing a handwritten price list to a customer before her first sale",
    focus: "how to price a side hustle",
    keywords: ["pricing with no customers", "first price quote", "side hustle pricing"],
    longTail: [
      "how to price a side hustle when you have no customers yet",
      "what to charge for your first paying customer",
    ],
    description:
      "A young woman in a red scarf leans across a tea stall counter and slides a handwritten price list to an older man who rests his chin on his hand, deciding. Two glasses of tea sit between them, and a wall clock and a notebook of working-out show behind her.",
  },
  "online-business-no-money-no-laptop": {
    src: `${DIR}/starting-an-online-business-with-no-money-and-no-laptop.webp`,
    alt: "Young man planning an online business from his phone with no laptop or money",
    focus: "online business with no laptop",
    keywords: ["start from a phone", "no money business", "market stall customers"],
    longTail: [
      "how to start an online business with no money and no laptop",
      "building an online business using only a smartphone",
    ],
    description:
      "A young man in glasses sits on a stairway above a busy market street, holding up his phone and explaining a plan with one hand. Paper notes drift past him, and below him a shopkeeper and a customer photograph goods on a phone.",
  },
  "passive-income-myths-reality": {
    src: `${DIR}/the-passive-income-promises-that-fail-in-real-life.webp`,
    alt: "Two young workers still working late despite promises of easy passive income",
    focus: "passive income promises",
    keywords: ["passive income myths", "income that is not passive", "online income reality"],
    longTail: [
      "passive income promises that fail in real life",
      "why passive income takes more work than people say",
    ],
    description:
      "A young woman looks back over her shoulder from a late night desk, and a young man in glasses edits video on a laptop beside a clock. Cracked glass cuts across the frame, with faint images of the same people behind it.",
  },
  "find-first-paying-customer-without-ads": {
    src: `${DIR}/how-to-find-your-first-paying-customer-without-spending-on-ads.webp`,
    alt: "Shopkeeper shaking hands with a young man over a printed offer for her first sale",
    focus: "find your first paying customer",
    keywords: ["customers without ads", "first sale", "local shop customer"],
    longTail: [
      "how to find your first paying customer without spending on ads",
      "getting a first customer by talking to a local shop owner",
    ],
    description:
      "A smiling woman in a red jacket, holding a phone, shakes hands across her shop counter with a young man who holds a printed offer. Shelves of stationery fill the shop, and a smaller image of a woman at a laptop sits behind them.",
  },
  "packing-error-subscription-box-inventory-software": {
    src: `${DIR}/the-packing-error-that-ends-a-subscription-box-company.webp`,
    alt: "Two founders reacting to a packing mistake in a subscription box warehouse",
    focus: "subscription box packing error",
    keywords: ["subscription box company", "inventory mistakes", "warehouse packing"],
    longTail: [
      "the packing error that ends a subscription box company",
      "how one inventory mistake can sink a subscription box business",
    ],
    description:
      "In a warehouse of stacked boxes, a woman in a red blazer holds up a clear pouch of mixed nuts and speaks urgently while a young man in glasses reaches across an open box with a tape gun. Smaller scenes of a worried man and woman sit behind them.",
  },
  "why-your-cobbler-said-no-and-who-still-says-yes": {
    src: `${DIR}/why-your-cobbler-said-no-and-who-still-says-yes.webp`,
    alt: "Cobbler stitching a boot as a woman holds a sole and asks for his help",
    focus: "why your cobbler said no",
    keywords: ["cobbler business", "repair customers", "who says yes"],
    longTail: [
      "why your cobbler said no and who still says yes",
      "finding the customers who will pay for a repair job",
    ],
    description:
      "A bearded cobbler in glasses and a leather apron stitches a brown boot at his workbench while a smiling woman holds up a shoe sole beside him. Behind them a man in the market lane raises a hand in refusal, next to a red cross.",
  },
  "zero-investment-business-ideas-start-with-zero": {
    src: `${DIR}/stop-waiting-50-zero-investment-business-ideas-you-can-start-with-zero.webp`,
    alt: "Young woman in a dark jacket looking ahead before starting from zero",
    focus: "start with zero investment",
    keywords: ["stop waiting to start", "business from nothing", "zero rupee ideas"],
    longTail: [
      "50 zero investment business ideas you can start with zero",
      "how to start a business today without any money",
    ],
    description:
      "A close portrait of a young woman with windswept hair and a dark jacket, looking out of the frame. Behind her a narrow lane shows a figure walking away, and a street vendor sells from a stall. The words Start with Zero, 50 Ideas run down the left side.",
  },
  "side-hustle-ideas-after-your-day-job": {
    src: `${DIR}/50-side-hustle-ideas-you-can-run-after-your-day-job-ends.webp`,
    alt: "Office worker loosening his tie at sunset before an after hours side hustle",
    focus: "side hustles after work",
    keywords: ["after hours business", "evening side business", "day job and side hustle"],
    longTail: [
      "50 side hustle ideas you can run after your day job ends",
      "evening businesses you can start while working full time",
    ],
    description:
      "A young man in a loosened tie looks up at a red sunset over the city as office workers leave behind him. Below, a craftsman works at a bench under a red light. The words After Hours, 50 Side Hustles fill the right side.",
  },
  "50-untold-work-from-home-business-ideas": {
    src: `${DIR}/50-untold-work-from-home-business-ideas-you-can-start-with-no-money.webp`,
    alt: "Young woman laughing with a phone and papers while others work from home",
    focus: "untold work from home ideas",
    keywords: ["work from home with no money", "home business starts", "remote work ideas"],
    longTail: [
      "50 untold work from home business ideas you can start with no money",
      "home business ideas that need only a phone and a table",
    ],
    description:
      "A young woman with a red scarf bursts forward laughing, holding a phone and a handful of papers. Behind her, two other women work at home desks, one on a phone call and one at a laptop, in a warm room with plants and a desk lamp.",
  },
  "flexible-business-ideas-for-women": {
    src: `${DIR}/flexible-business-ideas-for-women-balancing-work-and-life-home-based-india.webp`,
    alt: "Indian women running flexible home based businesses while balancing work and life",
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
      "Two young women in a bright home studio: one smiling at a laptop beside a notepad and a plant, the other working at a craft table. Labels around them name online tutoring, social media management, handmade products, content creation, print on demand, freelance writing, affiliate marketing and virtual assistant work.",
  },
  "high-margin-online-business-ideas": {
    src: `${DIR}/high-margin-online-business-ideas-low-capital-seo-dropshipping-ai-tools-digital-products.webp`,
    alt: "Two young entrepreneurs planning high margin online businesses with little capital",
    focus: "high margin online business ideas",
    keywords: ["low capital online business", "digital products", "AI tools and automation"],
    longTail: [
      "high margin online business ideas that need very little capital",
      "which online businesses keep costs low and margins high",
    ],
    description:
      "A young man and woman at a laptop, looking up at a lightbulb marked High Margin. Branches from it lead to print on demand, digital products, SEO services, online courses, AI tools and automation, dropshipping, affiliate marketing, social media management and content creation.",
  },
  "passive-income-business-ideas-honest-list": {
    src: `${DIR}/passive-income-that-still-needs-work-templates-digital-assets-earn-while-you-build.webp`,
    alt: "Young man relaxing with a laptop while templates and digital assets earn income",
    focus: "passive income that still needs work",
    keywords: ["templates you sell again", "digital assets", "location freedom income"],
    longTail: [
      "passive income business ideas that still need you a little",
      "how to build once and keep earning from digital assets",
    ],
    description:
      "A young man in an armchair with a laptop and a cup of tea, looking out over hills at sunset. On the right, four examples of ideas that keep earning: templates, digital assets, coin machines and plants that keep growing.",
  },
  "realistic-part-time-business-ideas": {
    src: `${DIR}/realistic-part-time-business-ideas-extra-income-evening-hustles-weekend-jobs-skills.webp`,
    alt: "Young people building realistic part time businesses for extra income after work",
    focus: "realistic part time business ideas",
    keywords: ["extra income", "evening hustles", "weekend jobs with tools"],
    longTail: [
      "realistic part time business ideas for extra income after a job",
      "evening and weekend businesses you can start with your own skills",
    ],
    description:
      "A smiling young man at a laptop in the evening, with scenes around him: a food stall, an online tutor teaching, and a craftsman using tools. Labels read evening hustles with food stalls and local services, teach or tutor online or offline, evening laptop work from home, and weekend jobs with tools and skills.",
  },
  "realistic-small-town-business-ideas": {
    src: `${DIR}/realistic-small-town-business-ideas-local-entrepreneurs-trade-businesses-bazaar-services.webp`,
    alt: "Young local entrepreneurs planning realistic small town businesses around everyday needs",
    focus: "small town business ideas for local entrepreneurs",
    keywords: ["trade businesses", "home services", "local demand"],
    longTail: [
      "small town business ideas that serve what your town already needs",
      "how a local entrepreneur can start a trade business in a small town",
    ],
    description:
      "A young man and woman standing in a small town market street at dusk, he with folded arms, she holding a tablet. Signs show an agri supply center, cement and steel hardware, and a home services board listing repair, cleaning, tutoring and beauty. A route along the top runs from highway to bazaar, farm edge, building site and homes.",
  },
  "30-smart-village-business-ideas": {
    src: `${DIR}/smart-village-business-ideas-agri-input-store-milk-collection-solar-dryer-rural-income.webp`,
    alt: "Young villagers planning smart village businesses around farming and rural income",
    focus: "smart village business ideas",
    keywords: ["agri input store", "milk collection centre", "solar dryer unit"],
    longTail: [
      "smart village business ideas that actually make money",
      "rural business ideas around farming from sowing to harvest",
    ],
    description:
      "A young man and woman in a village at sunset, a tractor working a field behind them. Buildings show an agri input store, a milk collection center and a solar dryer unit. A row along the top follows the farm cycle: before sowing, while crops grow, at harvest, after harvest and every day.",
  },
};

/** The mapped image for a post, or null when none has been added for it. */
export function blogImage(slug: string): BlogImage | null {
  return BLOG_IMAGES[slug] ?? null;
}
