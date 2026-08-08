import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getValidateUrl = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z
      .object({ slug: z.string().min(1).max(200), platform: z.enum(["claude", "perplexity"]) })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { buildValidateUrl } = await import("./validate.server");
    return buildValidateUrl(data.platform, data.slug);
  });
