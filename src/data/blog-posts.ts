import post0 from "../../content/blog-posts/high-margin-online-business-ideas.json";
import post1 from "../../content/blog-posts/flexible-business-ideas-for-women.json";
import post2 from "../../content/blog-posts/30-smart-village-business-ideas.json";
import post3 from "../../content/blog-posts/realistic-small-town-business-ideas.json";
import post4 from "../../content/blog-posts/realistic-part-time-business-ideas.json";
import post5 from "../../content/blog-posts/passive-income-business-ideas-honest-list.json";
import post6 from "../../content/blog-posts/50-untold-work-from-home-business-ideas.json";
import post7 from "../../content/blog-posts/side-hustle-ideas-after-your-day-job.json";
import post8 from "../../content/blog-posts/zero-investment-business-ideas-start-with-zero.json";
import post9 from "../../content/blog-posts/selling-social-media-caption-templates.json";
import post10 from "../../content/blog-posts/selling-business-templates-online.json";
import post11 from "../../content/blog-posts/how-to-price-a-side-hustle-with-no-customers.json";
import post12 from "../../content/blog-posts/how-to-start-a-niche-job-board.json";
import post13 from "../../content/blog-posts/paid-community-business-model-trades.json";
import post14 from "../../content/blog-posts/starting-a-small-batch-coffee-roasting-business.json";
import post15 from "../../content/blog-posts/online-business-no-money-no-laptop.json";
import post16 from "../../content/blog-posts/passive-income-myths-reality.json";
import post17 from "../../content/blog-posts/find-first-paying-customer-without-ads.json";
import post18 from "../../content/blog-posts/packing-error-subscription-box-inventory-software.json";
import post19 from "../../content/blog-posts/why-your-cobbler-said-no-and-who-still-says-yes.json";
import post20 from "../../content/blog-posts/mobile-bike-repair-business-startup.json";
import post21 from "../../content/blog-posts/is-a-gutter-cleaning-business-profitable.json";
import post22 from "../../content/blog-posts/selling-invoice-templates-online.json";

export type PublishedBlogRow = {
  id: number;
  slug: string;
  title: string | null;
  excerpt: string | null;
  html: string | null;
  image: string | null;
  categories: string[] | null;
  published_at: string | null;
  created_at: string | null;
};

/** Exact published-row snapshot from the BBI source on 22 October 2026.
 * The demo's own database has no blog_posts table. Keep these records and
 * their images in Git until a deliberate read-only data binding is connected.
 */
export const PUBLISHED_BLOG_POSTS: PublishedBlogRow[] = [
  post0,
  post1,
  post2,
  post3,
  post4,
  post5,
  post6,
  post7,
  post8,
  post9,
  post10,
  post11,
  post12,
  post13,
  post14,
  post15,
  post16,
  post17,
  post18,
  post19,
  post20,
  post21,
  post22,
].sort((a,b) => (b.published_at ?? b.created_at ?? "").localeCompare(a.published_at ?? a.created_at ?? ""));
