"use client";

import { useEffect, useMemo, useState } from "react";
import { FileDown, FileSpreadsheet } from "lucide-react";
import PageHeader from "@/components/brique-control/PageHeader";
import PeriodFilter from "@/components/brique-control/PeriodFilter";
import SaleRow, { type Sale } from "@/components/brique-control/SaleRow";
import { SALE_PLATFORMS } from "@/components/brique-control/salePlatforms";
import { createClient } from "@/lib/supabase/client";
import { getDateRange, toLocalISODate } from "@/lib/dateRange";
import { exportSalesPdf, exportSalesExcel, type ReportSale } from "@/lib/exportReport";

const SELECT_FIELDS =
  "id, product_name, value, profit, payment_method, sale_date, platform, client_name, trade_in_description, trade_in_value, extra_costs, fiado_due_date, fiado_down_payment";

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function RelatoriosContent() {
  const today = new Date();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("ano");
  const [customStart, setCustomStart] = useState(
    toLocalISODate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29))
  );
  const [customEnd, setCustomEnd] = useState(toLocalISODate(today));
  const [platformFilter, setPlatformFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("sales")
      .select(SELECT_FIELDS)
      .order("sale_date", { ascending: false })
      .then(({ data }) => {
        setSales(
          (data ?? []).map((s) => ({
            id: s.id,
            product_name: s.product_name,
            value: Number(s.value),
            profit: Number(s.profit),
            payment_method: s.payment_method,
            sale_date: s.sale_date,
            platform: s.platform,
            client_name: s.client_name,
            trade_in_description: s.trade_in_description,
            trade_in_value: s.trade_in_value !== null ? Number(s.trade_in_value) : null,
            extra_costs: s.extra_costs ?? [],
            fiado_due_date: s.fiado_due_date,
            fiado_down_payment: s.fiado_down_payment !== null ? Number(s.fiado_down_payment) : null,
          }))
        );
        setLoading(false);
      });
  }, []);

  const { start, end } = useMemo(
    () => getDateRange(period, customStart, customEnd),
    [period, customStart, customEnd]
  );

  const filtered = useMemo(
    () =>
      sales.filter((s) => {
        const d = new Date(`${s.sale_date}T00:00:00`);
        if (d < start || d > end) return false;
        if (platformFilter && s.platform !== platformFilter) return false;
        if (clientFilter && !(s.client_name ?? "").toLowerCase().includes(clientFilter.toLowerCase()))
          return false;
        return true;
      }),
    [sales, start, end, platformFilter, clientFilter]
  );

  const totalValue = filtered.reduce((sum, s) => sum + s.value, 0);
  const totalProfit = filtered.reduce((sum, s) => sum + s.profit, 0);

  const toReportSale = (s: Sale): ReportSale => ({
    sale_date: s.sale_date,
    product_name: s.product_name,
    platform: s.platform,
    client_name: s.client_name,
    payment_method: s.payment_method,
    value: s.value,
    profit: s.profit,
  });

  return (
    <>
      <PageHeader title="Relatórios" subtitle="Filtre suas vendas e exporte em PDF ou Excel." />

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

      <div className="mb-5 flex flex-wrap gap-3">
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="rounded-[11px] bg-white px-3 py-2.5 text-sm text-[#101828]"
          style={{ border: "1px solid rgba(15,23,42,0.15)" }}
        >
          <option value="">Todas as plataformas</option>
          {SALE_PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <input
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          placeholder="Filtrar por cliente..."
          className="rounded-[11px] bg-white px-3 py-2.5 text-sm text-[#101828]"
          style={{ border: "1px solid rgba(15,23,42,0.15)" }}
        />
      </div>

      <div
        className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4"
        style={{ border: "1px solid rgba(15,23,42,0.09)" }}
      >
        <div className="flex flex-wrap gap-5 text-[13.5px]">
          <div>
            <span className="text-[#64748B]">Total vendido: </span>
            <span className="font-bold text-[#101828]">{currency(totalValue)}</span>
          </div>
          <div>
            <span className="text-[#64748B]">Lucro: </span>
            <span className="font-bold text-[#3FBE7A]">{currency(totalProfit)}</span>
          </div>
          <div>
            <span className="text-[#64748B]">Vendas: </span>
            <span className="font-bold text-[#101828]">{filtered.length}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportSalesPdf(filtered.map(toReportSale), "Relatório de Vendas · brique.gg")}
            disabled={filtered.length === 0}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border-none bg-[#E05B5B] px-4 py-2.5 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FileDown size={15} />
            PDF
          </button>
          <button
            onClick={() => exportSalesExcel(filtered.map(toReportSale))}
            disabled={filtered.length === 0}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border-none bg-[#3FBE7A] px-4 py-2.5 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FileSpreadsheet size={15} />
            Excel
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="py-10 text-center text-sm text-[#64748B]">Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-[#64748B]">
            Nenhuma venda encontrada com esses filtros.
          </div>
        ) : (
          filtered.map((s) => <SaleRow key={s.id} sale={s} />)
        )}
      </div>

      <div className="h-8" />
    </>
  );
}

export default function RelatoriosPage() {
  return <RelatoriosContent />;
}

