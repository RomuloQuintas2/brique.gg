import { Calendar } from "lucide-react";

const periods = [
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "mes", label: "Mês Atual" },
  { key: "custom", label: "Personalizado" },
] as const;

export default function PeriodFilter({
  active,
  onChange,
}: {
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="mb-5 flex gap-2 overflow-x-auto pb-0.5">
      {periods.map((p) => {
        const isActive = active === p.key;
        return (
          <button
            key={p.key}
            onClick={() => onChange(p.key)}
            className={`flex flex-shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2.5 text-[13.5px] font-bold ${
              isActive ? "bg-[#3D7FFF] text-white" : "bg-white text-[#5B6472]"
            }`}
            style={{
              border: `1px solid ${isActive ? "#3D7FFF" : "rgba(15,23,42,0.12)"}`,
            }}
          >
            {p.key === "custom" && <Calendar size={14} />}
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
