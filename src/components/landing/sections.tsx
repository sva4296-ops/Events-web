import Link from "next/link";
import { useId } from "react";

import { BrandHeader } from "@/components/BrandMark";
import { ui } from "@/components/ui/styles";

import { FAQ, FEATURES, FOR_WHOM, NAV_LINKS, NEW_WAY, OLD_WAY, PLANS, START_STEPS, VERTICALS, WHY_US } from "./data";
import { FundDemo, LiveDot, Photo, QrMark } from "./mockups";
import { OverlayButton } from "./Overlays";
import { lp } from "./styles";

/** Where "start" CTAs lead: the login for visitors, the event list once signed in. */
export interface LandingAuth {
  signedIn: boolean;
  startHref: string;
}

function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: React.ReactNode; lead?: string }) {
  return (
    <div className="text-center">
      <p className={`${lp.eyebrow} ${lp.reveal}`} data-reveal>
        {eyebrow}
      </p>
      <h2 className={`${lp.title} ${lp.reveal}`} data-reveal>
        {title}
      </h2>
      {lead !== undefined && (
        <p className={`${lp.lead} mx-auto ${lp.reveal}`} data-reveal>
          {lead}
        </p>
      )}
    </div>
  );
}

/* ---------- Nav ---------- */

export function LandingNav({ signedIn, startHref }: LandingAuth) {
  const link = "text-[14.5px] font-medium text-muted transition hover:text-ink";
  return (
    <nav className="sticky top-0 z-50 border-b border-surface-border bg-(--bg-from)/85 backdrop-blur-md">
      <div className={`${lp.wrap} flex items-center gap-2.5 py-3.5`}>
        <Link href="/" aria-label="PovesteaNoastra, acasă">
          <BrandHeader />
        </Link>
        <div className="ml-auto flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={`${link} hidden lg:inline`}>
              {l.label}
            </a>
          ))}
          <Link href={signedIn ? "/account" : "/login"} className={`${link} hidden sm:inline`}>
            {signedIn ? "Cont" : "Intră în cont"}
          </Link>
          <Link href={startHref} className={`${ui.buttonPrimary} !px-5 !py-2.5 !text-[15px]`}>
            {signedIn ? "Evenimentele mele" : "Începe gratuit"}
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ---------- Hero ---------- */

function ThreadLine() {
  const id = useId();
  return (
    <svg viewBox="0 0 760 90" className="w-full" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFD23F" />
          <stop offset="0.5" stopColor="#E8779E" />
          <stop offset="1" stopColor="#7F77DD" />
        </linearGradient>
      </defs>
      <path d="M30 50 Q190 18 360 48 T560 42 T730 38" fill="none" stroke={`url(#${id})`} strokeWidth="5" strokeLinecap="round" />
      <circle cx="30" cy="50" r="8" fill="#FFD23F" />
      <circle cx="220" cy="32" r="7" fill="#FF9F45" />
      <circle cx="400" cy="48" r="7" fill="#E8779E" />
      <circle cx="560" cy="42" r="7" fill="#D957A8" />
      <circle cx="730" cy="38" r="13" fill="#7F77DD" />
    </svg>
  );
}

export function Hero({ startHref }: { startHref: string }) {
  return (
    <header id="hero" className="scroll-mt-20 py-16 text-center sm:pb-20 sm:pt-24">
      <div className={lp.wrap}>
        <p className={`${lp.eyebrow} mb-5 text-[13px] ${lp.reveal}`} data-reveal>
          Platforma digitală pentru evenimente
        </p>
        <h1
          className={`font-display text-[clamp(40px,6vw,72px)] font-bold leading-[1.08] tracking-tight ${lp.reveal}`}
          data-reveal
        >
          Mai mult decât o invitație.
          <br />
          <em className={lp.gradText}>Toată povestea.</em>
        </h1>
        <p className={`mx-auto mb-9 mt-5 max-w-[620px] text-[clamp(17px,2.2vw,21px)] text-muted ${lp.reveal}`} data-reveal>
          De la primul anunț până la ultima fotografie, PovesteaNoastra adună tot ce ține de evenimentul tău într-un singur loc
          viu: invitație, parcurs, contribuții și amintiri.
        </p>
        <div className={`flex flex-wrap justify-center gap-3.5 ${lp.reveal}`} data-reveal>
          <Link href={startHref} className={ui.buttonPrimary}>
            Creează-ți pagina
          </Link>
          <OverlayButton overlay="hiw" className={ui.buttonSecondary}>
            Vezi cum funcționează
          </OverlayButton>
        </div>
        <div className={`mx-auto mt-12 max-w-[760px] ${lp.reveal}`} data-reveal>
          <ThreadLine />
          <p className="mt-2 text-[13px] text-muted">
            Fiecare eveniment e o poveste — noi o ținem întreagă, de la început până la ziua cea mare.
          </p>
        </div>
      </div>
    </header>
  );
}

/* ---------- Problem → solution ---------- */

export function ProblemSolution() {
  return (
    <section className={lp.section}>
      <div className={lp.wrap}>
        <SectionHead
          eyebrow="De ce PovesteaNoastra"
          title={
            <>
              Invitația se vede o dată.
              <br />
              Povestea se trăiește luni întregi.
            </>
          }
        />
        <div className="mt-11 grid gap-6 md:grid-cols-2">
          <div className={`rounded-[22px] border border-surface-border bg-surface p-8 ${lp.reveal}`} data-reveal>
            <h3 className="mb-4 text-[13px] font-bold uppercase tracking-wider text-muted">Așa e acum</h3>
            <ul>
              {OLD_WAY.map((item) => (
                <li key={item} className="relative py-2 pl-7">
                  <span className="absolute left-0 text-muted/60">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className={`rounded-[22px] p-8 ${lp.darkCard} ${lp.reveal}`} data-reveal>
            <h3 className="mb-4 text-[13px] font-bold uppercase tracking-wider text-gold">Cu PovesteaNoastra</h3>
            <ul>
              {NEW_WAY.map((item) => (
                <li key={item} className="relative py-2 pl-7">
                  <span className="absolute left-0 text-gold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- The 4 stages ---------- */

function StageCard({ n, color, name, text, children }: { n: number; color: string; name: string; text: string; children: React.ReactNode }) {
  return (
    <div className={`${lp.card} rounded-[20px] px-5.5 py-6.5 ${lp.hoverLift} ${lp.reveal}`} data-reveal>
      <div className="relative mb-4 h-[140px] overflow-hidden rounded-xl border border-surface-border" aria-hidden="true">
        {children}
      </div>
      <span
        className="mb-4 flex size-[30px] items-center justify-center rounded-full text-[13px] font-bold text-white"
        style={{ background: color, color: n === 1 ? "#1A1A2E" : undefined }}
      >
        {n}
      </span>
      <p className="mb-1.5 text-lg font-bold">{name}</p>
      <p className="text-[14.5px] text-muted">{text}</p>
    </div>
  );
}

const MINI_POSTS = [
  { photo: 1, text: "Am ales rochia! 👰", count: 24 },
  { photo: 2, text: "Ei sunt nașii noștri 💛", count: 38 },
  { photo: 3, text: "Locația e gata ✨", count: 15 },
];

export function Stages() {
  return (
    <section id="cum" className={lp.section}>
      <div className={lp.wrap}>
        <SectionHead
          eyebrow="Cum funcționează"
          title="Patru etape, o poveste întreagă"
          lead="Nu e doar o invitație trimisă și uitată. E un fir care leagă totul, din prima zi până după."
        />
        <div className="mt-12 grid gap-4.5 min-[461px]:grid-cols-2 lg:grid-cols-4">
          <StageCard n={1} color="#FFD23F" name="Lansarea" text="Creezi pagina, trimiți invitația, aduni confirmările. Totul începe.">
            <div className={`flex h-full flex-col items-center justify-center text-white ${lp.gradBg}`}>
              <p className="font-display text-[17px] font-bold italic">Maria &amp; Andrei</p>
              <p className="mt-0.5 text-[10px] opacity-90">12 septembrie 2026</p>
              <p className="mt-2.5 rounded-full bg-white px-3.5 py-1 text-[10px] font-bold text-accent-text">Da, particip</p>
            </div>
          </StageCard>
          <StageCard n={2} color="#FF9F45" name="Parcursul" text="Postezi momente din pregătiri. Invitații reacționează și contribuie, lună după lună.">
            <div className="h-full bg-[#FFF8F1] p-2.5">
              {MINI_POSTS.map((p) => (
                <div key={p.text} className="mb-1.5 flex items-center gap-2 rounded-lg border border-[#EFE6DD] bg-white px-2 py-1.5">
                  <Photo n={p.photo} className="size-[26px] shrink-0 rounded-md" />
                  <span className="text-[9.5px] font-semibold text-[#2B2740]">{p.text}</span>
                  <span className="ml-auto text-[9px] font-bold text-pink">● {p.count}</span>
                </div>
              ))}
            </div>
          </StageCard>
          <StageCard n={3} color="#E8779E" name="Ziua X" text="Ecranul live în sală, QR-ul, pozele care curg în timp real. Momentul culminant.">
            <div className="flex h-full flex-col items-center justify-center gap-2 bg-[#1E1A30]">
              <p className="flex items-center gap-1.5 text-[10px] font-bold text-white">
                <LiveDot /> LIVE · în sală
              </p>
              <div className="size-[46px] rounded-md bg-white p-1.5">
                <QrMark className="size-full" />
              </div>
              <p className="text-[9px] text-[#B5B4C8]">Scanează și adaugă poze</p>
            </div>
          </StageCard>
          <StageCard n={4} color="#7F77DD" name="Recap" text="Albumul complet și povestea întreagă, păstrate pentru totdeauna.">
            <div className="grid h-full grid-cols-3 gap-1.5 bg-[#FFF8F1] p-2">
              {[4, 5, 6, 7, 8, 9].map((n) => (
                <Photo key={n} n={n} className="aspect-square rounded-[5px]" />
              ))}
            </div>
          </StageCard>
        </div>
      </div>
    </section>
  );
}

/* ---------- Verticals ---------- */

export function Verticals() {
  return (
    <section id="evenimente" className={`${lp.section} bg-surface`}>
      <div className={lp.wrap}>
        <SectionHead
          eyebrow="Pentru orice eveniment"
          title="O platformă, multe povești"
          lead="Aceeași experiență caldă se adaptează la fiecare tip de eveniment din viața ta."
        />
        <div className="mt-11 grid gap-4 min-[441px]:grid-cols-2 md:grid-cols-3">
          {VERTICALS.map((v) => (
            <div
              key={v.name}
              className={`rounded-[18px] border border-[#EFE6DD] bg-linear-135 p-6.5 text-[#2B2740] hover:-translate-y-0.5 ${v.tint} ${lp.reveal}`}
              data-reveal
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-white/80 text-[#2B2740]" aria-hidden="true">
                <v.icon size={24} strokeWidth={1.8} />
              </span>
              <p className="mb-1 mt-2.5 text-lg font-bold">{v.name}</p>
              <p className="text-sm text-[#5F5E5A]">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Features ---------- */

export function Features() {
  return (
    <section id="functii" className={`${lp.section} bg-surface`}>
      <div className={lp.wrap}>
        <SectionHead
          eyebrow="Tot ce poți face"
          title="O platformă, toate uneltele"
          lead="Nu trebuie să jonglezi cu zece aplicații. Tot ce ține de evenimentul tău, într-un singur loc."
        />
        <div className="mt-11 grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className={`${lp.card} rounded-[18px] p-6 ${lp.hoverLift} ${lp.reveal}`} data-reveal>
              <div className="mb-3.5 flex size-[46px] items-center justify-center rounded-xl bg-accent-tint text-accent-text" aria-hidden="true"><f.icon size={22} strokeWidth={1.8} /></div>
              <h3 className="mb-1 text-[17px] font-bold">{f.title}</h3>
              <p className="text-sm text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- For whom ---------- */

export function ForWhom() {
  return (
    <section id="pentru-cine" className={lp.section}>
      <div className={lp.wrap}>
        <SectionHead
          eyebrow="Pentru cine e"
          title="Făcută pentru fiecare poveste"
          lead="Oricine organizează un eveniment care merită ținut minte."
        />
        <div className="mt-11 grid grid-cols-2 gap-3.5 min-[461px]:grid-cols-3 lg:grid-cols-5">
          {FOR_WHOM.map((w) => (
            <div key={w.name} className={`rounded-[18px] bg-surface px-3.5 py-6 text-center hover:-translate-y-0.5 ${lp.reveal}`} data-reveal>
              <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-accent-tint text-accent-text" aria-hidden="true">
                <w.icon size={24} strokeWidth={1.8} />
              </span>
              <p className="mb-1 mt-2.5 text-[15px] font-bold">{w.name}</p>
              <p className="text-[12.5px] leading-snug text-muted">{w.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Contributions ---------- */

export function Contributions() {
  return (
    <section id="contributii" className={lp.section}>
      <div className={`${lp.wrap} grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-12`}>
        <div>
          <p className={`${lp.eyebrow} ${lp.reveal}`} data-reveal>
            Contribuie la poveste
          </p>
          <h2 className={`${lp.title} ${lp.reveal}`} data-reveal>
            În loc de un cadou,
            <br />o parte din vis
          </h2>
          <p className={`${lp.lead} ${lp.reveal}`} data-reveal>
            Invitații nu pun bani într-un plic — contribuie la ceva anume: luna de miere, casa nouă, o cauză. Văd la ce ajută, iar
            tu vezi povestea crescând. Cald, transparent, și acceptat oriunde în lume.
          </p>
          <div className={`mt-6 ${lp.reveal}`} data-reveal>
            <OverlayButton overlay="contrib" className={ui.buttonPrimary}>
              Cum funcționează contribuțiile
            </OverlayButton>
          </div>
        </div>
        <div className={`rounded-3xl bg-linear-135 from-surface-muted to-accent-soft p-6 sm:p-9 ${lp.reveal}`} data-reveal>
          <FundDemo />
          <p className="mt-3.5 text-center text-[11.5px] text-muted">
            Plăți securizate prin Stripe &amp; card local · banii merg direct la organizator
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Planners ---------- */

export function Planners() {
  const stats = [
    { n: "8+", l: ["evenimente", "în paralel"] },
    { n: "−40%", l: ["preț la", "volum"] },
    { n: "100%", l: ["brandul", "tău"] },
  ];
  return (
    <section className={lp.section}>
      <div className={lp.wrap}>
        <div className={`grid items-center gap-10 rounded-[28px] p-8 sm:p-12 md:grid-cols-[1.2fr_0.8fr] ${lp.darkCard} ${lp.reveal}`} data-reveal>
          <div>
            <h2 className="font-display text-[32px] font-bold">Ești event planner?</h2>
            <p className="mt-3 text-[#CFCEDB]">
              Gestionează toate evenimentele tale dintr-un singur panou, cu branding propriu pe paginile clienților. Fiecare
              eveniment îți promovează agenția către sute de invitați.
            </p>
            <OverlayButton overlay="planner" className={`${ui.buttonGold} mt-6`}>
              Descoperă panoul pentru agenții
            </OverlayButton>
          </div>
          <div className="flex gap-7">
            {stats.map((s) => (
              <div key={s.n}>
                <p className="font-display text-[34px] font-bold text-gold">{s.n}</p>
                <p className="text-[13px] text-[#B5B4C8]">
                  {s.l[0]}
                  <br />
                  {s.l[1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Pricing ---------- */

export function Pricing({ startHref }: { startHref: string }) {
  return (
    <section id="preturi" className={lp.section}>
      <div className={lp.wrap}>
        <SectionHead
          eyebrow="Prețuri simple"
          title="Plătești o dată, per eveniment"
          lead="Fără abonament ascuns. Alegi pachetul care ți se potrivește, în funcție de mărimea evenimentului."
        />
        <div className="mt-11 grid gap-4 min-[441px]:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => {
            const button = `${plan.highlighted === true ? ui.buttonPrimary : ui.buttonSecondary} w-full`;
            return (
              <div
                key={plan.tier}
                className={`relative rounded-[20px] bg-surface px-5.5 py-7 text-center ${
                  plan.highlighted === true ? "border-2 border-accent lg:scale-[1.03]" : "border border-surface-border"
                } ${lp.reveal}`}
                data-reveal
              >
                {plan.highlighted === true && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-fill px-3.5 py-1 text-[11px] font-bold text-on-accent">
                    Cel mai ales
                  </span>
                )}
                <p className="text-[17px] font-bold">{plan.tier}</p>
                <p className="mb-0.5 mt-2.5 font-display text-[34px] font-bold">
                  {plan.amount} <small className="font-sans text-sm font-normal text-muted">{plan.unit}</small>
                </p>
                <ul className="my-4 text-left">
                  {plan.features.map((f) => (
                    <li key={f} className="relative py-1 pl-5.5 text-[13.5px] text-muted">
                      <span className="absolute left-0 font-bold text-confirmed">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.action === "planner" ? (
                  <OverlayButton overlay="planner" className={button}>
                    {plan.cta}
                  </OverlayButton>
                ) : (
                  <Link href={startHref} className={button}>
                    {plan.cta}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-5 text-center text-[13px] italic text-muted">
          Prețurile sunt orientative, în lei. La contribuții se aplică un comision mic, transparent.
        </p>
      </div>
    </section>
  );
}

/* ---------- Why us ---------- */

export function WhyUs() {
  return (
    <section id="de-ce" className={lp.section}>
      <div className={lp.wrap}>
        <SectionHead
          eyebrow="De ce PovesteaNoastra"
          title="Ce ne face diferiți"
          lead="Nu suntem încă o aplicație de invitații. Suntem locul unde trăiește toată povestea."
        />
        <div className="mt-11 grid gap-4.5 md:grid-cols-2">
          {WHY_US.map((w, i) => (
            <div key={w.title} className={`flex gap-4 rounded-[18px] bg-surface p-6 ${lp.reveal}`} data-reveal>
              <span className="shrink-0 font-display text-[30px] font-bold leading-none text-accent-text">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="mb-1 text-[17px] font-bold">{w.title}</h3>
                <p className="text-[14.5px] text-muted">{w.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- How to start ---------- */

export function HowToStart() {
  return (
    <section id="incep" className={lp.section}>
      <div className={lp.wrap}>
        <SectionHead
          eyebrow="Cum începi"
          title="Trei pași și ești gata"
          lead="Nu trebuie să fii tehnic. Dacă știi să trimiți un mesaj, știi să-ți faci pagina."
        />
        <div className="mt-11 grid gap-8 md:grid-cols-3 md:gap-5">
          {START_STEPS.map((s, i) => (
            <div key={s.title} className={`px-2.5 text-center ${lp.reveal}`} data-reveal>
              <span className="mx-auto mb-4.5 flex size-16 items-center justify-center rounded-full bg-linear-135 from-gold to-accent font-display text-[28px] font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mb-1.5 text-lg font-bold">{s.title}</h3>
              <p className="text-[14.5px] text-muted">{s.text}</p>
            </div>
          ))}
        </div>
        <div className={`mt-10 text-center ${lp.reveal}`} data-reveal>
          <OverlayButton overlay="create" className={ui.buttonSecondary}>
            Vezi pașii în detaliu
          </OverlayButton>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

export function Faq() {
  return (
    <section id="faq" className={lp.section}>
      <div className={lp.wrap}>
        <SectionHead eyebrow="Întrebări frecvente" title="Bune de știut" />
        <div className={`mx-auto mt-10 max-w-3xl ${lp.reveal}`} data-reveal>
          {FAQ.map((item) => (
            <details key={item.q} className="group border-b border-surface-border">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-5 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-surface-muted font-bold text-accent-text transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-1 pb-5.5 text-[15px] leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA + footer ---------- */

export function FinalCta({ startHref }: { startHref: string }) {
  return (
    <section className={lp.section}>
      <div className={lp.wrap}>
        <div className={`rounded-[28px] px-6 py-16 text-center text-white sm:px-10 ${lp.gradBg} ${lp.reveal}`} data-reveal>
          <h2 className="font-display text-[clamp(30px,4vw,46px)] font-bold">Evenimentul tău merită o poveste întreagă</h2>
          <p className="mx-auto mb-7.5 mt-3.5 max-w-[520px] text-lg opacity-95">
            Creează-ți pagina în câteva minute. Gratuit până trimiți prima invitație.
          </p>
          <Link href={startHref} className={`${ui.buttonGold} px-8.5 py-4`}>
            Începe acum
          </Link>
        </div>
      </div>
    </section>
  );
}

export function LandingFooter({ signedIn }: { signedIn: boolean }) {
  const link = "text-sm text-muted transition hover:text-ink";
  return (
    <footer className="mt-4 border-t border-surface-border pb-10 pt-12">
      <div className={lp.wrap}>
        <div className="flex flex-wrap items-center gap-4">
          <BrandHeader />
          <div className="flex flex-wrap gap-6 sm:ml-auto">
            <a href="#cum" className={link}>
              Cum funcționează
            </a>
            <a href="#evenimente" className={link}>
              Evenimente
            </a>
            <a href="#preturi" className={link}>
              Prețuri
            </a>
            <Link href={signedIn ? "/events" : "/login"} className={link}>
              {signedIn ? "Evenimentele mele" : "Intră în cont"}
            </Link>
          </div>
        </div>
        <p className="mt-5 text-[13px] text-muted">Mai mult decât o invitație. Toată povestea.</p>
      </div>
    </footer>
  );
}
