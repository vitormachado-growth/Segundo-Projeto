'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let redirected = false;

    const redirect = async (user: any) => {
      if (redirected) return;
      redirected = true;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      // Lógica robusta para detectar "Primeira Vez"
      const createdAt = new Date(user.created_at).getTime();
      const lastLogin = new Date(user.last_sign_in_at).getTime();
      // Se a conta foi criada nos últimos 30 segundos, ou se não tem perfil, é novo.
      const isNewUser = !profile || (lastLogin - createdAt < 30000);

      if (isNewUser) {
        router.push('/auth/setup');
      } else if (profile?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    };

    const handleAuth = async () => {
      // Logic remains robust but logs only to console
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      
      if (code) {
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (!exchangeError && data.user) {
          await redirect(data.user);
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession() as { data: { session: Session | null } };
      if (session?.user) {
        await redirect(session.user);
        return;
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          await redirect(session.user);
        }
      });

      const timeout = setTimeout(() => {
        if (!redirected) {
          setError('A autenticação está demorando mais que o esperado. Por favor, tente recarregar a página ou voltar ao login.');
        }
      }, 60000); // 60 segundos de timeout para conexões lentas

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
      backgroundColor: '#0a0a0a', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem',
      fontFamily: 'sans-serif'
    }}>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ 
        textAlign: 'center', 
        animation: 'fadeIn 0.8s ease-out',
        maxWidth: '400px'
      }}>
        {!error ? (
          <>
            <div style={{
              width: '60px',
              height: '60px',
              border: '3px solid rgba(212,175,55,0.1)',
              borderTop: '3px solid #d4af37',
              borderRadius: '50%',
              animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
              margin: '0 auto 2rem'
            }} />
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '300', 
              letterSpacing: '0.1rem',
              color: '#d4af37',
              marginBottom: '0.5rem'
            }}>
              AUTENTICANDO
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Validando suas credenciais com segurança...</p>
          </>
        ) : (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>⚠</div>
            <h2 style={{ color: '#ff4d4d', marginBottom: '1rem' }}>Ops! Algo deu errado</h2>
            <p style={{ color: '#888', marginBottom: '2rem', lineHeight: '1.6' }}>{error}</p>
            <button 
              onClick={() => router.push('/login')}
              style={{ 
                padding: '1rem 2rem', 
                background: 'transparent', 
                border: '1px solid #d4af37', 
                color: '#d4af37', 
                borderRadius: '0.2rem', 
                cursor: 'pointer',
                fontSize: '0.9rem',
                letterSpacing: '0.1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#d4af37';
                e.currentTarget.style.color = '#000';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#d4af37';
              }}
            >
              VOLTAR AO LOGIN
            </button>
          </div>
        )}
      </div>

      <div style={{ 
        position: 'absolute', 
        bottom: '3rem', 
        color: '#222', 
        fontSize: '0.7rem', 
        letterSpacing: '0.2rem' 
      }}>
        VT'S BARBER © 2024
      </div>
    </div>
  );
}
