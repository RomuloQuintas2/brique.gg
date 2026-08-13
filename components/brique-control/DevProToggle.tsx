"use client";

import { useBrique } from "./BriqueContext";

export default function DevProToggle() {
  const { isPro, setIsPro } = useBrique();

  return (
    <button
      onClick={() => setIsPro(!isPro)}
      className="fixed right-4 bottom-4 z-[70] cursor-pointer rounded-full px-4 py-2 text-xs font-bold text-white shadow-lg"
      style={{ background: isPro ? "#1B7A4A" : "#334155" }}
      title="Alternar modo de teste Free/PRO"
    >
      Modo teste: {isPro ? "PRO" : "Free"}
    </button>
  );
}
