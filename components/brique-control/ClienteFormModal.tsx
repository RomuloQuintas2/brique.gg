"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Cliente } from "./ClienteCard";

export type ClienteFormValues = {
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
};

export default function ClienteFormModal({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: Cliente | null;
  onClose: () => void;
  onSubmit: (values: ClienteFormValues) => Promise<boolean>;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setName(initial.name);
      setPhone(initial.phone ?? "");
      setEmail(initial.email ?? "");
      setNotes(initial.notes ?? "");
    } else {
      setName("");
      setPhone("");
      setEmail("");
      setNotes("");
    }
    setError(null);
  }, [open, initial]);

  if (!open) return null;

  const canSave = name.trim().length > 0;

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    const ok = await onSubmit({
      name: name.trim(),
      phone: phone.trim() || null,
      email: email.trim() || null,
      notes: notes.trim() || null,
    });
    setSaving(false);
    if (!ok) {
      setError("Não foi possível salvar o cliente. Tente novamente.");
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
        <div className="mb-4 flex items-start justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer border-none bg-none p-1 text-[#64748B]"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="m-0 mb-4 text-lg font-extrabold text-[#1D4ED8]">
          {mode === "edit" ? "Editar Cliente" : "Novo Cliente"}
        </h2>

        <div className="flex flex-col gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do cliente"
            className={fieldClass}
            style={fieldStyle}
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="WhatsApp (com DDD)"
            className={fieldClass}
            style={fieldStyle}
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail (opcional)"
            className={fieldClass}
            style={fieldStyle}
          />
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observações (opcional)"
            className={fieldClass}
            style={fieldStyle}
          />
        </div>

        {error && <p className="mt-3 mb-0 text-[13px] text-[#B91C1C]">{error}</p>}

        <button
          onClick={save}
          disabled={!canSave || saving}
          className="mt-5 w-full cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Salvando..." : mode === "edit" ? "Salvar Alterações" : "Adicionar Cliente"}
        </button>
      </div>
    </div>
  );
}
