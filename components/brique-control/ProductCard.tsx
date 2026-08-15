import { DollarSign, Pencil, Trash2 } from "lucide-react";

export type ExtraCost = { label: string; value: number };

export type Product = {
  id: string;
  icon: string;
  name: string;
  cost: number;
  price: number;
  stock: number;
  acquisition_date: string | null;
  extra_costs: ExtraCost[];
};

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (iso: string | null) => {
  if (!iso) return null;
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

export function totalCost(p: Pick<Product, "cost" | "extra_costs">) {
  return p.cost + p.extra_costs.reduce((sum, e) => sum + e.value, 0);
}

export default function ProductCard({
  product,
  onSell,
  onEdit,
  onDelete,
}: {
  product: Product;
  onSell: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const total = totalCost(product);
  const profit = product.price - total;
  const margin = product.price > 0 ? Math.round((profit / product.price) * 100) : 0;
  const acquired = formatDate(product.acquisition_date);
  const soldOut = product.stock <= 0;

  return (
    <div
      className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4"
      style={{ border: "1px solid rgba(15,23,42,0.09)", opacity: soldOut ? 0.65 : 1 }}
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#4C8DFF]/10 text-2xl">
        {product.icon}
      </div>

      <div className="min-w-[160px] flex-1">
        <div
          className={`truncate text-[15px] font-bold text-[#101828] ${
            soldOut ? "line-through decoration-2" : ""
          }`}
        >
          {product.name}
        </div>
        <div className="truncate text-[13px] text-[#64748B]">
          {acquired ? `Comprado em ${acquired} · ` : ""}Custo total: {currency(total)}
        </div>
        <div className="truncate text-[13px] font-semibold">
          <span className={profit >= 0 ? "text-[#3FBE7A]" : "text-[#E05B5B]"}>
            Lucro estimado: {currency(profit)}
          </span>
          <span className="text-[#64748B]"> · Margem: {margin}%</span>
        </div>
      </div>

      {soldOut ? (
        <div className="flex-shrink-0 rounded-full bg-[rgba(224,91,91,0.12)] px-3 py-1 text-xs font-bold text-[#E05B5B]">
          Vendido
        </div>
      ) : (
        <div className="flex-shrink-0 rounded-full bg-[#F1F4F9] px-3 py-1 text-xs font-bold text-[#5B6472]">
          {product.stock} un.
        </div>
      )}

      <div className="flex flex-shrink-0 flex-wrap items-center gap-1.5">
        {!soldOut && (
          <button
            onClick={onSell}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border-none px-3 py-1.5 text-xs font-bold text-[#3FBE7A]"
            style={{ background: "rgba(63,190,122,0.12)" }}
          >
            <DollarSign size={14} />
            Vender
          </button>
        )}
        <button
          onClick={onEdit}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border-none px-3 py-1.5 text-xs font-bold text-[#3D7FFF]"
          style={{ background: "rgba(76,141,255,0.12)" }}
        >
          <Pencil size={13} />
          Editar
        </button>
        <button
          onClick={onDelete}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border-none px-3 py-1.5 text-xs font-bold text-[#E05B5B]"
          style={{ background: "rgba(224,91,91,0.12)" }}
        >
          <Trash2 size={13} />
          Excluir
        </button>
      </div>
    </div>
  );
}
