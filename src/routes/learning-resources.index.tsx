import { V2PageAsideCta, V2PageCard, V2PageHero, V2PageSection } from "@/components/v2/page-sections";
import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, BookOpen, Calculator, Compass, TrendingUp } from "lucide-react";
import { getBlogPosts } from "@/lib/blog.functions";
import { formatDate } from "@/lib/blog-shared";
import { hideImgIfBroken } from "@/lib/utils";
import { GlassShell } from "@/components/glass-shell";
import { PAGE_IMAGES, pageImageMeta } from "@/config/page-imagery";
import { STARTUP_GUIDES } from "@/lib/guides-data";
import { CALCULATORS } from "@/lib/calculators";
import { CASE_STUDIES } from "@/lib/case-studies-data";
import { GLOSSARY_DATA } from "@/lib/glossary-data";
import { absoluteUrl, JsonLd, breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import "@/components/glass-library.css";

const postsQuery = queryOptions({ queryKey: ["blog", "posts", 1], queryFn: () => getBlogPosts({ data: { page: 1 } }) });

export const Route = createFileRoute("/learning-resources/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  head: () => ({ meta: [
    { title: "Founder Learning Resources & Toolkit | BusinessIdea.io" },
    { name: "description", content: "Practical startup guides, calculators, founder stories, glossary terms and useful operating frameworks." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    ...pageImageMeta(PAGE_IMAGES.resources, absoluteUrl),
  ] }),
  component: LearningResourcesIndexPage,
});

const OPERATOR_FRAMEWORKS = [
  {
    name: "The Mom Test (Rob Fitzpatrick)",
    summary:
      "How to talk to customers & learn if your business is a good idea when everyone is lying to you.",
    actionable_rule:
      "Never ask someone if your idea is good. Ask about past behavior and what they currently pay to solve the friction.",
  },
  {
    name: "Sean Ellis 40% PMF Benchmark",
    summary:
      "Quantitative survey metric assessing whether product-market fit has been reached before scaling marketing spend.",
    actionable_rule:
      "Survey active users: If >40% say they would be 'very disappointed' if your product disappeared tomorrow, you have PMF.",
  },
  {
    name: "Paul Graham's Default Alive / Dead",
    summary:
      "Mental model for calculating if current growth rate and burn rate reach profitability before bank balance reaches zero.",
    actionable_rule:
      "Simulate cash balance against compound monthly revenue growth. If cash reaches $0 before revenue crosses expenses, you are Default Dead.",
  },
  {
    name: "Productized Service Staircase",
    summary:
      "How to bootstrap from customized agency hours into standardized monthly recurring packages, and finally software.",
    actionable_rule:
      "Standardize scope, turnaround time, and price. Sell the outcome rather than hourly billing to escape the time-for-money trap.",
  },
];

const RECOMMENDED_BOOKS = [
  {
    title: "The Mom Test",
    author: "Rob Fitzpatrick",
    takeaway:
      "The definitive guide on customer discovery interviews without pitching false optimism.",
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    takeaway: "Build-Measure-Learn feedback loops, MVP smoke testing, and validated learning.",
  },
  {
    title: "High Output Management",
    author: "Andy Grove",
    takeaway:
      "Managerial leverage, operational bottlenecks, and production line analogies for startups.",
  },
  {
    title: "$100M Offers",
    author: "Alex Hormozi",
    takeaway:
      "Value equation: Dream outcome × Perceived likelihood / (Time delay × Effort & sacrifice).",
  },
];

const sections = [
  { title: "Interactive calculators", body: "Test market size, costs, break-even and runway using your own numbers.", action: "Open calculators", to: "/calculator", icon: Calculator },
  { title: "Startup guides", body: "Read practical steps on validation, customer discovery, pricing and launch.", action: "Browse guides", to: "/startup-guides", icon: BookOpen },
  { title: "Founder stories", body: "Verified case studies will appear here when their numbers can be checked.", action: "Read stories", to: "/founder-stories", icon: TrendingUp },
  { title: "Founder glossary", body: "Plain-language terms and formulas for the decisions in front of you.", action: "Open glossary", to: "/founder-glossary", icon: Compass },
] as const;

function LearningResourcesIndexPage() {
  const image = PAGE_IMAGES.resources;
  const { data } = useSuspenseQuery(postsQuery);
  const featuredGuides = STARTUP_GUIDES.filter(guide => ["Validation", "Bootstrapping", "Launch & Ops"].includes(guide.category)).slice(0, 8);
  return <>
    <JsonLd schema={[
      collectionPageSchema({ path: "/learning-resources", name: "Founder learning resources", description: "Startup guides, calculators, glossary and checked case studies.", itemCount: sections.length, image: image.src }),
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Learning resources", path: "/learning-resources" }]),
    ]} />
    <GlassShell><div className="gl-page">
      <nav className="gl-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span>Learning resources</span></nav>
      <V2PageHero className="gl-hero"><div className="gl-hero-copy"><p className="gh-eyebrow">YOUR FOUNDER TOOLKIT</p><h1>One useful step <em>at a time.</em></h1><p>Use a guide to understand the work, a calculator to test your numbers, and the glossary when a term gets in the way.</p></div><figure className="gl-image-hero"><img src={image.src} alt={image.alt} width={1280} height={549} loading="eager" fetchPriority="high" /><figcaption>{image.description}</figcaption></figure></V2PageHero>
      <V2PageSection className="gl-index" aria-labelledby="resources-title"><div className="gl-section-heading"><div><p className="gh-eyebrow">CHOOSE A RESOURCE</p><h2 id="resources-title">Explore the toolkit.</h2></div></div><div className="gl-resource-grid">{sections.map(({ title, body, action, to, icon: Icon }) => <Link key={to} to={to} className="gl-resource-card"><span className="gl-resource-icon"><Icon size={24} aria-hidden="true" /></span><h3>{title}</h3><p>{body}</p><span className="gl-resource-foot">{action}<ArrowUpRight size={18} aria-hidden="true" /></span></Link>)}</div></V2PageSection>
      <V2PageSection className="gl-index gl-resource-motion" aria-labelledby="moving-resources-title">
        <style>{`@keyframes bbi-resource-guides{from{transform:translateX(0)}to{transform:translateX(-50%)}}@keyframes bbi-resource-articles{from{transform:translateX(-50%)}to{transform:translateX(0)}}.bbi-resource-track{display:flex;width:max-content;animation:bbi-resource-guides 62s linear infinite}.bbi-resource-track-reverse{display:flex;width:max-content;animation:bbi-resource-articles 68s linear infinite}.bbi-resource-window:hover .bbi-resource-track,.bbi-resource-window:focus-within .bbi-resource-track,.bbi-resource-window:hover .bbi-resource-track-reverse,.bbi-resource-window:focus-within .bbi-resource-track-reverse{animation-play-state:paused}@media(prefers-reduced-motion:reduce){.bbi-resource-track,.bbi-resource-track-reverse{animation:none!important;transform:none!important}}`}</style>
        <div className="gl-section-heading"><div><p className="gh-eyebrow">READ · APPLY · RETURN</p><h2 id="moving-resources-title">Choose a useful next read.</h2><p>Browse a guide or a published article, then take its question into your own business.</p></div></div>
        <div className="mt-6"><div className="flex items-end justify-between gap-4"><h3 className="text-xl font-bold">Business guides</h3><Link to="/startup-guides" className="gl-text-link">All guides <ArrowUpRight size={16}/></Link></div>
          <div className="bbi-resource-window mt-4 overflow-hidden"><div className="bbi-resource-track gap-4">{[...featuredGuides,...featuredGuides].map((guide,index)=><Link key={guide.slug+index} to="/startup-guides/$slug" params={{slug:guide.slug}} className="gl-resource-card w-[min(78vw,19rem)] shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="gh-eyebrow">{guide.category} · {guide.readTime}</span><h4 className="mt-3 text-lg font-bold">{guide.title}</h4><p className="mt-2 line-clamp-3 text-sm leading-6">{guide.description}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">Open guide <ArrowUpRight size={16}/></span></Link>)}</div></div>
        </div>
        <div className="mt-9"><div className="flex items-end justify-between gap-4"><h3 className="text-xl font-bold">From the founder journal</h3><Link to="/blog" className="gl-text-link">All articles <ArrowUpRight size={16}/></Link></div>
          {data.posts.length ? <div className="bbi-resource-window mt-4 overflow-hidden"><div className="bbi-resource-track-reverse gap-4">{[...data.posts,...data.posts].map((post,index)=><Link key={post.id+index} to="/blog/$slug" params={{slug:post.slug}} className="gl-resource-card flex w-[min(82vw,21rem)] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">{post.image&&<img src={post.image} alt={post.imageAlt??post.title} width={post.imageWidth??1672} height={post.imageHeight??941} loading="lazy" decoding="async" ref={hideImgIfBroken} className="aspect-video w-full object-cover"/>}<div className="p-5"><span className="gh-eyebrow">{formatDate(post.date)} · {post.readingMinutes} min read</span><h4 className="mt-3 text-lg font-bold">{post.title}</h4><p className="mt-2 line-clamp-3 text-sm leading-6">{post.excerpt}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">Read article <ArrowUpRight size={16}/></span></div></Link>)}</div></div> : <p className="mt-4 text-sm text-slate-600">Published articles will appear here.</p>}
        </div>
      </V2PageSection>
      <V2PageSection className="gl-index" aria-labelledby="frameworks-title"><div className="gl-section-heading"><div><p className="gh-eyebrow">IDEAS TO APPLY</p><h2 id="frameworks-title">Operating frameworks.</h2><p>Use these as prompts, then check the details for your own business.</p></div></div><div className="gl-resource-grid">{OPERATOR_FRAMEWORKS.map((item) => <V2PageCard className="gl-resource-card" key={item.name}><h3>{item.name}</h3><p>{item.summary}</p><p><strong>Try this:</strong> {item.actionable_rule}</p></V2PageCard>)}</div></V2PageSection>
      <V2PageSection className="gl-index" aria-labelledby="reading-title"><div className="gl-section-heading"><div><p className="gh-eyebrow">FURTHER READING</p><h2 id="reading-title">Books to explore.</h2></div></div><div className="gl-resource-grid">{RECOMMENDED_BOOKS.map((book) => <V2PageCard className="gl-resource-card" key={book.title}><p className="gh-eyebrow">{book.author}</p><h3>{book.title}</h3><p>{book.takeaway}</p></V2PageCard>)}</div></V2PageSection>
      <V2PageAsideCta className="gl-bottom-note"><div><p className="gh-eyebrow">PUT IT INTO PRACTICE</p><h2>Find one idea to test.</h2><p>Explore the library and start with a small check of local demand.</p></div><Link to="/browse" className="gh-button gh-button-primary">Browse ideas <ArrowUpRight size={18} /></Link></V2PageAsideCta>
    </div></GlassShell>
  </>;
}
