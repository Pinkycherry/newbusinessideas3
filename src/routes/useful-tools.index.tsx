import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/useful-tools/")({
  beforeLoad: () => {
    throw redirect({
      to: "/calculator",
      replace: true,
    });
  },
  component: () => null,
});
