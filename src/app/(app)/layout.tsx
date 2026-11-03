/** Centered column for the app pages; the landing page on / is full-width. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1304px] flex-col px-4 py-8 sm:px-8 lg:py-12">{children}</main>
  );
}
