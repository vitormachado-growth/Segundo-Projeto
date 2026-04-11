'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import styles from './page.module.css'; // Vou criar este arquivo depois ou usar inline

export default function SetupPage() {
  const router = useRouter();
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  // Defina o código aqui (poderia vir de env, mas como é build estático, aqui é mais seguro para o usuário)
  const SECRET_ADMIN_CODE = 'Flutreta4#';

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Aguarda 2 segundos e tenta de novo antes de desistir (resiliência para conexões lentas)
        console.log('[Setup] Sessão não encontrada, tentando novamente em 2s...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const { data: { user: retryUser } } = await supabase.auth.getUser();
        if (!retryUser) {
          console.warn('[Setup] Segunda tentativa falhou, redirecionando para login.');
          router.push('/login?error=session_not_found');
          return;
        }
        setUser(retryUser);
        return;
      }
      setUser(user);
    };
    checkUser();
  }, [router, supabase]);

  const handleBecomeAdmin = async () => {
    if (adminCode !== SECRET_ADMIN_CODE) {
      setError('Código administrativo incorreto.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);

      if (updateError) throw updateError;

      router.push('/admin');
    } catch (err: any) {
      setError('Erro ao atualizar perfil: ' + err.message);
      setLoading(false);
    }
  };

  const handleBecomeUser = async () => {
    // Por padrão já é 'user', então apenas redirecionamos
    router.push('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: 'rgba(26, 26, 26, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '3rem',
        borderRadius: '1.5rem',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}>
        <h1 style={{ 
          fontSize: '1.8rem', 
          fontWeight: '300', 
          letterSpacing: '0.2rem', 
          color: '#d4af37',
          marginBottom: '1rem' 
        }}>
          BEM-VINDO
        </h1>
        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
          Para começar, selecione como deseja utilizar a plataforma.
        </p>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Opção Cliente */}
          <button 
            onClick={handleBecomeUser}
            style={{
              padding: '1.2rem',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.8rem',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontWeight: 'bold', fontSize: '1rem', color: '#fff' }}>👤 Continuar como Cliente</span>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>Quero agendar serviços e ver meu histórico.</span>
          </button>

          <div style={{ height: '1px', background: 'rgba(212, 175, 55, 0.1)', margin: '0.5rem 0' }} />

          {/* Opção Admin */}
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.8rem', color: '#d4af37', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              POSSUI CÓDIGO ADMINISTRATIVO?
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="password"
                placeholder="Insira o código..."
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                style={{
                  flex: 1,
                  background: '#000',
                  border: '1px solid #333',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  color: 'white',
                  outline: 'none'
                }}
              />
              <button 
                onClick={handleBecomeAdmin}
                disabled={loading || !adminCode}
                style={{
                  padding: '0 1.5rem',
                  background: '#d4af37',
                  color: 'black',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: (loading || !adminCode) ? 'not-allowed' : 'pointer',
                  opacity: (loading || !adminCode) ? 0.5 : 1
                }}
              >
                {loading ? '...' : 'Ativar'}
              </button>
            </div>
            {error && <p style={{ color: '#ff4d4d', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</p>}
          </div>
        </div>

        <p style={{ marginTop: '3rem', color: '#444', fontSize: '0.7rem', letterSpacing: '0.1rem' }}>
          SISTEMA DE GESTÃO - VT'S BARBER
        </p>
      </div>
    </div>
  );
}
