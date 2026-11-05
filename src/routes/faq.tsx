import { createFileRoute } from "@tanstack/react-router";
import { FaqDirectory } from "@/components/v2/faq-directory";
import { getFaqDirectory } from "@/lib/faq.functions";

export const Route = createFileRoute("/faq")({
  loader: () => getFaqDirectory(),
  head: () => ({ meta: [
    { title: "Business Idea Questions | BusinessIdea.io" },
    { name: "description", content: "Answers from published business idea lists and ideas, organized by category." },
  ] }),
  component: () => <FaqDirectory groups={Route.useLoaderData()} />,
});
