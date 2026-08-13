import { Menu, HelpCircle, Bell } from "lucide-react";
import Logo from "./Logo";

export default function MobileTopBar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  return (
    <div
      className="fixed inset-x-0 top-0 z-40 flex h-[58px] items-center justify-between bg-white px-3.5 lg:hidden"
      style={{ borderBottom: "1px solid rgba(15,23,42,0.09)" }}
    >
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenSidebar}
          className="flex cursor-pointer items-center border-none bg-none p-1.5 text-[#101828]"
        >
          <Menu size={20} />
        </button>
        <Logo size={26} textSize={15} />
      </div>
      <div className="flex items-center gap-1.5">
        <button className="flex cursor-pointer items-center border-none bg-none p-2 text-[#64748B]">
          <HelpCircle size={20} />
        </button>
        <button className="relative flex cursor-pointer items-center border-none bg-none p-2 text-[#64748B]">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-[7px] w-[7px] rounded-full border-[1.5px] border-white bg-[#E05B5B]" />
        </button>
      </div>
    </div>
  );
}
