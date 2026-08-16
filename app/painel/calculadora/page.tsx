"use client";

import { useState } from "react";
import { Calculator, Lightbulb } from "lucide-react";
import PageHeader from "@/components/brique-control/PageHeader";

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function NumberField({
  label,
  value,
  onChange,
  suffix,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-[#101828]">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "0"}
          className="w-full rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
          style={{ border: "1px solid rgba(15,23,42,0.15)" }}
        />
        {suffix && <span className="flex-shrink-0 text-[13px] text-[#94A3B8]">{suffix}</span>}
      </div>
    </div>
  );
}

function CalculadoraContent() {
  const [custo, setCusto] = useState("");
  const [custosExtras, setCustosExtras] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [taxaCartao, setTaxaCartao] = useState("0");
  const [margemIdeal, setMargemIdeal] = useState("20");

  const custoNum = Number(custo) || 0;
  const extrasNum = Number(custosExtras) || 0;
  const precoNum = Number(precoVenda) || 0;
  const taxaNum = Number(taxaCartao) || 0;
  const margemIdealNum = Number(margemIdeal) || 0;

  const taxaCartaoValor = precoNum * (taxaNum / 100);
  const custoTotal = custoNum + extrasNum + taxaCartaoValor;
  const lucroLiquido = precoNum - custoTotal;
  const margemReal = precoNum > 0 ? (lucroLiquido / precoNum) * 100 : 0;

  const denom = 1 - taxaNum / 100 - margemIdealNum / 100;
  const precoSugerido = denom > 0 ? (custoNum + extrasNum) / denom : null;

  const hasInputs = custoNum > 0 || precoNum > 0;
  const isPositive = lucroLiquido >= 0;

  return (
    <>
      <PageHeader
        title="Calculadora de Lucro"
        subtitle="Simule antes de fechar negócio, veja o lucro real, não o de fachada."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div
          className="rounded-[20px] bg-white p-6"
          style={{ border: "1px solid rgba(15,23,42,0.09)" }}
        >
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3D7FFF]/10 text-[#3D7FFF]">
              <Calculator size={18} />
            </div>
            <div className="text-[15px] font-bold text-[#1D4ED8]">Dados da simulação</div>
          </div>

          <div className="flex flex-col gap-4">
            <NumberField label="Custo do produto" value={custo} onChange={setCusto} suffix="R$" />
            <NumberField
              label="Custos extras (frete, reparo, embalagem)"
              value={custosExtras}
              onChange={setCustosExtras}
              suffix="R$"
            />
            <NumberField
              label="Preço de venda"
              value={precoVenda}
              onChange={setPrecoVenda}
              suffix="R$"
            />
            <NumberField
              label="Taxa da maquininha / cartão"
              value={taxaCartao}
              onChange={setTaxaCartao}
              suffix="%"
            />
            <NumberField
              label="Margem ideal desejada"
              value={margemIdeal}
              onChange={setMargemIdeal}
              suffix="%"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div
            className="rounded-[20px] p-6"
            style={{
              background: isPositive
                ? "linear-gradient(135deg, #4C8DFF 0%, #1A4FBF 100%)"
                : "linear-gradient(135deg, #E05B5B 0%, #9B2C2C 100%)",
            }}
          >
            <div
              className="mb-1.5 text-[13px] font-semibold text-white/85"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
            >
              Lucro líquido
            </div>
            <div
              className="text-[32px] font-extrabold tracking-[-0.5px] text-white"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.35)" }}
            >
              {hasInputs ? currency(lucroLiquido) : "R$ 0,00"}
            </div>
            <div
              className="mt-1.5 text-[13px] font-bold text-white"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
            >
              Margem real: {hasInputs ? margemReal.toFixed(1) : "0,0"}%
            </div>
          </div>

          {hasInputs && precoSugerido !== null && margemReal < margemIdealNum && (
            <div
              className="flex items-start gap-3 rounded-2xl p-4"
              style={{ background: "rgba(242,201,76,0.14)", border: "1px solid rgba(242,201,76,0.35)" }}
            >
              <div className="flex-shrink-0 text-[#8A5710]">
                <Lightbulb size={18} />
              </div>
              <div>
                <div className="text-[13.5px] font-bold text-[#8A5710]">Sugestão</div>
                <div className="text-[12.5px] text-[#8A5710]/80">
                  Para {margemIdealNum}% de margem ideal, venda por{" "}
                  <strong>{currency(precoSugerido)}</strong>.
                </div>
              </div>
            </div>
          )}

          <div
            className="rounded-[20px] bg-white p-5"
            style={{ border: "1px solid rgba(15,23,42,0.09)" }}
          >
            <div className="mb-3 text-[13px] font-bold text-[#1D4ED8]">Detalhamento</div>
            <div className="flex flex-col gap-2 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Custo do produto</span>
                <span className="font-semibold text-[#101828]">{currency(custoNum)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Custos extras</span>
                <span className="font-semibold text-[#101828]">{currency(extrasNum)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Taxa do cartão ({taxaNum}%)</span>
                <span className="font-semibold text-[#101828]">
                  - {currency(taxaCartaoValor)}
                </span>
              </div>
              <div
                className="mt-1 flex items-center justify-between pt-2"
                style={{ borderTop: "1px solid rgba(15,23,42,0.08)" }}
              >
                <span className="font-bold text-[#101828]">Preço de venda</span>
                <span className="font-bold text-[#101828]">{currency(precoNum)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-8" />
    </>
  );
}

export default function CalculadoraPage() {
  return <CalculadoraContent />;
}

