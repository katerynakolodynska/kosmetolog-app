import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import kosmetolog from '../../../public/image/kosmetolog/kosmetolog6.jpeg';
import kosmetolog1 from '../../../public/image/kosmetolog/kosmetolog1.jpg';
import kosmetolog2 from '../../../public/image/kosmetolog/kosmetolog2.jpeg';
import kosmetolog3 from '../../../public/image/kosmetolog/kosmetolog3.jpeg';

import s from './AboutOwner.module.css';

const AboutOwner = () => {
  const { t } = useTranslation();
  const [expandedCard, setExpandedCard] = useState(null);
  const cardRefs = useRef([]);

  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const specialists = [
    { img: kosmetolog, text: t('specialist1') },
    { img: kosmetolog1, text: t('specialist2') },
    { img: kosmetolog2, text: t('specialist3') },
    { img: kosmetolog3, text: t('specialist4') },
  ];

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
    <section className={s.ownerSection}>
      <h2>{t('aboutTitle')}</h2>
      <p className={s.ownerText}>{t('specialistIntro')}</p>

      <div className={s.gallery}>
        {specialists.map((item, index) => (
          <div className={s.specialistCard} key={index} ref={(el) => (cardRefs.current[index] = el)}>
            <div className={s.cardContent}>
              {expandedCard === index ? (
                <p className={s.text}>{item.text}</p>
              ) : (
                <img src={item.img} alt={`specialist-${index}`} />
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
