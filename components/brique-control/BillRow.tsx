import { Pencil, Trash2, Check } from "lucide-react";
import StatusPill from "./StatusPill";

export type Bill = {
  id: string;
  description: string;
  category: string;
  estimated_value: number;
  is_variable: boolean;
  is_recurring: boolean;
  due_date: string;
  notes: string | null;
  paid: boolean;
  paid_at: string | null;
};

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

export default function BillRow({
  bill,
  onMarkPaid,
  onEdit,
  onDelete,
}: {
  bill: Bill;
  onMarkPaid?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const meta = [bill.category, `Vence ${formatDate(bill.due_date)}`, bill.is_recurring ? "Recorrente" : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4"
      style={{ border: "1px solid rgba(15,23,42,0.09)" }}
    >
      <div className="min-w-[160px] flex-1">
        <div className="truncate text-[15px] font-bold text-[#101828]">{bill.description}</div>
        <div className="truncate text-[13px] text-[#64748B]">{meta}</div>
      </div>

      <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
        <div className="text-[15px] font-extrabold text-[#101828]">
          {currency(bill.estimated_value)}
        </div>
        <StatusPill label={bill.paid ? "Pago" : "Em aberto"} tone={bill.paid ? "success" : "warning"} />
      </div>

      <div className="flex flex-shrink-0 flex-wrap items-center gap-1.5">
        {!bill.paid && onMarkPaid && (
          <button
            onClick={onMarkPaid}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border-none px-3 py-1.5 text-xs font-bold text-[#3FBE7A]"
            style={{ background: "rgba(63,190,122,0.12)" }}
          >
            <Check size={13} />
            Pago
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
