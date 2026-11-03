import { MessageCircle } from "lucide-react";
import Image from "next/image";

import { BrandMark } from "@/components/BrandMark";

import { lp } from "./styles";

/** Illustrative UI mockups used across the landing page and its overlays. */

export function Photo({ n, className = "" }: { n: number; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src={`/landing/img-${n}.jpg`} alt="" fill sizes="160px" className="object-cover" />
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

export function Phone({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="mx-auto h-[580px] w-[290px] rounded-[38px] bg-[#2A211C] p-[11px] shadow-2xl shadow-black/25" aria-hidden="true">
      <div
        className={`relative flex h-full w-full flex-col overflow-hidden rounded-[28px] text-[#2A211C] ${dark ? "bg-[#2A211C]" : "bg-[#EEE5D9]"}`}
      >
        <div className="absolute left-1/2 top-[11px] z-10 h-[21px] w-[88px] -translate-x-1/2 rounded-full bg-[#2A211C]" />
        {children}
      </div>
    </div>
  );
}

function PhoneSpacer() {
  return <div className="h-[42px] shrink-0" />;
}

const phoneCard = "rounded-xl border border-[#E0D4C4] bg-white";

export function InviteScreen() {
  return (
    <Phone>
      <div className={`flex h-40 flex-col items-center justify-center text-center text-white ${lp.gradBg}`}>
        <p className="mb-1 text-[9px] font-bold tracking-[0.2em] opacity-90">NUNTĂ</p>
        <p className="font-display text-[22px] font-bold">Maria &amp; Andrei</p>
        <p className="mt-0.5 text-[11px] opacity-90">12 septembrie 2026</p>
      </div>
      <div className="p-4">
        <div className={`${phoneCard} p-4 text-center`}>
          <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-accent-text">Ești invitat</p>
          <p className="mb-3 text-xs text-[#958879]">Vii alături de noi în ziua cea mare?</p>
          <div className="rounded-full bg-accent-fill py-2 text-xs font-semibold text-on-accent">Da, particip</div>
          <div className="mt-2 rounded-full border-[1.5px] border-accent py-2 text-xs font-semibold text-accent-text">
            Vezi mai întâi
          </div>
        </div>
      </div>
    </Phone>
  );
}

function FeedPost({ when, title, photo, likes, comments, chat }: { when: string; title: string; photo: number; likes: number; comments: number; chat?: boolean }) {
  return (
    <div className={`${phoneCard} mb-2.5 overflow-hidden`}>
      <p className="px-3 pt-2.5 text-[9.5px] text-[#958879]">{when}</p>
      <p className="px-3 pb-2 pt-0.5 text-xs font-bold">{title}</p>
      <Photo n={photo} className="mx-3 h-[72px] rounded-lg" />
      <div className="flex gap-3 px-3 py-2 text-[10.5px] text-[#958879]">
        <span className="font-bold text-pink">● {likes}</span>
        <span>● {comments}</span>
        {chat === true && <MessageCircle size={14} strokeWidth={1.8} className="ml-auto" aria-hidden="true" />}
      </div>
    </div>
  );
}

export function FeedScreen() {
  return (
    <Phone>
      <PhoneSpacer />
      <div className="p-4">
        <div className="mb-3 flex items-center gap-2 px-0.5">
          <BrandMark className="h-3 w-5" />
          <span className="text-xs font-bold">Maria &amp; Andrei</span>
        </div>
        <FeedPost when="acum 3 zile" title="Am ales rochia! 👰" photo={2} likes={24} comments={12} chat />
        <FeedPost when="acum 2 săptămâni" title="Ei sunt nașii noștri 💛" photo={3} likes={38} comments={9} />
      </div>
    </Phone>
  );
}

export function LiveScreen() {
  return (
    <Phone dark>
      <PhoneSpacer />
      <div className="flex flex-1 flex-col items-center justify-center gap-3.5 p-5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
          <LiveDot /> LIVE · în sală
        </div>
        <div className="grid w-full grid-cols-3 gap-1.5">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="aspect-square rounded-md bg-[#2A2440]" />
          ))}
        </div>
        <div className="size-[84px] rounded-xl bg-white p-2">
          <QrMark className="size-full" />
        </div>
        <p className="text-[10px] text-[#C9BDB0]">Scanează și adaugă pozele tale</p>
      </div>
    </Phone>
  );
}

export function RecapScreen() {
  const photos = [10, 11, 12, 13, 14, 15, 16, 17, 10];
  return (
    <Phone>
      <PhoneSpacer />
      <div className="p-4">
        <div className="mb-3 text-center">
          <p className="text-[9px] font-bold uppercase tracking-wider text-accent-text">Povestea s-a întâmplat</p>
          <p className="mt-1 font-display text-lg font-bold">A fost minunat</p>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {photos.map((n, i) => (
            <Photo key={i} n={n} className="aspect-square rounded-md" />
          ))}
        </div>
      </div>
    </Phone>
  );
}
