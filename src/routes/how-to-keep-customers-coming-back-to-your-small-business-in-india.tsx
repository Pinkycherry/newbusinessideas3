import { createFileRoute } from "@tanstack/react-router";
import { renderTopicPage } from "@/bought/topic-page";
import { topicPage } from "@/data/topic-pages";

// India topic page on the purchased topics layout. Content: src/data/topic-pages.
export const Route = createFileRoute("/how-to-keep-customers-coming-back-to-your-small-business-in-india")({
  server: {
    handlers: {
      GET: async () => renderTopicPage(topicPage("how-to-keep-customers-coming-back-to-your-small-business-in-india")),
    },
  },
});
