import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "brique.gg — Painel",
  description: "Gestão de estoque, vendas e financeiro para revendedores.",
  openGraph: {
    title: "brique.gg — Painel",
    siteName: "brique.gg",
  },
};

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
