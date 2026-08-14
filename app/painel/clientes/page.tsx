"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import AppShell from "@/components/brique-control/AppShell";
import PageHeader from "@/components/brique-control/PageHeader";
import ClienteCard, { type Cliente } from "@/components/brique-control/ClienteCard";
import NewClienteModal from "@/components/brique-control/NewClienteModal";
import { createClient } from "@/lib/supabase/client";

function ClientesContent() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("clientes")
      .select("id, name, phone, email, notes")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setClientes(data ?? []);
        setLoading(false);
      });
  }, []);

  const addCliente = async (cliente: Omit<Cliente, "id">): Promise<boolean> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("clientes")
      .insert({ ...cliente, user_id: user.id })
      .select("id, name, phone, email, notes")
      .single();

    if (error || !data) return false;

    setClientes((prev) => [data, ...prev]);
    return true;
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
          onClick={() => setModalOpen(true)}
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
          filtered.map((c) => <ClienteCard key={c.id} cliente={c} />)
        )}
      </div>

      <div className="h-8" />

      <NewClienteModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={addCliente} />
    </>
  );
}

export default function ClientesPage() {
  return (
    <AppShell>
      <ClientesContent />
    </AppShell>
  );
}
