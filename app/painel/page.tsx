"use client";

import { useState } from "react";
import AppShell from "@/components/brique-control/AppShell";
import PageHeader from "@/components/brique-control/PageHeader";
import OnboardingCard from "@/components/brique-control/OnboardingCard";
import PeriodFilter from "@/components/brique-control/PeriodFilter";
import MetricsOverview from "@/components/brique-control/MetricsOverview";
import GoalCard from "@/components/brique-control/GoalCard";
import SalesChart from "@/components/brique-control/SalesChart";
import PriceComparatorCard from "@/components/brique-control/PriceComparatorCard";
import UpsellCard from "@/components/brique-control/UpsellCard";
import { useBrique } from "@/components/brique-control/BriqueContext";

function HomeContent() {
  const [period, setPeriod] = useState("mes");
  const { openUpgradeModal } = useBrique();

  return (
    <>
      <PageHeader title="Olá, Marina!" subtitle="Aqui está um resumo do seu negócio hoje." />

      <OnboardingCard />

      <PeriodFilter active={period} onChange={setPeriod} />

      <MetricsOverview
        profit="R$ 4.280"
        changeLabel="18% vs. período anterior"
        stock="R$ 12.450"
        stockSub="86 produtos"
        sold="R$ 9.860"
        soldSub="34 vendas"
        spent="R$ 5.580"
        spentSub="custo dos produtos"
        salesCount="34"
        salesCountSub="no período"
      />

      <GoalCard />

      <SalesChart />

      <div className="grid grid-cols-1 gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        <PriceComparatorCard />
        <UpsellCard onUpgradeClick={openUpgradeModal} />
      </div>

      <div className="h-8" />
    </>
  );
}

export default function HomePage() {
  return (
    <AppShell>
      <HomeContent />
    </AppShell>
  );
}
