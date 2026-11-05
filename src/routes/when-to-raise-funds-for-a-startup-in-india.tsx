import { createFileRoute } from "@tanstack/react-router";
import { renderTopicPage } from "@/bought/topic-page";
import { topicPage } from "@/data/topic-pages";

// India topic page on the purchased topics layout. Content: src/data/topic-pages.
export const Route = createFileRoute("/when-to-raise-funds-for-a-startup-in-india")({
  server: {
    handlers: {
      GET: async () => renderTopicPage(topicPage("when-to-raise-funds-for-a-startup-in-india")),
    },
  },
});
