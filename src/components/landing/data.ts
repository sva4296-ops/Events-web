/** Static copy for the landing page (texts in Romanian, as in the rest of the UI). */

import {
  Armchair,
  Baby,
  Bell,
  BookOpen,
  Building,
  Cake,
  CalendarDays,
  Flower,
  Gem,
  HandHeart,
  Handshake,
  Images,
  Mail,
  MapPin,
  MessageCircle,
  QrCode,
  UtensilsCrossed,
} from "lucide-react";

export const NAV_LINKS = [
  { href: "#cum", label: "Cum funcționează" },
  { href: "#functii", label: "Funcții" },
  { href: "#evenimente", label: "Evenimente" },
  { href: "#faq", label: "Întrebări" },
  { href: "#preturi", label: "Prețuri" },
] as const;

export const OLD_WAY = [
  "O invitație frumoasă, văzută o singură dată",
  "RSVP pe un site, pozele pe WhatsApp, programul pe hârtie",
  "Totul împrăștiat, nimic nu rămâne după",
  "Invitații sunt spectatori, nu parte din poveste",
];

export const NEW_WAY = [
  "Un parcurs viu, urmărit lună după lună",
  "Invitație, program, poze și chat — la un loc",
  "Un album și o poveste care rămân pentru totdeauna",
  "Invitații trăiesc evenimentul alături de tine",
];

export const VERTICALS = [
  { icon: Gem, name: "Nuntă", text: "Parcursul până la „Da”, programul zilei, albumul tuturor.", type: "wedding" as const },
  { icon: Baby, name: "Botez", text: "Pregătirile, nașii, pozele tuturor de la botez.", type: "baptism" as const },
  { icon: Cake, name: "Aniversare", text: "Majorate, aniversări rotunde — momente care merită o poveste.", type: "birthday" as const },
  { icon: HandHeart, name: "Cauze & gale", text: "Invitații, programul și momentele evenimentului, într-un singur loc.", type: "cause" as const },
  { icon: Building, name: "Corporate", text: "Gale, conferințe, premii — cu networking și branding propriu.", type: "corporate" as const },
  { icon: Flower, name: "Comemorare", text: "Un spațiu sobru și respectuos pentru a păstra amintirile împreună.", type: "memorial" as const },
];

export const FEATURE_GROUPS = [
  {
    title: "Înainte de eveniment",
    photo: 2,
    items: [
      { icon: Mail, title: "Invitație & Confirmare", text: "Pagină frumoasă, link sau QR, confirmări cu un tap — fără cont pentru invitați." },
      { icon: BookOpen, title: "Momente în timp real", text: "Postezi momente din pregătiri. Invitații urmăresc povestea, lună după lună." },
      { icon: MessageCircle, title: "Chat & comentarii", text: "Invitații vorbesc între ei și cu tine, comentează la fiecare moment." },
      { icon: Bell, title: "Notificări", text: "Toți rămân la curent: un moment nou, o confirmare, o schimbare de dată sau locație." },
    ],
  },
  {
    title: "Planul zilei",
    photo: 1,
    items: [
      { icon: CalendarDays, title: "Program & agendă", text: "Orarul complet al zilei, pas cu pas, vizibil pentru toți." },
      { icon: MapPin, title: "Hartă & locație", text: "Adresă, cum ajungi, navigare — și cazare recomandată pentru cei din alte orașe." },
      { icon: UtensilsCrossed, title: "Meniu & preferințe", text: "Felurile serii, plus opțiuni alimentare (vegetarian, fără gluten) alese de invitați." },
      { icon: Armchair, title: "Așezare la mese", text: "Cine stă unde, organizat clar — fără confuzii în ziua cea mare." },
    ],
  },
  {
    title: "În ziua evenimentului și după",
    photo: 9,
    items: [
      { icon: QrCode, title: "Ecran live & QR", text: "În sală, pozele curg în timp real. Invitații scanează și adaugă pe loc." },
      { icon: Images, title: "Album & recapitulare", text: "După eveniment, toate pozele tuturor, adunate într-un album pe care îl păstrezi." },
      { icon: Handshake, title: "Furnizori", text: "Foto, muzică, decor, locație — tag-uiți pe pagină, ușor de recomandat." },
    ],
  },
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
  { tier: "Esențial", amount: "149", unit: "lei", features: ["Invitație & Confirmare", "Momente în timp real", "Album foto", "Până la 50 invitați"], action: "start", cta: "Alege" },
  { tier: "Complet", amount: "299", unit: "lei", features: ["Tot din Esențial", "Ecran live + QR", "Chat & comentarii", "Invitați nelimitați"], highlighted: true, action: "start", cta: "Alege" },
  { tier: "Premium", amount: "499", unit: "lei", features: ["Tot din Complet", "Cazare & transport", "Furnizori tag-uiți", "Suport prioritar"], action: "start", cta: "Alege" },
  { tier: "Agenție", amount: "de la 179", unit: "lei/ev.", features: ["Volum multiplu", "Branding propriu", "Panou centralizat", "Facturare pe volum"], action: "planner", cta: "Vezi panoul" },
];

export const START_STEPS = [
  { title: "Alege tipul", text: "Nuntă, botez, gală sau corporate — pornești de la un model gata făcut." },
  { title: "Personalizează", text: "Adaugi data, locul, o copertă și primul moment. Totul vizual, fără cod." },
  { title: "Trimite invitația", text: "Un link sau un cod QR și gata — povestea ta a început." },
];

export const FAQ = [
  { q: "Trebuie invitații să-și facă cont?", a: "Nu. Invitații deschid linkul, văd invitația și confirmă cu un tap. Fără cont, fără aplicații de instalat — totul funcționează direct în browser." },
  { q: "Funcționează pe telefon?", a: "Da, totul e gândit întâi pentru telefon. Invitații folosesc platforma de pe mobil, iar organizatorul poate gestiona evenimentul și de pe laptop, și de pe telefon." },
  { q: "Pentru ce tipuri de evenimente pot folosi platforma?", a: "Nuntă, botez, aniversare, gală caritabilă, eveniment corporate și chiar comemorare. Aceeași platformă se adaptează la fiecare, cu culori și conținut potrivite." },
  { q: "Pozele și datele mele sunt în siguranță?", a: "Da. Datele sunt protejate, iar tu controlezi cine vede și cine editează pagina evenimentului tău." },
  { q: "Sunt event planner — pot gestiona mai multe evenimente?", a: "Da. Există un panou dedicat agențiilor: gestionezi toate evenimentele dintr-un loc, cu branding propriu pe paginile clienților și facturare pe volum." },
];

export const TOUR_STEPS = [
  { sel: "#hero", title: "Bun venit", text: "PovesteaNoastra adună tot evenimentul tău într-un singur loc viu: invitație, parcurs, poze și amintiri. Hai să-ți arăt ce poate." },
  { sel: "#cum", title: "Cum funcționează", text: "Patru etape: lansezi pagina, postezi momente pe parcurs, trăiești ziua evenimentului live și păstrezi totul într-un recap. O poveste întreagă, nu o invitație statică." },
  { sel: "#functii", title: "Tot ce poți face", text: "Invitație, feed, chat, program, hartă, meniu, mese, furnizori, ecran live, album. O platformă cu toate uneltele — fără zece aplicații." },
  { sel: "#evenimente", title: "Pentru orice eveniment", text: "Nuntă, botez, aniversare, cauză, corporate, comemorare. Aceeași experiență caldă, adaptată fiecărui tip de eveniment din viața ta." },
  { sel: "#faq", title: "Întrebări frecvente", text: "Răspunsuri la tot ce contează: cont, plăți, siguranță, tipuri de evenimente. Iar dacă vrei să vezi produsul în acțiune, apasă „Vezi cum funcționează” oriunde pe pagină." },
  { sel: "#preturi", title: "Prețuri simple", text: "Plătești o dată, per eveniment. Alegi pachetul potrivit mărimii evenimentului — fără abonament ascuns." },
  { sel: "#hero", title: "Asta e PovesteaNoastra", text: "Mai mult decât o invitație — toată povestea. Mulțumim că ai urmărit turul! Acum poți explora singur sau intra în cont. 💛" },
];
