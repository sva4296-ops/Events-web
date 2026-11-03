import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** The app's EmptyState: soft card, centered muted text. */
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
    <div className="flex flex-col items-center gap-4 rounded-[24px] border border-surface-border bg-surface px-5 py-8 text-center">
      {Icon !== undefined ? (
        <span className="flex size-11 items-center justify-center rounded-full bg-pending/10 text-pending">
          <Icon size={20} aria-hidden="true" />
        </span>
      ) : null}
      <p className="max-w-sm text-[15px] leading-[22px] text-muted">{message}</p>
      {action}
    </div>
  );
}
