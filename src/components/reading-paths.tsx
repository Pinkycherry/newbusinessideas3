import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import "@/components/glass-library.css";

type ReadingPath = { to: string; title: string; why: string };
type PathSet = { question: string; intro: string; links: ReadingPath[] };
export function readingPathsFor(topic: string): PathSet {
  const t = topic.toLowerCase();
  if (/customer|paying|lead|outreach|cold.email|sales/.test(t)) return {
    question: "Who would take the first step?",
    intro: "Turn the buyer in this article into a person, an approach and a real response.",
    links: [
      { to: "/first-customer-india", title: "Find the payer", why: "Trace their trigger, workaround and budget decision." },
      { to: "/business-idea-research-india", title: "Check the alternative", why: "Record where they went last time and why." },
      { to: "/business-demand-test-india", title: "Ask for a real move", why: "Define an offer, then separate interest from action." },
    ],
  };
  if (/pric|churn|lifetime.value|retention|freemium|revenue/.test(t)) return {
    question: "Will one sale carry the work?",
    intro: "Move from the article's pricing or retention idea into the economics of your own offer.",
    links: [
      { to: "/business-pricing-india", title: "Quote the whole promise", why: "Include delivery, time and monthly commitments." },
      { to: "/business-models-india", title: "Compare how it earns", why: "See who pays, when and what work repeats." },
      { to: "/startup-cash-flow-india", title: "Check payment timing", why: "Put collection dates beside bills due." },
    ],
  };
  if (/cash|runway|fund|equity|invest|zero|cost/.test(t)) return {
    question: "What leaves before money returns?",
    intro: "Take the funding or cost claim into a transparent personal cash boundary.",
    links: [
      { to: "/startup-costs-india", title: "Map the first cash", why: "List upfront and monthly commitments in rupees." },
      { to: "/startup-cash-flow-india", title: "Put dates on the bills", why: "See the lowest balance before collections." },
      { to: "/business-idea-risk-check", title: "Draw your boundary", why: "Separate cash exposure from time and household needs." },
    ],
  };
  if (/competitor|market|validat|mvp|product.market|idea|research/.test(t)) return {
    question: "What would count as proof here?",
    intro: "Challenge one claim from this page with a local buyer and a smaller test.",
    links: [
      { to: "/business-idea-research-india", title: "Record the source", why: "Put a claim beside the buyer, date and countercase." },
      { to: "/business-demand-test-india", title: "Ask for an action", why: "Test a defined offer instead of a compliment." },
      { to: "/startup-idea-validation", title: "Plan the field test", why: "Choose evidence that could change your mind." },
    ],
  };
  if (/launch|go.to.market|marketing|growth|onboard/.test(t)) return {
    question: "What happens before the launch?",
    intro: "A channel or checklist is useful when a buyer, offer and delivery promise are already clear.",
    links: [
      { to: "/first-customer-india", title: "Find the first payer", why: "Start with the person and their current workaround." },
      { to: "/business-demand-test-india", title: "Test the offer", why: "Ask for a booking, pilot or suitable paid action." },
      { to: "/business-idea-risk-check", title: "Keep it reversible", why: "Reduce fixed promises while evidence is thin." },
    ],
  };
  return {
    question: "What should you test next?",
    intro: "Choose a question this reading raised and use a completed page to answer it.",
    links: [
      { to: "/startup-idea-comparison", title: "Compare two directions", why: "Give both ideas the same evidence questions." },
      { to: "/first-customer-india", title: "Name the first buyer", why: "Find the last problem and real payer." },
      { to: "/business-idea-risk-check", title: "Protect the downside", why: "Set a boundary before a fixed commitment." },
    ],
  };
}
export function ReadingPaths({ context = "article", topic = "" }: { context?: "article" | "guide"; topic?: string }) {
  const set = readingPathsFor(topic);
  return <aside className="gl-reading-paths" aria-label="Related next steps">
    <div className="gl-reading-paths-intro">
      <p className="gh-eyebrow">{context === "guide" ? "TAKE THIS INTO THE FIELD" : "A USEFUL DETOUR"}</p>
      <h2>{set.question}</h2>
      <p>{set.intro}</p>
    </div>
    <div className="gl-reading-path-grid">
      {set.links.map(item => <Link key={item.to} to={item.to as "/"}><strong>{item.title}</strong><span>{item.why}</span><ArrowUpRight size={17} aria-hidden="true"/></Link>)}
    </div>
  </aside>;
}
