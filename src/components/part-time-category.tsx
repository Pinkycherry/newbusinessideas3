import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { TaxonomyCategory } from "@/data/taxonomy";
import { GlassShell } from "@/components/glass-shell";
import "./part-time-category.css";

type PartTimeProps = { category: TaxonomyCategory; related: TaxonomyCategory[] };

const lanes = [
  {
    id: "after-work", cue: "When evenings are yours", title: "After the day job",
    intro: "A fixed evening is easier to protect than a vague promise to 'find time'. Count the preparation and travel too.",
    entries: [
      ["After Office Coaching Batch Business Ideas", "Teach something you already know. Choose a repeatable class time before promising seats."],
      ["Part Time Shop Accounts Help Business Ideas", "Help one shop close its books in a defined weekly block. Agree the records and deadline."],
      ["Part Time Repair Visit Business Ideas", "Book local visits in one window. Travel and spare parts belong in the quote."],
    ],
  },
  {
    id: "weekend", cue: "When Saturday has room", title: "A bounded weekend",
    intro: "A market or event can take the whole day. Work backward from setup, delivery and the trip home.",
    entries: [
      ["Weekend Market Stall Business Ideas", "Choose one market first. Ask about stall fees before you commit to stock."],
      ["Part Time Event Photography Business Ideas", "Price the shoot and the editing time. A two-hour event is rarely two hours of work."],
      ["Weekend Catering Order Business Ideas", "Limit the menu and the number of orders. Check the food requirements that apply locally."],
    ],
  },
  {
    id: "daytime", cue: "When you have pockets in the day", title: "Around home and school",
    intro: "Short windows can work if the handover is predictable. Watch for tasks that quietly spill into family time.",
    entries: [
      ["Morning Meal Round Business Ideas", "A morning delivery route needs a firm cut-off for orders and a realistic route."],
      ["Evening Hobby Batch Business Ideas", "One small batch with a clear finish time is easier to manage than open-ended lessons."],
      ["Part Time Online Selling Business Ideas", "Set separate slots for listing, packing and customer messages."],
      ["School Gate Help Service Business Ideas", "Match the service to school timings and make responsibility clear to families."],
    ],
  },
] as const;

function pathFor(category: TaxonomyCategory, name: string) {
  return category.subcategories.find((sub) => sub.name === name);
}

export function PartTimeCategory({ category, related }: PartTimeProps) {
  return <GlassShell><div className="gl-page pt-page">
    <nav className="gl-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/browse">Explore ideas</Link><span>/</span><span>Part time</span></nav>
    <header className="pt-hero">
      <div className="pt-hero-main">
        <p className="pt-kicker">BUSINESS IDEAS / THE HOURS YOU REALLY HAVE</p>
        <h1>Part-time business ideas that fit <em>your actual week.</em></h1>
        <p className="pt-lead">A second income should not cost you every evening at home. Start with the hours you can protect, then find a business that fits inside them.</p>
        <a className="pt-primary-link" href="#choose-your-hours">Find your time window <ArrowUpRight size={18} aria-hidden="true" /></a>
      </div>
      <aside className="pt-week" aria-label="Choose when you can work">
        <p>Your week has a shape. Begin there.</p>
        <a href="#after-work"><span>After work</span><small>Defined evening blocks</small><ArrowUpRight size={17} aria-hidden="true" /></a>
        <a href="#weekend"><span>Weekend</span><small>One booked window</small><ArrowUpRight size={17} aria-hidden="true" /></a>
        <a href="#daytime"><span>Daytime pockets</span><small>School and home rhythms</small><ArrowUpRight size={17} aria-hidden="true" /></a>
      </aside>
    </header>
    <div className="pt-lead-in" id="choose-your-hours"><p>Choose the window you can keep. Each route below opens its own focused collection of published business ideas.</p><span>Less guesswork. A better fit.</span></div>

    <div className="pt-lanes" aria-label="Part-time business idea collections">
      {lanes.map((lane, laneIndex) => <section className={"pt-lane pt-lane-" + lane.id} id={lane.id} key={lane.id} aria-labelledby={lane.id + "-heading"}>
        <div className="pt-lane-intro"><p className="pt-kicker">{lane.cue}</p><h2 id={lane.id + "-heading"}>{lane.title}</h2><p>{lane.intro}</p>{laneIndex === 0 && <Link to="/side-business-ideas-india" className="pt-text-link">Compare a side business with your current week <ArrowUpRight size={16} /></Link>}{laneIndex === 1 && <Link to="/weekend-market-stall-profit-check" className="pt-text-link">Check what a market day leaves <ArrowUpRight size={16} /></Link>}{laneIndex === 2 && <Link to="/first-customer-india" className="pt-text-link">Find your first paying customer <ArrowUpRight size={16} /></Link>}</div>
        <div className="pt-route-list">{lane.entries.map(([name, note]) => {
          const sub = pathFor(category, name);
          if (!sub) return null;
          return <Link key={sub.slug} className="pt-route" to="/category/$categorySlug/$subcategorySlug" params={{ categorySlug: category.slug, subcategorySlug: sub.slug }}><span><strong>{name.replace(/ Business Ideas$/i, "")}</strong><small>{note}</small></span><ArrowUpRight size={20} aria-hidden="true" /></Link>;
        })}</div>
      </section>)}
    </div>

    <section className="pt-note" aria-labelledby="pt-test-heading"><div><p className="pt-kicker">BEFORE YOU BUY EQUIPMENT</p><h2 id="pt-test-heading">What would make someone pay you this week?</h2></div><div><p>Ask a specific buyer what they already do when this job needs doing. Then offer a small, defined first job with a clear price. A compliment is pleasant; a booking is evidence.</p><div className="pt-inline-links"><Link to="/business-idea-risk-check">Check the risk of this idea <ArrowUpRight size={16} /></Link><Link to="/business-pricing-india">Work out a first price <ArrowUpRight size={16} /></Link></div></div></section>

    <section className="pt-read" aria-labelledby="pt-read-heading"><figure><img src="/images/blog/realistic-part-time-business-ideas-extra-income-evening-hustles-weekend-jobs-skills.webp" width={1280} height={720} loading="lazy" alt="Part-time business ideas for evening work, weekend selling and teaching, shown in the original feature artwork" /><figcaption>From our founder journal: the work, the hours and the hidden time around both.</figcaption></figure><div><p className="pt-kicker">READ WHEN YOU HAVE A MOMENT</p><h2 id="pt-read-heading">A longer look at the trade-offs.</h2><p>Our part-time guide compares published ideas by the hours they ask of you. Use it after you have picked a time window; skip to the section that fits.</p><Link to="/blog/$slug" params={{slug:"realistic-part-time-business-ideas"}} className="pt-primary-link">Read the part-time business guide <ArrowUpRight size={18} /></Link></div></section>

    <section className="pt-end" aria-labelledby="pt-next-heading"><div><p className="pt-kicker">IF THESE WINDOWS DO NOT FIT</p><h2 id="pt-next-heading">Try a different constraint.</h2><p>A location, an available skill or the first amount you can risk may be a better starting point.</p></div><div className="pt-next-links">{related.map(item => <Link to="/category/$categorySlug" params={{categorySlug:item.slug}} key={item.slug}>{item.short} business ideas <ArrowUpRight size={17}/></Link>)}<Link to="/browse">Browse all business idea categories <ArrowUpRight size={17}/></Link></div></section>
  </div></GlassShell>;
}
