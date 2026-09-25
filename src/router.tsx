import {
  QueryClient,
  defaultShouldDehydrateQuery,
  dehydrate,
  hydrate,
} from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // Restore the public homepage queries before React hydrates. The server
    // already fetched them; starting with an empty client cache repeats that
    // work and suspends the first render. Keep other query/mutation data out.
    dehydrate: () => ({
      // These successful public query results are plain JSON. Encoding the
      // snapshot also satisfies Router's strict serializable-state contract.
      publicQueries: JSON.stringify(
        dehydrate(queryClient, {
          shouldDehydrateQuery: (query) =>
            defaultShouldDehydrateQuery(query) &&
            (query.queryKey[0] === "catalog" || query.queryKey[0] === "featured"),
          shouldDehydrateMutation: () => false,
        }),
      ),
    }),
    hydrate: (state) => {
      hydrate(queryClient, JSON.parse(state.publicQueries));
    },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
