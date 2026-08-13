"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { label: "15/04", faturamento: 1200, investimento: 800, lucro: 400 },
  { label: "22/04", faturamento: 1850, investimento: 1100, lucro: 750 },
  { label: "29/04", faturamento: 1400, investimento: 950, lucro: 450 },
  { label: "06/05", faturamento: 2100, investimento: 1300, lucro: 800 },
];

const legend = [
  { key: "faturamento", label: "Faturamento", color: "#4C8DFF" },
  { key: "investimento", label: "Investimento", color: "#94A3B8" },
  { key: "lucro", label: "Lucro", color: "#3FBE7A" },
];

export default function FinancePerformanceChart() {
  return (
    <div
      className="mb-[22px] rounded-[20px] bg-white p-[22px]"
      style={{ border: "1px solid rgba(15,23,42,0.09)" }}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[15px] font-bold text-[#1D4ED8]">Performance Financeira</div>
        <div className="flex items-center gap-3">
          {legend.map((l) => (
            <div key={l.key} className="flex items-center gap-1.5 text-[12px] font-semibold text-[#64748B]">
              <span className="h-2 w-2 rounded-full" style={{ background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 4, left: 4, bottom: 0 }} barGap={4}>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11.5, fontWeight: 600, fill: "#6B7280" }}
              dy={8}
            />
            <YAxis hide domain={[0, "dataMax"]} />
            <Tooltip
              cursor={false}
              formatter={(value) => [`R$ ${Number(value).toLocaleString("pt-BR")}`, ""]}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid rgba(15,23,42,0.09)",
                fontSize: 12.5,
              }}
            />
            <Bar dataKey="faturamento" fill="#4C8DFF" radius={[6, 6, 0, 0]} maxBarSize={18} isAnimationActive={false} />
            <Bar dataKey="investimento" fill="#94A3B8" radius={[6, 6, 0, 0]} maxBarSize={18} isAnimationActive={false} />
            <Bar dataKey="lucro" fill="#3FBE7A" radius={[6, 6, 0, 0]} maxBarSize={18} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
