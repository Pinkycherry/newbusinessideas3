import { V2PageAsideCta, V2PageCard, V2PageHero, V2PageSection } from "@/components/v2/page-sections";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, Clock } from "lucide-react";

import { GlassShell } from "@/components/glass-shell";
import { ReadingPaths, readingPathsFor } from "@/components/reading-paths";
import { ReaderCompanion } from "@/components/reader-companion";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/schema";
import { getBlogPost } from "@/lib/blog.functions";
import { formatDate } from "@/lib/blog-shared";
import { canonicalUrl, CO_FOUNDER, FOUNDER, founderProfile } from "@/lib/site-config";
import { hideImgIfBroken } from "@/lib/utils";
import "@/components/glass-library.css";

const postQuery = (slug: string) => queryOptions({
  queryKey: ["blog", "post", slug],
  queryFn: () => getBlogPost({ data: { slug } }),
});

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [
      { title: "Article not found | BusinessIdea.io" },
      { name: "robots", content: "noindex" },
    ] };
    const { post } = loaderData;
    const title = `${post.title} | BusinessIdea.io`;
    return { meta: [
      { title }, { name: "description", content: post.excerpt },
      { property: "og:title", content: title },
      { property: "og:description", content: post.excerpt },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(post.image ? [
        { property: "og:image", content: post.image.startsWith("/") ? canonicalUrl(post.image) : post.image },
        { name: "twitter:image", content: post.image.startsWith("/") ? canonicalUrl(post.image) : post.image },
        ...(post.imageAlt ? [
          { property: "og:image:alt", content: post.imageAlt },
          { name: "twitter:image:alt", content: post.imageAlt },
        ] : []),
      ] : []),
    ] };
  },
  component: BlogArticle,
  notFoundComponent: () => <GlassShell><div className="gl-page gl-message"><h1>We could not find that article.</h1><Link to="/blog">All articles</Link></div></GlassShell>,
  errorComponent: () => <GlassShell><div className="gl-page gl-message"><h1>This article could not load.</h1><Link to="/blog">All articles</Link></div></GlassShell>,
});

function BlogArticle() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(postQuery(slug));
  if (!data) return null;
  const { post, related } = data;
  const sections = Array.from(post.html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi), (match, index) => ({
    id: `article-section-${index + 1}`,
    label: match[1].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").trim(),
  }));
  let headingNumber = 0;
  const anchoredHtml = post.html.replace(/<h2[^>]*>/gi, (tag) => `<span id="article-section-${++headingNumber}" class="gl-section-anchor"></span>${tag}`);
  const middleId = sections.length > 1 ? sections[Math.floor(sections.length / 2)].id : "";
  const breakAt = middleId ? anchoredHtml.indexOf(`<span id="${middleId}"`) : anchoredHtml.length;
  return <>
    <JsonLd schema={[
      articleSchema({
        path: `/blog/${post.slug}`, headline: post.title, description: post.excerpt,
        datePublished: post.date, categoryName: post.categories[0] ?? "Founder notes",
        ...(post.image ? { image: post.image } : {}),
      }),
      breadcrumbSchema([
        { name: "Home", path: "/" }, { name: "Blog", path: "/blog" },
        { name: post.title, path: `/blog/${post.slug}` },
      ]),
    ]} />
    <GlassShell><div className="gl-page gl-article-page gl-blog-article">
      <nav className="gl-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/blog">Blog</Link><span>/</span><span>{post.title}</span></nav>
      <article>
        <V2PageHero className="gl-article-hero">
          <p className="gh-eyebrow">{formatDate(post.date)} · <Clock size={15} aria-hidden="true" /> {post.readingMinutes} min read{post.categories[0] ? ` · ${post.categories[0]}` : ""}</p>
          <h1>{post.title}</h1><p>{post.excerpt}</p>
          <div className="gl-article-byline">Written by <Link to="/founders" hash={founderProfile(FOUNDER.name).slug}>{FOUNDER.name}</Link> · Reviewed by <Link to="/founders" hash={founderProfile(CO_FOUNDER.name).slug}>{CO_FOUNDER.name}</Link></div>
        </V2PageHero>
        {post.image && <figure className="gl-featured-figure">
          <img src={post.image} alt={post.imageAlt ?? post.title} width={post.imageWidth ?? 1672} height={post.imageHeight ?? 941} loading="eager" fetchPriority="high" decoding="async" ref={hideImgIfBroken} />
          {post.imageCaption && <figcaption>{post.imageCaption}</figcaption>}
        </figure>}
        <div className="gl-reading-layout">
          <div className="gl-reading-main">
            <div className="gl-prose" dangerouslySetInnerHTML={{ __html: anchoredHtml.slice(0, breakAt) }} />
            <ReadingPaths topic={post.slug} />
            {breakAt < anchoredHtml.length && <div className="gl-prose" dangerouslySetInnerHTML={{ __html: anchoredHtml.slice(breakAt) }} />}
          </div>
          <ReaderCompanion sections={sections} label="Article sections" topic={post.slug} />
        </div>
      </article>
      <p className="gl-reading-room-link"><Link to="/business-idea-reading-room">Pair this story with a source startup guide <ArrowUpRight size={17}/></Link></p>
      {related.length > 0 && <V2PageSection className="gl-related-articles" aria-labelledby="more-articles">
        <p className="gh-eyebrow">KEEP READING</p><h2 id="more-articles">More from the journal.</h2>
        <div className="gl-guide-grid">{related.map((item) => <V2PageCard key={item.id} className="gl-guide-card">
          {item.image && <Link to="/blog/$slug" params={{ slug: item.slug }} className="gl-guide-media" tabIndex={-1}><img src={item.image} alt={item.imageAlt ?? item.title} width={item.imageWidth ?? 1672} height={item.imageHeight ?? 941} loading="lazy" decoding="async" ref={hideImgIfBroken} /></Link>}
          <span className="gh-eyebrow">{formatDate(item.date)}</span>
          <h3><Link to="/blog/$slug" params={{ slug: item.slug }}>{item.title}</Link></h3>
          <p>{item.excerpt}</p>
          <Link to="/blog/$slug" params={{ slug: item.slug }} className="gl-idea-action">Read article <ArrowUpRight size={17} /></Link>
        </V2PageCard>)}</div>
      </V2PageSection>}
      <V2PageAsideCta className="gl-bottom-note"><div><p className="gh-eyebrow">TAKE THIS OFF THE PAGE</p><h2>{readingPathsFor(post.slug).question}</h2><p>{readingPathsFor(post.slug).intro}</p></div><Link to={readingPathsFor(post.slug).links[0].to as "/"} className="gh-button gh-button-primary">{readingPathsFor(post.slug).links[0].title} <ArrowUpRight size={17} /></Link></V2PageAsideCta>
    </div></GlassShell>
  </>;
}
