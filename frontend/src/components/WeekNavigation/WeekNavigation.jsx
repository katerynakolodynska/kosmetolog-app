import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './WeekNavigation.module.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const WeekNavigation = ({ currentWeekStart, onPrevWeek, onNextWeek }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.weekHeader}>
      <button onClick={onPrevWeek} className={styles.weekNav} type="button">
        <FaArrowLeft />
      </button>
      <span>
        {t('weekOf')} {currentWeekStart.toLocaleDateString()}
      </span>
      <button onClick={onNextWeek} className={styles.weekNav} type="button">
        <FaArrowRight />
      </button>
    </div>
  );
};

export default WeekNavigation;
