"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/brique-control/AppShell";
import PageHeader from "@/components/brique-control/PageHeader";
import OnboardingCard from "@/components/brique-control/OnboardingCard";
import PeriodFilter from "@/components/brique-control/PeriodFilter";
import MetricsOverview from "@/components/brique-control/MetricsOverview";
import GoalCard from "@/components/brique-control/GoalCard";
import SalesChart, { type SalesChartPoint } from "@/components/brique-control/SalesChart";
import PriceComparatorCard from "@/components/brique-control/PriceComparatorCard";
import UpsellCard from "@/components/brique-control/UpsellCard";
import { useBrique } from "@/components/brique-control/BriqueContext";
import { createClient } from "@/lib/supabase/client";

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const MONTH_LABELS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

function lastSixMonths() {
  const now = new Date();
  const months: { year: number; month: number; label: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth(), label: MONTH_LABELS[d.getMonth()] });
  }
  return months;
}

function HomeContent() {
  const [period, setPeriod] = useState("mes");
  const { openUpgradeModal } = useBrique();

  const [firstName, setFirstName] = useState("");
  const [stockValue, setStockValue] = useState(0);
  const [stockCount, setStockCount] = useState(0);
  const [profit, setProfit] = useState(0);
  const [sold, setSold] = useState(0);
  const [spent, setSpent] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [chartData, setChartData] = useState<SalesChartPoint[]>([]);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: profile }, { data: products }, { data: sales }] = await Promise.all([
        supabase.from("profiles").select("business_name").eq("id", user.id).single(),
        supabase.from("products").select("price, stock"),
        supabase.from("sales").select("value, profit, created_at"),
      ]);

      setFirstName((profile?.business_name || "").trim().split(" ")[0] || "");

      const productList = products ?? [];
      setStockValue(productList.reduce((sum, p) => sum + Number(p.price) * p.stock, 0));
      setStockCount(productList.length);

      const saleList = sales ?? [];
      const totalProfit = saleList.reduce((sum, s) => sum + Number(s.profit), 0);
      const totalValue = saleList.reduce((sum, s) => sum + Number(s.value), 0);
      setProfit(totalProfit);
      setSold(totalValue);
      setSpent(totalValue - totalProfit);
      setSalesCount(saleList.length);

      setChartData(
        lastSixMonths().map(({ year, month, label }) => ({
          label,
          value: saleList
            .filter((s) => {
              const d = new Date(s.created_at);
              return d.getFullYear() === year && d.getMonth() === month;
            })
            .reduce((sum, s) => sum + Number(s.value), 0),
        }))
      );
    })();
  }, []);

  return (
    <>
      <PageHeader
        title={firstName ? `Olá, ${firstName}!` : "Olá!"}
        subtitle="Aqui está um resumo do seu negócio hoje."
      />

      <OnboardingCard />

      <PeriodFilter active={period} onChange={setPeriod} />

      <MetricsOverview
        profit={currency(profit)}
        stock={currency(stockValue)}
        stockSub={`${stockCount} produto${stockCount === 1 ? "" : "s"}`}
        sold={currency(sold)}
        soldSub={`${salesCount} venda${salesCount === 1 ? "" : "s"}`}
        spent={currency(spent)}
        spentSub="custo dos produtos vendidos"
        salesCount={String(salesCount)}
        salesCountSub="no total"
      />

      <GoalCard />

      <SalesChart data={chartData} />

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
