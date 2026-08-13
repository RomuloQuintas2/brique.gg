"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const chartData = [
  { label: "Fev", value: 2200 },
  { label: "Mar", value: 3100 },
  { label: "Abr", value: 2800 },
  { label: "Mai", value: 3900 },
  { label: "Jun", value: 3400 },
  { label: "Jul", value: 4280 },
];

export default function SalesChart() {
  return (
    <div
      className="mb-[22px] rounded-[20px] bg-white p-[22px]"
      style={{ border: "1px solid rgba(15,23,42,0.09)" }}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[15px] font-bold text-[#1D4ED8]">Performance de Vendas</div>
        <div className="flex items-center gap-1.5 text-[12.5px] font-bold text-[#3FBE7A]">
          <TrendingUp size={14} />
          Últimos 6 meses
        </div>
      </div>
      <div className="h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="bcCurrentBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4C8DFF" />
                <stop offset="100%" stopColor="#1A4FBF" />
              </linearGradient>
            </defs>
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
              labelFormatter={(label) => label}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid rgba(15,23,42,0.09)",
                fontSize: 12.5,
              }}
            />
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              maxBarSize={34}
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.label}
                  fill={index === chartData.length - 1 ? "url(#bcCurrentBar)" : "rgba(76,141,255,0.28)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
