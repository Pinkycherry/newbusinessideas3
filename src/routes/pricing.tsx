import { createFileRoute, redirect } from "@tanstack/react-router";

// AdSense approval (founder, 6 Nov 2026): no pricing page; the site is free. Header link stays, the URL moves home.
export const Route = createFileRoute("/pricing")({
  beforeLoad: () => {
    throw redirect({ href: "/", replace: true, statusCode: 301 });
  },
});
