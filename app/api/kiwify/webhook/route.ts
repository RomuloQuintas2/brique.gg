import { NextResponse, type NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getKiwifySale, type KiwifySale } from "@/lib/kiwify";
import { CURRENT_PRO_PRICE } from "@/lib/proPricing";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const GRANT_EVENTS = new Set(["order_approved", "subscription_renewed"]);
const REVOKE_EVENTS = new Set(["order_refunded", "chargeback", "subscription_canceled"]);
// subscription_late is intentionally not in either set. Kiwify itself
// retries a late recurring charge for a few days before giving up -- an
// immediate downgrade on the first late notice would punish a customer whose
// card just needs a retry. If the retries keep failing, Kiwify eventually
// sends subscription_canceled, which IS handled above. Late only gets a log.

// Kiwify signs webhooks with HMAC-SHA1 over JSON.stringify(parsedBody),
// delivered as a `signature` query-string param (their own reference
// implementation re-serializes the parsed object rather than hashing raw
// bytes, so we match that exactly). Weaker hash than Mercado Pago's HMAC-
// SHA256, so we compensate with a timing-safe comparison rather than a plain
// string ===, to close the timing side-channel that a raw compare would leave
// open on an otherwise-already-weaker signature.
function isValidSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  let expected: string;
  try {
    const parsed = JSON.parse(rawBody);
    expected = createHmac("sha1", secret).update(JSON.stringify(parsed)).digest("hex");
  } catch {
    return false;
  }
  const expectedBuf = Buffer.from(expected, "utf8");
  const givenBuf = Buffer.from(signature, "utf8");
  return expectedBuf.length === givenBuf.length && timingSafeEqual(expectedBuf, givenBuf);
}

type SupabaseAdmin = ReturnType<typeof getSupabaseAdmin>;

// Kiwify has no external_reference field. We attach the brique.gg user id as
// the `src` tracking param on the checkout link (see create-checkout), which
// Kiwify echoes back in tracking.src -- prefer that when it's a real profile
// id. Otherwise fall back to matching by email.
// KNOWN LIMITATION: both `src` and the checkout email are plain query-string
// params on a client-visible URL (Kiwify has no API to create an opaque,
// server-bound checkout session like Mercado Pago's `init_point`), so a user
// could in principle edit either before paying and misdirect the grant to a
// different account. Given this only ever grants a R$19,90/mo feature flag
// (no funds move through brique.gg either way) and is trivially reversible by
// hand, that risk is accepted rather than engineered around.
async function resolveUserId(
  supabaseAdmin: SupabaseAdmin,
  sale: KiwifySale
): Promise<string | null> {
  const src = sale.tracking?.src;
  if (src && UUID_RE.test(src)) {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", src)
      .maybeSingle();
    if (profile) return profile.id;
  }

  const email = sale.customer?.email;
  if (!email) return null;
  const { data: userId } = await supabaseAdmin.rpc("get_user_id_by_email", {
    target_email: email,
  });
  return (userId as string | null) ?? null;
}

// Kiwify calls this route directly (no session, no cookies). Nothing here is
// trusted until the signature check passes -- and even after that, the sale
// is re-fetched fresh from the Kiwify API rather than read off the
// notification body, since the body carries no signed guarantee of its own
// contents beyond order_id/event_type.
export async function POST(request: NextRequest) {
  const secret = process.env.KIWIFY_WEBHOOK_TOKEN;
  if (!secret) {
    console.error("[kiwify-webhook] KIWIFY_WEBHOOK_TOKEN não configurada");
    return NextResponse.json({ error: "not configured" }, { status: 500 });
  }

  const signature = request.nextUrl.searchParams.get("signature");
  const rawBody = await request.text();

  if (!isValidSignature(rawBody, signature, secret)) {
    console.warn("[kiwify-webhook] assinatura inválida");
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let payload: {
    order_id?: string;
    webhook_event_type?: string;
    subscription_id?: string;
  };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const eventType = payload.webhook_event_type;
  if (!eventType || !payload.order_id) {
    return NextResponse.json({ received: true });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const sale = await getKiwifySale(payload.order_id);

    const userId = await resolveUserId(supabaseAdmin, sale);
    if (!userId) {
      console.warn("[kiwify-webhook] não achou usuário pra sale", {
        orderId: payload.order_id,
        eventType,
      });
      return NextResponse.json({ received: true });
    }

    if (GRANT_EVENTS.has(eventType)) {
      if (sale.status !== "paid") {
        console.warn("[kiwify-webhook] evento de grant mas sale não está paga", {
          orderId: sale.id,
          status: sale.status,
          eventType,
        });
        return NextResponse.json({ received: true });
      }

      // Idempotency: Kiwify retries notifications up to 5x. If this exact
      // order id was already applied, skip.
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("subscribed_at, kiwify_last_order_id")
        .eq("id", userId)
        .single();

      if (profile?.kiwify_last_order_id === sale.id) {
        return NextResponse.json({ received: true, duplicate: true });
      }

      await supabaseAdmin
        .from("profiles")
        .update({
          ...(profile && !profile.subscribed_at
            ? { subscribed_at: new Date().toISOString().slice(0, 10) }
            : {}),
          locked_price: CURRENT_PRO_PRICE,
          kiwify_last_order_id: sale.id,
          kiwify_subscription_id: payload.subscription_id ?? null,
          kiwify_subscription_status: "active",
        })
        .eq("id", userId);
    } else if (REVOKE_EVENTS.has(eventType)) {
      // Default-deny: anything other than an active subscription means no
      // PRO. Guarded by kiwify_subscription_id (when present) so a stale
      // event about a since-replaced subscription can't clobber a newer one.
      const updateQuery = supabaseAdmin
        .from("profiles")
        .update({ subscribed_at: null, kiwify_subscription_status: eventType })
        .eq("id", userId);
      await (payload.subscription_id
        ? updateQuery.eq("kiwify_subscription_id", payload.subscription_id)
        : updateQuery);
    } else if (eventType === "order_rejected") {
      // Structured log so a decline reason is available from server logs
      // without a manual API lookup -- same pattern as the Mercado Pago
      // integration. No card data, just Kiwify's own rejection-reason enum.
      console.warn("[kiwify-webhook] compra recusada", {
        orderId: sale.id,
        userId,
        card_rejection_reason: sale.card_rejection_reason ?? null,
      });
    } else if (eventType === "subscription_late") {
      console.warn("[kiwify-webhook] assinatura atrasada -- mantendo PRO, sem rebaixe", {
        orderId: sale.id,
        userId,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[kiwify-webhook] erro ao processar notificação", error);
    // Non-2xx so Kiwify retries -- never silently swallow a real processing
    // failure as if it succeeded.
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
}
