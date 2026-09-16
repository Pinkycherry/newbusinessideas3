/**
 * Featured images for the category surfaces.
 *
 * These are BBI's own files, committed to `public/images/categories/` and
 * served from this domain — not hotlinked from anywhere. Every field below is
 * written to the standard in `IMAGE_SEO.md`, which is the contract for every
 * image added to this site from here on:
 *
 *   file name  — at least 5 keywords, lowercase, hyphenated
 *   alt        — 4 keywords, a real sentence a screen reader can use
 *   focus      — the one keyword the image is meant to rank for
 *   keywords   — 3 supporting keywords beyond the focus
 *   longTail   — 2 long-tail phrases
 *   description— the caption/`<figcaption>`/schema description
 *
 * MATCHING IS BY WORD, NEVER BY A HAND-TYPED SLUG. `src/lib/catalog-display.ts`
 * carries the reason in full: a hardcoded list of fourteen slugs shipped with
 * two of them wrong, and the surfaces reading it silently rendered short. A
 * category whose slug matches no rule gets `GENERIC` rather than nothing, so
 * no card is ever left without an image, and a renamed category keeps working.
 */
export type CategoryImage = {
  src: string;
  alt: string;
  focus: string;
  keywords: [string, string, string];
  longTail: [string, string];
  description: string;
};

const DIR = "/images/categories";

/** The fallback. Used for any category the rules below do not recognise. */
export const GENERIC: CategoryImage = {
  src: `${DIR}/researched-business-ideas-library-startup-opportunity-blueprints-free.webp`,
  alt: "Free researched business ideas library showing startup opportunity blueprints",
  focus: "researched business ideas",
  keywords: ["business idea blueprints", "startup opportunity", "free business ideas library"],
  longTail: [
    "free library of researched business ideas for beginners",
    "where to find researched startup ideas without paying",
  ],
  description:
    "The BBI library: researched business ideas written as blueprints, with the buyer, the money and the year-one risk spelled out, free to browse.",
};

/**
 * True when `phrase` appears in `slug` as one or more WHOLE hyphen-delimited
 * segments. This is the whole reason the rules below are phrases and not
 * regexes: a substring match sent `ecommerce-retail` to the AI image, because
 * "retail" contains "ai", and sent both `education-edtech` and
 * `fintech-finance` to the SaaS image, because both contain "tech". Three of
 * fourteen categories were showing another category's picture.
 */
const hasSegment = (slug: string, phrase: string) =>
  `-${slug}-`.includes(`-${phrase}-`);

const RULES: { match: string[]; image: CategoryImage }[] = [
  {
    match: ["zero-investment", "no-investment", "no-money"],
    image: {
      src: `${DIR}/zero-investment-business-ideas-no-money-free-to-start-online-beginners.webp`,
      alt: "Zero investment business ideas you can start online with no money as a beginner",
      focus: "zero investment business ideas",
      keywords: ["business ideas with no money", "free to start business", "online business ideas"],
      longTail: [
        "zero investment business ideas from home for students",
        "how to start a business with no money online in India",
      ],
      description:
        "Zero investment business ideas: what you can start with no capital, who pays you first, and what the real cost turns out to be once you begin.",
    },
  },
  {
    match: ["low-investment", "small-capital", "low-cost"],
    image: {
      src: `${DIR}/low-investment-business-ideas-small-capital-startup-low-budget-beginners.webp`,
      alt: "Low investment business ideas for beginners starting on a small budget",
      focus: "low investment business ideas",
      keywords: ["small capital business", "low budget startup", "business ideas for beginners"],
      longTail: [
        "low investment business ideas with high profit for beginners",
        "small business ideas under a low budget to start from home",
      ],
      description:
        "Low investment business ideas: the ones a small budget actually reaches, with the real setup cost and the first customer named.",
    },
  },
  {
    match: ["passive-income", "recurring-revenue"],
    image: {
      src: `${DIR}/passive-income-business-ideas-recurring-revenue-digital-products-online-earning.webp`,
      alt: "Passive income business ideas built on digital products and recurring revenue",
      focus: "passive income business ideas",
      keywords: ["recurring revenue", "digital products", "online earning"],
      longTail: [
        "passive income business ideas that actually pay every month",
        "how to build recurring revenue from digital products",
      ],
      description:
        "Passive income business ideas: what has to be built first, how long before it pays, and which ones are not passive at all.",
    },
  },
  {
    match: ["side-hustle", "part-time"],
    image: {
      src: `${DIR}/side-hustle-business-ideas-part-time-income-evenings-weekends-beginners.webp`,
      alt: "Side hustle business ideas for part time income in evenings and weekends",
      focus: "side hustle ideas",
      keywords: ["part time business", "evening income", "weekend side hustle"],
      longTail: [
        "side hustle ideas you can run alongside a full time job",
        "part time business ideas for evenings and weekends",
      ],
      description:
        "Side hustle ideas: what fits around a job, how many hours it really takes, and the point at which it stops being a side hustle.",
    },
  },
  {
    match: ["work-from-home", "home-based", "remote"],
    image: {
      src: `${DIR}/work-from-home-business-ideas-remote-online-jobs-home-based-self-employed.webp`,
      alt: "Work from home business ideas for remote online and home based self employed work",
      focus: "work from home business ideas",
      keywords: ["remote business", "home based business", "online work from home"],
      longTail: [
        "work from home business ideas that need no office space",
        "home based online business ideas for beginners with a laptop",
      ],
      description:
        "Work from home business ideas: what runs from a room and a laptop, what it costs to set up, and where working from home starts to hurt.",
    },
  },
  {
    match: ["timeless", "evergreen", "never-go-out-of-style"],
    image: {
      src: `${DIR}/timeless-business-ideas-evergreen-small-business-profitable-long-term.webp`,
      alt: "Timeless evergreen business ideas that stay profitable as small businesses long term",
      focus: "timeless business ideas",
      keywords: ["evergreen business", "profitable small business", "long term business ideas"],
      longTail: [
        "timeless business ideas that never go out of demand",
        "evergreen small business ideas that stay profitable for years",
      ],
      description:
        "Timeless business ideas: the demand that does not move with a trend cycle, and what it takes to be the one who serves it.",
    },
  },
  {
    match: ["ai", "ai-automation", "automation"],
    image: {
      src: `${DIR}/ai-automation-business-ideas-artificial-intelligence-saas-startup-online.webp`,
      alt: "AI and automation business ideas for artificial intelligence and SaaS startups online",
      focus: "AI business ideas",
      keywords: ["automation business", "artificial intelligence startup", "AI SaaS ideas"],
      longTail: [
        "AI automation business ideas for a solo founder to start",
        "artificial intelligence startup ideas with low setup cost",
      ],
      description:
        "AI and automation business ideas: what a small team can actually ship, who pays for it, and where the running cost bites.",
    },
  },
  {
    match: ["tech", "saas", "software", "tech-saas"],
    image: {
      src: `${DIR}/tech-saas-business-ideas-software-startup-subscription-b2b-micro-saas.webp`,
      alt: "Tech and SaaS business ideas for software startups running B2B micro SaaS subscriptions",
      focus: "SaaS business ideas",
      keywords: ["software startup", "micro SaaS", "B2B subscription business"],
      longTail: [
        "micro SaaS business ideas a solo developer can build",
        "B2B software startup ideas with subscription revenue",
      ],
      description:
        "Tech and SaaS business ideas: the buyer, the subscription mechanics, and the year-one churn nobody warns you about.",
    },
  },
  {
    match: ["fintech", "finance", "payments", "lending"],
    image: {
      src: `${DIR}/fintech-finance-business-ideas-payments-lending-personal-finance-startup.webp`,
      alt: "FinTech and finance business ideas covering payments, lending and personal finance startups",
      focus: "fintech business ideas",
      keywords: ["payments startup", "lending business", "personal finance product"],
      longTail: [
        "fintech business ideas for a startup without a banking licence",
        "personal finance business ideas that are legal to run solo",
      ],
      description:
        "FinTech and finance business ideas: where the licensing wall sits, what you may operate without one, and how the money is actually made.",
    },
  },
  {
    match: ["ecommerce", "e-commerce", "commerce", "retail", "store"],
    image: {
      src: `${DIR}/ecommerce-retail-business-ideas-online-store-dropshipping-d2c-small-business.webp`,
      alt: "E-commerce and retail business ideas for an online store, dropshipping and D2C small business",
      focus: "ecommerce business ideas",
      keywords: ["online store", "dropshipping", "D2C small business"],
      longTail: [
        "ecommerce business ideas with low inventory risk to start",
        "D2C online store ideas for a first time seller",
      ],
      description:
        "E-commerce and retail business ideas: the margin after fees, the inventory you are stuck with, and which models avoid both.",
    },
  },
  {
    match: ["education", "edtech", "tutoring", "course", "courses"],
    image: {
      src: `${DIR}/education-edtech-business-ideas-online-tutoring-courses-coaching-startup.webp`,
      alt: "Education and EdTech business ideas for online tutoring, courses and coaching startups",
      focus: "edtech business ideas",
      keywords: ["online tutoring business", "online course business", "coaching startup"],
      longTail: [
        "edtech business ideas for a teacher going independent",
        "online course business ideas that do not need a large audience",
      ],
      description:
        "Education and EdTech business ideas: who pays — learner, parent or institution — and what each of them expects for the money.",
    },
  },
  {
    match: ["health", "fitness", "wellness", "nutrition"],
    image: {
      src: `${DIR}/health-fitness-business-ideas-wellness-nutrition-personal-training-online-coaching.webp`,
      alt: "Health and fitness business ideas for wellness, nutrition and online personal training coaching",
      focus: "health and fitness business ideas",
      keywords: ["wellness business", "nutrition business", "online personal training"],
      longTail: [
        "health and fitness business ideas you can run without a gym",
        "online personal training business ideas for a certified coach",
      ],
      description:
        "Health and fitness business ideas: which need a qualification, which need insurance, and which need neither to begin.",
    },
  },
  {
    match: ["creator", "media", "content", "podcast"],
    image: {
      src: `${DIR}/creator-media-business-ideas-content-creator-youtube-podcast-online-income.webp`,
      alt: "Creator and media business ideas for content creators earning from YouTube and podcasts",
      focus: "creator business ideas",
      keywords: ["content creator income", "YouTube business", "podcast business"],
      longTail: [
        "creator business ideas that pay before you have an audience",
        "content business ideas for a small YouTube or podcast following",
      ],
      description:
        "Creator and media business ideas: where the money comes from before the audience arrives, and what an audience is actually worth.",
    },
  },
  {
    match: ["productivity", "workflow", "tools"],
    image: {
      src: `${DIR}/productivity-workflow-business-ideas-saas-tools-automation-remote-teams.webp`,
      alt: "Productivity and workflow business ideas for SaaS tools automating work for remote teams",
      focus: "productivity business ideas",
      keywords: ["workflow tools", "automation software", "remote team tools"],
      longTail: [
        "productivity tool business ideas for small remote teams",
        "workflow automation business ideas to sell to businesses",
      ],
      description:
        "Productivity and workflow business ideas: the specific hour of somebody's week you are selling back to them, and what that is worth.",
    },
  },
];

/**
 * The featured image for a category slug. Never null — an unrecognised slug
 * gets the generic library image rather than an empty plate.
 */
export function categoryImage(slug: string): CategoryImage {
  const rule = RULES.find((r) => r.match.some((phrase) => hasSegment(slug, phrase)));
  return rule ? rule.image : GENERIC;
}

/** Every image in the set, for the sitemap and for auditing the SEO fields. */
export const ALL_CATEGORY_IMAGES: CategoryImage[] = [GENERIC, ...RULES.map((r) => r.image)];
