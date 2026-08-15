"use client";

import { ExternalLink } from "lucide-react";

const IMEI_URL = "https://www.consultaserialaparelho.com.br/public-web/home";

export default function ImeiRedirectModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  const confirm = () => {
    window.open(IMEI_URL, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[400px] rounded-[20px] bg-white p-6"
      >
        <div
          className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl text-[#3D7FFF]"
          style={{ background: "rgba(76,141,255,0.12)" }}
        >
          <ExternalLink size={22} />
        </div>

        <h2 className="m-0 mb-1.5 text-lg font-extrabold text-[#101828]">
          Você será redirecionado
        </h2>
        <p className="m-0 mb-5 text-sm text-[#64748B]">
          A consulta de IMEI é feita pelo Consulta Serial Aparelho, plataforma mantida pela
          ABR Telecom em parceria com a Anatel (projeto Celular Legal). Você sairá do
          brique.gg e abrirá o site oficial em uma nova aba.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-[11px] border-none bg-[#F1F4F9] py-2.5 text-[13.5px] font-bold text-[#475467]"
          >
            Cancelar
          </button>
          <button
            onClick={confirm}
            className="flex-1 cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] py-2.5 text-[13.5px] font-bold text-white"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
