import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/failed-startups")({
  server: {
    handlers: {
      GET: async () => new Response(null, { status: 308, headers: { Location: "/failed-startups/india" } }),
    },
  },
});
