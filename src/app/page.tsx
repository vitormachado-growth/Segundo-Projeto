import Link from 'next/link';
import PricingCard from '@/components/PricingCard';
import Navbar from '@/components/Navbar';
import ScrollReveal from '@/components/ScrollReveal';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import styles from './page.module.css';

export default function Home() {
  const services = [
    { 
      name: 'Corte Clássico', 
      desc: 'Corte na tesoura ou máquina, acabamento perfeito.', 
      price: 'R$ 45',
      image: 'https://i.pinimg.com/736x/77/cd/c0/77cdc077251f36a20c7fd2904e4c29aa.jpg'
    },
    { 
      name: 'Barba Terapia', 
      desc: 'Modelagem com toalha quente e produtos premium.', 
      price: 'R$ 35',
      image: 'https://i.pinimg.com/1200x/05/dd/3c/05dd3cf2cd23cbd788839f275700f9cc.jpg'
    },
    { 
      name: 'Combo (Corte + Barba)', 
      desc: 'O pacote completo para o seu visual.', 
      price: 'R$ 70',
      image: '/combo-corte-barba.png'
    },
    { 
      name: 'Acabamento', 
      desc: 'Pezinho e alinhamento.', 
      price: 'R$ 20',
      image: 'https://i.pinimg.com/736x/12/44/23/124423cf42774e5357d58257319302f5.jpg'
    },
  ];

  const reviews = [
    { 
      name: "Wendell Henrique",
      date: "há 1 dia",
      text: "Um ótimo profissional, atencioso, detalhista, sempre disposto a te entregar o melhor corte e sempre mantendo o bom humor e o respeito no seu espaço."
    },
    { 
      name: "Alex Carvalho",
      date: "há uma semana",
      text: "Ambiente agradável, com excelentes profissionais e um excelente atendimento! Meu filho de 2 aninhos também corta e adora o Vitor e todos."
    },
    { 
      name: "Bruno Xavier",
      date: "há um mês",
      text: "Trabalho excelente ! Extremamente detalhista, tem amor a profissão. O que hoje em dia é difícil, o de costume é o corte de 15 minutos que não tem nenhum detalhe, totalmente diferente do Vitor."
    },
    { 
      name: "Andressa Fernandes",
      date: "há 3 meses",
      text: "O melhor da região, ambiente tranquilo, serviço ótimo, com direito a cervejinha estupidamente gelada, e sinuca. Muito show !"
    }
  ];

  return (
    <main>
      <Navbar />

      <section className={styles.hero}>
        <iframe 
          className={styles.videoBackground}
          src="https://www.youtube.com/embed/peXk9G5pLMc?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&autohide=1&modestbranding=1&playlist=peXk9G5pLMc"
          allow="autoplay; encrypted-media"
          frameBorder="0"
        ></iframe>
        <div className={styles.videoOverlay}></div>

        <div style={{ zIndex: 2, position: 'relative' }}>
          <ScrollReveal animation="fade-up">
            <h1 className={`${styles.title} heading-display text-gradient`}>
              AGENDE SEU <br /> ESTILO
            </h1>
            <p className={styles.subtitle}>
              Sem filas, sem perder tempo. Marque seu horário na melhor barbearia com apenas alguns cliques.
            </p>
            <div className={styles.ctaGroup} style={{ justifyContent: 'center' }}>
              <Link href="/login" className="btn-primary">Agendar Agora</Link>
              <a href="#pricing" className="btn-secondary">Ver Serviços</a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="about" className={styles.aboutSection}>
        <ScrollReveal animation="fade-up">
          <div className={styles.aboutContainer}>
            <div className={styles.aboutVideoContainer}>
              <iframe 
                src="https://www.youtube.com/embed/n4UP1fe9iCg?autoplay=1&mute=1&loop=1&playlist=n4UP1fe9iCg&controls=0&showinfo=0&rel=0" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                className={styles.aboutIframe}
              ></iframe>
            </div>
            <div className={styles.aboutTextContent}>
              <h2 className={`${styles.aboutTitle} heading-display`}>A TRADIÇÃO <br/>ENCONTRA O MODERNO</h2>
              <p className={styles.aboutDesc}>
                A VT'S BARBER nasceu da paixão por cortes clássicos e do desejo de oferecer uma experiência premium autêntica. Mais do que tesouras e navalhas, entregamos um momento de cuidado pessoal em um ambiente onde o luxo e a tradição andam lado a lado.
              </p>
              <p className={styles.aboutDesc}>
                Nossa equipe é formada por especialistas dedicados ao seu visual, garantindo que você saia com a confiança em alta todas as vezes.
              </p>
              <Link href="/clube" className={styles.btnOutlineGold}>
                CONHECER OS PLANOS
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section id="testimonials" className={styles.testimonialsSection}>
        <ScrollReveal animation="fade-up">
          <h2 className={`${styles.sectionTitle} heading-display`}>O QUE DIZEM SOBRE NÓS</h2>
          <TestimonialsCarousel reviews={reviews} />
        </ScrollReveal>
      </section>

      <section id="pricing" className={styles.pricingSection}>
        <ScrollReveal animation="fade-up">
          <h2 className={`${styles.sectionTitle} heading-display`}>Nossos Serviços Principais</h2>
          <div className={styles.pricingTable}>
            {services.map((svc, idx) => (
              <PricingCard 
                key={idx}
                name={svc.name}
                desc={svc.desc}
                price={svc.price}
                image={svc.image}
              />
            ))}
          </div>
          
          <div className={styles.allServicesBtnBlock}>
            <Link href="/servicos" className={styles.btnSolidGold}>
              VER MENU COMPLETO DE SERVIÇOS
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
