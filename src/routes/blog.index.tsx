import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { formatDate } from "@/lib/blog-shared";
import { getBlogPosts } from "@/lib/blog.functions";

const postsQuery = queryOptions({
  queryKey: ["blog", "posts", 1],
  queryFn: () => getBlogPosts({ data: { page: 1 } }),
});

export const Route = createFileRoute("/blog/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  head: () => ({
    meta: [
      { title: "Blog — Founder Playbooks | IdeaVault AI" },
      {
        name: "description",
        content:
          "Long-form founder playbooks and market breakdowns, published from our editorial CMS and rendered natively inside IdeaVault AI.",
      },
      { property: "og:title", content: "Blog — Founder Playbooks | IdeaVault AI" },
      {
        property: "og:description",
        content: "Long-form founder playbooks and market breakdowns from IdeaVault AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogIndex,
  errorComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-24">
        <h1 className="text-2xl font-bold">The blog feed is unavailable</h1>
        <p className="mt-2 text-muted-foreground">
          The connected WordPress instance did not respond. Nothing is cached or faked here.
        </p>
      </div>
    </SiteShell>
  ),
});

function BlogIndex() {
  const { data } = useSuspenseQuery(postsQuery);

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-3 py-12 sm:px-4">
        {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Blog" }]} />
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Founder{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-warm bg-clip-text text-transparent">
            playbooks
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Long-form articles published from our editorial CMS, rendered in IdeaVault's own design
          system. The idea library and the blog stay separate systems.
        </p>

        {data.posts.length === 0 ? (
          <p className="mt-12 text-muted-foreground">No posts published yet.</p>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.posts.map((post) => (
              <Link
                key={post.id}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="glass glass-hover group flex h-full flex-col overflow-hidden rounded-2xl"
              >
                {post.image && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-90 transition-transform duration-700 ease-glass group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-3 p-5 pb-7">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-accent">
                    <span>{formatDate(post.date)}</span>
                    <span aria-hidden className="text-muted-foreground">
                      ·
                    </span>
                    <span className="text-muted-foreground">{post.readingMinutes} min read</span>
                  </div>
                  <h2 className="text-lg font-semibold leading-snug">{post.title}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                  <span className="mt-auto pt-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Read article →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
        {/* EDITABLE SECTION END */}
      </div>
    </SiteShell>
  );
}
