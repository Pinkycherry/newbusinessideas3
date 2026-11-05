import { createFileRoute } from "@tanstack/react-router";
import { renderTopicPage } from "@/bought/topic-page";
import { topicPage } from "@/data/topic-pages";

// India topic page on the purchased topics layout. Content: src/data/topic-pages.
export const Route = createFileRoute("/startup-funding-questions-for-first-time-founders-in-india")({
  server: {
    handlers: {
      GET: async () => renderTopicPage(topicPage("startup-funding-questions-for-first-time-founders-in-india")),
    },
  },
});
