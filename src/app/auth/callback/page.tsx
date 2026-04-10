'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const handleAuth = async () => {
      // Com o fluxo PKCE do Supabase, o código de autorização vem na query string
      const code = new URLSearchParams(window.location.search).get('code');

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error('Erro ao trocar código por sessão:', error.message);
          router.push('/login?error=auth_failed');
          return;
        }
      }

      // Verifica se já tem sessão ativa (caso o token venha via hash)
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/login?error=auth_failed');
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
      <div style={{ textAlign: 'center' }}>
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
        <p style={{ color: '#888' }}>Aguarde enquanto preparamos o seu acesso.</p>
      </div>
    </div>
  );
}
