import { createFileRoute } from "@tanstack/react-router";
import { CalculatorHub } from "@/components/v2/calculator-hub";
import { getListsHub } from "@/lib/lists.functions";
import { getBlogPosts } from "@/lib/blog.functions";

export const Route = createFileRoute("/calculator/")({
  loader: async () => {
    const [hub, blog] = await Promise.all([getListsHub(), getBlogPosts({ data: { page: 1 } })]);
    return { hub, posts: blog.posts };
  },
  head: () => ({ meta: [
    { title: "Startup Calculators | BusinessIdea.io" },
    { name: "description", content: "Business calculators with visible source formulas, inputs and results." },
  ] }),
  component: CalculatorPage,
});

function CalculatorPage() {
  const { hub, posts } = Route.useLoaderData();
  return <CalculatorHub hub={hub} posts={posts} />;
}
