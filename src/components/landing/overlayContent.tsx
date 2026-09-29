import Link from "next/link";

import { BrandMark } from "@/components/BrandMark";
import { ui } from "@/components/ui/styles";

import { AmountScreen, FeedScreen, FundScreen, InviteScreen, LiveScreen, OwnerFundScreen, QrMark, RecapScreen } from "./mockups";
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
            style={{ background: color, color: n === 1 ? "#1A1A2E" : undefined }}
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
          who === "org" ? "bg-accent-soft text-accent" : "bg-surface-muted text-[#B5683E]"
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

function Points({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <li key={item} className="relative py-2 pl-7 text-[15px] text-muted">
          <span className="absolute left-0 font-bold text-confirmed">✓</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function Final({ title, text, startHref }: { title: string; text: string; startHref: string }) {
  return (
    <div className={`mb-16 mt-9 rounded-[28px] px-6 py-14 text-center text-white sm:px-10 ${lp.gradBg}`}>
      <h2 className="font-display text-[clamp(26px,4vw,40px)] font-bold">{title}</h2>
      <p className="mx-auto mb-6 mt-3 max-w-md text-[17px] opacity-95">{text}</p>
      <Link href={startHref} className={ui.buttonGold}>
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
        text="Cinci etape simple. Tu construiești evenimentul, invitații îl trăiesc alături de tine. Iată exact ce se întâmplă la fiecare pas."
      />
      <div className={inner}>
        <Step n={1} color="#FFD23F" label="Lansarea" title="Îți creezi pagina și trimiți invitația" visual={<InviteScreen />} flip={false}>
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
        <Step n={2} color="#FF9F45" label="Parcursul" title="Povestea crește, lună după lună" visual={<FeedScreen />} flip>
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
        <Step n={3} color="#E8779E" label="Contribuțiile" title="În loc de un cadou, o parte din vis" visual={<FundScreen />} flip={false}>
          <Intro>
            Invitații nu pun bani într-un plic — contribuie la ceva anume: luna de miere, casa nouă, o cauză. Văd exact la ce
            ajută, iar tu vezi fondul crescând. Transparent și cald, prin plăți securizate.
          </Intro>
          <Roles>
            <Role who="org">
              Setezi un scop și o țintă. <b>Banii ajung direct la tine</b>, prin Stripe — platforma nu îi ține.
            </Role>
            <Role who="inv">
              Alege o sumă și <b>contribuie în câteva secunde</b>, cu cardul. Vede la ce a ajutat.
            </Role>
          </Roles>
        </Step>
        <Step n={4} color="#D957A8" label="Ziua X" title="Momentul culminant, trăit împreună" visual={<LiveScreen />} flip>
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
        <Step n={5} color="#7F77DD" label="Recap" title="Povestea rămâne, pentru totdeauna" visual={<RecapScreen />} flip={false}>
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

/* ---------- Contributions ---------- */

function LeadBlock({ title, children, visual, flip }: { title: string; children: React.ReactNode; visual: React.ReactNode; flip: boolean }) {
  return (
    <div className="border-t border-surface-border py-12 first:border-t-0">
      <div className="grid items-center gap-7 md:grid-cols-2 md:gap-12">
        <div className={flip ? "md:order-2" : ""}>
          <h2 className="mb-3.5 font-display text-[clamp(24px,3.5vw,32px)] font-bold leading-tight">{title}</h2>
          {children}
        </div>
        <div>{visual}</div>
      </div>
    </div>
  );
}

export function ContributionsContent({ startHref }: { startHref: string }) {
  return (
    <>
      <OverlayHero
        eyebrow="Contribuțiile"
        title="În loc de un cadou,"
        accent="o parte din vis"
        text="Invitații nu mai pun bani într-un plic. Contribuie la ceva anume — și văd exact la ce ajută. Iată cum funcționează, de la cap la coadă."
      />
      <div className={inner}>
        <LeadBlock title="Un scop, nu un plic" visual={<FundScreen />} flip={false}>
          <p className="mb-3.5 text-muted">
            În loc de „bani pentru miri”, tu alegi un scop concret: luna de miere, casa nouă, mobilarea, o cauză dragă. Invitații
            contribuie la <b>acel</b> vis și se simt parte din el.
          </p>
          <Points
            items={[
              "Alegi un scop și o țintă (ex: 8.000 lei pentru luna de miere)",
              "Invitații văd la ce contribuie, nu doar „un dar”",
              "Bara crește la vedere — toți văd povestea apropiindu-se de țintă",
            ]}
          />
        </LeadBlock>
        <LeadBlock title="Plata, simplă și sigură" visual={<AmountScreen />} flip>
          <p className="mb-3.5 text-muted">
            Invitatul alege o sumă și plătește cu cardul, în câteva secunde. Procesarea se face securizat prin Stripe — datele
            cardului nu sunt stocate de platformă.
          </p>
          <Points
            items={[
              "Sume sugerate sau o sumă la alegere",
              "Plată cu cardul, securizată prin Stripe",
              "Funcționează cu sistemele de plată din România",
              "Confirmare instant, cu mulțumire automată",
            ]}
          />
        </LeadBlock>
        <LeadBlock title="Banii ajung direct la tine" visual={<OwnerFundScreen />} flip={false}>
          <p className="mb-3.5 text-muted">
            Contribuțiile merg direct către tine, organizatorul, prin contul tău conectat. Platforma <b>nu ține banii</b> — reține
            doar un comision mic și transparent pe fiecare contribuție.
          </p>
          <Points
            items={[
              "Transferul ajunge direct în contul tău",
              "Comision mic, afișat clar — fără surprize",
              "Vezi în timp real cine a contribuit și cât",
              "Transparent până la ultimul leu",
            ]}
          />
        </LeadBlock>
        <Final
          title="Universal, nu doar la noi"
          text="Contribuția la un scop e o idee acceptată oriunde în lume — de la liste de nuntă la strângeri pentru cauze. Tu pornești povestea, invitații o duc mai departe."
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
  { n: "214.500", l: "lei în fonduri", bg: "#FDF0D9" },
  { n: "96%", l: "rată confirmare", bg: "#E6F0FB" },
];

const PLANNER_EVENTS = [
  { name: "Maria & Andrei · Nuntă", thumb: "linear-gradient(135deg,#FF9F45,#FF6B8A)", status: "peste 3 zile", tone: "bg-[#FFF3D6] text-[#A77B06]" },
  { name: "Botezul Sofiei · Botez", thumb: "linear-gradient(135deg,#8FD3FE,#5B8DEF)", status: "în pregătire", tone: "bg-[#EFE6FA] text-[#7B3FC4]" },
  { name: "Bal pentru Speranță · Gală", thumb: "linear-gradient(135deg,#1D9E75,#15815F)", status: "în pregătire", tone: "bg-[#EFE6FA] text-[#7B3FC4]" },
];

const PLANNER_FEATURES = [
  { icon: "📊", title: "Totul centralizat", text: "Toate evenimentele, invitații și fondurile într-un singur panou, fără să sari între conturi." },
  { icon: "🎨", title: "Brandul tău", text: "Logo-ul agenției apare pe paginile clienților: „organizat de Atelier Events”. Reclamă la fiecare eveniment." },
  { icon: "📑", title: "Șabloane", text: "Creezi un eveniment nou dintr-un model salvat în câteva minute, nu ore." },
  { icon: "💳", title: "Preț pe volum", text: "Cu cât gestionezi mai multe evenimente, cu atât prețul per eveniment scade." },
  { icon: "📣", title: "Canal de creștere", text: "Fiecare eveniment îți promovează agenția către sute de invitați — viitori clienți." },
  { icon: "🔐", title: "Control deplin", text: "Clientul își editează evenimentul, tu păstrezi controlul general și vizibilitatea." },
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
          <div className="overflow-hidden rounded-2xl border border-[#EFE6DD] bg-white text-[#2B2740] shadow-2xl shadow-black/10" aria-hidden="true">
            <div className="flex items-center gap-2.5 bg-[#1E1A30] px-4.5 py-3.5">
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
                    <p className="text-[10.5px] text-[#5F5E5A]">{s.l}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {PLANNER_EVENTS.map((e) => (
                  <div key={e.name} className="flex items-center gap-3 rounded-xl border border-[#EFE6DD] p-2.5">
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
                <p className="text-[26px]">{f.icon}</p>
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

const EVENT_TYPES = [
  { emoji: "💍", name: "Nuntă", selected: true },
  { emoji: "🍼", name: "Botez" },
  { emoji: "🎂", name: "Aniversare" },
  { emoji: "💚", name: "Cauză" },
  { emoji: "🏢", name: "Corporate" },
  { emoji: "🕊️", name: "Comemorare" },
  { emoji: "➕", name: "Altul", muted: true },
];

const formBox = "rounded-2xl border border-[#EFE6DD] bg-white p-4.5 text-[#2B2740]";

function FakeField({ label, value, tall = false }: { label: string; value: string; tall?: boolean }) {
  return (
    <div className="mb-3.5 last:mb-0">
      <p className="mb-1.5 text-[13px] font-semibold">{label}</p>
      <div className={`rounded-lg border border-[#EFE6DD] bg-[#FFF8F1] px-3.5 py-2.5 text-sm text-[#8A8496] ${tall ? "min-h-[54px]" : ""}`}>{value}</div>
    </div>
  );
}

export function CreateContent({ startHref }: { startHref: string }) {
  return (
    <>
      <OverlayHero
        eyebrow="Creează-ți pagina"
        title="De la idee la invitație,"
        accent="în câteva minute"
        text="Nu trebuie să fii tehnic. Patru pași simpli și pagina evenimentului tău e gata de trimis. Iată cum arată procesul."
      />
      <div className={inner}>
        <Step
          n={1}
          color="#FFD23F"
          label="Alege tipul"
          title="Ce eveniment organizezi?"
          flip={false}
          visual={
            <div className={formBox} aria-hidden="true">
              <div className="grid grid-cols-4 gap-3">
                {EVENT_TYPES.map((t) => (
                  <div
                    key={t.name}
                    className={`rounded-xl border-[1.5px] px-2 py-4 text-center ${
                      t.selected === true ? "border-accent bg-[#FFF8F1]" : "border-[#EFE6DD] bg-white"
                    } ${t.muted === true ? "opacity-50" : ""}`}
                  >
                    <p className="text-[26px]">{t.emoji}</p>
                    <p className="mt-1.5 text-[13px] font-semibold">{t.name}</p>
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <Intro>
            Pornești de la un model gata făcut, potrivit tipului tău de eveniment. Fiecare vine cu secțiunile și stilul potrivite
            — nu construiești de la zero.
          </Intro>
          <Intro small>Nuntă, botez, aniversare, gală, corporate sau comemorare — alegi și restul se adaptează.</Intro>
        </Step>
        <Step
          n={2}
          color="#FF9F45"
          label="Completează detaliile"
          title="Cine, când și unde"
          flip
          visual={
            <div className={formBox} aria-hidden="true">
              <FakeField label="Numele evenimentului" value="Maria & Andrei" />
              <FakeField label="Data" value="12 septembrie 2026" />
              <FakeField label="Locația" value="Castelul Cantacuzino, Bușteni" />
              <FakeField label="Mesaj de bun venit" value="Vino să fii parte din povestea noastră..." tall />
            </div>
          }
        >
          <Intro>
            Adaugi numele, data și locul. Atât. Pagina prinde formă instant, iar tu vezi în timp real cum va arăta invitația.
          </Intro>
          <Intro small>Poți reveni oricând să schimbi orice — nimic nu e bătut în cuie.</Intro>
        </Step>
        <Step
          n={3}
          color="#E8779E"
          label="Personalizează"
          title="Pune-ți amprenta"
          flip={false}
          visual={
            <div aria-hidden="true">
              <div className={`rounded-2xl px-5 py-8 text-center text-white ${lp.gradBg}`}>
                <p className="text-[10px] font-bold tracking-[0.2em] opacity-90">NUNTĂ</p>
                <p className="mt-2 font-display text-[28px] font-bold italic">Maria &amp; Andrei</p>
                <p className="mt-1 text-sm opacity-90">12 septembrie 2026</p>
                <div className="mt-3.5 flex flex-wrap justify-center gap-1.5">
                  {["💛 Fond activ", "📅 Program", "📸 Live"].map((chip) => (
                    <span key={chip} className="rounded-full bg-white/25 px-3 py-1 text-[11px] font-semibold">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-muted">Previzualizare în timp real</p>
            </div>
          }
        >
          <Intro>
            Alegi o copertă, adaugi prima poză sau primul moment, activezi secțiunile pe care le vrei: fond de contribuții,
            program, hartă, mese. Pagina e a ta.
          </Intro>
          <Intro small>Tot ce alegi se vede instant în previzualizare — exact ce vor vedea invitații.</Intro>
        </Step>
        <Step
          n={4}
          color="#7F77DD"
          label="Trimite invitația"
          title="Un link și gata"
          flip
          visual={
            <div className={`${formBox} text-center`} aria-hidden="true">
              <p className="mb-3 text-[13px] font-semibold">Pagina ta e gata de trimis</p>
              <div className="mb-3.5 rounded-lg border border-[#EFE6DD] bg-[#FFF8F1] p-3 text-[13px] font-semibold text-accent">
                povesteanoastra.ro/maria-andrei
              </div>
              <div className="mx-auto mb-3.5 size-[120px] rounded-xl border border-[#EFE6DD] bg-white p-3">
                <QrMark className="size-full" />
              </div>
              <div className="flex justify-center gap-2">
                <span className="rounded-full bg-accent px-4.5 py-2 text-xs font-semibold text-white">Copiază linkul</span>
                <span className="rounded-full bg-gold px-4.5 py-2 text-xs font-semibold">Trimite pe WhatsApp</span>
              </div>
            </div>
          }
        >
          <Intro>
            Pagina e gata. O trimiți printr-un link sau un cod QR — pe WhatsApp, prin mesaj, oriunde. Invitații o deschid și
            confirmă cu un tap, fără să instaleze nimic.
          </Intro>
          <Intro small>Din acest moment, povestea ta a început. Poți posta primul moment chiar azi.</Intro>
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
