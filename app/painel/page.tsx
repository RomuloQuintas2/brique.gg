"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/brique-control/PageHeader";
import OnboardingCard from "@/components/brique-control/OnboardingCard";
import PeriodFilter from "@/components/brique-control/PeriodFilter";
import MetricsOverview from "@/components/brique-control/MetricsOverview";
import GoalCard from "@/components/brique-control/GoalCard";
import SalesChart, { type SalesChartPoint } from "@/components/brique-control/SalesChart";
import SalesPlatformsCard, {
  type PlatformCount,
} from "@/components/brique-control/SalesPlatformsCard";
import UpsellCard from "@/components/brique-control/UpsellCard";
import { createClient } from "@/lib/supabase/client";
import { getDateRange, toLocalISODate } from "@/lib/dateRange";

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

type RawSale = { value: number; profit: number; sale_date: string; platform: string | null };

function HomeContent() {
  const today = new Date();
  const [period, setPeriod] = useState("ano");
  const [customStart, setCustomStart] = useState(
    toLocalISODate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29))
  );
  const [customEnd, setCustomEnd] = useState(toLocalISODate(today));

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
        supabase.from("sales").select("value, profit, sale_date, platform"),
      ]);

      setFirstName((profile?.business_name || "").trim().split(" ")[0] || "");

      const productList = products ?? [];
      setStockValue(productList.reduce((sum, p) => sum + Number(p.price) * p.stock, 0));
      setStockCount(productList.length);

      const saleList = (sales ?? []).map((s) => ({
        value: Number(s.value),
        profit: Number(s.profit),
        sale_date: s.sale_date,
        platform: s.platform,
      }));
      setRawSales(saleList);

      setChartData(
        lastSixMonths().map(({ year, month, label }) => ({
          label,
          value: saleList
            .filter((s) => {
              const d = new Date(s.sale_date);
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
        const d = new Date(s.sale_date);
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
        const d = new Date(s.sale_date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      })
      .reduce((sum, s) => sum + s.profit, 0);
  }, [rawSales]);

  const platformCounts: PlatformCount[] = useMemo(() => {
    const counts = new Map<string, number>();
    filteredSales.forEach((s) => {
      if (!s.platform) return;
      counts.set(s.platform, (counts.get(s.platform) ?? 0) + 1);
    });
    return Array.from(counts.entries()).map(([platform, count]) => ({ platform, count }));
  }, [filteredSales]);

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

      <SalesPlatformsCard data={platformCounts} />

      <div className="grid grid-cols-1 gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        <UpsellCard />
      </div>

      <div className="h-8" />
    </>
  );
}

export default function HomePage() {
  return <HomeContent />;
}

