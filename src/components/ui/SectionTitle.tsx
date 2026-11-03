import { ui } from "@/components/ui/styles";

export function SectionTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title?: string; subtitle?: string }) {
  return (
    <div className="flex flex-col gap-1">
      {eyebrow !== undefined ? <p className={ui.eyebrow}>{eyebrow}</p> : null}
      {title !== undefined ? <h1 className={`${ui.title1} sm:text-3xl sm:leading-9`}>{title}</h1> : null}
      {subtitle !== undefined ? <p className="text-muted">{subtitle}</p> : null}
    </div>
  );
}
