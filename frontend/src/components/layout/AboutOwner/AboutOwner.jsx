import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { selectSpecialists } from '../../../redux/specialists/specialistsSelectors';

import { selectHeroData } from '../../../redux/hero/heroSelectors';

import s from './AboutOwner.module.css';

const AboutOwner = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const specialists = useSelector(selectSpecialists);
  const hero = useSelector(selectHeroData);

  const [expandedCard, setExpandedCard] = useState(null);
  const cardRefs = useRef([]);

  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        expandedCard !== null &&
        cardRefs.current[expandedCard] &&
        !cardRefs.current[expandedCard].contains(event.target)
      ) {
        setExpandedCard(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expandedCard]);

  return (
    <section className={`${s.ownerSection} container`}>
      <h2>{t('aboutTitle')}</h2>

      {hero?.specialistIntro?.[lang] && <p className={s.ownerText}>{hero.specialistIntro[lang]}</p>}

      <div className={s.gallery}>
        {specialists.map((spec, index) => (
          <div className={s.specialistCard} key={spec._id} ref={(el) => (cardRefs.current[index] = el)}>
            <div className={s.cardContent}>
              {expandedCard === index ? (
                <p className={s.text}>{spec.description?.[lang] || '—'}</p>
              ) : (
                <img src={spec.photo} alt={spec.name} loading="lazy" />
              )}
            </div>

            <div className={s.cardActions}>
              <button className={s.toggleBtn} onClick={() => toggleCard(index)}>
                {expandedCard === index ? t('collapse') : t('readMore')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutOwner;
