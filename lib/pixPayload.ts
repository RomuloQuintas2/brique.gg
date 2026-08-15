export type PixKeyType = "cpf" | "cnpj" | "email" | "phone" | "random";

function tlv(id: string, value: string) {
  const len = String(value.length).padStart(2, "0");
  return `${id}${len}${value}`;
}

const DIACRITICS_RE = /[̀-ͯ]/g;

function sanitizeAscii(value: string, maxLen: number) {
  const stripped = value
    .normalize("NFD")
    .replace(DIACRITICS_RE, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .toUpperCase();
  return (stripped || "BRIQUE").slice(0, maxLen);
}

export function normalizePixKey(type: PixKeyType, rawKey: string) {
  const key = rawKey.trim();
  if (type === "cpf" || type === "cnpj") return key.replace(/\D/g, "");
  if (type === "phone") {
    const digits = key.replace(/\D/g, "");
    return `+55${digits.replace(/^55/, "")}`;
  }
  return key;
}

function crc16(payload: string) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function buildPixPayload({
  keyType,
  key,
  merchantName,
  merchantCity,
  amount,
}: {
  keyType: PixKeyType;
  key: string;
  merchantName: string;
  merchantCity: string;
  amount?: number;
}) {
  const normalizedKey = normalizePixKey(keyType, key);
  const name = sanitizeAscii(merchantName, 25);
  const city = sanitizeAscii(merchantCity, 15);

  const merchantAccountInfo = tlv("00", "BR.GOV.BCB.PIX") + tlv("01", normalizedKey);

  let payload =
    tlv("00", "01") +
    tlv("01", "11") +
    tlv("26", merchantAccountInfo) +
    tlv("52", "0000") +
    tlv("53", "986") +
    (amount && amount > 0 ? tlv("54", amount.toFixed(2)) : "") +
    tlv("58", "BR") +
    tlv("59", name) +
    tlv("60", city) +
    tlv("62", tlv("05", "***"));

  payload += "6304";
  return payload + crc16(payload);
}
