import { createFileRoute } from "@tanstack/react-router";
import purchasedPage from "@/bought/case-studies.html?raw";
import { boughtPage } from "@/bought/serve";

export const Route = createFileRoute("/case-studies")({
  server: {
    handlers: {
      GET: async () => boughtPage(purchasedPage, "case-studies"),
    },
  },
});
