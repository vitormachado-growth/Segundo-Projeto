'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './ScrollReveal.module.css';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-in';
  delay?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  animation = 'fade-up', 
  delay = 0 
}) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only trigger once
        if (entry.isIntersecting) {
          setTimeout(() => setIntersecting(true), delay);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.15, // Trigger when 15% of the element is visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  let animClass = styles.fadeUp;
  if (animation === 'fade-in') animClass = styles.fadeIn;

  return (
    <div
      ref={ref}
      className={`${styles.revealBase} ${animClass} ${isIntersecting ? styles.revealed : ''}`}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
