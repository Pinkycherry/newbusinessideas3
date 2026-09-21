import caseStudiesRaw from "../../data/case-studies.json";

export type Milestone = {
  month: string;
  milestone_title: string;
  key_action: string;
};

export type CaseStudy = {
  id: string;
  slug: string;
  story_theme: string;
  title: string;
  data_level: string;
  status: string;
  problem_identified: string;
  solution_and_offer: string;
  execution_milestones: Milestone[];
  tech_stack_and_tools: string[];
  customer_acquisition_tactics: string[];
  primary_bottleneck_and_fix: string;
  key_takeaways_for_founders: string[];
  is_composite: string;
};

/**
 * Only verified stories are published. Nothing else reaches a reader.
 *
 * Every entry in the JSON is currently marked `PLACEHOLDER` — illustrative
 * composites written to settle the page's shape, not real operators. They were
 * rendering publicly under a "Placeholder" badge next to a shield icon, on a
 * page whose own promise is "no vanity metrics". A made-up breakdown presented
 * beside that sentence does more damage than an empty page does.
 *
 * The filter is here rather than in the route so that the sitemap, the
 * learning-resources count, the /sitemap page and the story route itself all
 * agree: an unverified story is not listed, not counted, and has no URL.
 *
 * To publish one: replace its `data_level` with a value other than
 * PLACEHOLDER, once the numbers in it are real and checkable.
 */
const ALL_CASE_STUDIES: CaseStudy[] = caseStudiesRaw.case_studies as CaseStudy[];

export const CASE_STUDIES: CaseStudy[] = ALL_CASE_STUDIES.filter(
  (c) => c.data_level?.toUpperCase() !== "PLACEHOLDER",
);

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
