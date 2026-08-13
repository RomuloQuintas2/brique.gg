import StatusPill, { type StatusTone } from "./StatusPill";

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function FinanceListRow({
  title,
  subtitle,
  value,
  status,
  tone,
}: {
  title: string;
  subtitle: string;
  value: number;
  status: string;
  tone: StatusTone;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4"
      style={{ border: "1px solid rgba(15,23,42,0.09)" }}
    >
      <div className="min-w-0">
        <div className="truncate text-sm font-bold text-[#101828]">{title}</div>
        <div className="text-xs text-[#64748B]">{subtitle}</div>
      </div>
      <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
        <div className="text-sm font-extrabold text-[#101828]">{currency(value)}</div>
        <StatusPill label={status} tone={tone} />
      </div>
    </div>
  );
}
