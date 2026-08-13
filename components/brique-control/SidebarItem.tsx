import type { NavItem } from "./navData";
import ProBadge from "./ProBadge";

export default function SidebarItem({
  item,
  active,
  isPro,
  onSelect,
  onLockedClick,
}: {
  item: NavItem;
  active: boolean;
  isPro: boolean;
  onSelect: (key: string) => void;
  onLockedClick: () => void;
}) {
  const Icon = item.icon;
  const locked = !!item.pro && !isPro;

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        if (locked) {
          onLockedClick();
        } else {
          onSelect(item.key);
        }
      }}
      className={`mb-0.5 flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-semibold transition-colors ${
        active
          ? "bg-[#3D7FFF] text-white"
          : locked
            ? "text-slate-400/90 hover:bg-slate-900/5"
            : "text-[#475467] hover:bg-slate-900/5"
      }`}
    >
      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
        <Icon size={18} strokeWidth={1.8} />
      </span>
      <span className="flex-1">{item.label}</span>
      {item.pro && <ProBadge />}
    </a>
  );
}
