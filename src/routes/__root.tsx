import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import "../styles.css";
import "../motion.css";
import { PointerChannelProvider, PageTransition } from "../motion";
import { SiteTextMotion } from "@/components/site-text-motion";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { catalogQuery } from "../lib/ideas.functions";
import { JsonLd, organisationSchema } from "@/lib/schema";
import { canonicalUrl, siteIndexable } from "../lib/site-config";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BBI — Bro Business Ideas | Researched Business Idea Blueprints" },
      {
        name: "description",
        content:
          "Researched business idea blueprints with market context, trend scores and honest founder-fit verdicts.",
      },
      { name: "author", content: "BBI — Bro Business Ideas" },
      { property: "og:title", content: "BBI — Bro Business Ideas" },
      {
        property: "og:description",
        content: "Researched business idea blueprints with market context and trend scores.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Sans+Condensed:wght@600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Geist:wght@400;500;600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

/**
 * One canonical tag for the whole site.
 *
 * Before this, exactly one route out of thirty-two declared a canonical. Every
 * other page type — the homepage, categories, the blog, all sixty calculators,
 * the guides, the glossary, founder stories — declared none, so the preview
 * deployments and every host serving this repo each published a full,
 * unattributed copy of the site.
 *
 * It lives in the root rather than in each route because React 19 hoists a
 * `link` element rendered anywhere in the tree into `head`, on the server as
 * well as in the browser. One component therefore covers every route that
 * exists and every route added later — which a per-route tag cannot promise,
 * and is exactly how thirty-one of them came to be missing.
 */
function CanonicalLink() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return <link rel="canonical" href={canonicalUrl(pathname)} />;
}

/**
 * The staging guard, rendered next to the canonical for the same reason: React
 * 19 hoists it into `head` from anywhere in the tree, so ONE component covers
 * all thirty-two routes and every route added later.
 *
 * Emitted only when `SITE_INDEXABLE=false`, which is how a deployment of this
 * exact code becomes un-indexable without a branch, a build flag or a content
 * change. Nothing else in the tree needs to know.
 */
function RobotsMeta() {
  if (siteIndexable()) return null;
  return <meta name="robots" content="noindex,nofollow" />;
}

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <HeadContent />
        <CanonicalLink />
        <RobotsMeta />
        {/* The publishing entity, declared once for the whole site rather than
            per route. Every page already said what it was about; none said who
            stands behind it, which is the E-E-A-T signal that was missing. */}
        <JsonLd schema={organisationSchema()} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Publishes --ptr-x/y/v and --scroll-v on :root for the whole site.
          Renders no DOM of its own and holds no React state. */}
      <PointerChannelProvider />
      {/* Desktop-only custom pointer; refuses to run on touch or reduced motion. */}
      {/* Wave word-reveal on every heading, and anything with data-wave. */}
      <SiteTextMotion />
      <PageTransition>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </PageTransition>
    </QueryClientProvider>
  );
}
