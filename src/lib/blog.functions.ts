import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getBlogPosts = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ page: z.number().int().min(1).max(50).default(1) }).parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    const { fetchPosts } = await import("./blog.server");
    return fetchPosts(data.page, 12);
  });

export const getBlogPost = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const { fetchPostBySlug } = await import("./blog.server");
    return fetchPostBySlug(data.slug);
  });