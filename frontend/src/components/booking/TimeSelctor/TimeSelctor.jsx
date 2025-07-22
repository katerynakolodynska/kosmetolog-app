import React from 'react';
import s from './TimeSelctor.module.css';
import { useTranslation } from 'react-i18next';
import { isSameDay, format } from 'date-fns';
import { isSalonOpen } from '../../../utils/isSalonOpen';

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

  // нова функція перевірки: чи слот зайнятий, враховуючи occupiedSlots
  const isTimeTaken = (time) => {
    const currentSlot = new Date(`${selectedDate}T${time}`);

    return busyTimes.some((b) => {
      if (!b.time || !b.occupiedSlots || String(b.specialist) !== String(selectedSpecialist)) return false;

      const start = new Date(`${b.date}T${b.time}`);
      const end = new Date(start.getTime() + b.occupiedSlots * 60 * 60 * 1000);

      return currentSlot >= start && currentSlot < end;
    });
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

          const isBusy = isTimeTaken(time);
          const isSalonClosed = !isSalonOpen(selectedDateObj, contact, time);
          const isUnavailable = isSpecialistUnavailable();

          const isDisabled = isPast || isBusy || isUnavailable || isSalonClosed;

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
