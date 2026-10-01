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
