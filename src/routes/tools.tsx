import { createFileRoute } from "@tanstack/react-router";
import { ToolsDirectory } from "@/components/v2/tools-directory";
import { getListsHub } from "@/lib/lists.functions";
import { getBlogPosts } from "@/lib/blog.functions";

export const Route = createFileRoute("/tools")({
  loader: async () => {
    const [hub, blog] = await Promise.all([getListsHub(), getBlogPosts({ data: { page: 1 } })]);
    return { hub, posts: blog.posts };
  },
  head: () => ({ meta: [
    { title: "Founder Tools and Resources | bbusiness.online" },
    { name: "description", content: "Explore external founder tools by stage, then use our business calculators, guides and idea lists to make your next decision." },
  ] }),
  component: ToolsPage,
});

function ToolsPage() {
  const { hub, posts } = Route.useLoaderData();
  return <ToolsDirectory hub={hub} posts={posts} />;
}
