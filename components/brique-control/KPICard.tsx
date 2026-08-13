export type KPICardData = {
  label: string;
  value: string;
  sub: string;
  from?: string;
  to?: string;
  neutral?: boolean;
};

export default function KPICard({ label, value, sub, from, to, neutral }: KPICardData) {
  return (
    <div
      className="rounded-[20px] px-[18px] pt-[18px] pb-5"
      style={{
        minHeight: 118,
        background: neutral ? "#F1F4F9" : `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        border: neutral ? "1px solid rgba(15,23,42,0.08)" : "none",
      }}
    >
      <div
        className="mb-2.5 text-[12.5px] font-semibold"
        style={{
          color: neutral ? "#5B6472" : "rgba(255,255,255,0.88)",
          textShadow: neutral ? "none" : "0 1px 3px rgba(0,0,0,0.3)",
        }}
      >
        {label}
      </div>
      <div
        className="text-[22px] font-extrabold tracking-[-0.3px]"
        style={{
          color: neutral ? "#101828" : "#fff",
          textShadow: neutral ? "none" : "0 1px 4px rgba(0,0,0,0.35)",
        }}
      >
        {value}
      </div>
      <div
        className="mt-1.5 text-xs"
        style={{
          color: neutral ? "#6B7280" : "rgba(255,255,255,0.75)",
          textShadow: neutral ? "none" : "0 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        {sub}
      </div>
    </div>
  );
}
