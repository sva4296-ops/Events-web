import { Lock } from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";

export function LockedFeature({ message, owner }: { message: string; owner: boolean }) {
  return (
    <EmptyState
      icon={Lock}
      message={owner ? `${message} Poți schimba planul din aplicație.` : message}
    />
  );
}
