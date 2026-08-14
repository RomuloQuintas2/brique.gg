"use client";

import { useState } from "react";
import { X, Tag } from "lucide-react";
import type { Sale } from "./SaleRow";
import type { PaymentMethod } from "./PaymentBadge";

const METHODS: PaymentMethod[] = ["Pix", "Dinheiro", "Cartão 1x", "Cartão 2x", "Fiado"];

export default function RegisterSaleModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (sale: Omit<Sale, "id">) => Promise<boolean>;
}) {
  const [product, setProduct] = useState("");
  const [value, setValue] = useState("");
  const [cost, setCost] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("Pix");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const canSave = product.trim().length > 0 && Number(value) > 0;

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    const ok = await onAdd({
      product_name: product.trim(),
      value: Number(value),
      profit: Number(value) - (Number(cost) || 0),
      payment_method: method,
    });
    setSaving(false);
    if (!ok) {
      setError("Não foi possível registrar a venda. Tente novamente.");
      return;
    }
    setProduct("");
    setValue("");
    setCost("");
    setMethod("Pix");
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] rounded-[20px] bg-white p-6"
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#3D7FFF]/10 text-[#3D7FFF]">
            <Tag size={22} />
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer border-none bg-none p-1 text-[#64748B]"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="m-0 mb-4 text-lg font-extrabold text-[#1D4ED8]">Registrar Venda</h2>

        <div className="flex flex-col gap-3">
          <input
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Produto vendido"
            className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
            style={{ border: "1px solid rgba(15,23,42,0.15)" }}
          />
          <div className="flex gap-3">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type="number"
              placeholder="Valor da venda (R$)"
              className="w-1/2 rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
              style={{ border: "1px solid rgba(15,23,42,0.15)" }}
            />
            <input
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              type="number"
              placeholder="Custo (R$)"
              className="w-1/2 rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
              style={{ border: "1px solid rgba(15,23,42,0.15)" }}
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {METHODS.map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-[12.5px] font-bold ${
                  method === m ? "bg-[#3D7FFF] text-white" : "bg-[#F5F7FA] text-[#5B6472]"
                }`}
                style={{
                  border: `1px solid ${method === m ? "#3D7FFF" : "rgba(15,23,42,0.12)"}`,
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="mt-3 mb-0 text-[13px] text-[#B91C1C]">{error}</p>}

        <button
          onClick={save}
          disabled={!canSave || saving}
          className="mt-5 w-full cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Salvando..." : "Registrar Venda"}
        </button>
      </div>
    </div>
  );
}
