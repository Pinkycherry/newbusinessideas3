import { useEffect, useRef } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { V2Frame } from "./frame";
import { SellerFaq } from "./faq";
import { templateImages } from "@/config/template-imagery";
import { FOUNDER_TEMPLATES } from "@/data/template-library";
import "./templates-directory.css";

const groups = [
  { title: "Discover & define", description: "Listen to the buyer before deciding what to build." },
  { title: "Position & strategy", description: "Put your assumptions in one place and decide what to test." },
  { title: "Plan & pitch", description: "Turn what you know into a clear plan for your next conversation." },
];
const choices = [
  { need: "I need to understand the person who will pay", slug: "customer-persona" },
  { need: "I want to ask buyers without leading them", slug: "customer-interview" },
  { need: "I need to understand what buyers choose instead", slug: "competitive-analysis" },
  { need: "I need to see the whole idea at a glance", slug: "lean-canvas" },
  { need: "I want a short plan for a first discussion", slug: "one-page-business-plan" },
  { need: "I am planning a software business", slug: "saas-business-plan" },
  { need: "I need a fuller plan for a shop or service", slug: "standard-business-plan" },
];

export function TemplatesDirectory() {
  const root = useRef<HTMLElement>(null);
  const carousel = useRef<HTMLElement>(null);
  useEffect(() => {
    const host = root.current;
    if (!host || !("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    }), { rootMargin: "0px 0px -3% 0px" });
    host.querySelectorAll(".pt-reveal").forEach(el => { el.classList.add("motion-ready"); observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const rail = carousel.current;
    if (!rail || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let previous = 0;
    let resumeAt = 0;
    let paused = false;
    const pause = () => { paused = true; };
    const resume = () => { resumeAt = performance.now() + 1800; paused = false; };
    const move = (now: number) => {
      if (previous && !paused && now >= resumeAt) {
        rail.scrollLeft += Math.min(now - previous, 50) * 0.028;
        const repeatWidth = rail.scrollWidth / 2;
        if (repeatWidth && rail.scrollLeft >= repeatWidth) rail.scrollLeft -= repeatWidth;
      }
      previous = now;
      frame = requestAnimationFrame(move);
    };
    rail.addEventListener("pointerenter", pause);
    rail.addEventListener("pointerleave", resume);
    rail.addEventListener("touchstart", pause, { passive: true });
    rail.addEventListener("touchend", resume);
    rail.addEventListener("focusin", pause);
    rail.addEventListener("focusout", resume);
    frame = requestAnimationFrame(move);
    return () => {
      cancelAnimationFrame(frame);
      rail.removeEventListener("pointerenter", pause);
      rail.removeEventListener("pointerleave", resume);
      rail.removeEventListener("touchstart", pause);
      rail.removeEventListener("touchend", resume);
      rail.removeEventListener("focusin", pause);
      rail.removeEventListener("focusout", resume);
    };
  }, []);
  const faq = [
    { q: "Which template should I choose first?", a: "Start with the question you cannot answer yet. Read the customer persona if the buyer is unclear, the interview guide if you need to listen, or a plan when you have evidence to organise." },
    { q: "Do I need to fill in a form?", a: "No. These are read-only explanations of each template and its questions. Use what is relevant to your own research and plans." },
    { q: "Where do the frameworks come from?", a: "The guides follow the source structures for persona, interview, comparison, canvas and business plans. The examples and explanations address business decisions in India." },
    { q: "Do these templates make a business idea valid?", a: "A template is a way to think clearly. Buyer conversations, real costs and a small test help you check whether the idea works." },
  ];
  return <V2Frame active="/templates"><main className="pt-page" ref={root}>
    <section className="pt-hero"><div className="pt-wrap"><nav className="pt-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={15}/><span>Templates</span></nav><div className="pt-hero-grid"><div><span className="pt-eyebrow">Founder templates</span><h1>Give your idea somewhere to become clear.</h1><p>When the questions are scattered, even a promising idea feels heavy. Choose a template guide, understand each part and take the next unknown into a buyer conversation.</p><div className="pt-actions"><a href="#catalog" className="pt-primary">Browse templates <ArrowRight size={18}/></a><a href="/lists" className="pt-secondary">Explore business ideas <ArrowRight size={17}/></a></div></div><div className="pt-hero-art"><img src={templateImages.planning.src} alt={templateImages.planning.alt} width={1600} height={900} loading="eager" title={templateImages.planning.description} fetchPriority="high" /></div></div></div></section>
    <section className="pt-quick pt-reveal" aria-label="Jump to a template"><div className="pt-wrap"><p>Start with your question</p><nav ref={carousel} aria-label="Template guide carousel"><div className="pt-quick-track"><div className="pt-quick-set">{FOUNDER_TEMPLATES.map(item => <a href={`/templates/${item.slug}`} key={item.slug}>{item.title}<ArrowRight size={14}/></a>)}</div><div className="pt-quick-set" aria-hidden="true">{FOUNDER_TEMPLATES.map(item => <a href={`/templates/${item.slug}`} key={item.slug} tabIndex={-1}>{item.title}<ArrowRight size={14}/></a>)}</div></div></nav></div></section>
    <section className="pt-catalog pt-reveal" id="catalog"><div className="pt-wrap"><div className="pt-heading"><span className="pt-eyebrow">The collection</span><h2>Find the page that helps you move.</h2><p>Each guide follows its source structure, with Indian business context and questions worth checking in the field.</p></div>{groups.map(group => <div className="pt-group" key={group.title}><div className="pt-group-intro"><span>{group.title}</span><h3>{group.title}</h3><p>{group.description}</p></div><div className="pt-card-grid">{FOUNDER_TEMPLATES.filter(item => item.group === group.title).map(item => <a key={item.slug} className="pt-card" href={`/templates/${item.slug}`}><div className="pt-card-image"><img src={item.image.src} alt={item.image.alt} title={item.image.description} loading="lazy" width={item.image.width} height={item.image.height} /></div><div className="pt-card-copy"><span>{item.group}</span><h4>{item.title}</h4><p>{item.short}</p><strong>Open template <ArrowRight size={16}/></strong></div></a>)}</div></div>)}</div></section>
    <section className="pt-choice pt-reveal"><div className="pt-wrap"><div className="pt-heading"><span className="pt-eyebrow">Choose by decision</span><h2>What is holding you back right now?</h2><p>Pick the question closest to your next conversation. You can change templates as your evidence changes.</p></div><div className="pt-choice-grid">{choices.map(choice => {const template=FOUNDER_TEMPLATES.find(item=>item.slug===choice.slug)!;return <a key={choice.slug} href={`/templates/${choice.slug}`}><span>{choice.need}</span><strong>{template.title}</strong><ArrowRight size={19}/></a>;})}</div></div></section>
    <SellerFaq faq={faq} title="Common questions" />
    <section className="pt-end pt-reveal"><div className="pt-wrap"><span className="pt-eyebrow">Make the next move</span><h2>The template helps you see the gap. A buyer helps you close it.</h2><p>Take the question you could not answer and ask someone who lives with that problem.</p><a href="/templates/customer-interview" className="pt-primary">Prepare a customer conversation <ArrowRight size={18}/></a></div></section>
    <section className="pt-reading pt-reveal"><div className="pt-wrap"><div className="pt-heading"><span className="pt-eyebrow">Deeper answers</span><h2>Pick the page for the evidence you need.</h2></div><div className="pt-reading-list"><article><div><h3>When the buyer is still unclear</h3><p>Begin with a recent purchase or problem. The person using an offer, the person choosing it and the person paying may differ. A persona is useful when it preserves that distinction; an interview tests it.</p></div><a href="/templates/customer-persona">Examine the buyer <ArrowRight size={17}/></a></article><article><div><h3>When another option already works</h3><p>Ask what the buyer chose last time, including a local provider, familiar workaround or doing nothing. Compare the job, full cost and switching risk before claiming a difference.</p></div><a href="/templates/competitive-analysis">Compare the options <ArrowRight size={17}/></a></article><article><div><h3>When the business needs a plan</h3><p>A plan connects the buyer and offer to the work, payment and costs. Keep the full operational plan for a lender or partner separate from the software plan's adoption, retention and recurring revenue questions.</p></div><a href="/templates/saas-business-plan">Read the software plan <ArrowRight size={17}/></a></article></div></div></section>
  </main></V2Frame>;
}
