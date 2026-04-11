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

    const handleAuth = async () => {
      // 1. Tenta pegar o código da URL (Fluxo PKCE padrão)
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      
      console.log('[AuthCallback] Iniciando verificação...', { 
        hasCode: !!code, 
        hash: window.location.hash ? 'Presente' : 'Vazio' 
      });

      if (code) {
        setStatus('Trocando código por sessão...');
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        console.log('[AuthCallback] Resposta exchangeCode:', { 
          success: !exchangeError, 
          user: !!data.user 
        });
        
        if (!exchangeError && data.user) {
          await redirect(data.user);
          return;
        }
      }

      // 2. Fallback: verifica se o Supabase já processou a sessão (ex: via hash no Implicit)
      const { data: { session } } = await supabase.auth.getSession() as { data: { session: Session | null } };
      console.log('[AuthCallback] Verificação getSession:', { hasSession: !!session });
      
      if (session?.user) {
        await redirect(session.user);
        return;
      }

      // 3. Listener: aguarda o evento de login caso o Supabase ainda esteja processando
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
        console.log('[AuthCallback] Evento disparado:', event, { hasUser: !!session?.user });
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          await redirect(session.user);
        }
      });

      // Timeout de segurança: se em 10s não houver nada, algo falhou feio
      const timeout = setTimeout(() => {
        if (!redirected) {
          setError('Tempo limite atingido. Certifique-se de que as chaves do Supabase estão corretas no Cloudflare.');
          setTimeout(() => router.push('/login?error=timeout'), 4000);
        }
      }, 10000);

      return () => {
        subscription.unsubscribe();
        clearTimeout(timeout);
      };
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
