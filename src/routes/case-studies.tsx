import { createFileRoute, redirect } from "@tanstack/react-router";

// Founder, 7 Nov 2026: the purchased case-studies page (seller brand, dead links) moved to our own page.
export const Route = createFileRoute("/case-studies")({
  beforeLoad: () => {
    throw redirect({ href: "/researched-case-studies", replace: true, statusCode: 301 });
  },
});
