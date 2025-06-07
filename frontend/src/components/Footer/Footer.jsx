import React from 'react';
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTelegramPlane,
  FaWhatsapp,
  FaViber,
  FaFacebookF,
  FaInstagram,
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import s from './Footer.module.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  const destination = encodeURIComponent('Al. Jerozolimskie 54, 00-024 Warsaw');
  const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

  return (
    <footer className={s.footer}>
      <div className={s.footerGrid}>
        <div className={s.left}>
          <nav className={s.navLinks}>
            <Link to="/">{t('home')}</Link>
            <Link to="/services">{t('services')}</Link>
            <Link to="/gallery">{t('gallery')}</Link>
            <Link to="/booking">{t('booking')}</Link>
            <Link to="/opinion">{t('opinie')}</Link>
            <Link to="/contact">{t('contact')}</Link>
          </nav>
        </div>

        <div className={s.center}>
          <div className={s.contacts}>
            <p>
              <FaMapMarkerAlt /> {t('address')}:{' '}
              <a href={mapsLink} target="_blank" rel="noopener noreferrer">
                Al. Jerozolimskie 54, 00-024 Warszawa
              </a>
            </p>
            <p>
              <FaPhone /> {t('phone')}: <a href="tel:+48123456789">+48 123 456 789</a>
            </p>
            <p>
              <FaEnvelope /> Email: <a href="mailto:beauty@example.com">beauty@example.com</a>
            </p>
          </div>
        </div>

        <div className={s.right}>
          <div className={s.logo}>Kosmetolog Nataliia</div>

          <div className={s.socials}>
            <a href="https://t.me/fakecosmetolog" target="_blank" rel="noreferrer">
              <FaTelegramPlane />
            </a>
            <a href="https://wa.me/48123456789" target="_blank" rel="noreferrer">
              <FaWhatsapp />
            </a>
            <a href="viber://chat?number=%2B48123456789" target="_blank" rel="noreferrer">
              <FaViber />
            </a>
            <a href="https://instagram.com/fakecosmetolog" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
            <a href="https://facebook.com/fakecosmetolog" target="_blank" rel="noreferrer">
              <FaFacebookF />
            </a>
          </div>
        </div>
      </div>

      <div className={s.bottom}>
        <p>
          &copy; {new Date().getFullYear()} Kosmetolog Nataliia. {t('allRightsReserved') || 'All rights reserved'}.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
