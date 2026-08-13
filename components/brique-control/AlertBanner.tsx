import { AlertTriangle } from "lucide-react";

export default function AlertBanner({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className="mb-5 flex items-start gap-3 rounded-2xl p-4"
      style={{ background: "rgba(242,201,76,0.14)", border: "1px solid rgba(242,201,76,0.35)" }}
    >
      <div className="flex-shrink-0 text-[#8A5710]">
        <AlertTriangle size={18} />
      </div>
      <div>
        <div className="text-[13.5px] font-bold text-[#8A5710]">{title}</div>
        <div className="text-[12.5px] text-[#8A5710]/80">{description}</div>
      </div>
    </div>
  );
}
