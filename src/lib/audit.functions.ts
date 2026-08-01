import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const runIdeaAudit = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data }) => {
    const { runAudit } = await import("./audit.server");
    return runAudit(data.slug);
  });