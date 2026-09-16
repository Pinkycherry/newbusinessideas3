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

export const CASE_STUDIES: CaseStudy[] = caseStudiesRaw.case_studies as CaseStudy[];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
