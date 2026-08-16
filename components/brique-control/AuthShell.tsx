"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import Logo from "./Logo";
import { usePwaInstall } from "./PwaInstallContext";

export default function AuthShell({ children }: { children: React.ReactNode }) {
  const { isInstalled, install } = usePwaInstall();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F5F7FA] px-4 py-10">
      {!isInstalled && (
        <button
          onClick={install}
          title="Instalar app"
          className="absolute top-4 right-4 flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-3 py-2 text-[12px] font-bold text-[#3D7FFF]"
          style={{ border: "1px solid rgba(76,141,255,0.25)" }}
        >
          <Download size={14} />
          <span className="hidden sm:inline">Instalar app</span>
        </button>
      )}
      <div className="w-full max-w-[400px]">
        <Link href="/" className="mb-8 flex items-center justify-center">
          <Logo size={36} textSize={18} />
        </Link>
        <div
          className="rounded-[20px] bg-white p-7"
          style={{ border: "1px solid rgba(15,23,42,0.09)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
