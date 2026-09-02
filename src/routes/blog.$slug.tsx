import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { AdSlot } from "@/components/AdSlot";
import { formatDate } from "@/lib/blog-shared";
import { getBlogPost } from "@/lib/blog.functions";
import { useStaggerReveal, useTextReveal } from "@/motion";

/**
 * The sanitizer strips every class attribute off the stored article, so the
 * inline links arrive bare. Tagging them here is how they join the motion
 * system without the markup being restructured or the sanitizer relaxed.
 */
function withLinkMotion(html: string): string {
  return html.replace(/<a(?=[\s>])/gi, '<a class="mo-link"');
}

const postQuery = (slug: string) =>
  queryOptions({
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
    if (!loaderData) {
      return {
        meta: [{ title: "Article not found | BBI" }, { name: "robots", content: "noindex" }],
      };
    }
    const { post } = loaderData;
    const title = `${post.title} | BBI`;
    return {
      meta: [
        { title },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(post.image
          ? [
              { property: "og:image", content: post.image },
              { name: "twitter:image", content: post.image },
            ]
          : []),
      ],
    };
  },
  component: BlogPostPage,
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-24">
        <p>That article doesn&apos;t exist — it may have been moved or taken down.</p>
        <Link to="/blog" className="mt-4 inline-block text-primary underline">
          Back to the blog
        </Link>
      </div>
    </SiteShell>
  ),
  errorComponent: () => (
    <SiteShell>
      <p className="mx-auto max-w-6xl px-4 py-24">This article could not be loaded.</p>
    </SiteShell>
  ),
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(postQuery(slug));
  const titleRef = useTextReveal<HTMLHeadingElement>();
  const relatedRef = useStaggerReveal<HTMLDivElement>({ direction: "up", stagger: 0.05 });
  if (!data) return null;
  const { post, related } = data;
  // Split the sanitized article so ad slots can sit after the first
  // paragraph and at the mid-article point.
  const blocks = withLinkMotion(post.html).split(/(?<=<\/p>)/);
  const firstBlock = blocks.slice(0, 1).join("");
  const midIndex = Math.max(1, Math.ceil(blocks.length / 2));
  const secondBlock = blocks.slice(1, midIndex).join("");
  const thirdBlock = blocks.slice(midIndex).join("");

  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-3 py-12 sm:px-4">
        {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
        {/* Reading progress lives in SiteShell (site-shell.tsx — the rail
            under the header, driven by the same --page-p). A second rail
            here would render two bars a few pixels apart at the top of the
            article, so this page reads the shell's rather than shipping its
            own. If the rail is ever made exclusive to long-form, it moves
            out of the shell and back in here. */}
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Blog", to: "/blog" },
            { label: post.title },
          ]}
        />

        <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-accent">
          <span>{formatDate(post.date)}</span>
          <span className="text-muted-foreground">{post.readingMinutes} min read</span>
          {post.categories.map((c) => (
            <span key={c} className="glass rounded-full px-3 py-1 text-muted-foreground">
              {c}
            </span>
          ))}
        </div>

        <h1
          ref={titleRef}
          className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
        >
          {post.title}
        </h1>

        {post.image && (
          // Keeps the page's own corner radius — the media slot supplies the
          // clip and the scale, not a new shape.
          <div
            style={{ borderRadius: "var(--radius-3xl)" }}
            className="mo-media relative mt-8 aspect-video w-full border border-border"
          >
            <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
            {/* Subtle corner wash so the photo reads as art-directed, not a
                raw drop-in (brief 12.8). */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/45 via-transparent to-transparent" />
          </div>
        )}

        {/* Content comes from our own CMS and is sanitized server-side
            (scripts, iframes, inline handlers and theme classes stripped). */}
        <div className="wp-prose glass mt-8 rounded-3xl px-5 py-8 sm:px-8">
          <div dangerouslySetInnerHTML={{ __html: firstBlock }} />
          <AdSlot position="blog-post-after-first-paragraph" size="banner" className="my-6" />
          <div dangerouslySetInnerHTML={{ __html: secondBlock }} />
          <AdSlot position="blog-post-mid-article" size="rectangle" className="my-6" />
          <div dangerouslySetInnerHTML={{ __html: thirdBlock }} />
        </div>

        <AdSlot position="blog-post-after-last-paragraph" size="banner" className="mt-8" />

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              More reading
            </h2>
            <div ref={relatedRef} className="mt-4 grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="glass mo-card rounded-2xl p-4"
                >
                  <p className="text-sm font-semibold leading-snug">{r.title}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{formatDate(r.date)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
        {/* EDITABLE SECTION END */}
      </article>
    </SiteShell>
  );
}
