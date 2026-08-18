import { createClient } from "@supabase/supabase-js";

// service_role bypasses RLS entirely. Import this ONLY from server-only code
// (API routes, webhook handlers) that has already independently verified the
// caller's authorization -- never expose this client or the underlying key
// to the browser.
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada");
  }
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
