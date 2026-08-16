"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import Logo from "./Logo";
import { usePwaInstall } from "./PwaInstallContext";

export default function AuthShell({ children }: { children: React.ReactNode }) {
  const { isInstalled, install } = usePwaInstall();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] px-4 py-10">
      <div className="w-full max-w-[400px]">
        <Link href="/" className="mb-6 flex items-center justify-center">
          <Logo size={36} textSize={18} />
        </Link>
        {!isInstalled && (
          <div className="mb-6 flex justify-center">
            <button
              onClick={install}
              className="inline-flex cursor-pointer items-center gap-2 rounded-[11px] bg-[#3D7FFF] px-6 py-3 text-sm font-bold text-white"
            >
              <Download size={16} />
              Instalar aplicativo
            </button>
          </div>
        )}
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
