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
      <rect x="0" y="0" width="10" height="10" fill="#1A1A2E" />
      <rect x="26" y="0" width="10" height="10" fill="#1A1A2E" />
      <rect x="0" y="26" width="10" height="10" fill="#1A1A2E" />
      <rect x="14" y="4" width="4" height="4" fill="#1A1A2E" />
      <rect x="18" y="14" width="4" height="4" fill="#1A1A2E" />
      <rect x="26" y="18" width="4" height="4" fill="#1A1A2E" />
      <rect x="14" y="26" width="4" height="4" fill="#1A1A2E" />
      <rect x="30" y="30" width="4" height="4" fill="#1A1A2E" />
    </svg>
  );
}

export function LiveDot() {
  return <span className="size-2 animate-pulse rounded-full bg-[#E24B4A]" />;
}

/** Fund card shown in the contributions section and overlays. */
export function FundDemo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${lp.card} ${compact ? "p-4" : "p-5 shadow-xl shadow-black/5"}`}>
      <p className="text-[11px] font-bold uppercase tracking-wider text-accent">Luna de miere în Grecia</p>
      <p className={`mt-1.5 font-bold ${compact ? "text-sm" : "text-base"}`}>Ajută-i pe Maria &amp; Andrei 🌊</p>
      <div className="mb-2 mt-3.5 flex justify-between text-sm font-semibold">
        <span className="text-accent">5.420 lei</span>
        <span className="text-muted">din 8.000 lei</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-surface-muted">
        <div className="h-full w-[68%] rounded-full bg-linear-to-r from-gold via-pink to-accent" />
      </div>
      <p className="mt-2 text-xs text-muted">42 de invitați au contribuit până acum</p>
      <div className="mt-4 rounded-full bg-gold py-2.5 text-center text-sm font-semibold text-[#2B2740]">
        Contribuie acum
      </div>
    </div>
  );
}

/* ---------- Phone frame ---------- */

export function Phone({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="mx-auto h-[580px] w-[290px] rounded-[38px] bg-[#1E1A30] p-[11px] shadow-2xl shadow-black/25" aria-hidden="true">
      <div
        className={`relative flex h-full w-full flex-col overflow-hidden rounded-[28px] text-[#2B2740] ${dark ? "bg-[#1E1A30]" : "bg-[#FFF8F1]"}`}
      >
        <div className="absolute left-1/2 top-[11px] z-10 h-[21px] w-[88px] -translate-x-1/2 rounded-full bg-[#1E1A30]" />
        {children}
      </div>
    </div>
  );
}

function PhoneSpacer() {
  return <div className="h-[42px] shrink-0" />;
}

const phoneCard = "rounded-xl border border-[#EFE6DD] bg-white";

export function InviteScreen() {
  return (
    <Phone>
      <div className={`flex h-40 flex-col items-center justify-center text-center text-white ${lp.gradBg}`}>
        <p className="mb-1 text-[9px] font-bold tracking-[0.2em] opacity-90">NUNTĂ</p>
        <p className="font-display text-[22px] font-bold italic">Maria &amp; Andrei</p>
        <p className="mt-0.5 text-[11px] opacity-90">12 septembrie 2026</p>
      </div>
      <div className="p-4">
        <div className={`${phoneCard} p-4 text-center`}>
          <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-accent">Ești invitat</p>
          <p className="mb-3 text-xs text-[#8A8496]">Vii alături de noi în ziua cea mare?</p>
          <div className="rounded-full bg-accent py-2 text-xs font-semibold text-white">Da, particip</div>
          <div className="mt-2 rounded-full border-[1.5px] border-accent py-2 text-xs font-semibold text-accent">
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
      <p className="px-3 pt-2.5 text-[9.5px] text-[#8A8496]">{when}</p>
      <p className="px-3 pb-2 pt-0.5 text-xs font-bold">{title}</p>
      <Photo n={photo} className="mx-3 h-[72px] rounded-lg" />
      <div className="flex gap-3 px-3 py-2 text-[10.5px] text-[#8A8496]">
        <span className="font-bold text-pink">● {likes}</span>
        <span>● {comments}</span>
        {chat === true && <span className="ml-auto">💬</span>}
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

export function FundScreen() {
  return (
    <Phone>
      <PhoneSpacer />
      <div className="p-4">
        <div className={`${phoneCard} p-4`}>
          <p className="text-[9px] font-bold uppercase tracking-wider text-accent">Luna de miere în Grecia</p>
          <p className="mb-3 mt-1 text-[13px] font-bold">Ajută-i pe Maria &amp; Andrei 🌊</p>
          <div className="mb-1.5 flex justify-between text-[10.5px] font-semibold">
            <span className="text-accent">5.420 lei</span>
            <span className="text-[#8A8496]">din 8.000 lei</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#FBEAE0]">
            <div className="h-full w-[68%] rounded-full bg-linear-to-r from-gold via-pink to-accent" />
          </div>
          <p className="mt-1.5 text-[9.5px] text-[#8A8496]">42 de invitați au contribuit</p>
          <div className="mt-3 rounded-full bg-gold py-2 text-center text-xs font-semibold">Contribuie acum</div>
        </div>
        <p className="mt-2.5 text-center text-[9.5px] text-[#8A8496]">Plată securizată · banii merg direct la organizator</p>
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
        <p className="text-[10px] text-[#B5B4C8]">Scanează și adaugă pozele tale</p>
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
          <p className="text-[9px] font-bold uppercase tracking-wider text-accent">Povestea s-a întâmplat</p>
          <p className="mt-1 font-display text-lg font-bold italic">A fost minunat</p>
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

export function AmountScreen() {
  return (
    <Phone>
      <div className={`flex h-[120px] flex-col items-center justify-center text-center text-white ${lp.gradBg}`}>
        <p className="font-display text-lg font-bold italic">Contribuie</p>
        <p className="mt-0.5 text-[11px] opacity-90">Alege o sumă</p>
      </div>
      <div className="p-4">
        <div className="mb-3 flex gap-2">
          {["150 lei", "300 lei", "500 lei"].map((amount) => (
            <div
              key={amount}
              className={`flex-1 rounded-lg border-[1.5px] py-2.5 text-center text-[13px] font-bold ${
                amount === "300 lei" ? "border-accent text-accent" : "border-[#EFE6DD]"
              }`}
            >
              {amount}
            </div>
          ))}
        </div>
        <div className="rounded-full bg-accent py-2 text-center text-xs font-semibold text-white">Contribuie 300 lei</div>
        <p className="mt-2.5 text-center text-[9.5px] text-[#8A8496]">🔒 Plată securizată prin Stripe</p>
      </div>
    </Phone>
  );
}

export function OwnerFundScreen() {
  const rows = [
    { name: "Familia Ionescu", amount: "300 lei" },
    { name: "Mihai P.", amount: "150 lei" },
    { name: "Elena și George", amount: "500 lei" },
  ];
  return (
    <Phone>
      <PhoneSpacer />
      <div className="p-4">
        <p className="mb-3.5 px-0.5 text-xs font-bold">Fondul tău</p>
        <div className="mb-3 rounded-xl bg-[#1E1A30] p-4">
          <p className="text-[11px] text-[#B5B4C8]">Strâns până acum</p>
          <p className="font-display text-[26px] font-bold text-gold">5.420 lei</p>
          <p className="text-[10px] text-[#B5B4C8]">din 42 de contribuții</p>
        </div>
        {rows.map((row, i) => (
          <div
            key={row.name}
            className={`flex justify-between py-2 text-xs ${i < rows.length - 1 ? "border-b border-[#EFE6DD]" : ""}`}
          >
            <span className="text-[#8A8496]">{row.name}</span>
            <span className="font-bold text-accent">{row.amount}</span>
          </div>
        ))}
      </div>
    </Phone>
  );
}
