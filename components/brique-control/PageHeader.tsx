"use client";

import { HelpCircle, Bell, Download } from "lucide-react";
import { usePwaInstall } from "./PwaInstallContext";

export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const { isInstalled, install } = usePwaInstall();

  return (
    <div className="mb-[22px] flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="m-0 mb-1 text-[clamp(20px,3vw,26px)] font-extrabold tracking-[-0.3px] text-[#1D4ED8]">
          {title}
        </h1>
        <p className="m-0 text-sm text-[#64748B]">{subtitle}</p>
      </div>
      <div className="hidden items-center gap-2 lg:flex">
        {!isInstalled && (
          <button
            onClick={install}
            title="Instalar app"
            className="flex cursor-pointer items-center rounded-[11px] bg-white p-2.5 text-[#64748B]"
            style={{ border: "1px solid rgba(15,23,42,0.09)" }}
          >
            <Download size={18} />
          </button>
        )}
        <button
          className="flex cursor-pointer items-center rounded-[11px] bg-white p-2.5 text-[#64748B]"
          style={{ border: "1px solid rgba(15,23,42,0.09)" }}
        >
          <HelpCircle size={18} />
        </button>
        <button
          className="relative flex cursor-pointer items-center rounded-[11px] bg-white p-2.5 text-[#64748B]"
          style={{ border: "1px solid rgba(15,23,42,0.09)" }}
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#E05B5B]" />
        </button>
      </div>
    </div>
  );
}
