import React from 'react';
import s from './WeekDays.module.css';
import { useTranslation } from 'react-i18next';
import { isSameDay, isBefore, format, startOfDay } from 'date-fns';
import { isSalonOpen } from '../../../utils/isSalonOpen';
import { isSpecialistUnavailableOnDate } from '../../../utils/specialistUtils';

const weekdaysKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const WeekDays = ({
  weekDays,
  availableTimes,
  selectedDate,
  setSelectedDate,
  setSelectedTime,
  setFormError,
  contact,
  selectedSpecialist,
  specialists = [],
}) => {
  const { t } = useTranslation();
  const now = new Date();

  const specialist = specialists.find((s) => String(s._id) === String(selectedSpecialist));

  const isDayDisabled = (date) => {
    const isPast = isBefore(startOfDay(date), startOfDay(now));
    const isClosed = !isSalonOpen(date, contact);
    const isUnavailable = specialist ? isSpecialistUnavailableOnDate(specialist, date) : false;

    if (isPast || isClosed || isUnavailable) return true;

    if (isSameDay(date, now)) {
      return !availableTimes.some((time) => {
        const [hour, minute] = time.split(':').map(Number);
        const testTime = new Date(date);
        testTime.setHours(hour, minute, 0, 0);
        return testTime > now;
      });
    }

    return false;
  };

  return (
    <div className={s.week}>
      {weekDays.map((date, idx) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayIndex = date.getDay();
        const label = t(`weekdays.${weekdaysKeys[dayIndex]}`);
        const formatted = format(date, 'dd.MM');

        const isDisabled = isDayDisabled(date);

        return (
          <button
            key={idx}
            type="button"
            disabled={isDisabled}
            className={`${s.dateBtn} ${selectedDate === dateStr ? s.selectedDate : ''}`}
            onClick={() => {
              setSelectedDate(dateStr);
              setSelectedTime('');
              setFormError('');
            }}
          >
            <div className={s.weekday}>{label}</div>
            <div>{formatted}</div>
          </button>
        );
      })}
    </div>
  );
};

export default WeekDays;
