import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import s from './HeroSection.module.css';
import salonImage from '../../../public/image/salon/salon.webp';
import salonImage1 from '../../../public/image/salon/salon1.webp';
import salonImage4 from '../../../public/image/salon/salon4.avif';
import salonImage5 from '../../../public/image/salon/salon5.avif';
import Button from '../Button/Button';
import { FaMapMarkerAlt } from 'react-icons/fa';

const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const destination = encodeURIComponent('Al. Jerozolimskie 54, 00-024 Warsaw');
  const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

  return (
    <section className={s.hero}>
      <div className={s.content}>
        <h2>{t('welcome')}</h2>
        <p>{t('introText')}</p>
        <p className={s.infoBlock}>
          <span className={s.label}>
            <FaMapMarkerAlt />
            {t('address')}:
          </span>
          <a href={mapsLink} target="_blank" rel="noopener noreferrer">
            Al. Jerozolimskie 54, 00-024 Warszawa
          </a>
        </p>
        <h2>{t('boss')}</h2>
        <p>{t('aboutText')}</p>
        <Button />
      </div>
      <div className={s.imageBlock}>
        <img src={salonImage} alt="Salon" className={s.image} />
        <img src={salonImage1} alt="salon" className={s.image} />
        <img src={salonImage4} alt="salon" className={s.image} />
        <img src={salonImage5} alt="salon" className={s.image} />
      </div>
    </section>
  );
};

export default HeroSection;
