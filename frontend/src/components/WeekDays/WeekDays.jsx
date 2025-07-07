import React from 'react';
import s from './WeekDays.module.css';
import { useTranslation } from 'react-i18next';
import { isSameDay, isBefore, format, startOfDay } from 'date-fns';
import { isSalonOpen } from '../../utils/isSalonOpen';
import { getSpecialistStatus } from '../../utils/getSpecialistStatus';

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

  const isSpecialistUnavailable = (date) => {
    if (!specialist) return false;

    const day = new Date(date);
    const vacation = specialist.vacation;
    const sickLeave = specialist.sickLeave;

    const onVacation =
      vacation?.isOnVacation &&
      vacation.from &&
      vacation.to &&
      day >= new Date(vacation.from) &&
      day <= new Date(vacation.to);

    const onSickLeave =
      sickLeave?.isOnSickLeave &&
      sickLeave.from &&
      sickLeave.to &&
      day >= new Date(sickLeave.from) &&
      day <= new Date(sickLeave.to);

    return !specialist.isActive || onVacation || onSickLeave;
  };

  return (
    <div className={s.week}>
      {weekDays.map((date, idx) => {
        const dayIndex = date.getDay();
        const dateStr = format(date, 'yyyy-MM-dd');
        const label = t(`weekdays.${weekdaysKeys[dayIndex]}`);
        const formattedDate = format(date, 'dd.MM');

        const isPast = isBefore(startOfDay(date), startOfDay(now));
        const salonClosed = !isSalonOpen(date, contact);
        const specUnavailable = isSpecialistUnavailable(date);

        let isDisabled = isPast || salonClosed || specUnavailable;

        if (!isDisabled && isSameDay(date, now)) {
          const hasFutureTime = availableTimes.some((time) => {
            const [hour, minute] = time.split(':').map(Number);
            const testTime = new Date(date);
            testTime.setHours(hour, minute, 0, 0);
            return testTime > now;
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
