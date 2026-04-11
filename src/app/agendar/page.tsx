import Navbar from '@/components/Navbar';
import CalEmbed from '@/components/CalEmbed';
import ScrollReveal from '@/components/ScrollReveal';
import styles from './page.module.css';

export const metadata = {
  title: "Agendamento | VT'S BARBER",
  description: "Reserve seu horário na melhor barbearia com facilidade.",
};

export default function AgendarPage() {
  // Placeholder link as discussed
  const calLink = "vitor-machado-yu2zua";

  return (
    <main className={styles.main}>
      <Navbar />
      
      <section className={styles.hero}>
        <div className={styles.container}>
          <ScrollReveal animation="fade-up">
            <div className={styles.header}>
              <h1 className={`${styles.title} heading-display text-gradient`}>
                RESERVE SEU HORÁRIO
              </h1>
              <p className={styles.subtitle}>
                Escolha o melhor momento para você. Rápido, prático e sem filas.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <div className={styles.calendarWrapper}>
              <CalEmbed calLink={calLink} />
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={400}>
            <div className={styles.infoBox}>
              <p>
                <strong>Dica:</strong> Após agendar, você receberá uma confirmação por e-mail com todos os detalhes.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
