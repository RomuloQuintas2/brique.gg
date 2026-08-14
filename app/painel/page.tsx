"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/brique-control/AppShell";
import PageHeader from "@/components/brique-control/PageHeader";
import OnboardingCard from "@/components/brique-control/OnboardingCard";
import PeriodFilter from "@/components/brique-control/PeriodFilter";
import MetricsOverview from "@/components/brique-control/MetricsOverview";
import GoalCard from "@/components/brique-control/GoalCard";
import SalesChart, { type SalesChartPoint } from "@/components/brique-control/SalesChart";
import SalesPlatformsCard from "@/components/brique-control/SalesPlatformsCard";
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

function toLocalISODate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getDateRange(period: string, customStart: string, customEnd: string) {
  const now = new Date();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  if (period === "7d") {
    return {
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6),
      end: endOfToday,
    };
  }
  if (period === "30d") {
    return {
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29),
      end: endOfToday,
    };
  }
  if (period === "custom") {
    return {
      start: customStart ? new Date(`${customStart}T00:00:00`) : new Date(now.getFullYear(), 0, 1),
      end: customEnd ? new Date(`${customEnd}T23:59:59`) : endOfToday,
    };
  }
  // "ano" — desde 1 de janeiro
  return { start: new Date(now.getFullYear(), 0, 1), end: endOfToday };
}

type RawSale = { value: number; profit: number; created_at: string };

function HomeContent() {
  const today = new Date();
  const [period, setPeriod] = useState("ano");
  const [customStart, setCustomStart] = useState(
    toLocalISODate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29))
  );
  const [customEnd, setCustomEnd] = useState(toLocalISODate(today));
  const { openUpgradeModal } = useBrique();

  const [firstName, setFirstName] = useState("");
  const [stockValue, setStockValue] = useState(0);
  const [stockCount, setStockCount] = useState(0);
  const [rawSales, setRawSales] = useState<RawSale[]>([]);
  const [chartData, setChartData] = useState<SalesChartPoint[]>([]);
  const [loaded, setLoaded] = useState(false);

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

      const saleList = (sales ?? []).map((s) => ({
        value: Number(s.value),
        profit: Number(s.profit),
        created_at: s.created_at,
      }));
      setRawSales(saleList);

      setChartData(
        lastSixMonths().map(({ year, month, label }) => ({
          label,
          value: saleList
            .filter((s) => {
              const d = new Date(s.created_at);
              return d.getFullYear() === year && d.getMonth() === month;
            })
            .reduce((sum, s) => sum + s.value, 0),
        }))
      );

      setLoaded(true);
    })();
  }, []);

  const { start, end } = useMemo(
    () => getDateRange(period, customStart, customEnd),
    [period, customStart, customEnd]
  );

  const filteredSales = useMemo(
    () =>
      rawSales.filter((s) => {
        const d = new Date(s.created_at);
        return d >= start && d <= end;
      }),
    [rawSales, start, end]
  );

  const profit = filteredSales.reduce((sum, s) => sum + s.profit, 0);
  const sold = filteredSales.reduce((sum, s) => sum + s.value, 0);
  const spent = sold - profit;
  const salesCount = filteredSales.length;

  const monthProfit = useMemo(() => {
    const now = new Date();
    return rawSales
      .filter((s) => {
        const d = new Date(s.created_at);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      })
      .reduce((sum, s) => sum + s.profit, 0);
  }, [rawSales]);

  return (
    <>
      <PageHeader
        title={firstName ? `Olá, ${firstName}!` : "Olá!"}
        subtitle="Aqui está um resumo do seu negócio hoje."
      />

      {loaded && (
        <OnboardingCard hasProducts={stockCount > 0} hasSales={rawSales.length > 0} />
      )}

      <PeriodFilter
        active={period}
        onChange={setPeriod}
        customStart={customStart}
        customEnd={customEnd}
        onCustomChange={(s, e) => {
          setCustomStart(s);
          setCustomEnd(e);
        }}
      />

      <MetricsOverview
        profit={currency(profit)}
        stock={currency(stockValue)}
        stockSub={`${stockCount} produto${stockCount === 1 ? "" : "s"}`}
        sold={currency(sold)}
        soldSub={`${salesCount} venda${salesCount === 1 ? "" : "s"}`}
        spent={currency(spent)}
        spentSub="custo dos produtos vendidos"
        salesCount={String(salesCount)}
        salesCountSub="no período"
      />

      <GoalCard currentProfit={monthProfit} />

      <SalesChart data={chartData} />

      <SalesPlatformsCard data={[]} />

      <div className="grid grid-cols-1 gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
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
