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
        .select('full_name, email, avatar_url, role, created_at')
        .eq('id', user.id)
        .single();

      // Se for admin, redireciona para o painel admin
      if (profileData?.role === 'admin') {
        router.push('/admin');
        return;
      }

      setProfile(profileData);
      setLoading(false);
    };

    init();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
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
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : '—';

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
            <p className={styles.welcomeSub}>Membro desde {memberSince}</p>
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
            <span className={styles.profileValue}>{memberSince}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
