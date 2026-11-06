import { createFileRoute, redirect } from "@tanstack/react-router";

// 6 Nov 2026: this purchased page linked to ./pages/*.html files that never existed here. It now moves permanently to our own page.
export const Route = createFileRoute("/frameworks-comparison")({
  beforeLoad: () => {
    throw redirect({ href: "/startup-guides", replace: true, statusCode: 301 });
  },
});
