import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { toggleShortlistIdea, useFounderWorkspace, type WorkspaceIdea } from "@/lib/founder-workspace";

export function ShortlistToggle({ idea, compact = false, className = "" }: { idea: WorkspaceIdea; compact?: boolean; className?: string }) {
  const { shortlist } = useFounderWorkspace();
  const [notice, setNotice] = useState("");
  const selected = shortlist.some(item => item.slug === idea.slug);
  const click = () => {
    const result = toggleShortlistIdea(idea);
    setNotice(result.message);
  };
  return <div className={className}>
    <button
      type="button"
      aria-pressed={selected}
      onClick={click}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3 py-2 font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${compact ? "text-xs" : "text-sm"} ${selected ? "border-blue-300 bg-blue-50 text-blue-900" : "border-slate-300 bg-white text-slate-800 hover:border-blue-500"}`}
    >
      {selected ? <Check size={16}/> : <Plus size={16}/>}
      {selected ? "Added to compare" : "Add to compare"}
    </button>
    {notice && <p role="status" className="mt-2 text-xs leading-5 text-slate-600">{notice}</p>}
  </div>;
}
