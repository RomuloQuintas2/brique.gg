"use client";

import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type FinancePerformancePoint = {
  label: string;
  recebido: number;
  aReceber: number;
  contasAPagar: number;
};

const PERIODS = [
  { key: "3m", label: "3m", months: 3 },
  { key: "6m", label: "6m", months: 6 },
  { key: "12m", label: "12m", months: 12 },
] as const;

const legend = [
  { key: "recebido", label: "Recebido", color: "#3FBE7A" },
  { key: "aReceber", label: "A Receber", color: "#4C8DFF" },
  { key: "contasAPagar", label: "Contas a Pagar", color: "#E05B5B" },
];

export default function FinancePerformanceChart({ data }: { data: FinancePerformancePoint[] }) {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]["key"]>("6m");
  const months = PERIODS.find((p) => p.key === period)!.months;
  const sliced = data.slice(-months);

  return (
    <div
      className="mb-[22px] rounded-[20px] bg-white p-[22px]"
      style={{ border: "1px solid rgba(15,23,42,0.09)" }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[15px] font-bold text-[#1D4ED8]">
          Performance Financeira do Negócio
        </div>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`cursor-pointer rounded-full px-3 py-1.5 text-[12px] font-bold ${
                period === p.key ? "bg-[#3D7FFF] text-white" : "bg-[#F5F7FA] text-[#5B6472]"
              }`}
              style={{ border: `1px solid ${period === p.key ? "#3D7FFF" : "rgba(15,23,42,0.12)"}` }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        {legend.map((l) => (
          <div key={l.key} className="flex items-center gap-1.5 text-[12px] font-semibold text-[#64748B]">
            <span className="h-2 w-2 rounded-full" style={{ background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sliced} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="fillRecebido" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3FBE7A" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3FBE7A" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fontWeight: 600, fill: "#6B7280" }}
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
            <Area
              type="monotone"
              dataKey="recebido"
              stroke="#3FBE7A"
              strokeWidth={2.5}
              fill="url(#fillRecebido)"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="aReceber"
              stroke="#4C8DFF"
              strokeWidth={2}
              fill="none"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="contasAPagar"
              stroke="#E05B5B"
              strokeWidth={2}
              fill="none"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
