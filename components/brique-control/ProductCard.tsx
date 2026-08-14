import { Package, DollarSign, Pencil, Trash2 } from "lucide-react";

export type ExtraCost = { label: string; value: number };

export type Product = {
  id: string;
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

  return (
    <div
      className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4"
      style={{ border: "1px solid rgba(15,23,42,0.09)" }}
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#4C8DFF]/10 text-[#4C8DFF]">
        <Package size={20} />
      </div>

      <div className="min-w-[160px] flex-1">
        <div className="truncate text-[15px] font-bold text-[#101828]">{product.name}</div>
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

      <div className="flex-shrink-0 rounded-full bg-[#F1F4F9] px-3 py-1 text-xs font-bold text-[#5B6472]">
        {product.stock} un.
      </div>

      <div className="flex flex-shrink-0 items-center gap-1.5">
        <button
          onClick={onSell}
          disabled={product.stock <= 0}
          title="Vender"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#3FBE7A] disabled:cursor-not-allowed disabled:opacity-30"
          style={{ background: "rgba(63,190,122,0.12)" }}
        >
          <DollarSign size={16} />
        </button>
        <button
          onClick={onEdit}
          title="Editar"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#3D7FFF]"
          style={{ background: "rgba(76,141,255,0.12)" }}
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={onDelete}
          title="Excluir"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#E05B5B]"
          style={{ background: "rgba(224,91,91,0.12)" }}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
