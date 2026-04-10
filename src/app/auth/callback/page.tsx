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
        console.log('[Auth Callback] URL:', window.location.href);

        // No fluxo Implicit, o token vem no HASH da URL (#access_token=...)
        // O Supabase JS detecta automaticamente o hash e cria a sessão
        const hash = window.location.hash;
        console.log('[Auth Callback] Hash:', hash ? 'presente' : 'ausente');

        // Aguarda um momento para o Supabase processar o hash
        setStatus('Processando autenticação...');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verifica se a sessão foi criada com sucesso
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('[Auth Callback] Session:', !!session, sessionError?.message);

        if (session) {
          setStatus('Sessão criada! Redirecionando...');
          router.push('/dashboard');
          return;
        }

        // Verifica se há erro no hash (ex: #error=access_denied)
        const params = new URLSearchParams(hash.replace('#', ''));
        const errorParam = params.get('error');
        const errorDesc = params.get('error_description');

        if (errorParam) {
          setError(`Erro OAuth: ${errorDesc || errorParam}`);
          setTimeout(() => router.push('/login?error=oauth_error'), 3000);
          return;
        }

        // Fallback: tenta a query string (caso venha como ?code= em PKCE)
        const code = new URLSearchParams(window.location.search).get('code');
        if (code) {
          setStatus('Trocando código por sessão...');
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (data?.session) {
            router.push('/dashboard');
            return;
          }
          if (exchangeError) {
            setError(`Erro: ${exchangeError.message}`);
            setTimeout(() => router.push('/login?error=exchange_failed'), 3000);
            return;
          }
        }

        setError('Nenhuma sessão encontrada. Tente novamente.');
        setTimeout(() => router.push('/login?error=no_session'), 3000);

      } catch (err: any) {
        console.error('[Auth Callback] Erro:', err);
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
