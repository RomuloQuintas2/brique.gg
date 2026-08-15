"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import AppShell from "@/components/brique-control/AppShell";
import PageHeader from "@/components/brique-control/PageHeader";
import OSRow, { type ServiceOrder, type OSStatus } from "@/components/brique-control/OSRow";
import OSFormModal, { type OSFormValues } from "@/components/brique-control/OSFormModal";
import ConfirmDialog from "@/components/brique-control/ConfirmDialog";
import { createClient } from "@/lib/supabase/client";

const SELECT_FIELDS =
  "id, client_name, device, defect_description, estimated_value, status, notes, created_at";

function OSContent() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingOS, setEditingOS] = useState<ServiceOrder | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServiceOrder | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("service_orders")
      .select(SELECT_FIELDS)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? []);
        setLoading(false);
      });
  }, []);

  const addOS = async (values: OSFormValues): Promise<boolean> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("service_orders")
      .insert({ ...values, user_id: user.id })
      .select(SELECT_FIELDS)
      .single();

    if (error || !data) return false;
    setOrders((prev) => [data, ...prev]);
    return true;
  };

  const editOS = async (values: OSFormValues): Promise<boolean> => {
    if (!editingOS) return false;
    const supabase = createClient();

    const { data, error } = await supabase
      .from("service_orders")
      .update(values)
      .eq("id", editingOS.id)
      .select(SELECT_FIELDS)
      .single();

    if (error || !data) return false;
    setOrders((prev) => prev.map((o) => (o.id === data.id ? data : o)));
    return true;
  };

  const changeStatus = async (os: ServiceOrder, status: OSStatus) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("service_orders")
      .update({ status })
      .eq("id", os.id);
    if (error) return;
    setOrders((prev) => prev.map((o) => (o.id === os.id ? { ...o, status } : o)));
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("service_orders").delete().eq("id", deleteTarget.id);
    setDeleting(false);
    if (error) return;
    setOrders((prev) => prev.filter((o) => o.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const filtered = orders.filter(
    (o) =>
      o.client_name.toLowerCase().includes(query.toLowerCase()) ||
      o.device.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Ordens de Serviço" subtitle="Conserto e assistência técnica dos seus clientes." />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div
          className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-2.5"
          style={{ border: "1px solid rgba(15,23,42,0.12)", minWidth: 200 }}
        >
          <Search size={16} className="text-[#94A3B8]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por cliente ou aparelho..."
            className="w-full bg-transparent text-sm text-[#101828] outline-none placeholder:text-[#94A3B8]"
          />
        </div>
        <button
          onClick={() => {
            setEditingOS(null);
            setFormOpen(true);
          }}
          className="flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-full border-none bg-[#3D7FFF] px-4 py-2.5 text-[13.5px] font-bold text-white"
        >
          <Plus size={16} />
          Nova OS
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="py-10 text-center text-sm text-[#64748B]">Carregando...</div>
        ) : filtered.length === 0 && orders.length === 0 ? (
          <div
            className="rounded-2xl bg-white py-10 text-center"
            style={{ border: "1px dashed rgba(15,23,42,0.16)" }}
          >
            <p className="m-0 mb-1 text-sm font-bold text-[#101828]">
              Nenhuma OS aberta ainda
            </p>
            <p className="m-0 text-[13px] text-[#64748B]">
              Clique em &quot;Nova OS&quot; pra abrir sua primeira ordem de serviço.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-[#64748B]">
            Nenhuma OS encontrada.
          </div>
        ) : (
          filtered.map((o) => (
            <OSRow
              key={o.id}
              os={o}
              onStatusChange={(status) => changeStatus(o, status)}
              onEdit={() => {
                setEditingOS(o);
                setFormOpen(true);
              }}
              onDelete={() => setDeleteTarget(o)}
            />
          ))
        )}
      </div>

      <div className="h-8" />

      <OSFormModal
        open={formOpen}
        mode={editingOS ? "edit" : "create"}
        initial={editingOS}
        onClose={() => setFormOpen(false)}
        onSubmit={editingOS ? editOS : addOS}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir OS?"
        description={`Isso vai remover a OS de "${deleteTarget?.device}" permanentemente. Essa ação não pode ser desfeita.`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}

export default function OSPage() {
  return (
    <AppShell>
      <OSContent />
    </AppShell>
  );
}
