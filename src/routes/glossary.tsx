import { createFileRoute, redirect } from "@tanstack/react-router";

// Founder, 7 Nov 2026: /glossary was a 404. The glossary lives at /founder-glossary.
export const Route = createFileRoute("/glossary")({
  beforeLoad: () => {
    throw redirect({ href: "/founder-glossary", replace: true, statusCode: 301 });
  },
});
