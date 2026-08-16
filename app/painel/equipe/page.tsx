"use client";

import { useEffect, useState } from "react";
import { Plus, Copy, X, UsersRound } from "lucide-react";
import PageHeader from "@/components/brique-control/PageHeader";
import { createClient } from "@/lib/supabase/client";

type Teammate = { id: string; business_name: string | null; role: string };
type Invitation = { id: string; email: string; role: string; token: string; status: string };

function EquipeContent() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("funcionario");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const load = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("company_id, role")
      .eq("id", user.id)
      .single();

    if (!profile) return;
    setCompanyId(profile.company_id);
    setIsAdmin(profile.role === "admin");

    const [{ data: mates }, { data: invites }] = await Promise.all([
      supabase.from("profiles").select("id, business_name, role").eq("company_id", profile.company_id),
      supabase
        .from("invitations")
        .select("id, email, role, token, status")
        .eq("company_id", profile.company_id)
        .eq("status", "pending"),
    ]);

    setTeammates(mates ?? []);
    setInvitations(invites ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const sendInvite = async () => {
    if (!companyId || !email.trim()) return;
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("invitations")
      .insert({ company_id: companyId, email: email.trim(), role, invited_by: user.id })
      .select("id, email, role, token, status")
      .single();

    setSaving(false);
    if (error || !data) {
      setError("Não foi possível criar o convite. Tente novamente.");
      return;
    }
    setInvitations((prev) => [...prev, data]);
    setGeneratedLink(`${window.location.origin}/convite/${data.token}`);
    setEmail("");
  };

  const revokeInvite = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("invitations").delete().eq("id", id);
    if (error) return;
    setInvitations((prev) => prev.filter((i) => i.id !== id));
  };

  if (loading) {
    return (
      <>
        <PageHeader title="Equipe" subtitle="Convide funcionários pra ajudar no dia a dia." />
        <div className="py-10 text-center text-sm text-[#64748B]">Carregando...</div>
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <PageHeader title="Equipe" subtitle="Convide funcionários pra ajudar no dia a dia." />
        <div
          className="rounded-2xl bg-white py-10 text-center"
          style={{ border: "1px dashed rgba(15,23,42,0.16)" }}
        >
          <p className="m-0 text-[13px] text-[#64748B]">
            Só administradores podem gerenciar a equipe.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Equipe" subtitle="Convide funcionários pra ajudar no dia a dia." />

      <div className="mb-5 flex justify-end">
        <button
          onClick={() => {
            setInviteOpen(true);
            setGeneratedLink(null);
          }}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border-none bg-[#3D7FFF] px-4 py-2.5 text-[13.5px] font-bold text-white"
        >
          <Plus size={16} />
          Convidar
        </button>
      </div>

      <div className="mb-2 px-1 text-[11px] font-bold tracking-[0.06em] text-[#8A93A3] uppercase">
        Membros
      </div>
      <div className="mb-5 flex flex-col gap-3">
        {teammates.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-4 rounded-2xl bg-white p-4"
            style={{ border: "1px solid rgba(15,23,42,0.09)" }}
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#4C8DFF]/10 text-[#4C8DFF]">
              <UsersRound size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14.5px] font-bold text-[#101828]">
                {t.business_name || "Sem nome"}
              </div>
              <div className="text-[12.5px] text-[#64748B]">
                {t.role === "admin" ? "Administrador" : "Funcionário"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {invitations.length > 0 && (
        <>
          <div className="mb-2 px-1 text-[11px] font-bold tracking-[0.06em] text-[#8A93A3] uppercase">
            Convites pendentes
          </div>
          <div className="mb-5 flex flex-col gap-3">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center gap-4 rounded-2xl bg-white p-4"
                style={{ border: "1px solid rgba(15,23,42,0.09)" }}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14.5px] font-bold text-[#101828]">
                    {inv.email}
                  </div>
                  <div className="text-[12.5px] text-[#64748B]">
                    {inv.role === "admin" ? "Administrador" : "Funcionário"} · Aguardando
                  </div>
                </div>
                <button
                  onClick={() => revokeInvite(inv.id)}
                  className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-none text-[#E05B5B]"
                  style={{ background: "rgba(224,91,91,0.12)" }}
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="h-8" />

      {inviteOpen && (
        <div
          onClick={() => setInviteOpen(false)}
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/55 p-4 py-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[420px] rounded-[20px] bg-white p-6"
          >
            <div className="mb-4 flex items-start justify-end">
              <button
                onClick={() => setInviteOpen(false)}
                className="cursor-pointer border-none bg-none p-1 text-[#64748B]"
              >
                <X size={20} />
              </button>
            </div>

            <h2 className="m-0 mb-4 text-lg font-extrabold text-[#1D4ED8]">Convidar pra equipe</h2>

            {generatedLink ? (
              <div>
                <p className="m-0 mb-3 text-[13.5px] text-[#64748B]">
                  Convite criado. Envie esse link pra pessoa (WhatsApp, e-mail, onde preferir):
                </p>
                <div className="mb-4 flex items-center gap-2 rounded-[11px] bg-[#F5F7FA] p-3">
                  <span className="min-w-0 flex-1 truncate text-[12.5px] text-[#101828]">
                    {generatedLink}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedLink)}
                    className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-[#3D7FFF] text-white"
                  >
                    <Copy size={13} />
                  </button>
                </div>
                <button
                  onClick={() => setInviteOpen(false)}
                  className="w-full cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] py-3 text-sm font-bold text-white"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail da pessoa"
                  className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
                  style={{ border: "1px solid rgba(15,23,42,0.15)" }}
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
                  style={{ border: "1px solid rgba(15,23,42,0.15)" }}
                >
                  <option value="funcionario">Funcionário (Vendas e Produtos)</option>
                  <option value="admin">Administrador (acesso total)</option>
                </select>
                {error && <p className="m-0 text-[13px] text-[#B91C1C]">{error}</p>}
                <button
                  onClick={sendInvite}
                  disabled={!email.trim() || saving}
                  className="mt-2 w-full cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving ? "Gerando..." : "Gerar link de convite"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function EquipePage() {
  return <EquipeContent />;
}

