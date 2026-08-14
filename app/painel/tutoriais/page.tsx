"use client";

import { useState } from "react";
import {
  Package,
  Tag,
  Wallet,
  Target,
  Calculator,
  Users,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import AppShell from "@/components/brique-control/AppShell";
import PageHeader from "@/components/brique-control/PageHeader";

type Tutorial = {
  icon: LucideIcon;
  title: string;
  summary: string;
  steps: string[];
};

const tutorials: Tutorial[] = [
  {
    icon: Package,
    title: "Como cadastrar seu primeiro produto",
    summary: "Leva menos de um minuto por item.",
    steps: [
      'Vá em "Produtos" no menu lateral.',
      'Clique em "Novo Produto".',
      "Preencha nome, custo, preço de venda e quantidade em estoque.",
      "Clique em \"Adicionar Produto\" — pronto, ele já aparece na sua lista com lucro e margem calculados.",
    ],
  },
  {
    icon: Tag,
    title: "Como registrar uma venda",
    summary: "O lucro é calculado automaticamente.",
    steps: [
      'Vá em "Vendas" no menu lateral.',
      'Clique em "Registrar Venda".',
      "Informe o produto, o valor da venda e a forma de pagamento.",
      "O brique.gg calcula o lucro daquela venda sozinho, com base no custo do produto.",
    ],
  },
  {
    icon: Wallet,
    title: "Como acompanhar seu financeiro",
    summary: "Contas a pagar, a receber e fiado.",
    steps: [
      'Vá em "Financeiro" no menu lateral.',
      "Veja o total a receber (parcelas e fiado) e o total a pagar do mês.",
      "Acompanhe alertas de contas vencendo antes que atrasem.",
      'Use o gráfico "Performance Financeira" pra ver a evolução ao longo do tempo.',
    ],
  },
  {
    icon: Target,
    title: "Como definir uma meta de lucro",
    summary: "Acompanhe seu progresso no mês.",
    steps: [
      'Na tela "Início", encontre o card "Meta do Mês".',
      'Clique em "Definir Meta" e informe o valor que você quer alcançar.',
      "A barra de progresso mostra o quanto falta com base no seu lucro do período.",
    ],
  },
  {
    icon: Calculator,
    title: "Como usar a Calculadora de Lucro",
    summary: "Simule antes de fechar negócio.",
    steps: [
      'Vá em "Calculadora de Lucro" no menu lateral.',
      "Informe custo do produto, custos extras e o preço de venda pretendido.",
      "Adicione a taxa da maquininha, se for vender no cartão.",
      "Veja o lucro líquido, a margem real e o preço sugerido pra bater sua margem ideal.",
    ],
  },
  {
    icon: Users,
    title: "Como adicionar clientes e fornecedores",
    summary: "Organize seus contatos.",
    steps: [
      'Vá em "Clientes" ou "Fornecedores" no menu lateral.',
      "Clique em \"Novo Cliente\" ou \"Novo Fornecedor\".",
      "Preencha nome e WhatsApp — o ícone de WhatsApp no card já abre uma conversa direto.",
    ],
  },
];

function TutorialCard({ tutorial, defaultOpen }: { tutorial: Tutorial; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const Icon = tutorial.icon;

  return (
    <div
      className="overflow-hidden rounded-[20px] bg-white"
      style={{ border: "1px solid rgba(15,23,42,0.09)" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center gap-3.5 px-5 py-[18px] text-left"
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#4C8DFF]/10 text-[#4C8DFF]">
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <div className="text-[14.5px] font-bold text-[#101828]">{tutorial.title}</div>
          <div className="text-[12.5px] text-[#64748B]">{tutorial.summary}</div>
        </div>
        <span
          className="flex flex-shrink-0 text-[#64748B] transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          <ChevronDown size={18} />
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5">
          <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
            {tutorial.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ background: "#3D7FFF" }}
                >
                  {i + 1}
                </span>
                <span className="text-[13.5px] leading-relaxed text-[#475467]">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function TutoriaisContent() {
  return (
    <>
      <PageHeader title="Tutoriais" subtitle="Aprenda a usar o brique.gg em poucos passos." />

      <div className="flex flex-col gap-3">
        {tutorials.map((t, i) => (
          <TutorialCard key={t.title} tutorial={t} defaultOpen={i === 0} />
        ))}
      </div>

      <div className="h-8" />
    </>
  );
}

export default function TutoriaisPage() {
  return (
    <AppShell>
      <TutoriaisContent />
    </AppShell>
  );
}
