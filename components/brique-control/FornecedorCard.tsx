import { Truck, MessageCircle } from "lucide-react";

export type Fornecedor = {
  id: string;
  name: string;
  phone: string | null;
  category: string | null;
  notes: string | null;
};

export default function FornecedorCard({ fornecedor }: { fornecedor: Fornecedor }) {
  const whatsappHref = fornecedor.phone
    ? `https://wa.me/55${fornecedor.phone.replace(/\D/g, "")}`
    : null;

  return (
    <div
      className="flex items-center gap-4 rounded-2xl bg-white p-4"
      style={{ border: "1px solid rgba(15,23,42,0.09)" }}
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#4C8DFF]/10 text-[#4C8DFF]">
        <Truck size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-bold text-[#101828]">{fornecedor.name}</div>
        <div className="truncate text-[13px] text-[#64748B]">
          {[fornecedor.category, fornecedor.phone].filter(Boolean).join(" · ") ||
            "Sem contato cadastrado"}
        </div>
        {fornecedor.notes && (
          <div className="truncate text-[12.5px] text-[#94A3B8]">{fornecedor.notes}</div>
        )}
      </div>
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[#3FBE7A]"
          style={{ background: "rgba(63,190,122,0.12)" }}
          title="Chamar no WhatsApp"
        >
          <MessageCircle size={16} />
        </a>
      )}
    </div>
  );
}
