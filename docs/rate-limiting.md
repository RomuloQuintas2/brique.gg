# Rate limiting — pronto pra ativar, ainda não ligado

Referência, não código ativo. Nada disso está instalado ou rodando ainda.

## Por que precisa de Redis externo

Vercel Edge Middleware roda em múltiplos edge nodes distribuídos, sem memória
compartilhada entre eles. Um contador em memória local não rate-limita nada de
verdade em produção — cada node teria sua própria contagem, um atacante rotativo
entre nodes nunca bateria o limite. Precisa de estado compartilhado: Upstash
Redis é o padrão pra isso na Vercel (tem free tier, roda em Edge Runtime).

## O que checar antes (nativo do Supabase)

Authentication → Rate Limits no painel do Supabase — confirmar se os limites
nativos de signup/signin/OTP já estão ativos. Isso é uma primeira camada
independente do que for feito aqui, checar antes de assumir que falta tudo.

## Setup quando for ativar

1. Criar conta free em upstash.com, criar um Redis database (região próxima
   da região da Vercel do projeto).
2. Copiar `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`, colar como
   Environment Variables na Vercel (sem prefixo `NEXT_PUBLIC_` — isso é
   server-only, nunca deve ir pro bundle do client).
3. `npm install @upstash/ratelimit @upstash/redis`

## Código de referência (middleware.ts)

```ts
import { type NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { updateSession } from "@/lib/supabase/middleware";

const redis = Redis.fromEnv();

// 5 tentativas por minuto por IP nas rotas de auth. Ajustar conforme uso real
// — apertado demais trava usuário legítimo que erra a senha duas vezes.
const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  prefix: "ratelimit:auth",
});

const RATE_LIMITED_PATHS = ["/login", "/cadastro"];
// Quando o Mercado Pago for integrado, adicionar aqui o path do webhook
// (ex: "/api/webhooks/mercadopago") com um limiter próprio, mais generoso
// (webhooks legítimos podem rajar), mas ainda limitado por IP/origem.

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (request.method === "POST" && RATE_LIMITED_PATHS.includes(pathname)) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { success } = await authLimiter.limit(`${pathname}:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente em instantes." },
        { status: 429 }
      );
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

Nota: login/cadastro atuais chamam `supabase.auth.signInWithPassword`/`signUp`
direto do client (não passam por uma API route própria) — o middleware acima
intercepta pela URL da PÁGINA (`/login`, `/cadastro`), não pela chamada real ao
Supabase, que vai direto pro domínio deles. Isso limita quantas vezes alguém
carrega a página, não quantas vezes chama a API de auth em si — proteção
parcial. Proteção completa da chamada de auth em si depende do rate limit
nativo do Supabase (item acima), que já intercepta a chamada real.
