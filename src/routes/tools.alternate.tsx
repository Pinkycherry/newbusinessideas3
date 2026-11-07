import { createFileRoute, redirect } from "@tanstack/react-router";

// Founder, 7 Nov 2026: the purchased snapshot carried the seller's brand, seller ads and dead links.
// It moved to our own tools page; the old URL keeps working with a permanent redirect.
export const Route = createFileRoute("/tools/alternate")({
  beforeLoad: () => {
    throw redirect({ href: "/tools", replace: true, statusCode: 301 });
  },
});
