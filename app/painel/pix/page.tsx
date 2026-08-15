"use client";

import { useEffect, useState } from "react";
import { Download, QrCode } from "lucide-react";
import QRCode from "qrcode";
import AppShell from "@/components/brique-control/AppShell";
import PageHeader from "@/components/brique-control/PageHeader";
import { buildPixPayload, type PixKeyType } from "@/lib/pixPayload";
import { createClient } from "@/lib/supabase/client";

const KEY_TYPES: { value: PixKeyType; label: string }[] = [
  { value: "cpf", label: "CPF" },
  { value: "cnpj", label: "CNPJ" },
  { value: "email", label: "E-mail" },
  { value: "phone", label: "Telefone" },
  { value: "random", label: "Chave aleatória" },
];

function PixContent() {
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("");
  const [keyType, setKeyType] = useState<PixKeyType>("cpf");
  const [pixKey, setPixKey] = useState("");
  const [city, setCity] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("business_name, pix_key_type, pix_key, pix_city")
        .eq("id", user.id)
        .single();

      if (data) {
        setBusinessName(data.business_name ?? "");
        if (data.pix_key_type) setKeyType(data.pix_key_type as PixKeyType);
        setPixKey(data.pix_key ?? "");
        setCity(data.pix_city ?? "");
      }
      setLoading(false);
    })();
  }, []);

  const canGenerate = businessName.trim().length > 0 && pixKey.trim().length > 0 && city.trim().length > 0;

  const save = async () => {
    setSaving(true);
    setMsg(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ pix_key_type: keyType, pix_key: pixKey.trim(), pix_city: city.trim() })
      .eq("id", user.id);

    setSaving(false);
    if (error) {
      setMsg("Não foi possível salvar. Tente novamente.");
      return;
    }
    setMsg("Salvo!");
    setTimeout(() => setMsg(null), 3000);
    generateQr();
  };

  const generateQr = async () => {
    if (!canGenerate) return;
    const payload = buildPixPayload({
      keyType,
      key: pixKey,
      merchantName: businessName,
      merchantCity: city,
      amount: amount ? Number(amount) : undefined,
    });
    const dataUrl = await QRCode.toDataURL(payload, { width: 280, margin: 1 });
    setQrDataUrl(dataUrl);
  };

  const downloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "qrcode-pix-briquegg.png";
    link.click();
  };

  if (loading) {
    return (
      <>
        <PageHeader title="QR Code PIX" subtitle="Gere seu QR Code estático pra receber por PIX." />
        <div className="py-10 text-center text-sm text-[#64748B]">Carregando...</div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="QR Code PIX" subtitle="Gere seu QR Code estático pra receber por PIX." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div
          className="rounded-[20px] bg-white p-6"
          style={{ border: "1px solid rgba(15,23,42,0.09)" }}
        >
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3D7FFF]/10 text-[#3D7FFF]">
              <QrCode size={18} />
            </div>
            <div className="text-[15px] font-bold text-[#1D4ED8]">Sua chave PIX</div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#101828]">
                Nome do recebedor
              </label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Nome do seu negócio"
                className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
                style={{ border: "1px solid rgba(15,23,42,0.15)" }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#101828]">Tipo de chave</label>
              <select
                value={keyType}
                onChange={(e) => setKeyType(e.target.value as PixKeyType)}
                className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
                style={{ border: "1px solid rgba(15,23,42,0.15)" }}
              >
                {KEY_TYPES.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#101828]">Chave PIX</label>
              <input
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="Sua chave PIX"
                className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
                style={{ border: "1px solid rgba(15,23,42,0.15)" }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#101828]">Cidade</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Sao Paulo"
                className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
                style={{ border: "1px solid rgba(15,23,42,0.15)" }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#101828]">
                Valor fixo (opcional)
              </label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                placeholder="Deixe em branco pra valor livre"
                className="rounded-[11px] bg-[#F5F7FA] px-3 py-2.5 text-sm text-[#101828]"
                style={{ border: "1px solid rgba(15,23,42,0.15)" }}
              />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={save}
              disabled={!canGenerate || saving}
              className="cursor-pointer rounded-[11px] border-none bg-[#3D7FFF] px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? "Salvando..." : "Salvar e gerar QR Code"}
            </button>
            {msg && <span className="text-[13px] font-semibold text-[#3FBE7A]">{msg}</span>}
          </div>
        </div>

        <div
          className="flex flex-col items-center justify-center gap-4 rounded-[20px] bg-white p-6 text-center"
          style={{ border: "1px solid rgba(15,23,42,0.09)" }}
        >
          {qrDataUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="QR Code PIX" width={220} height={220} />
              <button
                onClick={downloadQr}
                className="flex cursor-pointer items-center gap-2 rounded-[11px] border-none bg-[#3D7FFF] px-5 py-2.5 text-sm font-bold text-white"
              >
                <Download size={16} />
                Baixar QR Code
              </button>
            </>
          ) : (
            <p className="m-0 text-[13.5px] text-[#64748B]">
              Preencha e salve sua chave PIX pra gerar o QR Code.
            </p>
          )}
        </div>
      </div>

      <div className="h-8" />
    </>
  );
}

export default function PixPage() {
  return (
    <AppShell>
      <PixContent />
    </AppShell>
  );
}
