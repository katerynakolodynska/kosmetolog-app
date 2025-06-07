import React from 'react';
import s from './WeekDays.module.css';
import { useTranslation } from 'react-i18next';

const weekdaysKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const WeekDays = ({
  weekDays,
  todayOnlyDate,
  availableTimes,
  selectedDate,
  setSelectedDate,
  setSelectedTime,
  setFormError,
}) => {
  const { t } = useTranslation();

  return (
    <div className={s.week}>
      {weekDays.map((date, idx) => {
        const dateStr = date.toISOString().split('T')[0];
        const label = t(`weekdays.${weekdaysKeys[date.getDay()]}`);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const formattedDate = `${day}.${month}`;

        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        const isPastDate = date < todayOnlyDate;

        let isDisabled = isPastDate;

        if (isToday) {
          const hasFutureTime = availableTimes.some((time) => {
            const [h, m] = time.split(':').map(Number);
            const future = new Date(date);
            future.setHours(h, m, 0, 0);
            return future > now;
          });

          // якщо немає жодного часу в майбутньому, то блокуємо
          isDisabled = !hasFutureTime;
        }

        return (
          <button
            key={idx}
            className={`${s.dateBtn} ${selectedDate === dateStr ? s.selectedDate : ''}`}
            onClick={() => {
              setSelectedDate(dateStr);
              setFormError('');
              setSelectedTime('');
            }}
            disabled={isDisabled}
            type="button"
          >
            <div className={s.weekday}>{label}</div>
            <div>{formattedDate}</div>
          </button>
        );
      })}
    </div>
  );
};

export default WeekDays;
