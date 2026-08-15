import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export type ReportSale = {
  sale_date: string;
  product_name: string;
  platform: string | null;
  client_name: string | null;
  payment_method: string;
  value: number;
  profit: number;
};

const currency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

export function exportSalesPdf(sales: ReportSale[], title: string) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(title, 14, 16);

  const totalValue = sales.reduce((sum, s) => sum + s.value, 0);
  const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);
  doc.setFontSize(10);
  doc.text(
    `Total vendido: ${currency(totalValue)}  ·  Lucro total: ${currency(totalProfit)}  ·  ${sales.length} vendas`,
    14,
    23
  );

  autoTable(doc, {
    startY: 28,
    head: [["Data", "Produto", "Plataforma", "Cliente", "Pagamento", "Valor", "Lucro"]],
    body: sales.map((s) => [
      formatDate(s.sale_date),
      s.product_name,
      s.platform ?? "-",
      s.client_name ?? "-",
      s.payment_method,
      currency(s.value),
      currency(s.profit),
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [61, 127, 255] },
  });

  doc.save("relatorio-vendas-briquegg.pdf");
}

export function exportSalesExcel(sales: ReportSale[]) {
  const rows = sales.map((s) => ({
    Data: formatDate(s.sale_date),
    Produto: s.product_name,
    Plataforma: s.platform ?? "",
    Cliente: s.client_name ?? "",
    Pagamento: s.payment_method,
    Valor: s.value,
    Lucro: s.profit,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Vendas");
  XLSX.writeFile(wb, "relatorio-vendas-briquegg.xlsx");
}
