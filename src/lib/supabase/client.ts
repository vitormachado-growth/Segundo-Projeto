import { createBrowserClient } from '@supabase/ssr'

// Cliente dummy para evitar erros durante o build quando as variáveis não estão disponíveis
const dummyClient = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Build time' } }),
    signInWithOAuth: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    exchangeCodeForSession: async () => ({ data: null, error: null }),
  },
} as any

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn('[Supabase Client] Variáveis de ambiente ausentes — usando cliente dummy (build time)')
    return dummyClient
  }

  return createBrowserClient(url, key, {
    auth: {
      // Usa fluxo Implicit ao invés de PKCE
      // PKCE requer armazenar o code_verifier que se perde em sites estáticos
      flowType: 'implicit',
    },
  })
}
