import React from 'react';
import s from './TimeSelctor.module.css';
import { useTranslation } from 'react-i18next';
import { isSameDay, format } from 'date-fns';
import { isSalonOpen } from '../../../utils/isSalonOpen';
// import { isDuplicateBooking } from '../../../utils/isDuplicateBooking';

const TimeSelector = ({
  selectedDate,
  availableTimes,
  selectedTime,
  setSelectedTime,
  setFormError,
  busyTimes = [],
  selectedSpecialist,
  specialists = [],
  contact,
}) => {
  const { t } = useTranslation();
  if (!selectedDate) return null;

  const now = new Date();
  const selectedDateObj = new Date(selectedDate);

  const specialist = specialists.find((s) => String(s._id) === String(selectedSpecialist));

  const isSpecialistUnavailable = () => {
    if (!specialist) return false;
    const day = selectedDateObj;

    const vacation = specialist.vacation;
    const sickLeave = specialist.sickLeave;

    const isOnVacation =
      vacation?.isOnVacation &&
      vacation.from &&
      vacation.to &&
      day >= new Date(vacation.from) &&
      day <= new Date(vacation.to);

    const isOnSickLeave =
      sickLeave?.isOnSickLeave &&
      sickLeave.from &&
      sickLeave.to &&
      day >= new Date(sickLeave.from) &&
      day <= new Date(sickLeave.to);

    return !specialist.isActive || isOnVacation || isOnSickLeave;
  };

  return (
    <div className={s.timeSelect}>
      <h4>{t('selectTime')}</h4>
      <div className={s.timeGrid}>
        {availableTimes.map((time) => {
          const [hour, minute] = time.split(':').map(Number);
          const bookingTime = new Date(selectedDateObj);
          bookingTime.setHours(hour, minute, 0, 0);

          const isTodaySelected = isSameDay(selectedDateObj, now);
          const isPast = isTodaySelected && bookingTime <= now;

          const isBusy =
            Array.isArray(busyTimes) &&
            busyTimes.some(
              (b) =>
                typeof b === 'object' &&
                b.time === format(bookingTime, 'HH:mm') &&
                String(b.specialist) === String(selectedSpecialist)
            );

          const isSalonClosed = !isSalonOpen(selectedDateObj, contact, time);

          const isDisabled = isPast || isBusy || isSpecialistUnavailable() || isSalonClosed;

          return (
            <button
              key={time}
              disabled={isDisabled}
              className={`${s.timeBtn} ${selectedTime === time ? s.selectedTime : ''} ${isDisabled ? s.disabled : ''}`}
              onClick={() => {
                if (!isDisabled) {
                  setSelectedTime(time);
                  setFormError('');
                }
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
