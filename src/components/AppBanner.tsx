/** Store links come from env so they can be filled in once the app is
 * published; until then the buttons render as a "coming soon" state. */
const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL ?? "";
const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? "";

function StoreButton({ href, label }: { href: string; label: string }) {
  const available = href.length > 0;
  const className = "flex min-h-[54px] flex-1 flex-col items-center justify-center rounded-full px-4 py-1.5 text-center transition";

  if (!available) {
    return (
      <div className={`${className} bg-surface-2`} aria-disabled="true">
        <span className="text-[11px] text-muted">În curând pe</span>
        <span className="text-sm font-semibold text-ink">{label}</span>
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} bg-accent-fill text-on-accent shadow-accent active:scale-[0.98]`}
    >
      <span className="text-[11px] opacity-85">Descarcă din</span>
      <span className="text-sm font-semibold">{label}</span>
    </a>
  );
}

export function AppBanner() {
  return (
    <section aria-label="Aplicația PovesteaNoastra" className="flex flex-col gap-4">
      <p className="text-[13px] leading-5 text-muted">
        Programul, pozele și noutățile evenimentului sunt în aplicația PovesteaNoastra. Intră cu{" "}
        <strong className="font-semibold text-ink">același număr de telefon</strong> pe care ai primit invitația și o vei
        găsi deja acolo.
      </p>
      <div className="flex gap-2">
        <StoreButton href={APP_STORE_URL} label="App Store" />
        <StoreButton href={PLAY_STORE_URL} label="Google Play" />
      </div>
    </section>
  );
}
