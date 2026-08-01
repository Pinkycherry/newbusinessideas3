import type { ReactNode } from "react";

import { SiteShell, Breadcrumbs } from "@/components/site-shell";

export function ContentPage({
  eyebrow,
  title,
  highlight,
  intro,
  children,
  wide = false,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  intro: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <SiteShell>
      <div className={`mx-auto ${wide ? "max-w-6xl" : "max-w-3xl"} px-3 py-12 sm:px-4`}>
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: eyebrow }]} />
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-accent">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
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
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{intro}</p>
        <div className="mt-10 space-y-5">{children}</div>
      </div>
    </SiteShell>
  );
}

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="glass rounded-2xl px-5 py-6 sm:px-7">
      <h2 className="font-display text-lg font-bold tracking-tight">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span aria-hidden className="mt-[0.35rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
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