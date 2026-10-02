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
import { useEffect, useRef, useState, type ReactNode } from "react";

import "../styles.css";
import "../motion.css";
import "../components/idea-cinema/cinema.css";
import { PointerChannelProvider, PageTransition } from "../motion";
import { catalogQuery } from "../lib/ideas.functions";
import { getPageResources } from "../lib/resources.functions";
import { JsonLd, organisationSchema } from "@/lib/schema";
import { canonicalUrl, siteIndexable } from "../lib/site-config";

/**
 * The 404 and error screens render outside every route's SiteShell, so they
 * carry the plain system's scope classes themselves and use its button and
 * link classes (components/idea-cinema/cinema.css). Plain words, a way back, no art.
 */
function StatusScreen({
  code,
  title,
  body,
  children,
}: {
  code?: string;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <div className="bbi-instrument cm-page cm-status">
      <main className="cm-status-card">
        <p className="cm-status-brand">
          <a href="/">BBI</a>
          <span aria-hidden="true"> · </span>Bro Business Ideas
        </p>
        {code && <p className="cm-status-code">{code}</p>}
        <h1 className="cm-status-title text-3xl">{title}</h1>
        <p className="cm-status-body">{body}</p>
        <div className="cm-status-actions">{children}</div>
      </main>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <StatusScreen
      code="Error 404"
      title="This page does not exist"
      body="The link may be old, or the page was moved. Every idea in the library is still one search away."
    >
      <Link to="/browse" className="cm-btn cm-btn-primary bbi-bare">
        Browse the library
      </Link>
      <Link to="/search" className="cm-btn cm-btn-secondary bbi-bare">
        Search ideas
      </Link>
      <Link to="/" className="cm-trace-link">
        Home
      </Link>
    </StatusScreen>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <StatusScreen
      title="This page did not load"
      body="Something went wrong on our side. Trying again usually fixes it; if not, the home page will."
    >
      <button
        type="button"
        onClick={() => {
          router.invalidate();
          reset();
        }}
        className="cm-btn cm-btn-primary bbi-bare"
      >
        Try again
      </button>
      <a href="/" className="cm-btn cm-btn-secondary bbi-bare">
        Go home
      </a>
    </StatusScreen>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  /**
   * The catalogue the header and footer read, AND the resource picks the
   * block above the footer renders on every page.
   *
   * The resources live here rather than in each route's own loader because
   * they belong to the SHELL now, not to one template — the founder asked
   * for them on every page but Home and the policy pages. Loading them once
   * at the root is one fetch per page load instead of one per route file,
   * and it means a route added tomorrow gets the block with no wiring.
   *
   * It has to be a LOADER and not a query: the guide, glossary and blog
   * picks are drawn fresh per request, and a query would re-draw them in the
   * browser and disagree with the markup the server already sent.
   *
   * Shape change: this used to return the catalogue itself. `useCatalog()`
   * in site-shell.tsx is the only reader and is updated in the same commit.
   */
  loader: async ({ context }) => {
    const [catalog, resources] = await Promise.all([
      context.queryClient.ensureQueryData(catalogQuery),
      getPageResources(),
    ]);
    return { catalog, resources };
  },
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
      {
        name: "google-site-verification",
        content: "kXhdOEXdve4shh_6FDlSuuKk09fdqO-6Bf_a5CAuXDc",
      },
      // Pinterest site claim.
      { name: "p:domain_verify", content: "f4222cd7b4f9129e5bc3ae50b54ffc62" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      /* The homepage, interior shell and India Atlas use Poppins, declared
         with @font-face in styles.css. Keep their first-screen weights
         preloaded without requesting the retired IBM font families. */
      ...FONT_PRELOADS.map((href) => ({
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href,
        crossOrigin: "anonymous" as const,
      })),
      /* The .ico carries 16 through 256 so the tab strip, the bookmark bar
         and Windows each get a bitmap made for their size rather than one
         downscaled on the fly. The PNGs are sized in multiples of 48, which
         is what Google Search wants for the icon beside a result. Their
         file names are new on purpose: Google kept showing the old site-builder
         heart from its cache, and a URL it has never fetched is one it has
         to fetch fresh. Keep these names stable from here on. */
      { rel: "icon", href: "/images/brob-favicon-192.png", type: "image/png", sizes: "192x192" },
      { rel: "icon", href: "/images/brob-favicon-48.png", type: "image/png", sizes: "48x48" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "apple-touch-icon", href: "/images/apple-touch-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/site.webmanifest" },
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

/** The blog's body-portalled sticky CTA still inherits Geist. Other route
 * content uses Poppins and does not need this additional stylesheet. */
const FONT_CSS =
  "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&display=swap";

function FontStylesheet() {
  const needsGeist = useRouterState({
    select: (state) => /^\/blog\/[^/]+\/?$/.test(state.location.pathname),
  });
  const stylesheetRef = useRef<HTMLLinkElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stylesheet = stylesheetRef.current;
    if (!needsGeist || !stylesheet) return;
    const apply = () => setLoaded(true);
    stylesheet.addEventListener("load", apply);
    // A cached sheet can finish before hydration. React owns the media
    // change after this effect, so the server and first client render agree.
    if (stylesheet.sheet) apply();
    return () => stylesheet.removeEventListener("load", apply);
  }, [needsGeist]);

  if (!needsGeist) return null;
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        ref={stylesheetRef}
        id="bbi-fonts"
        rel="stylesheet"
        href={FONT_CSS}
        media={loaded ? "all" : "print"}
      />
      <noscript>
        <link rel="stylesheet" href={FONT_CSS} />
      </noscript>
    </>
  );
}

/** Poppins 400 and 600: body text and headings on the first screen. */
const FONT_PRELOADS = [
  "https://fonts.gstatic.com/s/poppins/v24/pxiEyp8kv8JHgFVrJJfecg.woff2",
  "https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2",
];

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <HeadContent />
        <FontStylesheet />
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
      {/* Publishes --ptr-x/y/v and --scroll-v on :root. Only the homepage
          reads them now: SiteShell suspends the channel on every page that
          runs the plain site system (components/site-stage.ts). */}
      <PointerChannelProvider />
      {/* Desktop-only custom pointer; refuses to run on touch or reduced motion. */}
      {/* The sitewide heading reveal is OFF, 2026-09-22, at the founder's
          request: every h1/h2/h3 on the site is static.

          `<SiteTextMotion />` used to mount here and toggle `.revealed` on
          every heading as it crossed the viewport. Not rendering it is the
          whole removal — the hidden state in styles.css is gated behind
          `html.bbi-motion`, a class only that component ever added, so with
          it gone nothing is ever hidden and every heading simply renders.
          That is the component's own documented no-JS failure mode, which
          is why switching it off this way cannot leave text stuck at
          opacity 0.

          `site-text-motion.tsx` and its stylesheet rules are left on disk
          untouched, so restoring this is re-adding the import and the one
          element below — nothing else.

          It is the second of the two heading effects to go. The first was
          the GSAP SplitText headline reveal in use-text-reveal.ts, switched
          off for breaking layout on any heading that wrapped to two lines. */}
      <PageTransition>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </PageTransition>
    </QueryClientProvider>
  );
}
