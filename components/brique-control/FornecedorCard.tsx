import { Truck, MessageCircle, Pencil, Trash2 } from "lucide-react";

export type Fornecedor = {
  id: string;
  name: string;
  phone: string | null;
  category: string | null;
  notes: string | null;
};

export default function FornecedorCard({
  fornecedor,
  onEdit,
  onDelete,
}: {
  fornecedor: Fornecedor;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const whatsappHref = fornecedor.phone
    ? `https://wa.me/55${fornecedor.phone.replace(/\D/g, "")}`
    : null;

  return (
    <div
      className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4"
      style={{ border: "1px solid rgba(15,23,42,0.09)" }}
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#4C8DFF]/10 text-[#4C8DFF]">
        <Truck size={20} />
      </div>
      <div className="min-w-[160px] flex-1">
        <div className="truncate text-[15px] font-bold text-[#101828]">{fornecedor.name}</div>
        <div className="truncate text-[13px] text-[#64748B]">
          {[fornecedor.category, fornecedor.phone].filter(Boolean).join(" · ") ||
            "Sem contato cadastrado"}
        </div>
        {fornecedor.notes && (
          <div className="truncate text-[12.5px] text-[#94A3B8]">{fornecedor.notes}</div>
        )}
      </div>

      <div className="flex flex-shrink-0 flex-wrap items-center gap-1.5">
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
        <button
          onClick={onEdit}
          className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-none text-[#3D7FFF]"
          style={{ background: "rgba(76,141,255,0.12)" }}
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={onDelete}
          className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-none text-[#E05B5B]"
          style={{ background: "rgba(224,91,91,0.12)" }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
