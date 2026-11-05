import { createFileRoute } from "@tanstack/react-router";
import purchasedPage from "@/bought/research-1.html?raw";
import { boughtPage } from "@/bought/serve";

export const Route = createFileRoute("/market-research")({
  server: {
    handlers: {
      GET: async () => boughtPage(purchasedPage, "research-1"),
    },
  },
});
