import { createFileRoute } from "@tanstack/react-router";
import purchasedPage from "@/bought/topics.html?raw";
import { boughtPage } from "@/bought/serve";

export const Route = createFileRoute("/topics")({
  server: {
    handlers: {
      GET: async () => boughtPage(purchasedPage, "topics"),
    },
  },
});
