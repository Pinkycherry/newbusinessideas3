import { createFileRoute, redirect } from "@tanstack/react-router";

// 6 Nov 2026: this purchased page linked to ./pages/*.html files that never existed here. It now moves permanently to our own page.
export const Route = createFileRoute("/market-research")({
  beforeLoad: () => {
    throw redirect({ href: "/how-to-do-competitor-analysis-for-a-small-business-in-india", replace: true, statusCode: 301 });
  },
});
