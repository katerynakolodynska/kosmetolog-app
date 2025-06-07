import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import s from './Header.module.css';
import { BsGlobe2 } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi';

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const langRef = useRef(null);
  const navRef = useRef(null);
  const burgerRef = useRef(null);

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setShowLang(false);
      }
      if (
        menuOpen &&
        navRef.current &&
        !navRef.current.contains(event.target) &&
        burgerRef.current &&
        !burgerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={s.header}>
      <div className={s.logo}>Kosmetolog Nataliia</div>
      <nav ref={navRef} className={`${s.nav} ${menuOpen ? s.open : ''}`}>
        <NavLink to="/" className={({ isActive }) => (isActive ? s.activeLink : s.link)}>
          {t('home')}
        </NavLink>
        <NavLink to="/services" className={({ isActive }) => (isActive ? s.activeLink : s.link)}>
          {t('services')}
        </NavLink>
        <NavLink to="/booking" className={({ isActive }) => (isActive ? s.activeLink : s.link)}>
          {t('booking')}
        </NavLink>
        <NavLink to="/gallery" className={({ isActive }) => (isActive ? s.activeLink : s.link)}>
          {t('gallery')}
        </NavLink>
        <NavLink to="/opinion" className={({ isActive }) => (isActive ? s.activeLink : s.link)}>
          {t('opinie')}
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => (isActive ? s.activeLink : s.link)}>
          {t('contact')}
        </NavLink>
      </nav>
      <div className={s.controls}>
        <div className={s.langContainer} ref={langRef}>
          <button onClick={() => setShowLang((prev) => !prev)} className={s.langToggle}>
            <BsGlobe2 className={showLang ? s.rotate : ''} />
          </button>
          {showLang && (
            <div className={s.langSwitcher}>
              <button onClick={() => changeLang('pl')}>Pl</button>
              <button onClick={() => changeLang('uk')}>Ua</button>
              <button onClick={() => changeLang('en')}>En</button>
            </div>
          )}
        </div>
        <button ref={burgerRef} className={s.burger} onClick={() => setMenuOpen((prev) => !prev)}>
          <GiHamburgerMenu className={s.burgerIcon} />
        </button>
      </div>
    </header>
  );
};

export default Header;
