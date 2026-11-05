import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";
import { V2Frame } from "@/components/v2/frame";
import { SellerFaq } from "@/components/v2/faq";
import { JsonLd, breadcrumbSchema, webPageSchema } from "@/lib/schema";

const levers = [
  {
    name: "Wrong buyer",
    signal: "The people you reached do not face this problem often enough, or cannot approve the spend.",
    test: "Find a narrower payer with the same costly workaround. Ask about the last time it happened before changing the product.",
    counter: "If several distinct buyer settings show no workaround, revisit the underlying problem.",
    href: "/first-customer-india",
    action: "Map a reachable payer",
  },
  {
    name: "Unclear offer",
    signal: "People describe the pain but cannot tell what they receive for the price.",
    test: "Show one bounded output, delivery date and price. Ask for a concrete next action rather than another opinion.",
    counter: "A clearer pitch cannot rescue delivery that costs more than the fee.",
    href: "/business-demand-test-india",
    action: "Test a defined commitment",
  },
  {
    name: "Wrong channel",
    signal: "The offer works for a few buyers, but your current route rarely reaches them.",
    test: "Try one alternate route to the same kind of buyer while holding the offer steady. Compare actual paid actions.",
    counter: "More views without payment may still mean the buyer or offer is wrong.",
    href: "/business-idea-research-india",
    action: "Research another route",
  },
  {
    name: "Broken fulfilment",
    signal: "Buyers pay, but the work, returns or collection timing breaks your boundary.",
    test: "Reduce scope, change terms or pause. Count a complete delivered order and its dated cash.",
    counter: "A different advert will not fix a job you cannot fulfil safely.",
    href: "/unit-economics-india",
    action: "Count the whole order",
  },
] as const;

const wrap = "mx-auto w-full max-w-6xl px-4 md:px-6";
const card = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6";
const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
const amount = (raw: string) => (raw.trim() === "" ? null : Number(raw));

export const Route = createFileRoute("/business-idea-pivot-or-stop")({
  head: () => ({
    meta: [
      { title: "When to Pivot or Stop a Business Idea in India | BusinessIdea.io" },
      {
        name: "description",
        content:
          "Use buyer evidence, a cash boundary and one smaller test to decide whether to adjust, pause or stop a business idea in India.",
      },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "When to pivot or stop a business idea | BusinessIdea.io" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: PivotPage,
});

function PivotPage() {
  const [activeLever, setActiveLever] = useState(0);
  const [spent, setSpent] = useState("");
  const [nextTest, setNextTest] = useState("");
  const [boundary, setBoundary] = useState("");

  const values = [amount(spent), amount(nextTest), amount(boundary)];
  const valid = values.every((value) => value !== null && Number.isFinite(value) && value >= 0);
  const [spentValue, nextValue, boundaryValue] = values;
  const remaining = valid ? boundaryValue! - spentValue! : null;
  const afterTest = valid ? boundaryValue! - spentValue! - nextValue! : null;

  const fields = [
    { label: "Cash already spent (₹)", value: spent, set: setSpent, hint: "Money already committed" },
    { label: "Proposed next test (₹)", value: nextTest, set: setNextTest, hint: "The next decision, not the old one" },
    { label: "Your total cash boundary (₹)", value: boundary, set: setBoundary, hint: "Choose your own limit first" },
  ] as const;

  return (
    <V2Frame active="/startup-guides">
      <JsonLd
        schema={[
          webPageSchema({
            path: "/business-idea-pivot-or-stop",
            name: "When to pivot or stop a business idea in India",
            description: "A practical evidence and downside decision guide for Indian founders.",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Startup guides", path: "/startup-guides" },
            { name: "Pivot or stop", path: "/business-idea-pivot-or-stop" },
          ]),
        ]}
      />

      <div className="bg-slate-50 pt-24 lg:pt-28">
        <nav className={`${wrap} flex flex-wrap items-center gap-2 py-3 text-sm text-slate-600`} aria-label="Breadcrumb">
          <a className="hover:text-blue-700" href="/">Home</a>
          <ChevronRight aria-hidden="true" size={15} />
          <a className="hover:text-blue-700" href="/startup-guides">Startup guides</a>
          <ChevronRight aria-hidden="true" size={15} />
          <span aria-current="page">Pivot or stop</span>
        </nav>
      </div>

      <header className="overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 sm:py-14 lg:py-16">
        <div className={`${wrap} grid items-center gap-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-12`}>
          <div>
            <p className="inline-flex rounded-full border border-blue-200 bg-white/90 px-3 py-1.5 text-sm font-semibold text-blue-800">
              A founder decision · India
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Changing course is also a business decision.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
              When an idea stalls, separate what you have learned from the money already spent. A buyer, offer,
              channel or delivery change may deserve one smaller test. Sometimes the safer move is to pause.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#cash-boundary" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                Check the next spend <ArrowRight size={17} />
              </a>
              <a href="#choose-a-change" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:border-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                Find what broke
              </a>
            </div>
            <p className="mt-4 text-sm text-slate-500">This guide helps structure your decision; it does not issue an automatic verdict.</p>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[1.75rem] border border-white bg-white p-2 shadow-xl shadow-blue-950/10">
              <img
                src="/images/guides/business-idea-validation-framework-test-before-you-build.webp"
                alt="Business idea validation guide artwork about testing an idea before building"
                className="aspect-video w-full rounded-[1.25rem] object-cover"
                width="1280"
                height="720"
                fetchPriority="high"
              />
              <div className="grid gap-3 p-4 sm:grid-cols-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-blue-700">Evidence</span>
                  <p className="mt-1 text-sm font-medium text-slate-800">What actually happened?</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-blue-700">Boundary</span>
                  <p className="mt-1 text-sm font-medium text-slate-800">What can you risk next?</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-blue-700">Decision</span>
                  <p className="mt-1 text-sm font-medium text-slate-800">What will you change?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="text-slate-900">
        <section className="py-12 lg:py-16">
          <div className={`${wrap} grid items-start gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-14`}>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-700">Start with the evidence</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Do not let yesterday’s spend make tomorrow’s decision.</h2>
              <p className="mt-4 leading-7 text-slate-600">
                Money already spent is part of the record, not a reason by itself to spend more. Look at the next
                commitment on its own: what could it teach you, what will it cost, and what would make you stop?
              </p>
              <a href="/business-idea-risk-check" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-blue-700 hover:text-blue-900">
                Set a personal risk boundary <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="grid h-fit content-start items-start gap-4 self-start sm:grid-cols-3">
              <article className={`${card} h-fit self-start border-t-4 border-t-blue-600`}>
                <h3 className="text-lg font-bold">Observation</h3>
                <p className="mt-2 leading-6 text-slate-600">Record buyer actions, dates, prices, costs and delivery outcomes.</p>
              </article>
              <article className={`${card} h-fit self-start border-t-4 border-t-indigo-500`}>
                <h3 className="text-lg font-bold">Interpretation</h3>
                <p className="mt-2 leading-6 text-slate-600">Mark what is inferred, and what evidence could prove your explanation wrong.</p>
              </article>
              <article className={`${card} h-fit self-start border-t-4 border-t-slate-400`}>
                <h3 className="text-lg font-bold">Boundary</h3>
                <p className="mt-2 leading-6 text-slate-600">Set a maximum next spend or number of hours before the next test.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="cash-boundary" className="scroll-mt-28 bg-slate-50 py-12 lg:py-16">
          <div className={wrap}>
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wider text-blue-700">Your next commitment</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Will another test cross your cash boundary?</h2>
              <p className="mt-4 leading-7 text-slate-600">
                Enter your own amounts. The calculation is a simple budget check, not a sales forecast or a recommendation
                to invest. Leave a field blank until you know the number.
              </p>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {fields.map((field) => (
                <label key={field.label} className={`${card} block font-semibold`}>
                  <span>{field.label}</span>
                  <span className="mt-1 block text-sm font-normal text-slate-500">{field.hint}</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    value={field.value}
                    onChange={(event) => field.set(event.target.value)}
                    className="mt-4 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              ))}
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3" aria-live="polite" aria-atomic="true">
              <article className="rounded-2xl bg-slate-950 p-5 text-white sm:p-6">
                <p className="text-sm font-medium text-slate-300">Boundary left after past spend</p>
                <p className="mt-2 text-2xl font-bold tabular-nums">{remaining === null ? "Add all three amounts" : money(remaining)}</p>
                <p className="mt-2 text-sm text-slate-300">Your chosen limit minus money already spent.</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <p className="text-sm font-medium text-slate-600">Boundary after the next test</p>
                <p className={`mt-2 text-2xl font-bold tabular-nums ${afterTest !== null && afterTest < 0 ? "text-rose-700" : "text-slate-950"}`}>
                  {afterTest === null ? "Waiting for amounts" : money(afterTest)}
                </p>
                <p className="mt-2 text-sm text-slate-600">What remains if you spend the proposed amount.</p>
              </article>
              <article className={`rounded-2xl border p-5 sm:p-6 ${afterTest !== null && afterTest < 0 ? "border-rose-200 bg-rose-50" : "border-blue-100 bg-blue-50"}`}>
                <p className="text-sm font-medium text-slate-700">Your boundary check</p>
                <p className="mt-2 text-xl font-bold">
                  {afterTest === null ? "Enter your amounts" : afterTest < 0 ? "This test exceeds your limit" : "Within your stated limit"}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {afterTest === null
                    ? "No result is shown until all three fields are valid."
                    : afterTest < 0
                      ? "Reduce the test, wait for better evidence or pause. The choice is yours."
                      : "Check time, delivery and bills due as well as cash."}
                </p>
              </article>
            </div>
            <p className="mt-4 text-sm text-slate-500">This page does not save the numbers you enter. Use the boundary you can afford, not a number chosen to justify the idea.</p>
          </div>
        </section>

        <section id="choose-a-change" className="scroll-mt-28 py-12 lg:py-16">
          <div className={wrap}>
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wider text-blue-700">Change one assumption at a time</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Where did the promise break?</h2>
              <p className="mt-4 leading-7 text-slate-600">Choose the closest pattern. These are prompts to investigate, not a score or automatic verdict. More than one issue may be present.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Business idea friction">
              {levers.map((item, index) => (
                <button
                  type="button"
                  key={item.name}
                  aria-pressed={activeLever === index}
                  onClick={() => setActiveLever(index)}
                  className={`min-h-11 rounded-xl border px-4 py-2.5 font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${activeLever === index ? "border-blue-700 bg-blue-700 text-white" : "border-slate-300 bg-white text-slate-800 hover:border-blue-500"}`}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <article className="mt-4 grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-2" aria-live="polite">
              <div className="p-6 sm:p-8">
                <p className="text-sm font-bold uppercase tracking-wide text-blue-700">What you may be seeing</p>
                <h3 className="mt-3 text-2xl font-bold">{levers[activeLever].name}</h3>
                <p className="mt-3 leading-7 text-slate-600">{levers[activeLever].signal}</p>
                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-900">Countercase to check</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{levers[activeLever].counter}</p>
                </div>
              </div>
              <div className="bg-blue-50 p-6 sm:p-8">
                <p className="text-sm font-bold uppercase tracking-wide text-blue-800">One smaller test</p>
                <p className="mt-3 text-lg font-semibold leading-7 text-slate-950">{levers[activeLever].test}</p>
                <a href={levers[activeLever].href} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-blue-800 shadow-sm ring-1 ring-blue-100 transition hover:ring-blue-300">
                  {levers[activeLever].action} <ArrowUpRight size={17} />
                </a>
              </div>
            </article>
          </div>
        </section>

        <section className="bg-slate-50 py-12 lg:py-16">
          <div className={wrap}>
            <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-12">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-blue-700">Four honest outcomes</p>
                <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Let the evidence change the next action.</h2>
                <p className="mt-4 leading-7 text-slate-600">There is no universal threshold on this page. Your evidence, obligations and chosen boundary matter more than a generic success score.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <article className={card}>
                  <h3 className="text-xl font-bold">Continue small</h3>
                  <p className="mt-2 leading-6 text-slate-600">A paid action and delivery worked within your boundary. Repeat the same defined promise before enlarging it.</p>
                </article>
                <article className={card}>
                  <h3 className="text-xl font-bold">Change one part</h3>
                  <p className="mt-2 leading-6 text-slate-600">The problem appears real, but the current scope, price or route failed. Change one assumption and keep the rest steady.</p>
                </article>
                <article className={card}>
                  <h3 className="text-xl font-bold">Pause</h3>
                  <p className="mt-2 leading-6 text-slate-600">The next spend is too large, a safety question is unresolved or the evidence is too thin. A pause protects your options.</p>
                </article>
                <article className={card}>
                  <h3 className="text-xl font-bold">Stop this version</h3>
                  <p className="mt-2 leading-6 text-slate-600">Repeated buyer actions contradict the claim, or the operation cannot fit the boundary you chose.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className={`${wrap} grid items-center gap-8 lg:grid-cols-2 lg:gap-12`}>
            <img
              src="/images/guides/business-idea-validation-framework-test-before-you-build.webp"
              alt="Guide artwork for validating a business idea before building"
              className="aspect-video w-full rounded-2xl object-cover"
              width="1280"
              height="720"
              loading="lazy"
            />
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-700">Keep the next question specific</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Use evidence before rebuilding the whole idea.</h2>
              <p className="mt-4 leading-7 text-slate-600">
                Read the original validation method, compare real alternatives, or return to the earliest unanswered launch question. Change the assumption you can test, not just the name of the idea.
              </p>
              <div className="mt-5 grid gap-3">
                <a href="/startup-guides/business-idea-validation-framework" className="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 font-semibold text-slate-900 transition hover:border-blue-400">
                  <span>Read the business idea validation guide</span><ArrowUpRight size={17} className="shrink-0 text-blue-700" />
                </a>
                <a href="/startup-idea-comparison" className="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 font-semibold text-slate-900 transition hover:border-blue-400">
                  <span>Compare two possible directions</span><ArrowUpRight size={17} className="shrink-0 text-blue-700" />
                </a>
                <a href="/startup-launch-plan-india" className="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 font-semibold text-slate-900 transition hover:border-blue-400">
                  <span>Return to the first unanswered launch gate</span><ArrowUpRight size={17} className="shrink-0 text-blue-700" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <SellerFaq
          title="Questions behind a hard call"
          faq={[
            {
              q: "Does money already spent mean I should finish?",
              a: <p>No. The earlier cost is context, not a reason by itself to commit more. Decide the next step from the evidence and downside available now.</p>,
            },
            {
              q: "Is a pivot the same as starting over?",
              a: <p>A useful pivot states which assumption changes and which evidence stays. If everything changes at once, the next result may be hard to interpret.</p>,
            },
            {
              q: "What if one customer paid but the work was exhausting?",
              a: <p>That sale is evidence of one buyer’s commitment, not a repeatable operation. Count the full delivery time and cash before agreeing to another order.</p>,
            },
          ]}
        />

        <section className="bg-blue-800 py-12 text-white lg:py-16">
          <div className={`${wrap} grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center`}>
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wider text-blue-200">The next honest move</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Protect the next decision.</h2>
              <p className="mt-4 leading-7 text-blue-100">Keep the observation, challenge your preferred explanation and put a boundary around the next test. Then choose one action you can explain later.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="/business-demand-test-india" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-900 transition hover:bg-blue-50">
                Design a smaller test <ArrowRight size={17} />
              </a>
              <a href="/startup-idea-comparison" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-blue-300 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">
                Compare alternatives <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>
      </main>
    </V2Frame>
  );
}
