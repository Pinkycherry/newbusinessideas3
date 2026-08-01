import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { formatDate } from "@/lib/blog-shared";
import { getBlogPost } from "@/lib/blog.functions";

const postQuery = (slug: string) =>
  queryOptions({ queryKey: ["blog", "post", slug], queryFn: () => getBlogPost({ data: { slug } }) });

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article not found | IdeaVault AI" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    const title = `${post.title} | IdeaVault AI`;
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
        <p>That article does not exist on the connected blog.</p>
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
  if (!data) return null;
  const { post, related } = data;

  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-3 py-12 sm:px-4">
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Blog", to: "/blog" }, { label: post.title }]}
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

        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="mt-8 w-full rounded-3xl border border-border object-cover"
          />
        )}

        <div
          className="wp-prose glass mt-8 rounded-3xl px-5 py-8 sm:px-8"
          // Content comes from our own CMS and is sanitized server-side
          // (scripts, iframes, inline handlers and theme classes stripped).
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              More reading
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="glass glass-hover rounded-2xl p-4"
                >
                  <p className="text-sm font-semibold leading-snug">{r.title}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{formatDate(r.date)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </SiteShell>
  );
}