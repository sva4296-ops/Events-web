import type { Metadata } from "next";

import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Termeni și condiții · PovesteaNoastra",
  description: "Termenii de utilizare pentru aplicația și site-ul PovesteaNoastra.",
};

const CONTACT = "[EMAIL DE CONTACT]";

export default function TermsPage() {
  return (
    <LegalPage
      title="Termeni și condiții"
      updated="[DATA]"
      intro={
        <p>
          Acești termeni se aplică aplicației mobile PovesteaNoastra și site-ului asociat (împreună,
          „Serviciul”), operate de [OPERATOR: nume / PFA / SRL, CUI, adresă]. Folosind Serviciul, ești de
          acord cu ei.
        </p>
      }
      sections={[
        {
          title: "Ce oferă Serviciul",
          body: (
            <p>
              PovesteaNoastra te ajută să organizezi un eveniment: invitații cu link personal, confirmări
              (RSVP), momente din pregătiri, chat, poze live, album și, în anumite planuri, un fond de
              contribuții.
            </p>
          ),
        },
        {
          title: "Contul tău",
          body: (
            <>
              <p>
                Te autentifici cu numărul de telefon, prin cod SMS. Ești responsabil pentru activitatea din
                contul tău și pentru corectitudinea datelor pe care le introduci.
              </p>
              <p>Trebuie să ai cel puțin [VÂRSTA MINIMĂ] ani ca să îți creezi un cont.</p>
            </>
          ),
        },
        {
          title: "Conținutul pe care îl adaugi",
          body: (
            <>
              <p>
                Pozele, mesajele și textele rămân ale tale. Ne dai doar dreptul de a le stoca și afișa celor
                invitați la eveniment, cât timp e nevoie ca Serviciul să funcționeze.
              </p>
              <p>Nu ai voie să publici conținut ilegal, ofensator sau care încalcă drepturile altcuiva.</p>
            </>
          ),
        },
        {
          title: "Invitații și datele lor",
          body: (
            <p>
              Când adaugi invitați, ne confirmi că ai dreptul să le folosești numele și numărul de telefon
              pentru a le trimite invitația. Detalii în Politica de confidențialitate.
            </p>
          ),
        },
        {
          title: "Planuri și plăți",
          body: (
            <p>
              Unele funcții sunt disponibile doar în planurile plătite. Prețurile sunt afișate înainte de
              cumpărare, iar plata se face prin [PROCESATOR PLĂȚI / App Store / Google Play]. Condițiile de
              rambursare: [POLITICA DE RAMBURSARE].
            </p>
          ),
        },
        {
          title: "Suspendare și ștergere",
          body: (
            <p>
              Poți șterge oricând contul, din aplicație (Profil) sau scriind la {CONTACT}. Putem suspenda un
              cont care încalcă acești termeni.
            </p>
          ),
        },
        {
          title: "Răspundere",
          body: (
            <p>
              Serviciul este oferit „ca atare”. Facem tot ce putem ca să funcționeze fără întreruperi, dar nu
              garantăm asta. Nu răspundem pentru evenimentele în sine, organizate de utilizatori.
            </p>
          ),
        },
        {
          title: "Modificări și contact",
          body: (
            <p>
              Putem actualiza acești termeni; te anunțăm în aplicație la schimbări importante. Pentru orice
              întrebare, scrie-ne la <strong>{CONTACT}</strong>. Se aplică legea română.
            </p>
          ),
        },
      ]}
    />
  );
}
