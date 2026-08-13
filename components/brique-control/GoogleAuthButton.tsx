export default function GoogleAuthButton() {
  return (
    <>
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: "rgba(15,23,42,0.09)" }} />
        <span className="text-xs font-semibold text-[#94A3B8]">ou continue com</span>
        <div className="h-px flex-1" style={{ background: "rgba(15,23,42,0.09)" }} />
      </div>
      <button
        type="button"
        disabled
        title="Em breve"
        className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-[11px] bg-[#F5F7FA] py-2.5 text-sm font-semibold text-[#94A3B8]"
        style={{ border: "1px solid rgba(15,23,42,0.1)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            fill="currentColor"
            d="M21.35 11.1h-9.17v2.73h5.24c-.23 1.42-1.6 4.16-5.24 4.16-3.15 0-5.72-2.61-5.72-5.83s2.57-5.83 5.72-5.83c1.79 0 2.99.76 3.68 1.42l2.5-2.42C16.87 3.7 14.83 2.75 12.18 2.75c-5.02 0-9.09 4.06-9.09 9.08s4.07 9.08 9.09 9.08c5.25 0 8.73-3.68 8.73-8.87 0-.6-.06-1.05-.14-1.94z"
          />
        </svg>
        Continuar com Google
        <span className="ml-1 rounded-full bg-[#F2C94C]/40 px-2 py-0.5 text-[10px] font-bold text-[#8A5710]">
          em breve
        </span>
      </button>
    </>
  );
}
