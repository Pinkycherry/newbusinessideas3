import { createFileRoute, notFound, redirect } from '@tanstack/react-router';
import { OLD_CATEGORY_REDIRECTS } from '@/config/old-category-redirects';
import { getCategoryPage } from '@/lib/category-page.functions';
import { ListPageBody } from './lists.$slug';

export const Route=createFileRoute('/category/$categorySlug/')({
  // AdSense approval: old categories 301 to the closest new category.
  beforeLoad:({params})=>{const moved=OLD_CATEGORY_REDIRECTS[params.categorySlug];if(moved)throw redirect({href:`/category/${moved}`,replace:true,statusCode:301});},
  // AdSense approval: a category with no published ideas is not a page.
  loader:async({params})=>{const page=await getCategoryPage({data:{slug:params.categorySlug}});if(!page||page.total===0)throw notFound();return page;},
  head:({loaderData})=>({meta:[{title:`${loaderData?.name ?? 'Business ideas'} | BusinessIdea.io`},{name:'description',content:loaderData?.intro ?? 'Explore published business idea lists.'}]}),
  component:CategoryPage,
});
function CategoryPage(){
  const page=Route.useLoaderData();
  return <ListPageBody p={page} parent={{label:'Browse',href:'/browse'}} canonicalPath={`/category/${page.slug}`} directory={page.subs}/>;
}
