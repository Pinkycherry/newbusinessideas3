import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Breadcrumbs } from "@/components/site-shell";
import { V2Frame } from "@/components/v2/frame";
import { ExploreRail } from "@/components/explore-rail";
import { JsonLd, breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { getCaseStudyBySlug, CASE_STUDIES } from "@/lib/case-studies-data";

export const Route = createFileRoute("/founder-stories/$slug")({
  head: ({ params }) => {
    const study = getCaseStudyBySlug(params.slug);
    const title = study ? `${study.title} | Source-backed Founder Story` : "Founder Story Not Found | BusinessIdea.io";
    const description = study
      ? `A source-backed founder story about ${study.story_theme}. Review the evidence links and stated limitations.`
      : "This founder story is not part of the published, source-checked collection.";
    return { meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      ...(!study ? [{ name: "robots", content: "noindex,nofollow" }] : []),
    ] };
  },
  component: FounderStoryDetailPage,
});

function FounderStoryDetailPage() {
  const { slug } = Route.useParams();
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    return <V2Frame>
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">This founder story is not published.</h1>
        <p className="mt-2 text-muted-foreground">The story may be a draft, a composite or a record that does not yet meet the evidence requirements.</p>
        <Link to="/case-studies" className="mt-6 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold hover:border-primary/50"><ArrowLeft size={16}/> Back to case studies</Link>
      </div>
    </V2Frame>;
  }

  const currentIndex = CASE_STUDIES.findIndex((item) => item.slug === study.slug);
  const prevStudy = currentIndex > 0 ? CASE_STUDIES[currentIndex - 1] : null;
  const nextStudy = currentIndex < CASE_STUDIES.length - 1 ? CASE_STUDIES[currentIndex + 1] : null;

  return <>
    <JsonLd schema={[
      webPageSchema({
        path: `/founder-stories/${study.slug}`,
        name: study.title,
        description: `A source-backed founder story about ${study.story_theme}; review the evidence and limitations.`,
      }),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Founder Stories", path: "/founder-stories" },
        { name: study.title, path: `/founder-stories/${study.slug}` },
      ]),
    ]}/>
    <V2Frame>
      <div className="mx-auto max-w-4xl px-3 py-10 sm:px-6 sm:py-14">
        <Breadcrumbs items={[
          { label: "Home", to: "/" },
          { label: "Founder Stories", to: "/founder-stories" },
          { label: study.title },
        ]}/>
        <header className="mt-8 border-b border-border/70 pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">{study.story_theme}</span>
            {study.data_level && <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">Evidence level: {study.data_level}</span>}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{study.title}</h1>
          {(study.founder_name || study.location) && <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">{study.founder_name && <span>Founder: <strong className="text-foreground">{study.founder_name}</strong></span>}{study.location && <span>Location: <strong className="text-foreground">{study.location}</strong></span>}</div>}
        </header>

        <section className="my-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Problem</p><h2 className="mt-2 text-xl font-bold">What the business set out to solve</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{study.problem_identified}</p></div>
          <div className="rounded-2xl border bg-card p-6"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Offer</p><h2 className="mt-2 text-xl font-bold">The proposed solution</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{study.solution_and_offer}</p></div>
        </section>

        {study.execution_milestones.length>0 && <section className="my-8 rounded-2xl border bg-card p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-wider text-primary">Reported sequence</p><h2 className="mt-2 text-2xl font-bold">Actions and milestones</h2><div className="mt-6 space-y-5">{study.execution_milestones.map((milestone,index)=><article key={`${milestone.milestone_title}-${index}`} className="flex gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{index+1}</span><div className="min-w-0 flex-1 border-b pb-5 last:border-0"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{milestone.month}</p><h3 className="mt-1 font-bold">{milestone.milestone_title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{milestone.key_action}</p></div></article>)}</div></section>}

        <section className="my-8 grid gap-6 md:grid-cols-2">
          {study.customer_acquisition_tactics.length>0 && <div className="rounded-2xl border bg-card p-6"><h2 className="text-lg font-bold">Customer acquisition approaches</h2><ul className="mt-4 space-y-3">{study.customer_acquisition_tactics.map((tactic,index)=><li key={index} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary"/><span>{tactic}</span></li>)}</ul></div>}
          {study.tech_stack_and_tools.length>0 && <div className="rounded-2xl border bg-card p-6"><h2 className="text-lg font-bold">Tools and infrastructure mentioned</h2><div className="mt-4 flex flex-wrap gap-2">{study.tech_stack_and_tools.map(tool=><span key={tool} className="rounded-lg border bg-muted/30 px-3 py-1.5 text-xs font-medium">{tool}</span>)}</div></div>}
        </section>

        {study.primary_bottleneck_and_fix && <section className="my-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-wider text-amber-900">Reported constraint</p><h2 className="mt-2 text-xl font-bold text-amber-950">A bottleneck and the response</h2><p className="mt-3 text-sm leading-7 text-amber-950">{study.primary_bottleneck_and_fix}</p></section>}

        {study.key_takeaways_for_founders.length>0 && <section className="my-8 rounded-2xl border bg-card p-6 sm:p-8"><h2 className="text-xl font-bold">Questions for other founders</h2><div className="mt-5 space-y-3">{study.key_takeaways_for_founders.map((takeaway,index)=><div key={index} className="flex items-start gap-3 rounded-xl border bg-background/50 p-4"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary"/><span className="text-sm leading-6">{takeaway}</span></div>)}</div></section>}

        <section className="my-8 rounded-2xl border bg-muted/20 p-6 sm:p-8">
          <h2 className="text-xl font-bold">Evidence and limitations</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{study.evidence_notes}</p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t pt-4">{study.sources!.map(source=><a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline">{source.label}{source.source_type? ` · ${source.source_type}`:""} <ExternalLink size={14}/></a>)}</div>
        </section>

        <nav className="mt-12 grid gap-4 border-t pt-6 sm:grid-cols-2" aria-label="Other founder stories">
          {prevStudy ? <Link to="/founder-stories/$slug" params={{slug:prevStudy.slug}} className="rounded-xl border bg-card p-4 hover:border-primary/50"><span className="text-xs text-muted-foreground">Previous story</span><span className="mt-1 block font-semibold">{prevStudy.title}</span></Link> : <div/>}
          {nextStudy ? <Link to="/founder-stories/$slug" params={{slug:nextStudy.slug}} className="rounded-xl border bg-card p-4 text-right hover:border-primary/50"><span className="text-xs text-muted-foreground">Next story</span><span className="mt-1 block font-semibold">{nextStudy.title}</span></Link> : <div/>}
        </nav>
        <ExploreRail exclude="founderStories" heading="Keep exploring"/>
      </div>
    </V2Frame>
  </>;
}
