import { SellerFaq } from "@/components/v2/faq";
import { V2PageCta, V2PageFaq, V2PageHero, V2PageSection } from "@/components/v2/page-sections";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { GlassShell } from "@/components/glass-shell";
import { JsonLd, absoluteUrl, breadcrumbSchema, webPageSchema } from "@/lib/schema";
import "@/components/weekend-stall-profit.css";

const marketPath = "/weekend-market-stall-profit-check";
type Key = "sales" | "soldCost" | "writeOff" | "stallFee" | "travel" | "packaging" | "payment" | "helper";
const groups: { title: string; note: string; fields: { key: Key; label: string; hint: string }[] }[] = [
  { title: "What came in, what left the table", note: "Use actual market-day figures. Enter 0 only when a cost did not apply.", fields: [
    { key: "sales", label: "Money collected from sales", hint: "Cash and digital payments received for that day." },
    { key: "soldCost", label: "Cost of items you sold", hint: "Ingredients or purchase cost only for items actually sold." },
    { key: "writeOff", label: "Spoiled or unsellable stock", hint: "Cost of leftovers that you cannot sell later." },
  ] },
  { title: "The cost of showing up", note: "A full table can still leave little behind after these expenses.", fields: [
    { key: "stallFee", label: "Stall or event fee", hint: "Include your one-day share of a multi-day booking." },
    { key: "travel", label: "Travel, parking and loading", hint: "Count the return trip and delivery to the venue." },
    { key: "packaging", label: "Packaging and samples used", hint: "Exclude packaging already counted in the sold-item cost." },
    { key: "payment", label: "Payment or selling fees", hint: "Only fees caused by these market sales." },
    { key: "helper", label: "Paid help", hint: "Any wage paid for setup, selling or clean-up." },
  ] },
];
const initial: Record<Key,string> = {sales:"",soldCost:"",writeOff:"",stallFee:"",travel:"",packaging:"",payment:"",helper:""};
const money=(n:number)=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(n);
const val=(s:string)=>Number(s);

export const Route=createFileRoute("/weekend-market-stall-profit-check")({
  head:()=>({meta:[
    {title:"Weekend Market Stall Profit Check in India | BusinessIdea.io"},
    {name:"description",content:"A market-day worksheet for an Indian founder: subtract sold-stock cost, spoilage, stall fee, travel, packaging, payment fees and paid help from actual takings."},
    {property:"og:title",content:"Did your weekend market stall actually make money? | BusinessIdea.io"},
    {property:"og:type",content:"website"},
    {property:"og:image",content:absoluteUrl("/images/blog/realistic-part-time-business-ideas-extra-income-evening-hustles-weekend-jobs-skills.webp")},
    {name:"twitter:card",content:"summary_large_image"},
  ]}),
  component:WeekendStallProfit,
});

function WeekendStallProfit(){
  const [data,setData]=useState(initial);
  const [hours,setHours]=useState("");
  const complete=(Object.keys(initial) as Key[]).every(k=>data[k]!==""&&Number.isFinite(val(data[k]))&&val(data[k])>=0);
  const costs=(Object.keys(initial) as Key[]).filter(k=>k!=="sales").reduce((sum,k)=>sum+val(data[k]||"0"),0);
  const surplus=complete?val(data.sales)-costs:0;
  const hourly=complete&&hours!==""&&Number.isFinite(val(hours))&&val(hours)>0?surplus/val(hours):null;
  const set=(key:Key,value:string)=>setData(prev=>({...prev,[key]:value}));
  return <><JsonLd schema={[webPageSchema({path:marketPath,name:"Weekend market stall profit check in India",description:"Record one market day's takings and costs, including stock sold, spoilage, site fees, travel and paid help."}),breadcrumbSchema([{name:"Home",path:"/"},{name:"Part-time business ideas",path:"/category/part-time-business-ideas"},{name:"Market day profit check",path:marketPath}])]} />
  <GlassShell><div className="wk-page">
    <nav className="gl-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/category/$categorySlug" params={{categorySlug:"part-time-business-ideas"}}>Part-time ideas</Link><span>/</span><span>Market day check</span></nav>
    <V2PageHero className="wk-hero"><div><p className="wk-kicker">WEEKEND MARKET STALL / THE MONEY AFTER THE CROWD LEAVES</p><h1>Did your weekend stall actually make money?</h1><p>A busy table is a good feeling. It is not the answer. Record what customers paid, what you used to make those sales, and what it cost to show up.</p><a href="#market-day" className="wk-hero-link">Check one market day <ArrowUpRight size={17}/></a></div><aside aria-label="What this worksheet measures"><strong>One day. Your figures.</strong><p>This shows what remains before paying yourself, income tax and any monthly business costs. It does not forecast sales or decide whether to return.</p><Link to="/category/$categorySlug/$subcategorySlug" params={{categorySlug:"part-time-business-ideas",subcategorySlug:"weekend-market-stall-business-ideas"}}>Explore ten published stall ideas <ArrowUpRight size={16}/></Link></aside></V2PageHero>

    <V2PageSection id="market-day" className="wk-ledger" aria-labelledby="wk-ledger-heading"><div className="wk-section-intro"><p className="wk-kicker">THE MARKET-DAY LEDGER</p><h2 id="wk-ledger-heading">Write down the day you actually had.</h2><p>Use rupees, not estimates dressed as results. The calculation stays in this tab. Include only one day's costs, and never enter the same expense twice.</p></div><div className="wk-work"><div className="wk-fields">{groups.map(group=><fieldset key={group.title}><legend>{group.title}</legend><p>{group.note}</p><div className="wk-field-grid">{group.fields.map(field=><label key={field.key}><span>{field.label}</span><small>{field.hint}</small><span className="wk-input"><b aria-hidden="true">₹</b><input type="number" min="0" step="0.01" inputMode="decimal" value={data[field.key]} onChange={e=>set(field.key,e.target.value)} aria-label={field.label} placeholder="Enter amount" /></span></label>)}</div></fieldset>)}<label className="wk-hours"><span>Your total hours, if you want to see a rate</span><small>Include buying, setup, selling and the trip home.</small><span className="wk-input"><input type="number" min="0" step="0.1" inputMode="decimal" value={hours} onChange={e=>setHours(e.target.value)} placeholder="Optional hours" /></span></label></div>
    <aside className="wk-receipt" aria-live="polite"><p className="wk-kicker">YOUR ONE-DAY RECEIPT</p><div className="wk-receipt-line"><span>Takings</span><strong>{complete?money(val(data.sales)):"—"}</strong></div><div className="wk-receipt-line"><span>Costs you entered</span><strong>{complete?money(costs):"—"}</strong></div><div className="wk-receipt-total"><span>Left before your own pay, tax and other overhead</span><strong>{complete?money(surplus):"Enter every rupee field"}</strong></div>{complete&&<p>{surplus<0?"This day did not cover the costs you entered. Check the figures, then consider a smaller batch, another market or a different price.":"This day covered the costs you entered. Now account for your own time and any shared business expenses before calling it profit."}</p>}{hourly!==null&&<div className="wk-hourly"><strong>{money(hourly)} per hour</strong><small>Based on your hours, before your own pay, tax and shared overhead.</small></div>}<small className="wk-formula">Takings − items sold − spoiled stock − stall fee − travel − packaging/samples − payment fees − paid help. Blank cost fields delay the result; enter 0 where none applied.</small></aside></div></V2PageSection>

    <V2PageSection className="wk-after" aria-labelledby="wk-after-heading"><div><p className="wk-kicker">THE STOCK THAT CAME HOME</p><h2 id="wk-after-heading">Unsold is not always lost.</h2></div><div><p>If an item can be sold next week, keep its cost in your stock record rather than adding it to today's loss. That cash is still tied up. If it spoiled or can no longer be sold, include its cost in the write-off field above. This distinction matters most with food, plants and seasonal goods.</p><Link to="/startup-cash-flow-india">See when buying stock squeezes your cash <ArrowUpRight size={17}/></Link></div></V2PageSection>
    <V2PageSection className="wk-source" aria-labelledby="wk-source-heading"><figure><img src="/images/blog/realistic-part-time-business-ideas-extra-income-evening-hustles-weekend-jobs-skills.webp" width={1280} height={720} loading="lazy" alt="Original feature artwork about evening work and weekend market business ideas, fully visible" /><figcaption>Source journal artwork, shown in its full 16:9 frame.</figcaption></figure><div><p className="wk-kicker">A REAL IDEA, THEN A REAL DAY</p><h2 id="wk-source-heading">Choose what you would put on the table.</h2><p>Jewellery, snacks, books and plants have different stock risks. The published market-stall collection gives you ten concrete blueprints. Pick one, then use the ledger above to test an actual market day.</p><Link to="/category/$categorySlug/$subcategorySlug" params={{categorySlug:"part-time-business-ideas",subcategorySlug:"weekend-market-stall-business-ideas"}}>Browse weekend market stall business ideas <ArrowUpRight size={17}/></Link><Link to="/idea/$slug" params={{slug:"handmade-jewellery-weekend-stall"}}>Read the handmade jewellery stall blueprint <ArrowUpRight size={17}/></Link><Link to="/blog/$slug" params={{slug:"realistic-part-time-business-ideas"}}>Read the full part-time business article <ArrowUpRight size={17}/></Link></div></V2PageSection>
    <V2PageSection className="wk-after wk-decision" aria-labelledby="wk-decision-heading"><div><p className="wk-kicker">THE NEXT MARKET</p><h2 id="wk-decision-heading">What would you change before going back?</h2></div><div><p><strong>If customers stopped but did not buy:</strong> ask what they expected and whether the price, product or placement missed them. <Link to="/business-demand-test-india">Design a buyer test</Link>.</p><p><strong>If sales were strong but little remained:</strong> examine sold-item cost, stock loss and fees before increasing volume. <Link to="/business-pricing-india">Revisit the first price</Link>.</p><p><strong>If the day paid but consumed your week:</strong> count setup, travel and recovery before booking another. <Link to="/business-idea-time-fit">Check your time boundary</Link>.</p></div></V2PageSection>
    <SellerFaq title="Read the result carefully." faq={[{q:"Is the number my profit?",a:<><p>No. It is a one-day surplus after only the listed costs. Your own pay, tax, monthly overhead and equipment still need consideration.</p></>},{q:"Should I enter all the stock I bought today?",a:<><p>Enter the cost of what sold. Enter a write-off for stock that cannot be sold later. Keep usable leftovers in your stock and cash records; this worksheet does not track inventory.</p></>},{q:"What if I have no market-day figures yet?",a:<><p>Do not treat a guess as a result. Ask the organiser for fees, visit the market, learn typical stall rules and test a small stock batch first.</p></>}]} />
    <V2PageCta className="wk-final"><div><h2>A full table should lead to a clearer decision.</h2><p>Keep the receipt, the hours and the questions you heard. Then test one change, not five changes at once.</p></div><Link to="/category/$categorySlug/$subcategorySlug" params={{categorySlug:"part-time-business-ideas",subcategorySlug:"weekend-market-stall-business-ideas"}}>Return to the stall ideas <ArrowUpRight size={17}/></Link></V2PageCta>
    <p className="wk-source-note">Method references: <a href="https://www.extension.umd.edu/resource/how-protect-your-profit-identifying-hidden-costs-fruit-and-vegetable-marketing" target="_blank" rel="noopener noreferrer">University of Maryland Extension on hidden market costs</a> and <a href="https://extension.umd.edu/resource/determine-your-contributive-margin-setting-your-price" target="_blank" rel="noopener noreferrer">its pricing and contribution guidance</a>. These sources explain the cost categories; your own figures drive this worksheet.</p>
  </div></GlassShell></>;
}
