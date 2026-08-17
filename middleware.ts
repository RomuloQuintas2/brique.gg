import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

function randomNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

export async function middleware(request: NextRequest) {
  const nonce = randomNonce();
  const isDev = process.env.NODE_ENV === "development";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseHost = supabaseUrl.replace(/^https?:\/\//, "");
  const supabaseWs = supabaseHost ? `wss://${supabaseHost}` : "";

  // Next.js App Router streams RSC payloads via inline <script> tags
  // (self.__next_f.push(...)), so script-src needs a per-request nonce rather
  // than a static policy -- confirmed by inspecting a real `next build` output.
  // strict-dynamic lets scripts loaded by a nonced script also run, without
  // needing to allowlist every chunk URL by hash.
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self' ${supabaseUrl} ${supabaseWs}${isDev ? " ws://localhost:* http://localhost:*" : ""}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = await updateSession(request, requestHeaders);
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
