import { createFileRoute } from "@tanstack/react-router";
import { renderTopicPage } from "@/bought/topic-page";
import { topicPage } from "@/data/topic-pages";

// India topic page on the purchased topics layout. Content: src/data/topic-pages.
export const Route = createFileRoute("/free-government-resources-for-starting-a-business-in-india")({
  server: {
    handlers: {
      GET: async () => renderTopicPage(topicPage("free-government-resources-for-starting-a-business-in-india")),
    },
  },
});
