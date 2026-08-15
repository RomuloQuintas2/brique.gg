export type SpendingItem = { label: string; value: number };

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const BAR_COLORS = ["#E05B5B", "#F2C94C", "#4C8DFF", "#3FBE7A", "#94A3B8"];

export default function SpendingBreakdown({ items }: { items: SpendingItem[] }) {
  const sorted = [...items].filter((i) => i.value > 0).sort((a, b) => b.value - a.value);
  const max = sorted.length > 0 ? sorted[0].value : 0;

  return (
    <div
      className="mb-5 rounded-2xl bg-white p-4"
      style={{ border: "1px solid rgba(15,23,42,0.09)" }}
    >
      <div className="mb-3 text-sm font-bold text-[#101828]">Para onde foi o dinheiro</div>
      {sorted.length === 0 ? (
        <p className="m-0 text-[13px] text-[#64748B]">Nenhum gasto registrado neste mês.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((item, i) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between text-[13px]">
                <span className="font-semibold text-[#101828]">{item.label}</span>
                <span className="font-bold text-[#101828]">{currency(item.value)}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1F4F9]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${max > 0 ? (item.value / max) * 100 : 0}%`,
                    background: BAR_COLORS[i % BAR_COLORS.length],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
