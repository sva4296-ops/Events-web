import { BrandHeader } from "@/components/BrandMark";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col gap-10">
      <BrandHeader />
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <p className="text-5xl" aria-hidden="true">✉️</p>
        <h1 className="font-display text-2xl font-bold">Invitația nu a fost găsită</h1>
        <p className="max-w-xs text-muted">
          Linkul poate fi incomplet sau invitația a fost retrasă. Verifică mesajul primit sau
          cere-i organizatorului un link nou.
        </p>
      </div>
    </div>
  );
}
