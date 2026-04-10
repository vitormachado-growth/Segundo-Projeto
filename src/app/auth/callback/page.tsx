'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Processando autenticação...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const handleAuth = async () => {
      try {
        // Aguarda o Supabase processar o token do hash (fluxo Implicit)
        await new Promise(resolve => setTimeout(resolve, 800));

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          // Fallback: tenta troca de código (PKCE)
          const code = new URLSearchParams(window.location.search).get('code');
          if (code) {
            setStatus('Trocando código por sessão...');
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeError || !data.session) {
              setError(exchangeError?.message || 'Sessão não encontrada.');
              setTimeout(() => router.push('/login?error=auth_failed'), 3000);
              return;
            }
          } else {
            setError('Nenhuma sessão encontrada. Tente fazer login novamente.');
            setTimeout(() => router.push('/login?error=no_session'), 3000);
            return;
          }
        }

        // Busca o sessão atualizada
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setError('Usuário não encontrado.');
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        // Busca o role do usuário para redirecionar corretamente
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

      } catch (err: any) {
        setError(`Erro inesperado: ${err.message}`);
        setTimeout(() => router.push('/login?error=unexpected'), 3000);
      }
    };

    handleAuth();
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
