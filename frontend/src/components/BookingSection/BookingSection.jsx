import React, { useCallback, useEffect, useState } from 'react';
import s from './BookingSection.module.css';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { allServices } from '../servicesData';
import BookingForm from '../BookingForm/BookingForm';
import WeekNavigation from '../WeekNavigation/WeekNavigation';
import TimeSelector from '../TimeSelctor/TimeSelctor';
import WeekDays from '../WeekDays/WeekDays';

const BookingSection = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedService = queryParams.get('service');
  const [selectedService, setSelectedService] = useState(preselectedService || '');

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+48 ');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const todayOnlyDate = new Date();
  todayOnlyDate.setHours(0, 0, 0, 0);

  const generateTimes = useCallback(() => {
    const times = [];
    for (let h = 9; h <= 17; h++) {
      const hour = String(h).padStart(2, '0');
      times.push(`${hour}:00`);
    }
    return times;
  }, []);

  const weekdaysKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const startOfWeek = new Date();
    const day = startOfWeek.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  });

  const getWeekDays = useCallback((startDate) => {
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  }, []);

  const weekDays = getWeekDays(currentWeekStart);

  const nextWeek = useCallback(() => {
    setCurrentWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 7);
      return next;
    });
  }, []);

  const prevWeek = useCallback(() => {
    setCurrentWeekStart((prev) => {
      const tempToday = new Date();
      tempToday.setHours(0, 0, 0, 0);

      const todayMonday = new Date(tempToday);
      const todayDay = tempToday.getDay();
      todayMonday.setDate(tempToday.getDate() - (todayDay === 0 ? 6 : todayDay - 1));
      todayMonday.setHours(0, 0, 0, 0);

      const prevWeekDate = new Date(prev);
      prevWeekDate.setDate(prev.getDate() - 7);

      if (prevWeekDate.getTime() < todayMonday.getTime()) {
        return prev;
      }
      return prevWeekDate;
    });
  }, []);

  const parseDateString = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  useEffect(() => {
    setAvailableTimes(generateTimes());
  }, [generateTimes]);
  console.log(selectedDate, availableTimes);

  const formatPhoneNumber = (value) => {
    let cleanedValue = value.replace(/\D/g, '');

    if (!cleanedValue.startsWith('48') || cleanedValue.length < 2) {
      cleanedValue = '48';
    }

    if (cleanedValue.length > 11) {
      cleanedValue = cleanedValue.substring(0, 11);
    }

    if (cleanedValue.length > 2) {
      const nationalNumber = cleanedValue.substring(2);
      let parts = [];
      for (let i = 0; i < nationalNumber.length; i += 3) {
        parts.push(nationalNumber.substring(i, i + 3));
      }
      return `+48 ${parts.join('-')}`;
    }

    return `+${cleanedValue}`;
  };

  const handlePhoneChange = (e) => {
    const inputValue = e.target.value;

    if (!inputValue.startsWith('+48 ')) {
      setPhoneNumber('+48 ');
      return;
    }

    const newPhoneNumber = formatPhoneNumber(inputValue);
    setPhoneNumber(newPhoneNumber);
    setFormError('');
  };

  const handlePhoneKeyDown = (e) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (e.target.selectionStart <= 4) {
        e.preventDefault();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    const service = allServices.find((s) => s.titleKey === selectedService);

    if (!selectedService || !selectedDate || !selectedTime || !name) {
      setFormError(t('pleaseFillAllRequiredFields'));
      return;
    }

    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
    if (cleanedPhoneNumber.length !== 11) {
      setFormError(t('pleaseEnterValidPhoneNumber'));
      return;
    }

    console.log(
      `Booking:\n- ${t(`servicesList.${service.titleKey}.title`)}\n- Date: ${selectedDate}\n- Time: ${selectedTime}\n- Name: ${name}\n- Phone: ${phoneNumber}`
    );

    setSuccessMessage(t('bookingConfirmedSuccess'));

    setSelectedService('');
    setSelectedDate(null);
    setSelectedTime('');
    setName('');
    setPhoneNumber('+48 ');
  };

  return (
    <section className={s.booking}>
      <h2>{t('booking')}</h2>

      <BookingForm
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        name={name}
        setName={setName}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        handlePhoneChange={handlePhoneChange}
        handlePhoneKeyDown={handlePhoneKeyDown}
        handleSubmit={handleSubmit}
        formError={formError}
        successMessage={successMessage}
      />

      <WeekNavigation currentWeekStart={currentWeekStart} onPrevWeek={prevWeek} onNextWeek={nextWeek} />

      <WeekDays
        weekDays={weekDays}
        todayOnlyDate={todayOnlyDate}
        availableTimes={availableTimes}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setSelectedTime={setSelectedTime}
        setFormError={setFormError}
      />

      {selectedDate && (
        <TimeSelector
          selectedDateObj={selectedDate}
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
