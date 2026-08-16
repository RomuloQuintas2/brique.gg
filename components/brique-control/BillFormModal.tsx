"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Bill } from "./BillRow";
import { BILL_CATEGORIES } from "./billCategories";

export type BillFormValues = {
  description: string;
  category: string;
  estimated_value: number;
  is_variable: boolean;
  is_recurring: boolean;
  due_date: string;
  notes: string | null;
};

const toLocalISODate = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function BillFormModal({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: Bill | null;
  onClose: () => void;
  onSubmit: (values: BillFormValues) => Promise<boolean>;
}) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(BILL_CATEGORIES[0]);
  const [estimatedValue, setEstimatedValue] = useState("");
  const [isVariable, setIsVariable] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [dueDate, setDueDate] = useState(toLocalISODate(new Date()));
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setDescription(initial.description);
      setCategory(initial.category);
      setEstimatedValue(String(initial.estimated_value));
      setIsVariable(initial.is_variable);
      setIsRecurring(initial.is_recurring);
      setDueDate(initial.due_date);
      setNotes(initial.notes ?? "");
    } else {
      setDescription("");
      setCategory(BILL_CATEGORIES[0]);
      setEstimatedValue("");
      setIsVariable(false);
      setIsRecurring(false);
      setDueDate(toLocalISODate(new Date()));
      setNotes("");
    }
    setError(null);
  }, [open, initial]);

  if (!open) return null;

  const canSave = description.trim().length > 0 && dueDate.length > 0;

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    const ok = await onSubmit({
      description: description.trim(),
      category,
      estimated_value: Number(estimatedValue) || 0,
      is_variable: isVariable,
      is_recurring: isRecurring,
      due_date: dueDate,
      notes: notes.trim() || null,
    });
    setSaving(false);
    if (!ok) {
      setError("Não foi possível salvar a conta. Tente novamente.");
      return;
    }
    onClose();
  };

  const fieldClass = "rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]";
  const fieldStyle = { border: "1px solid rgba(15,23,42,0.15)" };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/55 p-4 py-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] rounded-[20px] bg-white p-6"
      >
        <div className="relative mb-4 flex items-center justify-center">
          <h2 className="m-0 text-lg font-extrabold text-[#101828]">
            {mode === "edit" ? "Editar conta" : "Nova conta a pagar"}
          </h2>
          <button
            onClick={onClose}
            className="absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer border-none bg-none p-1 text-[#64748B]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Descrição</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Aluguel do ponto"
              className={fieldClass}
              style={fieldStyle}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={fieldClass}
              style={fieldStyle}
            >
              {BILL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Valor estimado</label>
            <input
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(e.target.value)}
              type="number"
              placeholder="R$ 0,00"
              className={fieldClass}
              style={fieldStyle}
            />
          </div>

          <label className="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              checked={isVariable}
              onChange={(e) => setIsVariable(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#3D7FFF]"
            />
            <span className="text-[12.5px] leading-snug text-[#64748B]">
              Conta com valor variável (água, luz, etc), vou lembrar de revisar antes de marcar
              pago
            </span>
          </label>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Tipo da conta</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsRecurring(false)}
                className={`flex-1 cursor-pointer rounded-[11px] py-2.5 text-[13px] font-bold ${
                  !isRecurring ? "bg-[#3D7FFF] text-white" : "bg-[#F5F7FA] text-[#5B6472]"
                }`}
                style={{ border: `1px solid ${!isRecurring ? "#3D7FFF" : "rgba(15,23,42,0.12)"}` }}
              >
                Avulsa
              </button>
              <button
                type="button"
                onClick={() => setIsRecurring(true)}
                className={`flex-1 cursor-pointer rounded-[11px] py-2.5 text-[13px] font-bold ${
                  isRecurring ? "bg-[#3D7FFF] text-white" : "bg-[#F5F7FA] text-[#5B6472]"
                }`}
                style={{ border: `1px solid ${isRecurring ? "#3D7FFF" : "rgba(15,23,42,0.12)"}` }}
              >
                Recorrente
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Data de vencimento</label>
            <input
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              type="date"
              className={fieldClass}
              style={fieldStyle}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">
              Observações (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={`resize-none ${fieldClass}`}
              style={fieldStyle}
            />
          </div>
        </div>

        {error && <p className="mt-3 mb-0 text-[13px] text-[#B91C1C]">{error}</p>}

        <button
          onClick={save}
          disabled={!canSave || saving}
          className="mt-5 w-full cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Salvando..." : mode === "edit" ? "Salvar Alterações" : "Cadastrar conta"}
        </button>
        <button
          onClick={onClose}
          className="mt-2 w-full cursor-pointer rounded-[11px] border-none bg-transparent py-2.5 text-sm font-semibold text-[#64748B]"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
