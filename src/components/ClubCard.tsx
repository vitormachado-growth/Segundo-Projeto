import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import styles from './ClubCard.module.css';

interface ClubCardProps {
  title: string;
  price: string;
  variant: 'bronze' | 'silver' | 'gold';
  isPopular?: boolean;
  features: string[];
}

const ClubCard: React.FC<ClubCardProps> = ({ title, price, variant, isPopular, features }) => {
  // Select the appropriate CSS classes based on the variant prop
  const headerClass = 
    variant === 'bronze' ? styles.headerBronze :
    variant === 'silver' ? styles.headerSilver :
    styles.headerGold;
    
  const btnClass = 
    variant === 'bronze' ? styles.btnBronze :
    variant === 'silver' ? styles.btnSilver :
    styles.btnGold;

  return (
    <div className={styles.cardContainer}>
      {/* Header Section */}
      <div className={`${styles.header} ${headerClass}`}>
        {isPopular && <div className={styles.popularBadge}>POPULAR</div>}
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.priceContainer}>
          <span className={styles.currency}>R$</span>
          <span className={styles.price}>{price}</span>
          <span className={styles.period}>/mês</span>
        </div>
      </div>

      {/* Body Section */}
      <div className={styles.body}>
        <div className={styles.featuresList}>
          {features.map((feature, idx) => (
            <div key={idx} className={styles.featureItem}>
              <CheckCircle2 size={20} strokeWidth={2.5} />
              <span className={styles.featureText}>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className={styles.footer}>
        <Link href={`https://wa.me/5521997227400?text=Ola,%20gostaria%20de%20assinar%20o%20plano%20${title}`} className={`${styles.subscribeBtn} ${btnClass}`}>
          Eu Quero Este
        </Link>
      </div>
    </div>
  );
};

export default ClubCard;
