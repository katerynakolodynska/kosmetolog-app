import React from 'react';
import s from './ContactSection.module.css';
import { FaPhone, FaEnvelope, FaInstagram, FaFacebookF, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Button from '../Button/Button';

const ContactSection = () => {
  const { t } = useTranslation();
  const destination = encodeURIComponent('Al. Jerozolimskie 54, 00-024 Warsaw');
  const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

  return (
    <section className={s.contactSection}>
      <h2 className={s.title}>{t('contact')}</h2>

      <div className={s.grid}>
        <div className={s.infoBlock}>
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
          <p>
            <FaInstagram />{' '}
            <a href="https://instagram.com/fakecosmetolog" target="_blank" rel="noreferrer">
              Instagram
            </a>
          </p>
          <p>
            <FaFacebookF />{' '}
            <a href="https://facebook.com/fakecosmetolog" target="_blank" rel="noreferrer">
              Facebook
            </a>
          </p>
          <p>
            <FaClock /> {t('hours')}: Пн–Пт 10:00–18:00
          </p>

          <div className={s.ctaWrapper}>
            <Button label={t('book')} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
