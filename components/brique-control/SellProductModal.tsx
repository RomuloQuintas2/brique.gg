"use client";

import { useEffect, useState } from "react";
import { X, DollarSign } from "lucide-react";
import type { Product } from "./ProductCard";
import { totalCost } from "./ProductCard";
import type { PaymentMethod } from "./PaymentBadge";

const METHODS: PaymentMethod[] = ["Pix", "Dinheiro", "Cartão 1x", "Cartão 2x", "Fiado"];

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function SellProductModal({
  open,
  product,
  onClose,
  onConfirm,
}: {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (value: number, method: PaymentMethod) => Promise<boolean>;
}) {
  const [value, setValue] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("Pix");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && product) {
      setValue(String(product.price));
      setMethod("Pix");
      setError(null);
    }
  }, [open, product]);

  if (!open || !product) return null;

  const valueNum = Number(value) || 0;
  const cost = totalCost(product);
  const profit = valueNum - cost;

  const confirm = async () => {
    if (valueNum <= 0) return;
    setSaving(true);
    setError(null);
    const ok = await onConfirm(valueNum, method);
    setSaving(false);
    if (!ok) {
      setError("Não foi possível registrar a venda. Tente novamente.");
      return;
    }
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[65] flex items-center justify-center bg-black/55 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[400px] rounded-[20px] bg-white p-6"
      >
        <div className="mb-4 flex items-start justify-between">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-[#3FBE7A]"
            style={{ background: "rgba(63,190,122,0.12)" }}
          >
            <DollarSign size={22} />
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer border-none bg-none p-1 text-[#64748B]"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="m-0 mb-1 text-lg font-extrabold text-[#1D4ED8]">Vender produto</h2>
        <p className="m-0 mb-4 text-sm text-[#64748B]">{product.name}</p>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Valor da venda</label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type="number"
              placeholder="R$"
              className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
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

          <div
            className="flex items-center justify-between rounded-2xl p-3.5 text-[13px]"
            style={{ background: "#F5F7FA" }}
          >
            <span className="text-[#64748B]">Lucro dessa venda</span>
            <span className={`font-extrabold ${profit >= 0 ? "text-[#3FBE7A]" : "text-[#E05B5B]"}`}>
              {currency(profit)}
            </span>
          </div>
        </div>

        {error && <p className="mt-3 mb-0 text-[13px] text-[#B91C1C]">{error}</p>}

        <button
          onClick={confirm}
          disabled={valueNum <= 0 || saving}
          className="mt-5 w-full cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Registrando..." : "Confirmar Venda"}
        </button>
      </div>
    </div>
  );
}
