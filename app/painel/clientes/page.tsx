"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import PageHeader from "@/components/brique-control/PageHeader";
import ClienteCard, { type Cliente } from "@/components/brique-control/ClienteCard";
import ClienteFormModal, { type ClienteFormValues } from "@/components/brique-control/ClienteFormModal";
import ClienteHistoryModal from "@/components/brique-control/ClienteHistoryModal";
import ConfirmDialog from "@/components/brique-control/ConfirmDialog";
import { createClient } from "@/lib/supabase/client";

const SELECT_FIELDS = "id, name, phone, email, notes";

function ClientesContent() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [historyTarget, setHistoryTarget] = useState<Cliente | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Cliente | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("clientes")
      .select(SELECT_FIELDS)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setClientes(data ?? []);
        setLoading(false);
      });
  }, []);

  const addCliente = async (values: ClienteFormValues): Promise<boolean> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("clientes")
      .insert({ ...values, user_id: user.id })
      .select(SELECT_FIELDS)
      .single();

    if (error || !data) return false;
    setClientes((prev) => [data, ...prev]);
    return true;
  };

  const editCliente = async (values: ClienteFormValues): Promise<boolean> => {
    if (!editingCliente) return false;
    const supabase = createClient();

    const { data, error } = await supabase
      .from("clientes")
      .update(values)
      .eq("id", editingCliente.id)
      .select(SELECT_FIELDS)
      .single();

    if (error || !data) return false;
    setClientes((prev) => prev.map((c) => (c.id === data.id ? data : c)));
    return true;
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("clientes").delete().eq("id", deleteTarget.id);
    setDeleting(false);
    if (error) return;
    setClientes((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const filtered = clientes.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Clientes" subtitle="Quem já comprou (ou vai comprar) com você." />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div
          className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-2.5"
          style={{ border: "1px solid rgba(15,23,42,0.12)", minWidth: 200 }}
        >
          <Search size={16} className="text-[#94A3B8]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar cliente..."
            className="w-full bg-transparent text-sm text-[#101828] outline-none placeholder:text-[#94A3B8]"
          />
        </div>
        <button
          onClick={() => {
            setEditingCliente(null);
            setFormOpen(true);
          }}
          className="flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-full border-none bg-[#3D7FFF] px-4 py-2.5 text-[13.5px] font-bold text-white"
        >
          <Plus size={16} />
          Novo Cliente
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="py-10 text-center text-sm text-[#64748B]">Carregando...</div>
        ) : filtered.length === 0 && clientes.length === 0 ? (
          <div
            className="rounded-2xl bg-white py-10 text-center"
            style={{ border: "1px dashed rgba(15,23,42,0.16)" }}
          >
            <p className="m-0 mb-1 text-sm font-bold text-[#101828]">
              Nenhum cliente cadastrado ainda
            </p>
            <p className="m-0 text-[13px] text-[#64748B]">
              Clique em &quot;Novo Cliente&quot; para começar a montar sua lista de contatos.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-[#64748B]">
            Nenhum cliente encontrado.
          </div>
        ) : (
          filtered.map((c) => (
            <ClienteCard
              key={c.id}
              cliente={c}
              onHistory={() => setHistoryTarget(c)}
              onEdit={() => {
                setEditingCliente(c);
                setFormOpen(true);
              }}
              onDelete={() => setDeleteTarget(c)}
            />
          ))
        )}
      </div>

      <div className="h-8" />

      <ClienteFormModal
        open={formOpen}
        mode={editingCliente ? "edit" : "create"}
        initial={editingCliente}
        onClose={() => setFormOpen(false)}
        onSubmit={editingCliente ? editCliente : addCliente}
      />

      <ClienteHistoryModal
        open={!!historyTarget}
        cliente={historyTarget}
        onClose={() => setHistoryTarget(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir cliente?"
        description={`Isso vai remover "${deleteTarget?.name}" permanentemente. Essa ação não pode ser desfeita.`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}

export default function ClientesPage() {
  return <ClientesContent />;
}

