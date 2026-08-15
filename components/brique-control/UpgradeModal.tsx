"use client";

import { X, Sparkles } from "lucide-react";
import { useBrique } from "./BriqueContext";
import { createClient } from "@/lib/supabase/client";
import { CURRENT_PRO_PRICE } from "@/lib/proPricing";

const benefits = [
  "Clientes e fornecedores",
  "Ordens de Serviço",
  "Gerador de QR Code PIX",
  "Relatórios avançados e exportação",
  "Backup de dados e multiusuário",
];

export default function UpgradeModal() {
  const { upgradeModalOpen, closeUpgradeModal, setIsPro } = useBrique();

  if (!upgradeModalOpen) return null;

  return (
    <div
      onClick={closeUpgradeModal}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] rounded-[20px] bg-white p-6"
      >
        <div className="mb-4 flex items-start justify-between">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-[#0B0E14]"
            style={{ background: "linear-gradient(135deg,#F2C94C,#E0A526)" }}
          >
            <Sparkles size={22} />
          </div>
          <button
            onClick={closeUpgradeModal}
            className="cursor-pointer border-none bg-none p-1 text-[#64748B]"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="m-0 mb-1.5 text-lg font-extrabold text-[#1D4ED8]">
          Desbloqueie o brique.gg PRO
        </h2>
        <p className="m-0 mb-4 text-sm text-[#64748B]">
          Assine para liberar os recursos avançados e crescer mais rápido.
        </p>

        <ul className="m-0 mb-5 flex list-none flex-col gap-2 p-0">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-2 text-[13.5px] text-[#101828]">
              <span className="mt-0.5 text-[#3D7FFF]">•</span>
              {b}
            </li>
          ))}
        </ul>

        <button
          onClick={async () => {
            setIsPro(true);
            closeUpgradeModal();
            const supabase = createClient();
            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;
            const { data: profile } = await supabase
              .from("profiles")
              .select("locked_price")
              .eq("id", user.id)
              .single();
            if (profile && profile.locked_price === null) {
              await supabase
                .from("profiles")
                .update({
                  locked_price: CURRENT_PRO_PRICE,
                  subscribed_at: new Date().toISOString().slice(0, 10),
                })
                .eq("id", user.id);
            }
          }}
          className="mb-2 w-full cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] py-3 text-sm font-bold text-white"
        >
          Ver planos
        </button>
        <button
          onClick={closeUpgradeModal}
          className="w-full cursor-pointer rounded-[11px] border-none bg-transparent py-2 text-[13px] font-semibold text-[#64748B]"
        >
          Agora não
        </button>
      </div>
    </div>
  );
}
