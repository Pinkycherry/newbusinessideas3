import { Link } from "@tanstack/react-router";
import {
  Compass,
  Calculator,
  BookOpen,
  Users,
  BookMarked,
  GraduationCap,
  Newspaper,
  HelpCircle,
  Wrench,
  ListOrdered,
  type LucideIcon,
} from "lucide-react";

export type ExploreDestination =
  | "ideas"
  | "calculators"
  | "guides"
  | "founderStories"
  | "glossary"
  | "learningResources"
  | "blog"
  | "faq"
  | "usefulTools"
  | "lists";

type Entry = { to: string; label: string; blurb: string; Icon: LucideIcon; tint: string };

/**
 * Every template on the site, one line each. 2026-09-19: an idea page linked
 * to nothing but other idea pages; a calculator linked to nothing but the
 * calculator index; the homepage's own body copy linked to /about, /browse
 * and /search and nowhere else. Nine real templates existed and reached each
 * other only through the header dropdown and the footer -- which a reader
 * mid-article never opens. ideaproof.io chains its tools this same way
 * (validator -> business plan -> brand strategy -> ...); this registry is
 * that same chaining, just data instead of one-off links copy-pasted onto
 * every page.
 */
const REGISTRY: Record<ExploreDestination, Entry> = {
  ideas: {
    to: "/browse",
    label: "Browse business ideas",
    blurb: "Researched blueprints with pros, cons and a verdict.",
    Icon: Compass,
    tint: "--hl-teal",
  },
  calculators: {
    to: "/calculator",
    label: "Free startup calculators",
    blurb: "Startup cost, break-even, runway — run your own numbers.",
    Icon: Calculator,
    tint: "--hl-coral",
  },
  guides: {
    to: "/startup-guides",
    label: "Startup guides",
    blurb: "Step-by-step playbooks for getting an idea off the ground.",
    Icon: BookOpen,
    tint: "--primary",
  },
  founderStories: {
    to: "/founder-stories",
    label: "Founder stories",
    blurb: "How real founders actually built and launched theirs.",
    Icon: Users,
    tint: "--hl-green",
  },
  glossary: {
    to: "/founder-glossary",
    label: "Startup glossary",
    blurb: "Every startup term, explained in plain language.",
    Icon: BookMarked,
    tint: "--hl-teal",
  },
  learningResources: {
    to: "/learning-resources",
    label: "Learning resources",
    blurb: "Curated reading and tools for first-time founders.",
    Icon: GraduationCap,
    tint: "--hl-coral",
  },
  blog: {
    to: "/blog",
    label: "Blog",
    blurb: "Notes on building, validating and shipping businesses.",
    Icon: Newspaper,
    tint: "--primary",
  },
  faq: {
    to: "/faq",
    label: "Startup FAQ",
    blurb: "Answers to the questions every first-time founder asks.",
    Icon: HelpCircle,
    tint: "--hl-green",
  },
  usefulTools: {
    to: "/useful-tools",
    label: "Useful tools",
    blurb: "The software and services worth paying for on day one.",
    Icon: Wrench,
    tint: "--hl-teal",
  },
  lists: {
    to: "/list",
    label: "Ranked idea lists",
    blurb: "Best-of roundups, one ranked list per category.",
    Icon: ListOrdered,
    tint: "--hl-coral",
  },
};

/** Fixed order so two nearby rails on the same page pick the same first few
 * destinations rather than shuffling — a reader who sees this block twice
 * (e.g. an idea page and, later, a category page) should recognize it. */
const ALL: ExploreDestination[] = [
  "ideas",
  "calculators",
  "guides",
  "founderStories",
  "glossary",
  "blog",
  "learningResources",
  "faq",
  "usefulTools",
  "lists",
];

function toExcludeSet(exclude: ExploreDestination | ExploreDestination[]) {
  return new Set(Array.isArray(exclude) ? exclude : [exclude]);
}

/**
 * The three-card "keep exploring" strip for the bottom of a detail/index page.
 * `exclude` is always that page's own template, so it never recommends
 * itself.
 */
export function ExploreRail({
  exclude,
  count = 3,
  heading = "Keep exploring",
}: {
  exclude: ExploreDestination | ExploreDestination[];
  count?: number;
  heading?: string;
}) {
  const excluded = toExcludeSet(exclude);
  const picks = ALL.filter((key) => !excluded.has(key)).slice(0, count);
  if (picks.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <p className="t-eyebrow">{heading}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {picks.map((key) => {
          const entry = REGISTRY[key];
          const Icon = entry.Icon;
          return (
            <Link
              key={key}
              to={entry.to}
              className="glass glass-hover group flex flex-col gap-2 rounded-2xl p-4"
            >
              <Icon
                aria-hidden
                className="h-5 w-5"
                style={{ color: `var(${entry.tint})` }}
                strokeWidth={1.75}
              />
              <span className="text-sm font-semibold text-foreground transition-colors duration-300 group-hover:text-accent">
                {entry.label}
              </span>
              <span className="text-xs leading-relaxed text-muted-foreground">{entry.blurb}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/**
 * One full-width horizontal pick, sized to slot into a listing grid's own
 * `[grid-column:1/-1]` interstitial row next to (never instead of) an
 * AdSlot — see category.$categorySlug.index.tsx, which alternates the two so
 * a long category page interleaves both without cutting ad inventory.
 */
export function ExploreBanner({
  pick,
  exclude,
}: {
  pick: ExploreDestination;
  exclude?: ExploreDestination | ExploreDestination[];
}) {
  const excluded = exclude ? toExcludeSet(exclude) : new Set<ExploreDestination>();
  const key = excluded.has(pick) ? ALL.find((k) => !excluded.has(k)) : pick;
  if (!key) return null;
  const entry = REGISTRY[key];
  const Icon = entry.Icon;

  return (
    <Link
      to={entry.to}
      className="glass glass-hover group flex items-center gap-4 rounded-2xl p-4 sm:p-5"
    >
      <Icon
        aria-hidden
        className="h-6 w-6 shrink-0"
        style={{ color: `var(${entry.tint})` }}
        strokeWidth={1.75}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground transition-colors duration-300 group-hover:text-accent">
          {entry.label}
        </span>
        <span className="block text-xs text-muted-foreground">{entry.blurb}</span>
      </span>
      <span
        aria-hidden
        className="shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}

/** Rotation order for `ExploreBanner` instances inside a long grid, so the
 * third, fourth, fifth... banner on a big category page doesn't repeat the
 * same destination as the first. */
export const EXPLORE_BANNER_ROTATION: ExploreDestination[] = [
  "calculators",
  "guides",
  "founderStories",
  "blog",
  "glossary",
  "learningResources",
  "faq",
  "lists",
  "usefulTools",
];
