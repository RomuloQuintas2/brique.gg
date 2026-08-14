"use client";

import { useState } from "react";
import { X, Truck } from "lucide-react";
import type { Fornecedor } from "./FornecedorCard";

export default function NewFornecedorModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (fornecedor: Omit<Fornecedor, "id">) => Promise<boolean>;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const canSave = name.trim().length > 0;

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    const ok = await onAdd({
      name: name.trim(),
      phone: phone.trim() || null,
      category: category.trim() || null,
      notes: notes.trim() || null,
    });
    setSaving(false);
    if (!ok) {
      setError("Não foi possível salvar o fornecedor. Tente novamente.");
      return;
    }
    setName("");
    setPhone("");
    setCategory("");
    setNotes("");
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
            <Truck size={22} />
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer border-none bg-none p-1 text-[#64748B]"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="m-0 mb-4 text-lg font-extrabold text-[#1D4ED8]">Novo Fornecedor</h2>

        <div className="flex flex-col gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do fornecedor"
            className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
            style={{ border: "1px solid rgba(15,23,42,0.15)" }}
          />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="O que ele fornece (ex: Eletrônicos)"
            className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
            style={{ border: "1px solid rgba(15,23,42,0.15)" }}
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="WhatsApp (com DDD)"
            className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
            style={{ border: "1px solid rgba(15,23,42,0.15)" }}
          />
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observações (opcional)"
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
          {saving ? "Salvando..." : "Adicionar Fornecedor"}
        </button>
      </div>
    </div>
  );
}
