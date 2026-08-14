import { Calendar } from "lucide-react";

const periods = [
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "ano", label: "Este Ano" },
  { key: "custom", label: "Personalizado" },
] as const;

export default function PeriodFilter({
  active,
  onChange,
  customStart,
  customEnd,
  onCustomChange,
}: {
  active: string;
  onChange: (key: string) => void;
  customStart: string;
  customEnd: string;
  onCustomChange: (start: string, end: string) => void;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3">
      <div className="flex gap-1 overflow-x-auto pb-0.5 sm:gap-2">
        {periods.map((p) => {
          const isActive = active === p.key;
          return (
            <button
              key={p.key}
              onClick={() => onChange(p.key)}
              className={`flex flex-shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11.5px] font-bold sm:gap-1.5 sm:px-4 sm:py-2.5 sm:text-[13.5px] ${
                isActive ? "bg-[#3D7FFF] text-white" : "bg-white text-[#5B6472]"
              }`}
              style={{
                border: `1px solid ${isActive ? "#3D7FFF" : "rgba(15,23,42,0.12)"}`,
              }}
            >
              {p.key === "custom" && <Calendar size={12} className="flex-shrink-0 sm:hidden" />}
              {p.key === "custom" && <Calendar size={14} className="hidden flex-shrink-0 sm:block" />}
              {p.label}
            </button>
          );
        })}
      </div>

      {active === "custom" && (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={customStart}
            max={customEnd || undefined}
            onChange={(e) => onCustomChange(e.target.value, customEnd)}
            className="rounded-[11px] bg-white px-3 py-2 text-[13px] text-[#101828]"
            style={{ border: "1px solid rgba(15,23,42,0.15)" }}
          />
          <span className="text-[13px] text-[#94A3B8]">até</span>
          <input
            type="date"
            value={customEnd}
            min={customStart || undefined}
            onChange={(e) => onCustomChange(customStart, e.target.value)}
            className="rounded-[11px] bg-white px-3 py-2 text-[13px] text-[#101828]"
            style={{ border: "1px solid rgba(15,23,42,0.15)" }}
          />
        </div>
      )}
    </div>
  );
}
