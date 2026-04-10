'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Home, 
  Info, 
  Scissors, 
  Calendar, 
  Crown, 
  MapPin, 
  Menu 
} from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbarContainer} ${scrolled ? styles.navbarScrolled : ''}`}>
      <div className={styles.navPill}>
        {/* Left Links */}
        <div className={`${styles.navGroup} ${styles.leftGroup}`}>
          <Link href="/" className={styles.navLink}>
            <Home />
            <span>Início</span>
          </Link>
          <Link href="#about" className={styles.navLink}>
            <Info />
            <span>Sobre</span>
          </Link>
          <Link href="#pricing" className={styles.navLink}>
            <Scissors />
            <span>Serviços</span>
          </Link>
        </div>

        {/* Central Logo */}
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoCircle}>
              <img 
                src="/vts-barber-logo.jpg" 
                alt="VT'S BARBER" 
                className={styles.logoImg} 
              />
            </div>
          </Link>
        </div>

        {/* Right Links */}
        <div className={`${styles.navGroup} ${styles.rightGroup}`}>
          <Link href="/login" className={styles.navLink}>
            <Calendar />
            <span>Agendar</span>
          </Link>
          <Link href="/clube" className={styles.navLink}>
            <Crown />
            <span>Clube</span>
          </Link>
          <Link href="#units" className={styles.navLink}>
            <MapPin />
            <span>Unidades</span>
          </Link>
        </div>

        {/* Mobile Menu Button (Only visible on small screens) */}
        <button className={styles.mobileMenuBtn}>
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
