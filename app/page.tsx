import Link from "next/link";
import { Package, Tag, Wallet, Target, TrendingUp, BadgeCheck, Check, Infinity as InfinityIcon } from "lucide-react";
import Logo from "@/components/brique-control/Logo";
import SocialProof from "@/components/brique-control/SocialProof";
import ProBadge from "@/components/brique-control/ProBadge";
import PwaLandingSection from "@/components/brique-control/PwaLandingSection";

const steps = [
  {
    n: "1",
    title: "Cadastre seus produtos",
    desc: "Adicione o que você tem pra vender com custo, preço e estoque. Leva menos de um minuto por item.",
  },
  {
    n: "2",
    title: "Registre suas vendas",
    desc: "A cada venda, registre o valor e a forma de pagamento. O brique.gg calcula o lucro sozinho.",
  },
  {
    n: "3",
    title: "Acompanhe o financeiro",
    desc: "Veja o que tem a receber, a pagar, e sua performance ao longo do tempo, tudo num só lugar.",
  },
];

const features = [
  {
    icon: Package,
    title: "Produtos",
    desc: "Estoque, custo, preço de venda e margem de cada item, sempre à mão.",
  },
  {
    icon: Tag,
    title: "Vendas",
    desc: "Histórico completo de vendas com forma de pagamento e lucro por venda.",
  },
  {
    icon: Wallet,
    title: "Financeiro",
    desc: "Contas a pagar e a receber, fiado e parcelas, sem perder nada de vista.",
  },
  {
    icon: Target,
    title: "Metas",
    desc: "Defina uma meta de lucro no mês e acompanhe seu progresso em tempo real.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#101828]">
      <header className="mx-auto flex max-w-[1100px] items-center justify-between px-4 py-5 lg:px-9">
        <Logo size={32} textSize={16} />
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-semibold text-[#475467] sm:block"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="rounded-full bg-[#3D7FFF] px-4 py-2.5 text-[13.5px] font-bold text-white"
          >
            Criar conta
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-4 lg:px-9">
        <section className="flex flex-col items-center gap-5 py-16 text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-bold text-[#1A4FBF]"
            style={{ background: "rgba(76,141,255,0.12)" }}
          >
            <BadgeCheck size={14} />
            Não é teste grátis. É grátis.
          </span>

          <h1 className="m-0 max-w-[640px] text-[clamp(28px,5vw,42px)] font-extrabold tracking-[-0.5px] text-[#101828]">
            Saiba o lucro real do seu <span className="text-[#1D4ED8]">brique</span>,
            sem chute e sem planilha.
          </h1>
          <p className="m-0 max-w-[520px] text-[15px] leading-relaxed text-[#64748B]">
            Cadastre e registre seus produtos, vendas e financeiro e lucro, de graça, sem cartão de crédito e sem prazo
            pra vencer.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/cadastro"
              className="rounded-full bg-[#3D7FFF] px-6 py-3 text-sm font-bold text-white"
            >
              Criar minha conta agora
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-white px-6 py-3 text-sm font-bold text-[#1D4ED8]"
              style={{ border: "1px solid rgba(15,23,42,0.12)" }}
            >
              Já tenho conta
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[12.5px] font-medium text-[#94A3B8]">
            <span className="inline-flex items-center gap-1">
              <Check size={13} className="text-[#3FBE7A]" />
              Sem cartão de crédito
            </span>
            <span className="inline-flex items-center gap-1">
              <Check size={13} className="text-[#3FBE7A]" />
              Sem prazo de teste
            </span>
            <span className="inline-flex items-center gap-1">
              <Check size={13} className="text-[#3FBE7A]" />
              Sem pegadinha
            </span>
          </div>
        </section>

        <section className="py-10">
          <h2 className="m-0 mb-2 text-center text-[13px] font-bold tracking-[0.08em] text-[#8A93A3] uppercase">
            Como funciona
          </h2>
          <p className="m-0 mb-10 text-center text-2xl font-extrabold text-[#101828]">
            Três passos e você já está no controle.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.n}
                className="rounded-[20px] bg-white p-6"
                style={{ border: "1px solid rgba(15,23,42,0.09)" }}
              >
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold text-white"
                  style={{ background: "linear-gradient(135deg,#4C8DFF,#1A4FBF)" }}
                >
                  {s.n}
                </div>
                <div className="mb-1.5 text-[15px] font-bold text-[#1D4ED8]">{s.title}</div>
                <p className="m-0 text-[13.5px] leading-relaxed text-[#64748B]">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <PwaLandingSection />

        <section className="py-10">
          <div
            className="flex flex-col items-center gap-5 rounded-[24px] bg-white p-8 text-center sm:flex-row sm:items-start sm:gap-6 sm:p-10 sm:text-left"
            style={{ border: "1px solid rgba(15,23,42,0.09)" }}
          >
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[#4C8DFF]/10 text-[#4C8DFF]">
              <InfinityIcon size={28} />
            </div>
            <div className="max-w-[560px]">
              <h2 className="m-0 mb-2 text-2xl font-extrabold text-[#101828]">
                Grátis de verdade, não só por alguns dias
              </h2>
              <p className="m-0 text-[14.5px] leading-relaxed text-[#64748B]">
                A maioria das ferramentas do mercado te dá 7 ou 14 dias grátis
                e depois te obriga a pagar pra continuar usando o que você já
                cadastrou. Aqui não. O plano gratuito do brique.gg é
                permanente. Você pode gerenciar produtos, vendas, estoque e
                financeiro sem nunca precisar assinar nada. O PRO existe pra
                quem quer ir além (clientes, fornecedores, ordens de serviço,
                relatórios avançados), não pra travar o básico.
              </p>
            </div>
          </div>
        </section>

        <SocialProof />

        <section className="py-10">
          <p className="m-0 mb-10 text-center text-2xl font-extrabold text-[#101828]">
            Tudo que o seu negócio precisa.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-[20px] bg-white p-5"
                style={{ border: "1px solid rgba(15,23,42,0.09)" }}
              >
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-white"
                  style={{ background: "linear-gradient(135deg,#4C8DFF,#1A4FBF)" }}
                >
                  <f.icon size={20} />
                </div>
                <div className="mb-1 text-[14.5px] font-bold text-[#1D4ED8]">{f.title}</div>
                <p className="m-0 text-[13px] leading-relaxed text-[#64748B]">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-8">
          <div
            className="rounded-[24px] bg-white p-8 text-center sm:p-10"
            style={{ border: "1px solid rgba(15,23,42,0.09)" }}
          >
            <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
              <h2 className="m-0 text-xl font-extrabold text-[#101828] sm:text-2xl">
                Quando seu brique crescer, o PRO cresce com você
              </h2>
              <ProBadge className="text-[11px] px-2 py-1" />
            </div>
            <p className="m-0 mx-auto max-w-[560px] text-[14px] leading-relaxed text-[#64748B]">
              Clientes, fornecedores, ordens de serviço, QR Code PIX, relatórios avançados e
              muito mais, por R$ 19,90/mês, disponíveis quando você quiser dar o próximo
              passo.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div
            className="flex flex-col items-center gap-4 rounded-[24px] px-6 py-12 text-center"
            style={{ background: "linear-gradient(135deg, #4C8DFF 0%, #1A4FBF 100%)" }}
          >
            <div className="flex items-center gap-2 text-white/90">
              <TrendingUp size={18} />
              <span className="text-[13px] font-bold">Lucro real, todo mês</span>
            </div>
            <h2 className="m-0 max-w-[440px] text-2xl font-extrabold text-white">
              Comece hoje, é grátis.
            </h2>
            <p className="m-0 max-w-[420px] text-sm text-white/85">
              Sem cartão de crédito. Cadastre seus primeiros produtos em minutos.
            </p>
            <Link
              href="/cadastro"
              className="mt-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#1A4FBF]"
            >
              Criar minha conta grátis
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[rgba(15,23,42,0.08)] py-8">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-5 px-4 text-center lg:flex-row lg:items-center lg:justify-between lg:px-9 lg:text-left">
          <div className="flex flex-col items-center gap-2 lg:items-start">
            <Logo size={24} textSize={14} />
            <p className="m-0 text-[13px] text-[#64748B]">
              Gestão simples para quem revende todos os dias.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 lg:justify-end">
            <Link href="/termos" className="text-[12.5px] text-[#94A3B8]">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="text-[12.5px] text-[#94A3B8]">
              Privacidade
            </Link>
            <Link href="mailto:contato@briquegg.site" className="text-[12.5px] text-[#94A3B8]">
              Contato
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
