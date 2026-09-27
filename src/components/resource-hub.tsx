import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BookOpen,
  Calculator,
  ChartNoAxesCombined,
  Coins,
  Gem,
  Newspaper,
  Plus,
  Target,
  Wallet,
  BookText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PageResources, ResourceLink } from "@/lib/resources.server";
import "./resource-hub.css";

type Kind = keyof PageResources;
type Group = {
  kind: Kind;
  label: string;
  eyebrow: string;
  description: string;
  action: string;
  to: string;
  Icon: LucideIcon;
  shown: number;
  noun: string;
};

const GROUPS: Group[] = [
  {
    kind: "calculators",
    label: "Make the numbers work.",
    eyebrow: "Free startup calculators",
    description:
      "Your inputs. Clear working. Find the costs, margins and milestones behind your next move.",
    action: "All calculators",
    to: "/calculator",
    Icon: Calculator,
    shown: 6,
    noun: "calculators",
  },
  {
    kind: "guides",
    label: "From a good idea to a first step.",
    eyebrow: "Startup guides",
    description:
      "Practical reading for the decisions ahead, with fresh picks from the library each visit.",
    action: "All guides",
    to: "/startup-guides",
    Icon: BookOpen,
    shown: 3,
    noun: "guides",
  },
  {
    kind: "glossary",
    label: "Speak startup. Skip the jargon.",
    eyebrow: "Startup glossary",
    description: "The terms you will meet along the way, explained in plain language.",
    action: "Full glossary",
    to: "/founder-glossary",
    Icon: BookText,
    shown: 6,
    noun: "terms",
  },
  {
    kind: "posts",
    label: "A fresh angle on building.",
    eyebrow: "From the blog",
    description: "Ideas, field notes and founder lessons worth taking into your next decision.",
    action: "All posts",
    to: "/blog",
    Icon: Newspaper,
    shown: 3,
    noun: "posts",
  },
];

const CALCULATOR_ICONS = [Target, Wallet, ChartNoAxesCombined, Coins, Gem, Calculator];

function ResourceCard({ item, kind, index }: { item: ResourceLink; kind: Kind; index: number }) {
  const Icon =
    kind === "calculators"
      ? CALCULATOR_ICONS[index % CALCULATOR_ICONS.length]!
      : kind === "guides"
        ? BookOpen
        : kind === "posts"
          ? Newspaper
          : BookText;
  const action =
    kind === "calculators"
      ? "Open calculator"
      : kind === "guides"
        ? "Read the guide"
        : kind === "posts"
          ? "Read the story"
          : "See the definition";
  const route =
    kind === "calculators"
      ? { to: "/calculator/$slug", params: { slug: item.slug } }
      : kind === "guides"
        ? { to: "/startup-guides/$slug", params: { slug: item.slug } }
        : kind === "posts"
          ? { to: "/blog/$slug", params: { slug: item.slug } }
          : { to: "/founder-glossary", hash: item.slug };
  return (
    <li>
      <Link {...route} className={`rh-card rh-card--${kind}`}>
        <span className="rh-card-top">
          <span className="rh-card-icon" aria-hidden="true">
            <Icon size={20} strokeWidth={1.65} />
          </span>
          <span className="rh-card-meta">
            {item.meta ||
              (kind === "calculators"
                ? "Your numbers, explained"
                : kind === "glossary"
                  ? "In plain words"
                  : "From the library")}
          </span>
        </span>
        <strong className="rh-card-title">{item.label}</strong>
        {item.blurb && <span className="rh-card-blurb">{item.blurb}</span>}
        <span className="rh-card-foot">
          {action}
          <span className="rh-card-arrow" aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </span>
      </Link>
    </li>
  );
}

function ResourceGroup({ group, items }: { group: Group; items: ResourceLink[] }) {
  const { kind, label, eyebrow, description, action, to, Icon, shown, noun } = group;
  const renderList = (selection: ResourceLink[], offset = 0) => (
    <ul className={`rh-grid rh-grid--${kind}`}>
      {selection.map((item, index) => (
        <ResourceCard key={item.slug} item={item} kind={kind} index={index + offset} />
      ))}
    </ul>
  );
  return (
    <section
      className="rh-block"
      data-kind={kind}
      aria-labelledby={`rh-${kind === "posts" ? "blog" : kind}`}
    >
      <div className="rh-block-head">
        <span className="rh-section-icon" aria-hidden="true">
          <Icon size={24} strokeWidth={1.6} />
        </span>
        <div className="rh-heading">
          <span className="rh-eyebrow">{eyebrow}</span>
          <h3 id={`rh-${kind === "posts" ? "blog" : kind}`}>{label}</h3>
          <p>{description}</p>
        </div>
        <Link to={to} className="rh-action">
          {action}
          <span className="rh-action-arrow" aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </Link>
      </div>
      {renderList(items.slice(0, shown))}
      {items.length > shown && (
        <details className="rh-more">
          <summary className="rh-action">
            <span className="rh-more-closed">Explore more {noun}</span>
            <span className="rh-more-open">Show fewer {noun}</span>
            <Plus className="rh-plus" size={18} aria-hidden="true" />
          </summary>
          {renderList(items.slice(shown), shown)}
        </details>
      )}
    </section>
  );
}

/** Shared resource destination. Server-rendered links and native disclosures;
 * no client fetches, animation runtime, images or per-card event listeners. */
export function ResourceHub({
  resources,
}: {
  resources: PageResources | null | undefined;
  /** Kept for existing shell callers; all surfaces share the same design. */
  cinema?: boolean;
}) {
  if (!resources) return null;
  const groups = GROUPS.filter(({ kind }) => resources[kind].length > 0);
  if (groups.length === 0) return null;
  return (
    <div id="resources" className="rh-hub" data-anchor="resources" data-anchor-label="Free tools">
      <div className="rh-intro">
        <div className="rh-intro-copy">
          <span className="rh-eyebrow">The founder's toolkit · Always free</span>
          <h2>
            Your next move,
            <br />
            made clearer.
          </h2>
          <p>
            Run the numbers. Find your starting point. Everything here is free, with no sign-in or
            credits.
          </p>
        </div>
        <nav className="rh-shortcuts" aria-label="Explore the free toolkit">
          {groups.map(({ kind, eyebrow, Icon }) => (
            <a key={kind} href={`#rh-${kind === "posts" ? "blog" : kind}`}>
              <Icon className="rh-shortcut-icon" size={20} strokeWidth={1.65} aria-hidden="true" />
              <span>{eyebrow}</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          ))}
        </nav>
      </div>
      {groups.map((group) => (
        <ResourceGroup key={group.kind} group={group} items={resources[group.kind]} />
      ))}
    </div>
  );
}
