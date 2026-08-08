import { createFileRoute } from "@tanstack/react-router";

import { db } from "@/lib/ideas.functions";
import { urlsetXml, xmlResponse } from "@/lib/sitemap";

export const Route = createFileRoute("/sitemap-ideas.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { data, error } = await db()
          .from("ideas")
          .select("slug,created_at")
          .eq("status", "completed");
        if (error) throw new Error(error.message);

        const urls = ((data ?? []) as { slug: string; created_at: string | null }[]).map((row) => ({
          path: `/idea/${row.slug}`,
          lastmod: row.created_at,
        }));

        return xmlResponse(urlsetXml(urls));
      },
    },
  },
});
