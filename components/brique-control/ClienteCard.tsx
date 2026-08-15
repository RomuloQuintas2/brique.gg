import { User, MessageCircle, Pencil, Trash2, History } from "lucide-react";

export type Cliente = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
};

export default function ClienteCard({
  cliente,
  onEdit,
  onDelete,
  onHistory,
}: {
  cliente: Cliente;
  onEdit: () => void;
  onDelete: () => void;
  onHistory: () => void;
}) {
  const whatsappHref = cliente.phone
    ? `https://wa.me/55${cliente.phone.replace(/\D/g, "")}`
    : null;

  return (
    <div
      className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4"
      style={{ border: "1px solid rgba(15,23,42,0.09)" }}
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#4C8DFF]/10 text-[#4C8DFF]">
        <User size={20} />
      </div>
      <div className="min-w-[160px] flex-1">
        <div className="truncate text-[15px] font-bold text-[#101828]">{cliente.name}</div>
        <div className="truncate text-[13px] text-[#64748B]">
          {[cliente.phone, cliente.email].filter(Boolean).join(" · ") || "Sem contato cadastrado"}
        </div>
        {cliente.notes && (
          <div className="truncate text-[12.5px] text-[#94A3B8]">{cliente.notes}</div>
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
          onClick={onHistory}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border-none px-3 py-1.5 text-xs font-bold text-[#3D7FFF]"
          style={{ background: "rgba(76,141,255,0.12)" }}
        >
          <History size={13} />
          Histórico
        </button>
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
