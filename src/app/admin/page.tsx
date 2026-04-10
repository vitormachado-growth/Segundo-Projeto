'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

type Profile = {
  full_name: string | null;
  email: string | null;
  role: string;
  created_at: string;
};

type User = {
  id: string;
  email?: string;
};

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
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

      // Verifica se é admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setCurrentUser(user);

      // Busca todos os perfis (apenas admins têm acesso)
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('full_name, email, role, created_at')
        .order('created_at', { ascending: false });

      setProfiles(allProfiles || []);
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
        <p>Carregando painel admin...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.adminBadge}>👑 Admin</span>
          <h1 className={`${styles.title} heading-display`}>Painel Administrativo</h1>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.userEmail}>{currentUser?.email}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>Sair</button>
        </div>
      </header>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} glass-panel`}>
          <span className={styles.statTitle}>Total de Usuários</span>
          <span className={styles.statValue}>{profiles.length}</span>
        </div>
        <div className={`${styles.statCard} glass-panel`}>
          <span className={styles.statTitle}>Admins</span>
          <span className={styles.statValue}>
            {profiles.filter(p => p.role === 'admin').length}
          </span>
        </div>
        <div className={`${styles.statCard} glass-panel`}>
          <span className={styles.statTitle}>Usuários Padrão</span>
          <span className={styles.statValue}>
            {profiles.filter(p => p.role === 'user').length}
          </span>
        </div>
      </div>

      <section className={styles.tableSection}>
        <h2 className="heading-display" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Usuários Cadastrados
        </h2>
        <div className={`${styles.tableContainer} glass-panel`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Função</th>
                <th>Cadastrado em</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile, index) => (
                <tr key={index}>
                  <td>{profile.full_name || '—'}</td>
                  <td>{profile.email || '—'}</td>
                  <td>
                    <span className={profile.role === 'admin' ? styles.badgeAdmin : styles.badgeUser}>
                      {profile.role === 'admin' ? '👑 Admin' : '👤 Usuário'}
                    </span>
                  </td>
                  <td>{new Date(profile.created_at).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
