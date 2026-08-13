"use client";

import { useState } from "react";
import { Target } from "lucide-react";

const CURRENT_PROFIT = 4280;

export default function GoalCard() {
  const [goal, setGoal] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const saveGoal = () => {
    const v = parseFloat(draft.replace(/\D/g, ""));
    if (v > 0) {
      setGoal(v);
      setFormOpen(false);
    }
  };

  const pct = goal ? Math.min(100, Math.round((CURRENT_PROFIT / goal) * 100)) : 0;

  return (
    <div
      className="mb-[22px] rounded-[20px] p-[22px]"
      style={{ background: "#FFFFFF", border: "1px dashed rgba(15,23,42,0.16)" }}
    >
      {goal && !formOpen && (
        <>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="text-[15px] font-bold text-[#1D4ED8]">
              Meta do Mês: R$ {goal.toLocaleString("pt-BR")}
            </div>
            <button
              onClick={() => {
                setGoal(null);
                setDraft("");
                setFormOpen(false);
              }}
              className="cursor-pointer border-none bg-transparent p-0 text-[12.5px] text-[#64748B]"
            >
              editar
            </button>
          </div>
          <div className="mb-2 h-2.5 overflow-hidden rounded-full bg-slate-900/[0.08]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg,#3D7FFF,#6FA3FF)",
              }}
            />
          </div>
          <div className="text-[12.5px] text-[#64748B]">
            R$ {CURRENT_PROFIT.toLocaleString("pt-BR")} alcançados de R${" "}
            {goal.toLocaleString("pt-BR")} ({pct}%)
          </div>
        </>
      )}

      {formOpen && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#3D7FFF]/10 text-[#3D7FFF]">
            <Target size={22} />
          </div>
          <div className="min-w-[180px] flex-1">
            <div className="mb-0.5 text-[15px] font-bold text-[#1D4ED8]">
              Qual sua meta de lucro este mês?
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ex: 6000"
              className="w-[120px] rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
              style={{ border: "1px solid rgba(15,23,42,0.15)" }}
            />
            <button
              onClick={saveGoal}
              className="cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] px-4 py-2.5 text-[13.5px] font-bold text-white"
            >
              Salvar
            </button>
          </div>
        </div>
      )}

      {!goal && !formOpen && (
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#3D7FFF]/10 text-[#3D7FFF]">
            <Target size={24} />
          </div>
          <div className="min-w-[200px] flex-1">
            <div className="mb-0.5 text-[15px] font-bold text-[#1D4ED8]">Meta do Mês</div>
            <div className="text-[13px] text-[#64748B]">
              Defina uma meta de lucro para acompanhar seu progresso.
            </div>
          </div>
          <button
            onClick={() => setFormOpen(true)}
            className="flex-shrink-0 cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] px-[18px] py-2.5 text-[13.5px] font-bold text-white"
          >
            Definir Meta
          </button>
        </div>
      )}
    </div>
  );
}
