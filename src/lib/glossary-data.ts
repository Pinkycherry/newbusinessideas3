import glossaryRaw from "../../data/glossary.json";

export type GlossaryTerm = {
  term: string;
  slug: string;
  category: string;
  definition: string;
  why_it_matters?: string;
  example_in_practice?: string;
  related_terms?: string[];
  formula?: string;
  example_or_formula?: string;
};

export const GLOSSARY_DATA: GlossaryTerm[] = glossaryRaw.glossary as GlossaryTerm[];

export const GLOSSARY_CATEGORIES = Array.from(new Set(GLOSSARY_DATA.map((t) => t.category))).sort();

export function getTermBySlug(slug: string): GlossaryTerm | undefined {
  return GLOSSARY_DATA.find((t) => t.slug === slug);
}
