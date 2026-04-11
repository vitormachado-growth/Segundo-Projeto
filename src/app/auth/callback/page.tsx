'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addLog = (msg: string) => {
    console.log(`[AuthCallback] ${msg}`);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
  };

  useEffect(() => {
    const supabase = createClient();
    let redirected = false;

    const redirect = async (user: any) => {
      if (redirected) return;
      redirected = true;
      addLog('Usuário identificado! Verificando permissões...');

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      addLog(`Role detectado: ${profile?.role || 'user'}. Redirecionando...`);
      if (profile?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    };

    const handleAuth = async () => {
      addLog('Iniciando verificação de autenticação...');
      addLog(`URL Atual: ${window.location.href}`);

      // 1. Tenta pegar o código da URL (PKCE)
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      
      if (code) {
        addLog('Código PKCE encontrado. Trocando por sessão...');
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (!exchangeError && data.user) {
          addLog('Troca de código bem-sucedida!');
          await redirect(data.user);
          return;
        } else {
          addLog(`Erro na troca de código: ${exchangeError?.message || 'Erro desconhecido'}`);
        }
      }

      // 2. Tenta pegar do Hash (Implicit / Fallback)
      if (window.location.hash.includes('access_token')) {
        addLog('Parâmetros de token encontrados no Fragmento (#hash)!');
        addLog('Aguardando o Supabase processar o fragmento automaticamente...');
      }

      // 3. Verifica sessão imediata
      const { data: { session } } = await supabase.auth.getSession() as { data: { session: Session | null } };
      if (session?.user) {
        addLog('Sessão ativa detectada via getSession!');
        await redirect(session.user);
        return;
      }

      // 4. Listener de mudanças de estado
      addLog('Aguardando evento de login do Supabase...');
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
        addLog(`Evento recebido: ${event}`);
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          await redirect(session.user);
        }
      });

      // Timeout de segurança (Aumentado para 15s)
      const timeout = setTimeout(() => {
        if (!redirected) {
          addLog('⚠ ERRO: Tempo limite atingido.');
          setError('Não foi possível identificar sua sessão. Verifique se o link de retorno no Supabase inclui a barra final: /auth/callback/');
        }
      }, 15000);

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
      padding: '1.5rem',
      fontFamily: 'monospace'
    }}>
      <div style={{ maxWidth: '600px', width: '100%', background: '#1a1a1a', padding: '2rem', borderRadius: '1rem', border: '1px solid #333' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{error ? '⚠' : '⚙'}</div>
          <h2 style={{ color: error ? '#ff4d4d' : '#d4af37', marginBottom: '0.5rem' }}>
            {error ? 'Falha na Autenticação' : 'Diagnosticando Autenticação...'}
          </h2>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Modo de Recuperação de Sessão</p>
        </div>
        
        <div style={{ background: '#000', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto', fontSize: '12px' }}>
          {logs.map((log, i) => (
            <div key={i} style={{ marginBottom: '4px', borderLeft: '2px solid #333', paddingLeft: '8px', color: log.includes('ERRO') ? '#ff4d4d' : '#aaa' }}>
              {log}
            </div>
          ))}
        </div>

        {error && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ccc', marginBottom: '1.5rem' }}>{error}</p>
            <button 
              onClick={() => router.push('/login')}
              style={{ width: '100%', padding: '1rem', background: '#d4af37', border: 'none', color: '#000', fontWeight: 'bold', borderRadius: '0.5rem', cursor: 'pointer' }}
            >
              Tentar Novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
