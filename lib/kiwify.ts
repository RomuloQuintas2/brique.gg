const KIWIFY_API_BASE = "https://public-api.kiwify.com";

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

// OAuth tokens last 24h per Kiwify's docs -- cached in module scope so a warm
// serverless instance doesn't re-authenticate on every webhook/checkout call.
// A cold instance just fetches a fresh one; this is a perf optimization, not
// a correctness dependency.
async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.accessToken;
  }

  const clientId = process.env.KIWIFY_CLIENT_ID;
  const clientSecret = process.env.KIWIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("KIWIFY_CLIENT_ID/KIWIFY_CLIENT_SECRET não configuradas");
  }

  const res = await fetch(`${KIWIFY_API_BASE}/v1/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret }),
  });

  if (!res.ok) {
    throw new Error(`Kiwify OAuth falhou: ${res.status}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: string };
  const expiresInMs = Number(data.expires_in) * 1000;
  cachedToken = {
    accessToken: data.access_token,
    // Refresh a bit early so we never use a token that expires mid-request.
    expiresAt: Date.now() + expiresInMs - 60_000,
  };
  return cachedToken.accessToken;
}

export type KiwifySale = {
  id: string;
  status: string;
  payment_method: string;
  card_rejection_reason?: string | null;
  customer: { id: string; name: string; email: string };
  tracking?: {
    src?: string | null;
    sck?: string | null;
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    utm_content?: string | null;
    utm_term?: string | null;
  };
};

// Re-fetches the sale from Kiwify's own API rather than trusting the webhook
// notification body directly -- same "don't trust the payload, verify with
// the source of truth" pattern used for the Mercado Pago integration.
export async function getKiwifySale(orderId: string): Promise<KiwifySale> {
  const accountId = process.env.KIWIFY_ACCOUNT_ID;
  if (!accountId) {
    throw new Error("KIWIFY_ACCOUNT_ID não configurada");
  }

  const token = await getAccessToken();
  const res = await fetch(`${KIWIFY_API_BASE}/v1/sales/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-kiwify-account-id": accountId,
    },
  });

  if (!res.ok) {
    throw new Error(`Kiwify sales lookup falhou: ${res.status}`);
  }

  return (await res.json()) as KiwifySale;
}
