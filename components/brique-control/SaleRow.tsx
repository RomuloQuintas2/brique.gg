import PaymentBadge, { type PaymentMethod } from "./PaymentBadge";

export type Sale = {
  id: string;
  product: string;
  value: number;
  profit: number;
  method: PaymentMethod;
};

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function SaleRow({ sale }: { sale: Sale }) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4"
      style={{ border: "1px solid rgba(15,23,42,0.09)" }}
    >
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-bold text-[#101828]">{sale.product}</div>
        <div className="text-[13px] font-semibold text-[#3FBE7A]">
          Lucro: {currency(sale.profit)}
        </div>
      </div>
      <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
        <div className="text-[15px] font-extrabold text-[#101828]">{currency(sale.value)}</div>
        <PaymentBadge method={sale.method} />
      </div>
    </div>
  );
}
