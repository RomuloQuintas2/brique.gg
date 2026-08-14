"use client";

import { Check } from "lucide-react";
import AppShell from "@/components/brique-control/AppShell";
import PageHeader from "@/components/brique-control/PageHeader";
import ProBadge from "@/components/brique-control/ProBadge";
import { useBrique } from "@/components/brique-control/BriqueContext";

const freeFeatures = [
  "Produtos, vendas e estoque ilimitados",
  "Controle financeiro (a pagar, a receber, fiado)",
  "Clientes e fornecedores",
  "Calculadora de Lucro",
  "Consulta de IMEI",
  "Metas de lucro mensais",
];

const proFeatures = [
  "Bree — assistente de IA para o seu negócio",
  "Loja virtual própria",
  "Migração de dados com IA",
  "Geração de imagens de anúncio com IA",
  "Relatórios avançados por categoria e fornecedor",
  "Painel do Afiliado",
];

function AssinaturaContent() {
  const { isPro, openUpgradeModal } = useBrique();

  return (
    <>
      <PageHeader title="Assinatura" subtitle="Veja o que muda no plano PRO." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div
          className="rounded-[20px] bg-white p-6"
          style={{ border: "1px solid rgba(15,23,42,0.09)" }}
        >
          <div className="mb-1 flex items-center justify-between">
            <div className="text-[15px] font-bold text-[#1D4ED8]">Free</div>
            {!isPro && (
              <span className="rounded-full bg-slate-900/[0.06] px-2.5 py-1 text-[11px] font-bold text-[#5B6472]">
                Seu plano atual
              </span>
            )}
          </div>
          <div className="mb-5 text-[26px] font-extrabold text-[#101828]">
            R$ 0<span className="text-[14px] font-semibold text-[#94A3B8]"> /sempre</span>
          </div>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {freeFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-[#475467]">
                <Check size={16} className="mt-0.5 flex-shrink-0 text-[#3FBE7A]" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="rounded-[20px] p-6"
          style={{
            background: "linear-gradient(135deg, rgba(242,201,76,0.12), rgba(76,141,255,0.08))",
            border: "1px solid rgba(15,23,42,0.08)",
          }}
        >
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-[15px] font-bold text-[#1D4ED8]">PRO</div>
              <ProBadge />
            </div>
            {isPro && (
              <span className="rounded-full bg-[#3FBE7A]/15 px-2.5 py-1 text-[11px] font-bold text-[#1B7A4A]">
                Seu plano atual
              </span>
            )}
          </div>
          <div className="mb-5 text-[26px] font-extrabold text-[#101828]">
            Tudo do Free <span className="text-[14px] font-semibold text-[#94A3B8]">+ mais</span>
          </div>
          <ul className="m-0 mb-6 flex list-none flex-col gap-3 p-0">
            {proFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-[#475467]">
                <Check size={16} className="mt-0.5 flex-shrink-0 text-[#3FBE7A]" />
                {f}
              </li>
            ))}
          </ul>
          {!isPro && (
            <button
              onClick={openUpgradeModal}
              className="w-full cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] py-3 text-sm font-bold text-white"
            >
              Assinar PRO
            </button>
          )}
        </div>
      </div>

      <div className="h-8" />
    </>
  );
}

export default function AssinaturaPage() {
  return (
    <AppShell>
      <AssinaturaContent />
    </AppShell>
  );
}
