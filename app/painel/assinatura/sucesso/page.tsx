"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import PageHeader from "@/components/brique-control/PageHeader";
import { useBrique } from "@/components/brique-control/BriqueContext";

// Purely informational. The real, trustworthy plan update happens in the
// webhook (server-to-server, signature-verified) -- this page never writes
// to the database itself, it only polls refreshIsPro to reflect whatever the
// webhook has already confirmed by the time it lands.
function SucessoContent() {
  const { isPro, refreshIsPro } = useBrique();
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (isPro) return;
    if (attempts >= 10) return;
    const timeout = setTimeout(async () => {
      await refreshIsPro();
      setAttempts((n) => n + 1);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [isPro, attempts, refreshIsPro]);

  return (
    <>
      <PageHeader title="Assinatura" subtitle="Confirmação de pagamento." />

      <div
        className="mx-auto max-w-[460px] rounded-[20px] bg-white p-8 text-center"
        style={{ border: "1px solid rgba(15,23,42,0.09)" }}
      >
        {isPro ? (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#3FBE7A]/15 text-[#1B7A4A]">
              <Check size={24} />
            </div>
            <h1 className="m-0 mb-1.5 text-lg font-extrabold text-[#1D4ED8]">
              Assinatura confirmada!
            </h1>
            <p className="m-0 mb-6 text-sm text-[#64748B]">
              Seu plano PRO já está ativo. Todos os recursos avançados foram liberados.
            </p>
            <Link
              href="/painel"
              className="inline-block cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] px-6 py-3 text-sm font-bold text-white no-underline"
            >
              Ir para o painel
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#3D7FFF]/10 text-[#3D7FFF]">
              <Loader2 size={24} className="animate-spin" />
            </div>
            <h1 className="m-0 mb-1.5 text-lg font-extrabold text-[#1D4ED8]">
              Pagamento em confirmação...
            </h1>
            <p className="m-0 mb-6 text-sm text-[#64748B]">
              {attempts >= 10
                ? "Ainda estamos confirmando seu pagamento. Pode levar alguns minutos — o plano PRO libera automaticamente assim que a confirmação chegar, sem precisar fazer nada."
                : "Aguarde só um instante enquanto confirmamos seu pagamento."}
            </p>
            <Link
              href="/painel"
              className="inline-block cursor-pointer rounded-[11px] px-6 py-3 text-sm font-bold text-[#1D4ED8] no-underline"
              style={{ border: "1px solid rgba(15,23,42,0.12)" }}
            >
              Voltar pro painel
            </Link>
          </>
        )}
      </div>
    </>
  );
}

export default function AssinaturaSucessoPage() {
  return <SucessoContent />;
}
