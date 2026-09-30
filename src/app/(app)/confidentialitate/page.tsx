import type { Metadata } from "next";

import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Politica de confidențialitate · PovesteaNoastra",
  description: "Cum colectează și folosește PovesteaNoastra datele personale.",
};

const CONTACT = "[EMAIL DE CONTACT]";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Politica de confidențialitate"
      updated="[DATA]"
      intro={
        <p>
          Operatorul datelor este [OPERATOR: nume / PFA / SRL, CUI, adresă]. Politica explică ce date
          colectăm prin aplicația PovesteaNoastra și site-ul asociat, de ce și ce drepturi ai, conform
          GDPR (Regulamentul UE 2016/679).
        </p>
      }
      sections={[
        {
          title: "Ce date colectăm",
          body: (
            <ul>
              <li>
                <strong>Cont:</strong> numărul de telefon, prenumele, numele, opțional emailul și poza de
                profil.
              </li>
              <li>
                <strong>Evenimente:</strong> numele, data, locul, mesajul, programul, meniul, mesele,
                cazarea și furnizorii pe care îi adaugi.
              </li>
              <li>
                <strong>Invitați:</strong> numele și telefonul adăugate de organizator, răspunsul la
                invitație și preferințele de meniu.
              </li>
              <li>
                <strong>Conținut:</strong> momente, poze, mesaje din chat și reacții.
              </li>
              <li>
                <strong>Tehnic:</strong> date minime de funcționare și rapoarte de erori.
              </li>
            </ul>
          ),
        },
        {
          title: "De ce le folosim",
          body: (
            <p>
              Ca să funcționeze Serviciul (autentificare, invitații, confirmări, conținutul evenimentului) și
              ca să îl putem îmbunătăți. Baza legală este executarea contractului cu tine și, pentru
              invitați, interesul legitim al organizatorului de a-i invita.
            </p>
          ),
        },
        {
          title: "Cu cine le împărtășim",
          body: (
            <>
              <p>Nu vindem date personale. Folosim furnizori care procesează date în numele nostru:</p>
              <ul>
                <li>Supabase (baza de date și fișiere), regiunea [REGIUNE SUPABASE]</li>
                <li>Twilio (trimiterea codului SMS)</li>
                <li>Vercel (găzduirea site-ului)</li>
                <li>[PROCESATOR PLĂȚI], pentru planurile plătite</li>
              </ul>
              <p>
                Invitațiile pe WhatsApp sunt trimise de organizator, din contul lui, prin aplicația WhatsApp.
              </p>
            </>
          ),
        },
        {
          title: "Cât timp le păstrăm",
          body: (
            <p>
              Cât ai cont și cât e activ evenimentul. După ștergerea contului sau a evenimentului, datele sunt
              șterse în cel mult [N] zile, cu excepția celor pe care legea ne obligă să le păstrăm.
            </p>
          ),
        },
        {
          title: "Drepturile tale",
          body: (
            <p>
              Ai dreptul de acces, rectificare, ștergere, restricționare, portabilitate și opoziție. Pentru
              oricare dintre ele, scrie la <strong>{CONTACT}</strong>. Poți depune plângere la ANSPDCP
              (dataprotection.ro).
            </p>
          ),
        },
        {
          title: "Ștergerea contului",
          body: (
            <>
              <p>
                Poți cere ștergerea contului și a datelor asociate fără să instalezi aplicația: trimite un
                email la <strong>{CONTACT}</strong> de pe orice adresă, cu numărul de telefon folosit la
                autentificare. Confirmăm prin SMS și ștergem datele în cel mult [N] zile.
              </p>
              <p>Din aplicație: Profil, apoi Șterge contul [DISPONIBIL ÎN CURÂND].</p>
            </>
          ),
        },
        {
          title: "Securitate și copii",
          body: (
            <p>
              Datele sunt transmise criptat, iar pozele sunt accesibile doar prin linkuri temporare.
              Serviciul nu se adresează copiilor sub [VÂRSTA MINIMĂ] ani.
            </p>
          ),
        },
      ]}
    />
  );
}
