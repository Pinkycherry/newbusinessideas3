import { createFileRoute, Outlet } from "@tanstack/react-router";

// /faq is the new FAQ page (faq.index.tsx); /faq/$categorySlug is the live category FAQ page.
export const Route = createFileRoute("/faq")({ component: Outlet });
