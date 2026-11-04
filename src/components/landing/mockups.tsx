import { Check, ChevronLeft, ClipboardList, Heart, House, ImagePlus, Images, MessageCircleHeart, Star, Users } from "lucide-react";
import Image from "next/image";

import { EventCover } from "@/components/EventCover";

/** Illustrative mockups of the app (its default theme, Teracotă, in both modes), used across the landing page and its overlays. */

export function Photo({ n, className = "", sizes = "160px" }: { n: number; className?: string; sizes?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src={`/landing/img-${n}.jpg`} alt="" fill sizes={sizes} className="object-cover" />
    </div>
  );
}

export function QrMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
      <rect x="0" y="0" width="10" height="10" fill="#2A211C" />
      <rect x="26" y="0" width="10" height="10" fill="#2A211C" />
      <rect x="0" y="26" width="10" height="10" fill="#2A211C" />
      <rect x="14" y="4" width="4" height="4" fill="#2A211C" />
      <rect x="18" y="14" width="4" height="4" fill="#2A211C" />
      <rect x="26" y="18" width="4" height="4" fill="#2A211C" />
      <rect x="14" y="26" width="4" height="4" fill="#2A211C" />
      <rect x="30" y="30" width="4" height="4" fill="#2A211C" />
    </svg>
  );
}

export function LiveDot() {
  return <span className="size-2 animate-pulse rounded-full bg-[#E24B4A]" />;
}

export function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto h-[580px] w-[290px] rounded-[38px] bg-[#2A211C] p-[11px] shadow-2xl shadow-black/25" aria-hidden="true">
      <div className="phone-light relative flex h-full w-full flex-col overflow-hidden rounded-[28px] bg-[#EEE5D9] text-[#2A211C]">
        <div className="absolute left-1/2 top-[9px] z-10 h-[19px] w-[80px] -translate-x-1/2 rounded-full bg-[#2A211C]" />
        {children}
      </div>
    </div>
  );
}

const TABS = [
  { label: "Acasă", icon: House },
  { label: "Plan", icon: ClipboardList },
  { label: "Invitați", icon: Users },
  { label: "Chat", icon: MessageCircleHeart },
  { label: "Album", icon: Images },
];

function PhoneTabs({ active }: { active: string }) {
  return (
    <div className="mt-auto flex shrink-0 justify-between border-t border-[#E0D4C4] bg-white px-1.5 pb-3 pt-1.5">
      {TABS.map(({ label, icon: Icon }) => (
        <span key={label} className={`flex flex-1 flex-col items-center gap-0.5 text-[8.5px] ${label === active ? "font-semibold text-[#9A462F]" : "text-[#6A5E54]"}`}>
          <span className={`flex h-[22px] w-9 items-center justify-center rounded-full ${label === active ? "bg-[#F3E2DA]" : ""}`}>
            <Icon size={15} strokeWidth={label === active ? 2 : 1.8} />
          </span>
          {label}
        </span>
      ))}
    </div>
  );
}

/** The cover on top of an event page: back button, name, date and place over a dark fade. */
function PhoneHero({ name = "Maria & Andrei", meta = "12 septembrie · Castelul Bánffy" }: { name?: string; meta?: string }) {
  return (
    <EventCover type="wedding" className="h-[172px] shrink-0">
      <span className="absolute left-3 top-9 flex size-7 items-center justify-center rounded-full bg-white text-[#2A211C]">
        <ChevronLeft size={15} />
      </span>
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-b from-transparent to-black/60 px-3.5 pb-3 pt-8 text-white">
        <p className="font-theme text-[23px] leading-7">{name}</p>
        <p className="text-[9.5px] text-white/85">{meta}</p>
      </div>
    </EventCover>
  );
}

function MiniStages({ stage }: { stage: number }) {
  return (
    <div className="flex">
      {["Lansarea", "Parcursul", "Nunta", "Recap"].map((label, index) => (
        <span key={label} className="flex flex-1 flex-col items-center gap-1">
          <span
            className={`flex size-3.5 items-center justify-center rounded-full ${
              index < stage ? "bg-[#A54E36] text-white" : index === stage ? "bg-[#A54E36] ring-[3px] ring-[#F3E2DA]" : "border-[1.5px] border-[#E0D4C4] bg-white"
            }`}
          >
            {index < stage ? <Check size={8} strokeWidth={3} /> : null}
          </span>
          <span className={`text-[8px] ${index === stage ? "font-semibold" : "text-[#6A5E54]"}`}>{label}</span>
        </span>
      ))}
    </div>
  );
}

function Reactions({ likes, stars }: { likes: number; stars: number }) {
  return (
    <div className="flex gap-1.5 text-[10px] font-semibold">
      <span className="flex h-6 items-center gap-1 rounded-full bg-[#F3E2DA] px-2 text-[#9A462F]">
        <Heart size={10} fill="currentColor" />
        {likes}
      </span>
      <span className="flex h-6 items-center gap-1 rounded-full bg-[#FDF1DC] px-2 text-[#8A5A0A]">
        <Star size={10} />
        {stars}
      </span>
    </div>
  );
}

export function InviteScreen() {
  return (
    <Phone>
      <EventCover type="wedding" className="flex h-[210px] shrink-0 items-center justify-center pt-5">
        <span className="absolute left-3 top-9 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-semibold text-[#2A211C]">Nuntă</span>
      </EventCover>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="text-center">
          <p className="font-display text-[23px] leading-7 font-semibold">Maria &amp; Andrei</p>
          <p className="mt-1 text-[11px] leading-4">„Vă așteptăm cu drag alături de noi.”</p>
          <p className="mt-1.5 text-[10px] text-[#6A5E54]">12 septembrie 2026 · Castelul Bánffy</p>
        </div>
        <div className="rounded-2xl border border-[#E0D4C4] bg-white p-3">
          <p className="mb-2 text-[12px] font-semibold">Poți ajunge?</p>
          <div className="rounded-full bg-[#A54E36] py-2.5 text-center text-[11px] font-semibold text-white">Confirmă participarea</div>
          <div className="mt-1.5 rounded-full bg-[#E2D5C3] py-2.5 text-center text-[11px] font-semibold text-[#6A5E54]">Nu pot participa</div>
        </div>
      </div>
    </Phone>
  );
}

export function FeedScreen() {
  return (
    <Phone>
      <PhoneHero />
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden px-3.5 pt-3">
        <div className="flex items-center gap-2">
          <span className="text-[30px] leading-8 font-medium">42</span>
          <span className="text-[9.5px] leading-3 text-[#6A5E54]">
            zile
            <br />
            până la nuntă
          </span>
        </div>
        <MiniStages stage={1} />
        <div className="flex flex-col gap-2 rounded-[18px] border border-[#E0D4C4] bg-white p-2.5">
          <div>
            <p className="text-[12px] font-semibold">Am ales rochia!</p>
            <p className="text-[9px] text-[#6A5E54]">acum 3 zile</p>
          </div>
          <Photo n={2} className="h-[92px] rounded-xl" />
          <Reactions likes={24} stars={12} />
        </div>
      </div>
      <PhoneTabs active="Acasă" />
    </Phone>
  );
}

export function LiveScreen() {
  const photos = [10, 11, 12, 13, 14, 15];
  return (
    <Phone>
      <PhoneHero />
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden px-3.5 pt-3">
        <div className="flex items-center gap-3 rounded-2xl border border-[#E0D4C4] bg-white p-2.5">
          <div className="size-[52px] shrink-0 rounded-lg border border-[#E0D4C4] p-1">
            <QrMark className="size-full" />
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold">
              <LiveDot /> LIVE · în sală
            </p>
            <p className="text-[9.5px] leading-3 text-[#6A5E54]">Scanează și adaugă pozele tale</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {photos.map((n) => (
            <Photo key={n} n={n} className="aspect-square rounded-lg" />
          ))}
        </div>
        <div className="flex items-center justify-center gap-1.5 rounded-full bg-[#A54E36] py-2 text-[10.5px] font-semibold text-white">
          <ImagePlus size={13} /> Adaugă poze
        </div>
      </div>
    </Phone>
  );
}

export function RecapScreen() {
  const photos = [10, 11, 12, 13, 14, 15, 16, 17, 10];
  return (
    <Phone>
      <PhoneHero />
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden px-3.5 pt-3">
        <div>
          <p className="text-[8.5px] font-semibold uppercase tracking-[1px] text-[#6A5E54]">Povestea s-a întâmplat</p>
          <p className="font-theme text-[20px] leading-6">A fost minunat</p>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {photos.map((n, i) => (
            <Photo key={i} n={n} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
      <PhoneTabs active="Album" />
    </Phone>
  );
}

/* The small previews on the four stage cards. */

export function StageInvite() {
  return (
    <EventCover type="wedding" className="h-full">
      <div className="absolute inset-0 flex flex-col items-center justify-end bg-linear-to-b from-transparent to-black/55 p-3 text-center text-white">
        <p className="font-display text-[17px] leading-5 font-semibold">Maria &amp; Andrei</p>
        <p className="mb-2 text-[10px] text-white/85">12 septembrie 2026</p>
        <p className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-[#2A211C]">Confirmă participarea</p>
      </div>
    </EventCover>
  );
}

export function StageMoment() {
  return (
    <div className="flex h-full flex-col gap-1.5 bg-white p-2">
      <Photo n={2} className="min-h-0 flex-1 rounded-lg" />
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[11px] font-semibold">Am ales rochia!</p>
        <Reactions likes={24} stars={12} />
      </div>
    </div>
  );
}

export function StageLive() {
  return (
    <div className="flex h-full items-center gap-3 bg-white p-3">
      <div className="size-[70px] shrink-0 rounded-lg border border-[#E0D4C4] p-1.5">
        <QrMark className="size-full" />
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold">
          <LiveDot /> LIVE · în sală
        </p>
        <p className="text-[10px] leading-[13px] text-[#6A5E54]">Scanează și adaugă poze</p>
        <div className="mt-0.5 grid grid-cols-3 gap-1">
          {[11, 12, 13].map((n) => (
            <Photo key={n} n={n} className="aspect-square rounded-[4px]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function StageAlbum() {
  return (
    <div className="grid h-full grid-cols-3 gap-1.5 bg-white p-2">
      {[4, 5, 6, 7, 8, 9].map((n) => (
        <Photo key={n} n={n} className="rounded-md" />
      ))}
    </div>
  );
}
