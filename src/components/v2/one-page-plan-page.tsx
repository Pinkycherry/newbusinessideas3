import { useState } from "react";
import { ArrowRight, ChevronRight, Check, X } from "lucide-react";
import { V2Frame } from "@/components/v2/frame";
import { SellerFaq } from "@/components/v2/faq";
import { templateImages } from "@/config/template-imagery";
import type { ListPage, ListIdea } from "@/lib/lists.functions";
import "@/components/v2/one-page-plan-page.css";

type Example = { list: ListPage; idea: ListIdea };
const ideaLink = (slug: string) => `/idea/${encodeURIComponent(slug)}`;
const listLink = (slug: string) => `/lists/${encodeURIComponent(slug)}`;
const firstSentence = (value: string | null | undefined, max = 280) => {
  const text = (value ?? "").trim().replace(/\s+/g, " ");
  const clauses = text.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g) ?? [];
  const first = clauses[0]?.trim() ?? text;
  const second = clauses[1]?.trim();
  const candidate = first.length < 95 && second && `${first} ${second}`.length <= max
    ? `${first} ${second}` : first;
  return candidate.length <= max ? candidate : `${candidate.slice(0,max).replace(/\s+\S*$/, "").trimEnd()}…`;
};
const parts = [
  { title: "Company and vision", purpose: "Say what you do in words a buyer understands.", question: "Can a first customer name the service and its result after hearing this sentence?", field: "summary" },
  { title: "The problem", purpose: "Describe a recent difficulty and the workaround people use today.", question: "What happened on the buyer's last difficult day, and what did they do instead?", field: null },
  { title: "Your solution", purpose: "Name the smallest offer and the outcome it changes.", question: "Which part can a customer actually buy or try first?", field: "summary" },
  { title: "Target customer", purpose: "Separate who uses, chooses and pays; specify where to meet them.", question: "Who made the final decision in the last comparable purchase?", field: "who_pays_you" },
  { title: "Unique value proposition", purpose: "Give a reason to switch from the current local option.", question: "What would make the buyer choose this instead of doing what they do now?", field: "hook" },
  { title: "Revenue model and pricing", purpose: "Show the payer, what they buy and when money arrives.", question: "What would a completed first payment look like, and which price is still untested?", field: "how_money_comes" },
  { title: "Go-to-market channels", purpose: "Choose a reachable path to a first buyer, including the trust step.", question: "Where did a recent buyer find and trust their current provider?", field: null },
  { title: "Key metrics", purpose: "Observe the action that would change your decision.", question: "Does a paid order, repeat choice or completed enquiry best show progress here?", field: null },
  { title: "Cost structure", purpose: "Separate what you need to start from each order's recurring inputs.", question: "Which costs occur before the first sale, and which grow with each customer?", field: null },
  { title: "Team and unfair advantage", purpose: "Name the work you can deliver now and the access you actually hold.", question: "Who will do the work reliably, and what could a competitor copy tomorrow?", field: null },
] as const;
const guidance = [
  { title: "Tell one buyer story", body: "For a home lunch route, identify the person who orders, the person who eats and whether an office administrator has a say. A plan for ‘everyone at work’ hides who makes the purchase." },
  { title: "Show the current option", body: "Ask where the buyer went last time: canteen, home, delivery app or nearby stall. Your offer must earn a switch from a real habit, not win an imaginary comparison." },
  { title: "Distinguish a proposal from a sale", body: "An idea record can suggest a payment rhythm. The plan becomes stronger when you record an actual order, refusal or repeat choice and explain what changed." },
  { title: "Use actual local costs", body: "Get supplier and delivery quotes where you will operate. Put a tested price and cost into a calculator; leave an untested number marked as an estimate." },
];
const faq = [
  { q: "Is one page enough for a loan?", a: "Usually a lender will ask for more than a short outline, such as cash flow, identity, operations and supporting documents. Use this page to explain the idea clearly, then prepare the additional evidence the particular lender requests. Do not present it as a loan application." },
  { q: "What if I do not know the price?", a: "State how the business would earn money, then mark the price as untested. Ask real buyers about their last purchase and test a small offer. Use real supplier quotes before treating any margin as reliable." },
  { q: "Can I use an idea from the library as my plan?", a: "An idea page gives a starting hypothesis. It cannot confirm the buyers, costs, team or demand in your location. Choose one idea and replace open questions with your own interviews, quotes and transactions." },
  { q: "How short should each part be?", a: "Short enough for a partner to follow without guessing. The aim is a connected argument, not a word limit. Add a supporting document when figures or operations need more detail." },
  { q: "Which part should I write first?", a: "Start with the first buyer, the problem and what they currently use. Then describe the offer and route to a first sale. Revise the opening description after those decisions are clearer." },
  { q: "When do I update the plan?", a: "After a conversation, real cost quote, order or refusal changes a material assumption. A plan that records what changed is more useful than one that stays neat but untested." },
];
const sectionText = (idea: ListIdea, field: (typeof parts)[number]["field"]) => field ? firstSentence(idea[field]) : "";
const questionFor = (index: number, idea: ListIdea) => {
  const title = idea.title.toLowerCase();
  const questions = /review website|affiliate|content site/.test(title) ? [
    "Can a reader explain which buying decision this comparison helps them make?",
    "What confused the last buyer comparing phones, and which source did they trust?",
    "Which comparison helps the reader decide before visiting a shop or marketplace?",
    "Who reads the review, who buys the phone, and who pays any qualifying commission?",
    "Why would the reader trust this review over a marketplace listing or shopkeeper?",
    "Which completed referral or sale earns a commission, and how is it tracked?",
    "Which search question brings a buyer here before they choose a phone?",
    "Which readers make a qualifying purchase after the comparison, beyond simply viewing the page?",
    "What will research, testing, hosting and publishing actually cost before the first commission?",
    "Who can test the products and keep the comparisons accurate and independent?",
  ] : /sev|namkeen|snack|pack/.test(title) ? [
    "Can a neighbour explain what pack they can order and when they receive it?",
    "When did a household last buy this kind of snack, and why there?",
    "Which small paid batch can test taste, freshness and collection?",
    "Who chooses the household snack and who pays for the repeat pack?",
    "Why would they switch from loose snacks or a familiar packaged brand?",
    "Who pays for a pack, and what does a genuine reorder look like?",
    "Would a neighbourhood introduction or a shop counter produce the first paid orders?",
    "Which paid reorders happen without a reminder or a free sample?",
    "What do ingredients, packaging, delivery and unsold stock cost in the actual neighbourhood?",
    "Who can make, pack and deliver consistently without losing freshness?",
  ] : /lunch|dabba|tiffin|meal/.test(title) ? [
    "Can a worker describe the lunch, delivery area and payment rhythm plainly?",
    "Where did they buy lunch on their last office day, and what disappointed them?",
    "Can you test a small paid lunch route before promising a monthly service?",
    "Does the worker, family member or office manager choose and pay?",
    "What would make them leave the canteen, delivery app or nearby stall?",
    "Who pays for the order, and what happens on days they work from home?",
    "Which office-area introduction can lead to a real first order?",
    "Do customers reorder after ordinary days, delays and missed office days?",
    "What will groceries, packaging and delivery cost per lunch, and what is fixed?",
    "Who can cook and deliver reliably at the promised time?",
  ] : null;
  return questions?.[index] ?? parts[index]?.question ?? "What evidence would change this part of the plan?";
};
export function OnePagePlanPage({ examples }: { examples: Example[] }) {
  const [selected, setSelected] = useState(0);
  const example = examples[selected];
  return <V2Frame active="/templates"><main className="op-page">
    <nav className="op-wrap op-crumb" aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={14}/><a href="/templates">Templates</a><ChevronRight size={14}/><span>One-page business plan</span></nav>
    <section className="op-wrap op-hero"><div><p className="op-kicker">Business planning · Short plan</p><h1>Make your business understandable in one sitting.</h1><p className="op-lead">A good short plan connects one buyer, a real problem, a focused offer and a path to payment. This guide follows the plan's original ten parts and shows where an Indian idea still needs evidence.</p><div className="op-actions"><a href="#plan" className="op-primary">See the plan <ArrowRight size={18}/></a><a href="#example" className="op-secondary">View an idea in context <ArrowRight size={18}/></a></div></div><img src={templateImages.planning.src} alt={templateImages.planning.alt} width={1600} height={900} fetchPriority="high"/></section>
    <section className="op-strip"><div className="op-wrap"><strong>One clear thread</strong><p>Who needs it? What do they do now? What will you offer? How will they find and pay you? What does it cost to deliver? If an answer is unknown, say so and test it.</p></div></section>
    <section className="op-section op-wrap op-intro"><div><p className="op-kicker">Why make a short plan?</p><h2>A partner should be able to explain it back.</h2></div><div><p>The aim is not to compress a long pitch into tiny type. Each part answers a decision question. When a customer, a supplier or a real order contradicts the plan, edit the claim rather than defending the document.</p><p>The original plan separates the opening, buyer, offer, channel, money and team. Those sections belong together: a different payer can change both your sales channel and pricing. This page gives you a readable way through them.</p></div></section>
    <section id="plan" className="op-section op-paper-section"><div className="op-wrap"><div className="op-heading"><p className="op-kicker">Plan anatomy</p><h2>Read every part as a claim to check.</h2><p>The same sequence works for a local service, a product or an online business. Each section says what belongs in the plan and the question that could change it.</p></div><div className="op-paper"><div className="op-paper-title"><span>BUSINESS PLAN / READING COPY</span><strong>From first buyer to the work of delivering</strong></div><ol>{parts.map((part,i)=><li key={part.title}><span>{String(i+1).padStart(2,"0")}</span><div><h3>{part.title}</h3><p>{part.purpose}</p><small>{part.question}</small></div></li>)}</ol><div className="op-paper-foot">Keep the story connected. Check the unknowns outside this page with real people and local quotes.</div></div></div></section>
    <section id="example" className="op-section op-wrap"><div className="op-heading"><p className="op-kicker">Published Indian ideas</p><h2>See what an idea record can and cannot tell you.</h2><p>Select a published idea. Its own wording fills only the parts it supports; the remaining questions need your local research. No buyer interview or sale is implied.</p></div>{example && <div className="op-example"><div className="op-tabs" role="tablist" aria-label="Published business ideas">{examples.map(({idea},i)=><button key={idea.slug} type="button" role="tab" id={`op-tab-${i}`} aria-selected={selected===i} aria-controls="op-panel" onClick={()=>setSelected(i)}>{idea.title}</button>)}</div><div className="op-example-body" role="tabpanel" id="op-panel" aria-labelledby={`op-tab-${selected}`}><div className="op-example-head"><div><span>{example.list.categoryName}</span><h3>{example.idea.title}</h3></div><a href={ideaLink(example.idea.slug)}>Read the full idea <ArrowRight size={17}/></a></div><p className="op-example-intro">{firstSentence(example.idea.summary||example.idea.hook,340)}</p><ol className="op-example-list">{parts.map((part,i)=>{
          const source=sectionText(example.idea,part.field);
          return <li key={part.title}>
            <span>{String(i+1).padStart(2,"0")}</span>
            <h4>{part.title}</h4>
            <div className="op-example-detail">
              {source && <p><b>From the published idea:</b> {source}</p>}
              <p className="op-open"><b>{source?"Check with buyers:":"Research question:"}</b> {questionFor(i,example.idea)}</p>
            </div>
          </li>;
        })}</ol><div className="op-example-foot"><p>This is a research starting point, not a completed business plan or verified financial projection.</p><a href={listLink(example.list.slug)}>Explore the related list <ArrowRight size={17}/></a></div></div></div>}</section>
    <section className="op-section op-soft"><div className="op-wrap"><div className="op-heading"><p className="op-kicker">Make it useful</p><h2>Improve the plan with evidence, one decision at a time.</h2></div><div className="op-guidance">{guidance.map((item,i)=><article key={item.title}><span>{String(i+1).padStart(2,"0")}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></div></section>
    <section className="op-section op-wrap"><div className="op-heading"><p className="op-kicker">From plan to fieldwork</p><h2>Choose what to test first.</h2></div><div className="op-next"><div><h3>Do not know the buyer?</h3><p>Ask about a purchase that already happened. Listen for who chose, who paid and which option they trusted.</p><a href="/templates/customer-interview">Customer interview guide <ArrowRight size={17}/></a></div><div><h3>Do not know the money?</h3><p>Get a real cost quote and test a price where the buyer makes a choice. Calculate with those inputs, keeping estimates labelled.</p><a href="/calculator">Business calculators <ArrowRight size={17}/></a></div></div></section>
    <section className="op-section op-soft"><div className="op-wrap"><div className="op-heading"><p className="op-kicker">Practical checks</p><h2>Keep the claim as strong as the evidence.</h2></div><div className="op-practice"><div><h3><Check size={21} aria-hidden="true"/> Do</h3><ul><li>Name the first buyer and present alternative.</li><li>Show how one order reaches payment and delivery.</li><li>Separate a real quote from a proposed price.</li><li>Change the plan when a transaction changes the story.</li></ul></div><div><h3><X size={21} aria-hidden="true"/> Avoid</h3><ul><li>Calling an invented figure a forecast.</li><li>Listing every possible buyer as your first segment.</li><li>Using a confident headline where a test is needed.</li><li>Promising a team or partnership you do not yet have.</li></ul></div></div></div></section>
    <div className="op-faq"><SellerFaq faq={faq} title="One-page plan questions" id="faq"/></div>
    <section className="op-section op-wrap"><div className="op-heading"><p className="op-kicker">Related templates</p><h2>Follow the question that matters now.</h2></div><div className="op-related"><a href="/templates/lean-canvas"><h3>Lean canvas</h3><p>See the assumptions together before writing the plan.</p><ArrowRight size={18}/></a><a href="/templates/customer-persona"><h3>Customer persona</h3><p>Understand who makes the buying decision.</p><ArrowRight size={18}/></a><a href="/templates/customer-interview"><h3>Customer interview</h3><p>Hear the last real purchase before changing the offer.</p><ArrowRight size={18}/></a></div></section>
    <section className="op-cta"><div className="op-wrap"><div><p className="op-kicker">Next step</p><h2>Start with a specific business, then test its weakest line.</h2><p>Browse the library, choose an idea you can reach and let a real buyer or cost quote improve the plan.</p></div><a className="op-primary" href="/lists">Browse business idea lists <ArrowRight size={17}/></a></div></section>
    <section className="op-section op-wrap"><div className="op-heading"><p className="op-kicker">Related resources</p><h2>Keep the next decision close.</h2></div><div className="op-resources"><div><h3>Explore</h3><a href="/lists">Idea lists <ArrowRight size={16}/></a><a href="/browse">Browse categories <ArrowRight size={16}/></a></div><div><h3>Learn</h3><a href="/startup-guides">Startup guides <ArrowRight size={16}/></a><a href="/templates/customer-interview">Buyer questions <ArrowRight size={16}/></a></div><div><h3>Calculate</h3><a href="/calculator">Calculators <ArrowRight size={16}/></a><a href="/tools">Tools and resources <ArrowRight size={16}/></a></div></div></section>
  </main></V2Frame>;
}
