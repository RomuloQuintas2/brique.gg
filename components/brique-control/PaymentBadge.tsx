export type PaymentMethod = "Pix" | "Dinheiro" | "Cartão" | "Fiado";

const STYLES: Record<PaymentMethod, { bg: string; color: string }> = {
  Pix: { bg: "rgba(63,190,122,0.15)", color: "#1B7A4A" },
  Dinheiro: { bg: "rgba(15,23,42,0.06)", color: "#475467" },
  Cartão: { bg: "rgba(76,141,255,0.15)", color: "#1A4FBF" },
  Fiado: { bg: "rgba(242,201,76,0.22)", color: "#8A5710" },
};

export default function PaymentBadge({ method }: { method: PaymentMethod }) {
  const s = STYLES[method];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold"
      style={{ background: s.bg, color: s.color }}
    >
      {method}
    </span>
  );
}
