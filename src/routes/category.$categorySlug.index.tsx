import { createFileRoute, notFound } from '@tanstack/react-router';
import { getCategoryPage } from '@/lib/category-page.functions';
import { ListPageBody } from './lists.$slug';

export const Route=createFileRoute('/category/$categorySlug/')({
  loader:async({params})=>{const page=await getCategoryPage({data:{slug:params.categorySlug}});if(!page)throw notFound();return page;},
  head:({loaderData})=>({meta:[{title:`${loaderData?.name ?? 'Business ideas'} | BusinessIdea.io`},{name:'description',content:loaderData?.intro ?? 'Explore published business idea lists.'}]}),
  component:CategoryPage,
});
function CategoryPage(){
  const page=Route.useLoaderData();
  return <ListPageBody p={page} parent={{label:'Browse',href:'/browse'}} canonicalPath={`/category/${page.slug}`} directory={page.subs}/>;
}
