"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import AppShell from "@/components/brique-control/AppShell";
import PageHeader from "@/components/brique-control/PageHeader";
import { exportFullBackup } from "@/lib/exportBackup";

function BackupContent() {
  const [backingUp, setBackingUp] = useState(false);

  const runBackup = async () => {
    setBackingUp(true);
    await exportFullBackup();
    setBackingUp(false);
  };

  return (
    <>
      <PageHeader title="Backup de Dados" subtitle="Baixe todo o histórico do seu negócio." />

      <div
        className="rounded-[20px] bg-white p-6"
        style={{ border: "1px solid rgba(15,23,42,0.09)" }}
      >
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3D7FFF]/10 text-[#3D7FFF]">
            <Download size={18} />
          </div>
          <div className="text-[15px] font-bold text-[#1D4ED8]">Backup dos seus dados</div>
        </div>
        <p className="m-0 mb-4 text-[13.5px] text-[#64748B]">
          Baixe uma planilha com todo o histórico: produtos, vendas, financeiro, clientes,
          fornecedores e ordens de serviço.
        </p>
        <button
          onClick={runBackup}
          disabled={backingUp}
          className="flex cursor-pointer items-center gap-2 rounded-[11px] border-none bg-[#3D7FFF] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          <Download size={16} />
          {backingUp ? "Gerando..." : "Baixar backup (Excel)"}
        </button>
      </div>

      <div className="h-8" />
    </>
  );
}

export default function BackupPage() {
  return (
    <AppShell>
      <BackupContent />
    </AppShell>
  );
}
