export type Product = {
  id: string;
  icon: string;
  name: string;
  cost: number;
  price: number;
  stock: number;
};

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function ProductCard({ product }: { product: Product }) {
  const profit = product.price - product.cost;
  const margin = product.price > 0 ? Math.round((profit / product.price) * 100) : 0;

  return (
    <div
      className="flex items-center gap-4 rounded-2xl bg-white p-4"
      style={{ border: "1px solid rgba(15,23,42,0.09)" }}
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#4C8DFF]/10 text-2xl">
        {product.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-bold text-[#101828]">{product.name}</div>
        <div className="text-[13px] text-[#64748B]">
          Custo: {currency(product.cost)} · Venda: {currency(product.price)}
        </div>
        <div className="text-[13px] font-semibold">
          <span className="text-[#3FBE7A]">Lucro: {currency(profit)}</span>
          <span className="text-[#64748B]"> · Margem: {margin}%</span>
        </div>
      </div>
      <div className="flex-shrink-0 rounded-full bg-[#F1F4F9] px-3 py-1 text-xs font-bold text-[#5B6472]">
        {product.stock} un.
      </div>
    </div>
  );
}
