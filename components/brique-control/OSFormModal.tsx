"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { ServiceOrder } from "./OSRow";

export type OSFormValues = {
  client_name: string;
  device: string;
  defect_description: string;
  estimated_value: number;
  notes: string | null;
};

export default function OSFormModal({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: ServiceOrder | null;
  onClose: () => void;
  onSubmit: (values: OSFormValues) => Promise<boolean>;
}) {
  const [clientName, setClientName] = useState("");
  const [device, setDevice] = useState("");
  const [defect, setDefect] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setClientName(initial.client_name);
      setDevice(initial.device);
      setDefect(initial.defect_description);
      setEstimatedValue(String(initial.estimated_value));
      setNotes(initial.notes ?? "");
    } else {
      setClientName("");
      setDevice("");
      setDefect("");
      setEstimatedValue("");
      setNotes("");
    }
    setError(null);
  }, [open, initial]);

  if (!open) return null;

  const canSave = clientName.trim().length > 0 && device.trim().length > 0 && defect.trim().length > 0;

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    const ok = await onSubmit({
      client_name: clientName.trim(),
      device: device.trim(),
      defect_description: defect.trim(),
      estimated_value: Number(estimatedValue) || 0,
      notes: notes.trim() || null,
    });
    setSaving(false);
    if (!ok) {
      setError("Não foi possível salvar a OS. Tente novamente.");
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
          {mode === "edit" ? "Editar OS" : "Nova Ordem de Serviço"}
        </h2>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Cliente</label>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nome do cliente"
              className={fieldClass}
              style={fieldStyle}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Aparelho</label>
            <input
              value={device}
              onChange={(e) => setDevice(e.target.value)}
              placeholder="Ex: iPhone 11 128GB"
              className={fieldClass}
              style={fieldStyle}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Defeito relatado</label>
            <input
              value={defect}
              onChange={(e) => setDefect(e.target.value)}
              placeholder="Ex: Tela quebrada"
              className={fieldClass}
              style={fieldStyle}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Valor orçado</label>
            <input
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(e.target.value)}
              type="number"
              placeholder="R$"
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
          {saving ? "Salvando..." : mode === "edit" ? "Salvar Alterações" : "Abrir OS"}
        </button>
      </div>
    </div>
  );
}
