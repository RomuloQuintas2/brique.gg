"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Store, Lock, MessageCircle, Download, Check, CreditCard } from "lucide-react";
import PageHeader from "@/components/brique-control/PageHeader";
import ProBadge from "@/components/brique-control/ProBadge";
import { useBrique } from "@/components/brique-control/BriqueContext";
import { usePwaInstall } from "@/components/brique-control/PwaInstallContext";
import { createClient } from "@/lib/supabase/client";

function ContaContent() {
  const { isPro } = useBrique();
  const { isInstalled, install } = usePwaInstall();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");

      const { data } = await supabase
        .from("profiles")
        .select("business_name, phone")
        .eq("id", user.id)
        .single();

      if (data) {
        setBusinessName(data.business_name ?? "");
        setPhone(data.phone ?? "");
      }
      setLoading(false);
    })();
  }, []);

  const saveProfile = async () => {
    setSavingProfile(true);
    setProfileMsg(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ business_name: businessName, phone })
      .eq("id", user.id);

    setSavingProfile(false);
    setProfileMsg(error ? "Não foi possível salvar. Tente novamente." : "Salvo!");
    setTimeout(() => setProfileMsg(null), 3000);
  };

  const savePassword = async () => {
    setPasswordError(null);
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não conferem.");
      return;
    }

    setSavingPassword(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);

    if (error) {
      setPasswordError("Não foi possível atualizar a senha. Tente novamente.");
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMsg("Senha atualizada!");
    setTimeout(() => setPasswordMsg(null), 3000);
  };

  if (loading) {
    return (
      <>
        <PageHeader title="Configuração da Conta" subtitle="Nome do negócio, contato e segurança." />
        <div className="py-10 text-center text-sm text-[#64748B]">Carregando...</div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Configuração da Conta" subtitle="Nome do negócio, contato e segurança." />

      <div
        className="mb-5 rounded-[20px] bg-white p-6"
        style={{ border: "1px solid rgba(15,23,42,0.09)" }}
      >
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3D7FFF]/10 text-[#3D7FFF]">
            <Store size={18} />
          </div>
          <div className="text-[15px] font-bold text-[#1D4ED8]">Dados do negócio</div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">E-mail</label>
            <input
              value={email}
              disabled
              className="rounded-[11px] bg-[#F1F4F9] px-3 py-2.5 text-sm text-[#94A3B8]"
              style={{ border: "1px solid rgba(15,23,42,0.1)" }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Nome do negócio</label>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Ex: Loja da Mari"
              className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
              style={{ border: "1px solid rgba(15,23,42,0.15)" }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Telefone / WhatsApp</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Com DDD"
              className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
              style={{ border: "1px solid rgba(15,23,42,0.15)" }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={saveProfile}
            disabled={savingProfile}
            className="cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {savingProfile ? "Salvando..." : "Salvar alterações"}
          </button>
          {profileMsg && <span className="text-[13px] font-semibold text-[#3FBE7A]">{profileMsg}</span>}
        </div>
      </div>

      <div
        className="mb-5 rounded-[20px] bg-white p-6"
        style={{ border: "1px solid rgba(15,23,42,0.09)" }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3D7FFF]/10 text-[#3D7FFF]">
              <CreditCard size={18} />
            </div>
            <div>
              <div className="text-[15px] font-bold text-[#1D4ED8]">Seu plano atual</div>
              {isPro ? (
                <ProBadge className="mt-1 text-[10px] px-2 py-1" />
              ) : (
                <span
                  className="mt-1 inline-flex items-center rounded-md bg-[#F1F4F9] px-1.5 py-0.5 text-[9.5px] font-extrabold tracking-wide text-[#64748B]"
                >
                  GRÁTIS
                </span>
              )}
            </div>
          </div>
          {!isPro && (
            <Link
              href="/painel/assinatura"
              className="cursor-pointer rounded-[11px] bg-[#3D7FFF] px-4 py-2 text-[13px] font-bold text-white no-underline"
            >
              Ver planos
            </Link>
          )}
        </div>
      </div>

      <div
        className="rounded-[20px] bg-white p-6"
        style={{ border: "1px solid rgba(15,23,42,0.09)" }}
      >
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3D7FFF]/10 text-[#3D7FFF]">
            <Lock size={18} />
          </div>
          <div className="text-[15px] font-bold text-[#1D4ED8]">Alterar senha</div>
        </div>

        <div className="flex flex-col gap-4 sm:max-w-[360px]">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Nova senha</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
              style={{ border: "1px solid rgba(15,23,42,0.15)" }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#101828]">Confirmar nova senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
              style={{ border: "1px solid rgba(15,23,42,0.15)" }}
            />
          </div>
        </div>

        {passwordError && <p className="mt-3 mb-0 text-[13px] text-[#B91C1C]">{passwordError}</p>}

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={savePassword}
            disabled={savingPassword}
            className="cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {savingPassword ? "Salvando..." : "Atualizar senha"}
          </button>
          {passwordMsg && <span className="text-[13px] font-semibold text-[#3FBE7A]">{passwordMsg}</span>}
        </div>
      </div>

      <div
        className="mt-5 rounded-[20px] bg-white p-6"
        style={{ border: "1px solid rgba(15,23,42,0.09)" }}
      >
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3D7FFF]/10 text-[#3D7FFF]">
            {isInstalled ? <Check size={18} /> : <Download size={18} />}
          </div>
          <div className="text-[15px] font-bold text-[#1D4ED8]">
            {isInstalled ? "App instalado ✓" : "Instalar aplicativo"}
          </div>
        </div>
        {isInstalled ? (
          <p className="m-0 text-[13.5px] text-[#64748B]">
            Você já pode acessar o brique.gg direto da tela inicial do seu aparelho.
          </p>
        ) : (
          <>
            <p className="m-0 mb-4 text-[13.5px] text-[#64748B]">
              Acesse o brique.gg direto da tela inicial do seu celular ou computador, sem
              abrir o navegador.
            </p>
            <button
              onClick={install}
              className="flex cursor-pointer items-center gap-2 rounded-[11px] border-none bg-[#3D7FFF] px-5 py-2.5 text-sm font-bold text-white"
            >
              <Download size={16} />
              Instalar aplicativo
            </button>
          </>
        )}
      </div>

      {isPro && (
        <div
          className="mt-5 rounded-[20px] bg-white p-6"
          style={{ border: "1px solid rgba(15,23,42,0.09)" }}
        >
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3FBE7A]/10 text-[#3FBE7A]">
              <MessageCircle size={18} />
            </div>
            <div className="text-[15px] font-bold text-[#1D4ED8]">Suporte prioritário PRO</div>
          </div>
          <p className="m-0 mb-4 text-[13.5px] text-[#64748B]">
            Como assinante PRO, você tem uma linha direta com nosso time de suporte.
          </p>
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noreferrer"
            className="inline-flex cursor-pointer items-center gap-2 rounded-[11px] border-none bg-[#3FBE7A] px-5 py-2.5 text-sm font-bold text-white no-underline"
          >
            <MessageCircle size={16} />
            Falar com suporte PRO
          </a>
        </div>
      )}

      <div className="h-8" />
    </>
  );
}

export default function ContaPage() {
  return <ContaContent />;
}

