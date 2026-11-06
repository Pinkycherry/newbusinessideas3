import { createFileRoute, redirect } from "@tanstack/react-router";

// 6 Nov 2026: this purchased page linked to ./pages/*.html files that never existed here. It now moves permanently to our own page.
export const Route = createFileRoute("/lists/coaching-business-ideas")({
  beforeLoad: () => {
    throw redirect({ href: "/category/tuition-and-coaching-business-ideas", replace: true, statusCode: 301 });
  },
});
