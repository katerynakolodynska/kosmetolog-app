import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FaMapMarkerAlt } from 'react-icons/fa';
import s from './HeroSection.module.css';

import Button from '../Button/Button';
import { fetchHero } from '../../redux/hero/heroOperations';
import { selectHeroData, selectHeroLoading } from '../../redux/hero/heroSelectors';
import { fetchContact } from '../../redux/contact/contactOperation';
import { selectContactInfo, selectContactLoading } from '../../redux/contact/contactSelectors';

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const lang = i18n.language;

  const hero = useSelector(selectHeroData);
  const heroLoading = useSelector(selectHeroLoading);

  const contact = useSelector(selectContactInfo);
  const contactLoading = useSelector(selectContactLoading);

  useEffect(() => {
    dispatch(fetchHero());
    dispatch(fetchContact());
  }, [dispatch]);

  if (heroLoading || contactLoading || !hero || !contact) return null;

  return (
    <section className={s.hero}>
      <div className={s.content}>
        <h2>{t('welcome')}</h2>
        <p>{hero.introText?.[lang]}</p>

        <p className={s.infoBlock}>
          <span className={s.label}>
            <FaMapMarkerAlt />
            {t('address')}:
          </span>
          <a href={contact.mapsLink} target="_blank" rel="noopener noreferrer">
            {contact.address}
          </a>
        </p>

        <h2>{t('boss')}</h2>
        <p>{hero.aboutText?.[lang]}</p>

        <p className={s.ownerText}>{hero.specialistIntro?.[lang]}</p>

        <Button />
      </div>

      <div className={s.imageBlock}>
        {hero.images.map((img, idx) => (
          <img key={idx} src={img.url} alt={`salon-${idx}`} className={s.image} />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
