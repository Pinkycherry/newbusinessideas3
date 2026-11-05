
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { V2Frame } from "@/components/v2/frame";
import { V2PageSection } from "@/components/v2/page-sections";
import "./collection-framework.css";
import "@/components/v2/legacy-surface.css";

const nav = [
  { href: "/templates", label: "Templates" },
  { href: "/tools", label: "Tools" },
  { href: "/topics", label: "Topics" },
  { href: "/lists", label: "Idea lists" },
  { href: "/product", label: "Validator" },
];

export function CollectionFrame({ active, children }: { active: string; children: ReactNode }) {
  return <V2Frame active={active}><div className="cf v2-surface">
    <a className="cf-skip" href="#main-content">Skip to content</a>
    <div aria-hidden="true" style={{ height: "6rem" }} />
    <div id="main-content">{children}</div>
  </div></V2Frame>;
}

export function CollectionLinks({ current }: { current: string }) {
  return <V2PageSection className="cf-wrap cf-next" aria-label="Continue exploring"><div><span className="cf-kicker">CONTINUE THE WORK</span><h2>One question leads to the next.</h2><p>Pick a useful next step while the decision is still small.</p></div><div className="cf-next-links">{nav.filter(item => item.href !== current).map(item => <a key={item.href} href={item.href}>{item.label}<ArrowUpRight size={17}/></a>)}</div></V2PageSection>;
}
