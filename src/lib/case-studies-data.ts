import caseStudiesRaw from "../../data/case-studies.json";

export type Milestone = {
  month: string;
  milestone_title: string;
  key_action: string;
};

export type CaseStudySource = {
  label: string;
  url: string;
  source_type?: string;
  published_at?: string;
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
  founder_name?: string | null;
  location?: string | null;
  evidence_notes?: string | null;
  published_at?: string | null;
  sources?: CaseStudySource[];
};

/**
 * A case is public only when it is not a placeholder/composite and carries
 * an evidence note plus at least one labelled HTTPS source. Changing the
 * data_level field alone can never publish a draft story.
 */
const ALL_CASE_STUDIES: CaseStudy[] = caseStudiesRaw.case_studies as CaseStudy[];

function hasPublishableEvidence(study: CaseStudy): boolean {
  const sources = Array.isArray(study.sources) ? study.sources : [];
  const hasValidSources = sources.length > 0 && sources.every((source) => {
    if (!source || typeof source.label !== "string" || !source.label.trim() || typeof source.url !== "string") return false;
    try {
      return new URL(source.url).protocol === "https:";
    } catch {
      return false;
    }
  });
  const isComposite = /composite|illustrative/i.test(study.is_composite || "");
  return study.data_level?.trim().toUpperCase() !== "PLACEHOLDER"
    && !isComposite
    && Boolean(study.evidence_notes?.trim())
    && hasValidSources;
}

export const CASE_STUDIES: CaseStudy[] = ALL_CASE_STUDIES.filter(hasPublishableEvidence);

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((study) => study.slug === slug);
}
