import { createFileRoute } from "@tanstack/react-router";
import purchasedPage from "@/bought/frameworks-comparison.html?raw";
import { boughtPage } from "@/bought/serve";

export const Route = createFileRoute("/frameworks-comparison")({
  server: {
    handlers: {
      GET: async () => boughtPage(purchasedPage, "frameworks-comparison"),
    },
  },
});
