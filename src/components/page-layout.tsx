import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  type ReactElement,
  type ReactNode,
} from "react";
import { useRouterState } from "@tanstack/react-router";

import SpotlightCard from "@/components/aceternity/spotlight-card";
import { SiteShell, Breadcrumbs } from "@/components/site-shell";
import { JsonLd, breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { useDepthScene, useElementPointerGroup, useStaggerReveal, useTextReveal } from "@/motion";

/**
 * Ten pages used to render through this component with nothing but the text
 * changing, which made half the site look like one page seen ten times. The
 * `tone` prop is the fix: it varies the eyebrow treatment, the vertical
 * rhythm, the section chrome and whether sections carry a number — all from
 * the tokens already defined in styles.css, no new colours.
 *
 *   default   — untouched, so pages that never opt in render exactly as before
 *   brief     — editorial: big headline, ruled eyebrow, roomy sections
 *   document  — clause list: chip eyebrow, restrained headline, numbered
 *   notice    — standing notice: marker eyebrow, tracked section labels
 *   focus     — one action, centred, nothing competing with it
 */
export type ContentTone = "default" | "brief" | "document" | "notice" | "focus";

type PageTone = {
  title: string;
  intro: string;
  stack: string;
  numbered: boolean;
};

const PAGE_TONES: Record<ContentTone, PageTone> = {
  default: {
    title: "mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl",
    intro: "mt-5 text-lg leading-relaxed text-muted-foreground",
    stack: "mt-10 space-y-5",
    numbered: false,
  },
  brief: {
    title: "mt-4 text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl",
    intro: "mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground",
    stack: "mt-12 space-y-6",
    numbered: false,
  },
  document: {
    title: "mt-4 font-display text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl",
    intro: "mt-4 text-base leading-relaxed text-muted-foreground",
    stack: "mt-8 space-y-3",
    numbered: true,
  },
  notice: {
    title: "mt-5 text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl",
    intro: "mt-5 text-lg leading-relaxed text-muted-foreground",
    stack: "mt-9 space-y-4",
    numbered: false,
  },
  focus: {
    title: "mt-4 text-center text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl",
    intro: "mx-auto mt-5 max-w-xl text-center text-base leading-relaxed text-muted-foreground",
    stack: "mt-9 space-y-5",
    numbered: false,
  },
};

type SectionTone = {
  shell: string;
  heading: string;
  body: string;
};

const SECTION_TONES: Record<ContentTone, SectionTone> = {
  default: {
    shell: "px-5 py-6 sm:px-7",
    heading: "font-display text-lg font-bold tracking-tight",
    body: "mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground",
  },
  brief: {
    shell: "px-5 py-7 sm:px-8 sm:py-8",
    heading: "font-display text-xl font-bold tracking-tight",
    body: "mt-4 space-y-3 text-[0.95rem] leading-relaxed text-muted-foreground",
  },
  document: {
    shell: "px-5 py-5 sm:px-6",
    heading: "font-display text-base font-bold tracking-tight",
    body: "mt-2.5 space-y-3 text-sm leading-relaxed text-muted-foreground",
  },
  notice: {
    shell: "px-5 py-6 sm:px-8 sm:py-7",
    heading: "text-xs font-semibold uppercase tracking-[0.28em] text-accent",
    body: "mt-3.5 space-y-3 text-[0.95rem] leading-relaxed text-muted-foreground",
  },
  focus: {
    shell: "px-5 py-6 sm:px-7",
    heading: "font-display text-lg font-bold tracking-tight",
    body: "mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground",
  },
};

const ToneContext = createContext<ContentTone>("default");

function Eyebrow({ tone, label }: { tone: ContentTone; label: string }) {
  const base = "t-eyebrow";
  if (tone === "brief") {
    return (
      <p className={`mt-6 flex items-center gap-3 ${base}`}>
        <span aria-hidden className="h-px w-10 bg-accent/60" />
        {label}
      </p>
    );
  }
  if (tone === "document") {
    return (
      <p className="mt-6">
        <span className="inline-block rounded-full border border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
          {label}
        </span>
      </p>
    );
  }
  if (tone === "notice") {
    return (
      <p className={`mt-6 flex items-center gap-2.5 ${base}`}>
        <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
        {label}
        <span aria-hidden className="h-px flex-1 bg-border" />
      </p>
    );
  }
  if (tone === "focus") {
    return (
      <p className="mt-6 text-center text-[11px] font-semibold uppercase tracking-[0.4em] text-muted-foreground">
        {label}
      </p>
    );
  }
  return <p className={`mt-6 ${base}`}>{label}</p>;
}

/**
 * Numbering is applied here rather than typed into every heading by hand, so a
 * section can be reordered or removed without leaving a gap in the sequence.
 */
function numberSections(children: ReactNode): ReactNode {
  let n = 0;
  return Children.map(children, (child) => {
    if (!isValidElement(child) || child.type !== Section) return child;
    n += 1;
    return cloneElement(child as ReactElement<SectionProps>, { index: n });
  });
}

export function ContentPage({
  eyebrow,
  title,
  highlight,
  intro,
  children,
  wide = false,
  tone = "default",
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  intro: string;
  children: ReactNode;
  wide?: boolean;
  tone?: ContentTone;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const t = PAGE_TONES[tone];
  const titleRef = useTextReveal<HTMLHeadingElement>();
  const sectionsRef = useStaggerReveal<HTMLDivElement>({ distance: 14, stagger: 0.05 });
  // Publishes --el-ptr-* on each section so they light and tilt one at a time.
  const sectionsPointerRef = useElementPointerGroup<HTMLDivElement>(".mo-card");
  // One depth scene per content page — the masthead. Ten templates render
  // through here, so this is the single place the grammar is applied to all
  // of them. Cursor depth on fine pointers, scroll depth on touch.
  const sceneRef = useDepthScene<HTMLDivElement>({ strength: 0.5 });

  return (
    <>
      <JsonLd
        schema={[
          webPageSchema({
            path: pathname,
            name: `${title}${highlight ? ` ${highlight}` : ""}`,
            description: intro,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: eyebrow, path: pathname },
          ]),
        ]}
      />
      <SiteShell tone="instrument">
        <div
          ref={sceneRef}
          className={`cx-scene mx-auto ${wide ? "max-w-6xl" : "max-w-3xl"} px-3 py-12 sm:px-4`}
        >
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: eyebrow }]} />
          <Eyebrow tone={tone} label={eyebrow} />
          <h1 ref={titleRef} className={`cx-layer cx-z3 ${t.title}`}>
            {title}
            {highlight && (
              <>
                {" "}
                <span className="bg-gradient-to-r from-primary via-accent to-warm bg-clip-text text-transparent">
                  {highlight}
                </span>
              </>
            )}
          </h1>
          {/* `whitespace-pre-line` so an intro can keep its own line breaks.
              The pricing sub-head is four short lines whose rhythm is the
              point; collapsing them into one paragraph loses it. Every other
              page passes a single-line string, where this class does nothing. */}
          <p className={`cx-layer cx-z1 whitespace-pre-line ${t.intro}`}>{intro}</p>
          <ToneContext.Provider value={tone}>
            <div ref={sectionsPointerRef}>
              <div ref={sectionsRef} className={t.stack}>
                {t.numbered ? numberSections(children) : children}
              </div>
            </div>
          </ToneContext.Provider>
        </div>
      </SiteShell>
    </>
  );
}

type SectionProps = {
  heading: string;
  children: ReactNode;
  /** Injected by ContentPage on numbered tones. Never passed by hand. */
  index?: number;
};

export function Section({ heading, children, index }: SectionProps) {
  const tone = useContext(ToneContext);
  const t = SECTION_TONES[tone];
  const numbered = PAGE_TONES[tone].numbered && index !== undefined;

  /* `mo-card` is what `useElementPointerGroup` in ContentPage looks for, so a
     section reports its own pointer position and can move independently of
     the ones beside it. `cx-layer`/`cx-z*` put the heading and the body on
     different depth planes inside the masthead's scene, so a stack of
     sections parallaxes instead of sitting flat.

     SpotlightCard is the site's one card: plate, rule, and a light that
     follows the cursor. Using it here means these sections answer a pointer
     the same way every other card does, rather than being the one place that
     invented a flat rectangle. */
  return (
    <SpotlightCard as="section" className={`mo-card cx-depth ${t.shell}`}>
      {numbered ? (
        <div className="cx-layer cx-z2 flex items-baseline gap-3">
          <span
            aria-hidden
            className="text-[11px] font-semibold tabular-nums tracking-[0.2em] text-accent"
          >
            {String(index).padStart(2, "0")}
          </span>
          <h2 className={t.heading}>{heading}</h2>
        </div>
      ) : (
        <h2 className={`cx-layer cx-z2 ${t.heading}`}>{heading}</h2>
      )}
      <div className={`cx-layer cx-z1 ${t.body}`}>{children}</div>
    </SpotlightCard>
  );
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item} className="mo-row -mx-2 flex gap-2.5 rounded-lg px-2 py-1.5">
          <span aria-hidden className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function metaFor(title: string, description: string) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
