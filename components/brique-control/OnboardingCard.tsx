"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Tag, Download, ArrowRight, Check, X } from "lucide-react";
import { usePwaInstall } from "./PwaInstallContext";

export default function OnboardingCard({
  hasProducts,
  hasSales,
}: {
  hasProducts: boolean;
  hasSales: boolean;
}) {
  const [dismissed, setDismissed] = useState(false);
  const { isInstalled, install } = usePwaInstall();

  if (dismissed || (hasProducts && hasSales && isInstalled)) return null;

  return (
    <div
      className="mb-5 rounded-[20px] bg-white p-5"
      style={{ border: "1px solid rgba(15,23,42,0.09)" }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-[15px] font-bold text-[#1D4ED8]">Seus primeiros passos</div>
          <p className="m-0 text-[13px] text-[#64748B]">
            Três coisas pra começar a ver seu lucro real.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Fechar"
          className="flex-shrink-0 cursor-pointer border-none bg-none p-1 text-[#94A3B8]"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <button
          onClick={isInstalled ? undefined : install}
          className="flex cursor-pointer items-center gap-3 rounded-2xl border-none p-4 text-left"
          style={{ background: "rgba(242,201,76,0.1)", border: "1px solid rgba(242,201,76,0.3)" }}
        >
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[#8A5710]"
            style={{ background: "rgba(242,201,76,0.25)" }}
          >
            {isInstalled ? <Check size={20} /> : <Download size={20} />}
          </div>
          <div className="min-w-0 flex-1">
            <div
              className={`text-sm font-bold ${isInstalled ? "text-slate-400 line-through" : "text-[#101828]"}`}
            >
              1. Baixe o app
            </div>
            <div className="text-xs text-[#64748B]">
              Acesse direto da tela inicial do seu celular, sem navegador
            </div>
          </div>
        </button>

        <Link
          href="/painel/produtos"
          className="flex items-center gap-3 rounded-2xl p-4"
          style={{ background: "rgba(76,141,255,0.06)", border: "1px solid rgba(76,141,255,0.18)" }}
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#3D7FFF]/15 text-[#3D7FFF]">
            {hasProducts ? <Check size={20} /> : <Package size={20} />}
          </div>
          <div className="min-w-0 flex-1">
            <div
              className={`text-sm font-bold ${hasProducts ? "text-slate-400 line-through" : "text-[#101828]"}`}
            >
              2. Cadastre seu primeiro produto
            </div>
            <div className="text-xs text-[#64748B]">Adicione o que você tem pra vender</div>
          </div>
          <ArrowRight size={16} className="flex-shrink-0 text-[#3D7FFF]" />
        </Link>

        <Link
          href="/painel/vendas"
          className="flex items-center gap-3 rounded-2xl p-4"
          style={{ background: "rgba(63,190,122,0.06)", border: "1px solid rgba(63,190,122,0.18)" }}
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#3FBE7A]/15 text-[#3FBE7A]">
            {hasSales ? <Check size={20} /> : <Tag size={20} />}
          </div>
          <div className="min-w-0 flex-1">
            <div
              className={`text-sm font-bold ${hasSales ? "text-slate-400 line-through" : "text-[#101828]"}`}
            >
              3. Registre sua primeira venda
            </div>
            <div className="text-xs text-[#64748B]">Veja seu lucro calculado na hora</div>
          </div>
          <ArrowRight size={16} className="flex-shrink-0 text-[#3FBE7A]" />
        </Link>
      </div>
    </div>
  );
}
