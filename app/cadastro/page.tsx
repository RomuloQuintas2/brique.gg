"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/brique-control/AuthShell";
import AuthField from "@/components/brique-control/AuthField";
import GoogleAuthButton from "@/components/brique-control/GoogleAuthButton";

export default function CadastroPage() {
  const router = useRouter();

  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
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

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { business_name: businessName } },
    });
    setLoading(false);

    if (error) {
      setError(
        error.message.includes("already registered")
          ? "Esse e-mail já tem uma conta."
          : "Não foi possível criar sua conta. Tente novamente."
      );
      return;
    }

    if (data.session) {
      router.push("/painel");
      router.refresh();
      return;
    }

    setCheckEmail(true);
  };

  if (checkEmail) {
    return (
      <AuthShell>
        <h1 className="m-0 mb-1.5 text-xl font-extrabold text-[#1D4ED8]">
          Confirme seu e-mail
        </h1>
        <div
          className="rounded-[12px] p-4 text-sm text-[#1B7A4A]"
          style={{ background: "rgba(63,190,122,0.12)" }}
        >
          Enviamos um link de confirmação para <strong>{email}</strong>. Abra
          seu e-mail e clique no link para ativar sua conta.
        </div>
        <p className="m-0 mt-5 text-center text-[13px] text-[#64748B]">
          Já confirmou?{" "}
          <Link href="/login" className="font-bold text-[#1D4ED8]">
            Entrar
          </Link>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h1 className="m-0 mb-1.5 text-xl font-extrabold text-[#1D4ED8]">Criar conta</h1>
      <p className="m-0 mb-5 text-sm text-[#64748B]">
        Comece a organizar seu negócio, de graça.
      </p>

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <AuthField
          label="Nome"
          type="text"
          required
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Ex: Loja Rômulo"
        />
        <AuthField
          label="E-mail"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@email.com"
        />
        <AuthField
          label="Senha"
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
          disabled={loading}
          className="w-full cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "Criando conta..." : "Criar conta grátis"}
        </button>
      </form>

      <GoogleAuthButton />

      <p className="m-0 mt-5 text-center text-[13px] text-[#64748B]">
        Já tem conta?{" "}
        <Link href="/login" className="font-bold text-[#1D4ED8]">
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
}
