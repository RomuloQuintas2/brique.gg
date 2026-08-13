import type { LucideIcon } from "lucide-react";

export default function StatChip({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
        style={{ background: `${color}1A`, color }}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <div className="text-[12px] font-semibold text-[#64748B]">{label}</div>
        <div className="truncate text-[15px] font-extrabold text-[#101828]">{value}</div>
        <div className="text-[11.5px] text-[#94A3B8]">{sub}</div>
      </div>
    </div>
  );
}
