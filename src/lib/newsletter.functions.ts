import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { db } from "./ideas.functions";

/**
 * Newsletter signup.
 *
 * Writes a real row into `public.newsletter_signups`, which already exists
 * with an insert-only RLS policy — the browser can add a row and read none,
 * which is exactly right for an email list.
 *
 * The alternative would have been a Subscribe button that does nothing, and a
 * control that pretends to work is worse than no control at all.
 */
export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        email: z.string().trim().toLowerCase().email("That does not look like an email address."),
        source: z.string().max(60).default("footer"),
      })
      .parse(input),
  )
  .handler(async ({ data: input }): Promise<{ ok: true }> => {
    const { error } = await db()
      .from("newsletter_signups")
      .insert({ email: input.email, source: input.source });

    // A duplicate is a success from the reader's point of view — they asked to
    // be on the list and they are on the list. Only surface real failures.
    if (error && !/duplicate|unique/i.test(error.message)) {
      throw new Error("Could not sign you up just now. Try again in a moment.");
    }
    return { ok: true };
  });
