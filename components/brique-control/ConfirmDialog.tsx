"use client";

import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Excluir",
  loading,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[360px] rounded-[20px] bg-white p-6"
      >
        <div
          className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl text-[#E05B5B]"
          style={{ background: "rgba(224,91,91,0.12)" }}
        >
          <AlertTriangle size={22} />
        </div>

        <h2 className="m-0 mb-1.5 text-lg font-extrabold text-[#101828]">{title}</h2>
        <p className="m-0 mb-5 text-sm text-[#64748B]">{description}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 cursor-pointer rounded-[11px] border-none bg-[#F1F4F9] py-2.5 text-[13.5px] font-bold text-[#475467]"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 cursor-pointer rounded-[11px] border-none bg-[#E05B5B] py-2.5 text-[13.5px] font-bold text-white disabled:opacity-60"
          >
            {loading ? "Excluindo..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
