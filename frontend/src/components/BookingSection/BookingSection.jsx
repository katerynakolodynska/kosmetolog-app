import React, { useCallback, useEffect, useState } from 'react';
import { format, addDays, startOfWeek, isBefore, parse } from 'date-fns';

import s from './BookingSection.module.css';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { allServices } from '../servicesData';
import BookingForm from '../BookingForm/BookingForm';
import WeekNavigation from '../WeekNavigation/WeekNavigation';
import TimeSelector from '../TimeSelctor/TimeSelctor';
import WeekDays from '../WeekDays/WeekDays';
import { usePhoneInput } from '../../hooks/usePhoneInput';

const generateTimes = () => {
  const times = [];
  for (let h = 9; h <= 18; h++) {
    const hour = String(h).padStart(2, '0');
    times.push(`${hour}:00`);
  }
  return times;
};

const getInitialWeekStart = () => {
  const now = new Date();
  const todayDay = now.getDay(); // 6 = Saturday

  const futureTimes = generateTimes().filter((time) => {
    const [h, m] = time.split(':').map(Number);
    const t = new Date();
    t.setHours(h, m, 0, 0);
    return t > now;
  });

  const isSaturdayEvening = todayDay === 6 && futureTimes.length === 0;

  return isSaturdayEvening ? startOfWeek(addDays(now, 7), { weekStartsOn: 1 }) : startOfWeek(now, { weekStartsOn: 1 });
};

const BookingSection = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedService = queryParams.get('service');

  const [selectedService, setSelectedService] = useState(preselectedService || '');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  // const [phoneNumber, setPhoneNumber] = useState('+48 ');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentWeekStart, setCurrentWeekStart] = useState(getInitialWeekStart);
  const [comment, setComment] = useState('');
  const [phone, handlePhoneChange, setPhone] = usePhoneInput('+48');

  const getWeekDays = useCallback((startDate) => {
    return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  }, []);

  const weekDays = getWeekDays(currentWeekStart);

  const nextWeek = useCallback(() => {
    setCurrentWeekStart((prev) => addDays(prev, 7));
  }, []);

  const prevWeek = useCallback(() => {
    const today = new Date();
    const prev = addDays(currentWeekStart, -7);
    if (isBefore(prev, startOfWeek(today, { weekStartsOn: 1 }))) return;
    setCurrentWeekStart(prev);
  }, [currentWeekStart]);

  useEffect(() => {
    setAvailableTimes(generateTimes());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    // const service = allServices.find((s) => s.titleKey === selectedService);

    if (!selectedService || !selectedDate || !selectedTime || !name) {
      setFormError(t('pleaseFillAllRequiredFields'));
      return;
    }

    // const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
    if (!/^\+48 \d{3}-\d{3}-\d{3}$/.test(phoneNumber)) {
      setFormError(t('pleaseEnterValidPhoneNumber'));
      return;
    }

    setSuccessMessage(t('bookingConfirmedSuccess'));
    setSelectedService('');
    setSelectedDate(null);
    setSelectedTime('');
    setName('');
    setPhoneNumber('+48 ');
    setComment('');
  };

  return (
    <section className={s.booking}>
      <h2>{t('booking')}</h2>

      <BookingForm
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        name={name}
        setName={setName}
        phone={phone}
        setPhone={setPhone}
        comment={comment}
        setComment={setComment}
        handlePhoneChange={handlePhoneChange}
        handleSubmit={handleSubmit}
        formError={formError}
        successMessage={successMessage}
      />

      <WeekNavigation currentWeekStart={currentWeekStart} onPrevWeek={prevWeek} onNextWeek={nextWeek} />

      <WeekDays
        weekDays={weekDays}
        availableTimes={availableTimes}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setSelectedTime={setSelectedTime}
        setFormError={setFormError}
      />

      {selectedDate && (
        <TimeSelector
          selectedDate={selectedDate}
          availableTimes={availableTimes}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          setFormError={setFormError}
        />
      )}
    </section>
  );
};

export default BookingSection;
