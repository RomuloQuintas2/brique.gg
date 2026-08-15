"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

export type UserRole = "admin" | "funcionario";

type BriqueContextValue = {
  isPro: boolean;
  setIsPro: (value: boolean) => void;
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
  }, []);

  return (
    <BriqueContext.Provider
      value={{
        isPro,
        setIsPro,
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
