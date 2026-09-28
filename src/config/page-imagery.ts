/**
 * Featured images for the library's index pages: /browse, /founder-glossary,
 * /founder-stories and /learning-resources.
 *
 * Same contract as `category-imagery.ts` (file name of 5+ keywords, alt of 4
 * keywords, one focus keyword, 3 supporting keywords, 2 long-tail phrases and
 * a caption), and the same `CategoryImage` shape, so the head tags and the
 * hero figure read them exactly the way category pages do. The files live in
 * `public/images/pages/` and are served from this domain.
 */
import type { CategoryImage } from "@/config/category-imagery";

const DIR = "/images/pages";

export const PAGE_IMAGES = {
  browse: {
    src: `${DIR}/business-ideas-library-browse-all-categories-researched-startup-blueprints.webp`,
    alt: "Business ideas library with every category of researched startup ideas to browse",
    focus: "business ideas library",
    keywords: ["browse business ideas", "business idea categories", "researched startup ideas"],
    longTail: [
      "browse all business ideas by category for free",
      "library of researched business ideas for beginners in India",
    ],
    description:
      "The full BBI idea library: every category of researched business ideas in one place, free after one sign-in.",
  },
  glossary: {
    src: `${DIR}/founder-glossary-unit-economics-startup-terms-business-definitions.webp`,
    alt: "Founder and unit economics glossary of startup terms and business definitions",
    focus: "founder glossary",
    keywords: ["unit economics glossary", "startup terms", "business definitions"],
    longTail: [
      "startup glossary with unit economics formulas explained",
      "business terms every first time founder should know",
    ],
    description:
      "The founder glossary: startup and unit economics terms defined in plain words, with the formula where one exists.",
  },
  stories: {
    src: `${DIR}/founder-stories-case-studies-bootstrapped-business-examples-inspiration.webp`,
    alt: "Founder stories and case studies of bootstrapped businesses for startup inspiration",
    focus: "founder stories",
    keywords: ["startup case studies", "bootstrapped business examples", "founder inspiration"],
    longTail: [
      "founder stories and case studies for first time entrepreneurs",
      "bootstrapped business case studies to learn from",
    ],
    description:
      "Founder stories and case studies: breakdowns of how real businesses started, published here only once the numbers in them are real.",
  },
  resources: {
    src: `${DIR}/founder-toolkit-learning-resources-free-startup-guides-calculators.webp`,
    alt: "Founder toolkit of free learning resources, startup guides and calculators for starting a business",
    focus: "founder toolkit",
    keywords: ["learning resources for founders", "startup guides", "business calculators"],
    longTail: [
      "free resources to start a business from scratch",
      "startup toolkit with guides and calculators for beginners",
    ],
    description:
      "The founder toolkit: guides, calculators, glossary terms and case studies gathered in one place, free to use.",
  },
} satisfies Record<string, CategoryImage>;

/**
 * The og:image / twitter:image tags for a page image, as category pages emit
 * them. The route supplies `twitter:card` itself, since /browse already has one.
 */
export function pageImageMeta(image: CategoryImage, absolute: (path: string) => string) {
  return [
    { property: "og:image", content: absolute(image.src) },
    { property: "og:image:alt", content: image.alt },
    { name: "twitter:image", content: absolute(image.src) },
  ];
}
