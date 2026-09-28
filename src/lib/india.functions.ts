/**
 * Server functions for the India Idea Atlas. Browsing never calls a model:
 * these only read published rows (or the labelled draft fixtures).
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  directorySearchSchema,
  setSearchSchema,
  type IndiaDirectory,
  type IndiaIdea,
  type IndiaSetPage,
} from "./india-shared";
import { loadIndiaDirectory, loadIndiaIdeas, loadIndiaSet } from "./india.server";

export const getIndiaDirectory = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => directorySearchSchema.parse(input))
  .handler(({ data }): Promise<IndiaDirectory> => loadIndiaDirectory(data));

export const getIndiaSet = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z
      .object({
        slug: z
          .string()
          .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
          .max(90),
      })
      .merge(setSearchSchema)
      .parse(input),
  )
  .handler(({ data: { slug, ...search } }): Promise<IndiaSetPage | null> =>
    loadIndiaSet(slug, search),
  );

export const getIndiaIdeas = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z
      .object({
        keys: z
          .array(
            z
              .string()
              .regex(/^[a-z0-9-]+$/)
              .max(120),
          )
          .max(3),
      })
      .parse(input),
  )
  .handler(({ data }): Promise<IndiaIdea[]> => loadIndiaIdeas(data.keys));
