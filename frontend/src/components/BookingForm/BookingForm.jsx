import React, { useRef, useEffect } from 'react';
import s from './BookingForm.module.css';
import { useTranslation } from 'react-i18next';
import { allServices } from '../servicesData';
import Button from '../Button/Button';

const BookingForm = ({
  selectedService,
  setSelectedService,
  name,
  setName,
  phoneNumber,
  setPhoneNumber,
  handlePhoneChange,
  handlePhoneKeyDown,
  handleSubmit,
  formError,
  successMessage,
}) => {
  const { t } = useTranslation();
  const phoneInputRef = useRef(null);

  useEffect(() => {
    if (phoneInputRef.current) {
      phoneInputRef.current.setSelectionRange(phoneNumber.length, phoneNumber.length);
    }
  }, [phoneNumber]);

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      {formError && <div className={s.errorMessage}>{formError}</div>}
      {successMessage && <div className={s.successMessage}>{successMessage}</div>}

      <label htmlFor="serviceSelect">{t('selectService')}</label>
      <select
        id="serviceSelect"
        value={selectedService}
        onChange={(e) => {
          setSelectedService(e.target.value);
        }}
        required
      >
        <option value="">{t('selectServicePlaceholder') || t('selectService')}</option>
        {allServices.map((service) => (
          <option value={service.titleKey} key={service.titleKey}>
            {t(`servicesList.${service.titleKey}.title`)}
          </option>
        ))}
      </select>

      <label htmlFor="nameInput">{t('yourName')}</label>
      <input
        id="nameInput"
        type="text"
        placeholder={t('yourNamePlaceholder') || t('yourName')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label htmlFor="phoneInput">{t('yourPhone')}</label>
      <input
        ref={phoneInputRef}
        type="tel"
        id="phoneInput"
        name="phone"
        value={phoneNumber}
        onChange={handlePhoneChange}
        onKeyDown={handlePhoneKeyDown}
        placeholder="+48 123-456-789"
        required
        pattern="\+48 \d{3}-\d{3}-\d{3}"
        title={t('phonePatternTitle')}
      />
      <Button type="submit" label={t('confirm')} />
    </form>
  );
};

export default BookingForm;
