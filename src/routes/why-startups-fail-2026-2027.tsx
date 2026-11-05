import { createFileRoute } from "@tanstack/react-router";
import { WhyStartupsFailPage } from "@/components/v2/failure-research";

export const Route = createFileRoute("/why-startups-fail-2026-2027")({
  head: () => ({ meta: [
    { title: "Why Startups Fail in 2026 and What to Watch in 2027 | bbusiness.online" },
    { name: "description", content: "India-first analysis of buyer demand, delivery economics and cash timing, with verified cases and clearly labelled 2027 scenarios." },
    { name: "robots", content: "noindex,nofollow" },
    { property: "og:image", content: "/images/failure-runway.svg" },
  ] }),
  component: WhyStartupsFailPage,
});
