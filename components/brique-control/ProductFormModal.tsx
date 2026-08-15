"use client";

import { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { Product, ExtraCost } from "./ProductCard";

export type ProductFormValues = {
  icon: string;
  name: string;
  acquisition_date: string | null;
  cost: number;
  price: number;
  stock: number;
  extra_costs: ExtraCost[];
};

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const EMOJI_OPTIONS = ["📦", "📱", "👟", "🎧", "⌚", "💻", "🎮", "📷"];

type ExtraCostDraft = { label: string; value: string };

export default function ProductFormModal({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: Product | null;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => Promise<boolean>;
}) {
  const [icon, setIcon] = useState(EMOJI_OPTIONS[0]);
  const [name, setName] = useState("");
  const [acquisitionDate, setAcquisitionDate] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("1");
  const [extraCosts, setExtraCosts] = useState<ExtraCostDraft[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setIcon(initial.icon || EMOJI_OPTIONS[0]);
      setName(initial.name);
      setAcquisitionDate(initial.acquisition_date ?? "");
      setCost(String(initial.cost));
      setPrice(String(initial.price));
      setStock(String(initial.stock));
      setExtraCosts(initial.extra_costs.map((e) => ({ label: e.label, value: String(e.value) })));
    } else {
      setIcon(EMOJI_OPTIONS[0]);
      setName("");
      setAcquisitionDate("");
      setCost("");
      setPrice("");
      setStock("1");
      setExtraCosts([]);
    }
    setError(null);
  }, [open, initial]);

  if (!open) return null;

  const costNum = Number(cost) || 0;
  const priceNum = Number(price) || 0;
  const extraCostsNum = extraCosts.map((e) => ({ label: e.label.trim(), value: Number(e.value) || 0 }));
  const extraTotal = extraCostsNum.reduce((sum, e) => sum + e.value, 0);
  const totalCostValue = costNum + extraTotal;
  const estimatedProfit = priceNum - totalCostValue;

  const canSave = name.trim().length > 0 && priceNum > 0;

  const addExtraCost = () => setExtraCosts((prev) => [...prev, { label: "", value: "" }]);
  const updateExtraCost = (i: number, field: "label" | "value", value: string) =>
    setExtraCosts((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
  const removeExtraCost = (i: number) =>
    setExtraCosts((prev) => prev.filter((_, idx) => idx !== i));

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    const ok = await onSubmit({
      icon,
      name: name.trim(),
      acquisition_date: acquisitionDate || null,
      cost: costNum,
      price: priceNum,
      stock: Number(stock) || 0,
      extra_costs: extraCostsNum.filter((e) => e.label.length > 0 || e.value > 0),
    });
    setSaving(false);
    if (!ok) {
      setError("Não foi possível salvar o produto. Tente novamente.");
      return;
    }
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/55 p-4 py-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[460px] rounded-[20px] bg-white p-6"
      >
        <div className="mb-4 flex items-start justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer border-none bg-none p-1 text-[#64748B]"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="m-0 mb-4 text-lg font-extrabold text-[#1D4ED8]">
          {mode === "edit" ? "Editar Produto" : "Novo Produto"}
        </h2>

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
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Nome do produto</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: iPhone 12 128GB"
              className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
              style={{ border: "1px solid rgba(15,23,42,0.15)" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Data da aquisição</label>
            <input
              type="date"
              value={acquisitionDate}
              onChange={(e) => setAcquisitionDate(e.target.value)}
              className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
              style={{ border: "1px solid rgba(15,23,42,0.15)" }}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex w-1/2 flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#101828]">Valor da compra</label>
              <input
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                type="number"
                placeholder="R$"
                className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
                style={{ border: "1px solid rgba(15,23,42,0.15)" }}
              />
            </div>
            <div className="flex w-1/2 flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#101828]">Pretende vender por</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                placeholder="R$"
                className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
                style={{ border: "1px solid rgba(15,23,42,0.15)" }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Quantidade em estoque</label>
            <input
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              type="number"
              className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
              style={{ border: "1px solid rgba(15,23,42,0.15)" }}
            />
          </div>

          <div>
            <label className="text-[13px] font-semibold text-[#101828]">
              Custos adicionais (opcional)
            </label>
            <div className="mt-2 flex flex-col gap-2">
              {extraCosts.map((ec, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={ec.label}
                    onChange={(e) => updateExtraCost(i, "label", e.target.value)}
                    placeholder="Ex: Frete, reparo..."
                    className="flex-1 rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
                    style={{ border: "1px solid rgba(15,23,42,0.15)" }}
                  />
                  <input
                    value={ec.value}
                    onChange={(e) => updateExtraCost(i, "value", e.target.value)}
                    type="number"
                    placeholder="R$"
                    className="w-24 flex-shrink-0 rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
                    style={{ border: "1px solid rgba(15,23,42,0.15)" }}
                  />
                  <button
                    onClick={() => removeExtraCost(i)}
                    className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full text-[#E05B5B]"
                    style={{ background: "rgba(224,91,91,0.12)" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addExtraCost}
              className="mt-2 flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-[12.5px] font-bold text-[#1D4ED8]"
            >
              <Plus size={14} />
              Adicionar custo
            </button>
          </div>

          <div className="rounded-2xl p-4" style={{ background: "#F5F7FA" }}>
            <div className="mb-1.5 flex items-center justify-between text-[13px]">
              <span className="text-[#64748B]">Preço de compra</span>
              <span className="font-semibold text-[#101828]">{currency(costNum)}</span>
            </div>
            <div className="mb-1.5 flex items-center justify-between text-[13px]">
              <span className="text-[#64748B]">Custo total</span>
              <span className="font-bold text-[#101828]">{currency(totalCostValue)}</span>
            </div>
            <div
              className="flex items-center justify-between pt-1.5 text-[13px]"
              style={{ borderTop: "1px solid rgba(15,23,42,0.08)" }}
            >
              <span className="font-semibold text-[#64748B]">Lucro estimado</span>
              <span
                className={`font-extrabold ${estimatedProfit >= 0 ? "text-[#3FBE7A]" : "text-[#E05B5B]"}`}
              >
                {currency(estimatedProfit)}
              </span>
            </div>
          </div>
        </div>

        {error && <p className="mt-3 mb-0 text-[13px] text-[#B91C1C]">{error}</p>}

        <button
          onClick={save}
          disabled={!canSave || saving}
          className="mt-5 w-full cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Salvando..." : mode === "edit" ? "Salvar Alterações" : "Cadastrar Produto"}
        </button>
      </div>
    </div>
  );
}
