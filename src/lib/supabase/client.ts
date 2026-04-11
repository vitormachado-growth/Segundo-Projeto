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
    if (typeof window !== 'undefined') {
      console.error('[Supabase Client] CRITICAL: Environment variables NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing!')
    }
    return dummyClient
  }

  return createBrowserClient(url, key, {
    auth: {
      // PKCE é o padrão e mais robusto. 
      // O Supabase JS lida com o code_verifier via localStorage automaticamente.
      flowType: 'pkce',
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
}
