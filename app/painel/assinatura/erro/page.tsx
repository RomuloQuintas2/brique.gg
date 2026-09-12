import Link from "next/link";
import { X } from "lucide-react";
import PageHeader from "@/components/brique-control/PageHeader";

// NOTE: Kiwify's checkout has no built-in way to redirect here on a
// declined/cancelled payment -- only a single "thank you page" URL,
// configured in the Kiwify dashboard's product settings, for the approved
// case (see /painel/assinatura/sucesso). This page exists for a future
// explicit deep link, not because Kiwify's checkout can reach it directly
// today.
export default function AssinaturaErroPage() {
  return (
    <>
      <PageHeader title="Assinatura" subtitle="Pagamento não concluído." />

      <div
        className="mx-auto max-w-[460px] rounded-[20px] bg-white p-8 text-center"
        style={{ border: "1px solid rgba(15,23,42,0.09)" }}
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E05B5B]/10 text-[#B91C1C]">
          <X size={24} />
        </div>
        <h1 className="m-0 mb-1.5 text-lg font-extrabold text-[#1D4ED8]">
          Pagamento não concluído
        </h1>
        <p className="m-0 mb-6 text-sm text-[#64748B]">
          Seu pagamento não foi aprovado ou o processo foi cancelado. Você continua no plano
          Grátis normalmente — pode tentar assinar de novo quando quiser.
        </p>
        <Link
          href="/painel/assinatura"
          className="inline-block cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] px-6 py-3 text-sm font-bold text-white no-underline"
        >
          Tentar novamente
        </Link>
      </div>
    </>
  );
}
