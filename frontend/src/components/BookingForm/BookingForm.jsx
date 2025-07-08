import React, { useRef, useEffect, useState } from 'react';
import s from './BookingForm.module.css';
import { useTranslation } from 'react-i18next';
import Button from '../Button/Button';

const BookingForm = ({
  selectedService,
  setSelectedService,
  selectedSpecialist,
  setSelectedSpecialist,
  name,
  setName,
  phone,
  setPhone,
  comment,
  setComment,
  handlePhoneChange,
  handleSubmit,
  formError,
  successMessage,
  services = [],
  specialists = [],
  bookings = [],
  selectedDate,
  selectedTime,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const phoneInputRef = useRef(null);
  const [busySpecialistWarning, setBusySpecialistWarning] = useState(false);

  useEffect(() => {
    if (phoneInputRef.current) {
      phoneInputRef.current.setSelectionRange(phone.length, phone.length);
    }
  }, [phone]);

  const isSpecialistUnavailable = (spec) => {
    const date = new Date(selectedDate);
    if (!spec?.isActive) return true;

    const { vacation, sickLeave } = spec;

    const isOnVacation =
      vacation?.isOnVacation &&
      vacation.from &&
      vacation.to &&
      date >= new Date(vacation.from) &&
      date <= new Date(vacation.to);

    const isOnSickLeave =
      sickLeave?.isOnSickLeave &&
      sickLeave.from &&
      sickLeave.to &&
      date >= new Date(sickLeave.from) &&
      date <= new Date(sickLeave.to);

    return isOnVacation || isOnSickLeave;
  };

  useEffect(() => {
    if (!selectedService || !selectedDate || !selectedTime || selectedSpecialist) return;

    const selectedServiceObj = services.find((s) => String(s._id) === String(selectedService));
    const selectedCategory = selectedServiceObj?.category;

    const busyIds = bookings
      .filter((b) => b.date === selectedDate && b.time === selectedTime)
      .map((b) => String(b.specialist));

    const availableSpecialists = specialists.filter(
      (s) =>
        Array.isArray(s.categories) &&
        s.categories.includes(selectedCategory) &&
        !busyIds.includes(String(s._id)) &&
        !isSpecialistUnavailable(s)
    );

    const freeSpecialist = availableSpecialists[0];
    if (freeSpecialist) {
      setSelectedSpecialist(freeSpecialist._id);
      setBusySpecialistWarning(false);
    } else {
      setSelectedSpecialist('');
      setBusySpecialistWarning(true);
    }
  }, [
    selectedService,
    selectedDate,
    selectedTime,
    selectedSpecialist,
    services,
    specialists,
    bookings,
    setSelectedSpecialist,
  ]);

  const selectedServiceObj = services.find((s) => String(s._id) === String(selectedService));
  const selectedCategory = selectedServiceObj?.category;

  const filteredSpecialists = selectedCategory
    ? specialists.filter((s) => Array.isArray(s.categories) && s.categories.includes(selectedCategory))
    : specialists;

  const bookedIds = bookings
    .filter((b) => b.date === selectedDate && b.time === selectedTime)
    .map((b) => String(b.specialist));

  const handleSpecialistChange = (e) => {
    const chosenId = e.target.value;
    const spec = specialists.find((s) => String(s._id) === chosenId);

    const isBusy = bookedIds.includes(chosenId);
    const isUnavailable = isSpecialistUnavailable(spec);

    if (isBusy || isUnavailable) {
      setFormError(t('specialistBusyPleaseChooseAnother'));
      setSelectedSpecialist('');
      setBusySpecialistWarning(true);
    } else {
      setSelectedSpecialist(chosenId);
      setFormError('');
      setBusySpecialistWarning(false);
    }
  };

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      {formError && <div className={s.errorMessage}>{formError}</div>}
      {successMessage && <div className={s.successMessage}>{successMessage}</div>}
      {busySpecialistWarning && <div className={s.warningMessage}>{t('selectedSpecialistIsBusy')}</div>}

      <label htmlFor="serviceSelect">{t('selectService')}</label>
      <select id="serviceSelect" value={selectedService} onChange={(e) => setSelectedService(e.target.value)} required>
        <option value="">{t('selectServicePlaceholder')}</option>
        {services.map((service) => (
          <option key={service._id} value={service._id}>
            {service.title?.[currentLang] || '—'}
          </option>
        ))}
      </select>

      <label htmlFor="specialistSelect">{t('selectSpecialistOptional')}</label>
      <select id="specialistSelect" value={selectedSpecialist} onChange={handleSpecialistChange}>
        <option value="">{t('anySpecialist')}</option>
        {filteredSpecialists.map((spec) => {
          const isBusy = bookedIds.includes(String(spec._id));
          const isUnavailable = isSpecialistUnavailable(spec);
          return (
            <option key={spec._id} value={spec._id} disabled={isBusy || isUnavailable}>
              {spec.name}
              {isBusy ? ` (${t('busy')})` : ''}
              {isUnavailable ? ` (${t('unavailable')})` : ''}
            </option>
          );
        })}
      </select>

      <label htmlFor="nameInput">{t('yourName')}</label>
      <input
        id="nameInput"
        type="text"
        placeholder={t('yourNamePlaceholder')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label htmlFor="comment">{t('Comment')}</label>
      <textarea id="comment" placeholder={t('Comment')} value={comment} onChange={(e) => setComment(e.target.value)} />

      <label htmlFor="phoneInput">{t('yourPhone')}</label>
      <input
        ref={phoneInputRef}
        type="tel"
        id="phoneInput"
        name="phone"
        value={phone}
        onChange={handlePhoneChange}
        placeholder="+48 123-456-789"
        required
        pattern="\+48 \d{3}-\d{3}-\d{3}"
        title={t('phonePatternTitle')}
      />

      {successMessage && (
        <div className={s.telegramBox}>
          <p>{t('wantTelegramNotifications') || 'Хочете отримувати сповіщення в Telegram?'}</p>
          <a
            href={`https://t.me/nataliia_salon_bot?start=${encodeURIComponent(phone)}`}
            rel="noopener noreferrer"
            target="_blank"
            className={s.telegramLink}
          >
            {t('subscribeInTelegram') || 'Підписатися в Telegram'}
          </a>
        </div>
      )}

      <Button type="submit" label={t('confirm')} />
    </form>
  );
};

export default BookingForm;
