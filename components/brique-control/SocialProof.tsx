import { Shirt, Smartphone, Footprints, Watch } from "lucide-react";

const niches = [
  { icon: Shirt, label: "Roupas" },
  { icon: Smartphone, label: "Eletrônicos" },
  { icon: Footprints, label: "Calçados" },
  { icon: Watch, label: "Acessórios" },
];

export default function SocialProof() {
  return (
    <section className="py-8">
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="m-0 max-w-[560px] text-lg font-bold text-[#101828] sm:text-xl">
          Feito para quem vive de revender — do brechó ao revendedor de eletrônicos.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {niches.map((n) => (
            <div
              key={n.label}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2"
              style={{ border: "1px solid rgba(15,23,42,0.09)" }}
            >
              <n.icon size={16} className="text-[#3D7FFF]" />
              <span className="text-[13px] font-semibold text-[#475467]">{n.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
