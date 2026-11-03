import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Lora } from "next/font/google";

import "./globals.css";

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
  weight: "600",
});
const lora = Lora({ variable: "--font-lora", subsets: ["latin", "latin-ext"], weight: "400" });

export const metadata: Metadata = {
  title: "PovesteaNoastra",
  description: "Mai mult decât o invitație. Toată povestea.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EEE5D9" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ro" className={`${instrument.variable} ${bricolage.variable} ${lora.variable} scroll-smooth antialiased`}>
      <body>{children}</body>
    </html>
  );
}
