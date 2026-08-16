import { createClient } from "@/lib/supabase/client";

export async function exportFullBackup() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const [XLSX, products, sales, bills, clientes, fornecedores, os] = await Promise.all([
    import("xlsx"),
    supabase.from("products").select("*"),
    supabase.from("sales").select("*"),
    supabase.from("bills").select("*"),
    supabase.from("clientes").select("*"),
    supabase.from("fornecedores").select("*"),
    supabase.from("service_orders").select("*"),
  ]);

  const wb = XLSX.utils.book_new();
  const sheets: [string, { data: unknown[] | null } | { data: unknown[] }][] = [
    ["Produtos", products],
    ["Vendas", sales],
    ["Contas", bills],
    ["Clientes", clientes],
    ["Fornecedores", fornecedores],
    ["Ordens de Servico", os],
  ];

  sheets.forEach(([name, result]) => {
    const rows = (result.data ?? []) as Record<string, unknown>[];
    const ws = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{ info: "Sem dados" }]);
    XLSX.utils.book_append_sheet(wb, ws, name);
  });

  const today = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `backup-briquegg-${today}.xlsx`);
  return true;
}
