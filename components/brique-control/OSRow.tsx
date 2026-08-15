import { Pencil, Trash2 } from "lucide-react";

export type OSStatus = "Aberta" | "Em andamento" | "Concluída" | "Entregue";

export const OS_STATUSES: OSStatus[] = ["Aberta", "Em andamento", "Concluída", "Entregue"];

export type ServiceOrder = {
  id: string;
  client_name: string;
  device: string;
  defect_description: string;
  estimated_value: number;
  status: OSStatus;
  notes: string | null;
  created_at: string;
};

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const STATUS_STYLE: Record<OSStatus, { bg: string; color: string }> = {
  Aberta: { bg: "rgba(76,141,255,0.15)", color: "#1A4FBF" },
  "Em andamento": { bg: "rgba(242,201,76,0.22)", color: "#8A5710" },
  Concluída: { bg: "rgba(63,190,122,0.15)", color: "#1B7A4A" },
  Entregue: { bg: "rgba(15,23,42,0.08)", color: "#475467" },
};

export default function OSRow({
  os,
  onStatusChange,
  onEdit,
  onDelete,
}: {
  os: ServiceOrder;
  onStatusChange: (status: OSStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const style = STATUS_STYLE[os.status];

  return (
    <div
      className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4"
      style={{ border: "1px solid rgba(15,23,42,0.09)" }}
    >
      <div className="min-w-[180px] flex-1">
        <div className="truncate text-[15px] font-bold text-[#101828]">{os.device}</div>
        <div className="truncate text-[13px] text-[#64748B]">
          {os.client_name} · {os.defect_description}
        </div>
      </div>

      <div className="flex-shrink-0 text-[15px] font-extrabold text-[#101828]">
        {currency(os.estimated_value)}
      </div>

      <select
        value={os.status}
        onChange={(e) => onStatusChange(e.target.value as OSStatus)}
        className="flex-shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-[12px] font-bold"
        style={{ background: style.bg, color: style.color, border: "none" }}
      >
        {OS_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <div className="flex flex-shrink-0 items-center gap-1.5">
        <button
          onClick={onEdit}
          className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-none text-[#3D7FFF]"
          style={{ background: "rgba(76,141,255,0.12)" }}
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={onDelete}
          className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-none text-[#E05B5B]"
          style={{ background: "rgba(224,91,91,0.12)" }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
