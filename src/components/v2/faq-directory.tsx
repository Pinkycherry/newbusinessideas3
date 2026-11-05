import { useState } from "react";
import { ArrowRight, ChevronRight, Search } from "lucide-react";
import { V2Frame } from "./frame";
import { SellerFaq } from "./faq";
import type { FaqDirectoryGroup } from "@/lib/faq.functions";
import "./faq-directory.css";

export function FaqDirectory({ groups }: { groups: FaqDirectoryGroup[] }) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(30);
  const search = query.trim().toLocaleLowerCase("en");
  const matches = groups.flatMap(group => (category === "all" || group.code === category ? group.items : [])
    .filter(item => !search || `${item.q} ${item.a} ${group.name}`.toLocaleLowerCase("en").includes(search))
    .map(item => ({ ...item, category: group.name })));
  const shown = matches.slice(0, visible).map(item => ({
    q: item.q,
    a: <>{item.a}<span className="fd-origin">{item.category}</span></>,
    href: item.href,
  }));
  const changeCategory = (code: string) => { setCategory(code); setVisible(30); };
  return <V2Frame active="/faq"><main className="fd-page">
    <section className="fd-hero"><div className="fd-inner">
      <nav aria-label="Breadcrumb" className="fd-crumb"><a href="/">Home</a><ChevronRight size={15} /><span>Questions</span></nav>
      <span className="fd-eyebrow">Business idea questions</span>
      <h1>Questions founders ask</h1>
      <p>Explore answers from our published business idea lists and ideas. Choose a category or search for the question on your mind.</p>
      <a className="fd-button" href="#faq-list">Explore questions <ArrowRight size={17} /></a>
    </div></section>
    <section id="faq-list" className="fd-directory"><div className="fd-inner">
      <div className="fd-heading"><span>Explore by category</span><h2>Find an answer</h2></div>
      <label className="fd-search"><Search size={19} /><span className="sr-only">Search questions and answers</span><input type="search" value={query} onChange={e => { setQuery(e.target.value); setVisible(30); }} placeholder="Search questions and answers" /></label>
      <nav aria-label="Filter questions by category" className="fd-filters"><button type="button" aria-pressed={category === "all"} onClick={() => changeCategory("all")}>All categories</button>{groups.map(group => <button key={group.code} type="button" aria-pressed={category === group.code} onClick={() => changeCategory(group.code)}>{group.name}</button>)}</nav>
      {shown.length ? <SellerFaq key={`${category}:${query}`} faq={shown} title="Questions and answers" /> : <p className="fd-empty">No matching questions. Try another search or category.</p>}
      {matches.length > visible && <button type="button" className="fd-more" onClick={() => setVisible(value => value + 30)}>Show more questions <ArrowRight size={17} /></button>}
    </div></section>
    <section className="fd-cta"><div className="fd-inner"><h2>Have a question about your next step?</h2><p>Explore the idea lists or get in touch with our team.</p><a href="/contact" className="fd-button">Contact us <ArrowRight size={17} /></a><a className="fd-text-link" href="/lists">Browse idea lists <ArrowRight size={16} /></a></div></section>
  </main></V2Frame>;
}
