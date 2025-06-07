import React from 'react';
import s from './TimeSelctor.module.css';
import { useTranslation } from 'react-i18next';
import { parse, isAfter, isSameDay } from 'date-fns';

const TimeSelector = ({ selectedDate, availableTimes, selectedTime, setSelectedTime, setFormError }) => {
  const { t } = useTranslation();
  if (!selectedDate) return null;

  const now = new Date();
  const selectedDateObj = new Date(selectedDate); // Без парсингу часу

  return (
    <div className={s.timeSelect}>
      <h4>{t('selectTime')}</h4>
      <div className={s.timeGrid}>
        {availableTimes.map((time) => {
          const [hour, minute] = time.split(':').map(Number);
          const bookingTime = new Date(selectedDateObj);
          bookingTime.setHours(hour, minute, 0, 0);

          const isTodaySelected = isSameDay(selectedDateObj, now);
          const isDisabled = isTodaySelected ? bookingTime.getTime() <= now.getTime() : false;

          return (
            <button
              key={time}
              disabled={isDisabled}
              className={`${s.timeBtn} ${selectedTime === time ? s.selectedTime : ''}`}
              onClick={() => {
                setSelectedTime(time);
                setFormError('');
              }}
              type="button"
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSelector;
