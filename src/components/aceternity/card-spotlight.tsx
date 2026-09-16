import * as React from "react";

import SpotlightCard from "@/components/aceternity/spotlight-card";

/**
 * CardSpotlight — kept as a name, not as a second implementation.
 *
 * The site had three different card treatments running at once: this one
 * (a brand-ink wash driven by framer motion values), the Evervault plates
 * (a character field behind a pointer window), and plain bordered divs. Three
 * answers to the same gesture on one page reads as three sites.
 *
 * Every card is a SpotlightCard now. This file stays so the call sites that
 * already say `CardSpotlight` — the idea card, which is most of the site —
 * keep working without a rename sweep across every route.
 *
 * @deprecated Import SpotlightCard directly in new code.
 */
export default function CardSpotlight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  /** Accepted and ignored: the spotlight radius is a CSS concern now. */
  radius?: number;
}) {
  // `exactOptionalPropertyTypes` is on: an explicit `undefined` is not the
  // same as an absent prop, so the prop is spread in only when it has a value.
  return <SpotlightCard {...(className ? { className } : {})}>{children}</SpotlightCard>;
}
