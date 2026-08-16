"use client";

import { usePwaInstall } from "./PwaInstallContext";

function ShareIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 3v12M12 3l-4 4M12 3l4 4M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"
        stroke="#3D7FFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AddToHomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="4" stroke="#3D7FFF" strokeWidth="2" />
      <path d="M12 8v8M8 12h8" stroke="#3D7FFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const STEPS = [
  {
    icon: <ShareIcon />,
    text: "Toque no ícone de compartilhar na barra do Safari",
  },
  {
    icon: <AddToHomeIcon />,
    text: "Selecione “Adicionar à Tela de Início”",
  },
  {
    icon: null,
    text: "Toque em “Adicionar” para confirmar",
  },
];

export default function IosInstallModal() {
  const { iosModalOpen, closeIosModal } = usePwaInstall();

  if (!iosModalOpen) return null;

  return (
    <div
      onClick={closeIosModal}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[380px] rounded-[20px] bg-white p-6"
      >
        <h2 className="m-0 mb-4 text-lg font-extrabold text-[#1D4ED8]">
          Instale o brique.gg no seu iPhone
        </h2>

        <div className="flex flex-col gap-4">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                style={{ background: "rgba(76,141,255,0.12)" }}
              >
                {step.icon ?? (
                  <span className="text-[13px] font-extrabold text-[#3D7FFF]">{i + 1}</span>
                )}
              </div>
              <p className="m-0 pt-1.5 text-[13.5px] text-[#101828]">{step.text}</p>
            </div>
          ))}
        </div>

        <button
          onClick={closeIosModal}
          className="mt-6 w-full cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] py-3 text-sm font-bold text-white"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
