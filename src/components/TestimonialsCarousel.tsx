'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ReviewCard from './ReviewCard';
import styles from './TestimonialsCarousel.module.css';

interface Review {
  name: string;
  date: string;
  text: string;
}

interface TestimonialsCarouselProps {
  reviews: Review[];
}

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    const updateItemsToShow = () => {
      setItemsToShow(window.innerWidth <= 768 ? 1 : 3);
    };
    
    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    return () => window.removeEventListener('resize', updateItemsToShow);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Calculate translate percentage
  const translateValue = itemsToShow === 1 
    ? -(currentIndex * 100) 
    : -(currentIndex * (100 / itemsToShow));

  return (
    <div className={styles.carouselContainer}>
      <button className={`${styles.navButton} ${styles.prevButton}`} onClick={prevSlide} aria-label="Anterior">
        <ChevronLeft size={24} />
      </button>

      <div className={styles.trackWrapper}>
        <div 
          className={styles.track}
          style={{ 
            transform: `translateX(${translateValue}%)`,
          }}
        >
          {reviews.map((review, idx) => (
            <div key={idx} style={{ flex: itemsToShow === 1 ? '0 0 100%' : '0 0 33.333%' }}>
              <ReviewCard {...review} />
            </div>
          ))}
        </div>
      </div>

      <button className={`${styles.navButton} ${styles.nextButton}`} onClick={nextSlide} aria-label="Próximo">
        <ChevronRight size={24} />
      </button>

      <div className={styles.indicators}>
        {reviews.map((_, idx) => (
          <div 
            key={idx} 
            className={`${styles.dot} ${currentIndex === idx ? styles.dotActive : ''}`}
            onClick={() => goToSlide(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
