import PaymentBadge, { type PaymentMethod } from "./PaymentBadge";

export type Sale = {
  id: string;
  product_name: string;
  value: number;
  profit: number;
  payment_method: PaymentMethod;
  sale_date: string;
  platform: string | null;
  client_name: string | null;
  trade_in_description: string | null;
  trade_in_value: number | null;
  extra_costs: { label: string; value: number }[];
  fiado_due_date: string | null;
  fiado_down_payment: number | null;
};

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

export default function SaleRow({ sale }: { sale: Sale }) {
  const fiadoNote =
    sale.payment_method === "Fiado" && sale.fiado_due_date
      ? `Vence ${formatDate(sale.fiado_due_date)}`
      : null;
  const meta = [formatDate(sale.sale_date), sale.platform, sale.client_name, fiadoNote]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4"
      style={{ border: "1px solid rgba(15,23,42,0.09)" }}
    >
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-bold text-[#101828]">{sale.product_name}</div>
        <div className="truncate text-[12.5px] text-[#94A3B8]">{meta}</div>
        <div className="text-[13px] font-semibold text-[#3FBE7A]">
          Lucro: {currency(sale.profit)}
        </div>
      </div>
      <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
        <div className="text-[15px] font-extrabold text-[#101828]">{currency(sale.value)}</div>
        <PaymentBadge method={sale.payment_method} />
      </div>
    </div>
  );
}
