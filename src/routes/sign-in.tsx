import { createFileRoute, redirect } from "@tanstack/react-router";

// AdSense review (founder, 6 Nov 2026): bbusiness.online is free with no sign-up. The URL moves home.
export const Route = createFileRoute("/sign-in")({
  beforeLoad: () => {
    throw redirect({ href: "/", replace: true, statusCode: 301 });
  },
});
