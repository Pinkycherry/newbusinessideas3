import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getBlogPosts = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ page: z.number().int().min(1).max(50).default(1) }).parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    const { fetchPosts } = await import("./blog.server");
    // blog.index.tsx always requests page 1 and has no "load more" control, so
    // a page size smaller than the total post count silently hides the rest.
    return fetchPosts(data.page, 50);
  });

export const getBlogPost = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const { fetchPostBySlug } = await import("./blog.server");
    return fetchPostBySlug(data.slug);
  });
