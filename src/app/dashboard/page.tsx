'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';

type Profile = {
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Busca perfil do usuário
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, role, created_at')
        .eq('id', user.id)
        .single();

      // Prepara dados com fallback para o que vem do Auth
      const enhancedProfile: Profile = {
        full_name: profileData?.full_name || user.user_metadata?.full_name || 'Cliente',
        email: user.email || null,
        avatar_url: profileData?.avatar_url || user.user_metadata?.avatar_url || null,
        role: profileData?.role || 'user',
        created_at: profileData?.created_at || user.created_at,
      };

      // Se for admin, redireciona para o painel admin
      if (enhancedProfile.role === 'admin') {
        router.push('/admin');
        return;
      }

      setProfile(enhancedProfile);
      setLoading(false);
    };

    init();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Função para calcular tempo de membro de forma amigável
  const getMembershipDuration = (dateString: string) => {
    const start = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'Hoje';
    if (diffDays === 1) return '1 dia';
    if (diffDays < 30) return `${diffDays} dias`;
    
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return '1 mês';
    if (diffMonths < 12) return `${diffMonths} meses`;
    
    const diffYears = Math.floor(diffMonths / 12);
    return diffYears === 1 ? '1 ano' : `${diffYears} anos`;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Carregando...</p>
      </div>
    );
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'Cliente';
  const memberDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';
  
  const duration = profile?.created_at ? getMembershipDuration(profile.created_at) : '';

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <div className={styles.logoCircle}>
            <img 
              src="/vts-barber-logo.jpg" 
              alt="VT'S BARBER" 
              className={styles.logoImg} 
            />
          </div>
        </Link>
        <div className={styles.headerRight}>
          <span className={styles.userEmail}>{profile?.email}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>Sair</button>
        </div>
      </header>

      {/* Boas-vindas */}
      <section className={styles.welcomeSection}>
        <div className={`${styles.welcomeCard} glass-panel`}>
          <div className={styles.avatarCircle}>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className={styles.avatarImg} />
            ) : (
              <span className={styles.avatarInitial}>
                {firstName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h2 className={styles.welcomeTitle}>Olá, {firstName}! 👋</h2>
            <p className={styles.welcomeSub}>Membro há {duration}</p>
          </div>
        </div>
      </section>

      {/* Ações rápidas */}
      <section className={styles.actionsSection}>
        <h2 className={`heading-display ${styles.sectionTitle}`}>O que você deseja fazer?</h2>
        <div className={styles.actionsGrid}>
          <Link href="/servicos" className={`${styles.actionCard} glass-panel`}>
            <span className={styles.actionIcon}>✂️</span>
            <span className={styles.actionLabel}>Ver Serviços</span>
            <span className={styles.actionDesc}>Cortes, barba e combos disponíveis</span>
          </Link>
          <Link href="/clube" className={`${styles.actionCard} glass-panel`}>
            <span className={styles.actionIcon}>⭐</span>
            <span className={styles.actionLabel}>Clube VIP</span>
            <span className={styles.actionDesc}>Benefícios exclusivos para membros</span>
          </Link>
          <Link href="/agendar" className={`${styles.actionCard} glass-panel`}>
            <span className={styles.actionIcon}>📅</span>
            <span className={styles.actionLabel}>Agendar Horário</span>
            <span className={styles.actionDesc}>Escolha sua data e serviço</span>
          </Link>
        </div>
      </section>

      {/* Info do perfil */}
      <section className={styles.profileSection}>
        <h2 className={`heading-display ${styles.sectionTitle}`}>Meu Perfil</h2>
        <div className={`${styles.profileCard} glass-panel`}>
          <div className={styles.profileRow}>
            <span className={styles.profileLabel}>Nome</span>
            <span className={styles.profileValue}>{profile?.full_name || '—'}</span>
          </div>
          <div className={styles.profileRow}>
            <span className={styles.profileLabel}>E-mail</span>
            <span className={styles.profileValue}>{profile?.email || '—'}</span>
          </div>
          <div className={styles.profileRow}>
            <span className={styles.profileLabel}>Tipo de conta</span>
            <span className={styles.profileValue}>
              <span className={styles.badgeUser}>👤 Cliente</span>
            </span>
          </div>
          <div className={styles.profileRow} style={{ border: 'none' }}>
            <span className={styles.profileLabel}>Membro desde</span>
            <span className={styles.profileValue}>{memberDate} ({duration})</span>
          </div>
        </div>
      </section>

      {/* Acesso Administrativo (Nova Seção) */}
      <section className={styles.adminSection} style={{ marginTop: '4rem', paddingBottom: '4rem' }}>
        <div 
          onClick={() => (document.getElementById('admin-input-group') as HTMLElement).style.display = 'block'}
          style={{ cursor: 'pointer', textAlign: 'center', opacity: 0.3 }}
        >
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.2rem', color: '#444' }}>ÁREA ADMINISTRATIVA</p>
        </div>
        
        <div id="admin-input-group" style={{ display: 'none', marginTop: '1.5rem', animation: 'fadeIn 0.5s ease-out' }}>
          <div className="glass-panel" style={{ maxWidth: '400px', margin: '0 auto', padding: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#d4af37', marginBottom: '1rem', fontWeight: 'bold' }}>INSIRA A CHAVE DE ACESSO</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="password" 
                id="admin-secret-key"
                placeholder="••••••••"
                className="input-field"
                style={{ flex: 1, margin: 0, height: '45px' }}
              />
              <button 
                onClick={async () => {
                  const key = (document.getElementById('admin-secret-key') as HTMLInputElement).value;
                  if (key === 'Flutreta4#') {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                      await supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id);
                      window.location.href = '/admin';
                    }
                  } else {
                    alert('Chave incorreta');
                  }
                }}
                className="btn-primary"
                style={{ padding: '0 1.5rem', height: '45px', margin: 0 }}
              >
                Ativar
              </button>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </section>
    </div>
  );
}
