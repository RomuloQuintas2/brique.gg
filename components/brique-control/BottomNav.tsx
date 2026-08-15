"use client";

import Link from "next/link";
import { Home, Package, Tag, Wallet, Menu } from "lucide-react";

const items = [
  { key: "inicio", label: "Início", icon: Home, href: "/painel" },
  { key: "produtos", label: "Produtos", icon: Package, href: "/painel/produtos" },
  { key: "vendas", label: "Vendas", icon: Tag, href: "/painel/vendas" },
  { key: "financeiro", label: "Financeiro", icon: Wallet, href: "/painel/financeiro" },
] as const;

export default function BottomNav({
  activeNav,
  moreOpen,
  onOpenMore,
  onlyKeys,
}: {
  activeNav: string;
  moreOpen: boolean;
  onOpenMore: () => void;
  onlyKeys?: string[];
}) {
  const visibleItems = onlyKeys ? items.filter((i) => onlyKeys.includes(i.key)) : items;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch bg-white lg:hidden"
      style={{
        borderTop: "1px solid rgba(15,23,42,0.09)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const active = activeNav === item.key;
        return (
          <Link
            key={item.key}
            href={item.href}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5"
          >
            <Icon size={20} color={active ? "#3D7FFF" : "#94A3B8"} strokeWidth={active ? 2.2 : 1.8} />
            <span
              className="text-[10.5px] font-semibold"
              style={{ color: active ? "#3D7FFF" : "#94A3B8" }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
      <button
        onClick={onOpenMore}
        className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 border-none bg-none py-2.5"
      >
        <Menu size={20} color={moreOpen ? "#3D7FFF" : "#94A3B8"} strokeWidth={moreOpen ? 2.2 : 1.8} />
        <span
          className="text-[10.5px] font-semibold"
          style={{ color: moreOpen ? "#3D7FFF" : "#94A3B8" }}
        >
          Mais
        </span>
      </button>
    </nav>
  );
}
