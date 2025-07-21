import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FaMapMarkerAlt } from 'react-icons/fa';
import s from './HeroSection.module.css';

import Button from '../../shared/Button/Button';
import { fetchHero } from '../../../redux/hero/heroOperations';
import { selectHeroData } from '../../../redux/hero/heroSelectors';
import { fetchContact } from '../../../redux/contact/contactOperation';
import { selectContactInfo } from '../../../redux/contact/contactSelectors';
import useIsMobile from '../../../hooks/useMobile';

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lang = i18n.language;
  const isMobile = useIsMobile();
  const hero = useSelector(selectHeroData);
  const contact = useSelector(selectContactInfo);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([dispatch(fetchHero()), dispatch(fetchContact())]);
      setIsLoaded(true);
    };
    loadData();
  }, [dispatch]);

  if (!isLoaded || !hero || !contact) return null;

  return (
    <section className={`${s.hero} container`}>
      <div className={s.content}>
        <h2>{t('welcome')}</h2>
        <p>{hero.introText?.[lang]}</p>

        {!isMobile && (
          <>
            <h2>{t('boss')}</h2>
            <p>{hero.aboutText?.[lang]}</p>
          </>
        )}
        <Button />
      </div>

      <div className={s.imageBlock}>
        {hero.images.slice(0, isMobile ? 2 : hero.images.length).map((img, idx) => (
          <img key={idx} src={img.url} alt={`salon-${idx}`} className={s.image} />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
