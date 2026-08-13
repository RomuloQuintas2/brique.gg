"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type BriqueContextValue = {
  isPro: boolean;
  setIsPro: (value: boolean) => void;
  upgradeModalOpen: boolean;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
};

const BriqueContext = createContext<BriqueContextValue | null>(null);

export function BriqueProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  return (
    <BriqueContext.Provider
      value={{
        isPro,
        setIsPro,
        upgradeModalOpen,
        openUpgradeModal: () => setUpgradeModalOpen(true),
        closeUpgradeModal: () => setUpgradeModalOpen(false),
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
