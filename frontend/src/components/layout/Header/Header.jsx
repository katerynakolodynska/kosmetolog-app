import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import s from './Header.module.css';
import { BsGlobe2 } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useClickOutside } from '../../../hooks/useClickOutside';

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

  useClickOutside(langRef, () => setShowLang(false), showLang);
  useClickOutside([navRef, burgerRef], () => setMenuOpen(false), menuOpen);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={s.header}>
      <div className={s.logo}>
        <img src="/app.svg" alt="Logo" className={s.logoIcon} />
        <span>Kosmetolog Nataliia</span>
      </div>
      <nav ref={navRef} className={`${s.nav} ${menuOpen ? s.open : ''}`}>
        <NavLink to="/" className={({ isActive }) => (isActive ? s.activeLink : s.link)}>
          {t('home')}
        </NavLink>
        <NavLink to="/services" className={({ isActive }) => (isActive ? s.activeLink : s.link)}>
          {t('services')}
        </NavLink>

        <NavLink to="/gallery" className={({ isActive }) => (isActive ? s.activeLink : s.link)}>
          {t('gallery')}
        </NavLink>
        <NavLink to="/opinion" className={({ isActive }) => (isActive ? s.activeLink : s.link)}>
          {t('opinie')}
        </NavLink>
        <NavLink to="/booking" className={({ isActive }) => (isActive ? s.activeLink : s.link)}>
          {t('booking')}
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
