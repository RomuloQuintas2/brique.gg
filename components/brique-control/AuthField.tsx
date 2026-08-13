export default function AuthField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-[#101828]">{label}</label>
      <input
        className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828] outline-none"
        style={{ border: "1px solid rgba(15,23,42,0.15)" }}
        {...props}
      />
    </div>
  );
}
