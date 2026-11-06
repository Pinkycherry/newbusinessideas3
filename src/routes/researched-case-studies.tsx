import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Compass, FlaskConical, Lightbulb, Rocket, Target, TrendingUp } from "lucide-react";

import { V2Frame } from "@/components/v2/frame";
import { SellerFaq } from "@/components/v2/faq";
import { absoluteUrl } from "@/lib/schema";

/**
 * /researched-case-studies (7 Nov 2026). Replaces the purchased /case-studies snapshot, which carried the
 * seller's brand, sign-up offers and dead ./pages links. Same case material, told as pivot lessons:
 * no seller quotes, no seller metrics, every link points to a bbusiness.online page.
 */
export const Route = createFileRoute("/researched-case-studies")({
  head: () => ({
    meta: [
      { title: "Startup case studies: 12 pivots and 6 famous failures to learn from | bbusiness.online" },
      { name: "description", content: "Twelve startup pivot case studies across six industries and six well-known company failures, with the lesson each one teaches before you build. Free to read." },
      { property: "og:title", content: "Startup case studies: pivots and failures | bbusiness.online" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/researched-case-studies") }],
  }),
  component: CaseStudiesPage,
});

type Case = { sector: string; country: string; stage: string; title: string; problem: string; pivot: string; failed: string; solution: string };

const CASES: Case[] = [
  { sector: "SaaS", country: "United States", stage: "Pre-MVP, 3 weeks in", title: "Generic project tool to construction project management", problem: "Building a generic project management tool in a saturated horizontal market.", pivot: "Validation surfaced a real gap in construction-specific project management, so the customer was narrowed to general contractors and subcontractors.", failed: "Without the niche pivot, the founder estimated 18+ months of costly customer acquisition against Asana and Monday.", solution: "Construction project management with field-friendly screens, RFI tracking and offline mode." },
  { sector: "E-commerce", country: "Spain", stage: "Pre-launch, no inventory", title: "Eco marketplace to refurbished electronics", problem: "About to launch a generic sustainable products marketplace.", pivot: "Validation flagged refurbished electronics with eco-packaging as the only sub-niche where customers came back.", failed: "A generic eco-marketplace would have died competing against Amazon's Climate Pledge badge.", solution: "A refurbished electronics store with compostable packaging and a 12-month warranty." },
  { sector: "HealthTech", country: "United Kingdom", stage: "Idea plus a clinical network", title: "Consumer therapy app to workplace wellness", problem: "Wanted an AI therapy app for general consumer anxiety.", pivot: "Market research exposed an underserved corporate mental-health buyer with budget already allocated.", failed: "Direct-to-consumer anxiety apps cost far more per customer than enterprise sales and would have burned the seed money fast.", solution: "Business-to-business corporate wellness with HR-friendly reporting and usage metrics." },
  { sector: "FinTech", country: "Canada", stage: "Concept, 2 design partners", title: "Personal finance app to small-business credit scoring", problem: "Yet another personal finance app in a crowded space.", pivot: "Pivoted to small-business credit scoring for underserved communities after a SWOT and market-size check.", failed: "The personal finance space had 30+ funded competitors; payback would have taken longer than the runway.", solution: "Cash-flow-based credit scoring with bank-grade compliance for small businesses that banks overlook." },
  { sector: "SaaS", country: "Singapore", stage: "MVP in 2 weeks", title: "Monitoring dashboard to incident prevention", problem: "A generic DevOps monitoring tool in a commoditised category.", pivot: "Added machine-learning incident prediction after validation showed prevention, not dashboards, was the unmet job.", failed: "Yet another monitor would have lost on distribution to Datadog and New Relic.", solution: "A predictive incident-prevention layer on top of existing monitoring stacks." },
  { sector: "Marketplace", country: "United Kingdom", stage: "Side project, 200 listings", title: "Vintage clothing marketplace to luxury authentication", problem: "A generic vintage clothing marketplace where Depop and Vestiaire already dominate.", pivot: "Validation revealed luxury authentication as the trust gap nobody owned.", failed: "A generic vintage marketplace would have hit the chicken-and-egg wall of too few buyers and sellers by month 6.", solution: "AI-assisted luxury authentication, escrow payouts and a 7-day return guarantee." },
  { sector: "SaaS", country: "Italy", stage: "Social media audience, no product", title: "Freelancer invoicing to cross-border tax compliance", problem: "An invoicing tool for freelancers, one of the most crowded categories.", pivot: "Validation surfaced a sharper wedge: VAT compliance for EU freelancers selling to US clients.", failed: "Direct competition with FreshBooks and Wave would have meant almost no organic visibility.", solution: "Niche EU-to-US compliance with auto-sorted expense exports for accountants." },
  { sector: "Marketplace", country: "India", stage: "Concept, no letters of intent", title: "Trucking marketplace to Tier-2 cold-chain", problem: "A generic business-to-business trucking marketplace.", pivot: "Pivoted to last-mile cold-chain for Tier-2 cities after demand scoring showed customers would pay far more for it.", failed: "Generic freight matching is a race to the bottom on rates; cold-chain carries premium margins.", solution: "A cold-chain fleet network with temperature tracking for pharma and dairy clients." },
  { sector: "AI and ML", country: "Japan", stage: "Hackathon prototype", title: "General AI tutor to Japanese language exam prep", problem: "A generic AI tutor for school students, a product many teams ship.", pivot: "Validation pointed to JLPT exam prep, where parents already pay for coaching and general AI tools are weak on kanji.", failed: "A generic AI tutor would have been wiped out by the next consumer release from a big AI company.", solution: "A JLPT-focused tutor with grading rubrics, mock exams and weekly reports for parents." },
  { sector: "FinTech", country: "Mexico", stage: "Beta with 12 small businesses", title: "Payments aggregator to instant courier payouts", problem: "Another payments aggregator for small businesses in Latin America.", pivot: "Demand research showed same-day payouts for delivery couriers as the real unmet need.", failed: "Head-on competition with large payment companies would have been crushed by their distribution.", solution: "Instant payout rails for gig workers, connected to the top delivery apps." },
  { sector: "HealthTech", country: "Australia", stage: "Pilot with 1 clinic", title: "General medical scribe to allied-health clinics", problem: "A generic AI medical scribe in a category big players own.", pivot: "A vertical pivot to allied health (physiotherapy, occupational therapy, speech therapy), where incumbents under-served.", failed: "A head-on enterprise battle would have been lost on long procurement cycles alone.", solution: "An allied-health scribe with billing-code suggestions and patient summary export." },
  { sector: "AI and ML", country: "United Arab Emirates", stage: "Idea plus a waitlist", title: "AI agent builder to compliance-aware banking agents", problem: "Yet another AI agent builder.", pivot: "Validation revealed compliance-aware agents for Middle East banks as a defensible wedge.", failed: "Horizontal agent builders are copied every week; regulated industries are not.", solution: "A Sharia-compliant, Arabic-first agent platform for retail banking work." },
];

const STEPS = [
  { I: Target, t: "Hypothesis", d: "Write the riskiest assumption as one sentence you can prove wrong: market size, who buys, what they will pay." },
  { I: FlaskConical, t: "Signals", d: "Collect evidence: demand, a competitor map, a SWOT and a price test. The Validate button on every idea page sets this up for your town." },
  { I: Compass, t: "Pivot", d: "Narrow to the customer or niche where the signals are clearly stronger. Do not average them." },
  { I: Rocket, t: "First offer", d: "Ship the smallest paying offer in 2 to 4 weeks. Charge real money, not a waitlist." },
  { I: TrendingUp, t: "Traction", d: "Grow the channel that works. Check your idea again every quarter as the market moves." },
];

const PATTERNS = [
  { t: "Niche focus", d: "Founders moved from a broad idea to one specific customer or industry after checking demand.", e: "Generic project tool to construction project management." },
  { t: "Fast iteration", d: "They tested several versions of the idea in the first week before committing to one.", e: "Each version was checked against the same buyer questions." },
  { t: "Evidence over gut", d: "Positioning changed because of competitor and demand evidence, not a feeling.", e: "Personal finance app to small-business credit scoring." },
  { t: "Distribution first", d: "They picked the channel before the product: a community, a partner or an existing audience.", e: "A social media audience came before the invoicing product." },
  { t: "Price tested early", d: "Real prices went to real prospects before any product was built.", e: "The exam-prep tutor was priced before launch." },
  { t: "Failure-aware", d: "Before committing, they studied failures in the same category.", e: "See the failure cases below and the India failure library." },
];

const FAILURES = [
  { n: "Silicon Valley Bank (SVB)", y: "1983 to 2023", c: "Asset-liability mismatch, concentration risk", l: "Concentration risk in a single industry creates failures that hit all at once and leaves a business exposed to one market shift." },
  { n: "BitMEX", y: "2014 to 2020", c: "Regulatory evasion and criminal charges", l: "You cannot build a financial business by dodging regulation. Its founders chose offshore structures over compliance and paid with criminal convictions." },
  { n: "Terraform Labs (Terra and Luna)", y: "2018 to 2022", c: "Algorithmic stablecoin collapse", l: "A stablecoin backed by its own volatile sister token can unwind in days. Very high yield means very high risk." },
  { n: "FTX", y: "2019 to 2022", c: "Fraud and mismanagement", l: "Checking a founder's character matters as much as the business numbers. Weak governance enabled massive fraud." },
  { n: "Wirecard", y: "1999 to 2020", c: "Accounting fraud", l: "Even a large listed company with a major auditor can be a fraud. Pride and trust blinded people to obvious red flags." },
  { n: "WeWork", y: "2010 to 2023", c: "Overvaluation and governance failure", l: "A property rental business was valued like a tech company. The valuation collapsed and the company went bankrupt." },
];

const FAQ = [
  { q: "What are these case studies?", a: "Twelve startup pivots across six industries, each told as problem, pivot, what would have failed and the solution, plus six well-known company failures. They are lessons to study before you build, not adverts for any tool." },
  { q: "Why are there no revenue or funding figures?", a: "We publish a number only when we can trace it to a source. The pivot stories are kept to the decisions, which is the part you can copy. The failure cases cover public companies whose stories are widely reported." },
  { q: "What is the most common pattern?", a: "Moving from a broad idea to one specific customer or industry. Almost every pivot here follows that path." },
  { q: "How do I apply these lessons to my own idea?", a: "Write your riskiest assumption, ask what would kill the idea, and test a price before you build. The Validate button on any idea page turns your town, budget and time into a ready question for the AI tool you already use." },
  { q: "Are there Indian examples?", a: "One pivot here is from India (Tier-2 cold-chain). For more, read the India startup failure library and the business ideas written for Indian towns and cities." },
  { q: "Is this free?", a: "Yes. Every page on bbusiness.online is free to read with no sign-up." },
];

const wrap = "mx-auto w-full max-w-6xl px-4 sm:px-6";

function CaseStudiesPage() {
  return (
    <V2Frame>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f1efff,#faf9ff_60%,#fff)] pt-28 pb-10 sm:pt-32">
        <div className={wrap + " grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]"}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4643ba]">Case studies · 12 pivots, 6 failures</p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Startup case studies: what founders changed before they built.</h1>
            <p className="mt-4 max-w-2xl text-slate-600">Twelve founders, six industries, one habit: check the riskiest assumption before writing a line of code. Here is what they pivoted and shipped, and six famous failures that show what happens when nobody checks.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/startup-idea-validation" className="g-btn g-shine">Validate your idea <ArrowRight size={16} /></a>
              <a href="/failed-startups/india" className="g-btn-light">Read India startup failures</a>
            </div>
          </div>
          <img src="/bought/case-studies/images/case-studies-x0byv0pT.jpg" alt="Illustration of startup case study cards with growth charts" width={1280} height={960} className="mx-auto w-full max-w-md" />
        </div>
      </section>

      <section className="py-8">
        <div className={wrap}>
          <div className="g-tile p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4643ba]">In short</p>
            <p className="mt-2 text-slate-700">Each case below shows a founder who checked an idea, changed it because of what they found, and shipped the changed product. The most common move was from a broad idea to one specific customer or industry.</p>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10" aria-labelledby="cases">
        <div className={wrap}>
          <h2 id="cases" className="font-display text-3xl font-bold text-slate-900">Twelve pivot case studies</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {CASES.map((c) => (
              <article key={c.title} className="g-tile p-5 sm:p-6">
                <div className="flex flex-wrap gap-2">
                  <span className="g-chip">{c.sector}</span>
                  <span className="g-chip">{c.country}</span>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-slate-900">{c.title}</h3>
                <p className="mt-1 text-xs text-slate-500">Stage when checked: {c.stage}</p>
                <dl className="mt-4 grid gap-3 text-sm">
                  <div><dt className="text-[11px] font-semibold uppercase tracking-wide text-[#4643ba]">The problem</dt><dd className="mt-1 text-slate-700">{c.problem}</dd></div>
                  <div><dt className="text-[11px] font-semibold uppercase tracking-wide text-[#4643ba]">The pivot</dt><dd className="mt-1 text-slate-700">{c.pivot}</dd></div>
                  <div><dt className="text-[11px] font-semibold uppercase tracking-wide text-[#d6337f]">What would have failed</dt><dd className="mt-1 text-slate-700">{c.failed}</dd></div>
                  <div><dt className="text-[11px] font-semibold uppercase tracking-wide text-[#0f9f8f]">The solution</dt><dd className="mt-1 text-slate-700">{c.solution}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14" aria-labelledby="loop">
        <div className={wrap}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4643ba]">The repeatable pattern</p>
          <h2 id="loop" className="mt-2 font-display text-3xl font-bold text-slate-900">The five steps behind every pivot</h2>
          <p className="mt-2 text-slate-600">Every case above followed the same loop. Use it for your own idea.</p>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map(({ I, t, d }, i) => (
              <li key={t} className="g-tile p-5">
                <span className="g-icon"><I aria-hidden size={24} /></span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Step {i + 1}</p>
                <h3 className="font-display text-lg font-semibold text-slate-900">{t}</h3>
                <p className="mt-2 text-sm text-slate-600">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-10 sm:py-14" aria-labelledby="patterns">
        <div className={wrap}>
          <h2 id="patterns" className="font-display text-3xl font-bold text-slate-900">Six patterns behind the pivots</h2>
          <p className="mt-2 text-slate-600">Use them as a checklist before you commit to your idea.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PATTERNS.map((p) => (
              <div key={p.t} className="g-tile p-5">
                <span className="g-icon violet"><Lightbulb aria-hidden size={22} /></span>
                <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">{p.t}</h3>
                <p className="mt-2 text-sm text-slate-600">{p.d}</p>
                <p className="mt-2 text-xs text-slate-500">{p.e}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14" aria-labelledby="failures">
        <div className={wrap}>
          <h2 id="failures" className="font-display text-3xl font-bold text-slate-900">Learn from famous startup failures</h2>
          <p className="mt-2 text-slate-600">Most startups fail. These six well-known cases show the mistakes to avoid.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FAILURES.map((f) => (
              <article key={f.n} className="g-tile p-5">
                <h3 className="font-display text-lg font-semibold text-slate-900">{f.n}</h3>
                <p className="mt-1 text-xs text-slate-500">{f.c} · {f.y}</p>
                <p className="mt-3 text-sm text-slate-700">{f.l}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/failed-startups/india" className="g-btn">India startup failures <ArrowRight size={16} /></a>
            <a href="/why-startups-fail-2026-2027" className="g-btn-light">Why startups fail</a>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14" aria-labelledby="tools">
        <div className={wrap}>
          <h2 id="tools" className="font-display text-3xl font-bold text-slate-900">Free tools to check your own idea</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <a href="/calculator" className="g-link"><span><span className="block font-semibold">Startup calculators</span><span className="block text-xs font-normal text-slate-500">Startup cost, break-even, runway and more</span></span><span className="g-arrow"><ArrowRight aria-hidden size={15} /></span></a>
            <a href="/topics" className="g-link"><span><span className="block font-semibold">Answers for India</span><span className="block text-xs font-normal text-slate-500">Plain answers on checking, funding and numbers</span></span><span className="g-arrow"><ArrowRight aria-hidden size={15} /></span></a>
            <a href="/tools" className="g-link"><span><span className="block font-semibold">Founder tools</span><span className="block text-xs font-normal text-slate-500">Templates, frameworks and checklists</span></span><span className="g-arrow"><ArrowRight aria-hidden size={15} /></span></a>
            <a href="/startup-guides" className="g-link"><span><span className="block font-semibold">Startup guides</span><span className="block text-xs font-normal text-slate-500">Read before you build</span></span><span className="g-arrow"><ArrowRight aria-hidden size={15} /></span></a>
            <a href="/browse" className="g-link"><span><span className="block font-semibold">Browse business ideas</span><span className="block text-xs font-normal text-slate-500">Researched ideas by category</span></span><span className="g-arrow"><ArrowRight aria-hidden size={15} /></span></a>
            <a href="/blog" className="g-link"><span><span className="block font-semibold">The founder journal</span><span className="block text-xs font-normal text-slate-500">Articles for first-time founders</span></span><span className="g-arrow"><ArrowRight aria-hidden size={15} /></span></a>
          </div>
        </div>
      </section>

      <SellerFaq title="Questions about these case studies" faq={FAQ} />

      <section className="pb-14">
        <div className={wrap}>
          <div className="g-tile grid items-center gap-5 p-6 sm:p-8 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-display text-2xl font-semibold text-slate-900">Ready to check your own idea?</h2>
              <p className="mt-2 text-slate-600">Start the same way every founder on this page did: find the assumption that could kill it, then test it for your town.</p>
            </div>
            <a href="/startup-idea-validation" className="g-btn">Start validating free <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>
    </V2Frame>
  );
}
