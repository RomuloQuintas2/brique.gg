"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AppShell from "@/components/brique-control/AppShell";
import PageHeader from "@/components/brique-control/PageHeader";
import SaleRow, { type Sale } from "@/components/brique-control/SaleRow";
import RegisterSaleModal from "@/components/brique-control/RegisterSaleModal";

const initialSales: Sale[] = [
  { id: "1", product: "iPhone 12 128GB", value: 2890, profit: 690, method: "Cartão 2x" },
  { id: "2", product: "Tênis Adidas Runfalcon", value: 260, profit: 120, method: "Pix" },
  { id: "3", product: "Fone JBL Tune 510BT", value: 169, profit: 79, method: "Dinheiro" },
  { id: "4", product: "Notebook Dell Inspiron", value: 2390, profit: 740, method: "Fiado" },
  { id: "5", product: "Smartwatch Xiaomi Mi Band", value: 189, profit: 79, method: "Cartão 1x" },
];

function VendasContent() {
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [modalOpen, setModalOpen] = useState(false);

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
        {sales.map((s) => (
          <SaleRow key={s.id} sale={s} />
        ))}
      </div>

      <div className="h-8" />

      <RegisterSaleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={(s) => setSales((prev) => [s, ...prev])}
      />
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
