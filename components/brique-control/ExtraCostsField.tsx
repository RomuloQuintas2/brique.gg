"use client";

import { Plus, Trash2 } from "lucide-react";

export type ExtraCostDraft = { label: string; value: string };

export default function ExtraCostsField({
  items,
  onChange,
  label = "Custos adicionais (opcional)",
}: {
  items: ExtraCostDraft[];
  onChange: (items: ExtraCostDraft[]) => void;
  label?: string;
}) {
  const update = (i: number, field: "label" | "value", v: string) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, [field]: v } : it)));
  const add = () => onChange([...items, { label: "", value: "" }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      <label className="text-[13px] font-semibold text-[#101828]">{label}</label>
      <div className="mt-2 flex flex-col gap-2">
        {items.map((ec, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={ec.label}
              onChange={(e) => update(i, "label", e.target.value)}
              placeholder="Descrição"
              className="flex-1 rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
              style={{ border: "1px solid rgba(15,23,42,0.15)" }}
            />
            <input
              value={ec.value}
              onChange={(e) => update(i, "value", e.target.value)}
              type="number"
              placeholder="R$"
              className="w-24 flex-shrink-0 rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
              style={{ border: "1px solid rgba(15,23,42,0.15)" }}
            />
            <button
              onClick={() => remove(i)}
              className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full text-[#E05B5B]"
              style={{ background: "rgba(224,91,91,0.12)" }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={add}
        className="mt-2 flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-[12.5px] font-bold text-[#1D4ED8]"
      >
        <Plus size={14} />
        Adicionar custo
      </button>
    </div>
  );
}
