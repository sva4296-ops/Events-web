/** Static copy for the landing page (texts in Romanian, as in the rest of the UI). */

export const NAV_LINKS = [
  { href: "#cum", label: "Cum funcționează" },
  { href: "#functii", label: "Funcții" },
  { href: "#evenimente", label: "Evenimente" },
  { href: "#preturi", label: "Prețuri" },
  { href: "#faq", label: "Întrebări" },
] as const;

export const OLD_WAY = [
  "O invitație frumoasă, văzută o singură dată",
  "RSVP pe un site, pozele pe WhatsApp, banii în plic",
  "Totul împrăștiat, nimic nu rămâne după",
  "Invitații sunt spectatori, nu parte din poveste",
];

export const NEW_WAY = [
  "Un parcurs viu, urmărit lună după lună",
  "Invitație, contribuții, poze și chat — la un loc",
  "Un album și o poveste care rămân pentru totdeauna",
  "Invitații trăiesc evenimentul alături de tine",
];

export const VERTICALS = [
  { emoji: "💍", name: "Nuntă", text: "Parcursul până la „Da”, contribuții la luna de miere, albumul tuturor.", tint: "from-[#FFF6F0] to-[#FBEAE2]" },
  { emoji: "🍼", name: "Botez", text: "Pregătirile, nașii, fondul de viitor al celui mic.", tint: "from-[#F0F5FF] to-[#DEEAFB]" },
  { emoji: "🎂", name: "Aniversare", text: "Majorate, aniversări rotunde — momente care merită o poveste.", tint: "from-[#FDF6E8] to-[#FBE8C8]" },
  { emoji: "💚", name: "Cauze & gale", text: "Strângeri de fonduri transparente, cu impactul la vedere.", tint: "from-[#EDF9F4] to-[#D4EFE5]" },
  { emoji: "🏢", name: "Corporate", text: "Gale, conferințe, premii — cu networking și branding propriu.", tint: "from-[#EEF2F7] to-[#DCE5F0]" },
  { emoji: "🕊️", name: "Comemorare", text: "Un spațiu sobru și respectuos pentru a păstra amintirile împreună.", tint: "from-[#F4F1EE] to-[#E8E4DD]" },
];

export const FEATURES = [
  { icon: "📨", title: "Invitație & RSVP", text: "Pagină frumoasă, link sau QR, confirmări cu un tap — fără cont pentru invitați." },
  { icon: "📖", title: "Feed de parcurs", text: "Postezi momente din pregătiri. Invitații urmăresc povestea, lună după lună." },
  { icon: "💛", title: "Contribuții la un scop", text: "Lună de miere, casă, o cauză — invitații contribuie online, securizat." },
  { icon: "💬", title: "Chat & comentarii", text: "Invitații vorbesc între ei și cu tine, comentează la fiecare moment." },
  { icon: "📅", title: "Program & agendă", text: "Orarul complet al zilei, pas cu pas, vizibil pentru toți." },
  { icon: "📍", title: "Hartă & locație", text: "Adresă, cum ajungi, navigare — și cazare recomandată pentru cei din alte orașe." },
  { icon: "🍽️", title: "Meniu & preferințe", text: "Felurile serii, plus opțiuni alimentare (vegetarian, fără gluten) alese de invitați." },
  { icon: "🪑", title: "Așezare la mese", text: "Cine stă unde, organizat clar — fără confuzii în ziua cea mare." },
  { icon: "🤝", title: "Furnizori", text: "Foto, muzică, decor, locație — tag-uiți pe pagină, ușor de recomandat." },
  { icon: "📸", title: "Ecran live & QR", text: "În sală, pozele curg în timp real. Invitații scanează și adaugă pe loc." },
  { icon: "✨", title: "Album & recap", text: "După eveniment, toate pozele tuturor, adunate într-un album pe care îl păstrezi." },
  { icon: "🔔", title: "Notificări", text: "Toți rămân la curent: un moment nou, o confirmare, o contribuție." },
];

export const FOR_WHOM = [
  { emoji: "💑", name: "Cupluri", text: "Care vor mai mult decât o invitație pentru nunta lor." },
  { emoji: "👨‍👩‍👧", name: "Părinți", text: "Botez, aniversare — momentele copiilor, păstrate." },
  { emoji: "💚", name: "Organizații", text: "Gale și cauze cu strângeri de fonduri transparente." },
  { emoji: "🏢", name: "Companii", text: "Gale, conferințe și evenimente cu branding propriu." },
  { emoji: "🎯", name: "Event planneri", text: "Agenții care gestionează multe evenimente deodată." },
];

export type PlanAction = "start" | "planner";

export const PLANS: {
  tier: string;
  amount: string;
  unit: string;
  features: string[];
  highlighted?: boolean;
  action: PlanAction;
  cta: string;
}[] = [
  { tier: "Esențial", amount: "149", unit: "lei", features: ["Invitație & RSVP", "Feed de parcurs", "Album foto", "Până la 50 invitați"], action: "start", cta: "Alege" },
  { tier: "Complet", amount: "299", unit: "lei", features: ["Tot din Esențial", "Fond de contribuții", "Ecran live + QR", "Chat & comentarii", "Invitați nelimitați"], highlighted: true, action: "start", cta: "Alege" },
  { tier: "Premium", amount: "499", unit: "lei", features: ["Tot din Complet", "Cazare & transport", "Furnizori tag-uiți", "Suport prioritar"], action: "start", cta: "Alege" },
  { tier: "Agenție", amount: "de la 179", unit: "lei/ev.", features: ["Volum multiplu", "Branding propriu", "Panou centralizat", "Facturare pe volum"], action: "planner", cta: "Vezi panoul" },
];

export const WHY_US = [
  { title: "Parcursul pe luni", text: "Alții îți dau o invitație văzută o dată. Noi îți dăm o poveste vie, urmărită din prima zi până după eveniment." },
  { title: "Contribuții cu plăți locale", text: "Funcționează cu cardul și sistemele de plată din România — nu depinzi de aplicații străine care nu merg aici." },
  { title: "Pentru orice eveniment", text: "Nuntă, botez, aniversare, cauză, corporate — o singură platformă, adaptată fiecărui tip." },
  { title: "Totul la un loc", text: "Invitație, parcurs, contribuții, chat, program, album. Fără zece aplicații împrăștiate." },
];

export const START_STEPS = [
  { title: "Alege tipul", text: "Nuntă, botez, gală sau corporate — pornești de la un model gata făcut." },
  { title: "Personalizează", text: "Adaugi data, locul, o copertă și primul moment. Totul vizual, fără cod." },
  { title: "Trimite invitația", text: "Un link sau un cod QR și gata — povestea ta a început." },
];

export const FAQ = [
  { q: "Trebuie invitații să-și facă cont?", a: "Nu. Invitații deschid linkul, văd invitația și confirmă cu un tap. Fără cont, fără aplicații de instalat — totul funcționează direct în browser." },
  { q: "Cum ajung banii din contribuții la mine?", a: "Contribuțiile se procesează securizat prin Stripe și ajung direct la tine, organizatorul. Platforma nu ține banii — doar reține un comision mic și transparent pe fiecare contribuție." },
  { q: "Funcționează pe telefon?", a: "Da, totul e gândit întâi pentru telefon. Invitații folosesc platforma de pe mobil, iar organizatorul poate gestiona evenimentul și de pe laptop, și de pe telefon." },
  { q: "Pentru ce tipuri de evenimente pot folosi platforma?", a: "Nuntă, botez, aniversare, gală caritabilă, eveniment corporate și chiar comemorare. Aceeași platformă se adaptează la fiecare, cu culori și conținut potrivite." },
  { q: "Pozele și datele mele sunt în siguranță?", a: "Da. Datele sunt protejate, plățile sunt securizate prin Stripe, iar tu controlezi cine vede și cine editează pagina evenimentului tău." },
  { q: "Sunt event planner — pot gestiona mai multe evenimente?", a: "Da. Există un panou dedicat agențiilor: gestionezi toate evenimentele dintr-un loc, cu branding propriu pe paginile clienților și facturare pe volum." },
];

export const TOUR_STEPS = [
  { sel: "#hero", title: "Bun venit", text: "PovesteaNoastra adună tot evenimentul tău într-un singur loc viu: invitație, parcurs, contribuții și amintiri. Hai să-ți arăt ce poate." },
  { sel: "#cum", title: "Cum funcționează", text: "Patru etape: lansezi pagina, postezi momente pe parcurs, trăiești ziua X live și păstrezi totul într-un recap. O poveste întreagă, nu o invitație statică." },
  { sel: "#functii", title: "Tot ce poți face", text: "Invitație, feed, contribuții, chat, program, hartă, meniu, mese, furnizori, ecran live, album. O platformă cu toate uneltele — fără zece aplicații." },
  { sel: "#evenimente", title: "Pentru orice eveniment", text: "Nuntă, botez, aniversare, cauză, corporate, comemorare. Aceeași experiență caldă, adaptată fiecărui tip de eveniment din viața ta." },
  { sel: "#contributii", title: "Contribuțiile", text: "În loc de un cadou, invitații contribuie la un scop — luna de miere, casa, o cauză. Transparent, securizat, banii ajung direct la tine." },
  { sel: "#preturi", title: "Prețuri simple", text: "Plătești o dată, per eveniment. Alegi pachetul potrivit mărimii evenimentului — fără abonament ascuns." },
  { sel: "#faq", title: "Întrebări frecvente", text: "Răspunsuri la tot ce contează: cont, plăți, siguranță, tipuri de evenimente. Iar dacă vrei să vezi produsul în acțiune, apasă „Vezi cum funcționează” oriunde pe pagină." },
  { sel: "#hero", title: "Asta e PovesteaNoastra", text: "Mai mult decât o invitație — toată povestea. Mulțumim că ai urmărit turul! Acum poți explora singur sau intra în cont. 💛" },
];
