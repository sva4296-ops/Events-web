import Link from "next/link";
import type { ReactNode } from "react";

import { BrandHeader } from "@/components/BrandMark";

export interface LegalSection {
  title: string;
  body: ReactNode;
}

/**
 * Shared layout for /termeni and /confidentialitate. The text is a DRAFT with
 * [PLACEHOLDERS] until the operator details, contact email and data region
 * are confirmed — replace them before the store listings go live.
 */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8">
      <Link href="/" aria-label="PovesteaNoastra, acasă" className="self-start">
        <BrandHeader />
      </Link>

      <div className="flex flex-col gap-3">
        <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-accent-text">Document legal</p>
        <h1 className="font-display text-[34px] font-semibold leading-tight">{title}</h1>
        <p className="text-sm text-muted">Ultima actualizare: {updated}</p>
      </div>

      <div
        role="note"
        className="rounded-2xl bg-pending-soft px-4 py-3 text-sm leading-relaxed text-pending"
      >
        Versiune provizorie. Datele marcate cu [PARANTEZE] vor fi completate înainte de lansare.
      </div>

      <div className="text-[15px] leading-relaxed text-muted">{intro}</div>

      <div className="flex flex-col gap-4">
        {sections.map((section, index) => (
          <section
            key={section.title}
            className="flex flex-col gap-3 rounded-3xl border border-surface-border bg-surface p-5 shadow-card sm:p-6"
          >
            <h2 className="text-[17px] font-bold text-ink">
              {index + 1}. {section.title}
            </h2>
            <div className="flex flex-col gap-2 text-[15px] leading-relaxed text-muted [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink">
              {section.body}
            </div>
          </section>
        ))}
      </div>

      <nav aria-label="Documente legale" className="flex flex-wrap gap-x-6 gap-y-2 pb-8 text-sm font-semibold">
        <Link href="/termeni" className="text-accent-text hover:underline">
          Termeni și condiții
        </Link>
        <Link href="/confidentialitate" className="text-accent-text hover:underline">
          Politica de confidențialitate
        </Link>
      </nav>
    </div>
  );
}
