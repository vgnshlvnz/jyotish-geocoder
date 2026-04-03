import "./globals.css";
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: "Jyotish Lagna Calculator",
  description: "Professional Vedic Ephemeris • Udaya, Hora & Ghati Lagna",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
