import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { readingPathsFor } from "@/components/reading-paths";
import "@/components/glass-library.css";

export function ReaderCompanion({ sections, label, topic = "" }: { sections: { id: string; label: string }[]; label: string; topic?: string }) {
  const paths = readingPathsFor(topic).links;
  return <aside className="gl-reader-companion" aria-label={label}>
    <p className="gh-eyebrow">ON THIS PAGE</p>
    {sections.length > 0 && <nav aria-label={label}>
      {sections.slice(0, 16).map(section => <a key={section.id} href={`#${section.id}`}>{section.label}</a>)}
    </nav>}
    <div className="gl-companion-actions">
      <strong>Use the next question</strong>
      {paths.map(item => <Link key={item.to} to={item.to as "/"}>{item.title} <ArrowUpRight size={14}/></Link>)}
    </div>
  </aside>;
}
