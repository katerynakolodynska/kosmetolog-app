import React from 'react';
import s from './WeekDays.module.css';
import { useTranslation } from 'react-i18next';
import { isSameDay, isBefore, format, startOfDay, parse, isAfter } from 'date-fns';

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
  const now = new Date();

  return (
    <div className={s.week}>
      {weekDays.map((date, idx) => {
        const dayIndex = date.getDay();
        const dateStr = format(date, 'yyyy-MM-dd');
        const label = t(`weekdays.${weekdaysKeys[dayIndex]}`);
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}`;

        const isSunday = dayIndex === 0;

        const isPast = isBefore(startOfDay(date), startOfDay(now));

        let isDisabled = isSunday || isPast;

        if (!isDisabled && isSameDay(date, now)) {
          const hasFutureTime = availableTimes.some((time) => {
            const [hour, minute] = time.split(':').map(Number);
            const futureTime = new Date(date);
            futureTime.setHours(hour, minute, 0, 0);
            return futureTime.getTime() > now.getTime();
          });

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
