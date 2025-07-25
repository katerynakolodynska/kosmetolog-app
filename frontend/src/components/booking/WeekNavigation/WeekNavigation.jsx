import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { format, addDays } from 'date-fns';
import { uk, pl, enUS } from 'date-fns/locale';
import s from './WeekNavigation.module.css';

const localeMap = { uk, pl, en: enUS, enUS }; // запасні ключі

const WeekNavigation = ({ currentWeekStart, onPrevWeek, onNextWeek }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const locale = localeMap[lang] || enUS;

  const start = currentWeekStart;
  const end = addDays(start, 6);

  const formattedRange = `${format(start, 'dd', { locale })}-${format(end, 'dd MMMM yyyy', { locale })}`;

  return (
    <div className={s.weekHeader}>
      <button onClick={onPrevWeek} className={s.weekNav} type="button" aria-label={t('previousWeek')}>
        <FaArrowLeft />
      </button>

      <span className={s.weekText}>
        {t('weekOf')} {formattedRange}
      </span>

      <button onClick={onNextWeek} className={s.weekNav} type="button" aria-label={t('nextWeek')}>
        <FaArrowRight />
      </button>
    </div>
  );
};

export default WeekNavigation;
