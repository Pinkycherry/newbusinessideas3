type ChecklistProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  items: readonly string[];
};

/** Questions and prompts from former browser-local worksheets, now readable without storing input. */
export function ReadOnlyChecklist({ id, eyebrow, title, intro, items }: ChecklistProps) {
  return <section id={id} className="mx-auto max-w-6xl scroll-mt-28 px-4 py-12 md:px-6 lg:py-16">
    {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-violet-600">{eyebrow}</p>}
    <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">{title}</h2>
    {intro && <p className="mt-3 max-w-3xl text-slate-600">{intro}</p>}
    <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => <li key={`${index}-${item}`} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">{index + 1}</span>
        <span className="self-center font-medium text-slate-800">{item}</span>
      </li>)}
    </ol>
  </section>;
}
