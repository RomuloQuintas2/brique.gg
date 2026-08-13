import { BarChart2 } from "lucide-react";

export default function PriceComparatorCard() {
  return (
    <div
      className="rounded-[20px] bg-white p-5"
      style={{ border: "1px solid rgba(15,23,42,0.09)" }}
    >
      <div className="mb-2.5 flex items-center gap-2.5">
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[#4C8DFF]/[0.14] text-[#4C8DFF]">
          <BarChart2 size={18} />
        </div>
        <div className="text-[14.5px] font-bold text-[#1D4ED8]">Comparador de Preço</div>
      </div>
      <div className="mb-3 text-[13px] leading-[1.5] text-[#64748B]">
        Sugestão de preço de venda com base no que você já cadastrou.{" "}
        <a href="#" className="text-[#1D4ED8] hover:text-[#3D7FFF]">
          Assinantes PRO
        </a>{" "}
        recebem o preço médio de mercado, atualizado automaticamente.
      </div>
      <a href="#" className="text-[13px] font-bold text-[#1D4ED8] hover:text-[#3D7FFF]">
        Comparar preço →
      </a>
    </div>
  );
}
