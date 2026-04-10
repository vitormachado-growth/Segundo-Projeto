'use client';
import { useRef, useState, MouseEvent } from 'react';
import styles from './PricingCard.module.css';

interface PricingCardProps {
  name: string;
  desc: string;
  price: string;
  image: string;
}

export default function PricingCard({ name, desc, price, image }: PricingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ rx: 0, ry: 0 });
  const [bgPosition, setBgPosition] = useState({ tx: 0, ty: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element.
    const y = e.clientY - rect.top;  // y position within the element.
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotate card slightly based on mouse position
    const rx = ((y - centerY) / centerY) * -15; // max 15 deg
    const ry = ((x - centerX) / centerX) * 15;
    
    // Move background in the opposite direction for parallax
    const tx = ((x - centerX) / centerX) * -12;
    const ty = ((y - centerY) / centerY) * -12;

    setRotation({ rx, ry });
    setBgPosition({ tx, ty });
  };

  const handleMouseLeave = () => {
    setRotation({ rx: 0, ry: 0 });
    setBgPosition({ tx: 0, ty: 0 });
  };

  return (
    <div 
      className={styles.cardWrap}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={cardRef} 
        className={styles.card}
        style={{
          transform: `rotateX(${rotation.rx}deg) rotateY(${rotation.ry}deg)`
        }}
      >
        <div 
          className={styles.cardBg} 
          style={{ 
            backgroundImage: `url(${image})`,
            transform: `translateX(${bgPosition.tx}px) translateY(${bgPosition.ty}px)`
          }} 
        />
        <div className={styles.cardInfo}>
          <h3 className={styles.title}>{name}</h3>
          <p className={styles.desc}>{desc}</p>
          <div className={styles.price}>{price}</div>
        </div>
      </div>
    </div>
  );
}
