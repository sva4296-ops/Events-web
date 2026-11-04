import Link from "next/link";
import { useId } from "react";

import { BrandHeader } from "@/components/BrandMark";
import { EventCover } from "@/components/EventCover";
import { ui } from "@/components/ui/styles";

import { FAQ, FEATURE_GROUPS, NAV_LINKS, NEW_WAY, OLD_WAY, PLANS, START_STEPS, VERTICALS } from "./data";
import { Photo, StageAlbum, StageInvite, StageLive, StageMoment } from "./mockups";
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
  const link = "whitespace-nowrap text-[14.5px] font-medium text-muted transition hover:text-ink";
  return (
    <nav className="sticky top-0 z-50 border-b border-surface-border bg-(--bg)/85 backdrop-blur-md">
      <div className={`${lp.wrap} flex items-center gap-2.5 py-3.5`}>
        <Link href="/" aria-label="PovesteaNoastra, acasă">
          <BrandHeader compact={signedIn} />
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
          <Link href={startHref} className={`${ui.buttonPrimary} min-h-11! whitespace-nowrap px-4! text-sm! sm:px-5! sm:text-[15px]!`}>
            {signedIn ? "Evenimentele mele" : "Începe gratuit"}
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ---------- Hero ---------- */

/** The story's thread: a line that draws itself once, a spark traveling along it, one node per stage. */
function ThreadLine() {
  const id = useId();
  const path = "M0 50 C 30 22, 65 22, 95 50 C 150 96, 230 96, 285 50 C 340 4, 420 4, 475 50 C 530 96, 610 96, 665 50 C 695 22, 730 22, 760 50";
  const nodes = [95, 285, 475, 665];
  return (
    <div>
      <svg viewBox="0 0 760 100" className="w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="760" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" style={{ stopColor: "var(--gold)", stopOpacity: 0 }} />
            <stop offset="0.1" style={{ stopColor: "var(--gold)" }} />
            <stop offset="0.9" style={{ stopColor: "var(--accent)" }} />
            <stop offset="1" style={{ stopColor: "var(--accent)", stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <path d={path} fill="none" stroke={`url(#${id})`} strokeWidth="10" strokeLinecap="round" opacity="0.14" pathLength={1} className="thread-draw" />
        <path d={path} fill="none" stroke={`url(#${id})`} strokeWidth="2.5" strokeLinecap="round" pathLength={1} className="thread-draw" />
        {nodes.map((x, index) => (
          <g key={x} className="thread-node" style={{ animationDelay: `${0.3 + index * 0.4}s`, transformOrigin: `${x}px 50px` }}>
            <circle cx={x} cy={50} r={10} fill="var(--bg)" stroke={`url(#${id})`} strokeWidth="2" />
            <circle cx={x} cy={50} r={4} fill={`url(#${id})`} />
          </g>
        ))}
        <circle r="3.5" fill="var(--gold)" className="motion-reduce:hidden">
          <animateMotion dur="9s" repeatCount="indefinite" path={path} />
        </circle>
      </svg>
      <div className="grid grid-cols-4 text-[13px] font-semibold">
        {["Lansarea", "Parcursul", "Ziua evenimentului", "Recap"].map((label) => (
          <span key={label} className="px-1">
            {label}
          </span>
        ))}
      </div>
    </div>
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
          viu: invitație, parcurs, poze și amintiri.
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
          <p className="mt-4 text-[13px] text-muted">
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
      <div className="phone-light relative mb-4 h-[140px] overflow-hidden rounded-xl border border-surface-border text-[#2A211C]" aria-hidden="true">
        {children}
      </div>
      <span
        className="mb-4 flex size-[30px] items-center justify-center rounded-full text-[13px] font-bold text-white"
        style={{ background: color, color: n <= 2 ? "#2A211C" : undefined }}
      >
        {n}
      </span>
      <p className="mb-1.5 text-lg font-bold">{name}</p>
      <p className="text-[14.5px] text-muted">{text}</p>
    </div>
  );
}

export function Stages() {
  return (
    <section id="cum" className={lp.section}>
      <div className={lp.wrap}>
        <SectionHead
          eyebrow="Cum funcționează"
          title="Patru etape, o poveste întreagă"
          lead="Nu e doar o invitație trimisă și uitată. E un fir care leagă totul, din prima zi până după eveniment."
        />
        <div className="mt-12 grid gap-4.5 min-[461px]:grid-cols-2 lg:grid-cols-4">
          <StageCard n={1} color="#F5C36B" name="Lansarea" text="Creezi pagina, trimiți invitația, aduni confirmările. Totul începe.">
            <StageInvite />
          </StageCard>
          <StageCard n={2} color="#E8A25E" name="Parcursul" text="Postezi momente din pregătiri. Invitații reacționează, lună după lună.">
            <StageMoment />
          </StageCard>
          <StageCard n={3} color="#C9744A" name="Ziua evenimentului" text="Ecranul live în sală, QR-ul, pozele care curg în timp real. Momentul culminant.">
            <StageLive />
          </StageCard>
          <StageCard n={4} color="#A54E36" name="Recap" text="Albumul complet și povestea întreagă, păstrate pentru totdeauna.">
            <StageAlbum />
          </StageCard>
        </div>
      </div>
    </section>
  );
}

/* ---------- Verticals ---------- */

export function Verticals() {
  return (
    <section id="evenimente" className={`${lp.section} ${lp.band}`}>
      <div className={lp.wrap}>
        <SectionHead
          eyebrow="Pentru orice eveniment"
          title="O platformă, multe povești"
          lead="Aceeași experiență caldă se adaptează la fiecare tip de eveniment din viața ta."
        />
        <div className="mt-11 grid gap-4 min-[441px]:grid-cols-2 md:grid-cols-3">
          {VERTICALS.map((v) => (
            <div key={v.name} className={`${lp.card} overflow-hidden ${lp.hoverLift} ${lp.reveal}`} data-reveal>
              <EventCover type={v.type} className="h-[104px]">
                <span className="absolute left-4 top-4 flex size-11 items-center justify-center rounded-2xl bg-white/90 text-[#2A211C]" aria-hidden="true">
                  <v.icon size={22} strokeWidth={1.8} />
                </span>
              </EventCover>
              <div className="px-5 pb-5 pt-4">
                <p className="mb-1 text-lg font-semibold">{v.name}</p>
                <p className="text-sm text-muted">{v.text}</p>
              </div>
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
    <section id="functii" className={`${lp.section} ${lp.band}`}>
      <div className={lp.wrap}>
        <SectionHead
          eyebrow="Tot ce poți face"
          title="O platformă, toate uneltele"
          lead="Nu trebuie să jonglezi cu zece aplicații. Tot ce ține de evenimentul tău, într-un singur loc."
        />
        {/* Grouped by when they matter, each group beside a real moment, rather than a wall of equal tiles. */}
        <div className="mt-14 flex flex-col gap-14 lg:gap-20">
          {FEATURE_GROUPS.map((group, index) => (
            <div
              key={group.title}
              className={`grid items-start gap-6 lg:gap-12 ${index % 2 === 0 ? "lg:grid-cols-[320px_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,1fr)_320px]"}`}
            >
              <div className={`flex flex-col gap-4 ${index % 2 === 0 ? "" : "lg:order-last"} ${lp.reveal}`} data-reveal>
                <h3 className="font-theme text-[28px] leading-9">{group.title}</h3>
                <Photo n={group.photo} sizes="(min-width: 1024px) 320px, 100vw" className="aspect-[16/10] rounded-3xl lg:aspect-[4/3]" />
              </div>
              <ul className="grid sm:grid-cols-2 sm:gap-x-10 [&>li:last-child:nth-child(odd)]:sm:col-span-2">
                {group.items.map((f) => (
                  <li key={f.title} className={`flex gap-4 border-t border-surface-border py-5 ${lp.reveal}`} data-reveal>
                    <f.icon size={26} strokeWidth={1.3} className="mt-0.5 shrink-0 text-accent-text" aria-hidden="true" />
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="text-[17px] font-semibold">{f.title}</span>
                      <span className="text-sm text-muted">{f.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
                <p className="text-[13px] text-[#C9BDB0]">
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
        <p className="mt-5 text-center text-[13px] text-muted">
          Prețurile sunt orientative, în lei.
        </p>
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
              <span className="mx-auto mb-4.5 flex size-16 items-center justify-center rounded-full bg-accent-fill font-display text-[28px] font-bold text-white">
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
