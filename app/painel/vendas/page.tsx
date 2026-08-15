"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Package } from "lucide-react";
import AppShell from "@/components/brique-control/AppShell";
import PageHeader from "@/components/brique-control/PageHeader";
import PeriodFilter from "@/components/brique-control/PeriodFilter";
import SaleRow, { type Sale } from "@/components/brique-control/SaleRow";
import RegisterSaleModal from "@/components/brique-control/RegisterSaleModal";
import { createClient } from "@/lib/supabase/client";
import { getDateRange, toLocalISODate } from "@/lib/dateRange";

const SELECT_FIELDS =
  "id, product_name, value, profit, payment_method, sale_date, platform, client_name, trade_in_description, trade_in_value, extra_costs, fiado_due_date, fiado_down_payment";

function mapRow(s: {
  id: string;
  product_name: string;
  value: number | string;
  profit: number | string;
  payment_method: Sale["payment_method"];
  sale_date: string;
  platform: string | null;
  client_name: string | null;
  trade_in_description: string | null;
  trade_in_value: number | string | null;
  extra_costs: { label: string; value: number }[] | null;
  fiado_due_date: string | null;
  fiado_down_payment: number | string | null;
}): Sale {
  return {
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
  };
}

function VendasContent() {
  const today = new Date();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [period, setPeriod] = useState("ano");
  const [customStart, setCustomStart] = useState(
    toLocalISODate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29))
  );
  const [customEnd, setCustomEnd] = useState(toLocalISODate(today));

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("sales")
      .select(SELECT_FIELDS)
      .order("sale_date", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setSales((data ?? []).map(mapRow));
        setLoading(false);
      });
  }, []);

  const addSale = async (sale: Omit<Sale, "id">): Promise<boolean> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("sales")
      .insert({ ...sale, user_id: user.id })
      .select(SELECT_FIELDS)
      .single();

    if (error || !data) return false;

    setSales((prev) => [mapRow(data), ...prev]);
    return true;
  };

  const { start, end } = useMemo(
    () => getDateRange(period, customStart, customEnd),
    [period, customStart, customEnd]
  );

  const filteredSales = useMemo(
    () =>
      sales.filter((s) => {
        const d = new Date(`${s.sale_date}T00:00:00`);
        return d >= start && d <= end;
      }),
    [sales, start, end]
  );

  return (
    <>
      <PageHeader title="Vendas" subtitle="Acompanhe tudo o que você já vendeu." />

      <div className="mb-5 flex flex-wrap justify-end gap-2">
        <Link
          href="/painel/produtos"
          className="flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[12.5px] font-bold text-[#3D7FFF] no-underline"
          style={{ border: "1px solid rgba(76,141,255,0.3)", background: "rgba(76,141,255,0.08)" }}
        >
          <Package size={15} />
          Produto já cadastrado
        </Link>
        <button
          onClick={() => setModalOpen(true)}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border-none bg-[#3D7FFF] px-4 py-2.5 text-[13.5px] font-bold text-white"
        >
          <Plus size={16} />
          Registrar Venda
        </button>
      </div>

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

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="py-10 text-center text-sm text-[#64748B]">Carregando...</div>
        ) : sales.length === 0 ? (
          <div
            className="rounded-2xl bg-white py-10 text-center"
            style={{ border: "1px dashed rgba(15,23,42,0.16)" }}
          >
            <p className="m-0 mb-1 text-sm font-bold text-[#101828]">
              Nenhuma venda registrada ainda
            </p>
            <p className="m-0 text-[13px] text-[#64748B]">
              Clique em &quot;Registrar Venda&quot; assim que vender o primeiro produto.
            </p>
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="py-10 text-center text-sm text-[#64748B]">
            Nenhuma venda encontrada nesse período.
          </div>
        ) : (
          filteredSales.map((s) => <SaleRow key={s.id} sale={s} />)
        )}
      </div>

      <div className="h-8" />

      <RegisterSaleModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={addSale} />
    </>
  );
}

export default function VendasPage() {
  return (
    <AppShell>
      <VendasContent />
    </AppShell>
  );
}
