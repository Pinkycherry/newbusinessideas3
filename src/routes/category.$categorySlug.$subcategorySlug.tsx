import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { OLD_CATEGORY_REDIRECTS } from "@/config/old-category-redirects";
import { TAXONOMY } from "@/data/taxonomy";
import { V2Frame } from "@/components/v2/frame";
import { getListPage } from "@/lib/lists.functions";
import { ListPageBody } from "@/routes/lists.$slug";

export const Route = createFileRoute("/category/$categorySlug/$subcategorySlug")({
  // AdSense approval: old categories and their subcategories 301 to the closest new category.
  beforeLoad: ({ params }) => {
    const moved = OLD_CATEGORY_REDIRECTS[params.categorySlug];
    if (moved) throw redirect({ href: `/category/${moved}`, replace: true, statusCode: 301 });
  },
  loader: async ({ params }) => {
    const page = await getListPage({ data: { slug: params.subcategorySlug } });
    if (!page || page.categorySlug !== params.categorySlug) {
      // An old subcategory under a category that still exists goes to that category.
      if (TAXONOMY.some((c) => c.slug === params.categorySlug)) {
        throw redirect({ href: `/category/${params.categorySlug}`, replace: true, statusCode: 301 });
      }
      throw notFound();
    }
    return page;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Business ideas"} in India | BusinessIdea.io` },
      { name: "description", content: loaderData?.intro ?? "Browse published ideas in this category." },
    ],
  }),
  component: SubcategoryPage,
  notFoundComponent: () => <V2Frame active="/lists"><div className="mx-auto max-w-6xl px-4 pt-28 pb-16"><h1 className="text-3xl font-bold">No published list for this path yet.</h1><a className="mt-5 inline-flex rounded-lg bg-primary px-5 py-3 text-primary-foreground" href="/browse">Browse published lists</a></div></V2Frame>,
});

function SubcategoryPage() {
  const page = Route.useLoaderData();
  return <ListPageBody p={page} categorySlug={page.categorySlug} canonicalPath={`/category/${page.categorySlug}/${page.slug}`} />;
}
