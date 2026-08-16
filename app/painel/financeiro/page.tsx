"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import PageHeader from "@/components/brique-control/PageHeader";
import FinanceListRow from "@/components/brique-control/FinanceListRow";
import BillRow, { type Bill } from "@/components/brique-control/BillRow";
import BillFormModal, { type BillFormValues } from "@/components/brique-control/BillFormModal";
import ConfirmDialog from "@/components/brique-control/ConfirmDialog";
import SpendingBreakdown, { type SpendingItem } from "@/components/brique-control/SpendingBreakdown";
import FinancePerformanceChart, {
  type FinancePerformancePoint,
} from "@/components/brique-control/FinancePerformanceChart";
import { createClient } from "@/lib/supabase/client";

const MONTH_LABELS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const MONTH_SHORT = [
  "jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez",
];

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const toLocalISODate = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const formatShortDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}`;
};

const addMonths = (year: number, month: number, delta: number) => {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
};

type RawSale = {
  id: string;
  product_name: string;
  value: number;
  profit: number;
  sale_date: string;
  payment_method: string;
  client_name: string | null;
  fiado_due_date: string | null;
  fiado_down_payment: number | null;
  fiado_received_at: string | null;
};

const SALES_SELECT =
  "id, product_name, value, profit, sale_date, payment_method, client_name, fiado_due_date, fiado_down_payment, fiado_received_at";
const BILLS_SELECT =
  "id, description, category, estimated_value, is_variable, is_recurring, due_date, notes, paid, paid_at";

function mapBill(b: {
  id: string;
  description: string;
  category: string;
  estimated_value: number | string;
  is_variable: boolean;
  is_recurring: boolean;
  due_date: string;
  notes: string | null;
  paid: boolean;
  paid_at: string | null;
}): Bill {
  return {
    id: b.id,
    description: b.description,
    category: b.category,
    estimated_value: Number(b.estimated_value),
    is_variable: b.is_variable,
    is_recurring: b.is_recurring,
    due_date: b.due_date,
    notes: b.notes,
    paid: b.paid,
    paid_at: b.paid_at,
  };
}

type Tab = "resumo" | "receber" | "pagar" | "contas";

function deltaLabel(current: number, previous: number) {
  if (previous === 0 && current === 0) return null;
  if (previous === 0) return { text: "Novo", positive: true };
  const pct = Math.round(((current - previous) / previous) * 100);
  return { text: `${pct >= 0 ? "+" : ""}${pct}% vs mês anterior`, positive: pct >= 0 };
}

function FinanceiroContent() {
  const today = new Date();
  const [sales, setSales] = useState<RawSale[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("resumo");
  const [resumoYear, setResumoYear] = useState(today.getFullYear());
  const [resumoMonth, setResumoMonth] = useState(today.getMonth());

  const [billFormOpen, setBillFormOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Bill | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    const supabase = createClient();
    const [{ data: saleData }, { data: billData }] = await Promise.all([
      supabase.from("sales").select(SALES_SELECT).order("sale_date", { ascending: false }),
      supabase.from("bills").select(BILLS_SELECT).order("due_date", { ascending: true }),
    ]);
    setSales(
      (saleData ?? []).map((s) => ({
        id: s.id,
        product_name: s.product_name,
        value: Number(s.value),
        profit: Number(s.profit),
        sale_date: s.sale_date,
        payment_method: s.payment_method,
        client_name: s.client_name,
        fiado_due_date: s.fiado_due_date,
        fiado_down_payment: s.fiado_down_payment !== null ? Number(s.fiado_down_payment) : null,
        fiado_received_at: s.fiado_received_at,
      }))
    );
    setBills((billData ?? []).map(mapBill));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const salesInMonth = (year: number, month: number) =>
    sales.filter((s) => {
      const d = new Date(`${s.sale_date}T00:00:00`);
      return d.getFullYear() === year && d.getMonth() === month;
    });

  const billsDueInMonth = (year: number, month: number) =>
    bills.filter((b) => {
      const d = new Date(`${b.due_date}T00:00:00`);
      return d.getFullYear() === year && d.getMonth() === month;
    });

  // Top KPIs — always the real current calendar month
  const curSales = useMemo(() => salesInMonth(today.getFullYear(), today.getMonth()), [sales]);
  const prev = addMonths(today.getFullYear(), today.getMonth(), -1);
  const prevSales = useMemo(() => salesInMonth(prev.year, prev.month), [sales]);
  const curBillsDue = useMemo(() => billsDueInMonth(today.getFullYear(), today.getMonth()), [bills]);
  const prevBillsDue = useMemo(() => billsDueInMonth(prev.year, prev.month), [bills]);

  const receitaDoMes = curSales.reduce((sum, s) => sum + s.value, 0);
  const receitaMesAnterior = prevSales.reduce((sum, s) => sum + s.value, 0);
  const despesasDoMes = curBillsDue.reduce((sum, b) => sum + b.estimated_value, 0);
  const despesasMesAnterior = prevBillsDue.reduce((sum, b) => sum + b.estimated_value, 0);

  const receitaDelta = deltaLabel(receitaDoMes, receitaMesAnterior);
  const despesasDelta = deltaLabel(despesasDoMes, despesasMesAnterior);

  // Resumo tab — browsable month
  const resumoSales = useMemo(() => salesInMonth(resumoYear, resumoMonth), [sales, resumoYear, resumoMonth]);
  const resumoBillsDue = useMemo(
    () => billsDueInMonth(resumoYear, resumoMonth),
    [bills, resumoYear, resumoMonth]
  );
  const quantoVendi = resumoSales.reduce((sum, s) => sum + s.value, 0);
  const gasteiComProdutos = resumoSales.reduce((sum, s) => sum + (s.value - s.profit), 0);
  const lucroNasVendas = resumoSales.reduce((sum, s) => sum + s.profit, 0);
  const contasDoMes = resumoBillsDue.reduce((sum, b) => sum + b.estimated_value, 0);
  const sobrou = lucroNasVendas - contasDoMes;

  const spendingItems: SpendingItem[] = useMemo(() => {
    const byCategory = new Map<string, number>();
    if (gasteiComProdutos > 0) byCategory.set("Produtos", gasteiComProdutos);
    resumoBillsDue.forEach((b) => {
      byCategory.set(b.category, (byCategory.get(b.category) ?? 0) + b.estimated_value);
    });
    return Array.from(byCategory.entries()).map(([label, value]) => ({ label, value }));
  }, [gasteiComProdutos, resumoBillsDue]);

  // A Receber — pending fiado balances
  const receivables = useMemo(
    () =>
      sales
        .filter((s) => s.payment_method === "Fiado" && !s.fiado_received_at)
        .map((s) => ({
          ...s,
          pending: Math.max(0, s.value - (s.fiado_down_payment ?? 0)),
        }))
        .filter((s) => s.pending > 0)
        .sort((a, b) => (a.fiado_due_date ?? "").localeCompare(b.fiado_due_date ?? "")),
    [sales]
  );
  const totalReceivable = receivables.reduce((sum, s) => sum + s.pending, 0);

  // A Pagar — unpaid bills
  const payables = useMemo(
    () => bills.filter((b) => !b.paid).sort((a, b) => a.due_date.localeCompare(b.due_date)),
    [bills]
  );
  const totalPayable = payables.reduce((sum, b) => sum + b.estimated_value, 0);

  // Performance chart — last 12 months
  const chartData: FinancePerformancePoint[] = useMemo(() => {
    const points: FinancePerformancePoint[] = [];
    for (let i = 11; i >= 0; i--) {
      const { year, month } = addMonths(today.getFullYear(), today.getMonth(), -i);
      const recebido = salesInMonth(year, month).reduce((sum, s) => sum + s.profit, 0);
      const aReceber = sales
        .filter((s) => {
          if (s.payment_method !== "Fiado" || s.fiado_received_at || !s.fiado_due_date) return false;
          const d = new Date(`${s.fiado_due_date}T00:00:00`);
          return d.getFullYear() === year && d.getMonth() === month;
        })
        .reduce((sum, s) => sum + Math.max(0, s.value - (s.fiado_down_payment ?? 0)), 0);
      const contasAPagar = billsDueInMonth(year, month)
        .filter((b) => !b.paid)
        .reduce((sum, b) => sum + b.estimated_value, 0);
      points.push({ label: `${MONTH_SHORT[month]}/${String(year).slice(2)}`, recebido, aReceber, contasAPagar });
    }
    return points;
  }, [sales, bills]);

  const addBill = async (values: BillFormValues): Promise<boolean> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    const { data, error } = await supabase
      .from("bills")
      .insert({ ...values, user_id: user.id })
      .select(BILLS_SELECT)
      .single();
    if (error || !data) return false;
    setBills((prev) => [...prev, mapBill(data)].sort((a, b) => a.due_date.localeCompare(b.due_date)));
    return true;
  };

  const editBill = async (values: BillFormValues): Promise<boolean> => {
    if (!editingBill) return false;
    const supabase = createClient();
    const { data, error } = await supabase
      .from("bills")
      .update(values)
      .eq("id", editingBill.id)
      .select(BILLS_SELECT)
      .single();
    if (error || !data) return false;
    const updated = mapBill(data);
    setBills((prev) =>
      prev.map((b) => (b.id === updated.id ? updated : b)).sort((a, b) => a.due_date.localeCompare(b.due_date))
    );
    return true;
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("bills").delete().eq("id", deleteTarget.id);
    setDeleting(false);
    if (error) return;
    setBills((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const markBillPaid = async (bill: Bill) => {
    setBusyId(bill.id);
    const supabase = createClient();
    const paidAt = toLocalISODate(new Date());
    const { error } = await supabase
      .from("bills")
      .update({ paid: true, paid_at: paidAt })
      .eq("id", bill.id);
    if (!error) {
      setBills((prev) => prev.map((b) => (b.id === bill.id ? { ...b, paid: true, paid_at: paidAt } : b)));

      if (bill.is_recurring) {
        const [y, m, d] = bill.due_date.split("-").map(Number);
        const next = new Date(y, m - 1 + 1, d);
        const nextDue = toLocalISODate(next);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("bills")
            .insert({
              user_id: user.id,
              description: bill.description,
              category: bill.category,
              estimated_value: bill.estimated_value,
              is_variable: bill.is_variable,
              is_recurring: true,
              due_date: nextDue,
              notes: bill.notes,
            })
            .select(BILLS_SELECT)
            .single();
          if (data) {
            setBills((prev) => [...prev, mapBill(data)].sort((a, b) => a.due_date.localeCompare(b.due_date)));
          }
        }
      }
    }
    setBusyId(null);
  };

  const markReceived = async (saleId: string) => {
    setBusyId(saleId);
    const supabase = createClient();
    const receivedAt = toLocalISODate(new Date());
    const { error } = await supabase
      .from("sales")
      .update({ fiado_received_at: receivedAt })
      .eq("id", saleId);
    if (!error) {
      setSales((prev) =>
        prev.map((s) => (s.id === saleId ? { ...s, fiado_received_at: receivedAt } : s))
      );
    }
    setBusyId(null);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "resumo", label: "Resumo" },
    { key: "receber", label: "A Receber" },
    { key: "pagar", label: "A Pagar" },
    { key: "contas", label: "Contas" },
  ];

  return (
    <>
      <PageHeader
        title="Financeiro"
        subtitle={`${MONTH_LABELS[today.getMonth()]}/${today.getFullYear()}`}
      />

      <div className="mb-5 flex justify-end">
        <button
          onClick={() => {
            setEditingBill(null);
            setBillFormOpen(true);
          }}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border-none bg-[#3D7FFF] px-4 py-2.5 text-[13.5px] font-bold text-white"
        >
          <Plus size={16} />
          Nova conta
        </button>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-[20px] bg-white p-[18px]" style={{ border: "1px solid rgba(15,23,42,0.09)" }}>
          <div className="mb-2 text-[12.5px] font-semibold text-[#64748B]">Receita do mês</div>
          <div className="text-[20px] font-extrabold tracking-[-0.3px] text-[#101828]">
            {currency(receitaDoMes)}
          </div>
          {receitaDelta && (
            <div
              className={`mt-1.5 flex items-center gap-1 text-xs font-semibold ${
                receitaDelta.positive ? "text-[#1B7A4A]" : "text-[#B91C1C]"
              }`}
            >
              {receitaDelta.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {receitaDelta.text}
            </div>
          )}
        </div>
        <div className="rounded-[20px] bg-white p-[18px]" style={{ border: "1px solid rgba(15,23,42,0.09)" }}>
          <div className="mb-2 text-[12.5px] font-semibold text-[#64748B]">Despesas do mês</div>
          <div className="text-[20px] font-extrabold tracking-[-0.3px] text-[#101828]">
            {currency(despesasDoMes)}
          </div>
          {despesasDelta && (
            <div
              className={`mt-1.5 flex items-center gap-1 text-xs font-semibold ${
                despesasDelta.positive ? "text-[#B91C1C]" : "text-[#1B7A4A]"
              }`}
            >
              {despesasDelta.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {despesasDelta.text}
            </div>
          )}
        </div>
      </div>

      <div className="mb-5 flex gap-1 overflow-x-auto rounded-full bg-[#F1F4F9] p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 cursor-pointer whitespace-nowrap rounded-full px-3 py-2 text-[12.5px] font-bold ${
              tab === t.key ? "bg-white text-[#1D4ED8] shadow-sm" : "bg-transparent text-[#64748B]"
            }`}
            style={{ border: "none" }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm text-[#64748B]">Carregando...</div>
      ) : (
        <>
          {tab === "resumo" && (
            <>
              <div
                className="mb-5 rounded-2xl bg-white p-4"
                style={{ border: "1px solid rgba(15,23,42,0.09)" }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <button
                    onClick={() => {
                      const p = addMonths(resumoYear, resumoMonth, -1);
                      setResumoYear(p.year);
                      setResumoMonth(p.month);
                    }}
                    className="flex cursor-pointer items-center justify-center rounded-full border-none bg-[#F5F7FA] p-1.5 text-[#5B6472]"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="text-sm font-bold text-[#101828]">
                    {MONTH_LABELS[resumoMonth]} de {resumoYear}
                  </div>
                  <button
                    onClick={() => {
                      const n = addMonths(resumoYear, resumoMonth, 1);
                      setResumoYear(n.year);
                      setResumoMonth(n.month);
                    }}
                    className="flex cursor-pointer items-center justify-center rounded-full border-none bg-[#F5F7FA] p-1.5 text-[#5B6472]"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <p className="m-0 mb-4 text-[12.5px] text-[#94A3B8]">
                  Considera as vendas feitas no mês, não o que já foi recebido.
                </p>

                <div className="flex flex-col gap-2.5 text-[13.5px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Quanto vendi</span>
                    <span className="font-bold text-[#101828]">{currency(quantoVendi)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Gastei com os produtos</span>
                    <span className="font-bold text-[#E05B5B]">− {currency(gasteiComProdutos)}</span>
                  </div>
                  <div
                    className="flex items-center justify-between pt-2"
                    style={{ borderTop: "1px solid rgba(15,23,42,0.08)" }}
                  >
                    <span className="font-bold text-[#101828]">Lucro nas vendas</span>
                    <span className="font-extrabold text-[#101828]">{currency(lucroNasVendas)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Contas do mês</span>
                    <span className="font-bold text-[#E05B5B]">{currency(contasDoMes)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(15,23,42,0.08)" }}>
                  <div className="mb-1 text-[13px] text-[#64748B]">Sobrou</div>
                  <div
                    className={`text-[28px] font-extrabold ${sobrou >= 0 ? "text-[#1B7A4A]" : "text-[#B91C1C]"}`}
                  >
                    {currency(sobrou)}
                  </div>
                </div>

                {bills.length === 0 && (
                  <div className="mt-4 rounded-xl bg-[#F5F7FA] p-3.5 text-[12.5px] leading-snug text-[#64748B]">
                    Você ainda não cadastrou contas fixas. Toque em{" "}
                    <span className="font-bold text-[#101828]">Nova conta</span> e cadastre aluguel,
                    luz e internet para ver quanto sobra de verdade no fim do mês.
                  </div>
                )}
              </div>

              <SpendingBreakdown items={spendingItems} />
            </>
          )}

          {tab === "receber" && (
            <div className="flex flex-col gap-3">
              <div className="mb-1 flex items-center justify-between px-1">
                <span className="text-[11px] font-bold tracking-[0.06em] text-[#8A93A3] uppercase">
                  Pendente total
                </span>
                <span className="text-sm font-extrabold text-[#1A4FBF]">
                  {currency(totalReceivable)}
                </span>
              </div>
              {receivables.length === 0 ? (
                <div
                  className="rounded-2xl bg-white py-10 text-center"
                  style={{ border: "1px dashed rgba(15,23,42,0.16)" }}
                >
                  <p className="m-0 text-[13px] text-[#64748B]">
                    Nenhuma venda fiado pendente de recebimento.
                  </p>
                </div>
              ) : (
                receivables.map((s) => (
                  <FinanceListRow
                    key={s.id}
                    title={s.product_name}
                    subtitle={[s.client_name, s.fiado_due_date ? `Vence ${formatShortDate(s.fiado_due_date)}` : null]
                      .filter(Boolean)
                      .join(" · ")}
                    value={s.pending}
                    status="A receber"
                    tone="pending"
                    actionLabel={busyId === s.id ? "Salvando..." : "Marcar como recebido"}
                    onAction={() => markReceived(s.id)}
                  />
                ))
              )}
            </div>
          )}

          {tab === "pagar" && (
            <div className="flex flex-col gap-3">
              <div className="mb-1 flex items-center justify-between px-1">
                <span className="text-[11px] font-bold tracking-[0.06em] text-[#8A93A3] uppercase">
                  Total em aberto
                </span>
                <span className="text-sm font-extrabold text-[#B91C1C]">{currency(totalPayable)}</span>
              </div>
              {payables.length === 0 ? (
                <div
                  className="rounded-2xl bg-white py-10 text-center"
                  style={{ border: "1px dashed rgba(15,23,42,0.16)" }}
                >
                  <p className="m-0 text-[13px] text-[#64748B]">Nenhuma conta em aberto.</p>
                </div>
              ) : (
                payables.map((b) => (
                  <FinanceListRow
                    key={b.id}
                    title={b.description}
                    subtitle={`${b.category} · Vence ${formatShortDate(b.due_date)}`}
                    value={b.estimated_value}
                    status="Em aberto"
                    tone="warning"
                    actionLabel={busyId === b.id ? "Salvando..." : "Marcar como pago"}
                    onAction={() => markBillPaid(b)}
                  />
                ))
              )}
            </div>
          )}

          {tab === "contas" && (
            <div className="flex flex-col gap-3">
              {bills.length === 0 ? (
                <div
                  className="rounded-2xl bg-white py-10 text-center"
                  style={{ border: "1px dashed rgba(15,23,42,0.16)" }}
                >
                  <p className="m-0 mb-1 text-sm font-bold text-[#101828]">
                    Nenhuma conta cadastrada ainda
                  </p>
                  <p className="m-0 text-[13px] text-[#64748B]">
                    Clique em &quot;Nova conta&quot; para cadastrar aluguel, luz, internet e outras
                    despesas fixas.
                  </p>
                </div>
              ) : (
                bills.map((b) => (
                  <BillRow
                    key={b.id}
                    bill={b}
                    onMarkPaid={!b.paid ? () => markBillPaid(b) : undefined}
                    onEdit={() => {
                      setEditingBill(b);
                      setBillFormOpen(true);
                    }}
                    onDelete={() => setDeleteTarget(b)}
                  />
                ))
              )}
            </div>
          )}

          <FinancePerformanceChart data={chartData} />
        </>
      )}

      <div className="h-8" />

      <BillFormModal
        open={billFormOpen}
        mode={editingBill ? "edit" : "create"}
        initial={editingBill}
        onClose={() => setBillFormOpen(false)}
        onSubmit={editingBill ? editBill : addBill}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir conta?"
        description={`Isso vai remover "${deleteTarget?.description}" permanentemente. Essa ação não pode ser desfeita.`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}

export default function FinanceiroPage() {
  return <FinanceiroContent />;
}

