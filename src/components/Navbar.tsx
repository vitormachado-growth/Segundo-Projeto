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
  Menu,
  X
} from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
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
        <button className={styles.mobileMenuBtn} onClick={toggleMenu}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>

    {/* Mobile Menu Overlay */}
    <div className={`${styles.mobileOverlay} ${menuOpen ? styles.mobileOverlayOpen : ''}`}>
      <div className={styles.mobileMenuContent}>
        <Link href="/" className={styles.mobileLink} onClick={toggleMenu}>
          <Home size={24} /> Início
        </Link>
        <Link href="#about" className={styles.mobileLink} onClick={toggleMenu}>
          <Info size={24} /> Sobre
        </Link>
        <Link href="/servicos" className={styles.mobileLink} onClick={toggleMenu}>
          <Scissors size={24} /> Serviços
        </Link>
        <Link href="/clube" className={styles.mobileLink} onClick={toggleMenu}>
          <Crown size={24} /> Clube
        </Link>
        <Link href="/login" className={styles.mobileLink} onClick={toggleMenu}>
          <Calendar size={24} /> Agendar
        </Link>
        <Link href="#units" className={styles.mobileLink} onClick={toggleMenu}>
          <MapPin size={24} /> Unidades
        </Link>
      </div>
    </div>
    </>
  );
};

export default Navbar;
