'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!user) return <div className={styles.dashboard}>Carregando...</div>;

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={`${styles.title} heading-display`}>Painel de Controle</h1>
        <button onClick={handleLogout} className={styles.logoutBtn}>Sair</button>
      </header>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} glass-panel`}>
          <span className={styles.statTitle}>Agendamentos Hoje</span>
          <span className={styles.statValue}>5</span>
        </div>
        <div className={`${styles.statCard} glass-panel`}>
          <span className={styles.statTitle}>Faturamento (Semana)</span>
          <span className={styles.statValue}>R$ 450</span>
        </div>
        <div className={`${styles.statCard} glass-panel`}>
          <span className={styles.statTitle}>Clientes Ativos</span>
          <span className={styles.statValue}>120</span>
        </div>
      </div>

      <section className={styles.tableSection}>
        <h2 className="heading-display" style={{ fontSize: '1.5rem' }}>Próximos Agendamentos</h2>
        <div className={`${styles.tableContainer} glass-panel`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Serviço</th>
                <th>Data / Hora</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>João Silva</td>
                <td>Corte Clássico</td>
                <td>Hoje, 14:30</td>
                <td style={{ color: 'var(--accent-color)' }}>Confirmado</td>
              </tr>
              <tr>
                <td>Carlos Mendes</td>
                <td>Combo (Corte + Barba)</td>
                <td>Hoje, 16:00</td>
                <td style={{ color: 'var(--accent-color)' }}>Confirmado</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
