import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { formatDate } from "@/lib/blog-shared";
import { getBlogPosts } from "@/lib/blog.functions";
import { useStaggerReveal, useTextReveal } from "@/motion";

const postsQuery = queryOptions({
  queryKey: ["blog", "posts", 1],
  queryFn: () => getBlogPosts({ data: { page: 1 } }),
});

export const Route = createFileRoute("/blog/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  head: () => ({
    meta: [
      { title: "Blog — Founder Playbooks | BBI" },
      {
        name: "description",
        content:
          "Long-form founder playbooks and market breakdowns from BBI — real research, no filler.",
      },
      { property: "og:title", content: "Blog — Founder Playbooks | BBI" },
      {
        property: "og:description",
        content: "Long-form founder playbooks and market breakdowns from BBI.",
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
          We couldn&apos;t reach the blog just now. Nothing here is cached or faked — try again in a
          moment.
        </p>
      </div>
    </SiteShell>
  ),
});

function BlogIndex() {
  const { data } = useSuspenseQuery(postsQuery);
  // One headline reveal per page, on the H1, and one stagger on the post grid.
  const titleRef = useTextReveal<HTMLHeadingElement>();
  const gridRef = useStaggerReveal<HTMLDivElement>({ direction: "up", stagger: 0.05 });

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-3 py-12 sm:px-4">
        {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Blog" }]} />
        <h1 ref={titleRef} className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Founder{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-warm bg-clip-text text-transparent">
            playbooks
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Long-form writing on markets, founders and what actually works — a different shelf from
          the idea library, held to the same standard: real research, no filler.
        </p>

        {data.posts.length === 0 ? (
          <p className="mt-12 text-muted-foreground">No posts published yet.</p>
        ) : (
          <div ref={gridRef} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.posts.map((post, i) => {
              // The most recent post reads as a genuine feature, not just the
              // first tile in an identical grid (brief 12.7 — no repetitive
              // same-size card walls).
              const featured = i === 0 && data.posts.length > 2;
              return (
                <Link
                  key={post.id}
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className={`glass mo-card flex h-full flex-col overflow-hidden rounded-2xl ${
                    featured ? "sm:col-span-2 lg:col-span-2" : ""
                  }`}
                >
                  {post.image && (
                    // The card already clips its own corners, so the media slot
                    // is square-cornered on purpose — a second radius here
                    // would notch the image away from the card edge.
                    <div
                      style={{ borderRadius: 0 }}
                      className={`mo-media relative w-full ${featured ? "aspect-[21/9]" : "aspect-video"}`}
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover opacity-90"
                      />
                      {/* Gradient scrim so text over/near the image always stays
                          legible and the photo never looks like a raw drop-in
                          (brief 12.8). */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-background/0 to-transparent" />
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
                    <h2
                      className={`font-semibold leading-snug ${featured ? "text-2xl" : "text-lg"}`}
                    >
                      {post.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                    <span className="mt-auto pt-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      Read article →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        {/* EDITABLE SECTION END */}
      </div>
    </SiteShell>
  );
}
