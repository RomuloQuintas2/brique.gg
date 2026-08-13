import AppShell from "@/components/brique-control/AppShell";
import PageHeader from "@/components/brique-control/PageHeader";
import KPICard, { type KPICardData } from "@/components/brique-control/KPICard";
import AlertBanner from "@/components/brique-control/AlertBanner";
import FinanceListRow from "@/components/brique-control/FinanceListRow";
import FinancePerformanceChart from "@/components/brique-control/FinancePerformanceChart";

const summaryCards: KPICardData[] = [
  { label: "A Receber", value: "R$ 2.130,00", sub: "total pendente", from: "#4C8DFF", to: "#1A4FBF" },
  { label: "A Pagar", value: "R$ 209,00", sub: "este mês em aberto", from: "#E05B5B", to: "#9B2C2C" },
];

const receivables = [
  { title: "iPhone 12 128GB", subtitle: "Parcela 1/2 · Mai/2026", value: 1445, status: "Recebida", tone: "success" as const },
  { title: "iPhone 12 128GB", subtitle: "Parcela 2/2 · Jun/2026", value: 1445, status: "A receber", tone: "pending" as const },
  { title: "Notebook Dell Inspiron", subtitle: "Fiado — João · Vence 25/mai", value: 740, status: "A receber", tone: "pending" as const },
];

const payables = [
  { title: "Aluguel do ponto", subtitle: "Venceu dia 5", value: 750, status: "Pago", tone: "success" as const },
  { title: "Internet", subtitle: "Vence dia 10", value: 110, status: "Em aberto", tone: "warning" as const },
  { title: "Conta de Luz", subtitle: "Vence dia 15", value: 99, status: "Em aberto", tone: "warning" as const },
];

function FinanceiroContent() {
  return (
    <>
      <PageHeader
        title="Financeiro"
        subtitle="Suas contas a receber, a pagar e sua performance."
      />

      <div className="mb-5 grid grid-cols-2 gap-3">
        {summaryCards.map((c) => (
          <KPICard key={c.label} {...c} />
        ))}
      </div>

      <AlertBanner
        title="2 contas vencendo em breve"
        description="Internet e Luz vencem nos próximos 5 dias."
      />

      <div className="mb-2 px-1 text-[11px] font-bold tracking-[0.06em] text-[#8A93A3] uppercase">
        A Receber
      </div>
      <div className="mb-5 flex flex-col gap-3">
        {receivables.map((r, i) => (
          <FinanceListRow key={i} {...r} />
        ))}
      </div>

      <div className="mb-2 px-1 text-[11px] font-bold tracking-[0.06em] text-[#8A93A3] uppercase">
        Contas a Pagar
      </div>
      <div className="mb-5 flex flex-col gap-3">
        {payables.map((p, i) => (
          <FinanceListRow key={i} {...p} />
        ))}
      </div>

      <FinancePerformanceChart />

      <div className="h-8" />
    </>
  );
}

export default function FinanceiroPage() {
  return (
    <AppShell>
      <FinanceiroContent />
    </AppShell>
  );
}
