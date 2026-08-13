"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import AppShell from "@/components/brique-control/AppShell";
import PageHeader from "@/components/brique-control/PageHeader";
import ProductCard, { type Product } from "@/components/brique-control/ProductCard";
import NewProductModal from "@/components/brique-control/NewProductModal";
import { createClient } from "@/lib/supabase/client";

function ProdutosContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("id, icon, name, cost, price, stock")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProducts(
          (data ?? []).map((p) => ({
            id: p.id,
            icon: p.icon,
            name: p.name,
            cost: Number(p.cost),
            price: Number(p.price),
            stock: p.stock,
          }))
        );
        setLoading(false);
      });
  }, []);

  const addProduct = async (product: Omit<Product, "id">): Promise<boolean> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("products")
      .insert({ ...product, user_id: user.id })
      .select("id, icon, name, cost, price, stock")
      .single();

    if (error || !data) return false;

    setProducts((prev) => [
      { ...data, cost: Number(data.cost), price: Number(data.price) },
      ...prev,
    ]);
    return true;
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Produtos" subtitle="Gerencie o que você tem à venda." />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div
          className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-2.5"
          style={{ border: "1px solid rgba(15,23,42,0.12)", minWidth: 200 }}
        >
          <Search size={16} className="text-[#94A3B8]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar produto..."
            className="w-full bg-transparent text-sm text-[#101828] outline-none placeholder:text-[#94A3B8]"
          />
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-full border-none bg-[#3D7FFF] px-4 py-2.5 text-[13.5px] font-bold text-white"
        >
          <Plus size={16} />
          Novo Produto
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="py-10 text-center text-sm text-[#64748B]">Carregando...</div>
        ) : filtered.length === 0 && products.length === 0 ? (
          <div
            className="rounded-2xl bg-white py-10 text-center"
            style={{ border: "1px dashed rgba(15,23,42,0.16)" }}
          >
            <p className="m-0 mb-1 text-sm font-bold text-[#101828]">
              Nenhum produto cadastrado ainda
            </p>
            <p className="m-0 text-[13px] text-[#64748B]">
              Clique em &quot;Novo Produto&quot; para cadastrar o primeiro item do seu estoque.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-[#64748B]">
            Nenhum produto encontrado.
          </div>
        ) : (
          filtered.map((p) => <ProductCard key={p.id} product={p} />)
        )}
      </div>

      <div className="h-8" />

      <NewProductModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={addProduct} />
    </>
  );
}

export default function ProdutosPage() {
  return (
    <AppShell>
      <ProdutosContent />
    </AppShell>
  );
}
