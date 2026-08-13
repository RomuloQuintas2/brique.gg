export default function ProBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9.5px] font-extrabold tracking-wide text-[#0B0E14] ${className}`}
      style={{ background: "linear-gradient(135deg,#F2C94C,#E0A526)" }}
    >
      PRO
    </span>
  );
}
