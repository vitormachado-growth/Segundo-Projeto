import React from 'react';
import { Star } from 'lucide-react';
import styles from './ReviewCard.module.css';

interface ReviewCardProps {
  name: string;
  text: string;
  date: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ name, text, date }) => {
  // Extract initials for the avatar (e.g., 'Wendell Henrique' -> 'WH')
  const getInitials = (fullName: string) => {
    const names = fullName.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {getInitials(name)}
        </div>
        <div className={styles.authorInfo}>
          <span className={styles.name}>{name}</span>
          <span className={styles.date}>{date}</span>
        </div>
      </div>
      
      <div className={styles.stars}>
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={18} className={styles.starIcon} />
        ))}
      </div>

      <p className={styles.text}>"{text}"</p>
    </div>
  );
};

export default ReviewCard;
