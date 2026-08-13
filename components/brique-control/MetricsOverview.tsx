import { Package, TrendingUp, Wallet, Tag } from "lucide-react";
import StatChip from "./StatChip";

export default function MetricsOverview({
  profit,
  changeLabel,
  stock,
  stockSub,
  sold,
  soldSub,
  spent,
  spentSub,
  salesCount,
  salesCountSub,
}: {
  profit: string;
  changeLabel: string;
  stock: string;
  stockSub: string;
  sold: string;
  soldSub: string;
  spent: string;
  spentSub: string;
  salesCount: string;
  salesCountSub: string;
}) {
  return (
    <div
      className="mb-5 rounded-[20px] bg-white p-6"
      style={{ border: "1px solid rgba(15,23,42,0.09)" }}
    >
      <div className="mb-1 text-[13px] font-semibold text-[#64748B]">Lucro do Período</div>
      <div className="flex flex-wrap items-baseline gap-3">
        <div className="text-[clamp(30px,4vw,38px)] font-extrabold tracking-[-0.5px] text-[#1D4ED8]">
          {profit}
        </div>
        <div className="flex items-center gap-1 text-[13px] font-bold text-[#3FBE7A]">
          <TrendingUp size={14} />
          {changeLabel}
        </div>
      </div>

      <div
        className="mt-6 grid grid-cols-2 gap-y-5 pt-5 sm:grid-cols-4"
        style={{ borderTop: "1px solid rgba(15,23,42,0.08)" }}
      >
        <StatChip icon={Package} label="Em Estoque" value={stock} sub={stockSub} color="#4C8DFF" />
        <StatChip icon={TrendingUp} label="Vendido" value={sold} sub={soldSub} color="#3FBE7A" />
        <StatChip icon={Wallet} label="Gasto" value={spent} sub={spentSub} color="#E05B5B" />
        <StatChip icon={Tag} label="Vendas" value={salesCount} sub={salesCountSub} color="#64748B" />
      </div>
    </div>
  );
}
