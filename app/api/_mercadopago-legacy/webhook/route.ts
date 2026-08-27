// LEGACY / INACTIVE -- payment provider migrated to Kiwify (see
// app/api/kiwify). This folder is prefixed with `_`, which Next.js App
// Router excludes from routing entirely -- /api/mercadopago/* resolves to
// 404, this code cannot run. Kept only in case of rollback.
import { NextResponse, type NextRequest } from "next/server";
import {
  WebhookSignatureValidator,
  InvalidWebhookSignatureError,
} from "mercadopago";
import { getPreApprovalClient, getPaymentClient } from "@/lib/mercadopago";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { CURRENT_PRO_PRICE } from "@/lib/proPricing";

// Mercado Pago calls this route directly (no session, no cookies) whenever a
// preapproval (subscription) or payment changes state. It is public by
// necessity. NOTHING here is trusted until the signature check below passes —
// and even after that, the actual status/amount/owner is re-fetched fresh
// from the Mercado Pago API rather than read off the notification body,
// since the body itself carries no signed guarantee of its own contents.
export async function POST(request: NextRequest) {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[mercadopago-webhook] MERCADOPAGO_WEBHOOK_SECRET não configurada");
    return NextResponse.json({ error: "not configured" }, { status: 500 });
  }

  const dataId = request.nextUrl.searchParams.get("data.id");

  try {
    WebhookSignatureValidator.validate({
      xSignature: request.headers.get("x-signature"),
      xRequestId: request.headers.get("x-request-id"),
      dataId,
      secret,
      toleranceSeconds: 300,
    });
  } catch (error) {
    if (error instanceof InvalidWebhookSignatureError) {
      console.warn("[mercadopago-webhook] assinatura inválida:", error.reason);
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }
    throw error;
  }

  const type = request.nextUrl.searchParams.get("type");
  if (!dataId || (type !== "subscription_preapproval" && type !== "payment")) {
    return NextResponse.json({ received: true });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();

    if (type === "subscription_preapproval") {
      const preapproval = await getPreApprovalClient().get({ id: dataId });
      const userId = preapproval.external_reference;
      if (!userId) {
        console.warn("[mercadopago-webhook] preapproval sem external_reference", dataId);
        return NextResponse.json({ received: true });
      }

      if (preapproval.status === "authorized") {
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("subscribed_at")
          .eq("id", userId)
          .single();

        await supabaseAdmin
          .from("profiles")
          .update({
            // Only set on first authorization -- a later re-authorization of
            // the same preapproval (rare, but possible) shouldn't reset the
            // customer's original subscription date.
            ...(profile && !profile.subscribed_at
              ? { subscribed_at: new Date().toISOString().slice(0, 10) }
              : {}),
            locked_price: CURRENT_PRO_PRICE,
            mp_preapproval_id: preapproval.id,
            mp_subscription_status: preapproval.status,
          })
          .eq("id", userId);
      } else if (preapproval.status === "cancelled" || preapproval.status === "paused") {
        // Default-deny: anything other than an actively authorized preapproval
        // means no PRO access. subscribed_at is what every RLS policy checks
        // (is_company_pro), so clearing it is what actually revokes access.
        await supabaseAdmin
          .from("profiles")
          .update({
            subscribed_at: null,
            mp_subscription_status: preapproval.status,
          })
          .eq("id", userId)
          .eq("mp_preapproval_id", preapproval.id);
      } else {
        await supabaseAdmin
          .from("profiles")
          .update({ mp_subscription_status: preapproval.status ?? null })
          .eq("id", userId)
          .eq("mp_preapproval_id", preapproval.id);
      }
    }

    if (type === "payment") {
      const payment = await getPaymentClient().get({ id: dataId });
      const userId = payment.external_reference;
      if (!userId) {
        console.warn("[mercadopago-webhook] payment sem external_reference", dataId);
        return NextResponse.json({ received: true });
      }

      // Idempotency: Mercado Pago retries notifications. If this exact
      // payment id was already applied, skip -- prevents double-processing
      // on redelivery.
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("subscribed_at, mp_last_payment_id")
        .eq("id", userId)
        .single();

      if (profile && profile.mp_last_payment_id === String(payment.id)) {
        return NextResponse.json({ received: true, duplicate: true });
      }

      if (payment.status === "approved") {
        await supabaseAdmin
          .from("profiles")
          .update({
            ...(profile && !profile.subscribed_at
              ? { subscribed_at: new Date().toISOString().slice(0, 10) }
              : {}),
            locked_price: CURRENT_PRO_PRICE,
            mp_last_payment_id: String(payment.id),
          })
          .eq("id", userId);
      } else {
        // Structured log so a decline reason is available from server logs
        // without a manual GET /v1/payments/{id} lookup later. No card data
        // here -- payment.status_detail is MercadoPago's own decline-reason
        // enum (e.g. cc_rejected_insufficient_amount), not PAN/CVV/etc.
        console.warn("[mercadopago-webhook] payment não aprovado", {
          paymentId: payment.id,
          userId,
          status: payment.status,
          status_detail: payment.status_detail,
          payment_method_id: payment.payment_method_id,
        });
      }
      // Rejected/pending renewal charges are informational only here: a
      // single declined renewal doesn't immediately revoke access. Mercado
      // Pago retries failed subscription charges on its own schedule and
      // eventually cancels the preapproval if they keep failing -- that
      // cancellation arrives as a subscription_preapproval event (handled
      // above) and is what actually revokes PRO.
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[mercadopago-webhook] erro ao processar notificação", error);
    // Non-2xx so Mercado Pago retries -- never silently swallow a real
    // processing failure as if it succeeded.
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
}
