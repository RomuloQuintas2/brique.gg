import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Agentation } from "agentation";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const title = "brique.gg — Lucro real para quem revende";
const description =
  "Cadastre produtos, registre vendas e acompanhe estoque, financeiro e lucro num só lugar.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: "brique.gg",
  openGraph: {
    title,
    description,
    siteName: "brique.gg",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1D4ED8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={plusJakartaSans.variable}>
      <body style={{ fontFamily: "var(--font-jakarta), -apple-system, sans-serif" }}>
        {children}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
