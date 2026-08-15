import Link from "next/link";
import Logo from "@/components/brique-control/Logo";

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#101828]">
      <header className="mx-auto flex max-w-[1100px] items-center justify-between px-4 py-5 lg:px-9">
        <Link href="/">
          <Logo size={32} textSize={16} />
        </Link>
      </header>

      <main className="mx-auto max-w-[720px] px-4 py-16 lg:px-9">
        <h1 className="m-0 mb-4 text-2xl font-extrabold text-[#101828]">Termos de Uso</h1>
        <p className="m-0 text-[14.5px] leading-relaxed text-[#64748B]">
          Estamos preparando os termos de uso completos do brique.gg. Em breve esta página
          trará todas as condições de uso da plataforma.
        </p>
      </main>
    </div>
  );
}
