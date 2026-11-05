import type { ComponentProps } from "react";
import "./page-sections.css";

// Shared sections for the remaining page families. The native element and every
// existing prop stay intact, so route content, forms and calculator state remain
// owned by their pages.
function classes(kind: string, original?: string) {
  return `${kind}${original ? ` ${original}` : ""}`;
}

export function V2PageHero({ className, ...props }: ComponentProps<"header">) {
  return <header {...props} className={classes("v2p-hero", className)} />;
}

export function V2PageSection({ className, ...props }: ComponentProps<"section">) {
  return <section {...props} className={classes("v2p-section", className)} />;
}

export function V2PageFaq({ className, ...props }: ComponentProps<"section">) {
  return <section {...props} className={classes("v2p-section v2p-faq", className)} />;
}

export function V2PageComparison({ className, ...props }: ComponentProps<"section">) {
  return <section {...props} className={classes("v2p-section v2p-comparison", className)} />;
}

export function V2PageCard({ className, ...props }: ComponentProps<"article">) {
  return <article {...props} className={classes("v2p-card", className)} />;
}

export function V2PageCta({ className, ...props }: ComponentProps<"footer">) {
  return <footer {...props} className={classes("v2p-cta", className)} />;
}

export function V2PageAsideCta({ className, ...props }: ComponentProps<"aside">) {
  return <aside {...props} className={classes("v2p-cta", className)} />;
}
