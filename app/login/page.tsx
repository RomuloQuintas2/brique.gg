"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/brique-control/AuthShell";
import AuthField from "@/components/brique-control/AuthField";
import GoogleAuthButton from "@/components/brique-control/GoogleAuthButton";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("E-mail ou senha incorretos.");
      return;
    }
    const next = searchParams.get("next") || "/painel";
    router.push(next);
    router.refresh();
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    setLoading(false);
    if (error) {
      setError("Não foi possível enviar o e-mail. Tente novamente.");
      return;
    }
    setForgotSent(true);
  };

  if (mode === "forgot") {
    return (
      <AuthShell>
        <h1 className="m-0 mb-1.5 text-xl font-extrabold text-[#1D4ED8]">
          Recuperar senha
        </h1>
        <p className="m-0 mb-5 text-sm text-[#64748B]">
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </p>

        {forgotSent ? (
          <div
            className="rounded-[12px] p-4 text-sm text-[#1B7A4A]"
            style={{ background: "rgba(63,190,122,0.12)" }}
          >
            Se esse e-mail estiver cadastrado, você vai receber um link de
            recuperação em instantes. Confira sua caixa de entrada.
          </div>
        ) : (
          <form onSubmit={handleForgot} className="flex flex-col gap-4">
            <AuthField
              label="E-mail"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
            />
            {error && <p className="m-0 text-[13px] text-[#B91C1C]">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Enviar link"}
            </button>
          </form>
        )}

        <button
          onClick={() => {
            setMode("login");
            setError(null);
          }}
          className="mt-4 w-full cursor-pointer border-none bg-transparent text-[13px] font-semibold text-[#64748B]"
        >
          ← Voltar para o login
        </button>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h1 className="m-0 mb-1.5 text-xl font-extrabold text-[#1D4ED8]">Entrar</h1>
      <p className="m-0 mb-5 text-sm text-[#64748B]">
        Acesse sua conta do brique.gg.
      </p>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <AuthField
          label="E-mail"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@email.com"
        />
        <div className="flex flex-col gap-1.5">
          <AuthField
            label="Senha"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => {
              setMode("forgot");
              setError(null);
            }}
            className="mt-0.5 w-fit cursor-pointer border-none bg-transparent p-0 text-[12.5px] font-semibold text-[#1D4ED8]"
          >
            Esqueci minha senha
          </button>
        </div>

        {error && <p className="m-0 text-[13px] text-[#B91C1C]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <GoogleAuthButton />

      <p className="m-0 mt-5 text-center text-[13px] text-[#64748B]">
        Não tem conta?{" "}
        <Link href="/cadastro" className="font-bold text-[#1D4ED8]">
          Criar conta
        </Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
