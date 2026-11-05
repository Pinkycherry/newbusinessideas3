import { createFileRoute } from "@tanstack/react-router";
import { renderTopicPage } from "@/bought/topic-page";
import { topicPage } from "@/data/topic-pages";

// India topic page on the purchased topics layout. Content: src/data/topic-pages.
export const Route = createFileRoute("/common-mistakes-to-avoid-when-starting-a-business-in-india")({
  server: {
    handlers: {
      GET: async () => renderTopicPage(topicPage("common-mistakes-to-avoid-when-starting-a-business-in-india")),
    },
  },
});
