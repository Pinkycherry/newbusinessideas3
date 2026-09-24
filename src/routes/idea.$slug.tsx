import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import ShareLinks from "@/components/effects/share-links";
import CardSpotlight from "@/components/aceternity/card-spotlight";
import { queryOptions } from "@tanstack/react-query";
// Five icons, down from ten. Sparkles/Compass/LayoutGrid/Calculator/TrendingUp
// belonged to `KeepExploringRail`, which ResourceHub replaced at the foot of
// this page; leaving the imports behind would keep pulling them into the
// idea-page chunk for nothing.
import { Lock, Lightbulb, Users, Wallet, Shield, type LucideIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import { IdeaCard } from "@/components/idea-card";
import { ValidateButton } from "@/components/validate-button";
import { FOUNDER, founderProfile } from "@/lib/site-config";
import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { AdSlot } from "@/components/AdSlot";
import { categoryImage } from "@/config/category-imagery";
import {
  getIdeaBySlug,
  type IdeaVariant,
  type IdeaGradient,
  type RelatedCategory,
} from "@/lib/ideas.functions";
import {
  type IdeaCard as IdeaCardType,
  type IdeaDetail,
  type InternalLink,
} from "@/lib/ideas-shared";
import { toParagraphs } from "@/lib/prose";
import { JsonLd, absoluteUrl, articleSchema, breadcrumbSchema } from "@/lib/schema";
import { hideImgIfBroken } from "@/lib/utils";
import {
  Odometer,
  useDepthScene,
  useElementPointerGroup,
  useScrollProgress,
  useStaggerReveal,
  useTextReveal,
} from "@/motion";

type IdeaDetailData = {
  idea: IdeaDetail;
  related: IdeaCardType[];
  relatedCategories: RelatedCategory[];
  trending: IdeaCardType[];
  variant: IdeaVariant;
  gradient: IdeaGradient;
} | null;

type ContextualLink = { key: string; label: string; to: string; params: Record<string, string> };

/**
 * PROJECT_BRIEF.md Section 8.2 / Build Order step 11 — up to 3 automatic,
 * keyword-matched internal links per page, prioritizing hub-style pages
 * (subcategory, then category) over distant matches. Reuses data already
 * loaded for this page (no extra Supabase round-trip): the idea's own
 * keywords/tags are scanned against the `related` list already fetched for
 * the sidebar/bottom cards to find one genuinely on-topic idea link.
 */
function pickContextualLinks(idea: IdeaDetail, related: IdeaCardType[]): ContextualLink[] {
  const links: ContextualLink[] = [
    {
      key: "subcategory",
      label: idea.subcategoryName,
      to: "/category/$categorySlug/$subcategorySlug",
      params: { categorySlug: idea.categorySlug, subcategorySlug: idea.subcategorySlug },
    },
    {
      key: "category",
      label: idea.categoryName,
      to: "/category/$categorySlug",
      params: { categorySlug: idea.categorySlug },
    },
  ];

  const keywordPool = [...idea.keywords, ...idea.tags]
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);
  const match = keywordPool.length
    ? related.find((r) => {
        const haystack = `${r.title} ${r.summary} ${r.tags.join(" ")}`.toLowerCase();
        return keywordPool.some((k) => haystack.includes(k));
      })
    : undefined;

  if (match) {
    links.push({
      key: match.ideaId,
      label: match.title,
      to: "/idea/$slug",
      params: { slug: match.slug },
    });
  }

  return links.slice(0, 3);
}

/**
 * A fourth, friend-to-friend section — separate from the 3 curated
 * InternalLink slots (those wait on hand-written per-idea Supabase copy,
 * paused for now per the founder). This one is fully automatic: it reuses
 * 2 distinct ideas from the `related`/`trending` pools already fetched for
 * this page, so it needs zero manual data entry and works on every idea
 * page today.
 */
function pickFriendTalkLinks(
  idea: IdeaDetail,
  related: IdeaCardType[],
  trending: IdeaCardType[],
): IdeaCardType[] {
  const seen = new Set<string>([idea.slug]);
  const picks: IdeaCardType[] = [];
  for (const candidate of [...related, ...trending]) {
    if (seen.has(candidate.slug)) continue;
    seen.add(candidate.slug);
    picks.push(candidate);
    if (picks.length === 2) break;
  }
  return picks;
}

const ideaDetailQuery = (slug: string) =>
  queryOptions<IdeaDetailData>({
    queryKey: ["idea-detail", slug],
    // Used only inside the route loader's ensureQueryData call below, purely
    // as a typed fetch-and-return helper — the component reads the result via
    // Route.useLoaderData(), not via useSuspenseQuery, so these cache settings
    // no longer affect what's rendered (see the note on IdeaPage's data line
    // for why: router.tsx doesn't dehydrate the QueryClient to the client, so
    // a client-side useSuspenseQuery on this query would re-run it — a real
    // problem for Section 9's per-request-random variant/gradient/related
    // picks, since two independent calls return different results).
    staleTime: 0,
    gcTime: 60_000,
    queryFn: async () => {
      const result = await getIdeaBySlug({ data: { slug } });
      if (!result?.idea) return null;
      return result;
    },
  });

export const Route = createFileRoute("/idea/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(ideaDetailQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const idea = loaderData?.idea;
    // Prefer the researched SEO fields when the pipeline has filled them;
    // fall back to the previous behaviour for un-enriched ideas.
    const title = idea
      ? idea.seoTitle || `${idea.title} | BBI – Bro Business Ideas`
      : "Business Idea | BBI – Bro Business Ideas";
    const description =
      idea?.metaDescription ||
      idea?.businessDescription?.slice(0, 155) ||
      "A researched business idea blueprint with pros, cons and a founder-fit verdict.";
    // No idea has a photo of its own — this page had no share image at all
    // before. The category's featured image fills that gap: every idea in
    // "AI & Automation" sharing one thematic image for its link preview is
    // the same pattern a blog's tag pages use, not duplicate content, and it
    // beats the blank preview this page rendered until now.
    const image = idea ? categoryImage(idea.categorySlug) : null;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image
          ? [
              { property: "og:image", content: absoluteUrl(image.src) },
              { property: "og:image:alt", content: image.alt },
              { name: "twitter:image", content: absoluteUrl(image.src) },
            ]
          : []),
      ],
    };
  },
  component: IdeaPage,
  errorComponent: () => (
    <SiteShell tone="instrument">
      <p className="mx-auto max-w-6xl px-4 py-24">This idea could not be loaded.</p>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell tone="instrument">
      <div className="mx-auto max-w-6xl px-4 py-24">
        <p>That idea does not exist in the library.</p>
        <Link to="/browse" className="mt-4 inline-block text-primary underline">
          Browse all ideas
        </Link>
      </div>
    </SiteShell>
  ),
});

/**
 * Section 6.1 item 3 — the demand/trend indicator.
 *
 * It has exactly one input: `ideas.trend_score`, the idea's own real column.
 * The gauge fills to that value and no further, and scroll is what moves it —
 * `useScrollProgress` publishes `--sc-p` on this section and the fill's
 * `scaleX` is the product of the real score and that playhead. So it is alive
 * because the reader is moving, not because a timer is running.
 *
 * What used to be here, and is deliberately not coming back: a twelve-bar
 * "sparkline" whose heights were `Math.sin(i * 0.9) + Math.cos(i * 0.5)`
 * layered over the score. That is a fabricated time series — this site has had
 * to strip invented figures three times and a sine-wave demand tracker was one
 * of them. There is no per-period demand history in the schema, so there is no
 * chart. One real number, honestly drawn.
 *
 * Transform only: the fill scales, its box never changes size. The old
 * `.demand-gauge-fill` rule animated `width` instead, which MOTION_SPEC rule
 * 8 forbids; it has been deleted from styles.css along with the bar chart.
 */
function DemandBlock({ score }: { score: number | null }) {
  const sectionRef = useScrollProgress<HTMLElement>();
  if (score === null) return null;
  const pct = Math.max(0, Math.min(100, score));
  const band = pct >= 85 ? "Strong momentum" : pct >= 70 ? "Steady demand" : "Niche, but real";
  return (
    <section
      ref={sectionRef}
      data-anchor="demand"
      data-anchor-label="Demand"
      className="mt-10 rounded-lg border border-border bg-card p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className={SECTION_HEADING}>Demand signal</h2>
        <span className="text-sm font-semibold uppercase tracking-widest text-hl-teal">{band}</span>
      </div>
      <div
        className="demand-gauge-track mt-4"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Trend score"
      >
        {/* Resting state with no JavaScript, and under reduced motion, is the
            settled one: --sc-p falls back to 1 and the fill sits at the real
            score rather than at zero. */}
        <div
          className="h-full w-full origin-left rounded-full bg-hl-teal"
          style={{
            transform: `scaleX(calc(${(pct / 100).toFixed(4)} * clamp(0, calc(var(--sc-p, 1) * 1.6), 1)))`,
          }}
        />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Trend score {pct} of 100, based on current demand signals for this specific micro-niche
        rather than its broader category.
      </p>
    </section>
  );
}

/**
 * The blueprint's real pros/cons/verdict, computed state advancing while the
 * reader scrolls past it: pros and cons are both visible from the start
 * (nothing here is hidden to force a reveal), the verdict crossfades in as
 * `--sc-p` passes its threshold. No invented copy — every word is the idea's
 * own `pros`/`cons`/`verdict` data.
 *
 * This used to run `useScrollProgress({ mode: "pinned", spanVh: 1.6 })` —
 * holding the viewport for 1.6 screen-heights so the crossfade had scroll
 * distance to play out against. Live, that reserved far more scroll than
 * this panel's actual (short) height ever used, so the pin held, the
 * crossfade finished almost immediately, and the reader kept scrolling
 * through 2000px+ of nothing before the next section arrived. `"unpinned"`
 * drives the same `--sc-p` custom property off the section's own natural
 * position instead (0 as it enters the viewport, 1 as it leaves) — same
 * crossfade, zero reserved dead space, page keeps its real length.
 */
function ComputedVerdictPanel({ idea }: { idea: IdeaDetail }) {
  const stageRef = useScrollProgress<HTMLElement>({ mode: "unpinned" });

  return (
    <section
      ref={stageRef}
      data-anchor="verdict"
      data-anchor-label="Verdict"
      className="mt-10 flex min-h-[1px] flex-col justify-center rounded-lg border border-border bg-card p-5 sm:p-7"
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(19rem,1fr))] gap-4">
        <div>
          <h2 className="text-base font-semibold uppercase tracking-[0.14em] text-hl-green sm:text-lg">
            Why it works
          </h2>
          <ul className="mt-4 space-y-4 text-[1.0625rem] leading-[1.75]">
            {idea.pros.map((pro) => (
              <li key={pro} className="flex gap-2">
                <span aria-hidden className="text-hl-green">
                  +
                </span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-base font-semibold uppercase tracking-[0.14em] text-hl-coral sm:text-lg">
            What will hurt
          </h2>
          <ul className="mt-4 space-y-4 text-[1.0625rem] leading-[1.75]">
            {idea.cons.map((con) => (
              <li key={con} className="flex gap-2">
                <span aria-hidden className="text-hl-coral">
                  −
                </span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {idea.verdict && (
        <div
          className="mt-6 border-t border-primary/30 pt-5"
          style={{
            opacity: "clamp(0, calc((var(--sc-p, 1) - 0.55) * 4), 1)",
            transform:
              "translateY(calc((1 - clamp(0, calc((var(--sc-p, 1) - 0.55) * 4), 1)) * 10px))",
          }}
        >
          <h2 className="text-base font-semibold uppercase tracking-[0.14em] text-primary sm:text-lg">
            Verdict
          </h2>
          <p className={`mt-3 ${BODY_PROSE}`}>{idea.verdict}</p>
        </div>
      )}
    </section>
  );
}

type BlueprintEntry = {
  title: string;
  body: string | null | undefined;
  Icon: LucideIcon;
  /** A CSS custom-property name already defined in styles.css, e.g. "--hl-teal". */
  tint: string;
};

/**
 * The four "Blueprint" fields (opportunity / who pays / how the money works /
 * your edge), styled as an alternating left-right stack -- the layout the
 * founder pasted a reference for. The reference used a stock photo on one
 * side of each row; these four are plain text fields with no image attached
 * to any of them, so a big themed icon stands in for the photo instead of a
 * random unrelated stock shot. Colors come from the site's own hl- and
 * primary tokens (never the reference's raw red-100/blue-100/etc.) so this reads as
 * part of the same design system as everything else on the page.
 */
function BlueprintCards({ entries }: { entries: BlueprintEntry[] }) {
  const items = entries.filter((entry): entry is BlueprintEntry & { body: string } =>
    Boolean(entry.body),
  );
  // Reveals the four rows one at a time top-to-bottom on the way down, and
  // fades them back out on the way up (useStaggerReveal's own both-directions
  // behaviour, per the founder's overruled decision in its own file comment)
  // instead of all four appearing at once.
  const rowsRef = useStaggerReveal<HTMLDivElement>({
    selector: ".blueprint-row",
    stagger: 0.08,
    distance: 16,
  });
  if (items.length === 0) return null;

  return (
    <div ref={rowsRef} className="mt-6 grid gap-6">
      {items.map((item, i) => {
        const Icon = item.Icon;
        const reversed = i % 2 === 1;
        return (
          <div
            key={item.title}
            className={`blueprint-row flex flex-col overflow-hidden rounded-3xl border border-border md:flex-row${
              reversed ? " md:flex-row-reverse" : ""
            }`}
          >
            <div
              aria-hidden
              // `md:max-w-sm` added 2026-09-19: this panel's width was a bare
              // percentage (`md:w-2/5`) of the card, which itself now spans
              // the article's new, much wider max-width -- on a large screen
              // that turned into a huge flat color field around one small
              // centered icon, exactly the "90% empty space" the founder
              // flagged. Capping the panel's own width keeps it a fixed,
              // reasonable size at any container width. The big faded icon
              // behind the crisp one fills the panel with texture instead of
              // just enlarging the icon itself, which would have looked
              // like a mistake rather than a design choice.
              className="relative flex shrink-0 items-center justify-center overflow-hidden p-10 md:w-2/5 md:max-w-sm"
              style={{
                background: `color-mix(in oklab, var(${item.tint}) 16%, var(--card))`,
              }}
            >
              <Icon
                className="absolute h-40 w-40 -rotate-12 sm:h-56 sm:w-56"
                style={{ color: `var(${item.tint})`, opacity: 0.12 }}
                strokeWidth={1}
              />
              <Icon
                className="relative h-16 w-16 sm:h-20 sm:w-20"
                style={{ color: `var(${item.tint})` }}
                strokeWidth={1.25}
              />
            </div>
            <div className="glass flex flex-1 flex-col justify-center gap-3 p-8 sm:p-10">
              <span
                className="w-fit rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: `var(${item.tint})`,
                  background: `color-mix(in oklab, var(${item.tint}) 14%, transparent)`,
                }}
              >
                0{i + 1}
              </span>
              <h3 className="text-2xl font-bold text-foreground sm:text-3xl">{item.title}</h3>
              <div className="space-y-4 text-[1.0625rem] leading-[1.75] text-muted-foreground">
                {toParagraphs(item.body).map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * One inline internal link, as a natural sentence rather than a card or a
 * bolted-on "related" rail. `link.anchor` must be an exact substring of
 * `link.sentence` (enforced by toObjectList's picker in ideas-shared.ts) —
 * that phrase becomes the link, the rest stays plain text. Saffron/yellow
 * styling lives in styles.css under `.bbi-inline-link`, the one deliberate
 * exception to this page's five-value greyscale rule.
 */
function InternalLinkLine({ link }: { link: InternalLink | undefined }) {
  if (!link) return null;
  const i = link.sentence.indexOf(link.anchor);
  if (i === -1) return null;
  const before = link.sentence.slice(0, i);
  const after = link.sentence.slice(i + link.anchor.length);
  return (
    <p className={`mt-5 ${BODY_PROSE}`}>
      {before}
      <Link to="/idea/$slug" params={{ slug: link.slug }} className="bbi-inline-link">
        {link.anchor}
      </Link>
      {after}
    </p>
  );
}

/**
 * The "friend talking to a friend" section: plain Indian-English, motivating,
 * not a corporate recommendation block. Two inline links woven into two
 * short sentences, styled the same saffron/yellow as the other inline links.
 */
function FriendTalkSection({ picks }: { picks: IdeaCardType[] }) {
  if (picks.length < 2) return null;
  const first = picks[0]!;
  const second = picks[1]!;
  return (
    <section className="mt-10 rounded-lg border border-border bg-card p-5">
      <h2 className={SECTION_HEADING}>One more thing, from us to you</h2>
      <div className={`mt-4 space-y-4 ${BODY_PROSE}`}>
        <p>
          Arre listen na, don't just read this and close the tab, that's exactly how most people
          stay stuck forever. If this idea is speaking to you, go have a quick look at{" "}
          <Link to="/idea/$slug" params={{ slug: first.slug }} className="bbi-inline-link">
            {first.title}
          </Link>{" "}
          also, same hustle energy, and honestly it might suit your situation even better than this
          one.
        </p>
        <p>
          And if budget is the only thing stopping you right now, no tension yaar,{" "}
          <Link to="/idea/$slug" params={{ slug: second.slug }} className="bbi-inline-link">
            {second.title}
          </Link>{" "}
          is the smaller, easier cousin of this idea, perfect to start small and grow slowly. Bottom
          line: just start, keep learning as you go, nobody ever became an expert by sitting around
          and overthinking.
        </p>
      </div>
    </section>
  );
}

/** A plain prose block that renders only when the field has content. */
function RichSection({ title, body }: { title: string; body: string }) {
  if (!body) return null;
  return (
    <section className="mt-10">
      <h2 className={SECTION_HEADING}>{title}</h2>
      <div className={`mt-4 space-y-5 ${BODY_PROSE}`}>
        {toParagraphs(body).map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

/**
 * PROJECT_BRIEF.md Section 3.3 (2026-09-16) — the FOMO model. These panels
 * are never unlocked on our own page, for anyone, at any tier: not by
 * signing in, not by paying. The real researched content still renders in
 * the DOM underneath the blur — this is a visual tease, not cloaking, and a
 * search crawler reads the same real text a human can't make out — a CSS
 * filter is the only thing between a reader and it. The only way to
 * actually read it is the Validate button below: paying unlocks that
 * button, which sends this exact content, server-side, into the reader's
 * own chosen LLM. It is never unblurred here.
 */
// TEMPORARY — founder asked to see every section unblurred while reviewing
// layout and content gaps against Supabase. Flip back to `true` to restore
// the permanent lock from PROJECT_BRIEF.md Section 3.3. Nothing else about
// LockedSection changes: same sections, same structure, blur switched off.
const LOCK_ENABLED = false;

/**
 * The page's type scale, declared once.
 *
 * Every section heading on this template was `text-sm` (14px) uppercase and
 * every body block was the browser's 16px default with `leading-relaxed` —
 * the founder's word for the result was "totally worse", and he is right:
 * a research page that people read end to end on a phone was set smaller
 * than the navigation above it. Headings step up to 16/18px, body to
 * 17/18px with an 1.8 line height, and both live here rather than being
 * typed into thirty separate className strings where they drift apart.
 *
 * Literal class names, never interpolated: Tailwind generates utilities by
 * scanning source text, so a class assembled at runtime is never compiled.
 * These constants are safe because the literal strings themselves appear
 * here, in a file Tailwind scans.
 *
 * The headings that carry a colour of their own — "Why it works" (hl-green),
 * "What will hurt" (hl-coral), "Verdict" (primary), and the two Real Numbers
 * cards — deliberately do NOT use `SECTION_HEADING`. Each is that same scale
 * with one token swapped, and folding the colour in would mean either five
 * near-identical constants or a runtime-built class Tailwind never compiles.
 * They are written out in place, at the same size and tracking as this one;
 * changing the scale means changing them too.
 */
const SECTION_HEADING =
  "text-base font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-lg";
const BODY_PROSE = "text-[1.0625rem] leading-[1.8] sm:text-lg";
const CARD_PROSE = "text-[1.0625rem] leading-[1.75]";

/**
 * The signature that closes every blueprint.
 *
 * One name now, not four lines. The founder asked for the block trimmed to
 * the person who is actually accountable for the page, and that is the one
 * claim worth making: he researches and signs off every blueprint.
 *
 * The name is a link, and it is the SAME destination the page's JSON-LD
 * author already resolves to (`personUrl()` in schema.tsx) — a byline whose
 * visible link and machine-readable `author.url` disagree is a worse signal
 * than either alone. `FOUNDER.name` and the profile both come from
 * site-config, so the name here can never drift from the name on /founders.
 */
function IdeaSignature() {
  const profile = founderProfile(FOUNDER.name);
  return (
    <section className="mt-12 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground motion-safe:animate-none">
      <p>
        Researched and signed off by{" "}
        <Link
          to="/founders"
          hash={profile.slug}
          className="font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
        >
          {FOUNDER.name}
        </Link>
        .
      </p>
    </section>
  );
}

function LockedSection({
  title,
  anchorId,
  anchorLabel,
  children,
}: {
  title: string;
  anchorId: string;
  anchorLabel: string;
  children: ReactNode;
}) {
  return (
    <section className="relative mt-10" data-anchor={anchorId} data-anchor-label={anchorLabel}>
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent sm:text-sm">
        Premium research
      </p>
      <h2 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      <div className="relative mt-4">
        <div
          aria-hidden={LOCK_ENABLED}
          className={LOCK_ENABLED ? "pointer-events-none select-none blur-sm" : undefined}
        >
          {children}
        </div>
        {LOCK_ENABLED && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/70 px-4 text-center">
            <Lock className="h-5 w-5 text-accent" aria-hidden />
            <p className="text-sm font-semibold">This is what the Validate button unlocks</p>
            <a
              href="#validate"
              className="text-xs font-semibold uppercase tracking-widest text-primary underline decoration-border underline-offset-4 hover:text-accent"
            >
              See how to unlock it ↓
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

function IdeaPage() {
  // Reads the router's own loaderData rather than re-running the query via
  // useSuspenseQuery. router.tsx creates a fresh, empty QueryClient on both
  // server and client with no dehydration between them, so a client-side
  // useSuspenseQuery here doesn't read cached SSR data — it genuinely
  // re-invokes getIdeaBySlug from the browser on first render. For most
  // queries that's merely a wasted round trip; for this one, whose random
  // variant/gradient/related picks are recomputed server-side per call
  // (Section 9's "nothing static" rule), the two independent calls return
  // different results and React flags a real hydration mismatch — reproduced
  // via Playwright and confirmed before this fix. TanStack Router's own
  // loaderData transport does not have this problem: it serializes the
  // loader's single server-computed result to the client once.
  // Non-null by construction: the loader throws notFound() when the query
  // returns null, so this component never renders without data.
  const data = Route.useLoaderData() as NonNullable<IdeaDetailData>;
  // MOTION_SPEC §2.3 — the page's single headline reveal, on the idea title.
  const titleRef = useTextReveal<HTMLHeadingElement>();
  // One delegated pointer listener per rail rather than one per card.
  const relatedRailRef = useElementPointerGroup<HTMLUListElement>("a");
  const trendingRailRef = useElementPointerGroup<HTMLUListElement>("a");
  // The blueprint masthead is a depth scene: the title plane and the sidebar
  // plane sit at different depths, so the page has somewhere to stand rather
  // than reading as one flat column of panels.
  const mastheadRef = useDepthScene<HTMLDivElement>({ strength: 0.5, weight: 0.14 });
  if (!data) return null;
  const { idea, related, relatedCategories, trending, variant, gradient } = data;

  const showSidebarList = related.length > 3;
  // The aside's only real content. When it is empty the grid drops to one
  // column rather than reserving a gutter for nothing.
  const hasSidebar = showSidebarList;
  const sidebarRelated = showSidebarList ? related.slice(0, 3) : [];
  const bottomRelated = showSidebarList ? related.slice(3, 6) : related;
  const contextualLinks = pickContextualLinks(idea, related);
  const [subcategoryLink, categoryLink, matchedIdeaLink] = contextualLinks;
  const linkForPosition = (position: InternalLink["position"]) =>
    idea.internalLinkAnchors.find((l) => l.position === position);
  // PULLED 2026-09-24 (see PENDING): related/trending are ORDER BY random()
  // at the DB level, re-rolled on every page load, with zero topical or
  // tone filtering. That produced real, live, bad pairings -- e.g. this
  // page recommending "Part Time Obituary Writing Business for Families
  // With No Words Left" in the cheerful "no tension yaar" voice. It also
  // directly contradicted the founder's original instruction: internal
  // links must not be random. Off until it's rebuilt on a real match
  // (shared category/tags/keywords, same as pickContextualLinks already
  // does) with sensitive-topic exclusion and dedup against the other two
  // link systems on this page.
  const friendTalkPicks: IdeaCardType[] = [];

  // Section 6.1 item 5 — 5 FAQs above the additional content, 5 below.
  const faqAbove = idea.faq.slice(0, 5);
  const faqBelow = idea.faq.slice(5, 10);

  const ideaPath = `/idea/${idea.slug}`;
  const categoryFeatured = categoryImage(idea.categorySlug);
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Browse", path: "/browse" },
    { name: idea.categoryName, path: `/category/${idea.categorySlug}` },
    {
      name: idea.subcategoryName,
      path: `/category/${idea.categorySlug}/${idea.subcategorySlug}`,
    },
    { name: idea.title, path: ideaPath },
  ];

  return (
    <>
      <JsonLd
        schema={[
          articleSchema({
            path: ideaPath,
            headline: idea.title,
            description: idea.businessDescription || idea.summary,
            datePublished: idea.createdAt,
            categoryName: idea.categoryName,
            image: categoryFeatured.src,
          }),
          breadcrumbSchema(breadcrumbItems),
        ]}
      />
      <SiteShell tone="instrument">
        <div
          ref={mastheadRef}
          // Was `max-w-6xl` -- the same cap the header's own nav card
          // carries, which sat this whole article flush inside those same
          // narrow edges. Dropping the cap to `w-full` (no bound at all) was
          // the wrong fix: on anything wider than a laptop it stretched the
          // hero's own fixed-ratio grid columns and the "More in category" /
          // "Trending" stack-lists across the entire monitor, and none of
          // that inner content was ever designed to scale past a normal
          // reading width -- confirmed live on a 3840px display as acres of
          // dead black space with a sliver of actual content pinned to the
          // left edge. `max-w-[100rem]` (1600px) is comfortably wider than
          // the header's 1152px pill -- the page no longer looks "stuck" next
          // to it -- while still bounded enough that every fixed-ratio grid
          // and card list inside this article stays a sane, filled-in width
          // instead of stretching into empty space on wide and ultra-wide
          // monitors alike.
          /* max-w-6xl, matching the header and the other thirty-six pages.
             This was max-w-[100rem] — 1600px against a 1152px header — so the
             article started well left of the wordmark above it on any wide
             screen, and the large lg/xl/2xl paddings existed only to tame that
             box. The second column is conditional now: it holds an ad slot
             that renders nothing until ad code is configured, and a related
             list that only appears when there are more than three, so most
             ideas were reserving 20rem of empty gutter and pushing the article
             a further 10rem off centre. */
          className={`cx-scene mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 ${
            hasSidebar ? "lg:grid-cols-[minmax(0,1fr)_20rem]" : ""
          } ${
            // TRIAL 2026-09-24 (see styles.css "TRIAL: smoother card
            // geometry"): rounder corners + saffron hover-lift on this one
            // page's cards only, so the founder can compare against
            // reference screenshots before deciding whether to roll it out.
            // Removing this ternary reverts the page instantly.
            idea.slug === "part-time-podcast-guest-pitch-writing-business" ? "bbi-card-smooth" : ""
          }`}
        >
          {/* No `cx-layer` here on purpose: the sticky right-column aside
              below is a `position: sticky` element, and a `transform` on any
              ancestor of a sticky element breaks its stickiness (it stops
              tracking scroll and renders wherever it first computed,
              disconnected from its matching content). The pointer-parallax
              this cost was imperceptible anyway -- its scroll term only fires
              when something sets `--sc-p` on this element, which nothing
              here does. */}
          <article className="idea-shell min-w-0" data-variant={variant} data-gradient={gradient}>
            {/* EDITABLE SECTION START — safe to add, remove, or reorder sections below without breaking routing or data fetching. */}
            <Breadcrumbs
              items={[
                { label: "Home", to: "/" },
                { label: "Browse", to: "/browse" },
                {
                  label: idea.categoryName,
                  to: "/category/$categorySlug",
                  params: { categorySlug: idea.categorySlug },
                },
                {
                  label: idea.subcategoryName,
                  to: "/category/$categorySlug/$subcategorySlug",
                  params: {
                    categorySlug: idea.categorySlug,
                    subcategorySlug: idea.subcategorySlug,
                  },
                },
              ]}
            />

            {/* Section 6.1 item 1 — hero, built as a Live Surface status bar rather
                than a marketing banner: the blueprint's own computed state,
                already in view, no separate title treatment or CTA pill layered
                on top of it (uniqueness.md §2.3 bans marketing chrome here — the
                "validate" action lives at the page's actual close instead). The
                wrapper classes let the chosen layout variant genuinely restructure
                this block (see styles.css). */}
            <div className="idea-hero mt-5" data-anchor="top" data-anchor-label="Top">
              <div className="min-w-0">
                <div className="idea-hero-meta flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest">
                  <span className="rounded-sm bg-secondary px-2 py-1 font-mono text-secondary-foreground">
                    {idea.ideaId}
                  </span>
                  {/* The category's own featured image, small, riding along
                      next to its name -- the same image the category page
                      runs as a full hero. Decorative here (the text right
                      next to it already names the category), so alt is
                      empty rather than repeating that description across
                      every idea in the category: the full alt text already
                      does its SEO job once, on the category page itself. */}
                  <span className="mo-media relative h-6 w-6 shrink-0 overflow-hidden rounded-full border border-border">
                    <img
                      ref={hideImgIfBroken}
                      src={categoryFeatured.src}
                      alt=""
                      aria-hidden="true"
                      width={24}
                      height={24}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </span>
                  <span className="text-accent">{idea.categoryName}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground">{idea.subcategoryName}</span>
                </div>

                <h1
                  ref={titleRef}
                  className="mt-3 text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
                >
                  {idea.title}
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  {idea.businessDescription}
                </p>

                <div className="mt-5">
                  {/* Deterministic on server and client (pure function of the
                      known idea path) — the previous `window.location.href`
                      branch rendered "" server-side and the real URL
                      client-side, a guaranteed hydration mismatch on every
                      idea page. React answering that mismatch by re-rendering
                      the subtree is what silently stripped the `.revealed`
                      class SiteTextMotion had already added to headings
                      already in view at load, leaving them stuck invisible. */}
                  <ShareLinks url={absoluteUrl(ideaPath)} title={idea.title} />
                </div>
              </div>

              {/* A real telemetry readout, not a decorative visual: the idea's
                  own trend_score, already computed, with the verdict's status
                  read alongside it. */}
              <div className="idea-hero-aside">
                <div className="glass rounded-2xl p-5">
                  <dl className="sc-spec-label !text-[10px]">
                    <div className="w-full">
                      <dt>Momentum</dt>
                      <dd className="!ml-0 block">
                        {idea.trendScore !== null ? (
                          <Odometer
                            value={idea.trendScore}
                            duration={1.2}
                            className="font-mono text-4xl font-bold leading-none tabular-nums text-foreground"
                          />
                        ) : (
                          <span className="font-mono text-4xl font-bold leading-none tabular-nums text-foreground">
                            —
                          </span>
                        )}
                        <span className="ml-1 text-xs text-muted-foreground">/ 100</span>
                      </dd>
                    </div>
                  </dl>
                  {idea.keywords.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {idea.keywords.slice(0, 3).map((k) => (
                        <span
                          key={k}
                          className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* The free teaser. Anyone, signed in or not, reads this.

                `summary` is stored as one unbroken run of text — no row of
                the 409 contains a newline — so this used to render as a
                twenty-four sentence wall in a single <p>. `toParagraphs`
                breaks it into 5-to-8-sentence paragraphs at render time
                (src/lib/prose.ts holds the rule); nothing is added, removed
                or reordered, and nothing is written back to Supabase. */}
            <section className="mt-10" data-anchor="breakdown" data-anchor-label="Breakdown">
              <h2 className={SECTION_HEADING}>The breakdown</h2>
              <div className={`mt-4 space-y-5 ${BODY_PROSE}`}>
                {toParagraphs(idea.summary).map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
              <InternalLinkLine link={linkForPosition("breakdown")} />
            </section>

            {/* PROJECT_BRIEF.md Section 3.3 — three panels, always locked,
                for everyone, at every tier. See LockedSection's own comment
                for why. Each wraps an existing, unmodified component/block
                so ComputedVerdictPanel's scroll-linked crossfade doesn't need
                to change shape.

                The four fields below used to render through StickyScroll (a
                left-list + right-sticky-plate layout). Founder asked for
                these four specifically in an alternating left/right "team
                member" card style instead -- see BlueprintCards above. */}
            <LockedSection title="The Blueprint" anchorId="blueprint" anchorLabel="The Blueprint">
              <BlueprintCards
                entries={[
                  {
                    title: "The opportunity",
                    body: idea.marketOpportunity,
                    Icon: Lightbulb,
                    tint: "--hl-teal",
                  },
                  {
                    title: "Who actually pays you",
                    body: idea.targetCustomer,
                    Icon: Users,
                    tint: "--hl-coral",
                  },
                  {
                    title: "How the money works",
                    body: idea.howYouMakeMoney,
                    Icon: Wallet,
                    tint: "--primary",
                  },
                  {
                    title: "Your edge",
                    body: idea.competitionEdge,
                    Icon: Shield,
                    tint: "--hl-green",
                  },
                ]}
              />
              <ComputedVerdictPanel idea={idea} />
            </LockedSection>

            <div className="mt-8">
              <AdSlot position="idea-detail-between-proscons-verdict" size="banner" />
            </div>

            <LockedSection title="Real Numbers" anchorId="numbers" anchorLabel="Real Numbers">
              {idea.startupCost || idea.incomePotential ? (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(19rem,1fr))] gap-4">
                  {idea.startupCost && (
                    <CardSpotlight className="p-5">
                      <h2 className="text-base font-semibold uppercase tracking-[0.14em] text-hl-coral sm:text-lg">
                        What it costs to start
                      </h2>
                      <p className={`mt-3 ${CARD_PROSE}`}>{idea.startupCost}</p>
                    </CardSpotlight>
                  )}
                  {idea.incomePotential && (
                    <CardSpotlight className="p-5">
                      <h2 className="text-base font-semibold uppercase tracking-[0.14em] text-hl-green sm:text-lg">
                        What you can earn
                      </h2>
                      <p className={`mt-3 ${CARD_PROSE}`}>{idea.incomePotential}</p>
                    </CardSpotlight>
                  )}
                </div>
              ) : (
                <p className={CARD_PROSE}>
                  The real-numbers research for this idea is still in progress.
                </p>
              )}
            </LockedSection>

            {/* All three of these can be empty at once: the pipeline's generic
                steps, tools and timeline are stripped in toIdeaDetail, because
                356 of 409 rows held the same ones byte-for-byte. Without this
                guard the section would render as a heading over nothing. */}
            {idea.gettingStartedSteps.length > 0 ||
            idea.toolsNeeded.length > 0 ||
            idea.timeToFirstCustomer ? (
              <LockedSection
                title="Tactical Playbooks"
                anchorId="playbooks"
                anchorLabel="Tactical Playbooks"
              >
                {idea.gettingStartedSteps.length > 0 && (
                  <div>
                    <h2 className={SECTION_HEADING}>How to start</h2>
                    <ol className="mt-4 space-y-3">
                      {idea.gettingStartedSteps.map((step, i) => (
                        <li key={step} className="flex gap-3 text-[1.0625rem] leading-[1.75]">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {idea.toolsNeeded.length > 0 && (
                  <div className="mt-8">
                    <h2 className={SECTION_HEADING}>What you need</h2>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {idea.toolsNeeded.map((tool) => (
                        <li
                          key={tool}
                          className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground"
                        >
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {idea.timeToFirstCustomer && (
                  <div className="mt-8">
                    <h2 className={SECTION_HEADING}>Time to first customer</h2>
                    <p className={`mt-3 whitespace-pre-line ${BODY_PROSE}`}>
                      {idea.timeToFirstCustomer}
                    </p>
                  </div>
                )}
              </LockedSection>
            ) : null}

            {/* Outside the LockedSection on purpose: a real navigational
                link should never sit behind the blur treatment, even
                though LOCK_ENABLED is currently false. */}
            <InternalLinkLine link={linkForPosition("playbooks")} />

            {/* FAQ and citations are not part of the locked research — they
                stay free, same as the teaser above. */}
            {faqAbove.length > 0 && (
              <section className="mt-10">
                <h2 className={SECTION_HEADING}>Questions people ask</h2>
                <div className="mt-4 space-y-3">
                  {faqAbove.map((item) => (
                    <details
                      key={item.q}
                      className="rounded-lg border border-border bg-card p-4 text-base"
                    >
                      <summary className="cursor-pointer text-[1.0625rem] font-semibold">
                        {item.q}
                      </summary>
                      <p className="mt-2.5 text-[1.0625rem] leading-[1.75] text-muted-foreground">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {idea.externalLinks.length > 0 && (
              <section className="mt-10">
                <h2 className={SECTION_HEADING}>Useful resources</h2>
                <ul className="mt-3 space-y-2 text-base">
                  {idea.externalLinks.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="nofollow noopener"
                        className="font-semibold text-primary underline decoration-border underline-offset-4 hover:text-accent"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-8">
              <AdSlot position="idea-detail-below-verdict" size="banner" />
            </div>

            <DemandBlock score={idea.trendScore} />

            {faqBelow.length > 0 && (
              <section className="mt-10" data-anchor="faq" data-anchor-label="FAQ">
                <h2 className={SECTION_HEADING}>More questions</h2>
                <div className="mt-4 space-y-3">
                  {faqBelow.map((item) => (
                    <details
                      key={item.q}
                      className="rounded-lg border border-border bg-card p-4 text-base"
                    >
                      <summary className="cursor-pointer text-[1.0625rem] font-semibold">
                        {item.q}
                      </summary>
                      <p className="mt-2.5 text-[1.0625rem] leading-[1.75] text-muted-foreground">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {idea.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {idea.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-sm border border-border px-2 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <InternalLinkLine link={linkForPosition("closing")} />

            <FriendTalkSection picks={friendTalkPicks} />

            {subcategoryLink && (
              <section className="mt-8 rounded-lg border border-border bg-card p-5">
                <h2 className={SECTION_HEADING}>Keep exploring</h2>
                <p className="mt-3 text-[1.0625rem] leading-[1.75] text-muted-foreground">
                  This blueprint sits inside{" "}
                  <Link
                    to={subcategoryLink.to}
                    params={subcategoryLink.params as never}
                    className="font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
                  >
                    {subcategoryLink.label}
                  </Link>
                  {categoryLink && (
                    <>
                      , part of the wider{" "}
                      <Link
                        to={categoryLink.to}
                        params={categoryLink.params as never}
                        className="font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
                      >
                        {categoryLink.label}
                      </Link>{" "}
                      lineup
                    </>
                  )}
                  {matchedIdeaLink && (
                    <>
                      . If it resonates,{" "}
                      <Link
                        to={matchedIdeaLink.to}
                        params={matchedIdeaLink.params as never}
                        className="font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
                      >
                        {matchedIdeaLink.label}
                      </Link>{" "}
                      explores a nearby angle worth a look
                    </>
                  )}
                  .
                </p>
              </section>
            )}

            <div className="mt-10">
              <AdSlot position="idea-detail-above-related" size="banner" />
            </div>

            {/* Was two full-width <section>s stacked vertically, each holding
                only a `max-w-xl` (36rem) stack-list -- 36rem made sense as a
                column inside the old max-w-6xl page, but once the article
                went full-width (see the masthead div's className below) each
                one turned into a narrow list floating in a sea of empty
                space beside it, one after another. Side by side in a
                two-column row, the same two narrow lists fill a normal-width
                row instead of each claiming (and mostly wasting) a full one.
                `relatedCategories` moves after this row rather than between
                the two lists, since it's a flex-wrap pill cluster that
                already fills whatever width it's given and doesn't need a
                column of its own. */}
            {/* `grid-cols-1` and `[&>*]:min-w-0`: a grid item's default minimum
                width is its content's, so on a phone the idea cards (long
                unbroken tag rows) pushed this column to 483px on a 412px
                screen. Everything below it was dragged sideways with it. */}
            {(bottomRelated.length > 0 || trending.length > 0) && (
              <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 [&>*]:min-w-0">
                {bottomRelated.length > 0 && (
                  <section data-anchor="related" data-anchor-label="Related">
                    <h2 className={SECTION_HEADING}>More in {idea.categoryName}</h2>
                    {/* `.mo-card` for these cells lives on IdeaCard itself,
                        which is the listing agent's file — this rail supplies
                        the single delegated pointer listener the sheen reads
                        from. `.stack-list`/`.stack-item` (motion.css) layer a
                        CSS-only depth stack on top: a shallow perspective
                        deck at rest, fanned into an open column on hover or
                        keyboard focus. */}
                    <ul ref={relatedRailRef} className="stack-list mt-4">
                      {bottomRelated.map((r, i) => (
                        <li
                          key={r.ideaId}
                          className="stack-item"
                          style={{ "--i": i + 1 } as CSSProperties}
                        >
                          <IdeaCard idea={r} />
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {trending.length > 0 && (
                  <section>
                    <h2 className={SECTION_HEADING}>Trending across the library</h2>
                    {/* `.stack-list`/`.stack-item` (motion.css) — the same
                        CSS-only depth stack used above: a shallow perspective
                        deck at rest, fanned into an open column on hover or
                        keyboard focus. Was `.stack-row` with a horizontal
                        snap-scroll strip layered under the fan — kept the old
                        swipeable rail alive alongside the new effect, but that
                        meant the section still scrolled sideways instead of
                        just fanning open, which reads as broken next to the
                        other two lists on this page. Matching them: one
                        consistent effect, no scrollbar. */}
                    <ul ref={trendingRailRef} className="stack-list mt-4">
                      {trending.map((t, i) => (
                        <li
                          key={t.ideaId}
                          className="stack-item"
                          style={{ "--i": i + 1 } as CSSProperties}
                        >
                          <Link
                            to="/idea/$slug"
                            params={{ slug: t.slug }}
                            className="mo-card glass glass-hover block h-full rounded-2xl p-4"
                          >
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                              {t.categoryName}
                            </p>
                            <p className="mt-2 text-sm font-bold leading-snug">{t.title}</p>
                            {t.trendScore !== null && (
                              <p className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                                Trend {t.trendScore}
                              </p>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}

            {relatedCategories.length > 0 && (
              <section className="mt-16">
                <h2 className={SECTION_HEADING}>Other categories worth a look</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {relatedCategories.map((c) => (
                    <Link
                      key={c.categorySlug}
                      to="/category/$categorySlug"
                      params={{ categorySlug: c.categorySlug }}
                      className="mo-row glass-pill inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold"
                    >
                      <span>{c.categoryName}</span>
                      <span className="text-[10px] opacity-70">{c.ideaCount}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* The page's actual close, per the Live Surface grammar: an actual
                input the visitor puts a cursor in, not a button pointing back
                at one. ValidateButton already opens Claude/Perplexity with a
                real prompt and an optional free-text context field — this IS
                the ending, not a decoration in front of it. */}
            <section
              id="validate"
              data-anchor="validate"
              data-anchor-label="Validate"
              className="mt-16 rounded-2xl border border-border bg-card p-6 sm:p-9"
            >
              <h2 className={SECTION_HEADING}>Run it before you commit</h2>
              <p className="mt-2 max-w-xl text-[1.0625rem] leading-[1.75] text-muted-foreground">
                Free, on your own account, as many times as you want.
              </p>
              <div className="mt-6">
                <ValidateButton slug={idea.slug} />
              </div>
              <Link
                to="/browse"
                className="mt-6 inline-block text-xs font-semibold uppercase tracking-widest text-primary underline decoration-border underline-offset-4 hover:text-accent"
              >
                Browse more blueprints
              </Link>
            </section>

            {/* Who stands behind the research, on the page that makes the
                claims, rather than only on /about. The names, roles and the
                reason the site is free are the ones already written there —
                nothing is invented per idea, and the block is identical on
                every blueprint by design. Deliberately quiet type and no
                button: this signs the work, it does not sell anything. */}
            <IdeaSignature />
            {/* EDITABLE SECTION END */}

            {/* The resource block that closes this page (twelve calculators, six
                guides, twelve glossary terms, six blog posts) is rendered by
                SiteShell now, above the footer, on every page but the
                homepage and the policy pages. It used to be mounted here by
                hand, which is why it appeared on three templates and not the
                other twenty. What used to be here before that was a
                five-card "Keep exploring" rail pointing at the same two or
                three destinations on all 409 blueprints. */}
          </article>

          {/* Sticky right column — desktop only. Add or reorder blocks freely.
              `cx-layer` sits on the sticky div itself, not this wrapper — a
              `transform` on an ANCESTOR of a `position: sticky` element
              breaks its stickiness, same reasoning as the article above. A
              transform on the sticky element itself composes fine. */}
          {hasSidebar && (
            <aside className="hidden lg:block">
              <div
                className="cx-layer sticky top-28 space-y-5"
                style={{ "--z": 0.42 } as CSSProperties}
              >
                <AdSlot position="idea-detail-right-affiliate" size="rectangle" />

                {sidebarRelated.length > 0 && (
                  <div className="glass rounded-2xl px-5 py-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
                      More in {idea.categoryName}
                    </p>
                    {/* CSS-only depth stack (motion.css: .stack-list/.stack-item) —
                      a shallow perspective deck at rest, fans into an open
                      column on hover or keyboard focus. --i is each item's
                      1-based position; the deck and the fan both read off it. */}
                    <ul className="stack-list mt-4">
                      {sidebarRelated.map((r, i) => (
                        <li
                          key={r.ideaId}
                          className="stack-item"
                          style={{ "--i": i + 1 } as CSSProperties}
                        >
                          <Link
                            to="/idea/$slug"
                            params={{ slug: r.slug }}
                            className="block rounded-xl border border-border bg-card px-3.5 py-3 transition-colors hover:border-primary/40"
                          >
                            <span className="block text-sm font-semibold leading-snug text-foreground">
                              {r.title}
                            </span>
                            {r.trendScore !== null && (
                              <span className="mt-1.5 block text-[10px] uppercase tracking-widest text-hl-teal">
                                Trend {r.trendScore}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>
      </SiteShell>
    </>
  );
}
