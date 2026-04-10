import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Cliente dummy para fase de build onde as variáveis de ambiente não estão disponíveis
const dummyClient = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    exchangeCodeForSession: async () => ({ data: null, error: null }),
  },
} as any

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Retorna um cliente dummy durante o build para evitar erros de pré-renderização
  if (!url || !key) {
    console.warn('[Supabase Server] Variáveis de ambiente ausentes — usando cliente dummy (build time)')
    return dummyClient
  }

  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Chamado de um Server Component — pode ser ignorado se o middleware
          // estiver atualizando as sessões de usuário.
        }
      },
    },
  })
}
