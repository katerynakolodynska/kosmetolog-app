import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './WeekNavigation.module.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { format, addDays } from 'date-fns';
import { uk, pl, enUS } from 'date-fns/locale';

const WeekNavigation = ({ currentWeekStart, onPrevWeek, onNextWeek }) => {
  const { t, i18n } = useTranslation();

  const getFormattedWeekRange = () => {
    const localeMap = {
      uk: uk,
      pl: pl,
      en: enUS,
    };

    const lang = i18n.language;
    const locale = localeMap[lang] || enUS;

    const start = currentWeekStart;
    const end = addDays(start, 6);

    const startFormatted = format(start, 'dd', { locale });
    const endFormatted = format(end, 'dd MMMM yyyy', { locale });

    return `${startFormatted}–${endFormatted}`;
  };

  return (
    <div className={styles.weekHeader}>
      <button onClick={onPrevWeek} className={styles.weekNav} type="button">
        <FaArrowLeft />
      </button>
      <span className={styles.weekText}>
        {t('weekOf')} {getFormattedWeekRange()}
      </span>
      <button onClick={onNextWeek} className={styles.weekNav} type="button">
        <FaArrowRight />
      </button>
    </div>
  );
};

export default WeekNavigation;
