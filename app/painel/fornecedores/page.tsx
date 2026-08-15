"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import AppShell from "@/components/brique-control/AppShell";
import PageHeader from "@/components/brique-control/PageHeader";
import FornecedorCard, { type Fornecedor } from "@/components/brique-control/FornecedorCard";
import FornecedorFormModal, {
  type FornecedorFormValues,
} from "@/components/brique-control/FornecedorFormModal";
import ConfirmDialog from "@/components/brique-control/ConfirmDialog";
import { createClient } from "@/lib/supabase/client";

const SELECT_FIELDS = "id, name, phone, category, notes";

function FornecedoresContent() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Fornecedor | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("fornecedores")
      .select(SELECT_FIELDS)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setFornecedores(data ?? []);
        setLoading(false);
      });
  }, []);

  const addFornecedor = async (values: FornecedorFormValues): Promise<boolean> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("fornecedores")
      .insert({ ...values, user_id: user.id })
      .select(SELECT_FIELDS)
      .single();

    if (error || !data) return false;
    setFornecedores((prev) => [data, ...prev]);
    return true;
  };

  const editFornecedor = async (values: FornecedorFormValues): Promise<boolean> => {
    if (!editingFornecedor) return false;
    const supabase = createClient();

    const { data, error } = await supabase
      .from("fornecedores")
      .update(values)
      .eq("id", editingFornecedor.id)
      .select(SELECT_FIELDS)
      .single();

    if (error || !data) return false;
    setFornecedores((prev) => prev.map((f) => (f.id === data.id ? data : f)));
    return true;
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("fornecedores").delete().eq("id", deleteTarget.id);
    setDeleting(false);
    if (error) return;
    setFornecedores((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const filtered = fornecedores.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Fornecedores" subtitle="Quem te abastece de produto pra revender." />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div
          className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-2.5"
          style={{ border: "1px solid rgba(15,23,42,0.12)", minWidth: 200 }}
        >
          <Search size={16} className="text-[#94A3B8]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar fornecedor..."
            className="w-full bg-transparent text-sm text-[#101828] outline-none placeholder:text-[#94A3B8]"
          />
        </div>
        <button
          onClick={() => {
            setEditingFornecedor(null);
            setFormOpen(true);
          }}
          className="flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-full border-none bg-[#3D7FFF] px-4 py-2.5 text-[13.5px] font-bold text-white"
        >
          <Plus size={16} />
          Novo Fornecedor
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="py-10 text-center text-sm text-[#64748B]">Carregando...</div>
        ) : filtered.length === 0 && fornecedores.length === 0 ? (
          <div
            className="rounded-2xl bg-white py-10 text-center"
            style={{ border: "1px dashed rgba(15,23,42,0.16)" }}
          >
            <p className="m-0 mb-1 text-sm font-bold text-[#101828]">
              Nenhum fornecedor cadastrado ainda
            </p>
            <p className="m-0 text-[13px] text-[#64748B]">
              Clique em &quot;Novo Fornecedor&quot; pra começar sua lista de contatos.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-[#64748B]">
            Nenhum fornecedor encontrado.
          </div>
        ) : (
          filtered.map((f) => (
            <FornecedorCard
              key={f.id}
              fornecedor={f}
              onEdit={() => {
                setEditingFornecedor(f);
                setFormOpen(true);
              }}
              onDelete={() => setDeleteTarget(f)}
            />
          ))
        )}
      </div>

      <div className="h-8" />

      <FornecedorFormModal
        open={formOpen}
        mode={editingFornecedor ? "edit" : "create"}
        initial={editingFornecedor}
        onClose={() => setFormOpen(false)}
        onSubmit={editingFornecedor ? editFornecedor : addFornecedor}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir fornecedor?"
        description={`Isso vai remover "${deleteTarget?.name}" permanentemente. Essa ação não pode ser desfeita.`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}

export default function FornecedoresPage() {
  return (
    <AppShell>
      <FornecedoresContent />
    </AppShell>
  );
}
