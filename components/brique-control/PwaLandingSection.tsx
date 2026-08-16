"use client";

import { Smartphone, Apple, Monitor, Download } from "lucide-react";
import { usePwaInstall } from "./PwaInstallContext";

const platforms = [
  { icon: Smartphone, label: "Android" },
  { icon: Apple, label: "iOS" },
  { icon: Monitor, label: "PC" },
];

export default function PwaLandingSection() {
  const { isInstalled, install } = usePwaInstall();

  if (isInstalled) return null;

  return (
    <section className="py-10">
      <div
        className="rounded-[24px] bg-white p-8 text-center sm:p-10"
        style={{ border: "1px solid rgba(15,23,42,0.09)" }}
      >
        <h2 className="m-0 mb-2 text-xl font-extrabold text-[#101828] sm:text-2xl">
          Use como um aplicativo, sem precisar baixar de loja nenhuma
        </h2>
        <p className="m-0 mx-auto mb-6 max-w-[560px] text-[14px] leading-relaxed text-[#64748B]">
          O brique.gg funciona perfeitamente em Android, iPhone e computador — instale com
          um toque e acesse direto da tela inicial, como se fosse um app nativo. Rápido, leve
          e sem ocupar espaço extra no seu aparelho.
        </p>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          {platforms.map((p) => (
            <div
              key={p.label}
              className="flex items-center gap-2 rounded-full px-4 py-2"
              style={{ background: "#F5F7FA", border: "1px solid rgba(15,23,42,0.09)" }}
            >
              <p.icon size={16} className="text-[#3D7FFF]" />
              <span className="text-[13px] font-semibold text-[#475467]">{p.label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={install}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border-none bg-[#3D7FFF] px-6 py-3 text-sm font-bold text-white"
        >
          <Download size={16} />
          Instalar agora
        </button>
      </div>
    </section>
  );
}
