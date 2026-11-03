import { ChevronLeft, UserRound } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const PILL = "flex min-h-11 items-center rounded-full bg-surface text-sm font-semibold text-ink transition hover:brightness-95";

function BackLink() {
  return (
    <Link href="/events" className={`${PILL} gap-1 pl-2.5 pr-4`}>
      <ChevronLeft size={18} aria-hidden="true" />
      Evenimente
    </Link>
  );
}

function AccountLink() {
  return (
    <Link href="/account" className={`${PILL} gap-2 px-3.5`} aria-label="Cont">
      <UserRound size={18} aria-hidden="true" />
      <span className="hidden sm:inline">Cont</span>
    </Link>
  );
}

/** The cover across the whole window. It sits in the event's layout, so changing tab only swaps the content under it. */
export function EventChrome({
  name,
  meta,
  countdown,
  cover,
}: {
  name: string;
  meta: string;
  countdown: { value: string | null; label: string } | null;
  /** The EventCover, drawn on the server. */
  cover: ReactNode;
}) {
  return (
    <div className="full-bleed relative -mt-8 overflow-hidden text-white lg:-mt-12">
      {cover}
      {/* A dark scrim so the white text reads on any photo or drawn cover. */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent from-30% to-black/60" />
      <div className="relative mx-auto flex min-h-[340px] max-w-[1240px] flex-col justify-between gap-12 px-4 pb-6 pt-4 sm:px-8 md:min-h-[440px] md:pb-9 md:pt-5">
        <nav aria-label="Principal" className="flex items-center justify-between gap-3">
          <BackLink />
          <AccountLink />
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-6 md:gap-8">
          <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-2">
            <h1 className="font-theme text-[38px] leading-[46px] tracking-[-0.5px] md:text-[72px] md:leading-[80px] md:tracking-[-1px]">
              {name}
            </h1>
            <p className="text-sm text-white/90 first-letter:uppercase md:text-base">{meta}</p>
          </div>
          {countdown !== null ? (
            countdown.value !== null ? (
              <p className="flex items-end gap-3">
                <span className="font-theme text-[64px] leading-[56px] tracking-[-2px] md:text-[96px] md:leading-[84px]">
                  {countdown.value}
                </span>
                <span className="max-w-24 text-[15px] leading-5 text-white/90">{countdown.label}</span>
              </p>
            ) : (
              <p className="font-theme text-[22px] leading-8">{countdown.label}</p>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
