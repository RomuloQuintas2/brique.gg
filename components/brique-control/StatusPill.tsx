export type StatusTone = "success" | "pending" | "warning";

const STYLES: Record<StatusTone, { bg: string; color: string }> = {
  success: { bg: "rgba(63,190,122,0.15)", color: "#1B7A4A" },
  pending: { bg: "rgba(76,141,255,0.15)", color: "#1A4FBF" },
  warning: { bg: "rgba(242,201,76,0.22)", color: "#8A5710" },
};

export default function StatusPill({ label, tone }: { label: string; tone: StatusTone }) {
  const s = STYLES[tone];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold"
      style={{ background: s.bg, color: s.color }}
    >
      {label}
    </span>
  );
}
