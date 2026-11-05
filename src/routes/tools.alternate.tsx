import { createFileRoute } from "@tanstack/react-router";
import purchasedPage from "@/bought/tools-alternate.html?raw";
import { boughtPage } from "@/bought/serve";

export const Route = createFileRoute("/tools/alternate")({
  server: {
    handlers: {
      GET: async () => boughtPage(purchasedPage, "tools-alternate"),
    },
  },
});
