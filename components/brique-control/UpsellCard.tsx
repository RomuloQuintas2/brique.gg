import Link from "next/link";
import ProBadge from "./ProBadge";

export default function UpsellCard() {
  return (
    <div
      className="rounded-[20px] p-5"
      style={{
        background:
          "linear-gradient(135deg, rgba(242,201,76,0.12), rgba(76,141,255,0.08))",
        border: "1px solid rgba(15,23,42,0.08)",
      }}
    >
      <div className="mb-2.5 flex items-center gap-2">
        <ProBadge />
        <div className="text-[14.5px] font-bold text-[#1D4ED8]">
          Cresça com o brique.gg PRO
        </div>
      </div>
      <div className="mb-3 text-[13px] leading-[1.5] text-[#64748B]">
        Clientes, fornecedores, ordens de serviço, QR Code PIX e relatórios avançados —
        leve seu brique pro próximo nível.
      </div>
      <Link
        href="/painel/assinatura"
        className="inline-block cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] px-4 py-2.5 text-[13px] font-bold text-white no-underline"
      >
        Ver planos
      </Link>
    </div>
  );
}
