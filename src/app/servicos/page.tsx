import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import styles from './page.module.css';

export default function ServicosPage() {
  const serviceCategories = [
    {
      title: "CABELO",
      items: [
        { name: "Corte Clássico", price: "45,00", desc: "Corte tradicional na tesoura ou máquina com finalização." },
        { name: "Fade Artesanal", price: "55,00", desc: "Degradê navalhado perfeito, transição suave." },
        { name: "Corte Infantil", price: "40,00", desc: "Atendimento ágil e paciente para os pequenos." },
        { name: "Camuflagem de Brancos", price: "60,00", desc: "Coloração natural para manter o aspecto jovem." },
      ]
    },
    {
      title: "BARBA",
      items: [
        { name: "Barboterapia", price: "35,00", desc: "Tratamento completo com toalha quente e óleos essenciais." },
        { name: "Modelagem Express", price: "25,00", desc: "Alinhamento e contorno rápido na máquina." },
        { name: "Pigmentação", price: "40,00", desc: "Preenchimento de falhas para uma barba mais cheia e forte." },
      ]
    },
    {
      title: "TRATAMENTOS VIP",
      items: [
        { name: "Sobrancelha na Navalha", price: "15,00", desc: "Limpeza de pelos com acabamento premium." },
        { name: "Limpeza de Pele Express", price: "30,00", desc: "Esfoliação facial e remoção de impurezas superficiais." },
        { name: "Hidratação Profunda", price: "35,00", desc: "Reconstrução capilar para fios ressecados ou desgastados." },
      ]
    },
    {
      title: "COMBOS",
      items: [
        { name: "Combo (Corte + Barba)", price: "70,00", desc: "O clássico completo. Visual alinhado de ponta a ponta." },
        { name: "Combo Master (Corte + Barba + Sobra)", price: "80,00", desc: "Pacote VIP incluindo design de sobrancelha." },
        { name: "Dia do Noivo", price: "190,00", desc: "Tratamento prime com direito a brinde. Agendamento antecipado." },
      ]
    }
  ];

  return (
    <main className={styles.main}>
      {/* Reusing the Main Navbar */}
      <Navbar />

      <section className={styles.headerHero}>
        <div className={styles.heroOverlay}>
          <h1 className={`${styles.title} heading-display text-gradient`}>NOSSO MENU</h1>
          <p className={styles.subtitle}>Conheça nosso cardápio completo de serviços estéticos</p>
        </div>
      </section>

      <section className={styles.menuSection}>
        <div className={styles.menuContainer}>
          {serviceCategories.map((cat, idx) => (
            <div key={idx} className={styles.categoryBlock}>
              <h2 className={styles.categoryTitle}>{cat.title}</h2>
              <div className={styles.servicesList}>
                {cat.items.map((svc, sIdx) => (
                  <div key={sIdx} className={styles.serviceRow}>
                    <div className={styles.serviceHead}>
                      <span className={styles.serviceName}>{svc.name}</span>
                      <span className={styles.dottedLeader}></span>
                      <span className={styles.servicePrice}>R$ {svc.price}</span>
                    </div>
                    {svc.desc && <p className={styles.serviceDesc}>{svc.desc}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className={styles.actionBlock}>
            <Link href="/#pricing" className={styles.btnBack}>
              VOLTAR PARA A PÁGINA INICIAL
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
