"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

export type UserRole = "admin" | "funcionario";

type BriqueContextValue = {
  isPro: boolean;
  setIsPro: (value: boolean) => void;
  refreshIsPro: () => Promise<boolean>;
  upgradeModalOpen: boolean;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
  role: UserRole;
};

const BriqueContext = createContext<BriqueContextValue | null>(null);

export function BriqueProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [role, setRole] = useState<UserRole>("admin");

  const refreshIsPro = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    // Plan belongs to the whole company (whoever subscribed), not to this
    // specific profile row -- same RPC the RLS policies use internally to
    // gate Clientes/Fornecedores/OS/convites, so the UI and the real
    // enforcement never disagree about who's PRO.
    const { data } = await supabase.rpc("is_company_pro", { target_user_id: user.id });
    const pro = !!data;
    setIsPro(pro);
    return pro;
  };

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (data?.role === "funcionario") setRole("funcionario");
    })();
    refreshIsPro();
  }, []);

  return (
    <BriqueContext.Provider
      value={{
        isPro,
        setIsPro,
        refreshIsPro,
        upgradeModalOpen,
        openUpgradeModal: () => setUpgradeModalOpen(true),
        closeUpgradeModal: () => setUpgradeModalOpen(false),
        role,
      }}
    >
      {children}
    </BriqueContext.Provider>
  );
}

export function useBrique() {
  const ctx = useContext(BriqueContext);
  if (!ctx) throw new Error("useBrique must be used within BriqueProvider");
  return ctx;
}
