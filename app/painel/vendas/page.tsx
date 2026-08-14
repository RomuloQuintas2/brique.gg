"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import AppShell from "@/components/brique-control/AppShell";
import PageHeader from "@/components/brique-control/PageHeader";
import SaleRow, { type Sale } from "@/components/brique-control/SaleRow";
import RegisterSaleModal from "@/components/brique-control/RegisterSaleModal";
import { createClient } from "@/lib/supabase/client";

function VendasContent() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("sales")
      .select("id, product_name, value, profit, payment_method")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setSales(
          (data ?? []).map((s) => ({
            id: s.id,
            product_name: s.product_name,
            value: Number(s.value),
            profit: Number(s.profit),
            payment_method: s.payment_method,
          }))
        );
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
      .select("id, product_name, value, profit, payment_method")
      .single();

    if (error || !data) return false;

    setSales((prev) => [
      { ...data, value: Number(data.value), profit: Number(data.profit) },
      ...prev,
    ]);
    return true;
  };

  return (
    <>
      <PageHeader title="Vendas" subtitle="Acompanhe tudo o que você já vendeu." />

      <div className="mb-5 flex justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border-none bg-[#3D7FFF] px-4 py-2.5 text-[13.5px] font-bold text-white"
        >
          <Plus size={16} />
          Registrar Venda
        </button>
      </div>

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
        ) : (
          sales.map((s) => <SaleRow key={s.id} sale={s} />)
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
