import {
  Baby,
  Cake,
  Check,
  ChevronLeft,
  CreditCard,
  Files,
  Gem,
  HandHeart,
  LayoutDashboard,
  Megaphone,
  Palette,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";

import { BrandMark } from "@/components/BrandMark";
import { EventCover } from "@/components/EventCover";
import { ui } from "@/components/ui/styles";

import { FeedScreen, InviteScreen, LiveScreen, Phone, RecapScreen } from "./mockups";
import { lp } from "./styles";

/* ---------- Shared building blocks ---------- */

const inner = "mx-auto w-full max-w-[1080px] px-4 sm:px-7";

function OverlayHero({ eyebrow, title, accent, text }: { eyebrow: string; title: string; accent: string; text: string }) {
  return (
    <div className={`${inner} pb-6 pt-14 text-center`}>
      <p className={lp.eyebrow}>{eyebrow}</p>
      <h1 className="font-display text-[clamp(32px,5vw,54px)] font-bold leading-[1.1] tracking-tight">
        {title}
        <br />
        <span className={lp.gradText}>{accent}</span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-[clamp(16px,2vw,20px)] text-muted">{text}</p>
    </div>
  );
}

function Step({
  n,
  color,
  label,
  title,
  children,
  visual,
  flip,
}: {
  n: number;
  color: string;
  label: string;
  title: string;
  children: React.ReactNode;
  visual: React.ReactNode;
  flip: boolean;
}) {
  return (
    <div className="grid items-center gap-7 border-t border-surface-border py-10 md:grid-cols-2 md:gap-14 md:py-13">
      <div className={flip ? "md:order-2" : ""}>
        <div className="mb-4 flex items-center gap-3">
          <span
            className="flex size-[42px] shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
            style={{ background: color, color: n <= 2 ? "#2A211C" : undefined }}
          >
            {n}
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{label}</span>
        </div>
        <h2 className="mb-3.5 font-display text-[clamp(25px,3.5vw,34px)] font-bold leading-tight">{title}</h2>
        {children}
      </div>
      <div>{visual}</div>
    </div>
  );
}

function Intro({ children, small = false }: { children: React.ReactNode; small?: boolean }) {
  return <p className={`mb-5 text-muted ${small ? "text-sm" : "text-[16.5px]"}`}>{children}</p>;
}

function Role({ who, children }: { who: "org" | "inv"; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={`mt-0.5 min-w-[92px] shrink-0 rounded-full px-3 py-1 text-center text-[11px] font-bold ${
          who === "org" ? "bg-accent-soft text-accent-text" : "bg-surface-muted text-[#9A462F]"
        }`}
      >
        {who === "org" ? "Organizator" : "Invitat"}
      </span>
      <span className="text-[15px] text-muted [&_b]:font-semibold [&_b]:text-ink">{children}</span>
    </div>
  );
}

function Roles({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3.5">{children}</div>;
}

function Final({ title, text, startHref }: { title: string; text: string; startHref: string }) {
  return (
    <div className={`mb-16 mt-9 rounded-[28px] px-6 py-14 text-center text-white sm:px-10 ${lp.gradBg}`}>
      <h2 className="font-display text-[clamp(26px,4vw,40px)] font-bold">{title}</h2>
      <p className="mx-auto mb-6 mt-3 max-w-md text-[17px] opacity-95">{text}</p>
      <Link href={startHref} className={`${ui.buttonGold} bg-white! text-[#2A211C]!`}>
        Am înțeles, începe
      </Link>
    </div>
  );
}

/* ---------- How it works ---------- */

export function HowItWorksContent({ startHref }: { startHref: string }) {
  return (
    <>
      <OverlayHero
        eyebrow="Cum funcționează"
        title="De la primul anunț"
        accent="până la ultima amintire"
        text="Patru etape simple. Tu construiești evenimentul, invitații îl trăiesc alături de tine. Iată exact ce se întâmplă la fiecare pas."
      />
      <div className={inner}>
        <Step n={1} color="#F5C36B" label="Lansarea" title="Îți creezi pagina și trimiți invitația" visual={<InviteScreen />} flip={false}>
          <Intro>
            În câteva minute ai o pagină a evenimentului, frumoasă și pe stilul tău. O trimiți printr-un link sau un cod QR — fără
            aplicații de instalat pentru nimeni.
          </Intro>
          <Roles>
            <Role who="org">
              Alegi tipul de eveniment, adaugi data, locul și o copertă. <b>Trimiți invitația cu un link.</b>
            </Role>
            <Role who="inv">
              Deschide linkul, vede invitația și <b>confirmă prezența cu un singur tap</b> — fără cont.
            </Role>
          </Roles>
        </Step>
        <Step n={2} color="#E8A25E" label="Parcursul" title="Povestea crește, lună după lună" visual={<FeedScreen />} flip>
          <Intro>
            Asta e inima platformei. Nu o invitație statică, ci un feed viu: postezi momente din pregătiri, iar invitații le
            urmăresc, reacționează și se simt parte din poveste — cu mult înainte de eveniment.
          </Intro>
          <Roles>
            <Role who="org">
              Postezi momente: „am ales rochia”, „ei sunt nașii”. <b>Ții invitații aproape tot drumul.</b>
            </Role>
            <Role who="inv">
              Vede fiecare moment în feed, <b>dă like, comentează</b> și trăiește pregătirile alături de voi.
            </Role>
          </Roles>
        </Step>
        <Step n={3} color="#C9744A" label="Ziua evenimentului" title="Momentul culminant, trăit împreună" visual={<LiveScreen />} flip={false}>
          <Intro>
            În ziua evenimentului, un ecran live în sală afișează pozele în timp real. Invitații scanează un cod QR și adaugă
            propriile fotografii — fără să descarce nimic. Toată lumea construiește albumul, împreună.
          </Intro>
          <Roles>
            <Role who="org">
              Proiectezi ecranul live în sală. <b>Codul QR invită sute de oameni</b> să adauge poze.
            </Role>
            <Role who="inv">
              Scanează codul și <b>adaugă pozele lui pe loc</b> — apar instant pe ecranul mare.
            </Role>
          </Roles>
        </Step>
        <Step n={4} color="#A54E36" label="Recap" title="Povestea rămâne, pentru totdeauna" visual={<RecapScreen />} flip>
          <Intro>
            După eveniment, totul se transformă într-un album și o poveste completă: toate momentele, toate pozele tuturor,
            într-un singur loc pe care îl păstrezi și-l revezi oricând.
          </Intro>
          <Roles>
            <Role who="org">
              Primești <b>albumul complet</b>, cu pozele tuturor invitaților adunate automat.
            </Role>
            <Role who="inv">
              Revede povestea întreagă și <b>descarcă pozele preferate</b> oricând.
            </Role>
          </Roles>
        </Step>
        <Final
          title="Gata să-ți începi povestea?"
          text="Creează-ți pagina în câteva minute. Gratuit până trimiți prima invitație."
          startHref={startHref}
        />
      </div>
    </>
  );
}

/* ---------- Planner ---------- */

const PLANNER_STATS = [
  { n: "8", l: "evenimente active", bg: "#FBEAE2" },
  { n: "1.240", l: "invitați gestionați", bg: "#EFE6FA" },
  { n: "4.800", l: "poze adunate", bg: "#FDF0D9" },
  { n: "96%", l: "rată confirmare", bg: "#E6F0FB" },
];

const PLANNER_EVENTS = [
  { name: "Maria & Andrei · Nuntă", thumb: "linear-gradient(135deg,#E8A25E,#FF6B8A)", status: "peste 3 zile", tone: "bg-[#FFF3D6] text-[#A77B06]" },
  { name: "Botezul Sofiei · Botez", thumb: "linear-gradient(135deg,#8FD3FE,#5B8DEF)", status: "în pregătire", tone: "bg-[#EFE6FA] text-[#7B3FC4]" },
  { name: "Bal pentru Speranță · Gală", thumb: "linear-gradient(135deg,#1D9E75,#15815F)", status: "în pregătire", tone: "bg-[#EFE6FA] text-[#7B3FC4]" },
];

const PLANNER_FEATURES = [
  { icon: LayoutDashboard, title: "Totul centralizat", text: "Toate evenimentele și invitații într-un singur panou, fără să sari între conturi." },
  { icon: Palette, title: "Brandul tău", text: "Logo-ul agenției apare pe paginile clienților: „organizat de Atelier Events”. Reclamă la fiecare eveniment." },
  { icon: Files, title: "Șabloane", text: "Creezi un eveniment nou dintr-un model salvat în câteva minute, nu ore." },
  { icon: CreditCard, title: "Preț pe volum", text: "Cu cât gestionezi mai multe evenimente, cu atât prețul per eveniment scade." },
  { icon: Megaphone, title: "Canal de creștere", text: "Fiecare eveniment îți promovează agenția către sute de invitați — viitori clienți." },
  { icon: ShieldCheck, title: "Control deplin", text: "Clientul își editează evenimentul, tu păstrezi controlul general și vizibilitatea." },
];

export function PlannerContent({ startHref }: { startHref: string }) {
  return (
    <>
      <OverlayHero
        eyebrow="Pentru event planneri"
        title="Toate evenimentele tale,"
        accent="într-un singur panou"
        text="Dacă organizezi evenimente pentru alții, ai un panou dedicat: gestionezi totul dintr-un loc, cu brandul agenției tale pe paginile clienților."
      />
      <div className={inner}>
        <div className="py-12">
          <div className="mb-7 text-center">
            <h2 className="font-display text-[clamp(22px,3vw,30px)] font-bold">Panoul tău de lucru</h2>
            <p className={`${lp.lead} mx-auto mt-2.5`}>O vedere de ansamblu peste toate evenimentele agenției.</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#E0D4C4] bg-white text-[#2A211C] shadow-2xl shadow-black/10" aria-hidden="true">
            <div className="flex items-center gap-2.5 bg-[#2A211C] px-4.5 py-3.5">
              <BrandMark className="h-3 w-5" />
              <span className="text-sm font-bold text-white">
                Atelier<span className="text-gold">Events</span>
              </span>
            </div>
            <div className="p-4.5">
              <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {PLANNER_STATS.map((s) => (
                  <div key={s.l} className="rounded-xl p-3" style={{ background: s.bg }}>
                    <p className="font-display text-[22px] font-bold">{s.n}</p>
                    <p className="text-[10.5px] text-[#6A5E54]">{s.l}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {PLANNER_EVENTS.map((e) => (
                  <div key={e.name} className="flex items-center gap-3 rounded-xl border border-[#E0D4C4] p-2.5">
                    <div className="size-[34px] shrink-0 rounded-lg" style={{ background: e.thumb }} />
                    <span className="flex-1 text-[13px] font-semibold">{e.name}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${e.tone}`}>{e.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-surface-border py-12">
          <h2 className="mb-2.5 text-center font-display text-[clamp(22px,3vw,30px)] font-bold">
            De ce planneri aleg PovesteaNoastra
          </h2>
          <div className="mt-7 grid gap-3.5 sm:grid-cols-3">
            {PLANNER_FEATURES.map((f) => (
              <div key={f.title} className={`${lp.card} p-5 text-center`}>
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-accent-tint text-accent-text" aria-hidden="true">
                  <f.icon size={24} strokeWidth={1.8} />
                </span>
                <h4 className="mb-1 mt-2 text-[15px] font-bold">{f.title}</h4>
                <p className="text-[13px] text-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
        <Final
          title="Crește-ți agenția cu fiecare eveniment"
          text="Un singur panou, brandul tău, prețuri pe volum — și un canal care îți aduce clienți noi de la sine."
          startHref={startHref}
        />
      </div>
    </>
  );
}

/* ---------- Create page ---------- */

/** "Eveniment nou · Pasul 1 din 4 · Tipul", with the wizard's progress bar. */
function WizardHeader({ step, name }: { step: number; name: string }) {
  return (
    <div className="shrink-0 px-3.5 pb-2 pt-9">
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full border border-[#E0D4C4] bg-white">
          <ChevronLeft size={13} />
        </span>
        <span className="flex flex-col">
          <span className="text-[11px] leading-[13px] font-semibold">Eveniment nou</span>
          <span className="text-[8.5px] leading-[11px] text-[#6A5E54]">
            Pasul {step} din 4 · {name}
          </span>
        </span>
      </div>
      <div className="mt-2 flex gap-1">
        {[1, 2, 3, 4].map((index) => (
          <span key={index} className={`h-[3px] flex-1 rounded-full ${index <= step ? "bg-[#A54E36]" : "bg-[#E0D4C4]"}`} />
        ))}
      </div>
    </div>
  );
}

function WizardButton({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-auto shrink-0 px-3.5 pb-4 pt-2">
      <div className="rounded-full bg-[#A54E36] py-2.5 text-center text-[11.5px] font-semibold text-white">{children}</div>
    </div>
  );
}

const WIZARD_TYPES = [
  { type: "wedding" as const, icon: Gem, name: "Nuntă", text: "Cununie și petrecere", selected: true },
  { type: "baptism" as const, icon: Baby, name: "Botez", text: "Primul capitol" },
  { type: "birthday" as const, icon: Cake, name: "Aniversare", text: "Ani de sărbătorit" },
  { type: "cause" as const, icon: HandHeart, name: "Cauză caritabilă", text: "Împreună pentru un scop" },
];

function TypeScreen() {
  return (
    <Phone>
      <WizardHeader step={1} name="Tipul" />
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden px-3.5">
        <div>
          <p className="font-display text-[20px] leading-6 font-semibold">Ce sărbătorim?</p>
          <p className="text-[10px] text-[#6A5E54]">Alege tipul evenimentului.</p>
        </div>
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-2">
          {WIZARD_TYPES.map((item) => (
            <div key={item.name} className="flex flex-col gap-1">
              <div className={`rounded-[18px] border-2 p-0.5 ${item.selected === true ? "border-[#A54E36]" : "border-transparent"}`}>
                <EventCover type={item.type} className="aspect-square rounded-[14px]">
                  <div className="absolute inset-0 flex flex-col justify-between bg-linear-to-b from-transparent to-black/35 p-2 text-white">
                    <item.icon size={15} strokeWidth={1.6} />
                    <span className="font-theme text-[13px] leading-4">{item.name}</span>
                  </div>
                  {item.selected === true ? (
                    <span className="absolute right-1.5 top-1.5 flex size-[18px] items-center justify-center rounded-full bg-[#A54E36] text-white">
                      <Check size={10} strokeWidth={3} />
                    </span>
                  ) : null}
                </EventCover>
              </div>
              <p className="truncate px-0.5 text-[8.5px] text-[#6A5E54]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
      <WizardButton>Continuă</WizardButton>
    </Phone>
  );
}

const COVER_THUMBS = [
  { id: null, label: "Clasic" },
  { id: "nunta", label: "Nuntă" },
  { id: "trandafiri", label: "Trandafiri" },
  { id: "arcada", label: "Arcadă" },
];

function InviteComposeScreen() {
  return (
    <Phone>
      <WizardHeader step={2} name="Invitația" />
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-3.5">
        <p className="font-display text-[20px] leading-6 font-semibold">Invitația ta</p>
        <div className="overflow-hidden rounded-[18px] border border-[#E0D4C4] bg-white">
          <EventCover type="wedding" className="h-[122px]">
            <div className="absolute inset-0 flex flex-col justify-end gap-0.5 bg-linear-to-b from-transparent to-black/45 p-2.5 text-white">
              <span className="mb-auto self-start rounded-full border border-white/70 px-2 py-0.5 text-[8px] font-semibold">Nuntă</span>
              <span className="font-theme text-[20px] leading-6">Maria &amp; Andrei</span>
              <span className="text-[9px] text-white/85">12 septembrie 2026 · Bușteni</span>
            </div>
          </EventCover>
          <div className="p-2.5">
            <p className="text-[10px] leading-[14px]">Ne-ar plăcea enorm să fii alături de noi în ziua noastră specială.</p>
            <p className="mt-1 text-right text-[8px] text-[#958879]">67 / 140</p>
          </div>
        </div>
        <p className="text-[9.5px] font-semibold text-[#6A5E54]">Temă</p>
        <div className="flex gap-2">
          {COVER_THUMBS.map((thumb) => (
            <span key={thumb.label} className="flex w-[52px] flex-col gap-1">
              <span className={`rounded-[13px] border-2 p-0.5 ${thumb.id === null ? "border-[#2A211C]" : "border-transparent"}`}>
                <EventCover type="wedding" coverTheme={thumb.id} plain className="aspect-square rounded-[9px]" />
              </span>
              <span className="truncate text-center text-[8px] text-[#6A5E54]">{thumb.label}</span>
            </span>
          ))}
        </div>
        <p className="text-[9.5px] font-semibold text-[#6A5E54]">Detalii</p>
        <div className="rounded-xl border border-[#E0D4C4] bg-white px-2.5 py-1.5 text-[10px]">Sâmbătă, 12 septembrie 2026</div>
      </div>
      <WizardButton>Continuă</WizardButton>
    </Phone>
  );
}

const WIZARD_PLANS = [
  { name: "Esențial", price: "149", text: "Invitație, momente, album, până la 50 de invitați" },
  { name: "Complet", price: "299", text: "Ecran live, chat și invitați nelimitați", highlighted: true },
  { name: "Premium", price: "499", text: "Cazare, furnizori și suport prioritar" },
];

function PlanScreen() {
  return (
    <Phone>
      <WizardHeader step={3} name="Planul" />
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-3.5">
        <div>
          <p className="font-display text-[20px] leading-6 font-semibold">Planuri și prețuri</p>
          <p className="text-[10px] text-[#6A5E54]">Alege planul potrivit pentru Maria &amp; Andrei.</p>
        </div>
        {WIZARD_PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl bg-white p-2.5 ${plan.highlighted === true ? "border-2 border-[#A54E36]" : "border border-[#E0D4C4]"}`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[12px] font-semibold">{plan.name}</span>
              <span className="font-theme text-[20px] leading-6">
                {plan.price} <span className="font-sans text-[9px] text-[#6A5E54]">lei</span>
              </span>
            </div>
            <p className="text-[9.5px] leading-[13px] text-[#6A5E54]">{plan.text}</p>
          </div>
        ))}
      </div>
      <p className="shrink-0 pb-1 text-center text-[10px] font-semibold text-[#9A462F]">Sar peste, mai târziu</p>
      <WizardButton>Alege</WizardButton>
    </Phone>
  );
}

function ShareScreen() {
  return (
    <Phone>
      <div className="flex shrink-0 justify-end px-3.5 pt-9">
        <span className="flex size-7 items-center justify-center rounded-full border border-[#E0D4C4] bg-white">
          <X size={14} />
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-4 px-4">
        <EventCover type="wedding" className="h-[210px] rounded-[20px]">
          <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-b from-transparent to-black/45 p-3.5 text-white">
            <span className="font-theme text-[24px] leading-7">Maria &amp; Andrei</span>
            <span className="text-[10px] text-white/85">12 septembrie 2026 · Bușteni</span>
          </div>
        </EventCover>
        <div className="text-center">
          <p className="font-display text-[22px] leading-7 font-semibold">Povestea a început!</p>
          <p className="mt-1 text-[10.5px] leading-[15px] text-[#6A5E54]">
            Trimite invitația celor dragi. Fiecare invitat primește un link personal.
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col gap-1 px-3.5 pb-4">
        <div className="flex items-center justify-center gap-1.5 rounded-full bg-[#A54E36] py-2.5 text-[11.5px] font-semibold text-white">
          <Send size={12} /> Invită oaspeți
        </div>
        <p className="py-1 text-center text-[10.5px] font-semibold text-[#9A462F]">Mai târziu</p>
      </div>
    </Phone>
  );
}

export function CreateContent({ startHref }: { startHref: string }) {
  return (
    <>
      <OverlayHero
        eyebrow="Creează-ți pagina"
        title="De la idee la invitație,"
        accent="în câteva minute"
        text="Nu trebuie să fii tehnic. Patru pași simpli în aplicație și pagina evenimentului tău e gata de trimis. Iată cum arată."
      />
      <div className={inner}>
        <Step n={1} color="#F5C36B" label="Tipul" title="Ce sărbătorim?" flip={false} visual={<TypeScreen />}>
          <Intro>
            Alegi tipul evenimentului dintr-un catalog: nuntă, botez, aniversare, cauză, corporate, comemorare, ceva spontan sau o
            seară la local. Fiecare vine cu tema și secțiunile potrivite.
          </Intro>
          <Intro small>Pentru o ieșire spontană, alegi și un model gata făcut: karaoke, petrecere, degustare.</Intro>
        </Step>
        <Step n={2} color="#E8A25E" label="Invitația" title="Scrii direct pe invitație" flip visual={<InviteComposeScreen />}>
          <Intro>
            Nu completezi un formular: scrii numele și mesajul chiar pe invitație, exact unde le vor citi invitații. Alegi o temă de
            copertă, apoi data și locul.
          </Intro>
          <Intro small>Ai nevoie de inspirație pentru mesaj? Te poate ajuta AI-ul din aplicație.</Intro>
        </Step>
        <Step n={3} color="#C9744A" label="Planul" title="Alegi cât îți trebuie" flip={false} visual={<PlanScreen />}>
          <Intro>Plătești o dată, per eveniment, în funcție de câți invitați ai și de ce vrei să folosești în ziua lui.</Intro>
          <Intro small>Nu te-ai hotărât? Poți sări peste pas și alege planul mai târziu.</Intro>
        </Step>
        <Step n={4} color="#A54E36" label="Partajare" title="Povestea a început!" flip visual={<ShareScreen />}>
          <Intro>
            Trimiți invitația pe WhatsApp, iar fiecare invitat primește un link personal. O deschide și răspunde cu un tap, fără să
            instaleze nimic.
          </Intro>
          <Intro small>Din acest moment, poți posta primul moment chiar azi.</Intro>
        </Step>
        <Final
          title="Gata să-ți începi povestea?"
          text="Patru pași simpli te despart de prima ta invitație. Gratuit până o trimiți."
          startHref={startHref}
        />
      </div>
    </>
  );
}
