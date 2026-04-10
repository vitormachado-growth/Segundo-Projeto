import React from 'react';
import Navbar from '@/components/Navbar';
import ClubCard from '@/components/ClubCard';
import styles from './page.module.css';

export default function ClubePage() {
  return (
    <main className={styles.main}>
      <Navbar />
      
      <section className={styles.clubHeader}>
        <div className={styles.headerOverlay}>
          <h1 className={`${styles.title} heading-display text-gradient`}>ASSINATURAS VIP</h1>
          <p className={styles.subtitle}>
            Escolha o pacote perfeito para manter seu visual sempre alinhado.
          </p>
        </div>
      </section>

      <section className={styles.clubContainer}>
        <div className={styles.clubGrid}>
          <ClubCard 
            title="Maestro Corte Club"
            price="139"
            variant="bronze"
            features={[
              "Cortes de Cabelo Ilimitados",
              "Sobrancelha (Pilha) inclusa",
              "10% de desconto em produtos",
              "Agendamento Prioritário"
            ]}
          />
          <ClubCard 
            title="Maestro Barba Club"
            price="149"
            variant="silver"
            features={[
              "Barboterapia Ilimitada",
              "Acabamento com toalha quente",
              "10% de desconto em produtos",
              "Agendamento Prioritário"
            ]}
          />
          <ClubCard 
            title="Maestro Combo Club"
            price="215"
            variant="gold"
            isPopular={true}
            features={[
              "Corte e Barba Ilimitados",
              "Sobrancelha (Pilha) inclusa",
              "15% de desconto em produtos",
              "Preço fixo garantido",
              "Prioridade máxima na agenda"
            ]}
          />
        </div>
      </section>
    </main>
  );
}
