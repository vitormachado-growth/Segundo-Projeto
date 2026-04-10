'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Iniciando autenticação...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const handleAuth = async () => {
      try {
        // Pega o código de autorização da URL (PKCE flow)
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const errorParam = params.get('error');
        const errorDescription = params.get('error_description');

        console.log('[Auth Callback] URL:', window.location.href);
        console.log('[Auth Callback] Code:', code ? 'presente' : 'ausente');

        if (errorParam) {
          console.error('[Auth Callback] Erro do OAuth:', errorParam, errorDescription);
          setError(`Erro OAuth: ${errorDescription || errorParam}`);
          setTimeout(() => router.push('/login?error=oauth_error'), 3000);
          return;
        }

        if (code) {
          setStatus('Trocando código por sessão...');
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          console.log('[Auth Callback] Exchange result:', { data, exchangeError });

          if (exchangeError) {
            console.error('[Auth Callback] Erro na troca:', exchangeError.message);
            setError(`Erro na autenticação: ${exchangeError.message}`);
            setTimeout(() => router.push('/login?error=exchange_failed'), 3000);
            return;
          }

          if (data.session) {
            setStatus('Sessão criada! Redirecionando...');
            router.push('/dashboard');
            return;
          }
        }

        // Verifica se já tem sessão ativa (fallback)
        setStatus('Verificando sessão existente...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('[Auth Callback] Session check:', { session: !!session, sessionError });

        if (session) {
          setStatus('Sessão encontrada! Redirecionando...');
          router.push('/dashboard');
        } else {
          setError('Nenhuma sessão encontrada. Tente fazer login novamente.');
          setTimeout(() => router.push('/login?error=no_session'), 3000);
        }
      } catch (err: any) {
        console.error('[Auth Callback] Erro inesperado:', err);
        setError(`Erro inesperado: ${err.message}`);
        setTimeout(() => router.push('/login?error=unexpected'), 3000);
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'sans-serif',
        padding: '2rem',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        {!error ? (
          <>
            <div
              style={{
                width: '56px',
                height: '56px',
                border: '4px solid rgba(0,255,128,0.2)',
                borderTop: '4px solid #00ff80',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1.5rem',
              }}
            />
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
