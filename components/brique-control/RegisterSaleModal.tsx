"use client";

import { useEffect, useState } from "react";
import { X, Repeat } from "lucide-react";
import type { Sale } from "./SaleRow";
import type { PaymentMethod } from "./PaymentBadge";
import ExtraCostsField, { type ExtraCostDraft } from "./ExtraCostsField";
import { SALE_PLATFORMS } from "./salePlatforms";

const METHODS: PaymentMethod[] = ["Pix", "Dinheiro", "Cartão", "Fiado"];

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const toLocalISODate = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function RegisterSaleModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (sale: Omit<Sale, "id">) => Promise<boolean>;
}) {
  const [product, setProduct] = useState("");
  const [value, setValue] = useState("");
  const [cost, setCost] = useState("");
  const [saleDate, setSaleDate] = useState(toLocalISODate(new Date()));
  const [platform, setPlatform] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("Pix");
  const [clientName, setClientName] = useState("");
  const [fiadoDueDate, setFiadoDueDate] = useState("");
  const [fiadoDownPayment, setFiadoDownPayment] = useState("");
  const [tradeInEnabled, setTradeInEnabled] = useState(false);
  const [tradeInDescription, setTradeInDescription] = useState("");
  const [tradeInValue, setTradeInValue] = useState("");
  const [extraCosts, setExtraCosts] = useState<ExtraCostDraft[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setProduct("");
    setValue("");
    setCost("");
    setSaleDate(toLocalISODate(new Date()));
    setPlatform("");
    setMethod("Pix");
    setClientName("");
    setFiadoDueDate("");
    setFiadoDownPayment("");
    setTradeInEnabled(false);
    setTradeInDescription("");
    setTradeInValue("");
    setExtraCosts([]);
    setError(null);
  }, [open]);

  if (!open) return null;

  const valueNum = Number(value) || 0;
  const baseCost = Number(cost) || 0;
  const extraCostsNum = extraCosts.map((e) => ({ label: e.label.trim(), value: Number(e.value) || 0 }));
  const extraTotal = extraCostsNum.reduce((sum, e) => sum + e.value, 0);
  const totalCostAll = baseCost + extraTotal;
  const profit = valueNum - totalCostAll;
  const margin = valueNum > 0 ? Math.round((profit / valueNum) * 100) : 0;
  const tradeInValueNum = tradeInEnabled ? Number(tradeInValue) || 0 : 0;
  const fiadoDownPaymentNum = method === "Fiado" ? Number(fiadoDownPayment) || 0 : 0;
  const cashNow = (method === "Fiado" ? fiadoDownPaymentNum : valueNum) - tradeInValueNum;

  const canSave = product.trim().length > 0 && valueNum > 0;

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    const ok = await onAdd({
      product_name: product.trim(),
      value: valueNum,
      profit,
      payment_method: method,
      sale_date: saleDate,
      platform: platform || null,
      client_name: clientName.trim() || null,
      trade_in_description: tradeInEnabled ? tradeInDescription.trim() || null : null,
      trade_in_value: tradeInEnabled ? tradeInValueNum : null,
      extra_costs: extraCostsNum.filter((e) => e.label.length > 0 || e.value > 0),
      fiado_due_date: method === "Fiado" ? fiadoDueDate || null : null,
      fiado_down_payment: method === "Fiado" ? fiadoDownPaymentNum : null,
    });
    setSaving(false);
    if (!ok) {
      setError("Não foi possível registrar a venda. Tente novamente.");
      return;
    }
    onClose();
  };

  const fieldClass = "rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]";
  const fieldStyle = { border: "1px solid rgba(15,23,42,0.15)" };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/55 p-4 py-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] rounded-[20px] bg-white p-6"
      >
        <div className="mb-4 flex items-start justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer border-none bg-none p-1 text-[#64748B]"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="m-0 mb-4 text-lg font-extrabold text-[#1D4ED8]">Registrar Venda</h2>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Produto vendido</label>
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Nome do produto"
              className={fieldClass}
              style={fieldStyle}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex w-1/2 flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#101828]">Valor da venda</label>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type="number"
                placeholder="R$"
                className={fieldClass}
                style={fieldStyle}
              />
            </div>
            <div className="flex w-1/2 flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#101828]">Data da venda</label>
              <input
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                type="date"
                className={fieldClass}
                style={fieldStyle}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Custo</label>
            <input
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              type="number"
              placeholder="R$"
              className={fieldClass}
              style={fieldStyle}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Plataforma de venda</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className={fieldClass}
              style={fieldStyle}
            >
              <option value="">Selecione uma opção</option>
              {SALE_PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Forma de pagamento</label>
            <div className="flex flex-wrap gap-1.5">
              {METHODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`cursor-pointer rounded-full px-3 py-1.5 text-[12.5px] font-bold ${
                    method === m ? "bg-[#3D7FFF] text-white" : "bg-[#F5F7FA] text-[#5B6472]"
                  }`}
                  style={{
                    border: `1px solid ${method === m ? "#3D7FFF" : "rgba(15,23,42,0.12)"}`,
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
            {method === "Fiado" && (
              <div className="mt-2 flex gap-2">
                <div className="flex w-1/2 flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[#101828]">
                    Data de vencimento
                  </label>
                  <input
                    value={fiadoDueDate}
                    onChange={(e) => setFiadoDueDate(e.target.value)}
                    type="date"
                    className={fieldClass}
                    style={fieldStyle}
                  />
                </div>
                <div className="flex w-1/2 flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[#101828]">
                    Valor de entrada (opcional)
                  </label>
                  <input
                    value={fiadoDownPayment}
                    onChange={(e) => setFiadoDownPayment(e.target.value)}
                    type="number"
                    placeholder="R$"
                    className={fieldClass}
                    style={fieldStyle}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Cliente (opcional)</label>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nome do cliente"
              className={fieldClass}
              style={fieldStyle}
            />
          </div>

          <div className="rounded-2xl p-3.5" style={{ background: "#F5F7FA" }}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Repeat size={16} className="text-[#3D7FFF]" />
                <span className="text-[13px] font-semibold text-[#101828]">
                  Recebi um produto na venda
                </span>
              </div>
              <button
                type="button"
                onClick={() => setTradeInEnabled((v) => !v)}
                className={`relative h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-none transition-colors ${
                  tradeInEnabled ? "bg-[#3D7FFF]" : "bg-[rgba(15,23,42,0.18)]"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                    tradeInEnabled ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
            {tradeInEnabled && (
              <div className="mt-3 flex gap-2">
                <input
                  value={tradeInDescription}
                  onChange={(e) => setTradeInDescription(e.target.value)}
                  placeholder="Ex: iPhone 8"
                  className={`flex-1 ${fieldClass}`}
                  style={{ ...fieldStyle, background: "#FFFFFF" }}
                />
                <input
                  value={tradeInValue}
                  onChange={(e) => setTradeInValue(e.target.value)}
                  type="number"
                  placeholder="Valor avaliado"
                  className={`w-32 flex-shrink-0 ${fieldClass}`}
                  style={{ ...fieldStyle, background: "#FFFFFF" }}
                />
              </div>
            )}
          </div>

          <ExtraCostsField
            items={extraCosts}
            onChange={setExtraCosts}
            label="Custos pontuais desta venda (opcional)"
          />

          <div className="rounded-2xl p-4" style={{ background: "#F5F7FA" }}>
            <div className="mb-2 text-[13px] font-bold text-[#1D4ED8]">Pré-visualização</div>
            <div className="flex flex-col gap-1.5 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Receita bruta</span>
                <span className="font-semibold text-[#101828]">{currency(valueNum)}</span>
              </div>
              {tradeInEnabled && tradeInValueNum > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">
                    Permuta {tradeInDescription ? `(${tradeInDescription})` : ""}
                  </span>
                  <span className="font-semibold text-[#3D7FFF]">
                    − {currency(tradeInValueNum)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Custo total</span>
                <span className="font-semibold text-[#E05B5B]">− {currency(totalCostAll)}</span>
              </div>
              <div
                className="flex items-center justify-between pt-1.5"
                style={{ borderTop: "1px solid rgba(15,23,42,0.08)" }}
              >
                <span className="font-bold text-[#101828]">Lucro estimado</span>
                <span
                  className={`font-extrabold ${profit >= 0 ? "text-[#3FBE7A]" : "text-[#E05B5B]"}`}
                >
                  {currency(profit)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Margem</span>
                <span className="font-semibold text-[#101828]">{margin}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">
                  {method === "Fiado" ? "Entrada em caixa agora" : "Entrou em caixa agora"}
                </span>
                <span className="font-semibold text-[#101828]">{currency(cashNow)}</span>
              </div>
              {method === "Fiado" && (
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Restante a receber</span>
                  <span className="font-semibold text-[#8A5710]">
                    {currency(Math.max(0, valueNum - fiadoDownPaymentNum))}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && <p className="mt-3 mb-0 text-[13px] text-[#B91C1C]">{error}</p>}

        <button
          onClick={save}
          disabled={!canSave || saving}
          className="mt-5 w-full cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Salvando..." : "Registrar Venda"}
        </button>
      </div>
    </div>
  );
}
