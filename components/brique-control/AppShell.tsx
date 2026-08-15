"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BriqueProvider } from "./BriqueContext";
import Sidebar from "./Sidebar";
import MobileTopBar from "./MobileTopBar";
import BottomNav from "./BottomNav";
import UpgradeModal from "./UpgradeModal";
import DevProToggle from "./DevProToggle";
import { createClient } from "@/lib/supabase/client";

const ROUTE_FOR_KEY: Record<string, string> = {
  inicio: "/painel",
  produtos: "/painel/produtos",
  vendas: "/painel/vendas",
  financeiro: "/painel/financeiro",
  clientes: "/painel/clientes",
  fornecedores: "/painel/fornecedores",
  calc: "/painel/calculadora",
  imei: "/painel/imei",
  config: "/painel/conta",
  assinatura: "/painel/assinatura",
};

function keyForPathname(pathname: string) {
  const entry = Object.entries(ROUTE_FOR_KEY).find(([, path]) => path === pathname);
  return entry ? entry[0] : "inicio";
}

function AppShellInner({ children }: { children: React.ReactNode }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const activeNav = keyForPathname(pathname);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const handleSelectNav = (key: string) => {
    setMoreOpen(false);
    const route = ROUTE_FOR_KEY[key];
    if (route) router.push(route);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#101828]">
      <MobileTopBar />

      <Sidebar
        open={false}
        onClose={() => {}}
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
        onLogout={handleLogout}
        side="left"
      />

      <Sidebar
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
        onLogout={handleLogout}
        side="right"
      />

      <main className="max-w-[1100px] px-4 pt-4 pb-24 lg:ml-[260px] lg:px-9 lg:pt-9 lg:pb-4">
        {children}
      </main>

      {!moreOpen && (
        <BottomNav
          activeNav={activeNav}
          moreOpen={moreOpen}
          onOpenMore={() => setMoreOpen(true)}
        />
      )}

      <UpgradeModal />
      <DevProToggle />
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <BriqueProvider>
      <AppShellInner>{children}</AppShellInner>
    </BriqueProvider>
  );
}
