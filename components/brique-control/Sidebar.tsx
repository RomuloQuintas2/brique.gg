"use client";

import Link from "next/link";
import { X, LogOut, Download } from "lucide-react";
import { navGroups } from "./navData";
import SidebarItem from "./SidebarItem";
import { useBrique } from "./BriqueContext";
import { usePwaInstall } from "./PwaInstallContext";
import Logo from "./Logo";

export default function Sidebar({
  open,
  onClose,
  activeNav,
  onSelectNav,
  onLogout,
  side = "left",
  hideKeys = [],
  onlyKeys,
}: {
  open: boolean;
  onClose: () => void;
  activeNav: string;
  onSelectNav: (key: string) => void;
  onLogout: () => void;
  side?: "left" | "right";
  hideKeys?: string[];
  onlyKeys?: string[];
}) {
  const { isPro, openUpgradeModal } = useBrique();
  const { isInstalled, install } = usePwaInstall();
  const isRight = side === "right";

  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !hideKeys.includes(item.key) && (!onlyKeys || onlyKeys.includes(item.key))
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 z-40 bg-black/55 lg:hidden" />
      )}

      <aside
        className={`fixed top-0 z-50 flex h-screen w-[260px] flex-col bg-white transition-transform duration-300 ease-in-out ${
          isRight
            ? `right-0 lg:hidden ${open ? "translate-x-0" : "translate-x-full"} shadow-[-2px_0_12px_rgba(15,23,42,0.04)]`
            : `left-0 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"} shadow-[2px_0_12px_rgba(15,23,42,0.04)]`
        }`}
        style={isRight ? { borderLeft: "1px solid rgba(15,23,42,0.09)" } : { borderRight: "1px solid rgba(15,23,42,0.09)" }}
      >
        <div className="flex items-center justify-between px-[18px] pt-[22px] pb-[18px]">
          <Logo size={32} textSize={16} />
          <button
            onClick={onClose}
            className={`flex cursor-pointer items-center border-none bg-none p-1 text-[#64748B] ${isRight ? "" : "lg:hidden"}`}
          >
            <X size={20} />
          </button>
        </div>

        {!isInstalled && (
          <div className="px-3 pb-1.5">
            <button
              onClick={install}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-semibold text-[#475467] hover:bg-slate-900/5"
            >
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                <Download size={18} strokeWidth={1.8} />
              </span>
              Instalar app
            </button>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 pt-1 pb-3">
          {visibleGroups.map((group) => (
            <div key={group.label} className="mb-[18px]">
              <div className="px-2.5 pt-2 pb-1.5 text-[11px] font-bold tracking-[0.06em] text-[#8A93A3] uppercase">
                {group.label}
              </div>
              {group.items.map((item) => (
                <SidebarItem
                  key={item.key}
                  item={item}
                  active={activeNav === item.key}
                  isPro={isPro}
                  onSelect={onSelectNav}
                  onLockedClick={openUpgradeModal}
                />
              ))}
            </div>
          ))}
        </nav>

        {!isPro && (
          <div
            className="mx-3 mt-1.5 mb-4 rounded-2xl p-3.5"
            style={{
              background:
                "linear-gradient(135deg, rgba(76,141,255,0.16), rgba(76,141,255,0.05))",
              border: "1px solid rgba(76,141,255,0.22)",
            }}
          >
            <div className="mb-1 text-[13px] font-bold text-[#101828]">
              Desbloqueie o PRO
            </div>
            <div className="mb-2.5 text-xs leading-[1.4] text-[#64748B]">
              Clientes, fornecedores, OS, PIX automático e muito mais — leve seu brique pro
              próximo nível.
            </div>
            <Link
              href="/painel/assinatura"
              onClick={onClose}
              className="block w-full cursor-pointer rounded-[10px] border-none bg-[#3D7FFF] py-2 text-center text-[12.5px] font-bold text-white no-underline"
            >
              Ver planos
            </Link>
          </div>
        )}

        <button
          onClick={onLogout}
          className="mx-3 mb-4 flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-semibold text-[#94A3B8] hover:bg-slate-900/5 hover:text-[#E05B5B]"
        >
          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
            <LogOut size={18} strokeWidth={1.8} />
          </span>
          Sair
        </button>
      </aside>
    </>
  );
}
