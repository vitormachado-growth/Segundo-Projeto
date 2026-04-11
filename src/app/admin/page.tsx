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
  const [stats, setStats] = useState({
    activeClients: 0,
    appointmentsToday: 0,
    weeklyBilling: 0
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
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

      // Diagnóstico de Acesso
      console.log('[Admin Access] Iniciando verificação para:', user.id);
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        const errorDetail = profileError ? `Erro: ${profileError.message} (${profileError.code})` : 'A linha não foi encontrada no banco.';
        const msg = `ACESSO NEGADO: Seu cargo é "${profile?.role || 'indefinido'}".`;
        console.error(msg, profileError);
        
        // Injeta o erro na tela com detalhes técnicos
        const debugDiv = document.createElement('div');
        debugDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:red;color:white;padding:2rem;z-index:9999;text-align:center;border-radius:1rem;font-family:sans-serif;box-shadow:0 0 50px rgba(0,0,0,0.5);min-width:320px';
        debugDiv.innerHTML = `
          <h1 style="margin-bottom:1rem;font-size:1.5rem">ERRO DE PERMISSÃO</h1>
          <p style="margin-bottom:1rem">${msg}</p>
          <div style="background:rgba(0,0,0,0.2);padding:1rem;border-radius:0.5rem;font-size:0.8rem;text-align:left;margin-bottom:1rem">
            <strong>Detalhe Técnico:</strong><br/>
            ${errorDetail}
          </div>
          <p style="font-size:0.7rem;opacity:0.8">ID: ${user.id}</p>
        `;
        document.body.appendChild(debugDiv);

        setTimeout(() => {
          router.push('/dashboard');
        }, 8000); // 8 segundos para dar tempo de ler o erro
        return;
      }

      setCurrentUser(user);

      // 1. Busca todos os perfis (para contagem de clientes e lista de usuários)
      // Usamos contagem exata para Clientes Ativos
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('full_name, email, role, created_at')
        .order('created_at', { ascending: false });

      const activeUsers = allProfiles?.filter((p: Profile) => p.role === 'user').length || 0;

      // 2. Busca Agendamentos e Estatísticas (Queries defensivas)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Tenta buscar agendamentos de hoje
      const { data: todayApps, count: todayCount } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact' })
        .gte('data_hora', today.toISOString())
        .lt('data_hora', tomorrow.toISOString());

      // Tenta buscar faturamento da semana
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { data: weekApps } = await supabase
        .from('agendamentos')
        .select('preco')
        .gte('data_hora', weekAgo.toISOString());

      const billing = weekApps?.reduce((acc: number, curr: any) => acc + (Number(curr.preco) || 0), 0) || 0;

      // Busca agendamentos recentes para a tabela
      const { data: latestApps } = await supabase
        .from('agendamentos')
        .select('cliente, servico, data_hora, status')
        .order('data_hora', { ascending: false })
        .limit(5);

      setProfiles(allProfiles || []);
      setStats({
        activeClients: activeUsers,
        appointmentsToday: todayCount || 0,
        weeklyBilling: billing
      });
      setRecentAppointments(latestApps || []);
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
        <p>Carregando painel de controle...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={`${styles.title} heading-display`}>PAINEL DE CONTROLE</h1>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.userEmail}>{currentUser?.email}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>Sair</button>
        </div>
      </header>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} glass-panel`}>
          <span className={styles.statTitle}>Agendamentos Hoje</span>
          <span className={styles.statValue}>{stats.appointmentsToday}</span>
        </div>
        <div className={`${styles.statCard} glass-panel`}>
          <span className={styles.statTitle}>Faturamento (Semana)</span>
          <span className={styles.statValue}>R$ {stats.weeklyBilling}</span>
        </div>
        <div className={`${styles.statCard} glass-panel`}>
          <span className={styles.statTitle}>Clientes Ativos</span>
          <span className={styles.statValue}>{stats.activeClients}</span>
        </div>
      </div>

      <section className={styles.tableSection}>
        <h2 className="heading-display" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
          PRÓXIMOS AGENDAMENTOS
        </h2>
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
              {recentAppointments && recentAppointments.length > 0 ? (
                recentAppointments.map((app, index) => (
                  <tr key={index}>
                    <td>{app.cliente}</td>
                    <td>{app.servico}</td>
                    <td>{new Date(app.data_hora).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                    <td>
                      <span className={styles.statusBadge} data-status={app.status}>
                        {app.status || 'Confirmado'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                    Nenhum agendamento encontrado na tabela 'agendamentos'
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Seção Opcional: Lista de Usuários */}
      <section className={styles.tableSection} style={{ marginTop: '4rem', opacity: 0.8 }}>
        <h2 className="heading-display" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
          Usuários Cadastrados
        </h2>
        <div className={`${styles.tableContainer} glass-panel`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Função</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile, index) => (
                <tr key={index}>
                  <td>{profile.full_name || '—'}</td>
                  <td>{profile.email || '—'}</td>
                  <td>
                    <span className={profile.role === 'admin' ? styles.badgeAdmin : styles.badgeUser}>
                      {profile.role === 'admin' ? '👑 Admin' : '👤 Cliente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
