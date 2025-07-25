import React, { useRef, useEffect, useState } from 'react';
import s from './BookingForm.module.css';
import { useTranslation } from 'react-i18next';
import { isSpecialistUnavailableOnDate } from '../../../utils/specialistUtils';

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
  formError,
  successMessage,
  services = [],
  specialists = [],
  bookings = [],
  selectedDate,
  selectedTime,
  setFormError,
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

  useEffect(() => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    const selectedServiceObj = services.find((s) => String(s._id) === String(selectedService));
    const selectedCategory = selectedServiceObj?.category;

    const busyIds = new Set(
      bookings.filter((b) => b.date === selectedDate && b.time === selectedTime).map((b) => String(b.specialist))
    );

    const currentSpec = specialists.find((s) => String(s._id) === String(selectedSpecialist));
    const isCurrentUnavailable =
      !currentSpec || busyIds.has(String(currentSpec._id)) || isSpecialistUnavailableOnDate(currentSpec, selectedDate);

    if (!isCurrentUnavailable) return;

    const availableSpecialists = specialists.filter(
      (s) =>
        Array.isArray(s.categories) &&
        s.categories.includes(selectedCategory) &&
        !busyIds.has(String(s._id)) &&
        !isSpecialistUnavailableOnDate(s, selectedDate)
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

  const bookedIds = new Set(
    bookings.filter((b) => b.date === selectedDate && b.time === selectedTime).map((b) => String(b.specialist))
  );

  const handleSpecialistChange = (e) => {
    const chosenId = e.target.value;
    const spec = specialists.find((s) => String(s._id) === chosenId);

    const isBusy = bookedIds.has(chosenId);
    const isUnavailable = isSpecialistUnavailableOnDate(spec, selectedDate);

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
    <div className={s.form}>
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
          const isBusy = bookedIds.has(String(spec._id));
          const isUnavailable = isSpecialistUnavailableOnDate(spec, selectedDate);
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
        name="name"
        type="text"
        placeholder={t('yourNamePlaceholder')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label htmlFor="comment">{t('Comment')}</label>
      <textarea
        id="comment"
        name="comment"
        placeholder={t('Comment')}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

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

      <div className={s.telegramBox}>
        <p>{t('wantTelegramNotifications')}</p>
        <a href="https://t.me/nataliia_salon_bot" target="_blank" rel="noopener noreferrer">
          {t('subscribeInTelegram')}
        </a>
      </div>
    </div>
  );
};

export default BookingForm;
