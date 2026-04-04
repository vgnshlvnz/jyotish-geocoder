import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jyotish Lagna Calculator — Udaya, Hora & Ghati with Parihara",
  description: "Vedic Ephemeris — compute Udaya, Hora & Ghati Lagna with full Parihara, Deva/Devi worship guidance, mantras and prayers for each rasi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
