import React from 'react';
import s from './TimeSelctor.module.css';
import { useTranslation } from 'react-i18next';

const TimeSelector = ({ selectedDate, availableTimes, selectedTime, setSelectedTime, setFormError }) => {
  const { t } = useTranslation();
  const now = new Date();

  const selectedDateObject = new Date(selectedDate + 'T00:00:00');
  const todayOnlyDate = new Date();
  todayOnlyDate.setHours(0, 0, 0, 0);

  const isSelectedDateToday = selectedDateObject.getTime() === todayOnlyDate.getTime();

  return (
    <div className={s.timeSelect}>
      <h4>{t('selectTime')}</h4>
      <div className={s.timeGrid}>
        {availableTimes.map((time) => {
          const [hour, minute] = time.split(':').map(Number);

          const bookingTimeCandidate = new Date(selectedDateObject);
          bookingTimeCandidate.setHours(hour, minute, 0, 0);

          let isDisabled = false;

          if (isSelectedDateToday) {
            isDisabled = bookingTimeCandidate.getTime() <= now.getTime();
          }

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
