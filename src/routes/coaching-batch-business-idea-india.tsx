import { SellerFaq } from "@/components/v2/faq";
import { V2PageCard, V2PageCta, V2PageFaq, V2PageHero, V2PageSection } from "@/components/v2/page-sections";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { GlassShell } from "@/components/glass-shell";
import { JsonLd, absoluteUrl, breadcrumbSchema, webPageSchema } from "@/lib/schema";
import "@/components/coaching-batch.css";

const path = "/coaching-batch-business-idea-india";
const art = "/images/blog/realistic-part-time-business-ideas-extra-income-evening-hustles-weekend-jobs-skills.webp";
const blank = { capacity:"", paid:"", sessions:"", teaching:"", prep:"", travel:"", followup:"", fee:"", costs:"" };
type Field = keyof typeof blank;
const groups: { title:string; note:string; items:{ key:Field; label:string; hint:string; unit:string }[] }[] = [
  { title:"The seat promise", note:"A name on a waiting list is not a paid seat. Set a class size you can actually teach.", items:[
    {key:"capacity",label:"Seats you can teach well",hint:"Your own limit for one batch, not a benchmark.",unit:"learners"},
    {key:"paid",label:"Paid seats in this scenario",hint:"Enter zero if nobody has agreed to the paid trial yet.",unit:"learners"},
    {key:"sessions",label:"Sessions each week",hint:"The same slot must work after your own job.",unit:"sessions"},
    {key:"teaching",label:"Teaching minutes per session",hint:"Time in the room or on the live call.",unit:"minutes"},
  ]},
  { title:"The work around the class", note:"Include preparation, travel and individual feedback. The class hour is only one part of the work.", items:[
    {key:"prep",label:"Preparation minutes per session",hint:"Lesson plan, examples and checking the next exercise.",unit:"minutes"},
    {key:"travel",label:"Travel or setup minutes per session",hint:"Use zero only when you genuinely have none.",unit:"minutes"},
    {key:"followup",label:"Feedback minutes per learner each week",hint:"Checking work or replying to a learner's question.",unit:"minutes"},
    {key:"fee",label:"Fee per learner for four weeks",hint:"The amount you actually propose to collect.",unit:"₹"},
    {key:"costs",label:"Cash costs for four weeks",hint:"Room, materials, platform and other cash paid; exclude costs counted elsewhere.",unit:"₹"},
  ]},
];
const ideas = [
  {title:"Evening Maths Coaching At Home",slug:"evening-maths-coaching-at-home",question:"Can you explain one school topic patiently, then check a student's work?"},
  {title:"Spoken English Evening Practice Club",slug:"spoken-english-evening-practice-club",question:"Can every learner speak in the session, rather than only listen to you?"},
  {title:"After Work Excel Skills Batch",slug:"after-work-excel-skills-batch",question:"Can a learner complete one real spreadsheet task before leaving?"},
] as const;
const money=(n:number)=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
const decimal=(n:number)=>new Intl.NumberFormat("en-IN",{maximumFractionDigits:1}).format(n);

export const Route=createFileRoute("/coaching-batch-business-idea-india")({
  head:()=>({meta:[
    {title:"Coaching Batch Business Idea in India: Plan Time, Seats and Fees | BusinessIdea.io"},
    {name:"description",content:"Build one after-office coaching batch around a real class slot. Test learner seats, preparation, feedback hours and a four-week fee scenario before committing."},
    {property:"og:title",content:"Can a coaching batch fit your working week? | BusinessIdea.io"},
    {property:"og:type",content:"website"},
    {property:"og:image",content:absoluteUrl(art)},
    {property:"og:image:alt",content:"Original part-time business ideas artwork showing evening, weekend and teaching work"},
    {name:"twitter:card",content:"summary_large_image"},
  ]}),
  component:CoachingBatchPage,
});

function CoachingBatchPage(){
  const [values,setValues]=useState(blank);
  const n=Object.fromEntries((Object.keys(blank) as Field[]).map(k=>[k,Number(values[k])])) as Record<Field,number>;
  const filled=(Object.keys(blank) as Field[]).every(k=>values[k]!==""&&Number.isFinite(n[k])&&n[k]>=0);
  const valid=filled&&n.capacity>0&&n.sessions>0&&n.teaching>0&&
    ["capacity","paid","sessions","teaching","prep","travel","followup"].every(k=>Number.isInteger(n[k as Field]));
  const overCapacity=valid&&n.paid>n.capacity;
  const fourWeekHours=valid?4*(n.sessions*(n.teaching+n.prep+n.travel)+n.paid*n.followup)/60:0;
  const receipts=valid?n.paid*n.fee:0;
  const beforeOwner=receipts-(valid?n.costs:0);
  const update=(key:Field,value:string)=>setValues(previous=>({...previous,[key]:value}));
  return <><JsonLd schema={[
    webPageSchema({path,name:"Coaching batch business idea in India",description:"A four-week class planning desk for an after-office founder: teachable promise, seat cap, preparation, feedback and cash scenario."}),
    breadcrumbSchema([{name:"Home",path:"/"},{name:"Part-time business ideas",path:"/category/part-time-business-ideas"},{name:"Coaching batch workbench",path}]),
  ]}/>
  <GlassShell><div className="cb-page">
    <nav className="gl-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/category/$categorySlug" params={{categorySlug:"part-time-business-ideas"}}>Part-time ideas</Link><span>/</span><span>Coaching batch</span></nav>
    <V2PageHero className="cb-hero"><div><p className="gh-eyebrow">THE AFTER-OFFICE CLASS · INDIA</p><h1>Can your coaching business idea survive a working week?</h1><p>Students see the hour you teach. You carry the preparation, travel, corrections and the promise to show up again. Start with one lesson people would pay to practise, then fit the batch around the life you already have.</p><a className="gh-button gh-button-primary" href="#batch-desk">Map one four-week batch <ArrowRight size={17} aria-hidden="true"/></a></div><aside className="cb-offer-slip"><span>THE FIRST OFFER SLIP</span><strong>In four weeks, you will practise one specific skill at the same time each week.</strong><p>Write the subject, the learner's starting point, the session slot and what they can do by the last class. A broad promise like “become fluent” leaves too much unsaid.</p><Link to="/business-pricing-india">Set the scope of a first offer <ArrowUpRight size={17} aria-hidden="true"/></Link></aside></V2PageHero>
    <V2PageSection className="cb-source-ideas"><div className="cb-section-lead"><p className="gh-eyebrow">THREE DIFFERENT CLASS PROMISES</p><h2>Choose the lesson before you count the seats.</h2><p>These are published blueprints from the after-office collection. Each serves a different learner; none proves a full batch exists in your area.</p></div><div className="cb-ideas">{ideas.map(item=><V2PageCard key={item.slug}><h3>{item.title}</h3><p>{item.question}</p><Link to="/idea/$slug" params={{slug:item.slug}}>Read the buyer and first steps <ArrowUpRight size={16} aria-hidden="true"/></Link></V2PageCard>)}</div><Link className="cb-text-link" to="/category/$categorySlug/$subcategorySlug" params={{categorySlug:"part-time-business-ideas",subcategorySlug:"after-office-coaching-batch-business-ideas"}}>Compare all ten published coaching ideas <ArrowUpRight size={17} aria-hidden="true"/></Link></V2PageSection>
    <V2PageSection className="cb-two-clocks"><div><p className="gh-eyebrow">THE HOURS THAT DO NOT LOOK LIKE CLASS</p><h2>Your week contains two clocks.</h2><p>One clock runs while learners are with you. The other starts when you prepare examples, travel, check work and answer a question after class. If the second clock has no room, the first one eventually slips.</p><Link to="/business-idea-time-fit">Put this beside your job and rest time <ArrowUpRight size={17} aria-hidden="true"/></Link></div><div className="cb-clock-lines"><p><strong>Before the session</strong><span>Prepare one exercise and the explanation for mistakes.</span></p><p><strong>During the session</strong><span>Let each learner practise, not just watch a demonstration.</span></p><p><strong>After the session</strong><span>Mark work, record questions and decide what changes next time.</span></p></div></V2PageSection>
    <V2PageSection id="batch-desk" className="cb-desk"><div className="cb-desk-heading"><p className="gh-eyebrow">YOUR FOUR-WEEK SCENARIO</p><h2>What does this batch ask of you?</h2><p>Enter your own seat limit, class minutes, preparation and proposed fee. This is a planning scenario, not a demand forecast. Nothing is sent or saved; use zero only for a cost or task that truly does not apply.</p></div><div className="cb-workspace"><div className="cb-fields">{groups.map(group=><fieldset key={group.title}><legend>{group.title}</legend><p>{group.note}</p><div>{group.items.map(item=><label key={item.key}><span>{item.label}</span><small>{item.hint}</small><span className="cb-input-wrap"><input type="number" min="0" step={item.key==="fee"||item.key==="costs"?"any":"1"} inputMode="decimal" value={values[item.key]} onChange={event=>update(item.key,event.target.value)} aria-label={item.label}/><em>{item.unit}</em></span></label>)}</div></fieldset>)}</div><aside className="cb-result" aria-live="polite"><span>THE READING</span>{!filled?<><h3>Begin with a real limit.</h3><p>Complete the fields to see a four-week time and cash scenario. Empty is unknown, not zero.</p></>:!valid?<><h3>Check the inputs.</h3><p>Seats and sessions must be whole numbers above zero; teaching minutes must be above zero. All fields must be non-negative.</p></>:overCapacity?<><h3>The promise is bigger than the room.</h3><p>Paid seats in this scenario exceed the number you said you can teach well. Reduce the seats or rethink the delivery before reading a cash result.</p></>:<><h3>{decimal(fourWeekHours)} hours of work</h3><p>Teaching, preparation, travel and per-learner feedback across four weeks.</p><dl><div><dt>Scenario receipts</dt><dd>{money(receipts)}</dd></div><div><dt>Cash costs entered</dt><dd>{money(n.costs)}</dd></div><div><dt>Left before paying yourself</dt><dd>{money(beforeOwner)}</dd></div></dl><p>{beforeOwner<0?"This scenario spends more cash than it collects. A bigger class is not the only answer; question the offer and costs first.":"This amount is not profit. It does not pay for your own hours, tax or shared overhead unless you put those into the cost field."}</p></>}<small>Four weeks is a defined planning cycle, not a calendar month or an enrollment prediction.</small></aside></div></V2PageSection>
    <V2PageSection className="cb-buyer"><div><p className="gh-eyebrow">ASK FOR AN ACTION, NOT PRAISE</p><h2>Will someone pay to practise this lesson?</h2><p>Ask a learner or parent about the last time this skill caused a problem. Show the exercise, slot, fee and missed-class rule. A compliment is useful feedback; a paid trial at a clear date is a different signal.</p></div><div className="cb-buyer-note"><strong>A better first conversation</strong><p>“Which part of this task took you longest last week?”</p><p>“What did you try when you got stuck?”</p><p>“If we practise that one task together on Thursday, would you join a paid trial at this fee?”</p><Link to="/first-customer-india">Record the difference between interest and commitment <ArrowUpRight size={17} aria-hidden="true"/></Link></div></V2PageSection>
    <V2PageSection className="cb-source-art"><figure><img src={art} alt="Original part-time business ideas journal artwork showing evening laptop work, teaching and weekend jobs" width={1280} height={720} loading="lazy"/><figcaption>From the original journal: the honest number of hours matters more than an ambitious one.</figcaption></figure><div><p className="gh-eyebrow">READ THE SOURCE, THEN RETURN TO YOUR SLOT</p><h2>A part-time idea must live inside real evenings.</h2><p>The original article groups published ideas by when the work happens. Use it to compare teaching against other evening work, then come back to the class hours you entered above.</p><Link to="/blog/$slug" params={{slug:"realistic-part-time-business-ideas"}}>Read the full part-time idea article <ArrowUpRight size={17} aria-hidden="true"/></Link></div></V2PageSection>
    <V2PageSection className="cb-boundaries"><div><p className="gh-eyebrow">THE FIRST CANCELLED CLASS</p><h2>Make the rule before anyone needs it.</h2><p>Decide what happens when you are late from work, a learner misses a session, or a room becomes unavailable. Put the policy in plain language beside the schedule and fee.</p></div><div className="cb-boundary-list"><article><strong>If your job runs late</strong><p>Name the latest notice you can give and the one backup slot you can honour.</p></article><article><strong>If a learner misses class</strong><p>Say whether they receive notes, a short catch-up or no replacement session.</p></article><article><strong>If the batch fills</strong><p>Start a waitlist rather than adding seats past the teaching limit you chose.</p></article></div></V2PageSection>
    <SellerFaq title="Questions worth settling early." faq={[{q:"Does a full batch mean the business works?",a:<><p>No. A full class can still demand more preparation, feedback and travel than the fee covers. Check the four-week cash and time alongside what learners actually complete.</p></>},{q:"Should I rent a classroom first?",a:<><p>Only after you know the learner, slot, price and setting you can serve responsibly. Check the suitability and permissions for your actual space; a paid small trial may need less commitment.</p></>},{q:"Can I count an interested learner as a paid seat?",a:<><p>Keep interest and payment separate. The worksheet is a scenario; use an actual commitment to decide whether to reserve materials and time.</p></>}]} />
    <V2PageCta className="cb-next"><div><p className="gh-eyebrow">THE NEXT SMALL PROMISE</p><h2>Offer one lesson. Keep one slot.</h2><p>Choose the blueprint closest to your skill, quote a bounded trial and write down what the learner did afterward.</p></div><div><Link to="/category/$categorySlug/$subcategorySlug" params={{categorySlug:"part-time-business-ideas",subcategorySlug:"after-office-coaching-batch-business-ideas"}}>Explore the ten coaching blueprints <ArrowUpRight size={17} aria-hidden="true"/></Link><Link to="/business-pricing-india">Set the first paid offer <ArrowUpRight size={17} aria-hidden="true"/></Link><Link to="/startup-idea-validation">Test the learner's problem <ArrowUpRight size={17} aria-hidden="true"/></Link></div></V2PageCta>
  </div></GlassShell></>;
}
