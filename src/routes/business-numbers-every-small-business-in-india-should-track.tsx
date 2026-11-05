import { createFileRoute } from "@tanstack/react-router";
import { renderTopicPage } from "@/bought/topic-page";
import { topicPage } from "@/data/topic-pages";

// India topic page on the purchased topics layout. Content: src/data/topic-pages.
export const Route = createFileRoute("/business-numbers-every-small-business-in-india-should-track")({
  server: {
    handlers: {
      GET: async () => renderTopicPage(topicPage("business-numbers-every-small-business-in-india-should-track")),
    },
  },
});
