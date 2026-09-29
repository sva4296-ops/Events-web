import { BrandMark } from "@/components/BrandMark";

/** Store links come from env so they can be filled in once the app is
 * published; until then the buttons render as a "coming soon" state. */
const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL ?? "";
const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? "";

const FEATURES = [
  { icon: "📅", label: "Programul zilei" },
  { icon: "📸", label: "Poze live" },
  { icon: "💬", label: "Chat cu invitații" },
  { icon: "📍", label: "Locație și detalii" },
];

function StoreButton({ href, label }: { href: string; label: string }) {
  const available = href.length > 0;
  const className =
    "flex flex-1 flex-col items-center justify-center rounded-2xl px-4 py-2.5 text-center transition";

  if (!available) {
    return (
      <div className={`${className} border border-white/25 bg-white/10`} aria-disabled="true">
        <span className="text-[10px] uppercase tracking-wider text-white/70">În curând pe</span>
        <span className="text-sm font-semibold text-white">{label}</span>
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} bg-white text-[#2B2740] shadow-md active:scale-[0.98]`}
    >
      <span className="text-[10px] uppercase tracking-wider text-[#8A8496]">Descarcă din</span>
      <span className="text-sm font-semibold">{label}</span>
    </a>
  );
}

export function AppBanner() {
  return (
    <section
      className="relative overflow-hidden rounded-3xl p-6 text-white shadow-xl shadow-[#7F77DD]/25"
      style={{ background: "linear-gradient(135deg, #E8779E 0%, #9B7BE0 55%, #7F77DD 100%)" }}
      aria-labelledby="app-banner-title"
    >
      {/* Soft decorative glow + brand curve, purely visual. */}
      <div
        className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#F5C36B]/40 blur-2xl"
        aria-hidden="true"
      />
      <BrandMark className="pointer-events-none absolute -bottom-3 -right-4 h-24 w-32 opacity-30" />

      <div className="relative flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
            Aplicația PovesteaNoastra
          </p>
          <h2 id="app-banner-title" className="font-display text-2xl font-bold leading-tight">
            Toată povestea, în buzunarul tău
          </h2>
          <p className="text-sm text-white/85">
            Vezi programul, pozele și noutățile evenimentului în timp real.
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-2">
          {FEATURES.map((feature) => (
            <li
              key={feature.label}
              className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-sm backdrop-blur-sm"
            >
              <span aria-hidden="true">{feature.icon}</span>
              <span className="font-medium">{feature.label}</span>
            </li>
          ))}
        </ul>

        <div className="flex gap-2">
          <StoreButton href={APP_STORE_URL} label="App Store" />
          <StoreButton href={PLAY_STORE_URL} label="Google Play" />
        </div>

        <p className="flex items-start gap-2 text-xs text-white/85">
          <span aria-hidden="true">📱</span>
          <span>
            Intră cu <strong className="font-semibold text-white">același număr de telefon</strong>{" "}
            pe care ai primit invitația și o vei găsi deja acolo.
          </span>
        </p>
      </div>
    </section>
  );
}
