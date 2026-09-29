export function SectionTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title?: string; subtitle?: string }) {
  return (
    <div className="flex flex-col gap-1">
      {eyebrow !== undefined ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
      ) : null}
      {title !== undefined ? <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1> : null}
      {subtitle !== undefined ? <p className="text-muted">{subtitle}</p> : null}
    </div>
  );
}
