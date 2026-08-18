import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPreApprovalClient } from "@/lib/mercadopago";
import { CURRENT_PRO_PRICE } from "@/lib/proPricing";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  const origin = request.nextUrl.origin;

  try {
    // No `status` field: omitting it means MercadoPago's hosted checkout
    // (init_point) collects the payment method itself (card and, if enabled
    // on the account, PIX Automático) -- this is the Checkout Pro-style
    // redirect flow, not a direct card_token_id charge.
    const preapproval = await getPreApprovalClient().create({
      body: {
        reason: "brique.gg PRO",
        external_reference: user.id,
        payer_email: user.email,
        back_url: `${origin}/painel/assinatura/sucesso`,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: CURRENT_PRO_PRICE,
          currency_id: "BRL",
        },
      },
    });

    if (!preapproval.init_point) {
      console.error("[mercadopago] preapproval sem init_point", preapproval);
      return NextResponse.json({ error: "falha ao iniciar assinatura" }, { status: 502 });
    }

    return NextResponse.json({ checkoutUrl: preapproval.init_point });
  } catch (error) {
    console.error("[mercadopago] erro ao criar preapproval", error);
    return NextResponse.json({ error: "falha ao iniciar assinatura" }, { status: 502 });
  }
}
