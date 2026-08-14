import { PieChart } from "lucide-react";

export type PlatformCount = { platform: string; count: number };

const PLATFORM_COLORS: Record<string, string> = {
  WhatsApp: "#3FBE7A",
  Facebook: "#4C8DFF",
  Instagram: "#E05B5B",
  OLX: "#8A5710",
  Shopee: "#E05B5B",
  "Mercado Livre": "#F2C94C",
};

export default function SalesPlatformsCard({ data }: { data: PlatformCount[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const hasData = total > 0;

  return (
    <div
      className="mb-[22px] rounded-[20px] bg-white p-[22px]"
      style={{ border: "1px solid rgba(15,23,42,0.09)" }}
    >
      <div className="mb-5 text-[15px] font-bold text-[#1D4ED8]">Plataformas de Venda</div>

      {hasData ? (
        <div className="flex flex-col gap-3">
          {data
            .sort((a, b) => b.count - a.count)
            .map((d) => {
              const pct = Math.round((d.count / total) * 100);
              return (
                <div key={d.platform}>
                  <div className="mb-1 flex items-center justify-between text-[13px]">
                    <span className="font-semibold text-[#101828]">{d.platform}</span>
                    <span className="text-[#64748B]">{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-900/[0.06]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: PLATFORM_COLORS[d.platform] ?? "#4C8DFF",
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4C8DFF]/10 text-[#4C8DFF]">
            <PieChart size={20} />
          </div>
          <p className="m-0 text-sm font-bold text-[#101828]">Em breve</p>
          <p className="m-0 max-w-[360px] text-[13px] text-[#64748B]">
            Você vai poder marcar em qual plataforma vendeu (WhatsApp, Facebook,
            Instagram, OLX, Shopee, Mercado Livre...) e ver aqui quais trazem mais
            resultado.
          </p>
        </div>
      )}
    </div>
  );
}
