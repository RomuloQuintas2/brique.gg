"use client";

import { useState } from "react";
import { X, Package } from "lucide-react";
import type { Product } from "./ProductCard";

const EMOJI_OPTIONS = ["📦", "📱", "👟", "🎧", "⌚", "💻", "🎮", "📷"];

export default function NewProductModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (product: Omit<Product, "id">) => Promise<boolean>;
}) {
  const [icon, setIcon] = useState(EMOJI_OPTIONS[0]);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("1");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const canSave = name.trim().length > 0 && Number(cost) >= 0 && Number(price) > 0;

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    const ok = await onAdd({
      icon,
      name: name.trim(),
      cost: Number(cost) || 0,
      price: Number(price),
      stock: Number(stock) || 0,
    });
    setSaving(false);
    if (!ok) {
      setError("Não foi possível salvar o produto. Tente novamente.");
      return;
    }
    setName("");
    setCost("");
    setPrice("");
    setStock("1");
    setIcon(EMOJI_OPTIONS[0]);
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
            <Package size={22} />
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer border-none bg-none p-1 text-[#64748B]"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="m-0 mb-4 text-lg font-extrabold text-[#1D4ED8]">Novo Produto</h2>

        <div className="mb-3 flex gap-1.5">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              onClick={() => setIcon(e)}
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-lg ${
                icon === e ? "bg-[#3D7FFF]/15" : "bg-[#F5F7FA]"
              }`}
              style={{ border: icon === e ? "1px solid #3D7FFF" : "1px solid rgba(15,23,42,0.09)" }}
            >
              {e}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do produto"
            className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
            style={{ border: "1px solid rgba(15,23,42,0.15)" }}
          />
          <div className="flex gap-3">
            <input
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              type="number"
              placeholder="Custo (R$)"
              className="w-1/2 rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
              style={{ border: "1px solid rgba(15,23,42,0.15)" }}
            />
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              placeholder="Venda (R$)"
              className="w-1/2 rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
              style={{ border: "1px solid rgba(15,23,42,0.15)" }}
            />
          </div>
          <input
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            type="number"
            placeholder="Quantidade em estoque"
            className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
            style={{ border: "1px solid rgba(15,23,42,0.15)" }}
          />
        </div>

        {error && <p className="mt-3 mb-0 text-[13px] text-[#B91C1C]">{error}</p>}

        <button
          onClick={save}
          disabled={!canSave || saving}
          className="mt-5 w-full cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Salvando..." : "Adicionar Produto"}
        </button>
      </div>
    </div>
  );
}
