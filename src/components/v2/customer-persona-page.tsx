import { useState } from "react";
import { ArrowRight, ChevronRight, Check, X } from "lucide-react";
import { V2Frame } from "@/components/v2/frame";
import { SellerFaq } from "@/components/v2/faq";
import { templateImages } from "@/config/template-imagery";
import type { ListPage } from "@/lib/lists.functions";
import "@/components/v2/customer-persona-page.css";

const ideaUrl = (slug: string) => `/idea/${encodeURIComponent(slug)}`;
const listUrl = (slug: string) => `/lists/${encodeURIComponent(slug)}`;
type Example = { list: ListPage; idea: ListPage["ideas"][number] };
const images = [templateImages.interview, templateImages.canvas, templateImages.planning];
const brief = (value: string | null | undefined, max = 210) => {
  const text = (value ?? "").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "").trimEnd()}…`;
};
const sourceSentence = (value: string | null | undefined) => {
  const text = (value ?? "").trim().replace(/\s+/g, " ");
  const first = text.match(/^.*?[.!?](?=\s|$)/)?.[0];
  return first && first.length <= 280 ? first : brief(text, 240);
};

/** Editorial research lenses, selected from the published business model rather than a slug. */
function buyerLens(idea: Example["idea"]) {
  const model = `${idea.title} ${idea.summary ?? ""} ${idea.how_money_comes ?? ""}`.toLowerCase();
  if (/affiliate|review website|referral commission|publisher/.test(model)) return {
    distinction: "The reader chooses a product. The shop or platform may pay the commission. Those are two separate decisions.",
    occasion: "Tell me about the last phone or product you compared online. Which sources did you open, and what did you buy?",
    alternatives: "Which review, shopkeeper, friend or marketplace listing did you trust most? What made that source credible?",
    payment: "Did the review help you buy something, or did you leave to ask a shopkeeper? A page visit alone earns nothing.",
    counterevidence: "If readers use the comparison but never change their buying decision, test whether the content solves a real decision problem.",
    decisions: [
      ["Readers repeatedly describe confusion about the same comparison", "Build one comparison around that decision and test whether they use it before buying."],
      ["Readers trust a shopkeeper or marketplace review more than your page", "Investigate the missing trust proof before producing more articles."],
      ["A reader clicks but no qualifying sale follows", "Treat traffic and affiliate revenue as different tests; do not call the visit a paying customer."],
    ],
  };
  if (/sev|namkeen|snack|packaged food/.test(model)) return {
    distinction: "A neighbour may praise a free sample. The useful question is whether the household pays for another pack.",
    occasion: "Think of the last time you bought a snack for home or guests. Where did you buy it and why there?",
    alternatives: "Did you choose loose namkeen, a packaged brand or something homemade? What would make you switch?",
    payment: "Who picked the snack for the household? Who paid for it? Did they buy another pack without you asking?",
    counterevidence: "Compliments from relatives are encouraging, but a paid reorder is a clearer sign than a courtesy purchase.",
    decisions: [
      ["A household buys a sample and orders again without prompting", "Investigate the flavour, pack size and purchase occasion behind that repeat choice."],
      ["People compliment a free sample but do not buy", "Do not write a loyal-customer persona; test a small paid offer first."],
      ["The household buys loose sev elsewhere for a different reason", "Compare freshness, trust and convenience before changing the recipe or price."],
    ],
  };
  if (/dabba|tiffin|lunch|meal subscription/.test(model)) return {
    distinction: "The worker eats lunch, but an office manager or a family member might place and pay for the order.",
    occasion: "Walk me through the last working day you needed lunch. What did you eat, who arranged it and when did you decide?",
    alternatives: "What made you choose the canteen, delivery app, home food or a nearby stall that day?",
    payment: "Who pays for lunch? If they pay monthly, what happens when delivery is late or they work from home?",
    counterevidence: "A first order shows curiosity; a renewal after ordinary working days says more about fit and reliability.",
    decisions: [
      ["Workers already prepay another lunch provider", "Find out what would make them switch and what delivery reliability they expect before promising a monthly plan."],
      ["Workers only need lunch on occasional office days", "Test a paid single-day order before treating them as monthly subscribers."],
      ["An office administrator chooses and pays for staff meals", "Interview that administrator separately; the eater's preferences alone will not explain the contract."],
    ],
  };
  return {
    distinction: "The person who uses a service may not be the person who chooses or pays for it.",
    occasion: "Tell me about the last time you needed this kind of solution. What happened just before you looked?",
    alternatives: "What did you use instead, including doing it yourself or postponing the purchase?",
    payment: "Who chose and paid for the last purchase? What made that provider seem trustworthy?",
    counterevidence: "Interest alone is not a buying decision. Compare what people say with their last purchase or workaround.",
    decisions: [
      ["A person recently paid for the current alternative", "Find the switching trigger and the proof they would need from a new provider."],
      ["A person only says they might buy someday", "Keep demand unverified and seek someone with a recent buying occasion."],
      ["A different person approves the purchase", "Research that decision maker before changing price or messaging."],
    ],
  };
}

const interviewQuestions = [
  "Tell me about the last time this problem happened. Where were you and what set it off?",
  "What did you try first? What else did you consider, including doing nothing?",
  "Who suggested the option you chose? Who made the decision and who paid?",
  "What were you worried might go wrong? What proof or recommendation helped?",
  "On that occasion, what did it cost you in money, travel, waiting or effort?",
  "What happened after you used it? Did you repeat, switch or stop? Why?",
];

const steps = [
  { title: "Choose one kind of customer", body: "For a tuition idea, start with the parent who pays the fee. For a dabba idea, start with the person who places the order. You can study other buyers after you understand the first one." },
  { title: "Ask about their last purchase", body: "Where did they go, what did they compare, and who else had a say? Ask about what happened last week, not what they might buy someday." },
  { title: "Change your plan from what you hear", body: "If workers buy lunch only on office days, test single-day orders before offering a monthly plan. Let the answer change your offer instead of forcing it into your first guess." },
];
const research = [
  { title: "Talk to people who bought recently", body: "Selling lunch near offices? Speak to workers in that area who bought lunch elsewhere this week. Also speak to someone who stopped ordering. A friend who never buys office lunch cannot explain that purchase." },
  { title: "Start with the last time", body: "Ask: ‘When did you last need this?’ and ‘What did you do?’ If they can only imagine a future purchase, move on to someone who has made the choice already." },
  { title: "Hear their story before showing your idea", body: "Let them describe the problem, the options they saw, who chose, who paid and what happened next. If you show your offer first, they may be polite instead of telling you how they really buy." },
  { title: "Separate the answer from your guess", body: "After each talk, note what the person did, what they said, and what you inferred on separate lines. The example below shows why that difference matters." },
  { title: "Decide what to try next", body: "Write down who buys, when, from whom and why. Then test one change: a different delivery time, a single-day order, a smaller snack pack or a clearer comparison. Do not build a full service from compliments alone." },
];
const tips = [
  { title: "Ask about a real day", body: "For tuition, ask what happened when the child struggled with homework last week. Who looked for help? Who approved the fee? Those answers are more useful than an age bracket." },
  { title: "Use the buyer's own words", body: "If someone asks in Hindi or Telugu for ‘home food without too much oil’, keep that wording. It may tell you how to explain the offer on WhatsApp." },
  { title: "Know whom you cannot serve", body: "If you deliver lunch only near one office area, a buyer across town who needs it immediately is not a match. Say so before promising a delivery you cannot make." },
  { title: "Look for the next paid choice", body: "A compliment is pleasant. A paid first order shows more. A repeat order after a late day or an ordinary week tells you more about whether the offer fits." },
];
const faq = [
  { q: "What is a customer persona?", a: "It is a short account of how one kind of buyer chooses. Write when they need the offer, what they use today, who pays, what they worry about and what made them buy last time. Check those details with real people before treating them as facts." },
  { q: "Who is the customer when someone else pays?", a: "Speak to both people. A student may attend tuition, but a parent may find the teacher and pay the fee. The student can tell you what helps them learn; the parent can tell you why they chose and paid for that class." },
  { q: "What if many different people could buy?", a: "Start with one group you can reach and serve well. A lunch delivery near offices can begin with workers in that area. If an office manager orders for the whole team, study that as a separate buying path instead of mixing their answers together." },
  { q: "How many personas should I make?", a: "Begin with one buyer you can reach. Add another only when the buying process really changes. A parent choosing evening tuition and a school purchasing a whole batch use the same service but make different decisions." },
  { q: "Do I need a fixed number of interviews?", a: "No number guarantees that your guess is right. Speak to recent buyers and people who chose another option. When you can explain the same buying pattern without forcing the answers, test a small paid offer and see what happens." },
  { q: "Can AI write my persona?", a: "It can arrange notes from conversations you actually had. It cannot interview your neighbourhood, verify a buyer's last purchase or prove that anyone will pay. Do not present generated names, quotes or salaries as research." },
  { q: "When should I update it?", a: "Change it when a real purchase contradicts your guess. If workers order lunch only on office days, remove the assumption that they want a daily monthly plan. Check it again if your price, delivery area or buyer changes." },
  { q: "What if I have no customers yet?", a: "Start with an idea page as a possible market, then speak to people who recently paid for another solution. For a snack brand, ask where they last bought a snack for home and why. You do not need your own sales before you can learn how people buy." },
  { q: "Can I use WhatsApp or a survey?", a: "Use WhatsApp to find someone who recently faced the problem and ask for a short call. A survey can help after you know which choices matter. A ‘Would you buy this?’ poll does not tell you who paid last time or why they chose a rival." },
  { q: "What should the finished profile contain?", a: "Keep it to what changes a business decision: the buying occasion, the option used now, who chose and paid, the reason to switch, the trust concern and the action you observed. Mark unanswered points as questions. Skip made-up biographies." },
];

export function CustomerPersonaPage({ examples }: { examples: Example[] }) {
  const [tab, setTab] = useState(0);
  const chosen = examples[tab] ?? examples[0];
  const chosenLens = chosen ? buyerLens(chosen.idea) : null;
  return <V2Frame active="/templates"><main className="tm-page cp-page">
    <div className="cp-wrap"><nav className="cp-crumb" aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={14}/><a href="/templates">Templates</a><ChevronRight size={14}/><span>Customer persona</span></nav></div>
    {/* 1 · Seller hero: narrative, image, two destinations. */}
    <section className="cp-hero cp-wrap"><div><p className="cp-kicker">Customer persona · Buyer research</p><h1>Find out who will actually buy.</h1><p className="cp-lead">You may have a business idea. But who chooses it, who pays, and why would they leave the option they use now? This guide gives you a way to find out before you spend on stock, ads or a shop.</p><div className="cp-actions"><a className="cp-primary" href="#template">See an Indian example <ArrowRight size={18}/></a><a className="cp-secondary" href="#research">Questions to ask buyers <ArrowRight size={18}/></a></div></div><figure><img src={templateImages.interview.src} alt="Indian founder discussing a customer's buying decision, BusinessIdea.io customer persona guide" width={1600} height={900} fetchPriority="high"/><figcaption>Ask about the last purchase, not a future promise.</figcaption></figure></section>
    {/* 2 · Seller's short definition strip. */}
    <section className="cp-strip"><div className="cp-wrap"><strong>One question first</strong><p><b>Who used it?</b> <b>Who chose it?</b> <b>Who paid?</b> For tuition, the student may use the service while a parent decides and pays. Your message has to reach the decision maker.</p></div></section>
    {/* 3 · Published BBI situations in place of unverified seller statistics. */}
    <section className="cp-section cp-evidence"><div className="cp-wrap"><div className="cp-intro"><p className="cp-kicker">Three different buying paths</p><h2>The buyer changes with the business.</h2><p>These published ideas give you a place to start. The people and decisions still need to be checked in your own market.</p></div><div className="cp-evidence-grid">{examples.map(({list,idea})=>{const lens=buyerLens(idea);return <a href={ideaUrl(idea.slug)} key={idea.slug} className="cp-evidence-item"><span>{list.categoryName}</span><h3>{idea.title}</h3><p>{sourceSentence(idea.summary || idea.hook)}</p><p><b>What to check:</b> {lens.distinction}</p><strong>Read the idea <ArrowRight size={16}/></strong></a>})}</div></div></section>
    {/* 4 · Three steps in the purchased composition. */}
    <section id="how-it-works" className="cp-section cp-steps"><div className="cp-wrap"><div className="cp-intro"><p className="cp-kicker">How to use this guide</p><h2>Start small. Speak to buyers. Change your plan.</h2></div><div className="cp-step-grid">{steps.map((s,i)=><article key={s.title}><span className="cp-step-number">0{i+1}</span><h3>{s.title}</h3><p>{s.body}</p></article>)}</div></div></section>
    {/* 5 · Editorial overview, seller order. */}
    <section id="overview" className="cp-section cp-overview"><div className="cp-wrap cp-split"><div><p className="cp-kicker">What is a persona?</p><h2>A clear account of one buying decision.</h2></div><div className="cp-prose"><p>Imagine you want to deliver office lunches. “Young professionals” is too broad to plan around. Ask where a worker bought lunch on their last office day, when they chose, what they paid and what made the current option good enough.</p><p>Now you can make a useful choice. If they decide each morning, test a single-day order. If an office manager arranges lunches for everyone, you need to speak to that manager too. You do not need to invent a person's name or salary.</p><p>Use a <a href="/lists">published business idea list</a> to choose a market, then the <a href="/templates/customer-interview">interview guide</a> to hear how a real purchase happened.</p></div></div></section>
    {/* 6 · The purchased builder slot becomes a compact, evidence-led case selector. */}
    <section id="template" className="cp-section cp-workbench">
      <div className="cp-wrap">
        <div className="cp-intro"><p className="cp-kicker">See how it works</p><h2>Choose an idea. Find the missing answer.</h2><p>The published idea describes a possible business. These questions help you check how people actually buy it.</p></div>
        {chosen && chosenLens && <div className="cp-builder cp-builder-layout">
          <div className="cp-case-nav" role="tablist" aria-label="Published business examples">
            <p>Choose an idea</p>
            {examples.map((example,i)=><button key={example.idea.slug} id={`cp-case-${i}`} role="tab" type="button" aria-controls="cp-case-panel" aria-selected={tab===i} onClick={()=>setTab(i)}><strong>{example.idea.title}</strong></button>)}
          </div>
          <div id="cp-case-panel" className="cp-builder-body" role="tabpanel" aria-labelledby={`cp-case-${tab}`}>
            <div className="cp-builder-title"><span>From our published idea library</span><h3>{chosen.idea.title}</h3><a href={ideaUrl(chosen.idea.slug)}>Read the full idea <ArrowRight size={17}/></a></div>
            <p className="cp-builder-brief">{sourceSentence(chosen.idea.summary || chosen.idea.hook)}</p>
            <div className="cp-insight-list">
              {[
                {label:"Who buys",source:chosen.idea.who_pays_you || chosen.idea.summary,question:chosenLens.payment},
                {label:"When they need it",source:chosen.idea.summary || chosen.idea.hook,question:chosenLens.occasion},
                {label:"What can go wrong",source:chosen.idea.what_hurts || chosen.idea.what_you_need,question:"What happened the last time your current option let you down? What did you do instead?"},
              ].map((row,i)=><div className="cp-insight-row" key={row.label}>
                <span className="cp-insight-index">0{i+1}</span>
                <div className="cp-insight-source"><small>{row.label} · what the idea says</small><p>{sourceSentence(row.source || chosen.idea.title)}</p></div>
                <div className="cp-insight-question"><small>What to ask a buyer</small><p>{row.question}</p></div>
              </div>)}
            </div>
            <div className="cp-evidence-rule"><b>What would change your mind?</b><p>{chosenLens.counterevidence}</p></div>
            <div className="cp-builder-links"><a href={listUrl(chosen.list.slug)}>More ideas in this list <ArrowRight size={16}/></a><a href={chosen.list.categorySlug ? `/category/${encodeURIComponent(chosen.list.categorySlug)}` : "/lists"}>Browse {chosen.list.categoryName} <ArrowRight size={16}/></a></div>
          </div>
        </div>}
      </div>
    </section>
    {/* 7 · The source's three image examples become three worked decision lenses. */}
    <section id="examples" className="cp-section cp-examples"><div className="cp-wrap"><div className="cp-intro"><p className="cp-kicker">Compare different businesses</p><h2>One method. Different buyers.</h2><p>These examples use our published idea records. The buyer questions are guidance for your own research; no interview or purchase has been verified here.</p></div><div className="cp-example-grid">{examples.map(({list,idea},i)=>{const lens=buyerLens(idea);return <article key={idea.slug}><a href={ideaUrl(idea.slug)} className="cp-example-image"><img src={images[i]?.src || templateImages.interview.src} alt={`${idea.title} buyer research in India, BusinessIdea.io`} width={1600} height={900} loading="lazy"/></a><div className="cp-example-copy"><span>{list.categoryName}</span><h3><a href={ideaUrl(idea.slug)}>{idea.title}</a></h3><p className="cp-example-difference">{lens.distinction}</p><dl><dt>Ask about the last choice</dt><dd>{lens.occasion}</dd><dt>Check the other option</dt><dd>{lens.alternatives}</dd><dt>Before you spend money</dt><dd>{lens.counterevidence}</dd></dl><a href={ideaUrl(idea.slug)}>Read the full idea <ArrowRight size={16}/></a></div></article>})}</div></div></section>
    {/* 8 · Full-width five-step field workflow with neutral interview questions. */}
    <section id="research" className="cp-section cp-research">
      <div className="cp-wrap">
        <div className="cp-research-head"><div><p className="cp-kicker">Take this into the real world</p><h2>Ask about a purchase that already happened.</h2></div><div><p>You can do this at a tea stall, on a call or after a WhatsApp introduction. Ask about their last choice before you explain your idea.</p><a className="cp-inline" href="/templates/customer-interview">Read the interview guide <ArrowRight size={17}/></a></div></div>
        <ol className="cp-research-steps">{research.map((step,i)=><li key={step.title}>
          <span>0{i+1}</span><div className="cp-research-copy"><h3>{step.title}</h3><p>{step.body}</p>{i===4 && <a href="/templates/lean-canvas">Carry the revised buyer into a lean canvas <ArrowRight size={16}/></a>}</div>
          {i===2 && <div className="cp-script"><h4>Six questions for a short conversation</h4><ol>{interviewQuestions.map(q=><li key={q}>{q}</li>)}</ol><p>If an answer is vague, ask “What happened next?” Do not pitch your business until they finish the story.</p></div>}
          {i===3 && <div className="cp-script cp-evidence-note"><h4>Three things to keep separate</h4><p><b>What they did:</b> “I paid the canteen on Tuesday.” <b>What they said:</b> “I wanted food with less oil.” <b>What you guessed:</b> “They will subscribe to my dabba.” Only the first two came from the buyer.</p></div>}
        </li>)}</ol>
        <aside className="cp-method-note"><strong>Why these questions?</strong><p>We use our published idea records to choose Indian business examples. For the interview method, <a href="https://www.strategyzer.com/library/a-quick-guide-for-asking-good-customer-questions" target="_blank" rel="noopener noreferrer">Strategyzer's customer-question guide</a> recommends facts over opinions, listening before pitching, and a small real-world test after interviews. <a href="https://www.startupindia.gov.in/content/sih/en/bloglist/blogs/Know-Your-Customer.html" target="_blank" rel="noopener noreferrer">Startup India</a> explains why the event behind a purchase and the reason someone chose another provider matter. These sources support the method; they do not verify our example buyers.</p></aside>
      </div>
      {chosen && chosenLens && <aside className="cp-wrap cp-decision-example"><p className="cp-kicker">Apply it to {chosen.idea.title}</p><h3>What would you do with the answer?</h3><p><b>The idea says:</b> {sourceSentence(chosen.idea.who_pays_you || chosen.idea.summary)}</p><p><b>Ask a buyer:</b> {chosenLens.occasion}</p><ul className="cp-decision-branches">{chosenLens.decisions.map(([signal,action])=><li key={signal}><span>If you find this</span><strong>{signal}</strong><span>Your next test</span><p>{action}</p></li>)}</ul><p className="cp-evidence-disclaimer">These are possible paths, not claims that the interviews have happened.</p><a href={ideaUrl(chosen.idea.slug)}>Read the underlying idea <ArrowRight size={16}/></a></aside>}
    </section>
    {/* 9 · Do / avoid in source order. */}
    <section className="cp-section cp-practice"><div className="cp-wrap"><div className="cp-intro"><p className="cp-kicker">Keep it honest</p><h2>Useful answers beat a polished imaginary customer.</h2></div><div className="cp-practice-grid"><div><h3><Check size={21}/> Do this</h3><ul><li>Ask when they last bought or solved the problem.</li><li>Find out who used the offer, chose it and paid.</li><li>Write their exact words beside what they actually did.</li><li>Speak to someone who chose a different provider.</li><li>Change your offer when the answers do not fit your plan.</li></ul></div><div><h3><X size={21}/> Avoid this</h3><ul><li>Invent a name, salary, photo or buyer quote.</li><li>Ask only “Would you buy my idea?”</li><li>Assume a WhatsApp reply means a paid order.</li><li>Call an idea-page description a verified customer.</li><li>Keep demographic details that do not change what you sell.</li></ul></div></div></div></section>
    {/* 10 · Four operator tips. */}
    <section className="cp-section cp-tips"><div className="cp-wrap"><div className="cp-intro"><p className="cp-kicker">When you speak to people</p><h2>Four details worth listening for.</h2></div><div className="cp-tip-grid">{tips.map(t=><article key={t.title}><h3>{t.title}</h3><p>{t.body}</p></article>)}</div></div></section>
    {/* 11 · Same FAQ interaction used across site. */}
    <div className="cp-faq"><SellerFaq faq={faq} title="Frequently asked questions" id="faq"/></div>
    {/* 12 · Related template family. */}
    <section className="cp-section cp-next"><div className="cp-wrap"><div className="cp-intro"><p className="cp-kicker">Keep going</p><h2>Use what you learn on the next page.</h2></div><div className="cp-next-grid"><a href="/templates/customer-interview"><span>Before the conversation</span><h3>Customer interview script</h3><p>Prepare questions that uncover the last purchase.</p><ArrowRight/></a><a href="/templates/lean-canvas"><span>After the conversation</span><h3>Lean canvas</h3><p>Put the buyer, problem, price and route to market in one view.</p><ArrowRight/></a><a href="/templates/one-page-business-plan"><span>When you have a direction</span><h3>One-page business plan</h3><p>Explain whom you serve and how the business will work.</p><ArrowRight/></a></div></div></section>
    {/* 13 · Validation CTA. */}
    <section className="cp-cta"><div className="cp-wrap"><div><p className="cp-kicker">Your next move</p><h2>Ask one buyer about their last purchase.</h2><p>Then try a small offer that answers what you heard. Keep the first test affordable and easy to change.</p></div><a className="cp-primary" href="/startup-idea-validation">How to test the idea <ArrowRight size={19}/></a></div></section>
    {/* 14 · Resource directory, tied to the framework. */}
    <section className="cp-section cp-resources"><div className="cp-wrap"><div className="cp-intro"><p className="cp-kicker">Related resources</p><h2>Find the market, test the offer, check the cost.</h2></div><div className="cp-resource-grid"><div><h3>Read next</h3><a href="/startup-guides/competitor-analysis-framework">See what buyers already choose <ArrowRight size={16}/></a><a href="/startup-guides/business-idea-validation-framework">Plan a small demand test <ArrowRight size={16}/></a></div><div><h3>Explore businesses</h3>{examples.map(e=><a key={e.list.slug} href={listUrl(e.list.slug)}>{e.list.name} <ArrowRight size={16}/></a>)}</div><div><h3>Check the cost</h3><a href="/calculator/startup-cost">Estimate your starting cost <ArrowRight size={16}/></a><a href="/calculator/break-even">Work out break-even sales <ArrowRight size={16}/></a><a href="/calculator">Browse calculators <ArrowRight size={16}/></a></div></div></div></section>
  </main></V2Frame>;
}
