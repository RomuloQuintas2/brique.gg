import Link from "next/link";
import { Settings } from "lucide-react";
import Logo from "./Logo";

export default function MobileTopBar() {
  return (
    <div
      className="flex h-[58px] items-center justify-between bg-white px-3.5 lg:hidden"
      style={{ borderBottom: "1px solid rgba(15,23,42,0.09)" }}
    >
      <Logo size={26} textSize={15} />
      <Link
        href="/painel/conta"
        className="flex items-center gap-1.5 rounded-full py-1.5 pr-3 pl-1.5 text-[12.5px] font-bold text-[#1D4ED8]"
        style={{ background: "rgba(76,141,255,0.1)" }}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3D7FFF] text-white">
          <Settings size={13} />
        </span>
        Conta
      </Link>
    </div>
  );
}
