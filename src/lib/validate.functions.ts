import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { VALIDATE_CONTEXT_MAX_LENGTH } from "./validate-shared";

export const getValidateUrl = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z
      .object({
        slug: z.string().min(1).max(200),
        platform: z.enum(["claude", "perplexity"]),
        // Optional free-text box from validate-context-input.tsx — folded
        // into the master prompt server-side, never stored.
        context: z.string().trim().max(VALIDATE_CONTEXT_MAX_LENGTH).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { buildValidateUrl } = await import("./validate.server");
    return buildValidateUrl(data.platform, data.slug, data.context);
  });
