"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Cliente } from "./ClienteCard";
import { createClient } from "@/lib/supabase/client";

type HistorySale = {
  id: string;
  product_name: string;
  value: number;
  profit: number;
  sale_date: string;
};

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

export default function ClienteHistoryModal({
  open,
  cliente,
  onClose,
}: {
  open: boolean;
  cliente: Cliente | null;
  onClose: () => void;
}) {
  const [sales, setSales] = useState<HistorySale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !cliente) return;
    setLoading(true);
    const supabase = createClient();
    supabase
      .from("sales")
      .select("id, product_name, value, profit, sale_date")
      .ilike("client_name", cliente.name)
      .order("sale_date", { ascending: false })
      .then(({ data }) => {
        setSales(
          (data ?? []).map((s) => ({
            id: s.id,
            product_name: s.product_name,
            value: Number(s.value),
            profit: Number(s.profit),
            sale_date: s.sale_date,
          }))
        );
        setLoading(false);
      });
  }, [open, cliente]);

  if (!open || !cliente) return null;

  const totalComprado = sales.reduce((sum, s) => sum + s.value, 0);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/55 p-4 py-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] rounded-[20px] bg-white p-6"
      >
        <div className="mb-4 flex items-start justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer border-none bg-none p-1 text-[#64748B]"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="m-0 mb-1 text-lg font-extrabold text-[#1D4ED8]">Histórico de compras</h2>
        <p className="m-0 mb-4 text-sm text-[#64748B]">{cliente.name}</p>

        {loading ? (
          <div className="py-8 text-center text-sm text-[#64748B]">Carregando...</div>
        ) : sales.length === 0 ? (
          <div
            className="rounded-2xl bg-[#F5F7FA] py-8 text-center"
            style={{ border: "1px dashed rgba(15,23,42,0.16)" }}
          >
            <p className="m-0 text-[13px] text-[#64748B]">
              Nenhuma venda registrada pra esse cliente ainda.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 rounded-2xl p-3.5" style={{ background: "#F5F7FA" }}>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#64748B]">Total comprado</span>
                <span className="font-extrabold text-[#101828]">{currency(totalComprado)}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#64748B]">Vendas</span>
                <span className="font-bold text-[#101828]">{sales.length}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {sales.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-[#F5F7FA] px-3.5 py-2.5"
                >
                  <div className="min-w-0">
                    <div className="truncate text-[13.5px] font-bold text-[#101828]">
                      {s.product_name}
                    </div>
                    <div className="text-[12px] text-[#94A3B8]">{formatDate(s.sale_date)}</div>
                  </div>
                  <div className="flex-shrink-0 text-[13.5px] font-extrabold text-[#101828]">
                    {currency(s.value)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
