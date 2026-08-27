import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Kiwify has no API to generate a personalized checkout link -- the link is
// fixed per plan (copied from the Kiwify dashboard). We attach the user's
// email (pre-fills the checkout, doubles as the join key the webhook uses to
// find the profile) and `src` (the user id, a documented Kiwify tracking
// param that comes back verbatim in the webhook's TrackingParameters/tracking
// object) so the webhook can match without relying on email alone.
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  const base = process.env.KIWIFY_CHECKOUT_URL;
  if (!base) {
    console.error("[kiwify] KIWIFY_CHECKOUT_URL não configurada");
    return NextResponse.json({ error: "falha ao iniciar assinatura" }, { status: 502 });
  }

  const url = new URL(base);
  url.searchParams.set("email", user.email);
  url.searchParams.set("src", user.id);

  return NextResponse.json({ checkoutUrl: url.toString() });
}
