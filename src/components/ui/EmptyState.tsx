import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { ui } from "@/components/ui/styles";

export function EmptyState({
  icon: Icon,
  message,
  action,
}: {
  icon?: LucideIcon;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className={`${ui.cardPadded} flex flex-col items-center gap-4 py-10 text-center`}>
      {Icon !== undefined ? (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Icon size={22} aria-hidden="true" />
        </span>
      ) : null}
      <p className="max-w-sm text-muted">{message}</p>
      {action}
    </div>
  );
}
