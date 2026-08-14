"use client";

import { useState } from "react";
import { Search, Smartphone, Clock } from "lucide-react";
import AppShell from "@/components/brique-control/AppShell";
import PageHeader from "@/components/brique-control/PageHeader";

function ImeiContent() {
  const [imei, setImei] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [checked, setChecked] = useState<string | null>(null);

  const canCheck = imei.replace(/\D/g, "").length >= 14;

  const handleCheck = () => {
    if (!canCheck) return;
    setChecked(imei);
    setHistory((prev) => [imei, ...prev.filter((h) => h !== imei)].slice(0, 5));
  };

  return (
    <>
      <PageHeader
        title="Consulta de IMEI"
        subtitle="Veja se o aparelho tem restrição antes de comprar."
      />

      <div
        className="mb-5 rounded-[20px] bg-white p-6"
        style={{ border: "1px solid rgba(15,23,42,0.09)" }}
      >
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3D7FFF]/10 text-[#3D7FFF]">
            <Smartphone size={18} />
          </div>
          <div className="text-[15px] font-bold text-[#1D4ED8]">Consultar aparelho</div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">
              IMEI (15 dígitos, encontrado discando *#06# no aparelho)
            </label>
            <input
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              placeholder="Ex: 356938035643809"
              className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
              style={{ border: "1px solid rgba(15,23,42,0.15)" }}
            />
          </div>
          <button
            onClick={handleCheck}
            disabled={!canCheck}
            className="flex flex-shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-[11px] border-none bg-[#3D7FFF] px-6 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Search size={16} />
            Consultar
          </button>
        </div>
      </div>

      {checked && (
        <div
          className="mb-5 flex items-start gap-3 rounded-2xl p-4"
          style={{ background: "rgba(242,201,76,0.14)", border: "1px solid rgba(242,201,76,0.35)" }}
        >
          <div className="flex-shrink-0 text-[#8A5710]">
            <Clock size={18} />
          </div>
          <div>
            <div className="text-[13.5px] font-bold text-[#8A5710]">
              Consulta em breve
            </div>
            <div className="text-[12.5px] text-[#8A5710]/80">
              A checagem automática de restrição pra o IMEI <strong>{checked}</strong>{" "}
              ainda está sendo implementada. Assim que estiver disponível, você vai ver
              aqui se o aparelho tem bloqueio, roubo/furto registrado ou débitos
              associados.
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div
          className="rounded-[20px] bg-white p-5"
          style={{ border: "1px solid rgba(15,23,42,0.09)" }}
        >
          <div className="mb-3 text-[13px] font-bold text-[#1D4ED8]">
            Consultas recentes
          </div>
          <div className="flex flex-col gap-2">
            {history.map((h) => (
              <div
                key={h}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                style={{ background: "#F5F7FA" }}
              >
                <Smartphone size={15} className="flex-shrink-0 text-[#94A3B8]" />
                <span className="text-[13px] font-semibold text-[#101828]">{h}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-8" />
    </>
  );
}

export default function ImeiPage() {
  return (
    <AppShell>
      <ImeiContent />
    </AppShell>
  );
}
