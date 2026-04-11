'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  Home, 
  Info, 
  Scissors, 
  Calendar, 
  Crown, 
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Check current auth status
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    setMenuOpen(false);
  };

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
          <Link href={pathname === '/' ? '#about' : '/#about'} className={styles.navLink} scroll={true}>
            <Info />
            <span>Sobre</span>
          </Link>
          <Link href="/servicos" className={styles.navLink}>
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
          <Link href="/agendar" className={styles.navLink}>
            <Calendar />
            <span>Agendar</span>
          </Link>
          <Link href="/clube" className={styles.navLink}>
            <Crown />
            <span>Clube</span>
          </Link>
          
          {user ? (
            <button onClick={handleLogout} className={`${styles.navLink} ${styles.logoutLink}`}>
              <LogOut />
              <span>Sair</span>
            </button>
          ) : (
            <Link href="/dashboard" className={styles.navLink}>
              <User />
              <span>Entrar</span>
            </Link>
          )}
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
        <Link href={pathname === '/' ? '#about' : '/#about'} className={styles.mobileLink} onClick={toggleMenu} scroll={true}>
          <Info size={24} /> Sobre
        </Link>
        <Link href="/servicos" className={styles.mobileLink} onClick={toggleMenu}>
          <Scissors size={24} /> Serviços
        </Link>
        <Link href="/clube" className={styles.mobileLink} onClick={toggleMenu}>
          <Crown size={24} /> Clube
        </Link>
        <Link href="/agendar" className={styles.mobileLink} onClick={toggleMenu}>
          <Calendar size={24} /> Agendar
        </Link>
        
        {user ? (
          <button onClick={handleLogout} className={`${styles.mobileLink} ${styles.mobileLogout}`}>
            <LogOut size={24} /> Sair Conta
          </button>
        ) : (
          <Link href="/login" className={styles.mobileLink} onClick={toggleMenu}>
            <User size={24} /> Entrar / Registrar
          </Link>
        )}
      </div>
    </div>
    </>
  );
};

export default Navbar;
