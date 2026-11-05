import { V2PageAsideCta, V2PageCard, V2PageFaq, V2PageHero, V2PageSection } from "@/components/v2/page-sections";
import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";

import { GlassShell } from "@/components/glass-shell";
import { formatDate } from "@/lib/blog-shared";
import { getBlogPosts } from "@/lib/blog.functions";
import { hideImgIfBroken } from "@/lib/utils";
import "@/components/glass-library.css";
import "@/components/journal-reading-room.css";

const postsQuery = queryOptions({ queryKey: ["blog", "posts", 1], queryFn: () => getBlogPosts({ data: { page: 1 } }) });

export const Route = createFileRoute("/blog/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  head: () => ({ meta: [
    { title: "Founder Journal: Business Ideas and First Moves in India | BusinessIdea.io" },
    { name: "description", content: "Read original articles on first customers, side businesses, pricing and local business ideas in India, with the published featured imagery." },
    { property: "og:type", content: "website" },
  ] }),
  component: BlogIndex,
  errorComponent: () => <GlassShell><div className="gl-page gl-message"><h1>The articles could not load.</h1><p>Please try again in a moment.</p><Link to="/">Return home</Link></div></GlassShell>,
});

function BlogIndex() {
  const { data } = useSuspenseQuery(postsQuery);
  const featured=data.posts.find(post=>post.slug==="find-first-paying-customer-without-ads" && post.image) ?? data.posts.find(post=>post.image);
  const routes=[
    {slug:"find-first-paying-customer-without-ads",label:"The first paying customer",question:"Who has this problem today?",step:"Observe a real buying attempt, not just interest."},
    {slug:"realistic-part-time-business-ideas",label:"A start after work",question:"What can fit my actual week?",step:"Count energy, travel and delivery hours."},
    {slug:"realistic-small-town-business-ideas",label:"A small-town start",question:"What repeats near me?",step:"Watch the existing alternatives in your catchment."},
    {slug:"how-to-price-a-side-hustle-with-no-customers",label:"The first price",question:"What can I charge honestly?",step:"Quote the real scope and count every cost."},
  ].map(path=>({...path,post:data.posts.find(post=>post.slug===path.slug)})).filter(path=>Boolean(path.post));
  return <GlassShell><div className="gl-page jr-page">
    <nav className="gl-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span>Blog</span></nav>
    <V2PageHero className="jr-hero"><div><p className="gh-eyebrow">THE FOUNDER JOURNAL · INDIA</p><h1>Someone else has asked your question too.</h1><p>A collection of published business idea articles for the person trying to start in the middle of ordinary life: work hours, a real town, limited cash, and the need for a first customer.</p><a href="#journal-paths" className="gh-button gh-button-primary">Choose a starting question <ArrowUpRight size={17}/></a></div>{featured && <Link to="/blog/$slug" params={{slug:featured.slug}} className="jr-feature">{featured.image && <img src={featured.image} alt={featured.imageAlt ?? featured.title} width={featured.imageWidth ?? 1672} height={featured.imageHeight ?? 941} ref={hideImgIfBroken}/>}<span><small>EDITOR'S START / {formatDate(featured.date)}</small><strong>{featured.title}</strong><span>Open the original article <ArrowUpRight size={16}/></span></span></Link>}</V2PageHero>
    <V2PageFaq className="jr-questions" id="journal-paths" aria-labelledby="jr-questions-title"><div><p className="gh-eyebrow">01 / OPEN THE RIGHT DOOR</p><h2 id="jr-questions-title">What are you deciding today?</h2><p>Follow the question that belongs to your situation. Each path opens an actual published article, then gives you a small action to take into your own market.</p></div><div className="jr-question-grid">{routes.map((path,index)=><article key={path.slug}><span>0{index+1} / {path.label}</span><h3>{path.question}</h3><p>{path.step}</p><Link to="/blog/$slug" params={{slug:path.slug}}>Read {path.post!.title} <ArrowUpRight size={16}/></Link></article>)}</div></V2PageFaq>
    <V2PageSection className="jr-evidence" aria-labelledby="jr-evidence-title"><div><p className="gh-eyebrow">02 / A BETTER WAY TO READ</p><h2 id="jr-evidence-title">An article is a starting conversation.</h2><p>Read an example, then go outside the page. Ask whether the buyer, cash requirement and first test still make sense in your area. A popular list cannot know your commute or your customer.</p><Link to="/business-idea-reading-room" className="gh-text-link">Read a source guide beside this journal <ArrowUpRight size={17}/></Link></div><div><div><strong>Underline the condition</strong><span>Who would this idea fit, and what must be true?</span></div><div><strong>Find the counterexample</strong><span>Where would it be expensive, slow or hard to deliver?</span></div><div><strong>Try a small promise</strong><span>Can you ask a real buyer to commit to a defined offer?</span></div></div></V2PageSection>
    <V2PageSection className="gl-index jr-index" aria-labelledby="articles-heading"><div className="gl-section-heading"><div><p className="gh-eyebrow">03 / ALL PUBLISHED ARTICLES</p><h2 id="articles-heading">Browse the original journal.</h2><p>All published posts on this page keep their source URLs, article bodies and featured images. Start anywhere; take one useful question with you.</p></div></div>{data.posts.length ? <div className="gl-guide-grid gl-blog-grid">{data.posts.map((post, index) => <V2PageCard key={post.id} className={index === 0 ? "gl-guide-card gl-feature-article" : "gl-guide-card"}>
      {post.image && <Link to="/blog/$slug" params={{ slug: post.slug }} className="gl-guide-media" tabIndex={-1}><img src={post.image} alt={post.imageAlt ?? post.title} width={post.imageWidth ?? 1672} height={post.imageHeight ?? 941} loading="lazy" decoding="async" ref={hideImgIfBroken} /></Link>}
      <span className="gh-eyebrow">{formatDate(post.date)} · {post.readingMinutes} min read</span><h3><Link to="/blog/$slug" params={{ slug: post.slug }}>{post.title}</Link></h3><p>{post.excerpt}</p><Link to="/blog/$slug" params={{ slug: post.slug }} className="gl-idea-action">Read article <ArrowUpRight size={17} /></Link></V2PageCard>)}</div> : <div className="gl-empty"><h3>No posts published yet.</h3><p>Explore the guides while the journal fills up.</p><Link to="/startup-guides">Read the guides</Link></div>}</V2PageSection>
    <V2PageSection className="jr-after" aria-labelledby="jr-after-title"><div><p className="gh-eyebrow">04 / AFTER THE READING</p><h2 id="jr-after-title">Turn the idea into a decision.</h2><p>When a story sounds possible, compare it with your actual cash, operating model and a buyer who can say yes or no.</p></div><div><Link to="/startup-costs-india"><strong>Can I fund the first sale?</strong><span>Open the rupee cost ledger <ArrowUpRight size={16}/></span></Link><Link to="/startup-idea-validation"><strong>Will someone commit?</strong><span>Work through a buyer test <ArrowUpRight size={16}/></span></Link><Link to="/blueprints"><strong>What else is published?</strong><span>Browse completed idea blueprints <ArrowUpRight size={16}/></span></Link></div></V2PageSection>
    <V2PageAsideCta className="gl-bottom-note"><div><p className="gh-eyebrow">KEEP EXPLORING</p><h2>Find a practical direction.</h2><p>The category map is a good place to turn a broad question into a focused path.</p></div><Link to="/browse" className="gh-button gh-button-primary">Explore ideas <ArrowUpRight size={17} /></Link></V2PageAsideCta>
  </div></GlassShell>;
}
