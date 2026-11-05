import { createFileRoute } from "@tanstack/react-router";
import { TemplatesDirectory } from "@/components/v2/templates-directory";
import { templateImages } from "@/config/template-imagery";

export const Route = createFileRoute("/templates/")({
  head: () => ({ meta: [
    { title: "Business Planning Templates for Indian Founders | BusinessIdea.io" },
    { name: "description", content: "Explore customer persona, interview, competitive analysis, lean canvas and business plan guides for Indian founders. Each route explains real research decisions." },
    { property: "og:image", content: templateImages.planning.src },
    { property: "og:image:alt", content: templateImages.planning.alt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: templateImages.planning.src },
  ] }),
  component: TemplatesDirectory,
});
