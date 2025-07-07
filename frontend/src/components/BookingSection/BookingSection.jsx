import React, { useCallback, useEffect, useState } from 'react';
import { format, addDays, startOfWeek, isBefore } from 'date-fns';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import s from './BookingSection.module.css';
import BookingForm from '../BookingForm/BookingForm';
import WeekNavigation from '../WeekNavigation/WeekNavigation';
import TimeSelector from '../TimeSelctor/TimeSelctor';
import WeekDays from '../WeekDays/WeekDays';
import { usePhoneInput } from '../../hooks/usePhoneInput';

import { createBooking } from '../../redux/bookings/bookingsOperations';
import { getAllServices } from '../../redux/services/servicesOperations';
import { getAllSpecialists } from '../../redux/specialists/specialistsOperations';
import { selectServices } from '../../redux/services/servicesSelectors';
import { selectSpecialists } from '../../redux/specialists/specialistsSelectors';
import { fetchBusyTimes } from '../../api/busyTimesApi';
import { fetchContact } from '../../redux/contact/contactOperation';
import { selectContactInfo } from '../../redux/contact/contactSelectors';

const generateTimes = () => {
  const times = [];
  for (let h = 9; h <= 18; h++) {
    times.push(`${String(h).padStart(2, '0')}:00`);
  }
  return times;
};

const getInitialWeekStart = () => {
  const now = new Date();
  const todayDay = now.getDay();
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
  const dispatch = useDispatch();

  const queryParams = new URLSearchParams(location.search);
  const preselectedService = queryParams.get('service');

  const services = useSelector(selectServices);
  const specialists = useSelector(selectSpecialists);
  const contact = useSelector(selectContactInfo);

  const [selectedService, setSelectedService] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [busyTimes, setBusyTimes] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(getInitialWeekStart);

  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [phone, handlePhoneChange, setPhone] = usePhoneInput('+48');

  useEffect(() => {
    if (preselectedService && services.length > 0) {
      const exists = services.find((s) => s._id === preselectedService);
      if (exists) {
        setSelectedService(preselectedService);
      }
    }
  }, [preselectedService, services]);

  useEffect(() => {
    dispatch(getAllServices());
    dispatch(getAllSpecialists());
    dispatch(fetchContact());
    setAvailableTimes(generateTimes());
  }, [dispatch]);

  const getWeekDays = useCallback((startDate) => {
    return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  }, []);
  const weekDays = getWeekDays(currentWeekStart);

  const nextWeek = () => setCurrentWeekStart((prev) => addDays(prev, 7));
  const prevWeek = () => {
    const today = new Date();
    const prev = addDays(currentWeekStart, -7);
    if (!isBefore(prev, startOfWeek(today, { weekStartsOn: 1 }))) {
      setCurrentWeekStart(prev);
    }
  };

  useEffect(() => {
    const loadBusyTimes = async () => {
      if (selectedDate) {
        try {
          const times = await fetchBusyTimes(selectedDate);
          setBusyTimes(times);
        } catch (err) {
          console.error('Помилка завантаження зайнятих годин:', err);
        }
      }
    };
    loadBusyTimes();
  }, [selectedDate]);

  const getDisabledTimes = () => {
    const service = services.find((s) => String(s._id) === String(selectedService));
    const category = service?.category;
    const availableSpecs = specialists.filter((s) => s.categories.includes(category));

    return availableTimes.filter((time) => {
      const busyAtTime = busyTimes.filter((b) => b.time === time);
      return busyAtTime.length >= availableSpecs.length;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!selectedService || !selectedDate || !selectedTime || !name || !phone) {
      setFormError(t('pleaseFillAllRequiredFields'));
      return;
    }

    if (!/\+48 \d{3}-\d{3}-\d{3}/.test(phone)) {
      setFormError(t('pleaseEnterValidPhoneNumber'));
      return;
    }

    const body = {
      name,
      phone,
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      comment,
      specialistId: selectedSpecialist,
    };

    const res = await dispatch(createBooking(body));
    if (res.meta.requestStatus === 'rejected') {
      setFormError(res.payload || 'Błąd rezerwacji');
      return;
    }

    setSuccessMessage(t('bookingConfirmedSuccess'));
    setSelectedService('');
    setSelectedSpecialist('');
    setSelectedDate(null);
    setSelectedTime('');
    setName('');
    setPhone('+48 ');
    setComment('');
    setBusyTimes([]);
  };

  return (
    <section className={s.booking}>
      <h2>{t('booking')}</h2>

      <BookingForm
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        selectedSpecialist={selectedSpecialist}
        setSelectedSpecialist={setSelectedSpecialist}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
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
        services={services}
        specialists={specialists}
        bookings={busyTimes.map((b) => ({
          date: b.date,
          time: b.time,
          specialist: String(b.specialistId),
        }))}
      />

      <WeekNavigation currentWeekStart={currentWeekStart} onPrevWeek={prevWeek} onNextWeek={nextWeek} />
      <WeekDays
        weekDays={weekDays}
        availableTimes={availableTimes}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setSelectedTime={setSelectedTime}
        setFormError={setFormError}
        contact={contact}
        selectedSpecialist={selectedSpecialist}
        specialists={specialists}
      />
      {selectedDate && (
        <TimeSelector
          selectedDate={selectedDate}
          availableTimes={availableTimes}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          setFormError={setFormError}
          busyTimes={busyTimes}
          selectedSpecialist={selectedSpecialist}
          specialists={specialists}
          contact={contact}
        />
      )}
    </section>
  );
};

export default BookingSection;
