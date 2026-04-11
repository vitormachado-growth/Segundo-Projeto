'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Processando autenticação...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let redirected = false;

    const redirect = async (user: any) => {
      if (redirected) return;
      redirected = true;

      setStatus('Verificando permissões...');

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      setStatus('Redirecionando...');

      if (profile?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    };

    // Ouve o evento de login — funciona tanto para implicit quanto para PKCE
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        await redirect(session.user);
      }
    });

    // Fallback: verifica se a sessão já existe (ex: reload da página de callback)
    supabase.auth.getSession().then(async ({ data: { session } }: { data: { session: Session | null } }) => {
      if (session?.user) {
        await redirect(session.user);
      }
    });

    // Timeout de segurança: se em 8s não houver sessão, redireciona para login
    const timeout = setTimeout(() => {
      if (!redirected) {
        setError('Não foi possível autenticar. Tente novamente.');
        setTimeout(() => router.push('/login?error=timeout'), 3000);
      }
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontFamily: 'sans-serif',
      padding: '2rem',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        {!error ? (
          <>
            <div style={{
              width: '56px',
              height: '56px',
              border: '4px solid rgba(212,175,55,0.2)',
              borderTop: '4px solid #d4af37',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1.5rem',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Autenticando...
            </h2>
            <p style={{ color: '#888' }}>{status}</p>
          </>
        ) : (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#ff4444' }}>
              Erro na autenticação
            </h2>
            <p style={{ color: '#888', marginBottom: '1rem' }}>{error}</p>
            <p style={{ color: '#555', fontSize: '0.875rem' }}>Redirecionando para o login...</p>
          </>
        )}
      </div>
    </div>
  );
}
