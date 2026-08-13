"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/brique-control/AuthShell";
import AuthField from "@/components/brique-control/AuthField";

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError("O link expirou ou é inválido. Solicite um novo pelo login.");
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/painel"), 1500);
  };

  if (done) {
    return (
      <AuthShell>
        <h1 className="m-0 mb-1.5 text-xl font-extrabold text-[#1D4ED8]">
          Senha redefinida!
        </h1>
        <div
          className="rounded-[12px] p-4 text-sm text-[#1B7A4A]"
          style={{ background: "rgba(63,190,122,0.12)" }}
        >
          Tudo certo. Te levando para o painel...
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h1 className="m-0 mb-1.5 text-xl font-extrabold text-[#1D4ED8]">Nova senha</h1>
      <p className="m-0 mb-5 text-sm text-[#64748B]">
        Escolha uma nova senha para sua conta.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthField
          label="Nova senha"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
        />
        <AuthField
          label="Confirmar nova senha"
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
          {loading ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </AuthShell>
  );
}
