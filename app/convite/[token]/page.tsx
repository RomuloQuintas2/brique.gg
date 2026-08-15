"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthShell from "@/components/brique-control/AuthShell";
import AuthField from "@/components/brique-control/AuthField";
import { createClient } from "@/lib/supabase/client";

type Invite = { email: string; role: string; status: string; company_name: string };

export default function ConvitePage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [invite, setInvite] = useState<Invite | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .rpc("get_invitation_by_token", { p_token: params.token })
      .then(({ data }) => {
        setInvite(data && data.length > 0 ? data[0] : null);
        setLoading(false);
      });
  }, [params.token]);

  const accept = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: invite!.email,
      password,
      options: { data: { business_name: name, invite_token: params.token } },
    });
    setSubmitting(false);

    if (signUpError) {
      setError("Não foi possível criar sua conta. Tente novamente.");
      return;
    }

    if (data.session) {
      router.push("/painel");
      router.refresh();
    } else {
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <AuthShell>
        <p className="m-0 text-center text-sm text-[#64748B]">Carregando convite...</p>
      </AuthShell>
    );
  }

  if (!invite || invite.status !== "pending") {
    return (
      <AuthShell>
        <h1 className="m-0 mb-1.5 text-xl font-extrabold text-[#1D4ED8]">Convite inválido</h1>
        <p className="m-0 text-sm text-[#64748B]">
          Esse link de convite não existe mais ou já foi usado.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h1 className="m-0 mb-1.5 text-xl font-extrabold text-[#1D4ED8]">Entrar na equipe</h1>
      <p className="m-0 mb-5 text-sm text-[#64748B]">
        Você foi convidado pra fazer parte de <strong>{invite.company_name}</strong> no brique.gg
        como {invite.role === "admin" ? "administrador" : "funcionário"}.
      </p>

      <form onSubmit={accept} className="flex flex-col gap-4">
        <AuthField
          label="Seu nome"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome completo"
        />
        <AuthField label="E-mail" type="email" value={invite.email} disabled onChange={() => {}} />
        <AuthField
          label="Crie uma senha"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
        />
        <AuthField
          label="Confirmar senha"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
        />

        {error && <p className="m-0 text-[13px] text-[#B91C1C]">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {submitting ? "Entrando..." : "Aceitar convite e entrar"}
        </button>
      </form>
    </AuthShell>
  );
}
