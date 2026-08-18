import { MercadoPagoConfig, PreApproval, Payment } from "mercadopago";

function getConfig(): MercadoPagoConfig {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurada");
  }
  return new MercadoPagoConfig({ accessToken });
}

export function getPreApprovalClient(): PreApproval {
  return new PreApproval(getConfig());
}

export function getPaymentClient(): Payment {
  return new Payment(getConfig());
}
