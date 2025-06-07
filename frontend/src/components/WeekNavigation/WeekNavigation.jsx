import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './WeekNavigation.module.css';

const WeekNavigation = ({ currentWeekStart, onPrevWeek, onNextWeek }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.weekHeader}>
      <button onClick={onPrevWeek} className={styles.weekNav} type="button">
        &larr;
      </button>
      <span>
        {t('weekOf')} {currentWeekStart.toLocaleDateString()}
      </span>
      <button onClick={onNextWeek} className={styles.weekNav} type="button">
        &rarr;
      </button>
    </div>
  );
};

export default WeekNavigation;
