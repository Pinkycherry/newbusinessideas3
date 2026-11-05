import { createFileRoute } from "@tanstack/react-router";
import purchasedPage from "@/bought/open-source.html?raw";
import { boughtPage } from "@/bought/serve";

export const Route = createFileRoute("/open-source")({
  server: {
    handlers: {
      GET: async () => boughtPage(purchasedPage, "open-source"),
    },
  },
});
