import { notFound, redirect } from "next/navigation";

import { isSectionKey } from "@/lib/details";

/** Old per-section links: every section now lives on the one Plan page. */
export default async function PlanSectionPage({ params }: PageProps<"/event/[id]/details/[section]">) {
  const { id, section } = await params;
  if (!isSectionKey(section)) notFound();
  redirect(`/event/${id}/details#${section}`);
}
