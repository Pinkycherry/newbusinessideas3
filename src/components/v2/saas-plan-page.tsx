import { ArrowRight, ChevronRight } from "lucide-react";
import { V2Frame } from "./frame";
import { SellerFaq } from "./faq";
import { templateImages } from "@/config/template-imagery";
import type { ListPage } from "@/lib/lists.functions";
import "./saas-plan-page.css";

type Example = { list: ListPage; idea: ListPage["ideas"][number] };

const chapters = [
  {
    id: "summary", title: "Executive summary", lead: "Write this after the rest. The first paragraph must make sense to someone who has never used your product.",
    fields: [
      ["Company in one sentence", "Name the first Indian buyer, the task the software changes and the outcome they can recognise. A broad industry label is not a buyer."],
      ["Stage and traction", "Separate idea, working prototype, active use and paid use. Show the period and source behind any MRR, growth or runway figure; leave it unclaimed if you have no records."],
      ["The ask", "If you seek funding, link each proposed use of funds to a measurable product or sales milestone. If you do not, state the next decision you need to make."],
    ],
  },
  {
    id: "product", title: "Product", lead: "A useful product chapter follows one real task from the user's first action to a completed result.",
    fields: [
      ["Core value", "Describe what a user does today and the one step that becomes faster, more reliable or less costly. Ask users to show you that present workflow."],
      ["Wedge and first use", "Explain the smallest workflow that can persuade someone to try the product, and the moment they receive value. A feature list does not show this."],
      ["Roadmap and technology", "Distinguish what runs now from a planned release. Tie any future integration or technical choice to an observed buyer problem, support burden or cost."],
    ],
  },
  {
    id: "market", title: "Market and ideal customer", lead: "Start with the buyer you can actually reach, not the size of India's entire software market.",
    fields: [
      ["Buyer, user and approver", "For a small shop, the person entering stock may be different from the owner paying. In a larger firm, procurement may approve the purchase. Check each role."],
      ["Market boundary", "Describe the reachable account type and where it operates. A bottom-up market estimate needs a defensible account source and a tested annual price; label both assumptions."],
      ["Current alternative", "Include a spreadsheet, WhatsApp thread, paper register or existing software only when the buyer actually uses it. Compare the task and switching cost, not logos alone."],
    ],
  },
  {
    id: "route", title: "Go-to-market", lead: "Show how one qualified Indian buyer discovers, tries, approves and pays for the software.",
    fields: [
      ["Primary route", "Choose the route you can test now: direct conversations, referrals, self-serve search or a channel partner. State the buyer's trigger and the first contact."],
      ["Sales process", "Track enquiry, demonstration or trial, approval, payment and onboarding separately. If a stage has not happened, mark the cycle time unknown."],
      ["Activation", "Define the first useful task and observe where a new user stalls. A signup is not proof that the product delivered value."],
    ],
  },
  {
    id: "metrics", title: "SaaS metrics", lead: "Use actual billing and product records. Benchmarks from another country or company are not your results.",
    fields: [
      ["Recurring revenue", "MRR is the sum of recurring subscription revenue for a month. Keep one-off services and unpaid trials separate; state how refunds and cancellations are treated."],
      ["Acquisition and payback", "CAC requires a defined sales-and-marketing cost period and the new paying customers acquired in that period. An undefined denominator makes the result misleading."],
      ["Retention and churn", "Compare the same customer cohort over time. Record cancellations, downgrades and expansions separately so growth does not hide lost customers."],
      ["Lifetime value", "Only estimate LTV when customer revenue, gross margin and churn use compatible time periods. If the business is new, explain what you will measure first."],
    ],
  },
  {
    id: "pricing", title: "Pricing", lead: "A rupee price is a hypothesis until a buyer makes a real choice.",
    fields: [
      ["What is sold", "Define the unit: a seat, a shop, a transaction, usage or a combination. Explain what a user receives before they must upgrade."],
      ["Approval and collection", "Find out who approves the expense, whether they expect an invoice and when the payment can actually arrive. Do not assume monthly collection because the product is billed monthly."],
      ["Price test", "Present a specific offer to the intended payer and note the decision. A competitor's public price is one reference, not evidence that your customer accepts yours."],
    ],
  },
  {
    id: "team", title: "Team and hiring", lead: "State who builds, sells, supports and checks the product today.",
    fields: [
      ["Current responsibilities", "Name the work the present team can complete and who handles a customer issue. Do not present planned hires as current capacity."],
      ["Next hire", "Tie a role to a bottleneck you have seen, a realistic cost and the evidence that would justify making the commitment."],
      ["Advisors and partners", "Include only people or organisations that have agreed to contribute; describe their actual role."],
    ],
  },
  {
    id: "finance", title: "Financials and funding", lead: "Link the price, paying customers, delivery costs and cash timing in one traceable model.",
    fields: [
      ["Revenue forecast", "Build from the number of customers you can reasonably reach, a tested price and a stated conversion assumption. A projection is not past revenue."],
      ["Cost structure", "Separate hosting, third-party services, support, product development and selling. Use invoices or current quotes when available; mark estimates."],
      ["Runway and funding", "Show cash on hand, expected monthly net cash use and the next payment date. If you ask for funding, say what milestone the money should unlock."],
    ],
  },
] as const;

const metrics = [
  ["MRR", "Recurring subscription revenue billed for a month", "Do not include a one-time setup fee."],
  ["CAC", "Acquisition spend ÷ new paying customers in the same period", "Name the costs and the period."],
  ["Gross margin", "(Revenue − direct delivery cost) ÷ revenue", "Include infrastructure and direct support as appropriate."],
  ["Churn", "Customers or recurring revenue lost ÷ starting cohort", "State whether you mean customer or revenue churn."],
] as const;

const faq = [
  { q: "Can I use this plan before the product has customers?", a: "Yes. Mark untested sections as assumptions and write the next buyer or product test. Never enter a projected customer as a paying customer." },
  { q: "What if my buyer uses the software but someone else pays?", a: "Describe both people. Observe the user's task, then ask the payer what outcome and proof would justify approval." },
  { q: "Do I need every SaaS metric now?", a: "No. If there is no billing or customer history, define the record you will collect. The formula is a guide to later measurement, not a reason to invent a number." },
  { q: "Should my Indian price copy a global SaaS company?", a: "Check what the buyer pays or sacrifices today, test a specific rupee offer and record the response. A foreign list price does not establish local willingness to pay." },
  { q: "Does this replace financial or legal advice?", a: "No. Use actual records for the plan and consult an appropriately qualified professional for a transaction, filing or investment decision." },
];

export function SaasPlanPage({ examples }: { examples: Example[] }) {
  const software = examples.find(({ idea, list }) => /software|app|saas|digital|online/i.test(idea.title + " " + list.name)) ?? examples[0];
  return <V2Frame active="/templates"><main className="sp-page">
    <section className="sp-hero" id="top"><div className="sp-wrap"><nav className="sp-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={15}/><a href="/templates">Templates</a><ChevronRight size={15}/><span>SaaS business plan</span></nav><div className="sp-hero-grid"><div><p className="sp-kicker">Plan & pitch · Indian software businesses</p><h1>Make the software useful. Then make the numbers believable.</h1><p className="sp-lead">An eight-chapter plan through the decisions an Indian software founder must make: buyer, product, adoption, retention and cash.</p><div className="sp-actions"><a href="#chapters" className="sp-button sp-primary">Read the plan <ArrowRight size={18}/></a><a href="/startup-guides/saas-pricing-models" className="sp-button sp-secondary">Explore SaaS pricing <ArrowRight size={18}/></a></div></div><img src={templateImages.canvas.src} alt={templateImages.canvas.alt} width={1600} height={900} loading="eager" fetchPriority="high"/></div></div></section>
    <section className="sp-orient"><div className="sp-wrap sp-orient-grid"><strong>A plan is a chain of evidence.</strong><p>A buyer's current task leads to the product's first useful outcome. That leads to a price and a route to payment. Usage and costs tell you whether the business can continue serving them.</p></div></section>
    <nav className="sp-nav" aria-label="Plan chapters"><div className="sp-wrap">{chapters.map(c=><a key={c.id} href={"#"+c.id}>{c.title}</a>)}</div></nav>
    <section id="chapters" className="sp-chapters"><div className="sp-wrap"><div className="sp-heading"><p className="sp-kicker">Inside the plan</p><h2>Read the eight chapters as one decision.</h2><p>Each part follows the plan's order. The questions turn a blank page into a research task; they are not a claim of customer evidence.</p></div>{chapters.map((chapter,index)=><article id={chapter.id} className="sp-chapter" key={chapter.id}><div className="sp-chapter-side"><span>{String(index+1).padStart(2,"0")}</span><h3>{chapter.title}</h3><p>{chapter.lead}</p></div><div className="sp-fields">{chapter.fields.map(([name,detail])=><div key={name}><h4>{name}</h4><p>{detail}</p></div>)}</div></article>)}</div></section>
    <section className="sp-metric-section"><div className="sp-wrap"><div className="sp-heading"><p className="sp-kicker">Metrics appendix</p><h2>Define the number before you use it.</h2><p>Use these working definitions with your own records. A benchmark from a different company or market is not evidence for your business.</p></div><div className="sp-metric-scroll"><table><thead><tr><th>Measure</th><th>Working definition</th><th>Check before reporting</th></tr></thead><tbody>{metrics.map(([name,definition,caution])=><tr key={name}><th>{name}</th><td>{definition}</td><td>{caution}</td></tr>)}</tbody></table></div><a className="sp-textlink" href="/calculator">Use your own figures in a calculator <ArrowRight size={17}/></a></div></section>
    <section className="sp-example"><div className="sp-wrap"><div className="sp-heading"><p className="sp-kicker">From a published BBI idea</p><h2>Start with a real idea record, then mark the unknowns.</h2></div>{software?<div className="sp-example-grid"><div><p className="sp-example-label">Published idea · research starting point</p><h3>{software.idea.title}</h3><p>{software.idea.summary ?? software.idea.hook}</p><a className="sp-textlink" href={"/idea/"+software.idea.slug}>Read the complete idea <ArrowRight size={17}/></a></div><div><h3>Before calling this a plan</h3><ul><li>Ask the named buyer to show their current task and alternative.</li><li>Test who pays, whether use repeats, and what a completed payment includes.</li><li>Record a real cost quote before estimating margin or runway.</li></ul><a className="sp-textlink" href={"/lists/"+software.list.slug}>Explore the related list <ArrowRight size={17}/></a></div></div>:<p className="sp-no-example">Explore a published business idea, then use its facts as a starting point for your own buyer research.</p>}</div></section>
    <section className="sp-method"><div className="sp-wrap"><div className="sp-heading"><p className="sp-kicker">Research method</p><h2>Move from an attractive slide to an observable choice.</h2></div><ol><li><strong>Watch the task.</strong><span>Ask an intended user to show the last time the problem occurred, including the present workaround.</span></li><li><strong>Separate the decision makers.</strong><span>Check who uses, approves and pays for the software before choosing a pricing unit.</span></li><li><strong>Test the first outcome.</strong><span>Observe whether the user can reach it; track the step where they stop.</span></li><li><strong>Check the paid path.</strong><span>Present a concrete offer and collect a decision before projecting subscriptions.</span></li></ol><p className="sp-source">Method cross-check: <a href="https://www.startupindia.gov.in/content/sih/en/what-do-investors-look-for-.html" target="_blank" rel="noopener noreferrer">Startup India’s investor guidance</a> asks founders to explain customer need, competition, business sustainability and reasonable financial assumptions. It does not validate any particular idea or price.</p></div></section>
    <section className="sp-practice"><div className="sp-wrap"><div><p className="sp-kicker">Use the plan well</p><h2>Show what happened. Label what has not happened.</h2></div><div className="sp-practice-list"><p><strong>Do:</strong> connect the customer journey to the billing record; use the same period for metric inputs; keep a source and date beside a claim.</p><p><strong>Avoid:</strong> presenting signups as retention, borrowed benchmarks as Indian results, or a proposed release as a working product.</p></div></div></section>
    <SellerFaq faq={faq} title="SaaS plan questions" />
    <section className="sp-related"><div className="sp-wrap"><p className="sp-kicker">Related resources</p><h2>Follow the next unanswered question.</h2><div><a href="/templates/customer-interview">Who is the buyer? <ArrowRight size={18}/></a><a href="/startup-guides/b2b-saas-churn-reduction">Why would they stay? <ArrowRight size={18}/></a><a href="/startup-guides/saas-pricing-models">What would they pay? <ArrowRight size={18}/></a><a href="/calculator">What do the costs mean? <ArrowRight size={18}/></a></div></div></section>
    <section className="sp-end"><div className="sp-wrap"><p className="sp-kicker">Next step</p><h2>Find the weakest claim in the plan.</h2><p>Take that claim into a customer conversation, a product test or a calculator before you present it as fact.</p><a href="/templates/customer-interview" className="sp-button sp-primary">Prepare the interview <ArrowRight size={18}/></a></div></section>
  </main></V2Frame>;
}
