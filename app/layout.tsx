import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { headers } from "next/headers";
import { PwaInstallProvider } from "@/components/brique-control/PwaInstallContext";
import IosInstallModal from "@/components/brique-control/IosInstallModal";
import ServiceWorkerRegister from "@/components/brique-control/ServiceWorkerRegister";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const title = "brique.gg: Lucro real para quem revende";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Reading headers() here forces every page under this layout into dynamic
  // rendering. Required: the CSP nonce is generated fresh per-request in
  // middleware.ts, but without this, Next.js statically prerenders pages like
  // /login at build time with their own baked-in nonce -- which then never
  // matches the fresh nonce in the per-request CSP header, so the browser
  // blocks every script on the page (looks like a broken site, isn't a 503).
  await headers();

  return (
    <html lang="pt-BR" className={plusJakartaSans.variable}>
      <body style={{ fontFamily: "var(--font-jakarta), -apple-system, sans-serif" }}>
        <PwaInstallProvider>
          {children}
          <IosInstallModal />
          <ServiceWorkerRegister />
        </PwaInstallProvider>
      </body>
    </html>
  );
}
