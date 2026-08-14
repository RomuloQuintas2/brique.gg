"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import AppShell from "@/components/brique-control/AppShell";
import PageHeader from "@/components/brique-control/PageHeader";
import ProductCard, { type Product } from "@/components/brique-control/ProductCard";
import ProductFormModal, { type ProductFormValues } from "@/components/brique-control/ProductFormModal";
import SellProductModal from "@/components/brique-control/SellProductModal";
import ConfirmDialog from "@/components/brique-control/ConfirmDialog";
import { createClient } from "@/lib/supabase/client";
import type { PaymentMethod } from "@/components/brique-control/PaymentBadge";

const SELECT_FIELDS = "id, icon, name, cost, price, stock, acquisition_date, extra_costs";

function mapRow(p: {
  id: string;
  icon: string;
  name: string;
  cost: number | string;
  price: number | string;
  stock: number;
  acquisition_date: string | null;
  extra_costs: { label: string; value: number }[] | null;
}): Product {
  return {
    id: p.id,
    icon: p.icon || "📦",
    name: p.name,
    cost: Number(p.cost),
    price: Number(p.price),
    stock: p.stock,
    acquisition_date: p.acquisition_date,
    extra_costs: p.extra_costs ?? [],
  };
}

function ProdutosContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sellTarget, setSellTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select(SELECT_FIELDS)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProducts((data ?? []).map(mapRow));
        setLoading(false);
      });
  }, []);

  const addProduct = async (values: ProductFormValues): Promise<boolean> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("products")
      .insert({ ...values, user_id: user.id })
      .select(SELECT_FIELDS)
      .single();

    if (error || !data) return false;
    setProducts((prev) => [mapRow(data), ...prev]);
    return true;
  };

  const editProduct = async (values: ProductFormValues): Promise<boolean> => {
    if (!editingProduct) return false;
    const supabase = createClient();

    const { data, error } = await supabase
      .from("products")
      .update(values)
      .eq("id", editingProduct.id)
      .select(SELECT_FIELDS)
      .single();

    if (error || !data) return false;
    const updated = mapRow(data);
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    return true;
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", deleteTarget.id);
    setDeleting(false);
    if (error) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const sellProduct = async (value: number, method: PaymentMethod): Promise<boolean> => {
    if (!sellTarget) return false;
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const cost = sellTarget.cost + sellTarget.extra_costs.reduce((s, e) => s + e.value, 0);

    const { error: saleError } = await supabase.from("sales").insert({
      user_id: user.id,
      product_name: sellTarget.name,
      value,
      profit: value - cost,
      payment_method: method,
    });
    if (saleError) return false;

    const newStock = Math.max(0, sellTarget.stock - 1);
    const { error: stockError } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", sellTarget.id);
    if (stockError) return false;

    setProducts((prev) =>
      prev.map((p) => (p.id === sellTarget.id ? { ...p, stock: newStock } : p))
    );
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
          onClick={() => {
            setEditingProduct(null);
            setFormOpen(true);
          }}
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
          filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSell={() => setSellTarget(p)}
              onEdit={() => {
                setEditingProduct(p);
                setFormOpen(true);
              }}
              onDelete={() => setDeleteTarget(p)}
            />
          ))
        )}
      </div>

      <div className="h-8" />

      <ProductFormModal
        open={formOpen}
        mode={editingProduct ? "edit" : "create"}
        initial={editingProduct}
        onClose={() => setFormOpen(false)}
        onSubmit={editingProduct ? editProduct : addProduct}
      />

      <SellProductModal
        open={!!sellTarget}
        product={sellTarget}
        onClose={() => setSellTarget(null)}
        onConfirm={sellProduct}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir produto?"
        description={`Isso vai remover "${deleteTarget?.name}" permanentemente. Essa ação não pode ser desfeita.`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
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
